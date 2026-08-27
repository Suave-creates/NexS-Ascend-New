import 'server-only';

import { createReadStream, createWriteStream } from 'node:fs';
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import sql, { type ConnectionPool, type config as SqlConfig } from 'mssql';
import { NextResponse } from 'next/server';

const WINDOW_HOURS = 48;
const IST_OFFSET_MS = 5.5 * 60 * 60_000;
const LOCK_TIMEOUT_MS = 5_000;
const DEFAULT_CONNECT_TIMEOUT_MS = 15_000;
const DEFAULT_QUERY_TIMEOUT_MS = 600_000;
const DEFAULT_RETRIES = 3;

const CSV_HEADER = [
  'DateTime',
  'AppID',
  'Edger',
  'Type',
  'Message',
  'Job Name',
  'Job Stamp',
  'Nr Order',
  'Sequence',
  'Lens Side',
  'Pallet Pos',
  'Lens Type',
  'Lensholder',
  'Work Time',
  'Material',
  'Edge Type',
  'Inclination',
  'Bevel Position',
  'Bevel Modifier',
  'Polish',
  'Safety Bevel',
  'Slipperiness',
  'Thick Decl',
  'Thick Min',
  'Thick Max',
  'Front Base Decl',
  'Front Base Real',
  'Back Base Real',
  'Bevel Base',
].join(',');

const END_CUT_SQL = `
SET NOCOUNT ON;
SET LOCK_TIMEOUT ${LOCK_TIMEOUT_MS};
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

SELECT
    e.DateTime,
    CASE e.AppID WHEN 11 THEN 'Racer' WHEN 20 THEN 'RacerSwift' ELSE at.Description END AS AppID,
    dd.MachineName AS Edger,
    REPLACE(REPLACE(st.Description, ' <<<', ''), ' >>>', '') AS EvtType,
    REPLACE(REPLACE(st.Description, ' <<<', ''), ' >>>', '') AS Msg,
    ep.JobName,
    ep.Jobstamp,
    mo.NumOrder,
    ec.Sequence,
    ls.Description AS LensSide,
    pp.Description AS PalletPos,
    ec.Lensholder,
    ec.CutTime AS WorkTime,
    dm.Description AS Material,
    de.Description AS EdgeType,
    CASE ji.HiCurve WHEN 0 THEN 'Vert' ELSE CAST(ji.HiCurve AS varchar(10)) END AS Inclination,
    bp.Description AS BevelPosition,
    ji.BEVM,
    ji.POLISH,
    ji.PIN,
    sl.Description AS Slipperiness,
    ji.THICK_Decl,
    ji.THICK_Min,
    ji.THICK_Max,
    ji.FRONT_BASE_Decl,
    ji.FRONT_BASE_Real,
    ji.BACK_BASE_Real,
    ji.BEVEL_BASE_Real
FROM dbo.dbEvents e WITH (NOLOCK)
LEFT JOIN dbo.dbDatabaseData dd ON dd.ID = e.MachineID
LEFT JOIN dbo.dicAppTypes at ON at.ID = e.AppID
LEFT JOIN dbo.dicEvtSubTypes st ON st.TypeID = e.Type AND st.ID = e.SubType
LEFT JOIN dbo.dbEvtProcess ep WITH (NOLOCK) ON ep.EventID = e.ID
LEFT JOIN dbo.dbEvtMapNumOrders mo WITH (NOLOCK)
  ON mo.JobName = ep.JobName AND mo.JobStamp = ep.Jobstamp
LEFT JOIN dbo.dbEndCutData ec WITH (NOLOCK) ON ec.EventID = e.ID
LEFT JOIN dbo.dbJobInfoData ji WITH (NOLOCK) ON ji.EventID = e.ID
LEFT JOIN dbo.dicLensSides ls ON ls.ID = ep.LensSide
LEFT JOIN dbo.dicPalletPos pp ON pp.ID = ep.PalletPos
LEFT JOIN dbo.dicMaterials dm ON dm.MachineID = e.MachineID AND dm.ID = ji.MATTYPE
LEFT JOIN dbo.dicEdgeTypes de ON de.MachineID = e.MachineID AND de.ID = ji.ETYPE
LEFT JOIN dbo.dicBevelPos bp ON bp.ID = ji.BEVP
LEFT JOIN dbo.dicSlipperiness sl ON sl.ID = ji._LCOAT
WHERE e.Type = 0
  AND e.SubType = 12
  AND e.DateTime >= @start_time
  AND e.DateTime < @end_time
ORDER BY e.DateTime DESC
OPTION (MAXDOP 1);
`;

