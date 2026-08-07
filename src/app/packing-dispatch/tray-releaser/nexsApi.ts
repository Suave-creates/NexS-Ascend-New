// src/app/packing-dispatch/tray-releaser/nexsApi.ts
//
// Browser-side client for the live NexS app API — the webapp port of the
// extension's src/api.js + src/auth.js. These calls run in the USER'S BROWSER
// (client component) with credentials:'include', exactly like the extension, so
// they rely on the user being logged in to https://app.nexs.lenskart.com in
// another tab.
//
// IMPORTANT — cross-origin caveat: a content script could call the NexS origin
// freely; a normal page on the dashboard origin is subject to CORS + the session
// cookie's SameSite policy. If the browser blocks these requests, NexS would need
// permissive CORS (Access-Control-Allow-Origin for this origin + credentials) and
// a SameSite=None session cookie. If that's not the case, these two calls must be
// proxied through a backend with a service credential. The dump query already runs
// server-side (see /api/packing-dispatch/dump) and is unaffected.
//
// Dump loading (from our own backend, and CSV fallback) also lives here.

import { NEXS_CONFIG as cfg, type DumpOrder, type TrayRecord } from './config';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type FetchContext = { facility: string; workstation: string };

export type ReleaseResult = {
  trayId: string;
  ok: boolean;
  httpStatus?: number;
  metaStatus?: string | null;
  response?: unknown;
  error?: string;
};

/** Headers the fetchTrays/releaseTray endpoints expect (telemetry omitted). */
function buildHeaders(ctx: FetchContext): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'facility-code': ctx.facility || cfg.FACILITY_FALLBACK,
    'workstation-id': ctx.workstation || cfg.WORKSTATION_FALLBACK,
    'source-domain': cfg.SOURCE_DOMAIN,
  };
}

// ===========================================================================
// fetchTrays
// ===========================================================================

type Page = { records: TrayRecord[]; totalCount: number | null };

async function fetchPage(
  ctx: FetchContext,
  page: number,
  size: number,
  sortOrder: 'ASC' | 'DESC'
): Promise<Page> {
  const body = {
    sortBy: cfg.SORT_BY,
    sortOrder,
    filters: cfg.FILTERS,
    page,
    size,
  };

  const res = await fetch('/api/packing-dispatch/nexs-proxy/fetch-trays', {
    method: 'POST',
    headers: buildHeaders(ctx),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} on page ${page}`);
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Invalid JSON response on page ${page}`);
  }

  const status = json?.meta?.status;
  if (status !== 'Success') {
    const code = json?.meta?.messageCode;
    throw new Error(`API status "${status}" (code ${code}) on page ${page}`);
  }

  const inner = json?.data || {};
  const records: TrayRecord[] = Array.isArray(inner.data) ? inner.data : [];
  const totalCount = typeof inner.totalCount === 'number' ? inner.totalCount : null;
  return { records, totalCount };
}

async function fetchPageWithRetry(
  ctx: FetchContext,
  page: number,
  size: number,
  sortOrder: 'ASC' | 'DESC'
): Promise<Page> {
  let attempt = 0;
  for (;;) {
    try {
      return await fetchPage(ctx, page, size, sortOrder);
    } catch (err) {
      if (attempt >= cfg.MAX_RETRIES) throw err;
      const backoff = cfg.RETRY_BASE_MS * Math.pow(2, attempt);
      attempt += 1;
      await sleep(backoff);
    }
  }
}

export type FetchProgress = {
  fetched: number;
  total: number | null;
  page: number;
};

/**
 * Fetch the COMPLETE tray list, de-duped by DEDUPE_KEY. The server caps each
 * sort direction at ~1100 rows, so we fetch BOTH directions of a stable field
 * (createdAt) and union — ASC ∪ DESC == totalCount.
 */
export async function fetchAllTrays(
  ctx: FetchContext,
  onProgress?: (p: FetchProgress) => void
): Promise<{ records: TrayRecord[]; totalCount: number | null; pages: number }> {
  const size = cfg.PAGE_SIZE;
  const seen = new Set<unknown>();
  const all: TrayRecord[] = [];
  let totalCount: number | null = null;
  let pagesFetched = 0;

  const opposite: 'ASC' | 'DESC' = cfg.SORT_ORDER === 'ASC' ? 'DESC' : 'ASC';
  const orders = cfg.FETCH_BOTH_DIRECTIONS ? [cfg.SORT_ORDER, opposite] : [cfg.SORT_ORDER];

  for (const order of orders) {
    if (totalCount != null && all.length >= totalCount) break;

    for (let page = 1; page <= cfg.MAX_PAGES; page++) {
      const { records, totalCount: tc } = await fetchPageWithRetry(ctx, page, size, order);
      pagesFetched++;
      if (tc != null) totalCount = tc;

      for (const rec of records) {
        const key = rec ? (rec as Record<string, unknown>)[cfg.DEDUPE_KEY] : undefined;
        if (key == null) {
          all.push(rec);
        } else if (!seen.has(key)) {
          seen.add(key);
          all.push(rec);
        }
      }

      onProgress?.({ fetched: all.length, total: totalCount, page: pagesFetched });

      if (records.length < size) break;
      if (totalCount != null && all.length >= totalCount) break;
      if (cfg.PAGE_DELAY_MS > 0) await sleep(cfg.PAGE_DELAY_MS);
    }
  }

  return { records: all, totalCount, pages: pagesFetched };
}

