// src/utils/adaptiveExecPool.ts
//
// Drop-in replacement for a raw mysql2 pool, backed by Lenskart's Adaptive PAM
// CLI instead of a static credential/IP. There is no TCP tunnel available for
// these endpoints - `adaptive connect` hard-requires a real interactive
// terminal (confirmed: it fails outright on piped/non-tty stdin), so the only
// scriptable path is `adaptive exec <endpoint> -c "<sql>"`, a one-shot
// non-interactive call that pays a fresh Adaptive-broker auth handshake
// (~4s, measured) on every single invocation.
//
// Each `.execute()`/`.query()` call therefore becomes exactly one `adaptive
// exec` invocation. The one thing that's safe to fold for free is a pending
// `changeUser({database})` - it produces no data the caller inspects - so it
// rides along as a `USE `db`;` prefix on the next query instead of its own
// round trip. Multi-query call sites where a later query's parameters depend
// on an earlier query's result (e.g. tracer-pro) cannot be pre-batched, since
// the SQL text for query 2 isn't known until query 1's result comes back.
import mysqlPromise from "mysql2/promise";
import type { FieldPacket, Pool } from "mysql2/promise";
import { execFile } from "child_process";

const format = (
  mysqlPromise as unknown as {
    format: (sql: string, values?: unknown[]) => string;
  }
).format;

const ADAPTIVE_BIN = process.env.ADAPTIVE_BIN || "adaptive";
// Large read-only reports can spend more than 30 seconds producing and
// transporting the MySQL text table through Adaptive. Callers can still tune
// this per deployment, but the default must accommodate those report routes.
const EXEC_TIMEOUT_MS = Number(process.env.ADAPTIVE_EXEC_TIMEOUT_MS || 90_000);
const AUTH_WARNING_COOLDOWN_MS = 60_000;

// Best-effort heuristic - we have not observed a real expired-token message
// from `adaptive exec` (only successful runs), so this is inferred from the
// CLI's general error vocabulary, not confirmed against a real expiry.
const AUTH_FAILURE_PATTERN =
  /not logged in|login required|please\s+(run|use)\b.*login|invalid credentials|token\s+.*(expired|invalid|revoked)|unauthenticated|unauthorized|session\s+.*(expired|not found)/i;

const SQL_ERROR_PATTERN = /^ERROR\s+\d+\s*\(\w+\)/m;

type RowObject = Record<string, string | null>;

class AdaptiveAuthError extends Error {} // thrown, not caught here - the reauth log is the actionable signal

const lastAuthWarningAt = new Map<string, number>();

function warnAuthOnce(label: string, endpoint: string): void {
  const now = Date.now();
  const last = lastAuthWarningAt.get(label) ?? 0;
  if (now - last < AUTH_WARNING_COOLDOWN_MS) return;
  lastAuthWarningAt.set(label, now);
  console.error(
    `[${label}] Adaptive session for endpoint "${endpoint}" looks unauthenticated. ` +
      `Ask ARYA to reauthenticate the Adaptive token (adaptive login -u https://adaptive.lenskart.com).`
  );
}

function runExec(endpoint: string, sql: string, label: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      ADAPTIVE_BIN,
      ["exec", endpoint, "-c", sql],
      // Heavy inventory dumps can legitimately exceed the default child-process
      // buffer because Adaptive renders the full result as a MySQL text table.
      { timeout: EXEC_TIMEOUT_MS, maxBuffer: 256 * 1024 * 1024 },
      (err, stdout, stderr) => {
        const combined = `${stdout}\n${stderr}`;

        const sqlError = combined.match(/^ERROR.*$/m);
        if (sqlError && SQL_ERROR_PATTERN.test(sqlError[0])) {
          reject(new Error(sqlError[0]));
          return;
        }

        if (err) {
          if (AUTH_FAILURE_PATTERN.test(combined)) {
            warnAuthOnce(label, endpoint);
            reject(
              new AdaptiveAuthError(
                `[${label}] Adaptive auth appears to have expired for "${endpoint}" - ask ARYA to reauthenticate.`
              )
            );
            return;
          }
          const cause = err.killed
            ? `timed out after ${EXEC_TIMEOUT_MS}ms`
            : stderr.trim() || err.message;
          reject(new Error(`[${label}] adaptive exec failed for "${endpoint}": ${cause}`));
          return;
        }

        resolve(stdout);
      }
    );
  });
}

