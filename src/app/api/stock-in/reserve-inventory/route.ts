import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 900;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;
const DEFAULT_RANGE_DAYS = 2;
const MAX_RANGE_DAYS = 62;
const CACHE_SCHEMA_VERSION = 3;
const WAREHOUSE_TIME_ZONE = 'Asia/Kolkata';
const CACHE_TTL_MS = 6 * 60 * 60_000;
const FORCE_REFRESH_COOLDOWN_MS = 30_000;
const QUERY_TIMEOUT_MS = 10 * 60_000;
const MAX_MEMORY_ENTRIES = 3;
const LOCATION_PREFIXES = [
  'NXS1-EGL-24%',
  'NXS1-EGL-23%',
  'NXS1-EGL-22%',
  'NXS1-EGL-21%',
  'NXS1-EGL-20%',
  'NXS1-EGL-05%',
  'NXS1-PL-01%',
  'NXS1-PL-10%',
  'NXS1-PL-40%',
  'NXS1-PL-11%',
];
const LOCATIONS = LOCATION_PREFIXES.map((prefix) => prefix.replace(/%+$/, ''));
const QUERY_PATH = path.join(
  process.cwd(),
  'src',
  'utils',
  'resources',
  'bigquery',
  'queries',
  'reserve-inventory.sql',
);
const CACHE_PATH = process.env.RESERVE_INVENTORY_CACHE_PATH || path.join(
  process.cwd(),
  'data',
  'cache',
  'reserve-inventory.json',
);

type DateRange = { startDate: string; endDate: string };
type InventoryRow = {
  date: string;
  itemType: string;
  location: string;
  inward: number;
  outward: number;
  inventory: number;
};
type CacheEntry = {
  schemaVersion: number;
  coverage: DateRange;
  locations: string[];
  data: InventoryRow[];
  generatedAt: string;
  expiresAt: number;
};
type CacheStatus = 'hit' | 'miss' | 'stale' | 'refreshed';

let queryPromise: Promise<string> | null = null;
let diskCachePromise: Promise<void> | null = null;
let lastForceRefresh = 0;
const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

function loadQuery() {
  queryPromise ??= readFile(QUERY_PATH, 'utf8').then((query) =>
    query.replaceAll('__DATA_PROJECT__', BIGQUERY_DATA_PROJECT_ID),
  );
  return queryPromise;
}

