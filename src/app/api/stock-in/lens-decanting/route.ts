import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import {
  buildLensDecantingDashboard,
  lensDecantingCsvHeader,
  lensDecantingCsvRow,
  normalizeLensPid,
  summarizeLensDecantingRows,
  type LensDecantingRow,
  type RawGrnRow,
  type RawRosRow,
} from '@/lib/lensDecanting';
import {
  coloredDecantingXlsxResponse,
  DecantingExportBusyError,
} from '@/lib/server/decantingXlsx';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 1500;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ROS_LAG_DAYS = 2;
const ROS_WINDOW_DAYS = 7;
const CACHE_TTL_MS = 10 * 60 * 60_000;
const FORCE_REFRESH_COOLDOWN_MS = 30_000;
const FORCE_REFRESH_KEY = 'global';
const MAX_CACHE_ENTRIES = 1;
const MAX_SCOPED_PIDS = 100_000;
const EXTRACT_TIMEOUT_MS = 12 * 60_000;
const BIGQUERY_TIMEOUT_MS = 6 * 60_000;
const MAX_STDOUT_BYTES = 100 * 1024 * 1024;
const ALLOWED_PAGE_SIZES = new Set([25, 50, 100]);
const PYTHON = process.env.LENS_DECANTING_PYTHON
  || process.env.ORDER_CANCELLATION_PYTHON
  || process.env.NDD_RCA_PYTHON
  || 'python';
const SCRIPT_PATH = path.join(
  process.cwd(),
  'src',
  'app',
  'api',
  'stock-in',
  'lens-decanting',
  'fetch_external.py',
);
const QUERY_PATH = path.join(
  process.cwd(),
  'src',
  'utils',
  'resources',
  'bigquery',
  'queries',
  'lens-decanting-inventory.sql',
);

type ExternalPayload = {
  rosRows: RawRosRow[];
  grnRows: RawGrnRow[];
  sources: { powerBi: string; googleSheets: string };
  warnings: string[];
  metadata: {
    powerBiRows: number;
    scopedPids: number;
    grnRows: number;
    windowStart: string;
    windowEnd: string;
  };
};

type DashboardPayload = ReturnType<typeof buildLensDecantingDashboard> & {
  asOfDate: string;
  rosWindow: { startDate: string; endDate: string };
  generatedAt: string;
  sources: { powerBi: string; googleSheets: string; bigQuery: 'ok' };
  sourceRows: {
    powerBi: number;
    scopedPids: number;
    grn: number;
    inventory: number;
    products: number;
  };
  warnings: string[];
  filterOptions: {
    decantComments: string[];
    productTypes: string[];
    brands: string[];
  };
};

type ViewRequest = {
  page: number;
  pageSize: number;
  search: string;
  decantComment: string;
  productType: string;
  brand: string;
  flag: '' | 'new' | 'existing';
  exportFormat: '' | 'csv' | 'xlsx';
};

type CacheEntry = { payload: DashboardPayload; expiresAt: number };
const processState = globalThis as typeof globalThis & {
  lensDecantingCache?: Map<string, CacheEntry>;
  lensDecantingInflight?: Map<string, Promise<DashboardPayload>>;
  lensDecantingLastForce?: Map<string, number>;
};
const cache = processState.lensDecantingCache ||= new Map<string, CacheEntry>();
const inflight = processState.lensDecantingInflight ||= new Map<string, Promise<DashboardPayload>>();
const lastForcedRefresh = processState.lensDecantingLastForce ||= new Map<string, number>();

let queryPromise: Promise<string> | null = null;

function loadInventoryQuery(): Promise<string> {
  queryPromise ??= readFile(QUERY_PATH, 'utf8').then((query) =>
    query.replaceAll('__DATA_PROJECT__', BIGQUERY_DATA_PROJECT_ID),
  );
  return queryPromise;
}

