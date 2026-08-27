import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import {
  buildFrameDecantingDashboard,
  frameDecantingCsvHeader,
  frameDecantingCsvRow,
  normalizeFramePid,
  summarizeFrameDecantingRows,
  type FrameDecantingRow,
  type RawFrameCountRow,
  type RawFrameGrnRow,
  type RawFramePlcRow,
  type RawFrameRosRow,
} from '@/lib/frameDecanting';
import {
  coloredDecantingXlsxResponse,
  DecantingExportBusyError,
} from '@/lib/server/decantingXlsx';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 1500;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ROS_LAG_DAYS = 3;
const CACHE_TTL_MS = 30 * 60_000;
const FORCE_REFRESH_COOLDOWN_MS = 30_000;
const MAX_CACHE_ENTRIES = 1;
const MAX_SCOPED_PIDS = 100_000;
const EXTRACT_TIMEOUT_MS = 20 * 60_000;
const BIGQUERY_TIMEOUT_MS = 8 * 60_000;
const MAX_STDOUT_BYTES = 120 * 1024 * 1024;
const ALLOWED_PAGE_SIZES = new Set([25, 50, 100]);
const PYTHON = process.env.FRAME_DECANTING_PYTHON
  || process.env.LENS_DECANTING_PYTHON
  || process.env.ORDER_CANCELLATION_PYTHON
  || process.env.NDD_RCA_PYTHON
  || 'python';
const SCRIPT_PATH = path.join(
  process.cwd(), 'src', 'app', 'api', 'stock-in', 'frame-decanting', 'fetch_external.py',
);
const QUERY_PATH = path.join(
  process.cwd(),
  'src',
  'utils',
  'resources',
  'bigquery',
  'queries',
  'frame-decanting-inventory.sql',
);

type ExternalPayload = {
  rosRows: RawFrameRosRow[];
  grnRows: RawFrameGrnRow[];
  increffRows: RawFrameCountRow[];
  transferRows: RawFrameCountRow[];
  plcRows: RawFramePlcRow[];
  excludedPids: unknown[];
  sources: Record<string, string>;
  warnings: string[];
  metadata: {
    powerBiRows: number;
    scopedPids: number;
    grnRows: number;
    increffRows: number;
    transferRows: number;
    plcRows: number;
    excludedPids: number;
    windowStart: string;
    windowEnd: string;
  };
};

type DashboardPayload = ReturnType<typeof buildFrameDecantingDashboard> & {
  asOfDate: string;
  rosWindow: { startDate: string; endDate: string };
  generatedAt: string;
  sources: Record<string, string>;
  sourceRows: Record<string, number>;
  warnings: string[];
  filterOptions: { decantComments: string[]; productTypes: string[]; brands: string[] };
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
  frameDecantingCache?: Map<string, CacheEntry>;
  frameDecantingInflight?: Map<string, Promise<DashboardPayload>>;
  frameDecantingLastForce?: number;
};
const cache = processState.frameDecantingCache ||= new Map<string, CacheEntry>();
const inflight = processState.frameDecantingInflight ||= new Map<string, Promise<DashboardPayload>>();
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

function rosWindow(asOfDate: string): { startDate: string; endDate: string } {
  const endDate = shiftDate(asOfDate, -ROS_LAG_DAYS);
  const end = dateAtUtc(endDate);
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 2, 1));
  return { startDate: start.toISOString().slice(0, 10), endDate };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseExternalPayload(value: unknown): ExternalPayload {
  if (
    !isObject(value)
    || !Array.isArray(value.rosRows)
    || !Array.isArray(value.grnRows)
    || !Array.isArray(value.increffRows)
    || !Array.isArray(value.transferRows)
    || !Array.isArray(value.plcRows)
    || !Array.isArray(value.excludedPids)
    || !isObject(value.sources)
    || !Array.isArray(value.warnings)
    || !isObject(value.metadata)
  ) {
    throw new Error('The Frame external extractor returned an unexpected payload.');
  }
  return value as ExternalPayload;
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
}

