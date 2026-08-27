import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  rollingStockInAnalyticsRange,
  stockInAnalyticsRangeElapsedMinutes,
  type StockInAnalyticsRange,
} from '@/lib/server/stockInAnalyticsRange';

const CACHE_SCHEMA_VERSION = 1;
const CACHE_TTL_MS = 10 * 60_000;
const FORCE_REFRESH_COOLDOWN_MS = 60_000;
const BACKGROUND_RETRY_COOLDOWN_MS = 5 * 60_000;
const ROLLING_WINDOW_MINUTES = 48 * 60;
const CACHE_PATH = process.env.BERMUDA_TRIANGLE_ANALYTICS_CACHE_PATH || path.join(
  process.cwd(),
  'data',
  'cache',
  'bermuda-triangle-analytics.json',
);

export type BermudaTriangleInboundRow = {
  date: string;
  itemType: string;
  inputScope: string;
  inbound: number;
  fromEglPl: number;
  direct: number;
};

export type BermudaTriangleOutwardRow = {
  date: string;
  itemType: string;
  outputScope: string;
  outward: number;
};

export type BermudaTriangleAnalyticsPayload = {
  timeZone: string;
  destination: {
    key: string;
    label: string;
    facility: string | null;
  };
  inputScopes: string[];
  outputScopes: string[];
  data: BermudaTriangleInboundRow[];
  outwardData: BermudaTriangleOutwardRow[];
};

type CacheEntry = {
  schemaVersion: number;
  preset: 'rolling48h';
  coverage: StockInAnalyticsRange;
  payload: BermudaTriangleAnalyticsPayload;
  generatedAt: string;
  expiresAt: number;
};

export type BermudaTriangleCacheStatus = 'hit' | 'stale' | 'miss' | 'refreshed';

export type BermudaTriangleCacheResolution = {
  entry: CacheEntry;
  status: BermudaTriangleCacheStatus;
  refreshing: boolean;
  warning?: string;
};

type CacheState = {
  diskLoad: Promise<void> | null;
  entry: CacheEntry | null;
  refresh: Promise<CacheEntry> | null;
  lastRefreshStartedAt: number;
  lastRefreshSettledAt: number;
  lastForceRefreshStartedAt: number;
};

declare global {
  // A global coordinator survives Next.js development HMR and coalesces work
  // across duplicate evaluations of this module in the same Node process.
  var __nexsBermudaTriangleAnalyticsCache: CacheState | undefined;
}

const state = globalThis.__nexsBermudaTriangleAnalyticsCache ??= {
  diskLoad: null,
  entry: null,
  refresh: null,
  lastRefreshStartedAt: 0,
  lastRefreshSettledAt: 0,
  lastForceRefreshStartedAt: 0,
};
// Keep HMR state created by an older module evaluation forward-compatible.
state.lastRefreshStartedAt ??= 0;
state.lastRefreshSettledAt ??= 0;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isValidDateTimePart(date: unknown, time: unknown) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (typeof time !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return false;
  const parsed = new Date(`${date}T${time}:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 16) === `${date}T${time}`;
}

function isRollingCoverage(value: unknown): value is StockInAnalyticsRange {
  if (!value || typeof value !== 'object') return false;
  const range = value as Partial<StockInAnalyticsRange>;
  if (
    !isValidDateTimePart(range.startDate, range.startTime)
    || !isValidDateTimePart(range.endDate, range.endTime)
  ) return false;
  return stockInAnalyticsRangeElapsedMinutes(range as StockInAnalyticsRange) === ROLLING_WINDOW_MINUTES;
}

function isInboundRow(value: unknown): value is BermudaTriangleInboundRow {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<BermudaTriangleInboundRow>;
  return isValidDate(row.date)
    && typeof row.itemType === 'string'
    && typeof row.inputScope === 'string'
    && isFiniteNumber(row.inbound)
    && isFiniteNumber(row.fromEglPl)
    && isFiniteNumber(row.direct);
}

function isOutwardRow(value: unknown): value is BermudaTriangleOutwardRow {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<BermudaTriangleOutwardRow>;
  return isValidDate(row.date)
    && typeof row.itemType === 'string'
    && typeof row.outputScope === 'string'
    && isFiniteNumber(row.outward);
}

function isPayload(value: unknown): value is BermudaTriangleAnalyticsPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<BermudaTriangleAnalyticsPayload>;
  const destination = payload.destination;
  return payload.timeZone === 'Asia/Kolkata'
    && Boolean(destination)
    && destination?.key === 'bermuda-triangle'
    && typeof destination?.label === 'string'
    && destination?.facility === 'NXS1'
    && Array.isArray(payload.inputScopes)
    && payload.inputScopes.every((scope) => typeof scope === 'string')
    && Array.isArray(payload.outputScopes)
    && payload.outputScopes.every((scope) => typeof scope === 'string')
    && Array.isArray(payload.data)
    && payload.data.every(isInboundRow)
    && Array.isArray(payload.outwardData)
    && payload.outwardData.every(isOutwardRow);
}

function isCacheEntry(value: unknown): value is CacheEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<CacheEntry>;
  const generatedAt = typeof entry.generatedAt === 'string'
    ? Date.parse(entry.generatedAt)
    : Number.NaN;
  return entry.schemaVersion === CACHE_SCHEMA_VERSION
    && entry.preset === 'rolling48h'
    && isRollingCoverage(entry.coverage)
    && isPayload(entry.payload)
    && Number.isFinite(generatedAt)
    && isFiniteNumber(entry.expiresAt)
    && entry.expiresAt === generatedAt + CACHE_TTL_MS;
}

async function loadDiskCache() {
  state.diskLoad ??= (async () => {
    try {
      const parsed = JSON.parse(await readFile(CACHE_PATH, 'utf8')) as unknown;
      if (!isCacheEntry(parsed)) throw new Error('invalid cache payload');
      state.entry = parsed;
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error
        ? String((error as { code?: unknown }).code || '')
        : '';
      if (code !== 'ENOENT') {
        console.warn('[stock-in/bermuda-triangle-analytics] ignored unreadable disk cache:', error);
      }
    }
  })();
  await state.diskLoad;
}

async function persistCache(entry: CacheEntry) {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true });
  const temporary = `${CACHE_PATH}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(entry), 'utf8');
    await rename(temporary, CACHE_PATH);
  } catch (error) {
    await unlink(temporary).catch(() => undefined);
    throw error;
  }
}

