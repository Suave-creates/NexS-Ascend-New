/**
 * dashboard.js – DO Order Visibility v4
 *
 * Top metric bar  → dynamic status count cards (IN_PICKING, AWB_CREATED etc.)
 * Shipment View   → aging split (All | AWB Created) + shipments table
 * PID View        → qty metrics (Req/Picked/Pending/PIDs) + PID tiles + PID table
 */

const CFG = {
  baseUrl:      'https://app.nexs.lenskart.com',
  api1:         '/scripts/api/v1/order/channel/details',
  api2:         '/nexs/wms/api/v1/order/do/details',
  api3:         '/inbound/order-sensei/oms/api/v1/distributorOrder/search',
  api4:         '/nexs/api/catalog/v1/product/additionalDetails',
  facility:     'NXS1',
  channel:      'BULKTOVENDOR',
  workstationId:'7',
  lookbackDays: 7,
  pageSize:     500,
  maxPages:     10,
  batchSize:    5,
};

// Dashboard shows ONLY these DO types — every other type (and unmatched DOs) is hidden.
// Edit this list to change what the dashboard displays.
const ALLOWED_DO_TYPES  = ['AQUA_B2B', 'MARKETPLACE_B2B'];
const normDoType        = t => String(t ?? '').trim().toUpperCase().replace(/\s+/g, '_');
const isAllowedDoType   = t => ALLOWED_DO_TYPES.includes(normDoType(t));
const allowedTypesLabel = () => ALLOWED_DO_TYPES.map(t => t.replace(/_/g, ' ')).join(' or ');

const AGING_BUCKETS = [
  { label: '0 – 24 hrs',  crit: false, fn: r => r.ageHours < 24 },
  { label: '24 – 48 hrs', crit: false, fn: r => r.ageHours >= 24 && r.ageHours < 48 },
  { label: '48 – 72 hrs', crit: true,  fn: r => r.ageHours >= 48 && r.ageHours < 72 },
  { label: '72 – 96 hrs', crit: true,  fn: r => r.ageHours >= 72 && r.ageHours < 96 },
  { label: '96+ hrs',     crit: true,  fn: r => r.ageHours >= 96 },
];

// Colour palette for status cards — cycles if more than 6 statuses
const STATUS_COLORS = [
  { top:'#3B5BDB', val:'#3B5BDB', bg:'#EEF2FF', glow:'#3B5BDB' },
  { top:'#0D9488', val:'#0D9488', bg:'#F0FDFA', glow:'#0D9488' },
  { top:'#D97706', val:'#D97706', bg:'#FFFBEB', glow:'#D97706' },
  { top:'#7C3AED', val:'#7C3AED', bg:'#F5F3FF', glow:'#7C3AED' },
  { top:'#0077B6', val:'#0077B6', bg:'#E0F2FE', glow:'#0077B6' },
  { top:'#E03131', val:'#E03131', bg:'#FFF1F2', glow:'#E03131' },
];

let isFetching = false;
let _shipRows  = [];
let _pidRows   = [];
let _doTypeFilter = 'ALL';   // active DO Type filter for the shipment table
let _classFilter  = new Set();   // active Classification filter (PID view); empty = ALL

// ── Classification (from product additionalDetails hsnClassification / hsnCode) ──
// Buckets raw catalog values into the three ops-relevant categories.
const CLASS_CACHE = {};   // productId -> { classification, hsnCode, hsnClassification }

function classifyHsn(rawClass, hsnCode) {
  const s = String(rawClass || '').toLowerCase();
  const h = String(hsnCode  || '');
  // Prefer the descriptive hsnClassification string
  if (s.includes('solution') || s.includes('care')) return 'Contact Lens Solution';
  if (s.includes('contact'))                          return 'Contact Lens';
  if (s.includes('frame'))                            return 'Eyeframe';
  // Fallback: HSN code prefixes
  if (h.startsWith('900130'))                         return 'Contact Lens';
  if (h.startsWith('9003'))                           return 'Eyeframe';
  if (h.startsWith('3307') || h.startsWith('3808'))   return 'Contact Lens Solution';
  // Anything else keeps its raw label (e.g. sunglasses, spectacle lenses)
  if (s) return String(rawClass).replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return 'Unknown';
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  g('btnRefresh')           .addEventListener('click', startFetch);
  g('tab-btn-shipment')     .addEventListener('click', () => switchTab('shipment'));
  g('tab-btn-pid')          .addEventListener('click', () => switchTab('pid'));
  g('btnDlShipmentsInline') .addEventListener('click', dlShipments);
  g('btnDlPIDsInline')      .addEventListener('click', dlPIDs);
  startFetch();
});

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach((b, i) =>
    b.classList.toggle('active', ['shipment','pid'][i] === name));
  document.querySelectorAll('.tab-panel').forEach(p =>
    p.classList.toggle('active', p.id === `tab-${name}`));
}