// Parses the mysql-client ASCII box table `adaptive exec` prints. A statement
// that returns zero rows prints nothing at all (confirmed), so empty output
// means "no rows", not an error.
function parseTable(output: string): RowObject[] {
  const trimmed = output.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const borderIdx: number[] = [];
  lines.forEach((line, i) => {
    if (/^\+[-+]+\+$/.test(line.trim())) borderIdx.push(i);
  });
  if (borderIdx.length < 2) return [];

  const headers = splitRow(lines[borderIdx[0] + 1]);
  const dataStart = borderIdx[1] + 1;
  const dataEnd = borderIdx.length >= 3 ? borderIdx[2] : lines.length;

  const rows: RowObject[] = [];
  for (let i = dataStart; i < dataEnd; i++) {
    const line = lines[i];
    if (!line || !line.trim().startsWith("|")) continue;
    const cells = splitRow(line);
    const row: RowObject = {};
    headers.forEach((h, idx) => {
      const v = cells[idx];
      row[h] = v === undefined || v === "NULL" ? null : v;
    });
    rows.push(row);
  }
  return rows;
}

function splitRow(line: string): string[] {
  const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

class AdaptiveConnection {
  currentDb: string | null = null;
  private released = false;
  private endpoint: string;
  private label: string;
  private releaseSlot: () => void;

  constructor(endpoint: string, label: string, releaseSlot: () => void) {
    this.endpoint = endpoint;
    this.label = label;
    this.releaseSlot = releaseSlot;
  }

  async changeUser(opts: { database: string }): Promise<void> {
    this.currentDb = opts.database;
  }

  async execute(sql: string, params?: unknown[]): Promise<[RowObject[], FieldPacket[]]> {
    return this.run(sql, params);
  }

  async query(sql: string, params?: unknown[]): Promise<[RowObject[], FieldPacket[]]> {
    return this.run(sql, params);
  }

  private async run(sql: string, params?: unknown[]): Promise<[RowObject[], FieldPacket[]]> {
    if (this.released) {
      throw new Error(`[${this.label}] query attempted on a released Adaptive connection`);
    }
    const formatted = format(sql, params ?? []);
    const full = this.currentDb
      ? "USE `" + this.currentDb + "`; " + formatted + ";"
      : formatted + ";";
    const output = await runExec(this.endpoint, full, this.label);
    return [parseTable(output), [] as FieldPacket[]];
  }

  release(): void {
    if (this.released) return;
    this.released = true;
    this.releaseSlot();
  }
}

class AdaptivePool {
  private available: number;
  private waiters: Array<() => void> = [];
  private endpoint: string;
  private label: string;

  constructor(endpoint: string, label: string, connectionLimit: number) {
    this.endpoint = endpoint;
    this.label = label;
    this.available = connectionLimit;
  }

  private async acquireSlot(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return;
    }
    await new Promise<void>((resolve) => this.waiters.push(resolve));
    this.available--;
  }

  private releaseSlot(): void {
    this.available++;
    const next = this.waiters.shift();
    if (next) next();
  }

  async getConnection(): Promise<AdaptiveConnection> {
    await this.acquireSlot();
    let releasedOnce = false;
    return new AdaptiveConnection(this.endpoint, this.label, () => {
      if (releasedOnce) return;
      releasedOnce = true;
      this.releaseSlot();
    });
  }

  async query(sql: string, params?: unknown[]): Promise<[RowObject[], FieldPacket[]]> {
    const conn = await this.getConnection();
    try {
      return await conn.execute(sql, params);
    } finally {
      conn.release();
    }
  }
}

export interface CreateNexsPoolOptions {
  /** Env var holding the Adaptive endpoint name, e.g. "mysql_ro_nexs-slave02.prod.internal". */
  adaptiveEndpointEnv: string;
  /** Env var holding the plain mysql2 URI, used when the Adaptive endpoint env var is unset (local dev). */
  fallbackUriEnv: string;
  /** Short label used in logs/errors. */
  label: string;
  connectionLimit: number;
}

export function createNexsPool(opts: CreateNexsPoolOptions): Pool {
  const endpoint = process.env[opts.adaptiveEndpointEnv];

  if (endpoint) {
    console.log(`[${opts.label}] Adaptive CLI bridge active -> endpoint "${endpoint}"`);
    return new AdaptivePool(endpoint, opts.label, opts.connectionLimit) as unknown as Pool;
  }

  const uri = process.env[opts.fallbackUriEnv];
  if (!uri) {
    throw new Error(
      `[${opts.label}] Neither ${opts.adaptiveEndpointEnv} nor ${opts.fallbackUriEnv} is set.`
    );
  }

  return mysqlPromise.createPool({
    uri,
    connectionLimit: opts.connectionLimit,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}