// ===========================================================================
// releaseTray — one PUT per tray, body { trayId, storeCode, parentId }
// ===========================================================================

export type ReleaseTray = { trayId: string; storeCode: string; parentId: string };

function buildReleaseBody(tray: ReleaseTray): string {
  const body: Record<string, unknown> = {};
  for (const f of cfg.RELEASE_BODY_FIELDS) body[f] = (tray as Record<string, unknown>)[f];
  return JSON.stringify(body);
}

export async function releaseTray(
  ctx: FetchContext,
  tray: ReleaseTray
): Promise<ReleaseResult> {
  if (!tray || !tray.trayId) throw new Error('releaseTray: missing trayId');

  const res = await fetch('/api/packing-dispatch/nexs-proxy/release-tray', {
    method: cfg.RELEASE_METHOD,
    headers: buildHeaders(ctx),
    body: buildReleaseBody(tray),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* some endpoints return an empty body on success */
  }
  const metaStatus = json?.meta?.status;
  const ok = res.ok && (metaStatus == null || metaStatus === 'Success');
  return {
    trayId: tray.trayId,
    ok,
    httpStatus: res.status,
    metaStatus: metaStatus || null,
    response: json,
  };
}

export type ReleaseProgress = { done: number; total: number; last: ReleaseResult };

/** Release many trays sequentially (one PUT each), throttled. Never throws. */
export async function releaseTrays(
  ctx: FetchContext,
  trays: ReleaseTray[],
  onProgress?: (p: ReleaseProgress) => void
): Promise<ReleaseResult[]> {
  const results: ReleaseResult[] = [];
  for (let i = 0; i < trays.length; i++) {
    let result: ReleaseResult;
    try {
      result = await releaseTray(ctx, trays[i]);
    } catch (err) {
      result = {
        trayId: trays[i]?.trayId,
        ok: false,
        error: String((err as Error)?.message || err),
      };
    }
    results.push(result);
    onProgress?.({ done: i + 1, total: trays.length, last: result });
    if (i < trays.length - 1 && cfg.RELEASE_DELAY_MS > 0) {
      await sleep(cfg.RELEASE_DELAY_MS);
    }
  }
  return results;
}

// ===========================================================================
// Dump loading
// ===========================================================================

/** Load the dump from our BigQuery-backed endpoint. */
export async function loadDumpFromBackend(
  facility: string,
  days = cfg.DUMP_DAYS,
  signal?: AbortSignal
): Promise<DumpOrder[]> {
  const url = cfg.DUMP_ENDPOINT.replace(
    '{facility}',
    encodeURIComponent(facility || cfg.FACILITY_FALLBACK)
  ).replace('{days}', String(days));

  const res = await fetch(url, { signal });
  if (!res.ok) {
    let detail = '';
    try {
      const j = await res.json();
      detail = j?.detail || j?.error || '';
    } catch {
      /* ignore */
    }
    throw new Error(`Dump query failed (HTTP ${res.status})${detail ? `: ${detail}` : ''}`);
  }
  const json = await res.json();
  return Array.isArray(json?.orders) ? (json.orders as DumpOrder[]) : [];
}

// ---- CSV/TSV upload fallback (port of dump.js parser) ----------------------

const DUMP_FIELDS = {
  storeCode: 'store_code',
  softCourier: 'soft_courier',
  channel: 'channel',
  priority: 'order_priroity', // misspelled in source — matched as-is
  createdAt: 'order_created_at',
  updatedAt: 'updated_at',
  shipmentId: 'shipment_id',
  incrementId: 'increment_id',
} as const;

/** Parse delimited text (CSV or TSV) into row objects keyed by header. */
export function parseDelimited(text: string): Record<string, string>[] {
  if (!text) return [];
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const nl = text.indexOf('\n');
  const firstLine = text.slice(0, nl === -1 ? text.length : nl);
  const delim =
    firstLine.split('\t').length - 1 > firstLine.split(',').length - 1 ? '\t' : ',';

  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c === '\r') {
      // ignore — handled by the \n branch
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];

  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.length && !(r.length === 1 && r[0] === ''))
    .map((r) => {
      const o: Record<string, string> = {};
      header.forEach((h, j) => (o[h] = r[j] != null ? r[j] : ''));
      return o;
    });
}

function normalizeOne(raw: Record<string, unknown>): DumpOrder {
  const get = (k: string) => (raw[k] != null ? raw[k] : '');
  const p = get(DUMP_FIELDS.priority);
  return {
    storeCode: String(get(DUMP_FIELDS.storeCode)).trim(),
    softCourier: String(get(DUMP_FIELDS.softCourier)).trim(),
    channel: String(get(DUMP_FIELDS.channel)).trim(),
    priority: p === '' ? null : Number(p),
    createdAt: String(get(DUMP_FIELDS.createdAt)) || null,
    updatedAt: String(get(DUMP_FIELDS.updatedAt)) || null,
    shipmentId: String(get(DUMP_FIELDS.shipmentId)).trim(),
    incrementId: String(get(DUMP_FIELDS.incrementId)).trim(),
    _raw: raw,
  };
}

export function normalizeDump(rawRows: Record<string, unknown>[]): DumpOrder[] {
  return rawRows.map(normalizeOne).filter((o) => o.storeCode || o.shipmentId);
}

/** Read a user-supplied File (CSV/TSV) into normalised orders. */
export function loadDumpFromFile(file: File): Promise<DumpOrder[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(normalizeDump(parseDelimited(String(reader.result))));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