// ── Main fetch ────────────────────────────────────────────────────────────────
async function startFetch() {
  if (isFetching) return;
  isFetching = true;
  const btn = g('btnRefresh'), icon = g('refreshIcon');
  btn.disabled = true; icon.className = 'spin'; icon.textContent = '↻';
  g('dash').style.display = 'none';
  g('stateScreen').style.display = 'flex';
  setState('📦', 'Fetching live data…', 5, 'Reading authentication…', '');

  try {
    const token = await getToken();
    if (!token) {
      setState('⚠️', 'Not logged in', 0,
        'Open app.nexs.lenskart.com and log in, then click Refresh.', '');
      return;
    }

    setProgress('Fetching shipment list…', 15);
    const all        = await fetchShipments();
    const active     = all.filter(s => s.status !== 'DISPATCHED');
    const dispatched = all.filter(s => s.status === 'DISPATCHED');

    if (!active.length) {
      renderStatusMetrics([]);
      setState('✅', 'No active shipments', 100,
        `All ${all.length} shipments are DISPATCHED.`, '');
      return;
    }

    setProgress(`Fetching details for ${active.length} shipments…`, 30);
    const detMap = await fetchAllDetails(active);

    // Look up each shipment's DO Type + PO number, then keep ONLY the allowed DO types.
    // Scoping here means the top cards, aging matrix, tables, PID view and exports
    // all reflect only AQUA_B2B / MARKETPLACE_B2B.
    setProgress('Fetching DO types & PO numbers…', 88);
    const doMeta = await fetchDoMeta(active, detMap);

    const scoped    = active.filter(s => isAllowedDoType(doMeta[s.shippingPackageId]?.doType));
    const scopedMap = {};
    scoped.forEach(s => { scopedMap[s.shippingPackageId] = detMap[s.shippingPackageId]; });

    if (!scoped.length) {
      renderStatusMetrics([]);
      setState('✅', 'No matching shipments', 100,
        `No active shipments with DO Type ${allowedTypesLabel()}.`,
        `Checked ${active.length} active shipment(s) — none had a matching DO Type.`);
      return;
    }

    setProgress('Building dashboard…', 92);
    const { shipRows, pidRows } = consolidate(scoped, scopedMap);
    shipRows.forEach(r => {
      const m = doMeta[r.id] || {};
      r.doType   = m.doType   || '—';
      r.poNumber = m.poNumber || '—';
    });

    _shipRows = shipRows;
    _pidRows  = pidRows;

    // Fetch HSN classification per unique PID (additionalDetails) so the
    // Classification filter + column can distinguish lens / solution / frame.
    setProgress(`Classifying ${pidRows.length} products…`, 93);
    await enrichClassifications(pidRows);

    // Roll each PID's classification up to its shipment(s) so the same filter
    // can scope the Shipment View (a shipment matches if it holds ≥1 such PID).
    shipRows.forEach(r => {
      r.classifications = new Set((r.pidIds||[]).map(id => CLASS_CACHE[id]?.classification || 'Unknown'));
    });

    // Render top bar with status counts
    renderClassFilter(pidRows);
    renderStatusMetrics(classShips(shipRows));
    // Render views
    renderShipmentView(shipRows);
    renderPIDView(shipRows, pidRows);

    g('stateScreen').style.display = 'none';
    g('dash').style.display = 'block';
    g('dlBar').classList.add('visible');

    const now = new Date();
    g('lastFetched').textContent =
      now.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) +
      ' · ' + now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
    g('footerRight').textContent =
      `${shipRows.length} active · ${dispatched.length} dispatched · ${pidRows.length} PIDs`;

  } catch (err) {
    setState('⚠️', 'Something went wrong', 0, err.message || String(err),
      'Make sure you are logged into app.nexs.lenskart.com');
    console.error('[DO Extension]', err);
  } finally {
    isFetching = false; btn.disabled = false;
    icon.className = ''; icon.textContent = '↻';
  }
}