type EndCutRow = Record<string, unknown>;
type Window = { start: Date; end: Date };
type BuiltDump = Window & {
  directory: string;
  filePath: string;
  filename: string;
  rowCount: number;
  size: number;
};

type EndCutGlobal = typeof globalThis & { __endCutDumpBusy?: boolean };
const endCutGlobal = globalThis as EndCutGlobal;

export class EndCutBusyError extends Error {
  constructor() {
    super('Another End Cut export is already running. Try again shortly.');
    this.name = 'EndCutBusyError';
  }
}

export class EndCutConfigurationError extends Error {
  constructor() {
    super('The End Cut data source is not configured.');
    this.name = 'EndCutConfigurationError';
  }
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new EndCutConfigurationError();
  return value;
}

function integerEnvironment(
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new EndCutConfigurationError();
  }
  return value;
}

function booleanEnvironment(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) return fallback;
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  throw new EndCutConfigurationError();
}

function connectionConfiguration(): { config: SqlConfig; retries: number } {
  return {
    config: {
      server: requiredEnvironment('ENDCUT_DB_HOST'),
      port: integerEnvironment('ENDCUT_DB_PORT', 1433, 1, 65_535),
      database: process.env.ENDCUT_DB_NAME?.trim() || 'JobViewer',
      user: requiredEnvironment('ENDCUT_DB_USER'),
      password: requiredEnvironment('ENDCUT_DB_PASSWORD'),
      connectionTimeout: integerEnvironment(
        'ENDCUT_DB_CONNECT_TIMEOUT_MS',
        DEFAULT_CONNECT_TIMEOUT_MS,
        1_000,
        30_000,
      ),
      requestTimeout: integerEnvironment(
        'ENDCUT_QUERY_TIMEOUT_MS',
        DEFAULT_QUERY_TIMEOUT_MS,
        10_000,
        DEFAULT_QUERY_TIMEOUT_MS,
      ),
      pool: { min: 0, max: 1, idleTimeoutMillis: 30_000 },
      options: {
        appName: 'NexS-Ascend-EndCut',
        encrypt: booleanEnvironment('ENDCUT_DB_ENCRYPT', true),
        trustServerCertificate: booleanEnvironment(
          'ENDCUT_DB_TRUST_SERVER_CERTIFICATE',
          false,
        ),
        useUTC: true,
        enableArithAbort: true,
      },
    },
    retries: integerEnvironment('ENDCUT_QUERY_RETRIES', DEFAULT_RETRIES, 1, 3),
  };
}

function wallClockInIndia(instant: Date): Date {
  return new Date(instant.getTime() + IST_OFFSET_MS);
}

export function fixedEndCutWindow(now = new Date()): Window {
  return {
    start: wallClockInIndia(new Date(now.getTime() - WINDOW_HOURS * 60 * 60_000)),
    end: wallClockInIndia(now),
  };
}

function dailyChunks(window: Window): Window[] {
  const chunks: Window[] = [];
  let cursor = new Date(window.start);
  while (cursor < window.end) {
    const nextMidnight = new Date(Date.UTC(
      cursor.getUTCFullYear(),
      cursor.getUTCMonth(),
      cursor.getUTCDate() + 1,
    ));
    const end = nextMidnight < window.end ? nextMidnight : window.end;
    chunks.push({ start: cursor, end });
    cursor = end;
  }
  return chunks;
}

function abortError(): Error {
  return new Error('The End Cut export was cancelled.');
}