function refreshSnapshot(
  generate: (coverage: StockInAnalyticsRange) => Promise<BermudaTriangleAnalyticsPayload>,
) {
  if (state.refresh) return state.refresh;

  // Capture one authoritative, exact 2,880-minute range when the warehouse
  // job starts. Callers never supply the range used for this preset.
  const coverage = rollingStockInAnalyticsRange();
  state.lastRefreshStartedAt = Date.now();
  const pending = generate(coverage).then(async (payload) => {
    const generatedAt = new Date().toISOString();
    const entry: CacheEntry = {
      schemaVersion: CACHE_SCHEMA_VERSION,
      preset: 'rolling48h',
      coverage,
      payload,
      generatedAt,
      expiresAt: Date.parse(generatedAt) + CACHE_TTL_MS,
    };
    try {
      await persistCache(entry);
    } catch (error) {
      // A successful warehouse result is still useful in this process. The
      // persistence failure is visible in logs and can be retried next refresh.
      console.error('[stock-in/bermuda-triangle-analytics] cache persistence failed:', error);
    }
    state.entry = entry;
    return entry;
  });

  // Clear the shared slot on either settlement path without creating an
  // ignored rejecting Promise (a common source of unhandled rejections).
  const tracked = pending.then(
    (entry) => {
      if (state.refresh === tracked) state.refresh = null;
      state.lastRefreshSettledAt = Date.now();
      return entry;
    },
    (error) => {
      if (state.refresh === tracked) state.refresh = null;
      state.lastRefreshSettledAt = Date.now();
      throw error;
    },
  );
  state.refresh = tracked;
  return tracked;
}

function refreshInBackground(
  generate: (coverage: StockInAnalyticsRange) => Promise<BermudaTriangleAnalyticsPayload>,
  label: string,
) {
  void refreshSnapshot(generate).catch((error) => {
    // The previous valid snapshot remains available. Failed results are never
    // written to memory or disk.
    console.error(`[stock-in/bermuda-triangle-analytics] ${label} failed:`, error);
  });
}

export async function resolveRollingBermudaTriangleAnalytics(
  generate: (coverage: StockInAnalyticsRange) => Promise<BermudaTriangleAnalyticsPayload>,
  force = false,
): Promise<BermudaTriangleCacheResolution> {
  await loadDiskCache();
  const existing = state.entry;

  if (!force && existing?.expiresAt && existing.expiresAt > Date.now()) {
    return { entry: existing, status: 'hit', refreshing: false };
  }

  if (existing) {
    if (force) {
      const now = Date.now();
      const coolingDown = now - state.lastForceRefreshStartedAt < FORCE_REFRESH_COOLDOWN_MS;
      if (!coolingDown) {
        state.lastForceRefreshStartedAt = now;
        refreshInBackground(generate, 'forced background refresh');
      }
      return {
        entry: existing,
        status: 'stale',
        refreshing: Boolean(state.refresh),
        warning: coolingDown
          ? 'A Bermuda Triangle refresh was started recently; showing the last successful snapshot.'
          : 'Refresh started; showing the last successful Bermuda Triangle snapshot while it completes.',
      };
    }

    const refreshRunning = Boolean(state.refresh);
    const retryCoolingDown = !refreshRunning
      && state.lastRefreshSettledAt > 0
      && Date.now() - state.lastRefreshSettledAt < BACKGROUND_RETRY_COOLDOWN_MS;
    if (!refreshRunning && !retryCoolingDown) {
      refreshInBackground(generate, 'background refresh');
    }
    return {
      entry: existing,
      status: 'stale',
      refreshing: Boolean(state.refresh),
      warning: retryCoolingDown
        ? 'Showing the last successful Bermuda Triangle snapshot; the next refresh retry will start shortly.'
        : 'Showing the last successful Bermuda Triangle snapshot while it refreshes in the background.',
    };
  }

  if (force) state.lastForceRefreshStartedAt = Date.now();
  return {
    entry: await refreshSnapshot(generate),
    status: force ? 'refreshed' : 'miss',
    refreshing: false,
  };
}