// ── Auth / headers ────────────────────────────────────────────────────────────
async function getToken() {
  try { const c = await chrome.cookies.get({ url:CFG.baseUrl, name:'jwt-token' }); return c?.value||null; }
  catch { return null; }
}
function hdrs() {
  return {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'date-time': new Date().toISOString().slice(0,19).replace('T',' '),
    'facility-code': CFG.facility,
    'source-domain': CFG.baseUrl,
  };
}

// ── API 1 ─────────────────────────────────────────────────────────────────────
async function fetchShipments() {
  const to = new Date(), from = new Date();
  from.setDate(from.getDate() - CFG.lookbackDays);
  const base = { sortKey:'created_at', sortOrder:'DESC', channel:CFG.channel,
    created_at_from: fmtDate(from)+' 00:00:00', created_at_to: fmtDate(to)+' 23:59:59' };
  let all=[], offset=0, total=null, page=0;
  while (true) {
    if (++page > CFG.maxPages) break;
    const res = await fetch(mkURL(CFG.baseUrl+CFG.api1, {...base,offset,pageSize:CFG.pageSize}),
                             {headers:hdrs(), credentials:'include'});
    if (!res.ok) throw new Error(`API 1 returned HTTP ${res.status}. Are you logged in?`);
    const body = await res.json();
    const batch = body.data?.doOrderResponses || [];
    if (total===null) total = body.data?.totalCount||0;
    all.push(...batch); offset+=batch.length;
    setProgress(`Fetching shipments… ${all.length} / ${total}`, 15+(offset/Math.max(total,1))*15);
    if (!batch.length || offset>=total) break;
  }
  return all;
}

// ── API 2 ─────────────────────────────────────────────────────────────────────
async function fetchDetail(id) {
  const res = await fetch(mkURL(CFG.baseUrl+CFG.api2,
    {offset:0,sortKey:'updatedOn',sortOrder:'DESC',pageSize:1000,id}),
    {headers:hdrs(), credentials:'include'});
  if (!res.ok) return {};
  return (await res.json()).data || {};
}
async function fetchAllDetails(active) {
  const map={}; let done=0; const n=active.length;
  for (let i=0; i<n; i+=CFG.batchSize) {
    await Promise.allSettled(active.slice(i,i+CFG.batchSize).map(async s => {
      try   { map[s.shippingPackageId] = await fetchDetail(s.shippingPackageId); }
      catch { map[s.shippingPackageId] = {}; }
      setProgress(`Fetching item details… ${++done} / ${n}`, 30+(done/n)*60);
    }));
  }
  return map;
}

// ── API 3 — DO Type + PO (distributorOrder search) ─────────────────────────────
// Returns a map of shippingPackageId -> { doType, poNumber }, matching each
// shipment's doNumber against the distributor order incrementId. IDs are batched
// via `incrementId.in`. Used to scope the dashboard to the allowed DO types.
async function fetchDoMeta(active, detMap) {
  const result = {};
  active.forEach(s => { result[s.shippingPackageId] = { doType: '—', poNumber: '—' }; });

  // DO number per shipment (comes from the detail payload)
  const sidToDo = {};
  active.forEach(s => {
    const dn = detMap[s.shippingPackageId]?.doNumber;
    if (dn && dn !== '—') sidToDo[s.shippingPackageId] = String(dn).trim();
  });

  const ids = [...new Set(Object.values(sidToDo))];
  if (!ids.length) return result;

  const byId = {}, byDigits = {};   // exact + digits-only keys (handles any prefix diff)
  const CHUNK = 30;

  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const params = new URLSearchParams({
      page: '0', size: String(chunk.length), sortBy: 'createdAt', sortOrder: 'DESC',
    });
    const searchTerms = `incrementId.in:${chunk.join(',')}___facility.eq:${CFG.facility}`;
    const url = `${CFG.baseUrl}${CFG.api3}?${params.toString()}&searchTerms=${encodeURIComponent(searchTerms)}`;
    try {
      const res = await fetch(url, { headers: hdrs(), credentials: 'include' });
      if (!res.ok) continue;
      const body = await res.json();
      (body.data?.content || []).forEach(o => {
        const meta = { doType: o.doType || '—', poNumber: o.poNumber || '—' };
        const inc  = String(o.incrementId ?? '').trim();
        if (!inc) return;
        byId[inc] = meta;
        byDigits[inc.replace(/\D/g, '')] = meta;
      });
    } catch { /* skip this chunk, keep the rest going */ }
  }

  Object.entries(sidToDo).forEach(([sid, dn]) => {
    const m = byId[dn] || byDigits[dn.replace(/\D/g, '')];
    if (m) result[sid] = { doType: m.doType, poNumber: m.poNumber };
  });
  return result;
}

