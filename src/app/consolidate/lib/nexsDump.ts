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

function body(page: number, pageSize: number) {
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

function headers(ctx: DumpContext): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'facility-code': ctx.facility || 'NXS1',
    'workstation-id': ctx.workstation || 'QC01',
    'source-domain': 'https://app.nexs.lenskart.com',
  };
}

export interface DumpResult {
  rows: Record<string, unknown>[];
  total: number;
  pages: number;
}

/** Paginate the full Order QC dump via the proxy. Throws on the first failed page. */
export async function loadOrderQcDump(ctx: DumpContext): Promise<DumpResult> {
  const rows: Record<string, unknown>[] = [];
  let total = 0;
  let page = 1;

  for (; page <= MAX_PAGES; page++) {
    const res = await fetch('/api/consolidate/nexs-proxy/order-qc', {
      method: 'POST',
      headers: headers(ctx),
      body: JSON.stringify(body(page, PAGE_SIZE)),
    });
    if (!res.ok) {
      throw new Error(`Dump page ${page} failed: HTTP ${res.status}`);
    }
    const json = await res.json();
    const data = json?.data ?? {};
    const pageRows: Record<string, unknown>[] = Array.isArray(data.data) ? data.data : [];
    if (typeof data.total === 'number') total = data.total;
    rows.push(...pageRows);

    if (pageRows.length === 0 || rows.length >= total) break;
  }

  return { rows, total, pages: page };
}

/** Push a full snapshot to the ingest endpoint (upsert + reconcile). */
export async function syncDump(rows: Record<string, unknown>[]) {
  const res = await fetch('/api/consolidate/qc-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) throw new Error(`qc-sync failed: HTTP ${res.status}`);
  return res.json();
}
