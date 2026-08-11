'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Summary = {
  putawayTotal: number;
  marriageTotal: number;
  removalsTotal: number;
  rejectedTotal: number;
  activeOperators: number;
  averageDurationMs: number;
  traysCurrentlyStored: number;
  occupiedPositions: number;
  fullPositions: number;
  attentionTrays: number;
  nddTrays: number;
};

type OperatorMetric = {
  operatorId: string;
  putawayCount: number;
  marriageCount: number;
  removalCount: number;
  rejectedCount: number;
};

type HourMetric = {
  hour: string;
  putawayCount: number;
  marriageCount: number;
};

type TrayDump = {
  id: string;
  positionBarcode: string;
  trayBarcode: string;
  fittingId: string | null;
  shipmentId: string | null;
  maxQcfCount: number;
  operatorId: string | null;
  priority: string | null;
  priorityClassification: string | null;
  orderType: string | null;
  orderMode: string | null;
  orderAge: string;
  orderAgeDays: number | null;
  liveStatus: 'VALID' | 'INVALID' | 'ERROR' | 'PENDING';
  statusMessage: string | null;
  validatedAt: string | null;
  stackLevel: number;
  putawayAt: string;
  dwellMinutes: number;
};

type DashboardData = {
  summary: Summary;
  operators: OperatorMetric[];
  hourly: HourMetric[];
  dump: TrayDump[];
  generatedAt: string;
  healthRefresh: { checked: number; valid: number; invalid: number; errors: number } | null;
};

const IST_OFFSET_MINUTES = 330;

function initialRange() {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000).toISOString().slice(0, 16);
  return { from: `${istNow.slice(0, 10)}T00:00`, to: istNow };
}

function formatDate(value: string | null) {
  if (!value) return 'Not checked';
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })
    : value;
}

function formatDuration(milliseconds: number) {
  if (!milliseconds) return '—';
  return milliseconds >= 1000 ? `${(milliseconds / 1000).toFixed(1)}s` : `${Math.round(milliseconds)}ms`;
}