// ── API 4 — Product additionalDetails (HSN classification) ─────────────────────
// One GET per unique PID; results cached so refreshes are cheap. Enriches each
// pidRow with { classification, hsnCode, hsnClassification }.
function hdrsCatalog() {
  return { ...hdrs(), 'x-api-client': 'desktop', 'workstation-id': String(CFG.workstationId) };
}

async function fetchProductClass(pid) {
  if (CLASS_CACHE[pid]) return CLASS_CACHE[pid];
  const fallback = { classification: 'Unknown', hsnCode: '', hsnClassification: '' };
  try {
    const res = await fetch(mkURL(CFG.baseUrl + CFG.api4, { pid }),
                            { headers: hdrsCatalog(), credentials: 'include' });
    if (!res.ok) { CLASS_CACHE[pid] = fallback; return fallback; }
    const d = (await res.json()).data?.productDetailsResponse || {};
    const out = {
      hsnClassification: d.hsnClassification || '',
      hsnCode:           d.hsnCode || '',
      classification:    classifyHsn(d.hsnClassification, d.hsnCode),
    };
    CLASS_CACHE[pid] = out;
    return out;
  } catch { CLASS_CACHE[pid] = fallback; return fallback; }
}

async function enrichClassifications(pidRows) {
  const n = pidRows.length; let done = 0;
  for (let i = 0; i < n; i += CFG.batchSize) {
    await Promise.allSettled(pidRows.slice(i, i + CFG.batchSize).map(async r => {
      const c = r.pid ? await fetchProductClass(r.pid)
                      : { classification: 'Unknown', hsnCode: '', hsnClassification: '' };
      r.classification    = c.classification;
      r.hsnCode           = c.hsnCode;
      r.hsnClassification = c.hsnClassification;
      setProgress(`Classifying products… ${++done} / ${n}`, 93 + (done / Math.max(n, 1)) * 6);
    }));
  }
}

// ── Consolidate ───────────────────────────────────────────────────────────────
function consolidate(active, map) {
  // AWB_CREATED = packed & dispatched → treat as fully picked, nothing pending
  const isComplete = s => s && (s.includes('AWB') || s.includes('DISPATCH') || s.includes('DELIVER'));

  const shipRows = active.map(s => {
    const d=map[s.shippingPackageId]||{}, pids=d.pidListing||[];
    const status = d.status||s.status||'—';
    const req    = arrSum(pids,'requiredQuantity');
    // If AWB created or beyond, all units are picked (packed & sent to dispatch)
    const pick   = isComplete(status) ? req : arrSum(pids,'quantityScanned');
    return { id:s.shippingPackageId, status,
      customer:d.customerName||'—', doNumber:d.doNumber||'—',
      required:req, picked:pick, pending:Math.max(0,req-pick),
      pidCount:pids.length, ageHours:ageHrs(s.createdAt),
      pidIds:pids.map(p=>p.productId).filter(Boolean),
      classifications:new Set() };
  }).sort((a,b)=>b.pending-a.pending);

  // For PIDs: shipments that are AWB_CREATED contribute fully to picked
  const pidMap={};
  Object.entries(map).forEach(([sid,d]) => {
    const shipStatus = active.find(s=>s.shippingPackageId===sid);
    const sStatus    = d.status || shipStatus?.status || '';
    const complete   = isComplete(sStatus);
    (d.pidListing||[]).forEach(p => {
      if (!p.productId) return;
      if (!pidMap[p.productId]) pidMap[p.productId]={pid:p.productId,desc:p.description||'',
        hsn:p.hsnClassification||'',required:0,picked:0,shipments:new Set()};
      const req  = p.requiredQuantity||0;
      const pick = complete ? req : (p.quantityScanned||0);
      pidMap[p.productId].required+=req;
      pidMap[p.productId].picked  +=pick;
      pidMap[p.productId].shipments.add(sid);
    });
  });
  const pidRows=Object.values(pidMap).map(p=>({
    ...p, pending:Math.max(0,p.required-p.picked), shipmentCount:p.shipments.size,
  })).sort((a,b)=>b.pending-a.pending);
  return {shipRows, pidRows};
}