async function abortableDelay(milliseconds: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) throw abortError();
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(finish, milliseconds);
    function finish() {
      signal?.removeEventListener('abort', cancel);
      resolve();
    }
    function cancel() {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', cancel);
      reject(abortError());
    }
    signal?.addEventListener('abort', cancel, { once: true });
  });
}

function text(value: unknown): string {
  if (value === null || value === undefined) return '';
  const result = String(value);
  return /^[=+\-@\t\r]/.test(result) ? `'${result}` : result;
}

function csvText(value: unknown): string {
  const result = text(value);
  return /[",\r\n]/.test(result) ? `"${result.replace(/"/g, '""')}"` : result;
}

function roundHalfEven(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const lower = Math.floor(scaled);
  const fraction = scaled - lower;
  const rounded = fraction === 0.5
    ? (Math.abs(lower) % 2 === 0 ? lower : lower + 1)
    : Math.round(scaled);
  const result = rounded / factor;
  return Object.is(result, -0) ? 0 : result;
}

function numeric(value: unknown, decimals: number): string {
  if (value === null || value === undefined || value === '') return '';
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '';
  return roundHalfEven(parsed, decimals)
    .toFixed(decimals)
    .replace(/(?:\.0+|(\.\d*?)0+)$/, '$1');
}

function booleanText(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return value === 0 ? 'False' : 'True';
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') return 'True';
  if (normalized === 'false' || normalized === '0') return 'False';
  return '';
}

function dateTimeText(value: unknown): string {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return '';
  const hour = value.getUTCHours();
  const hour12 = hour % 12 || 12;
  const suffix = hour < 12 ? 'AM' : 'PM';
  return `${value.getUTCMonth() + 1}/${value.getUTCDate()}/${value.getUTCFullYear()} `
    + `${hour12}:${String(value.getUTCMinutes()).padStart(2, '0')}`
    + `:${String(value.getUTCSeconds()).padStart(2, '0')} ${suffix}`;
}

export function formatEndCutCsvRow(row: EndCutRow): string {
  return [
    dateTimeText(row.DateTime),
    csvText(row.AppID),
    csvText(row.Edger),
    csvText(row.EvtType),
    csvText(row.Msg),
    csvText(row.JobName),
    csvText(row.Jobstamp),
    csvText(row.NumOrder),
    csvText(row.Sequence),
    csvText(row.LensSide),
    csvText(row.PalletPos),
    '',
    csvText(row.Lensholder),
    csvText(row.WorkTime),
    csvText(row.Material),
    csvText(row.EdgeType),
    csvText(row.Inclination),
    csvText(row.BevelPosition),
    numeric(row.BEVM, 2),
    booleanText(row.POLISH),
    booleanText(row.PIN),
    csvText(row.Slipperiness),
    numeric(row.THICK_Decl, 3),
    numeric(row.THICK_Min, 3),
    numeric(row.THICK_Max, 3),
    numeric(row.FRONT_BASE_Decl, 3),
    numeric(row.FRONT_BASE_Real, 3),
    numeric(row.BACK_BASE_Real, 3),
    numeric(row.BEVEL_BASE_Real, 3),
  ].join(',');
}

async function spoolChunk(
  pool: ConnectionPool,
  window: Window,
  filePath: string,
  signal?: AbortSignal,
): Promise<number> {
  if (signal?.aborted) throw abortError();
  const request = pool.request();
  // dbEvents.DateTime is SQL `datetime`; matching its parameter type preserves
  // the DateTime-leading index seek instead of converting the indexed column.
  request.input('start_time', sql.DateTime, window.start);
  request.input('end_time', sql.DateTime, window.end);
  const source = request.toReadableStream({ highWaterMark: 100 });
  let rowCount = 0;
  const formatter = new Transform({
    writableObjectMode: true,
    transform(row: EndCutRow, _encoding, callback) {
      rowCount += 1;
      callback(null, `${formatEndCutCsvRow(row)}\r\n`);
    },
  });
  const cancel = () => {
    request.cancel();
    source.destroy(abortError());
  };
  signal?.addEventListener('abort', cancel, { once: true });
  try {
    const query = request.query(END_CUT_SQL).catch((error) => {
      source.destroy(error);
      throw error;
    });
    await Promise.all([
      pipeline(source, formatter, createWriteStream(filePath, { flags: 'w' })),
      query,
    ]);
    return rowCount;
  } catch (error) {
    request.cancel();
    throw signal?.aborted ? abortError() : error;
  } finally {
    signal?.removeEventListener('abort', cancel);
  }
}

async function buildEndCutDump(signal?: AbortSignal): Promise<BuiltDump> {
  if (endCutGlobal.__endCutDumpBusy) throw new EndCutBusyError();
  endCutGlobal.__endCutDumpBusy = true;
  let directory: string;
  try {
    directory = await mkdtemp(path.join(tmpdir(), 'nexs-endcut-'));
  } catch (error) {
    endCutGlobal.__endCutDumpBusy = false;
    throw error;
  }
  const filePath = path.join(directory, 'end-cut.csv');
  let pool: ConnectionPool | null = null;
  try {
    const { config, retries } = connectionConfiguration();
    const window = fixedEndCutWindow();
    await writeFile(filePath, `${CSV_HEADER}\r\n`, 'utf8');
    pool = await new sql.ConnectionPool(config).connect();
    let rowCount = 0;

    for (const [index, chunk] of dailyChunks(window).entries()) {
      const chunkPath = path.join(directory, `chunk-${index}.csv`);
      let lastError: unknown;
      let chunkRowCount = 0;
      for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
          chunkRowCount = await spoolChunk(pool, chunk, chunkPath, signal);
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          await rm(chunkPath, { force: true }).catch(() => undefined);
          if (signal?.aborted) throw abortError();
          if (attempt >= retries) break;
          await pool.close().catch(() => undefined);
          await abortableDelay(10_000 * attempt, signal);
          pool = await new sql.ConnectionPool(config).connect();
        }
      }
      if (lastError) throw lastError;
      // Commit a successfully queried chunk exactly once. File-system failures
      // abort the whole export instead of re-querying and duplicating its rows.
      await pipeline(
        createReadStream(chunkPath),
        createWriteStream(filePath, { flags: 'a' }),
      );
      rowCount += chunkRowCount;
      await rm(chunkPath, { force: true });
    }

    await pool.close();
    pool = null;
    const details = await stat(filePath);
    const startDate = sqlDate(window.start);
    const endDate = sqlDate(window.end);
    return {
      ...window,
      directory,
      filePath,
      filename: `End_Cut_last_48_hours_${startDate}_to_${endDate}.csv`,
      rowCount,
      size: details.size,
    };
  } catch (error) {
    await pool?.close().catch(() => undefined);
    await rm(directory, { recursive: true, force: true });
    throw error;
  } finally {
    endCutGlobal.__endCutDumpBusy = false;
  }
}

function sqlDate(value: Date): string {
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}`
    + `-${String(value.getUTCDate()).padStart(2, '0')}`;
}

function windowHeader(value: Date): string {
  return `${sqlDate(value)}T${String(value.getUTCHours()).padStart(2, '0')}`
    + `:${String(value.getUTCMinutes()).padStart(2, '0')}`
    + `:${String(value.getUTCSeconds()).padStart(2, '0')}+05:30`;
}

export async function endCutCsvResponse(signal?: AbortSignal): Promise<NextResponse> {
  const dump = await buildEndCutDump(signal);
  const source = createReadStream(dump.filePath);
  let cleaned = false;
  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    await rm(dump.directory, { recursive: true, force: true }).catch(() => undefined);
  };
  source.once('close', () => { void cleanup(); });
  source.once('error', () => { void cleanup(); });
  const body = Readable.toWeb(source) as ReadableStream<Uint8Array>;
  return new NextResponse(body, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${dump.filename}"`,
      'Content-Length': String(dump.size),
      'X-Row-Count': String(dump.rowCount),
      'X-Query-Source': 'mei-jobviewer-sqlserver',
      'X-Time-Zone': 'Asia/Kolkata',
      'X-Window-Start': windowHeader(dump.start),
      'X-Window-End': windowHeader(dump.end),
    },
  });
}