function dateAtUtc(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = dateAtUtc(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function shiftDate(value: string, days: number): string {
  const shifted = dateAtUtc(value);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

function todayInIndia(): string {
  return new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
}

function rosWindow(asOfDate: string) {
  const endDate = shiftDate(asOfDate, -ROS_LAG_DAYS);
  return {
    startDate: shiftDate(endDate, -(ROS_WINDOW_DAYS - 1)),
    endDate,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseExternalPayload(value: unknown): ExternalPayload {
  if (
    !isObject(value)
    || !Array.isArray(value.rosRows)
    || !Array.isArray(value.grnRows)
    || !isObject(value.sources)
    || !Array.isArray(value.warnings)
    || !isObject(value.metadata)
  ) {
    throw new Error('The external extractor returned an unexpected payload.');
  }
  return value as ExternalPayload;
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
}

function parseViewRequest(url: URL): ViewRequest {
  const pageValue = url.searchParams.get('page') || '1';
  const pageSizeValue = url.searchParams.get('pageSize') || '50';
  const page = Number(pageValue);
  const pageSize = Number(pageSizeValue);
  if (!Number.isInteger(page) || page < 1) {
    throw new Error('page must be a positive integer.');
  }
  if (!Number.isInteger(pageSize) || !ALLOWED_PAGE_SIZES.has(pageSize)) {
    throw new Error('pageSize must be 25, 50, or 100.');
  }

  const readFilter = (name: string, maxLength = 200) => {
    const value = (url.searchParams.get(name) || '').trim();
    if (value.length > maxLength) throw new Error(`${name} is too long.`);
    return value;
  };
  const flag = readFilter('flag', 16);
  if (flag && flag !== 'new' && flag !== 'existing') {
    throw new Error('flag must be new or existing.');
  }
  const exportFormat = readFilter('export', 16);
  if (exportFormat && exportFormat !== 'csv' && exportFormat !== 'xlsx') {
    throw new Error('export must be csv or xlsx.');
  }
  return {
    page,
    pageSize,
    search: readFilter('search'),
    decantComment: readFilter('decantComment'),
    productType: readFilter('productType'),
    brand: readFilter('brand'),
    flag: flag as ViewRequest['flag'],
    exportFormat: exportFormat as ViewRequest['exportFormat'],
  };
}

function filterDashboardRows(rows: LensDecantingRow[], view: ViewRequest): LensDecantingRow[] {
  const needle = view.search.toLocaleLowerCase('en-IN');
  const hasFilters = Boolean(
    needle || view.decantComment || view.productType || view.brand || view.flag,
  );
  if (!hasFilters) return rows;
  return rows.filter((row) => {
    const matchesSearch = !needle || [row.productId, row.brand, row.productType]
      .some((value) => value.toLocaleLowerCase('en-IN').includes(needle));
    const matchesFlag = !view.flag
      || (view.flag === 'new' ? row.flag === 'New PID' : row.flag !== 'New PID');
    return matchesSearch
      && (!view.decantComment || row.decantComment === view.decantComment)
      && (!view.productType || row.productType === view.productType)
      && (!view.brand || row.brand === view.brand)
      && matchesFlag;
  });
}

function csvResponse(
  rows: LensDecantingRow[],
  asOfDate: string,
  extraHeaders: Record<string, string> = {},
): NextResponse {
  const encoder = new TextEncoder();
  let index = 0;
  let headerPending = true;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      const lines: string[] = [];
      if (headerPending) {
        lines.push(`\uFEFF${lensDecantingCsvHeader()}`);
        headerPending = false;
      }
      const end = Math.min(index + 250, rows.length);
      while (index < end) {
        lines.push(lensDecantingCsvRow(rows[index]));
        index += 1;
      }
      controller.enqueue(encoder.encode(`${lines.join('\r\n')}\r\n`));
      if (index >= rows.length) controller.close();
    },
  });
  return new NextResponse(stream, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="lens-decanting-${asOfDate}.csv"`,
      ...extraHeaders,
    },
  });
}

async function payloadResponse(
  payload: DashboardPayload,
  view: ViewRequest,
  extraHeaders: Record<string, string> = {},
): Promise<NextResponse> {
  const filteredRows = filterDashboardRows(payload.rows, view);
  if (view.exportFormat === 'csv') return csvResponse(filteredRows, payload.asOfDate, extraHeaders);
  if (view.exportFormat === 'xlsx') {
    const filteredSummary = summarizeLensDecantingRows(filteredRows);
    return coloredDecantingXlsxResponse({
      python: PYTHON,
      metadata: {
        title: 'Lens Decanting',
        asOfDate: payload.asOfDate,
        windowStart: payload.rosWindow.startDate,
        windowEnd: payload.rosWindow.endDate,
        generatedAt: payload.generatedAt,
        totalPids: filteredSummary.totalPids,
        newPids: filteredSummary.newPids,
        grnMatchedPids: filteredSummary.grnMatchedPids,
        sourceRows: payload.sourceRows,
        warnings: payload.warnings,
        decantDistribution: filteredSummary.decantDistribution,
        commentsDistribution: filteredSummary.commentsDistribution,
      },
      csvHeader: lensDecantingCsvHeader(),
      csvRow: lensDecantingCsvRow,
      rows: filteredRows,
      filename: `lens-decanting-${payload.asOfDate}.xlsx`,
    });
  }

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / view.pageSize));
  const page = Math.min(view.page, totalPages);
  const start = (page - 1) * view.pageSize;
  return NextResponse.json(
    {
      ...payload,
      rows: filteredRows.slice(start, start + view.pageSize),
      filteredSummary: summarizeLensDecantingRows(filteredRows),
      pagination: {
        page,
        pageSize: view.pageSize,
        totalRows,
        totalPages,
      },
    },
    { headers: { 'Cache-Control': 'no-store', ...extraHeaders } },
  );
}

function extractorError(stderr: string): string {
  const lines = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Signed in as:'));
  return lines.at(-1) || 'The external data extractor did not complete.';
}

function runExternalExtractor(startDate: string, endDate: string): Promise<ExternalPayload> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let stdout = '';
    let stderr = '';
    const child = spawn(PYTHON, ['-u', SCRIPT_PATH, startDate, endDate], {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONUNBUFFERED: '1', PYTHONIOENCODING: 'utf-8' },
      windowsHide: true,
    });
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(new Error('The Lens Decanting source refresh exceeded eight minutes.'));
    }, EXTRACT_TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
      if (Buffer.byteLength(stdout, 'utf8') > MAX_STDOUT_BYTES && !settled) {
        settled = true;
        clearTimeout(timeout);
        child.kill();
        reject(new Error('The external extractor exceeded the safe response size.'));
      }
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
      if (stderr.length > 128 * 1024) stderr = stderr.slice(-128 * 1024);
    });
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(new Error(`Could not start the Lens Decanting extractor: ${error.message}`));
    });
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(extractorError(stderr)));
        return;
      }
      try {
        resolve(parseExternalPayload(JSON.parse(stdout)));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('The extractor returned invalid JSON.'));
      }
    });
  });
}

async function generatePayload(asOfDate: string): Promise<DashboardPayload> {
  const window = rosWindow(asOfDate);
  const external = await runExternalExtractor(window.startDate, window.endDate);
  const pids = [...new Set(external.rosRows.map((row) => normalizeLensPid(row.pid)).filter(Boolean))];
  if (external.metadata.scopedPids !== pids.length) {
    throw new Error(
      `Power BI PID reconciliation failed (${pids.length} of ${external.metadata.scopedPids} scoped PIDs).`,
    );
  }
  if (pids.length > MAX_SCOPED_PIDS) {
    throw new Error(
      `Power BI returned ${pids.length} scoped PIDs; the safe dashboard limit is ${MAX_SCOPED_PIDS}.`,
    );
  }
  let inventoryRows: Record<string, unknown>[] = [];
  if (pids.length) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BIGQUERY_TIMEOUT_MS);
    try {
      inventoryRows = (await runBigQuery(
        await loadInventoryQuery(),
        50_000,
        { pids },
        { signal: controller.signal, jobTimeoutMs: BIGQUERY_TIMEOUT_MS },
      )).rows;
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error('The Lens Decanting BigQuery refresh exceeded six minutes.');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  const dashboard = buildLensDecantingDashboard(
    external.rosRows,
    inventoryRows,
    external.grnRows,
    window,
  );

  const inventoryMatches = inventoryRows.filter((row) => Number(row.inventory_match) > 0).length;
  const productMatches = inventoryRows.filter((row) => Number(row.product_match) > 0).length;
  const warnings = [...external.warnings];
  if (inventoryMatches < pids.length) {
    warnings.push(
      `Native inventory matched ${inventoryMatches} of ${pids.length} scoped PIDs; validate source coverage.`,
    );
  }
  if (productMatches < pids.length) {
    warnings.push(
      `Product enrichment matched ${productMatches} of ${pids.length} scoped PIDs; unmatched Power BI brand and type values were retained.`,
    );
  }

  return {
    ...dashboard,
    asOfDate,
    rosWindow: window,
    generatedAt: new Date().toISOString(),
    sources: {
      powerBi: external.sources.powerBi,
      googleSheets: external.sources.googleSheets,
      bigQuery: 'ok',
    },
    sourceRows: {
      powerBi: external.metadata.powerBiRows,
      scopedPids: pids.length,
      grn: external.metadata.grnRows,
      inventory: inventoryMatches,
      products: productMatches,
    },
    warnings,
    filterOptions: {
      decantComments: sortedUnique(dashboard.rows.map((row) => row.decantComment)),
      productTypes: sortedUnique(dashboard.rows.map((row) => row.productType)),
      brands: sortedUnique(dashboard.rows.map((row) => row.brand)),
    },
  };
}

function pruneState(now: number) {
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
  for (const [key, refreshedAt] of lastForcedRefresh) {
    if (now - refreshedAt > CACHE_TTL_MS) lastForcedRefresh.delete(key);
  }
}

async function handleRequest(request: Request, force: boolean) {
  const url = new URL(request.url);
  const asOfDate = url.searchParams.get('asOfDate') || todayInIndia();

  if (!isValidDate(asOfDate)) {
    return NextResponse.json(
      { error: 'asOfDate must be a valid date in YYYY-MM-DD format.' },
      { status: 400 },
    );
  }
  let view: ViewRequest;
  try {
    view = parseViewRequest(url);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid dashboard parameters.' },
      { status: 400 },
    );
  }
  if (force && view.exportFormat) {
    return NextResponse.json(
      { error: 'Refresh and export must be requested separately.' },
      { status: 400 },
    );
  }

  const now = Date.now();
  pruneState(now);
  const hit = cache.get(asOfDate);
  const forceCoolingDown = force
    && now - (lastForcedRefresh.get(FORCE_REFRESH_KEY) || 0) < FORCE_REFRESH_COOLDOWN_MS;

  if ((!force || forceCoolingDown) && hit && hit.expiresAt > now) {
    return await payloadResponse(hit.payload, view);
  }
  if (forceCoolingDown) {
    return NextResponse.json(
      { error: 'Lens Decanting was refreshed recently. Try again in a few seconds.' },
      { status: 429, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' } },
    );
  }

  try {
    let pending = inflight.get(asOfDate);
    if (!pending) {
      if (inflight.size > 0) {
        return NextResponse.json(
          { error: 'Another Lens Decanting refresh is running. Try again shortly.' },
          { status: 429, headers: { 'Retry-After': '15', 'Cache-Control': 'no-store' } },
        );
      }
      if (force) lastForcedRefresh.set(FORCE_REFRESH_KEY, now);
      pending = generatePayload(asOfDate);
      inflight.set(asOfDate, pending);
      const clear = () => {
        if (inflight.get(asOfDate) === pending) inflight.delete(asOfDate);
      };
      void pending.then(clear, clear);
    }

    const payload = await pending;
    cache.delete(asOfDate);
    cache.set(asOfDate, { payload, expiresAt: Date.now() + CACHE_TTL_MS });
    while (cache.size > MAX_CACHE_ENTRIES) {
      const oldestKey = cache.keys().next().value as string | undefined;
      if (!oldestKey) break;
      cache.delete(oldestKey);
    }
    return await payloadResponse(payload, view);
  } catch (error) {
    if (error instanceof DecantingExportBusyError) {
      return NextResponse.json(
        { error: error.message },
        { status: 429, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' } },
      );
    }
    console.error('[stock-in/lens-decanting] refresh failed:', error);
    if (force && hit && hit.expiresAt > now) {
      return await payloadResponse(
        {
          ...hit.payload,
          warnings: [
            ...hit.payload.warnings,
            'The forced refresh failed; showing the last successful in-memory snapshot.',
          ],
        },
        view,
        { 'X-Data-Stale': '1' },
      );
    }
    return NextResponse.json(
      { error: 'Unable to refresh Lens Decanting. Check the server source credentials and logs.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export async function GET(request: Request) {
  return handleRequest(request, false);
}

export async function POST(request: Request) {
  return handleRequest(request, true);
}
