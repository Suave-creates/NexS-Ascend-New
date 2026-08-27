import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { NextResponse } from 'next/server';
import {
  buildCancellationDashboard,
  normalizeCancellationId,
  type CancellationExtract,
} from '@/lib/orderCancellation';
import {
  getNexsToken,
  invalidateNexsToken,
  nexsAuthConfigured,
} from '@/utils/resources/nexs/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 31;
const CACHE_TTL_MS = 5 * 60_000;
const MAX_CACHE_ENTRIES = 12;
const MAX_CONCURRENT_REFRESHES = 1;
const FORCE_REFRESH_COOLDOWN_MS = 30_000;
const PORTAL_LOOKBACK_DAYS = 31;
const PORTAL_TIMEOUT_MS = 60_000;
const PYTHON = process.env.ORDER_CANCELLATION_PYTHON || process.env.NDD_RCA_PYTHON || 'python';
const SCRIPT_PATH = path.join(
  process.cwd(),
  'src',
  'app',
  'api',
  'planning-and-process-excellence',
  'order-cancellation',
  'fetch_data.py',
);
const PORTAL_URL =
  'https://app.nexs.lenskart.com/nexs/analytics/monitoring/order-cancellation/requests/search';
const PORTAL_PAGE_SIZE = 35;

type DashboardPayload = ReturnType<typeof buildCancellationDashboard> & {
  range: { startDate: string; endDate: string };
  generatedAt: string;
};

type CacheEntry = { expiresAt: number; payload: DashboardPayload };
const processState = globalThis as typeof globalThis & {
  orderCancellationCache?: Map<string, CacheEntry>;
  orderCancellationInflight?: Map<string, Promise<DashboardPayload>>;
  orderCancellationLastForce?: Map<string, number>;
};
const cache = processState.orderCancellationCache ||= new Map<string, CacheEntry>();
const inflight = processState.orderCancellationInflight ||= new Map<string, Promise<DashboardPayload>>();
const lastForcedRefresh = processState.orderCancellationLastForce ||= new Map<string, number>();

function dateAtUtc(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function shiftIsoDate(value: string, days: number): string {
  const shifted = dateAtUtc(value);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

function istTimestamp(): string {
  const value = new Date(Date.now() + 330 * 60_000).toISOString();
  return `${value.slice(0, 10)} ${value.slice(11, 19)}`;
}

function withDeadline<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

function extractorError(stderr: string): string {
  const lines = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Signed in as:'));
  return lines.at(-1) || 'The Power BI extractor did not complete.';
}

function runExtractor(startDate: string, endDate: string): Promise<CancellationExtract> {
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
      reject(new Error('The Power BI request exceeded the 3-minute timeout.'));
    }, 180_000);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
      if (stdout.length > 50 * 1024 * 1024 && !settled) {
        settled = true;
        clearTimeout(timeout);
        child.kill();
        reject(new Error('The Power BI response exceeded the safe size limit.'));
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
      reject(new Error(`Could not start the cancellation extractor: ${error.message}`));
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
        resolve(JSON.parse(stdout) as CancellationExtract);
      } catch {
        reject(new Error('The cancellation extractor returned invalid JSON.'));
      }
    });
  });
}

