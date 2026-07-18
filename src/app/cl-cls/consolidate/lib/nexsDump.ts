// src/app/consolidate/lib/nexsDump.ts
//
// Client-side loader for the "CL: Order QC" dump. Runs in the operator's browser
// and hits our server-side proxy (which forwards the NexS session cookie), then
// paginates every page. Mirrors the Tray Releaser NexS-proxy approach.

export interface DumpContext {
  facility: string;
  workstation: string;
}

const PAGE_SIZE = 35; // matches what the NexS panel sends
const MAX_PAGES = 500; // safety cap (~17.5k rows)
const PAGE_DELAY_MS = 500; // pace the proxy — don't hammer NexS with a burst of pages per run

function pageBody(page: number, pageSize: number) {
  return {
    page,
    pageSize,
    globalSearch: '',
    category: 'FULFILLABLE_ORDERS',
    status: 'Order QC',
    frTag: 'CL',
    version: 'v3',
    monitorPanelFilters: {
      binaryFilter: {},
      singleSelectFilters: { errorType: '' },
      monitorPanelRangeFilters: {
        ageingSinceCreated: { startValue: 0, endValue: '-1' },
        ageingSinceLastUpdate: { startValue: 0, endValue: '-1' },
        date: { startValue: '', endValue: '' },
      },
      multiSelectFilters: { pickingPriority: [], qcStatus: [], itemType: [], orderChannel: [] },
    },
  };
}

function nowStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function headers(ctx: DumpContext): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'facility-code': ctx.facility || 'NXS1',
    'workstation-id': ctx.workstation || 'QC01',
    'source-domain': 'https://app.nexs.lenskart.com',
    'date-time': nowStamp(),
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(ctx: DumpContext, page: number): Promise<{ rows: Record<string, unknown>[]; total: number }> {
  // Colocated with fetch-trays so the browser sends the same jwt-token cookie.
  const res = await fetch('/api/packing-dispatch/nexs-proxy/order-qc', {
    method: 'POST',
    headers: headers(ctx),
    body: JSON.stringify(pageBody(page, PAGE_SIZE)),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const data = json?.data ?? {};
  return {
    rows: Array.isArray(data.data) ? data.data : [],
    total: typeof data.total === 'number' ? data.total : 0,
  };
}

export interface DumpResult {
  rows: Record<string, unknown>[];
  total: number;
  pages: number;
}

/**
 * Paginate the full Order QC dump via the proxy. Each page gets one retry.
 * Terminates on a short page (page-shortness), so a missing/zero `total` cannot
 * truncate the snapshot after the first page.
 */
export async function loadOrderQcDump(ctx: DumpContext): Promise<DumpResult> {
  const rows: Record<string, unknown>[] = [];
  let total = 0;
  let page = 0; // NexS pages are 0-indexed (first page is page 0)

  for (; page < MAX_PAGES; page++) {
    let pageRes: { rows: Record<string, unknown>[]; total: number };
    try {
      pageRes = await fetchPage(ctx, page);
    } catch {
      await sleep(600);
      pageRes = await fetchPage(ctx, page); // single retry; throws to caller if it fails again
    }
    if (pageRes.total > 0) total = pageRes.total;
    rows.push(...pageRes.rows);

    if (pageRes.rows.length < PAGE_SIZE) break; // last page
    if (total > 0 && rows.length >= total) break; // reached known total
    await sleep(PAGE_DELAY_MS); // throttle between pages so the proxy isn't hammered
  }

  return { rows, total: total || rows.length, pages: page };
}

/** Push a full snapshot to the ingest endpoint (upsert + reconcile). */
export async function syncDump(rows: Record<string, unknown>[]) {
  const res = await fetch('/api/cl-cls/consolidate/qc-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) throw new Error(`qc-sync failed: HTTP ${res.status}`);
  return res.json();
}
