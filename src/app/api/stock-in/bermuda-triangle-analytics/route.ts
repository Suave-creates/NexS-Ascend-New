import { NextResponse } from 'next/server';
import {
  resolveRollingBermudaTriangleAnalytics,
  type BermudaTriangleAnalyticsPayload,
} from '@/lib/server/bermudaTriangleAnalyticsCache';
import { loadBermudaTriangleAnalyticsQuery } from '@/lib/server/bermudaTriangleAnalyticsQuery';
import { stockInAnalyticsDestinationByKey } from '@/lib/server/stockInAnalyticsDestinations';
import {
  STOCK_IN_ANALYTICS_TIME_ZONE,
  stockInAnalyticsRange,
} from '@/lib/server/stockInAnalyticsRange';
import { runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 900;

const MAIN_JOB_TIMEOUT_MS = 10 * 60_000;
const RESULT_CACHE_TTL_MS = 30_000;
const RESULT_CACHE_MAX_ENTRIES = 12;

type QueryResult = Awaited<ReturnType<typeof runBigQuery>>;
type CachedResult = { expiresAt: number; result: QueryResult };

type ExactRangeCacheState = {
  resultCache: Map<string, CachedResult>;
  inFlightQueries: Map<string, Promise<QueryResult>>;
};

declare global {
  var __nexsBermudaTriangleExactRangeCache: ExactRangeCacheState | undefined;
}

const exactRangeCache = globalThis.__nexsBermudaTriangleExactRangeCache ??= {
  resultCache: new Map<string, CachedResult>(),
  inFlightQueries: new Map<string, Promise<QueryResult>>(),
};
const { resultCache, inFlightQueries } = exactRangeCache;

function parseCount(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pruneResultCache(now: number) {
  for (const [key, cached] of resultCache) {
    if (cached.expiresAt <= now) resultCache.delete(key);
  }
}

async function analyticsQuery(
  cacheKey: string,
  parameters: Parameters<typeof runBigQuery>[2],
) {
  const now = Date.now();
  pruneResultCache(now);
  const cached = resultCache.get(cacheKey);
  if (cached) return cached.result;

  const existing = inFlightQueries.get(cacheKey);
  if (existing) return existing;

  const pending = loadBermudaTriangleAnalyticsQuery()
    .then((query) => runBigQuery(query, 20_000, parameters, {
      // The Promise is shared across callers. Do not bind it to one browser's
      // abort signal: an HMR/navigation abort must not reject every waiter and
      // launch a second multi-GB job. BigQuery still enforces this deadline.
      jobTimeoutMs: MAIN_JOB_TIMEOUT_MS,
    }));
  inFlightQueries.set(cacheKey, pending);

  try {
    const result = await pending;
    if (resultCache.size >= RESULT_CACHE_MAX_ENTRIES) {
      const oldestKey = resultCache.keys().next().value as string | undefined;
      if (oldestKey) resultCache.delete(oldestKey);
    }
    resultCache.set(cacheKey, {
      expiresAt: Date.now() + RESULT_CACHE_TTL_MS,
      result,
    });
    return result;
  } finally {
    // A rejection is deliberately never cached, so the next request can retry.
    if (inFlightQueries.get(cacheKey) === pending) inFlightQueries.delete(cacheKey);
  }
}

async function loadAnalyticsPayload(
  range: { startDate: string; startTime: string; endDate: string; endTime: string },
  useExactRangeMemoryCache: boolean,
): Promise<BermudaTriangleAnalyticsPayload> {
  const { startDate, startTime, endDate, endTime } = range;
  const destination = stockInAnalyticsDestinationByKey('bermuda-triangle');
  const cacheKey = `${startDate}T${startTime}|${endDate}T${endTime}`;
  const queryParameters = {
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
    destination_patterns: destination.locationPatterns,
    destination_facility: destination.facility || '',
    movement_direction: 'all',
    include_barcode_details: 'false',
  };
  const { rows } = useExactRangeMemoryCache
    ? await analyticsQuery(cacheKey, queryParameters)
    : await loadBermudaTriangleAnalyticsQuery().then((query) => runBigQuery(
      query,
      20_000,
      queryParameters,
      { jobTimeoutMs: MAIN_JOB_TIMEOUT_MS },
    ));

  const data = rows
    .filter((row) => String(row.movement_direction || '') === 'inbound')
    .map((row) => ({
      date: String(row.movement_date || ''),
      itemType: String(row.item_type || 'Unclassified'),
      inputScope: String(row.input_scope || 'Other'),
      inbound: parseCount(row.new_inbound_to_destination),
      fromEglPl: parseCount(row.count_ever_in_egl_pl),
      direct: parseCount(row.count_never_in_egl_pl),
    }));
  const outwardData = rows
    .filter((row) => String(row.movement_direction || '') === 'outward')
    .map((row) => ({
      date: String(row.movement_date || ''),
      itemType: String(row.item_type || 'Unclassified'),
      outputScope: String(row.output_scope || 'Other'),
      outward: parseCount(row.new_outward_from_destination),
    }));
  const inputScopes = [...new Set(data.map((row) => row.inputScope))]
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
  const outputScopes = [...new Set(outwardData.map((row) => row.outputScope))]
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  return {
    timeZone: STOCK_IN_ANALYTICS_TIME_ZONE,
    destination: {
      key: destination.key,
      label: destination.label,
      facility: destination.facility || null,
    },
    inputScopes,
    outputScopes,
    data,
    outwardData,
  };
}

function rollingResponse(
  resolved: Awaited<ReturnType<typeof resolveRollingBermudaTriangleAnalytics>>,
) {
  const { entry, status, refreshing, warning } = resolved;
  return NextResponse.json(
    {
      range: entry.coverage,
      ...entry.payload,
      generatedAt: entry.generatedAt,
      cache: {
        status,
        refreshing,
        expiresAt: new Date(entry.expiresAt).toISOString(),
        coverage: entry.coverage,
      },
      ...(warning ? { warning } : {}),
    },
    {
      headers: {
        'Cache-Control': 'private, no-store',
        'X-Bermuda-Triangle-Cache': status,
      },
    },
  );
}

async function respond(request: Request, force: boolean) {
  const url = new URL(request.url);
  const preset = url.searchParams.get('preset');
  const hasRangeParameters = ['startDate', 'startTime', 'endDate', 'endTime']
    .some((key) => url.searchParams.has(key));
  const rollingRequest = preset === 'rolling48h'
    || (!url.searchParams.has('preset') && !hasRangeParameters);
  if (url.searchParams.has('preset') && preset !== 'rolling48h') {
    return NextResponse.json({ error: 'preset must be rolling48h.' }, { status: 400 });
  }
  if (force && !rollingRequest) {
    return NextResponse.json(
      { error: 'POST refresh requires preset=rolling48h.' },
      { status: 400 },
    );
  }
  if (rollingRequest) {
    if (preset === 'rolling48h' && hasRangeParameters) {
      return NextResponse.json(
        { error: 'rolling48h is server-defined and cannot be combined with date or time parameters.' },
        { status: 400 },
      );
    }
    try {
      const resolved = await resolveRollingBermudaTriangleAnalytics(
        (coverage) => loadAnalyticsPayload(coverage, false),
        force,
      );
      return rollingResponse(resolved);
    } catch (error) {
      console.error('[stock-in/bermuda-triangle-analytics] rolling refresh failed:', error);
      return NextResponse.json(
        { error: 'Unable to load Bermuda Triangle analytics from BigQuery.' },
        { status: 502 },
      );
    }
  }

  const parsedRange = stockInAnalyticsRange(url.searchParams);
  if (!parsedRange.ok) {
    return NextResponse.json({ error: parsedRange.error }, { status: 400 });
  }
  const range = parsedRange.range;

  try {
    const payload = await loadAnalyticsPayload(range, true);
    return NextResponse.json({
      range,
      ...payload,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (request.signal.aborted) {
      return NextResponse.json({ error: 'Bermuda Triangle analytics request was cancelled.' }, { status: 499 });
    }
    console.error('[stock-in/bermuda-triangle-analytics] BigQuery failed:', error);
    return NextResponse.json(
      { error: 'Unable to load Bermuda Triangle analytics from BigQuery.' },
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