type PortalResult = { orderIds: Set<string>; status: 'ok' | 'unavailable'; warnings: string[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parsePortalPage(value: unknown) {
  if (!isObject(value) || !isObject(value.data) || !Array.isArray(value.data.records)) {
    throw new Error('the response did not contain data.records');
  }
  if (!value.data.records.every(isObject)) {
    throw new Error('the response contained malformed request records');
  }
  const totalRecords = Number(value.data.totalRecords);
  const pageSize = Number(value.data.pageSize);
  if (!Number.isFinite(totalRecords) || totalRecords < 0) {
    throw new Error('the response did not contain a valid totalRecords value');
  }
  return {
    records: value.data.records as Array<Record<string, unknown>>,
    totalRecords,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : PORTAL_PAGE_SIZE,
  };
}

function browserJwt(request: Request): string | null {
  return request.headers.get('cookie')?.match(/(?:^|;\s*)jwt-token=([^;]+)/)?.[1] || null;
}

function portalCacheScope(request: Request): string {
  if (nexsAuthConfigured()) return 'server';
  const token = browserJwt(request);
  return token
    ? `browser:${createHash('sha256').update(token).digest('hex').slice(0, 16)}`
    : 'unavailable';
}

async function fetchPortalEvidence(
  request: Request,
  startDate: string,
  endDate: string,
): Promise<PortalResult> {
  const portalDeadline = Date.now() + PORTAL_TIMEOUT_MS;
  const requestJwt = browserJwt(request);
  const appId = process.env.NEXS_APP_ID || 'nexs-analytics';
  const serverLoginConfigured = nexsAuthConfigured();
  let cookie: string | null = null;
  let loginError = '';
  try {
    const token = await withDeadline(
      getNexsToken(appId),
      15_000,
      'NexS server login timed out.',
    );
    if (token) cookie = `jwt-token=${token}`;
  } catch (error) {
    loginError = (error as Error).message;
  }
  if (!cookie && !serverLoginConfigured && requestJwt) cookie = `jwt-token=${requestJwt}`;
  if (!cookie) {
    if (loginError) {
      console.error('[planning/order-cancellation] NexS login failed:', loginError);
      return {
        orderIds: new Set(),
        status: 'unavailable',
        warnings: ['Cancellation Portal server login is unavailable.'],
      };
    }
    return {
      orderIds: new Set(),
      status: 'unavailable',
      warnings: [
        serverLoginConfigured
          ? 'Cancellation Portal evidence is unavailable because NexS server login did not return a token.'
          : 'Cancellation Portal evidence is unavailable because NexS server login is not configured.',
      ],
    };
  }

  const headers = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Cookie: cookie,
    Origin: 'https://app.nexs.lenskart.com',
    Referer: 'https://app.nexs.lenskart.com/nexs/analytics/monitoring/order-cancellation/requests/metrics',
    'facility-code': process.env.NEXS_FACILITY || 'NXS1',
    'workstation-id': process.env.NEXS_WORKSTATION || 'QC01',
    'source-domain': 'https://app.nexs.lenskart.com',
    'date-time': istTimestamp(),
  };

  const callPage = async (pageNo: number, requestHeaders = headers) => {
    const remainingMs = portalDeadline - Date.now();
    if (remainingMs <= 0) throw new Error('Cancellation Portal request timed out.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.min(20_000, remainingMs));
    try {
      const response = await fetch(PORTAL_URL, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          pageNo,
          pageSize: PORTAL_PAGE_SIZE,
          sortBy: 'createdAt',
          sortDirection: 'DESC',
          facilities: ['ALL'],
          dateFrom: `${shiftIsoDate(startDate, -PORTAL_LOOKBACK_DAYS)}T00:00:00+05:30`,
          dateTo: `${endDate}T23:59:59+05:30`,
        }),
        cache: 'no-store',
        signal: controller.signal,
      });
      return {
        ok: response.ok,
        status: response.status,
        page: response.ok ? parsePortalPage(await response.json()) : null,
      };
    } finally {
      clearTimeout(timeout);
    }
  };

  try {
    let first = await callPage(0);
    if (first.status === 401) {
      invalidateNexsToken(appId);
      const token = await withDeadline(
        getNexsToken(appId, true),
        15_000,
        'NexS server login retry timed out.',
      );
      if (token) {
        cookie = `jwt-token=${token}`;
        first = await callPage(0, { ...headers, Cookie: cookie || headers.Cookie });
      }
    }
    if (!first.ok || !first.page) throw new Error(`HTTP ${first.status}`);

    const firstPage = first.page;
    const total = firstPage.totalRecords;
    const pageCount = Math.min(500, Math.ceil(total / firstPage.pageSize));
    const allRows: Array<Record<string, unknown>> = [...firstPage.records];
    for (let pageNo = 1; pageNo < pageCount; pageNo += 1) {
      const response = await callPage(pageNo, { ...headers, Cookie: cookie || headers.Cookie });
      if (!response.ok || !response.page) {
        throw new Error(`page ${pageNo + 1} returned HTTP ${response.status}`);
      }
      allRows.push(...response.page.records);
    }
    if (allRows.length < total) {
      throw new Error(`only ${allRows.length} of ${total} requests were returned`);
    }
    const orderIds = new Set(
      allRows
        .map((row) => normalizeCancellationId(row.orderId))
        .filter(Boolean),
    );
    if (allRows.length && !orderIds.size) {
      throw new Error('request records did not contain orderId values');
    }
    return {
      orderIds,
      status: 'ok',
      warnings: [],
    };
  } catch (error) {
    console.error('[planning/order-cancellation] portal evidence failed:', error);
    return {
      orderIds: new Set(),
      status: 'unavailable',
      warnings: ['Cancellation Portal evidence is unavailable. Dependent cases are marked for review.'],
    };
  }
}