// ── Render: Top status metric cards ──────────────────────────────────────────
function renderStatusMetrics(rows) {
  // Count by status
  const counts = {};
  rows.forEach(r => {
    if (!counts[r.status]) counts[r.status] = 0;
    counts[r.status]++;
  });

  // Total active card + one card per status
  const statusEntries = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const totalActive   = rows.length;

  // Build cards HTML
  const totalCard = `
    <div class="mc" style="border-top:3px solid #3B5BDB">
      <div class="mc-glow" style="background:#3B5BDB"></div>
      <span class="mc-icon">🚚</span>
      <div class="mc-label">Active Shipments</div>
      <div class="mc-value" style="color:#3B5BDB">${totalActive.toLocaleString()}</div>
      <div class="mc-sub">non-dispatched</div>
    </div>`;

  const statusCards = statusEntries.map(([status, count], i) => {
    const c   = STATUS_COLORS[i % STATUS_COLORS.length];
    const icon = statusIcon(status);
    return `
      <div class="mc" style="border-top:3px solid ${c.top}">
        <div class="mc-glow" style="background:${c.glow}"></div>
        <span class="mc-icon">${icon}</span>
        <div class="mc-label">${status.replace(/_/g,' ')}</div>
        <div class="mc-value" style="color:${c.val}">${count.toLocaleString()}</div>
        <div class="mc-sub">shipments</div>
      </div>`;
  }).join('');

  const metricsRow = g('metricsRow');
  metricsRow.innerHTML = totalCard + statusCards;
  // Adjust grid columns
  const total = 1 + statusEntries.length;
  metricsRow.style.gridTemplateColumns = `repeat(${Math.min(total, 6)}, 1fr)`;
}

function statusIcon(status) {
  if (status.includes('PICK'))    return '📥';
  if (status.includes('QC'))      return '🔍';
  if (status.includes('AWB'))     return '📬';
  if (status.includes('PACK'))    return '📦';
  if (status.includes('PROCESS')) return '⚙️';
  if (status.includes('CANCEL'))  return '❌';
  return '📋';
}

// ── Render: Shipment View ─────────────────────────────────────────────────────
function renderShipmentView(rows) {
  // Global classification filter first, then the DO Type pills operate within it
  const scoped = classShips(rows);

  // Build the DO Type filter pills from the class-scoped set
  renderDoTypeFilter(scoped);

  // Apply the active DO Type filter to the table + aging matrix + count
  const view = applyDoTypeFilter(scoped);

  renderAgingMatrix(view);

  // All Shipments table
  g('shipCount').textContent = view.length;
  g('shipBody').innerHTML = view.length ? view.map(r => `<tr>
    <td><span class="idc" title="${r.id}">${r.id}</span></td>
    <td><span class="badge ${sBadge(r.status)}">${r.status}</span></td>
    <td title="${r.customer}">${trunc(r.customer,20)}</td>
    <td style="color:var(--muted);font-size:11px">${r.doNumber}</td>
    <td style="color:var(--muted);font-size:11px" title="${r.poNumber}">${trunc(r.poNumber,18)}</td>
    <td>${doTypePill(r.doType)}</td>
    <td class="r nreq">${r.required.toLocaleString()}</td>
    <td class="r npick">${r.picked.toLocaleString()}</td>
    <td class="r ${r.pending>0?'npend':'nzero'}">${r.pending.toLocaleString()}</td>
    <td class="r npid">${r.pidCount}</td>
    <td>${agePill(r.ageHours)}</td>
  </tr>`).join('') : emptyRow(11);
}

