'use client';

// ConsolidAte — History. Read-only view of released consolidations
// (ConsolidationHistory is append-only and survives master-reset, unlike the
// live board's current-state tables).

import { Fragment, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { OperatorColor } from '../types';

const COLOR_HEX: Record<string, string> = {
  YELLOW: '#f5b942', BLUE: '#5b9cf6', GREEN: '#46d39a', PINK: '#f26fb8', RED: '#e5484d',
};

interface ScanEntry {
  barcode: string;
  placed: boolean;
  scannedAt: string;
  placedAt: string | null;
}

interface HistoryRow {
  id: number;
  shippingPackageId: string;
  locationNumber: number;
  rackNumber: number;
  operatorColor: OperatorColor | null;
  expectedCount: number;
  accountedCount: number;
  barcodes: ScanEntry[];
  completedAt: string | null;
  releasedAt: string;
}

const LIMIT = 50;

export default function ConsolidateHistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  const load = useCallback(async (p: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (query) params.set('q', query);
      const res = await fetch(`/api/cl-cls/consolidate-ptl/history?${params}`);
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || `HTTP ${res.status}`);
      setRows(d.rows || []);
      setTotal(d.total || 0);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page, q); }, [load, page, q]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load(0, q);
  };

  const from = total === 0 ? 0 : page * LIMIT + 1;
  const to = Math.min(total, (page + 1) * LIMIT);

  return (
    <div className="cslh-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="cslh-header">
        <Link href="/cl-cls/consolidate-ptl" className="back">← ConsolidAte PTL</Link>
        <h1>History</h1>
        <small>Released consolidations · survives Master Reset</small>
        <span className="spacer" />
        <form className="search" onSubmit={onSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search package id…"
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {error && <div className="cslh-alert">Failed to load history: {error}</div>}

      <div className="cslh-body">
        <div className="cslh-table-wrap">
          <table className="cslh-table">
            <thead>
              <tr>
                <th>Released</th>
                <th>Package</th>
                <th>Location</th>
                <th>Rack</th>
                <th>Operator</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 && (
                <tr><td colSpan={6} className="empty">Loading…</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={6} className="empty">No released consolidations {q ? `matching "${q}"` : 'yet'}.</td></tr>
              )}
              {rows.map((r) => (
                <Fragment key={r.id}>
                  <tr
                    className={'row' + (openId === r.id ? ' open' : '')}
                    onClick={() => setOpenId(openId === r.id ? null : r.id)}
                  >
                    <td className="mono">{new Date(r.releasedAt).toLocaleString()}</td>
                    <td className="mono pkg" title={r.shippingPackageId}>{r.shippingPackageId}</td>
                    <td className="mono">#{r.locationNumber}</td>
                    <td className="mono">{r.rackNumber}</td>
                    <td>
                      {r.operatorColor && (
                        <span className="dot" style={{ background: COLOR_HEX[r.operatorColor] }} title={r.operatorColor} />
                      )}
                    </td>
                    <td className="mono">{r.accountedCount}/{r.expectedCount}</td>
                  </tr>
                  {openId === r.id && (
                    <tr className="detail">
                      <td colSpan={6}>
                        <div className="scans">
                          {r.barcodes.map((s) => (
                            <span key={s.barcode} className="scan">
                              {s.barcode}
                              <small>{s.placedAt ? new Date(s.placedAt).toLocaleTimeString() : '—'}</small>
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cslh-pager">
          <span>{from}–{to} of {total}</span>
          <div className="btns">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <button type="button" disabled={to >= total} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.cslh-root{
  --bg-0:#0a0b0d; --bg-1:#101216; --bg-2:#15181e; --bg-3:#1c2027;
  --line:rgba(255,255,255,.07); --line-strong:rgba(255,255,255,.14);
  --text:#f3f4f6; --text-2:#b4bac4; --muted:#6f7783;
  --gold:#d9b75a; --gold-hi:#e8cf88; --emerald:#46d39a; --crimson:#f0616a;
  --shadow:0 16px 44px -18px rgba(0,0,0,.75);
  min-height:calc(100vh - 3rem); margin:-1.5rem; color:var(--text);
  background:linear-gradient(180deg,#0c0d10,var(--bg-0));
  font-family:var(--font-sans, "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
  font-size:14px; line-height:1.5; letter-spacing:-.01em; -webkit-font-smoothing:antialiased;
  display:flex; flex-direction:column;
}
.cslh-root *{ box-sizing:border-box; }
.cslh-header{ padding:16px 26px; border-bottom:1px solid var(--line);
  background:linear-gradient(180deg,rgba(255,255,255,.025),transparent);
  display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.cslh-header .back{ color:var(--muted); text-decoration:none; font-size:12.5px; font-weight:600; }
.cslh-header .back:hover{ color:var(--gold-hi); }
.cslh-header h1{ font-size:19px; margin:0; font-weight:700; letter-spacing:-.3px; }
.cslh-header small{ color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
.cslh-header .spacer{ flex:1; }
.cslh-header .search{ display:flex; gap:8px; }
.cslh-header .search input{ height:36px; font-size:13px; padding:0 12px; border-radius:9px; width:220px;
  background:var(--bg-2); border:1px solid var(--line-strong); color:var(--text); font-family:inherit; }
.cslh-header .search button{ height:36px; padding:0 14px; border-radius:9px; font:inherit; font-size:12px; font-weight:700;
  cursor:pointer; color:#0b0d11; background:var(--gold); border:1px solid var(--gold); }
.cslh-alert{ margin:12px 26px 0; padding:10px 15px; border-radius:11px; background:rgba(240,97,106,.1);
  border:1px solid rgba(240,97,106,.28); color:var(--crimson); font-size:13px; }
.cslh-body{ flex:1; padding:22px 26px; display:flex; flex-direction:column; gap:14px; }
.cslh-table-wrap{ background:var(--bg-1); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow); overflow:auto; }
.cslh-table{ width:100%; border-collapse:collapse; font-size:13px; }
.cslh-table th{ text-align:left; padding:11px 16px; color:var(--muted); font-size:10.5px; text-transform:uppercase;
  letter-spacing:1px; font-weight:700; border-bottom:1px solid var(--line-strong); position:sticky; top:0; background:var(--bg-1); }
.cslh-table td{ padding:11px 16px; border-bottom:1px solid var(--line); }
.cslh-table .mono{ font-variant-numeric:tabular-nums; }
.cslh-table .pkg{ max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cslh-table .empty{ text-align:center; padding:40px 0; color:var(--muted); }
.cslh-table .row{ cursor:pointer; transition:background .12s; }
.cslh-table .row:hover{ background:rgba(255,255,255,.03); }
.cslh-table .row.open{ background:rgba(217,183,90,.06); }
.cslh-table .dot{ display:inline-block; width:11px; height:11px; border-radius:999px; box-shadow:0 0 8px currentColor; }
.cslh-table .detail td{ background:var(--bg-2); padding:12px 16px 16px; }
.scans{ display:flex; flex-wrap:wrap; gap:8px; }
.scans .scan{ display:flex; flex-direction:column; gap:2px; padding:7px 11px; border-radius:9px; background:var(--bg-3);
  border:1px solid var(--line); font-size:12px; font-variant-numeric:tabular-nums; }
.scans .scan small{ color:var(--muted); font-size:10px; }
.cslh-pager{ display:flex; align-items:center; justify-content:space-between; padding:0 4px; color:var(--muted); font-size:12.5px; }
.cslh-pager .btns{ display:flex; gap:8px; }
.cslh-pager button{ padding:7px 14px; border-radius:9px; font:inherit; font-size:12px; font-weight:600; cursor:pointer;
  color:var(--text-2); background:rgba(255,255,255,.02); border:1px solid var(--line-strong); }
.cslh-pager button:disabled{ opacity:.4; cursor:not-allowed; }
.cslh-pager button:not(:disabled):hover{ border-color:var(--gold); color:var(--gold-hi); }
@media (max-width:640px){
  .cslh-header{ padding:12px 14px; }
  .cslh-header .search input{ width:150px; }
  .cslh-body{ padding:14px; }
  .cslh-table th:nth-child(4), .cslh-table td:nth-child(4){ display:none; }
}
`;