async function generatePayload(
  request: Request,
  startDate: string,
  endDate: string,
): Promise<DashboardPayload> {
  const [extract, portal] = await Promise.all([
    runExtractor(startDate, endDate),
    fetchPortalEvidence(request, startDate, endDate),
  ]);
  return {
    range: { startDate, endDate },
    generatedAt: new Date().toISOString(),
    ...buildCancellationDashboard(extract, portal.orderIds, portal.status, portal.warnings),
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate') || '';
  const endDate = url.searchParams.get('endDate') || '';
  const force = url.searchParams.get('refresh') === '1';

  if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
    return NextResponse.json(
      { error: 'startDate and endDate must use YYYY-MM-DD.' },
      { status: 400 },
    );
  }
  const start = dateAtUtc(startDate);
  const end = dateAtUtc(endDate);
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start.toISOString().slice(0, 10) !== startDate ||
    end.toISOString().slice(0, 10) !== endDate
  ) {
    return NextResponse.json({ error: 'Select valid calendar dates.' }, { status: 400 });
  }
  const rangeDays = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (!Number.isFinite(rangeDays) || rangeDays < 1 || rangeDays > MAX_RANGE_DAYS) {
    return NextResponse.json(
      { error: `Select a date range between 1 and ${MAX_RANGE_DAYS} days.` },
      { status: 400 },
    );
  }

  const now = Date.now();
  for (const [cacheKey, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(cacheKey);
  }
  for (const [forceKey, refreshedAt] of lastForcedRefresh) {
    if (now - refreshedAt > CACHE_TTL_MS) lastForcedRefresh.delete(forceKey);
  }

  const key = `${startDate}:${endDate}:${portalCacheScope(request)}`;
  const hit = cache.get(key);
  const forceCoolingDown = force && now - (lastForcedRefresh.get(key) || 0) < FORCE_REFRESH_COOLDOWN_MS;
  if ((!force || forceCoolingDown) && hit && hit.expiresAt > now) {
    return NextResponse.json(hit.payload, { headers: { 'Cache-Control': 'no-store' } });
  }
  if (forceCoolingDown) {
    return NextResponse.json(
      { error: 'This date range was refreshed recently. Try again in a few seconds.' },
      { status: 429, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' } },
    );
  }

  try {
    let pending = inflight.get(key);
    if (!pending) {
      if (inflight.size >= MAX_CONCURRENT_REFRESHES) {
        return NextResponse.json(
          { error: 'Another order-cancellation refresh is already running. Try again shortly.' },
          { status: 429, headers: { 'Retry-After': '15', 'Cache-Control': 'no-store' } },
        );
      }
      if (force) lastForcedRefresh.set(key, now);
      pending = generatePayload(request, startDate, endDate);
      inflight.set(key, pending);
      const clearInflight = () => {
        if (inflight.get(key) === pending) inflight.delete(key);
      };
      void pending.then(clearInflight, clearInflight);
    }
    const payload = await pending;
    cache.delete(key);
    cache.set(key, { payload, expiresAt: Date.now() + CACHE_TTL_MS });
    while (cache.size > MAX_CACHE_ENTRIES) {
      const oldestKey = cache.keys().next().value as string | undefined;
      if (!oldestKey) break;
      cache.delete(oldestKey);
    }
    return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[planning/order-cancellation] refresh failed:', error);
    return NextResponse.json(
      { error: 'Unable to refresh order-cancellation data. Check server logs and source credentials.' },
      { status: 502 },
    );
  }
}