function formatDwell(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

function csvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function isNddTray(row: Pick<TrayDump, 'priority' | 'orderMode' | 'priorityClassification'>) {
  const priority = String(row.priority ?? '').trim().toUpperCase();
  return priority === '1'
    || priority === 'NDD'
    || row.orderMode?.toUpperCase() === 'NDD'
    || row.priorityClassification?.toUpperCase().startsWith('NDD') === true;
}

export default function OmtDashboardPage() {
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadDashboard = useCallback(async (validation: 'none' | 'due' | 'force' = 'none') => {
    if (!range.from || !range.to) return;
    if (validation !== 'none') setValidating(true);
    else setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ from: range.from, to: range.to });
      if (validation !== 'none') params.set('validate', validation);
      const response = await fetch(`/api/omt/dashboard?${params}`, { cache: 'no-store' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to load dashboard');
      setData(body as DashboardData);
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setLoading(false);
      setValidating(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    const defaults = initialRange();
    setDraftFrom(defaults.from);
    setDraftTo(defaults.to);
    setRange(defaults);
  }, []);

  useEffect(() => {
    void loadDashboard('none').then(() => loadDashboard('due'));
    const liveInterval = window.setInterval(() => void loadDashboard('none'), 30_000);
    const healthInterval = window.setInterval(() => void loadDashboard('due'), 60 * 60 * 1000);
    return () => {
      window.clearInterval(liveInterval);
      window.clearInterval(healthInterval);
    };
  }, [loadDashboard]);

  const filteredDump = useMemo(() => {
    const needle = search.trim().toUpperCase();
    return (data?.dump ?? []).filter((row) => {
      if (statusFilter !== 'ALL' && row.liveStatus !== statusFilter) return false;
      if (!needle) return true;
      return [row.trayBarcode, row.positionBarcode, row.fittingId, row.shipmentId, row.operatorId]
        .some((value) => String(value ?? '').toUpperCase().includes(needle));
    });
  }, [data?.dump, search, statusFilter]);

  const chartRows = useMemo(() => (data?.hourly ?? []).slice(-24), [data?.hourly]);
  const chartMaximum = Math.max(1, ...chartRows.map((row) => row.putawayCount + row.marriageCount));

  const exportDump = () => {
    if (!filteredDump.length) return;
    const headers = [
      'Position', 'Level', 'Tray', 'Live status', 'Status message', 'Fitting ID', 'Shipment ID',
      'Priority', 'Order mode', 'Order type', 'Order age', 'QCF', 'Putaway operator', 'Putaway at (IST)', 'Last validated (IST)', 'Dwell minutes',
    ];
    const rows = filteredDump.map((row) => [
      row.positionBarcode, row.stackLevel, row.trayBarcode, row.liveStatus, row.statusMessage,
      row.fittingId, row.shipmentId, row.priority, row.orderMode, row.orderType, row.orderAge, row.maxQcfCount,
      row.operatorId, formatDate(row.putawayAt), formatDate(row.validatedAt), row.dwellMinutes,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `omt-putaway-live-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const summary = data?.summary;

  return (
    <div className="od-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="od-header">
        <div className="od-brand"><span className="od-mark"><i /><i /><i /></span><span><b>OMT</b><small>Operations intelligence</small></span></div>
        <span className="od-spacer" />
        <span className={`od-live ${summary?.attentionTrays ? 'warning' : ''}`}><i />{summary?.attentionTrays ? `${summary.attentionTrays} tray alerts` : 'All trays healthy'}</span>
        <button type="button" className="ghost-button" onClick={() => void loadDashboard('none')} disabled={loading}>Refresh data</button>
        <button type="button" className="health-button" onClick={() => void loadDashboard('force')} disabled={validating}>{validating ? 'Checking all trays…' : 'Run API health check'}</button>
      </header>

      <main className="od-main">
        <section className="hero-row">
          <div><span className="eyebrow">Live operations dashboard</span><h1>OMT KPI Panel</h1><p>Putaway, tray marriage, operator output, and live rack integrity in one view.</p></div>
          <div className="range-panel">
            <label><span>From (IST)</span><input type="datetime-local" value={draftFrom} onChange={(event) => setDraftFrom(event.target.value)} /></label>
            <label><span>To (IST)</span><input type="datetime-local" value={draftTo} onChange={(event) => setDraftTo(event.target.value)} /></label>
            <button type="button" onClick={() => setRange({ from: draftFrom, to: draftTo })}>Apply</button>
          </div>
        </section>

        {error && <div className="error-banner" role="alert"><b>Dashboard unavailable</b><span>{error}</span></div>}

        <section className="kpi-grid" aria-busy={loading}>
          <article className="kpi gold"><small>Putaway completed</small><strong>{summary?.putawayTotal ?? '—'}</strong><span>Selected time range</span></article>
          <article className="kpi purple"><small>Tray marriages</small><strong>{summary?.marriageTotal ?? '—'}</strong><span>Selected time range</span></article>
          <article className="kpi blue"><small>Active operators</small><strong>{summary?.activeOperators ?? '—'}</strong><span>Successful activity</span></article>
          <article className="kpi green"><small>Currently stored</small><strong>{summary?.traysCurrentlyStored ?? '—'}</strong><span>{summary?.occupiedPositions ?? 0} positions · {summary?.fullPositions ?? 0} full</span></article>
          <article className={`kpi ${summary?.attentionTrays ? 'red alert' : 'green'}`}><small>Tray health alerts</small><strong>{summary?.attentionTrays ?? '—'}</strong><span>Invalid, failed, or pending API check</span></article>
          <article className="kpi ndd-purple"><small>NDD trays live</small><strong>{summary?.nddTrays ?? '—'}</strong><span>Priority 1 orders</span></article>
        </section>

        <section className="analytics-grid">
          <article className="panel operator-panel">
            <div className="panel-head"><div><span className="eyebrow">Person-wise output</span><h2>Operator performance</h2></div><span>{data?.operators.length ?? 0} operators</span></div>
            <div className="table-wrap operator-table">
              <table>
                <thead><tr><th>Operator</th><th>Putaway</th><th>Marriage</th><th>Removed</th><th>Rejected</th><th>Total done</th></tr></thead>
                <tbody>
                  {data?.operators.length ? data.operators.map((operator) => (
                    <tr key={operator.operatorId}>
                      <td><b>{operator.operatorId}</b></td><td className="gold-text">{operator.putawayCount}</td><td className="purple-text">{operator.marriageCount}</td><td>{operator.removalCount}</td><td className={operator.rejectedCount ? 'red-text' : ''}>{operator.rejectedCount}</td><td><strong>{operator.putawayCount + operator.marriageCount}</strong></td>
                    </tr>
                  )) : <tr><td colSpan={6} className="empty-cell">No operator activity in this range</td></tr>}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel throughput-panel">
            <div className="panel-head"><div><span className="eyebrow">Last 24 active hours</span><h2>Hourly throughput</h2></div><span>Putaway + marriage</span></div>
            <div className="bar-chart">
              {chartRows.length ? chartRows.map((row) => (
                <div className="bar-column" key={row.hour} title={`${row.hour} IST: ${row.putawayCount} putaway, ${row.marriageCount} marriage`}>
                  <div className="bar-value">{row.putawayCount + row.marriageCount}</div>
                  <div className="bar-track">
                    <i className="marriage" style={{ height: `${(row.marriageCount / chartMaximum) * 100}%` }} />
                    <i className="putaway" style={{ height: `${(row.putawayCount / chartMaximum) * 100}%` }} />
                  </div>
                  <small>{row.hour.slice(11, 16)}</small>
                </div>
              )) : <div className="chart-empty">No successful activity to chart</div>}
            </div>
            <div className="chart-footer"><span><i className="putaway" /> Putaway</span><span><i className="marriage" /> Marriage</span><span>Avg action <b>{formatDuration(summary?.averageDurationMs ?? 0)}</b></span><span>Rejected <b className="red-text">{summary?.rejectedTotal ?? 0}</b></span><span>Removed <b>{summary?.removalsTotal ?? 0}</b></span></div>
          </article>
        </section>

        <section className="panel dump-panel">
          <div className="dump-head">
            <div><span className="eyebrow">Complete current inventory</span><h2>Putaway Tray Live Dump</h2><p>Live API status, exact rack position, stack level, order context, operator, and dwell time.</p></div>
            <div className="dump-actions">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tray, fitting, position…" aria-label="Search tray dump" />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter live status"><option value="ALL">All statuses</option><option value="VALID">Valid</option><option value="INVALID">Invalid</option><option value="ERROR">API error</option><option value="PENDING">Pending</option></select>
              <button type="button" onClick={exportDump}>Export CSV</button>
            </div>
          </div>
          <div className="dump-meta"><span><b>{filteredDump.length}</b> of {data?.dump.length ?? 0} trays</span><span>Updated {formatDate(data?.generatedAt ?? null)}</span>{validating && <span className="checking">Running live NexS validation…</span>}</div>
          <div className="table-wrap dump-table">
            <table>
              <thead><tr><th>Status</th><th>Position</th><th>Level</th><th>Tray</th><th>Priority</th><th>Fitting / Shipment</th><th>Order</th><th>Order age</th><th>QCF</th><th>Putaway by</th><th>Stored at</th><th>Dwell</th><th>Last API check</th></tr></thead>
              <tbody>
                {filteredDump.length ? filteredDump.map((row) => (
                  <tr key={row.id} className={`${row.liveStatus.toLowerCase()} ${isNddTray(row) ? 'ndd' : ''}`} title={row.statusMessage ?? undefined}>
                    <td><span className={`status ${row.liveStatus.toLowerCase()}`}><i />{row.liveStatus}</span>{row.statusMessage && <small className="status-message">{row.statusMessage}</small>}</td>
                    <td><b>{row.positionBarcode}</b></td><td>{row.stackLevel}/5</td><td><strong>{row.trayBarcode}</strong></td><td>{isNddTray(row) ? <span className="ndd-badge">Priority {row.priority === 'NDD' ? '1' : row.priority}</span> : row.priority ?? '—'}</td><td><b>{row.fittingId ?? '—'}</b><small>{row.shipmentId ?? '—'}</small></td><td>{row.orderMode ?? '—'}<small>{row.orderType ?? '—'}</small></td><td className={row.orderAgeDays != null && row.orderAgeDays >= 2 ? 'red-text' : ''}>{row.orderAge}</td><td className={row.maxQcfCount > 2 ? 'red-text' : ''}>{row.maxQcfCount}</td><td>{row.operatorId ?? '—'}</td><td>{formatDate(row.putawayAt)}</td><td>{formatDwell(row.dwellMinutes)}</td><td>{formatDate(row.validatedAt)}</td>
                  </tr>
                )) : <tr><td colSpan={13} className="empty-cell">No trays match this view</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

const CSS = `
.od-root{--bg0:#090b0e;--bg1:#101318;--bg2:#151920;--bg3:#1c2129;--line:rgba(255,255,255,.08);--line2:rgba(255,255,255,.15);--text:#f4f6f8;--text2:#bdc3cd;--muted:#747d8a;--gold:#d9b75a;--green:#47d59c;--red:#f16b73;--blue:#66a7ff;--purple:#a78bfa;--orange:#ff9b67;min-height:calc(100vh - 3rem);margin:-1.5rem;background:radial-gradient(900px 480px at 88% -10%,rgba(217,183,90,.08),transparent 65%),linear-gradient(180deg,#0d1014,var(--bg0));color:var(--text);font-family:var(--font-inter,"Inter",ui-sans-serif,system-ui,sans-serif);font-size:14px;-webkit-font-smoothing:antialiased}.od-root *{box-sizing:border-box}
.od-header{min-height:68px;padding:13px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px;background:rgba(9,11,14,.72);position:sticky;top:0;z-index:5;backdrop-filter:blur(14px)}.od-brand{display:flex;align-items:center;gap:10px}.od-brand>span:last-child{display:flex;align-items:baseline;gap:9px}.od-brand b{font-size:20px;letter-spacing:2.4px}.od-brand small{color:var(--muted);font-size:9px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase}.od-mark{width:34px;height:34px;border:1px solid rgba(217,183,90,.36);border-radius:10px;display:flex;align-items:flex-end;justify-content:center;gap:3px;padding:8px;background:rgba(217,183,90,.07)}.od-mark i{width:4px;border-radius:4px 4px 1px 1px;background:var(--gold)}.od-mark i:nth-child(1){height:8px}.od-mark i:nth-child(2){height:14px}.od-mark i:nth-child(3){height:19px}.od-spacer{flex:1}.od-live{display:flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid rgba(71,213,156,.28);border-radius:999px;background:rgba(71,213,156,.08);color:var(--green);font-size:8.5px;font-weight:850;letter-spacing:.7px;text-transform:uppercase}.od-live i{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor}.od-live.warning{color:var(--red);border-color:rgba(241,107,115,.35);background:rgba(241,107,115,.09)}.ghost-button,.health-button{height:32px;padding:0 11px;border-radius:8px;font:800 8.5px inherit;text-transform:uppercase;letter-spacing:.65px;cursor:pointer}.ghost-button{border:1px solid var(--line2);background:var(--bg2);color:var(--text2)}.health-button{border:1px solid rgba(217,183,90,.45);background:rgba(217,183,90,.12);color:#efd98f}.ghost-button:disabled,.health-button:disabled{opacity:.5;cursor:wait}
.od-main{padding:22px 24px 40px;display:flex;flex-direction:column;gap:16px}.hero-row{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.eyebrow{display:block;color:var(--muted);font-size:8.5px;font-weight:850;letter-spacing:1.6px;text-transform:uppercase}.hero-row h1{margin:3px 0 2px;font-size:28px;letter-spacing:-.7px}.hero-row p,.dump-head p{margin:0;color:var(--muted);font-size:10px}.range-panel{display:flex;align-items:flex-end;gap:7px;padding:9px;border:1px solid var(--line);border-radius:12px;background:var(--bg1)}.range-panel label{display:flex;flex-direction:column;gap:4px}.range-panel label span{color:var(--muted);font-size:7.5px;font-weight:850;letter-spacing:.8px;text-transform:uppercase}.range-panel input,.dump-actions input,.dump-actions select{height:34px;border:1px solid var(--line2);border-radius:8px;background:var(--bg2);color:var(--text2);font:650 10px inherit;outline:none;color-scheme:dark}.range-panel input{padding:0 8px}.range-panel input:focus,.dump-actions input:focus,.dump-actions select:focus{border-color:var(--gold)}.range-panel button,.dump-actions button{height:34px;padding:0 13px;border:0;border-radius:8px;background:var(--gold);color:#171309;font:900 8.5px inherit;letter-spacing:.7px;text-transform:uppercase;cursor:pointer}.error-banner{padding:11px 13px;border:1px solid rgba(241,107,115,.35);border-radius:11px;background:rgba(241,107,115,.1);display:flex;gap:8px;color:var(--red);font-size:11px}.error-banner span{color:#e3a4a8}
.kpi-grid{display:grid;grid-template-columns:repeat(6,minmax(130px,1fr));gap:9px}.kpi{min-width:0;padding:13px;border:1px solid var(--line);border-radius:13px;background:linear-gradient(145deg,rgba(255,255,255,.025),transparent),var(--bg1);position:relative;overflow:hidden}.kpi:before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:currentColor}.kpi small{display:block;color:var(--muted);font-size:7.5px;font-weight:850;letter-spacing:.8px;text-transform:uppercase}.kpi strong{display:block;margin:5px 0 2px;color:var(--text);font-size:27px;line-height:1;font-variant-numeric:tabular-nums}.kpi span{color:var(--muted);font-size:8px}.kpi.gold{color:var(--gold)}.kpi.green{color:var(--green)}.kpi.red{color:var(--red)}.kpi.blue{color:var(--blue)}.kpi.purple{color:var(--purple)}.kpi.orange{color:var(--orange)}.kpi.magenta{color:#e44dff}.kpi.alert{animation:kpi-alert 1.7s ease-in-out infinite}@keyframes kpi-alert{50%{border-color:rgba(241,107,115,.55);box-shadow:0 0 22px -10px var(--red)}}
.analytics-grid{display:grid;grid-template-columns:minmax(480px,1.25fr) minmax(400px,1fr);gap:12px}.panel{border:1px solid var(--line);border-radius:15px;background:linear-gradient(180deg,rgba(255,255,255,.018),transparent),var(--bg1);overflow:hidden}.panel-head{min-height:60px;padding:13px 15px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.panel-head h2,.dump-head h2{margin:2px 0 0;font-size:15px}.panel-head>span{color:var(--muted);font-size:8px;font-weight:800;text-transform:uppercase}.table-wrap{overflow:auto}.operator-table{max-height:285px}table{width:100%;border-collapse:collapse;white-space:nowrap}th{padding:9px 12px;border-bottom:1px solid var(--line);background:var(--bg0);color:var(--muted);font-size:7.5px;letter-spacing:.7px;text-align:left;text-transform:uppercase;position:sticky;top:0;z-index:1}td{padding:9px 12px;border-bottom:1px solid var(--line);color:var(--text2);font-size:9.5px}tbody tr:hover{background:rgba(255,255,255,.025)}td small{display:block;max-width:190px;overflow:hidden;text-overflow:ellipsis;color:var(--muted);font-size:7.5px}.gold-text{color:var(--gold)!important}.purple-text{color:var(--purple)!important}.red-text{color:var(--red)!important}.empty-cell{height:95px;text-align:center!important;color:var(--muted)!important}
.throughput-panel{display:flex;flex-direction:column}.bar-chart{height:188px;padding:18px 13px 8px;display:flex;align-items:stretch;gap:5px;overflow-x:auto}.bar-column{min-width:20px;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}.bar-value{height:17px;color:var(--text2);font-size:7px;font-weight:800}.bar-track{width:min(14px,75%);height:130px;display:flex;flex-direction:column-reverse;justify-content:flex-start;border-radius:4px 4px 2px 2px;background:var(--bg0);overflow:hidden}.bar-track i{display:block;width:100%;min-height:0}.bar-track .putaway{background:var(--gold)}.bar-track .marriage{background:var(--purple)}.bar-column small{margin-top:5px;color:var(--muted);font-size:6px;transform:rotate(-35deg)}.chart-empty{margin:auto;color:var(--muted);font-size:10px}.chart-footer{margin-top:auto;padding:10px 14px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:12px;color:var(--muted);font-size:8px}.chart-footer span{display:flex;align-items:center;gap:5px}.chart-footer i{width:7px;height:7px;border-radius:2px}.chart-footer i.putaway{background:var(--gold)}.chart-footer i.marriage{background:var(--purple)}.chart-footer span:nth-last-child(-n+3){margin-left:auto}.chart-footer b{color:var(--text2)}
.dump-panel{min-height:340px}.dump-head{padding:14px 15px 11px;display:flex;align-items:center;justify-content:space-between;gap:15px}.dump-actions{display:flex;gap:6px}.dump-actions input{width:210px;padding:0 10px}.dump-actions select{padding:0 25px 0 9px}.dump-actions button{background:rgba(71,213,156,.14);border:1px solid rgba(71,213,156,.35);color:var(--green)}.dump-meta{padding:7px 15px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;gap:15px;color:var(--muted);font-size:8px}.dump-meta b{color:var(--text2)}.dump-meta .checking{margin-left:auto;color:var(--gold)}.dump-table{max-height:520px}.dump-table th,.dump-table td{padding:9px 10px}.dump-table tr.invalid,.dump-table tr.error,.dump-table tr.pending{background:rgba(241,107,115,.055)}.status{display:inline-flex;align-items:center;gap:5px;padding:4px 6px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:7px;font-weight:900;letter-spacing:.45px}.status i{width:5px;height:5px;border-radius:50%;background:currentColor}.status.valid{color:var(--green);border-color:rgba(71,213,156,.28);background:rgba(71,213,156,.07)}.status.invalid,.status.error,.status.pending{color:var(--red);border-color:rgba(241,107,115,.32);background:rgba(241,107,115,.08)}.status-message{max-width:210px!important;margin-top:4px;color:#d6878c!important}.ndd-badge{display:inline-block;padding:4px 7px;border:1px solid rgba(228,77,255,.65);border-radius:6px;background:rgba(228,77,255,.15);color:#f4b6ff;font-size:8px;font-weight:950;letter-spacing:.8px;animation:ndd-flash 1.1s ease-in-out infinite}@keyframes ndd-flash{50%{background:rgba(228,77,255,.35);box-shadow:0 0 14px rgba(228,77,255,.7)}}
.kpi.ndd-purple{color:#7c3aed}.ndd-badge{border-color:rgba(124,58,237,.45);background:rgba(76,29,149,.2);color:#c4b5fd;box-shadow:none;animation:none!important}
@media(max-width:1250px){.kpi-grid{grid-template-columns:repeat(3,1fr)}.analytics-grid{grid-template-columns:1fr}.chart-footer span:nth-last-child(-n+3){margin-left:0}}
@media(max-width:850px){.od-header{position:static;flex-wrap:wrap}.od-main{padding:15px}.hero-row{align-items:stretch;flex-direction:column}.range-panel{align-items:stretch;flex-wrap:wrap}.range-panel label{flex:1}.range-panel input{width:100%}.dump-head{align-items:stretch;flex-direction:column}.dump-actions{flex-wrap:wrap}.dump-actions input{flex:1;min-width:180px}.analytics-grid{display:block}.throughput-panel{margin-top:12px}}
@media(max-width:560px){.od-root{margin:-1.5rem}.od-header{padding:10px 12px}.od-brand small,.od-live,.ghost-button{display:none}.od-main{padding:10px}.hero-row h1{font-size:23px}.kpi-grid{grid-template-columns:repeat(2,1fr)}.kpi{padding:11px}.kpi strong{font-size:24px}.range-panel label{flex-basis:100%}.analytics-grid{min-width:0}.operator-panel,.throughput-panel{min-width:0}.dump-actions input,.dump-actions select,.dump-actions button{width:100%;flex:auto}.dump-meta{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.kpi.alert,.ndd-badge{animation:none}}
`;