function parseViewRequest(url: URL): ViewRequest {
  const page = Number(url.searchParams.get('page') || '1');
  const pageSize = Number(url.searchParams.get('pageSize') || '50');
  if (!Number.isInteger(page) || page < 1) throw new Error('page must be a positive integer.');
  if (!Number.isInteger(pageSize) || !ALLOWED_PAGE_SIZES.has(pageSize)) {
    throw new Error('pageSize must be 25, 50, or 100.');
  }
  const readFilter = (name: string, maxLength = 200) => {
    const value = (url.searchParams.get(name) || '').trim();
    if (value.length > maxLength) throw new Error(`${name} is too long.`);
    return value;
  };
  const flag = readFilter('flag', 16);
  if (flag && flag !== 'new' && flag !== 'existing') throw new Error('flag must be new or existing.');
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

function filterRows(rows: FrameDecantingRow[], view: ViewRequest): FrameDecantingRow[] {
  const needle = view.search.toLocaleLowerCase('en-IN');
  if (!needle && !view.decantComment && !view.productType && !view.brand && !view.flag) return rows;
  return rows.filter((row) => {
    const matchesSearch = !needle || [row.productId, row.brand, row.productType, row.plc]
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

function csvResponse(rows: FrameDecantingRow[], asOfDate: string): NextResponse {
  const encoder = new TextEncoder();
  let index = 0;
  let headerPending = true;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      const lines: string[] = [];
      if (headerPending) {
        lines.push(`\uFEFF${frameDecantingCsvHeader()}`);
        headerPending = false;
      }
      const end = Math.min(index + 250, rows.length);
      while (index < end) lines.push(frameDecantingCsvRow(rows[index++]));
      controller.enqueue(encoder.encode(`${lines.join('\r\n')}\r\n`));
      if (index >= rows.length) controller.close();
    },
  });
  return new NextResponse(stream, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="frame-decanting-${asOfDate}.csv"`,
    },
  });
}

async function payloadResponse(payload: DashboardPayload, view: ViewRequest): Promise<NextResponse> {
  const filteredRows = filterRows(payload.rows, view);
  if (view.exportFormat === 'csv') return csvResponse(filteredRows, payload.asOfDate);
  if (view.exportFormat === 'xlsx') {
    const summary = summarizeFrameDecantingRows(filteredRows);
    return coloredDecantingXlsxResponse({
      python: PYTHON,
      metadata: {
        title: 'Frame Decanting',
        asOfDate: payload.asOfDate,
        windowStart: payload.rosWindow.startDate,
        windowEnd: payload.rosWindow.endDate,
        generatedAt: payload.generatedAt,
        totalPids: summary.totalPids,
        newPids: summary.newPids,
        grnMatchedPids: summary.grnMatchedPids,
        sourceRows: payload.sourceRows,
        warnings: payload.warnings,
        decantDistribution: summary.decantDistribution,
        commentsDistribution: summary.commentsDistribution,
      },
      csvHeader: frameDecantingCsvHeader(),
      csvRow: frameDecantingCsvRow,
      rows: filteredRows,
      filename: `frame-decanting-${payload.asOfDate}.xlsx`,
    });
  }

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / view.pageSize));
  const page = Math.min(view.page, totalPages);
  const start = (page - 1) * view.pageSize;
  return NextResponse.json({
    ...payload,
    rows: filteredRows.slice(start, start + view.pageSize),
    filteredSummary: summarizeFrameDecantingRows(filteredRows),
    pagination: { page, pageSize: view.pageSize, totalRows, totalPages },
  }, { headers: { 'Cache-Control': 'no-store' } });
}

function extractorError(stderr: string): string {
  return stderr.split(/\r?\n/).map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Signed in as:')).at(-1)
    || 'The Frame external extractor did not complete.';
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
      reject(new Error('The Frame Decanting source refresh exceeded twenty minutes.'));
    }, EXTRACT_TIMEOUT_MS);
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
      if (Buffer.byteLength(stdout, 'utf8') > MAX_STDOUT_BYTES && !settled) {
        settled = true;
        clearTimeout(timeout);
        child.kill();
        reject(new Error('The Frame external extractor exceeded the safe response size.'));
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
      reject(new Error(`Could not start the Frame extractor: ${error.message}`));
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
        reject(error instanceof Error ? error : new Error('The Frame extractor returned invalid JSON.'));
      }
    });
  });
}

async function generatePayload(asOfDate: string): Promise<DashboardPayload> {
  const window = rosWindow(asOfDate);
  const external = await runExternalExtractor(window.startDate, window.endDate);
  const rosPids = [...new Set(external.rosRows.map((row) => normalizeFramePid(row.pid)).filter(Boolean))];
  if (rosPids.length !== external.metadata.scopedPids) {
    throw new Error(
      `Frame Power BI PID reconciliation failed (${rosPids.length} of ${external.metadata.scopedPids}).`,
    );
  }
  if (!rosPids.length) throw new Error('Frame Power BI returned no in-scope ROS PIDs.');
  if (rosPids.length > MAX_SCOPED_PIDS) {
    throw new Error(`Frame Power BI returned ${rosPids.length} PIDs; safe limit is ${MAX_SCOPED_PIDS}.`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BIGQUERY_TIMEOUT_MS);
  let inventoryRows: Record<string, unknown>[];
  try {
    inventoryRows = (await runBigQuery(
      await loadInventoryQuery(),
      200_000,
      { pids: rosPids },
      { signal: controller.signal, jobTimeoutMs: BIGQUERY_TIMEOUT_MS },
    )).rows;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('The Frame Decanting BigQuery refresh exceeded eight minutes.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const dashboard = buildFrameDecantingDashboard(
    external.rosRows,
    inventoryRows,
    external.grnRows,
    external.increffRows,
    external.transferRows,
    external.plcRows,
    external.excludedPids,
    window,
  );
  const inventoryByPid = new Map(inventoryRows.map((row) => [normalizeFramePid(row.pid), row]));
  const inventoryMatches = dashboard.rows.filter(
    (row) => Number(inventoryByPid.get(row.productId)?.inventory_match) > 0,
  ).length;
  const productMatches = dashboard.rows.filter(
    (row) => Number(inventoryByPid.get(row.productId)?.product_match) > 0,
  ).length;
  const warnings = [...external.warnings];
  if (inventoryMatches < dashboard.rows.length) {
    warnings.push(
      `Native inventory matched ${inventoryMatches} of ${dashboard.rows.length} Frame PIDs; validate source coverage.`,
    );
  }
  if (productMatches < dashboard.rows.length) {
    warnings.push(
      `Product enrichment matched ${productMatches} of ${dashboard.rows.length} Frame PIDs.`,
    );
  }
  return {
    ...dashboard,
    asOfDate,
    rosWindow: window,
    generatedAt: new Date().toISOString(),
    sources: { ...external.sources, bigQuery: 'ok' },
    sourceRows: {
      powerBi: external.metadata.powerBiRows,
      // Frame includes six-digit inventory-only PIDs in addition to the
      // Power BI scope, so coverage denominators must use the final dashboard.
      scopedPids: dashboard.rows.length,
      rosPids: external.metadata.scopedPids,
      grn: external.metadata.grnRows,
      inventory: inventoryMatches,
      products: productMatches,
      increff: external.metadata.increffRows,
      transfer: external.metadata.transferRows,
      plc: external.metadata.plcRows,
      exclusions: external.metadata.excludedPids,
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
  for (const [key, entry] of cache) if (entry.expiresAt <= now) cache.delete(key);
  if (
    processState.frameDecantingLastForce
    && now - processState.frameDecantingLastForce > CACHE_TTL_MS
  ) processState.frameDecantingLastForce = undefined;
}

async function handleRequest(request: Request, force: boolean): Promise<NextResponse> {
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
    && now - (processState.frameDecantingLastForce || 0) < FORCE_REFRESH_COOLDOWN_MS;
  if ((!force || forceCoolingDown) && hit && hit.expiresAt > now) {
    return await payloadResponse(hit.payload, view);
  }
  if (forceCoolingDown) {
    return NextResponse.json(
      { error: 'Frame Decanting was refreshed recently. Try again in a few seconds.' },
      { status: 429, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' } },
    );
  }

  try {
    let pending = inflight.get(asOfDate);
    if (!pending) {
      if (inflight.size) {
        return NextResponse.json(
          { error: 'Another Frame Decanting refresh is running. Try again shortly.' },
          { status: 429, headers: { 'Retry-After': '15', 'Cache-Control': 'no-store' } },
        );
      }
      if (force) processState.frameDecantingLastForce = now;
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
      const oldest = cache.keys().next().value as string | undefined;
      if (!oldest) break;
      cache.delete(oldest);
    }
    return await payloadResponse(payload, view);
  } catch (error) {
    if (error instanceof DecantingExportBusyError) {
      return NextResponse.json(
        { error: error.message },
        { status: 429, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' } },
      );
    }
    console.error('[stock-in/frame-decanting] refresh failed:', error);
    if (force && hit && hit.expiresAt > now) {
      return await payloadResponse({
        ...hit.payload,
        warnings: [
          ...hit.payload.warnings,
          'The forced refresh failed; showing the last successful in-memory snapshot.',
        ],
      }, view);
    }
    return NextResponse.json(
      { error: 'Unable to refresh Frame Decanting. Check the server source credentials and logs.' },
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