// ── DO Type filter ────────────────────────────────────────────────────────────
function applyDoTypeFilter(rows) {
  if (_doTypeFilter === 'ALL')      return rows;
  if (_doTypeFilter === '__NONE__') return rows.filter(r => !r.doType || r.doType === '—');
  return rows.filter(r => r.doType === _doTypeFilter);
}

function renderDoTypeFilter(rows) {
  const bar = g('doTypeFilter');
  if (!bar) return;

  const types   = [...new Set(rows.map(r => r.doType).filter(t => t && t !== '—'))].sort();
  const unknown = rows.filter(r => !r.doType || r.doType === '—').length;

  // If a previously-selected type vanished after a refresh, fall back to All
  if (_doTypeFilter !== 'ALL' &&
      !(_doTypeFilter === '__NONE__' ? unknown > 0 : types.includes(_doTypeFilter))) {
    _doTypeFilter = 'ALL';
  }

  const pill = (val, label, count) =>
    `<button class="ft-pill${_doTypeFilter === val ? ' active' : ''}" data-dotype="${val}">${label}<span class="ft-count">${count}</span></button>`;

  let html = pill('ALL', 'All Types', rows.length);
  types.forEach(t => { html += pill(t, t.replace(/_/g, ' '), rows.filter(r => r.doType === t).length); });
  if (unknown) html += pill('__NONE__', 'Unknown', unknown);

  bar.innerHTML = html;
  bar.querySelectorAll('.ft-pill').forEach(b =>
    b.addEventListener('click', () => {
      _doTypeFilter = b.dataset.dotype;
      renderShipmentView(_shipRows);
    }));
}

function doTypePill(t) {
  if (!t || t === '—') return '<span style="color:#CBD5E1">—</span>';
  return `<span class="dt-pill">${t.replace(/_/g, ' ')}</span>`;
}