function dateAtUtc(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = dateAtUtc(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function shiftDate(value: string, days: number) {
  const shifted = dateAtUtc(value);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

function todayInIndia() {
  return new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
}

function parseCount(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function cacheKey(range: DateRange) {
  return `v${CACHE_SCHEMA_VERSION}|${range.startDate}|${range.endDate}`;
}

function recentCoverage(): DateRange {
  const endDate = todayInIndia();
  return { startDate: shiftDate(endDate, -(DEFAULT_RANGE_DAYS - 1)), endDate };
}

function queryCoverage(requested: DateRange): DateRange {
  const recent = recentCoverage();
  return requested.startDate >= recent.startDate && requested.endDate <= recent.endDate
    ? recent
    : requested;
}

function parseRange(request: Request): DateRange | NextResponse {
  const url = new URL(request.url);
  const useDefaultRange = !url.searchParams.has('startDate') && !url.searchParams.has('endDate');
  const defaults = useDefaultRange ? recentCoverage() : null;
  const startDate = url.searchParams.get('startDate') || defaults?.startDate || '';
  const endDate = url.searchParams.get('endDate') || defaults?.endDate || '';
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return NextResponse.json(
      { error: 'startDate and endDate must use YYYY-MM-DD.' },
      { status: 400 },
    );
  }
  const rangeDays = Math.floor(
    (dateAtUtc(endDate).getTime() - dateAtUtc(startDate).getTime()) / DAY_MS,
  ) + 1;
  if (!Number.isFinite(rangeDays) || rangeDays < 1 || rangeDays > MAX_RANGE_DAYS) {
    return NextResponse.json(
      { error: `Select a date range between 1 and ${MAX_RANGE_DAYS} days.` },
      { status: 400 },
    );
  }
  if (endDate > todayInIndia()) {
    return NextResponse.json({ error: 'endDate cannot be in the future.' }, { status: 400 });
  }
  return { startDate, endDate };
}

function isInventoryRow(value: unknown): value is InventoryRow {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<InventoryRow>;
  return typeof row.date === 'string'
    && typeof row.itemType === 'string'
    && typeof row.location === 'string'
    && typeof row.inward === 'number'
    && typeof row.outward === 'number'
    && typeof row.inventory === 'number';
}

function isCacheEntry(value: unknown): value is CacheEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<CacheEntry>;
  return Boolean(
    entry.schemaVersion === CACHE_SCHEMA_VERSION
    && entry.coverage
    && isValidDate(entry.coverage.startDate)
    && isValidDate(entry.coverage.endDate)
    && Array.isArray(entry.locations)
    && entry.locations.every((location) => typeof location === 'string')
    && Array.isArray(entry.data)
    && entry.data.every(isInventoryRow)
    && typeof entry.generatedAt === 'string'
    && typeof entry.expiresAt === 'number',
  );
}

async function loadDiskCache() {
  diskCachePromise ??= (async () => {
    try {
      const parsed = JSON.parse(await readFile(CACHE_PATH, 'utf8')) as unknown;
      if (!isCacheEntry(parsed)) throw new Error('invalid cache payload');
      memoryCache.set(cacheKey(parsed.coverage), parsed);
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error
        ? String((error as { code?: unknown }).code || '')
        : '';
      if (code !== 'ENOENT') {
        console.warn('[stock-in/reserve-inventory] ignored unreadable disk cache:', error);
      }
    }
  })();
  await diskCachePromise;
}

async function persistRecentCache(entry: CacheEntry) {
  const recent = recentCoverage();
  if (cacheKey(entry.coverage) !== cacheKey(recent)) return;
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  const temporary = `${CACHE_PATH}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, JSON.stringify(entry), 'utf8');
  await rename(temporary, CACHE_PATH);
}

function remember(key: string, entry: CacheEntry) {
  memoryCache.delete(key);
  memoryCache.set(key, entry);
  while (memoryCache.size > MAX_MEMORY_ENTRIES) {
    const oldest = memoryCache.keys().next().value as string | undefined;
    if (!oldest) break;
    memoryCache.delete(oldest);
  }
}

async function generateDataset(coverage: DateRange): Promise<CacheEntry> {
  const query = await loadQuery();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);
  try {
    const { rows } = await runBigQuery(
      query,
      20_000,
      {
        start_date: coverage.startDate,
        end_date: coverage.endDate,
        location_prefixes: LOCATION_PREFIXES,
      },
      { signal: controller.signal, jobTimeoutMs: QUERY_TIMEOUT_MS },
    );
    const generatedAt = new Date().toISOString();
    return {
      schemaVersion: CACHE_SCHEMA_VERSION,
      coverage,
      locations: LOCATIONS,
      data: rows.map((row) => ({
        date: String(row.inventory_date || ''),
        itemType: String(row.item_type || 'Unclassified'),
        location: String(row.location || ''),
        inward: parseCount(row.inward),
        outward: parseCount(row.outward),
        inventory: parseCount(row.inventory),
      })),
      generatedAt,
      expiresAt: Date.parse(generatedAt) + CACHE_TTL_MS,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function refreshDataset(coverage: DateRange): Promise<CacheEntry> {
  const key = cacheKey(coverage);
  const active = inflight.get(key);
  if (active) return active;
  const refresh = generateDataset(coverage)
    .then(async (entry) => {
      remember(key, entry);
      await persistRecentCache(entry);
      return entry;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, refresh);
  return refresh;
}

async function resolveDataset(
  coverage: DateRange,
  force: boolean,
): Promise<{ entry: CacheEntry; status: CacheStatus; warning?: string }> {
  await loadDiskCache();
  const key = cacheKey(coverage);
  const existing = memoryCache.get(key);
  if (!force && existing) {
    if (existing.expiresAt > Date.now()) return { entry: existing, status: 'hit' };
    void refreshDataset(coverage).catch((error) => {
      console.error('[stock-in/reserve-inventory] background refresh failed:', error);
    });
    return {
      entry: existing,
      status: 'stale',
      warning: 'Showing the last successful snapshot while Reserve Inventory refreshes in the background.',
    };
  }
  if (force && existing) {
    void refreshDataset(coverage).catch((error) => {
      console.error('[stock-in/reserve-inventory] forced background refresh failed:', error);
    });
    return {
      entry: existing,
      status: 'stale',
      warning: 'Source refresh started; showing the last successful snapshot while it completes in the background.',
    };
  }
  try {
    return {
      entry: await refreshDataset(coverage),
      status: force ? 'refreshed' : 'miss',
    };
  } catch (error) {
    if (existing) {
      console.error('[stock-in/reserve-inventory] refresh failed; serving stale cache:', error);
      return {
        entry: existing,
        status: 'stale',
        warning: 'Refresh failed; showing the last successful Reserve Inventory snapshot.',
      };
    }
    throw error;
  }
}

async function respond(request: Request, force: boolean) {
  const parsed = parseRange(request);
  if (parsed instanceof NextResponse) return parsed;
  if (force) {
    const now = Date.now();
    if (now - lastForceRefresh < FORCE_REFRESH_COOLDOWN_MS) {
      return NextResponse.json(
        { error: 'Reserve Inventory was refreshed recently. Try again in a few seconds.' },
        { status: 429, headers: { 'Retry-After': '30' } },
      );
    }
    lastForceRefresh = now;
  }

  try {
    const coverage = queryCoverage(parsed);
    const resolved = await resolveDataset(coverage, force);
    const data = resolved.entry.data.filter(
      (row) => row.date >= parsed.startDate && row.date <= parsed.endDate,
    );
    return NextResponse.json(
      {
        range: parsed,
        timeZone: WAREHOUSE_TIME_ZONE,
        locations: resolved.entry.locations,
        data,
        generatedAt: resolved.entry.generatedAt,
        cache: {
          status: resolved.status,
          coverage: resolved.entry.coverage,
          expiresAt: new Date(resolved.entry.expiresAt).toISOString(),
        },
        ...(resolved.warning ? { warning: resolved.warning } : {}),
      },
      {
        headers: {
          'Cache-Control': 'private, no-store',
          'X-Reserve-Inventory-Cache': resolved.status,
        },
      },
    );
  } catch (error) {
    console.error('[stock-in/reserve-inventory] BigQuery failed:', error);
    return NextResponse.json(
      { error: 'Unable to load reserve inventory from BigQuery.' },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  return respond(request, false);
}

export async function POST(request: Request) {
  return respond(request, true);
}
