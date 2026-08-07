import { prismaDispatch } from '@/utils/prismaDispatch';
import { getNexsToken, invalidateNexsToken } from '@/utils/resources/nexs/auth';

const TARGET = 'https://app.nexs.lenskart.com/nexs/analytics/monitoring/v3/details?version=v3';
const PAGE_SIZE = 100;
const CONCURRENCY = 6;
const FRESH_MS = 5 * 60_000;

export type CentralDumpStatus = {
  running: boolean; loaded: number; total: number; stored: number; removed: number;
  error: string | null; startedAt: string | null; completedAt: string | null;
  lastSuccessfulAt: string | null;
};

const globalState = globalThis as typeof globalThis & {
  clClsCentralDumpStatus?: CentralDumpStatus;
  clClsCentralDumpPromise?: Promise<void> | null;
  clClsCentralDumpTimer?: ReturnType<typeof setInterval>;
};

function state(): CentralDumpStatus {
  return globalState.clClsCentralDumpStatus ||= {
    running: false, loaded: 0, total: 0, stored: 0, removed: 0,
    error: null, startedAt: null, completedAt: null, lastSuccessfulAt: null,
  };
}

export function getCentralDumpStatus() { return { ...state() }; }

export function ensureCentralDump(force = false) {
  const s = state();
  const completed = s.completedAt ? new Date(s.completedAt).getTime() : 0;
  if (s.running || (!force && completed && Date.now() - completed < FRESH_MS)) return getCentralDumpStatus();
  s.running = true; s.loaded = 0; s.total = 0; s.stored = 0; s.removed = 0;
  s.error = null; s.startedAt = new Date().toISOString();
  globalState.clClsCentralDumpPromise = refresh().finally(() => { globalState.clClsCentralDumpPromise = null; });
  return getCentralDumpStatus();
}

if (!globalState.clClsCentralDumpTimer) {
  globalState.clClsCentralDumpTimer = setInterval(() => { ensureCentralDump(); }, FRESH_MS);
  globalState.clClsCentralDumpTimer.unref?.();
}

function requestBody(page: number) {
  return {
    page, pageSize: PAGE_SIZE, globalSearch: '', category: 'FULFILLABLE_ORDERS',
    status: 'Order QC', frTag: 'BULK', version: 'v3',
    monitorPanelFilters: {
      binaryFilter: {}, singleSelectFilters: { errorType: '' },
      monitorPanelRangeFilters: {
        ageingSinceCreated: { startValue: 0, endValue: '-1' },
        ageingSinceLastUpdate: { startValue: 0, endValue: '-1' },
        date: { startValue: '', endValue: '' },
      },
      multiSelectFilters: { pickingPriority: [], qcStatus: [], itemType: ['CONTACT_LENS', 'CONTACT_LENS_SOLUTION'], orderChannel: [] },
    },
  };
}

async function fetchPage(page: number, retry = true): Promise<{ rows: Record<string, unknown>[]; total: number }> {
  const token = await getNexsToken();
  if (!token) throw new Error('Central NexS dump credentials are not configured');
  const response = await fetch(TARGET, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', Accept: 'application/json, text/plain, */*',
      Cookie: `jwt-token=${token}`, Origin: 'https://app.nexs.lenskart.com', Referer: 'https://app.nexs.lenskart.com/monitor',
      'facility-code': process.env.NEXS_FACILITY || 'NXS1', 'workstation-id': process.env.NEXS_WORKSTATION || 'QC01',
      'source-domain': 'https://app.nexs.lenskart.com',
    },
    body: JSON.stringify(requestBody(page)),
  });
  if (response.status === 401 && retry) {
    invalidateNexsToken(); await getNexsToken(undefined, true); return fetchPage(page, false);
  }
  if (!response.ok) throw new Error(`Central dump page ${page + 1} failed: HTTP ${response.status}`);
  const json = await response.json();
  return { rows: Array.isArray(json?.data?.data) ? json.data.data : [], total: Number(json?.data?.total) || 0 };
}

async function refresh() {
  const s = state();
  try {
    const first = await fetchPage(0);
    const pages: Record<string, unknown>[][] = [first.rows];
    s.total = first.total || first.rows.length; s.loaded = first.rows.length;
    const pageCount = Math.ceil(s.total / PAGE_SIZE);
    for (let start = 1; start < pageCount; start += CONCURRENCY) {
      const indexes = Array.from({ length: Math.min(CONCURRENCY, pageCount - start) }, (_, i) => start + i);
      const batch = await Promise.all(indexes.map(page => fetchPage(page)));
      for (const result of batch) pages.push(result.rows);
      s.loaded = pages.reduce((sum, rows) => sum + rows.length, 0);
    }
    const allRows = pages.flat();
    if (s.total > 0 && allRows.length < s.total) throw new Error(`Incomplete central dump: ${allRows.length}/${s.total}`);

    const value = (v: unknown) => v == null || v === '' ? null : String(v);
    const unique = new Map<string, { barcode: string; fitting: string | null; pkg: string }>();
    for (const row of allRows) {
      const barcode = value(row['Barcode']); const pkg = value(row['Shipping Package ID']);
      if (barcode && pkg) unique.set(barcode, { barcode, pkg, fitting: value(row['Fitting ID']) });
    }
    const stamp = new Date(); const entries = [...unique.values()];
    for (let i = 0; i < entries.length; i += 300) {
      const chunk = entries.slice(i, i + 300);
      await prismaDispatch.$executeRawUnsafe(
        `INSERT INTO cl_cls_qc_queue_entries (barcode, fitting_id, shipping_package_id, last_seen_at)
         VALUES ${chunk.map(() => '(?,?,?,?)').join(',')}
         ON DUPLICATE KEY UPDATE fitting_id=VALUES(fitting_id), shipping_package_id=VALUES(shipping_package_id), last_seen_at=VALUES(last_seen_at)`,
        ...chunk.flatMap(entry => [entry.barcode, entry.fitting, entry.pkg, stamp]),
      );
    }
    const removed = await prismaDispatch.clClsQcQueueEntry.deleteMany({ where: { lastSeenAt: { lt: stamp }, state: { not: 'RUNNING' } } });
    s.loaded = allRows.length; s.stored = entries.length; s.removed = removed.count;
    s.lastSuccessfulAt = new Date().toISOString();
  } catch (error) {
    s.error = error instanceof Error ? error.message : String(error);
  } finally {
    s.running = false; s.completedAt = new Date().toISOString();
  }
}