// ── Render: Aging matrix ─────────────────────────────────────────────────────
function renderAgingMatrix(rows) {
  // Get unique statuses sorted by shipment count descending
  const statusCount = {};
  rows.forEach(r => statusCount[r.status] = (statusCount[r.status]||0)+1);
  const statuses = Object.keys(statusCount).sort((a,b)=>statusCount[b]-statusCount[a]);

  // Build header row — status names on a single line (underscores → spaces)
  const thCells = statuses.map(s =>
    `<th class="r">${s.replace(/_/g,' ')}</th>`
  ).join('');

  // Build data rows
  const dataRows = AGING_BUCKETS.map(({ label, crit, fn }) => {
    const bucketRows = rows.filter(fn);
    const cells = statuses.map(s => {
      const c   = bucketRows.filter(r=>r.status===s).length;
      const cls = c>0 ? (crit?'npend':'nship') : 'nzero';
      return `<td class="r ${cls}">${c>0?`<strong>${c}</strong>`:'0'}</td>`;
    }).join('');
    const tot    = bucketRows.length;
    const totCls = tot>0 ? (crit?'npend':'nreq') : 'nzero';
    return `<tr>
      <td style="font-weight:600">${label}</td>
      ${cells}
      <td class="r ${totCls}">${tot>0?`<strong>${tot}</strong>`:'0'}</td>
    </tr>`;
  }).join('');

  // Totals row
  const totalCells = statuses.map(s => {
    const t = statusCount[s]||0;
    return `<td class="r" style="color:var(--blue);font-weight:800">${t}</td>`;
  }).join('');

  g('agingMatrix').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Age Bucket</th>
          ${thCells}
          <th class="r">Total</th>
        </tr>
      </thead>
      <tbody>
        ${dataRows}
        <tr style="background:linear-gradient(135deg,#F0F4FF,#E8EDFF)">
          <td style="font-weight:800;color:var(--text)">Total</td>
          ${totalCells}
          <td class="r" style="color:var(--blue);font-weight:800">${rows.length}</td>
        </tr>
      </tbody>
    </table>`;
}

// ── Render: PID View ──────────────────────────────────────────────────────────
function renderPIDView(shipRows, pidRows) {
  // Classification pills live in the export bar (rendered globally); just apply
  const view = applyClassFilter(pidRows);

  // Qty metric cards — reflect the current classification selection
  setText('pmRequired', arrSum(view, 'required').toLocaleString());
  setText('pmPicked',   arrSum(view, 'picked').toLocaleString());
  setText('pmPending',  arrSum(view, 'pending').toLocaleString());
  setText('pmPIDs',     view.length.toLocaleString());

  // PID tiles
  const pidRow = r => `<tr>
    <td><code class="idc">${r.pid}</code></td>
    <td class="r nreq">${r.required.toLocaleString()}</td>
    <td class="r ${r.pending>0?'npend':'nzero'}">${r.pending.toLocaleString()}</td>
    <td class="r nship">${r.shipmentCount}</td>
  </tr>`;

  const byPending = [...view].sort((a,b)=>b.pending-a.pending);
  const byImpact  = [...view].sort((a,b)=>b.shipmentCount-a.shipmentCount);
  g('topPIDBody').innerHTML  = byPending.length ? byPending.slice(0,10).map(pidRow).join('') : emptyRow(4);
  g('impactBody').innerHTML  = byImpact.length  ? byImpact.slice(0,10).map(pidRow).join('')  : emptyRow(4);

  // Full PID table
  g('pidCount').textContent = view.length;
  g('allPIDBody').innerHTML = view.length ? view.map(r => `<tr>
    <td><code class="idc">${r.pid}</code></td>
    <td><span class="desc" title="${r.desc}">${trunc(r.desc,40)}</span></td>
    <td>${classPill(r.classification)}</td>
    <td style="color:var(--muted);font-size:11px">${r.hsnCode||'—'}</td>
    <td class="r nreq">${r.required.toLocaleString()}</td>
    <td class="r npick">${r.picked.toLocaleString()}</td>
    <td class="r ${r.pending>0?'npend':'nzero'}">${r.pending.toLocaleString()}</td>
    <td class="r nship">${r.shipmentCount}</td>
  </tr>`).join('') : emptyRow(8);
}

// ── Classification filter (multi-select, global) ──────────────────────────────
function applyClassFilter(rows) {
  if (_classFilter.size === 0) return rows;   // empty selection = show all
  return rows.filter(r => _classFilter.has(r.classification || 'Unknown'));
}

// Shipment matches if it contains at least one PID of a selected classification
function classShips(rows) {
  if (_classFilter.size === 0) return rows;
  return rows.filter(r => r.classifications && [...r.classifications].some(c => _classFilter.has(c)));
}

// Re-render every surface the classification filter touches
function rerenderAll() {
  renderStatusMetrics(classShips(_shipRows));
  renderShipmentView(_shipRows);
  renderPIDView(_shipRows, _pidRows);
}

function renderClassFilter(pidRows) {
  const bar = g('classFilter'); if (!bar) return;

  const counts = {};
  pidRows.forEach(r => { const c = r.classification || 'Unknown'; counts[c] = (counts[c]||0)+1; });
  const cats = Object.keys(counts).sort();

  // Drop any selected category that vanished after a refresh
  [..._classFilter].forEach(c => { if (!counts[c]) _classFilter.delete(c); });

  const allActive = _classFilter.size === 0;
  let html = `<button class="ft-pill${allActive?' active':''}" data-class="__ALL__">All</button>`;
  cats.forEach(c => {
    const active = _classFilter.has(c);
    html += `<button class="ft-pill${active?' active':''}" data-class="${c}">${c}</button>`;
  });

  bar.innerHTML = html;
  bar.querySelectorAll('.ft-pill').forEach(b =>
    b.addEventListener('click', () => {
      const val = b.dataset.class;
      if (val === '__ALL__') _classFilter.clear();
      else _classFilter.has(val) ? _classFilter.delete(val) : _classFilter.add(val);
      renderClassFilter(_pidRows);   // refresh active states
      rerenderAll();
    }));
}

function classPill(c) {
  if (!c || c === 'Unknown') return '<span class="cl-pill cl-other">Unknown</span>';
  const cls = c === 'Contact Lens'          ? 'cl-lens'
            : c === 'Contact Lens Solution' ? 'cl-sol'
            : c === 'Eyeframe'              ? 'cl-frame'
            : 'cl-other';
  return `<span class="cl-pill ${cls}">${c}</span>`;
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function setState(icon,title,pct,label,sub) {
  g('stateIcon').textContent=icon; g('stateTitle').textContent=title;
  g('stateLabel').textContent=label; g('stateSub').textContent=sub;
  g('progBar').style.width=pct+'%';
}
function setProgress(label,pct) {
  g('stateLabel').textContent=label;
  g('progBar').style.width=Math.min(pct,100)+'%';
}
function sBadge(s='') {
  if (s.includes('PICK'))    return 'b-blue';
  if (s.includes('QC'))      return 'b-green';
  if (s.includes('AWB'))     return 'b-teal';
  if (s.includes('PACK'))    return 'b-green';
  if (s.includes('PROCESS')) return 'b-yellow';
  if (s.includes('CANCEL'))  return 'b-red';
  return 'b-gray';
}
function agePill(h) {
  const t = h<24 ? h.toFixed(1)+'h' : Math.round(h/24)+'d '+Math.round(h%24)+'h';
  if (h<24) return `<span class="age age-ok">${t}</span>`;
  if (h<48) return `<span class="age age-warn">${t}</span>`;
  return `<span class="age age-crit">${t}</span>`;
}
function emptyRow(cols) {
  return `<tr><td colspan="${cols}" style="text-align:center;padding:18px;color:var(--muted)">No data</td></tr>`;
}

// ── CSV — exports reflect the CURRENT filtered view ───────────────────────────
function dlShipments() {
  // Same scope the Shipment View shows: classification filter → DO Type filter
  const rows = applyDoTypeFilter(classShips(_shipRows));
  if (!rows.length) return alert('No shipments in the current view.');
  downloadCSV(['Shipping ID','Status','Customer','DO Number','PO Number','DO Type','Required','Picked','Pending','PID Count','Age (hrs)'],
    rows.map(r=>[r.id,r.status,r.customer,r.doNumber,r.poNumber,r.doType,r.required,r.picked,r.pending,r.pidCount,r.ageHours.toFixed(2)]),
    `DO_Shipments_${ts()}.csv`);
}
function dlPIDs() {
  // Same scope the PID View shows: classification filter
  const rows = applyClassFilter(_pidRows);
  if (!rows.length) return alert('No PIDs in the current view.');
  downloadCSV(['Product ID','Description','Classification','HSN Code','HSN Class','Required','Picked','Pending','Shipments'],
    rows.map(r=>[r.pid,r.desc,r.classification||'Unknown',r.hsnCode||'',r.hsnClassification||'',r.required,r.picked,r.pending,r.shipmentCount]),
    `DO_PIDs_${ts()}.csv`);
}
function downloadCSV(headers,rows,filename) {
  const e=v=>{const s=String(v??'');return(s.includes(',')||s.includes('"'))?`"${s.replace(/"/g,'""')}"`:s;};
  triggerDl('\uFEFF'+[headers,...rows].map(r=>r.map(e).join(',')).join('\n'),filename);
}
function triggerDl(content,filename) {
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8;'}));
  a.download=filename; document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── Utils ─────────────────────────────────────────────────────────────────────
const g       = id => document.getElementById(id);
const setText = (id,v) => { const e=g(id); if(e) e.textContent=v; };
const arrSum  = (arr,k) => arr.reduce((a,o)=>a+(o[k]||0),0);
const trunc   = (s,n) => (!s||s==='—')?'—':s.length>n?s.slice(0,n)+'…':s;
const fmtDate = d => d.toISOString().slice(0,10);
const ts      = () => new Date().toISOString().slice(0,16).replace('T','_').replace(':','-');
const mkURL   = (base,params) => { const u=new URL(base); Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v))); return u.toString(); };
const ageHrs  = created => {
  if (!created) return 0;
  try { const d=new Date(created.replace(' ','T')); return isNaN(d)?0:Math.max(0,(Date.now()-d.getTime())/3600000); }
  catch { return 0; }
};
