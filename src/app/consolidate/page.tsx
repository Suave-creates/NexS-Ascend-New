'use client';

// ConsolidAte — scanner-ONLY consolidation console (Tray Releaser look).
// No buttons in the workflow. Two auto-focusing scan fields drive everything:
//   PICK item barcode  -> slot light glows, cursor jumps to LOCATION
//   PUT  location scan -> confirms the item into the slot (repeat per item)
//   when the order is 100% consolidated -> LOCATION scan = ACKNOWLEDGE -> release
// Dump sync + grid refresh run automatically in the background.

import { useCallback, useEffect, useRef, useState } from 'react';
import ConsolidateGrid from './components/ConsolidateGrid';
import { loadOrderQcDump, syncDump } from './lib/nexsDump';
import type { Slot, Stats } from './types';

const DUMP_INTERVAL_MS = 30_000;
const GRID_INTERVAL_MS = 3_000;

type Step = 'PICK' | 'PUT' | 'ACK';
interface Current {
  pkg: string;
  item: string;
  slotNumber: number;
  slotBarcode: string;
  rackNumber: number;
  expected: number;
  placed: number;
}

export default function ConsolidatePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [step, setStep] = useState<Step>('PICK');
  const [current, setCurrent] = useState<Current | null>(null);
  const [itemVal, setItemVal] = useState('');
  const [locVal, setLocVal] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [dump, setDump] = useState<{ syncing: boolean; last: string | null; total: number; error: string | null }>({
    syncing: false, last: null, total: 0, error: null,
  });

  const pickRef = useRef<HTMLInputElement>(null);
  const locRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const dumpBusy = useRef(false);
  const gridBusy = useRef(false);
  const stepRef = useRef<Step>('PICK');
  stepRef.current = step;

  const color = (typeof window !== 'undefined' && localStorage.getItem('consolidate.color')) || 'BLUE';
  const facility = (typeof window !== 'undefined' && localStorage.getItem('consolidate.facility')) || 'NXS1';
  const workstation = (typeof window !== 'undefined' && localStorage.getItem('consolidate.workstation')) || 'QC01';

  const addLog = useCallback((msg: string, kind: 'ok' | 'err' | 'info' = 'info') => {
    const t = new Date().toLocaleTimeString();
    const mark = kind === 'err' ? '✕' : kind === 'ok' ? '✓' : '·';
    setLog((l) => [`${t}  ${mark} ${msg}`, ...l].slice(0, 60));
  }, []);

  // Keep the active field focused (kiosk / scanner).
  const focusActive = useCallback(() => {
    setTimeout(() => {
      (stepRef.current === 'PICK' ? pickRef : locRef).current?.focus();
    }, 20);
  }, []);
  useEffect(() => { focusActive(); }, [step, focusActive]);

  // ---- grid poll ----
  const refreshGrid = useCallback(async () => {
    if (gridBusy.current) return;
    gridBusy.current = true;
    try {
      const res = await fetch('/api/consolidate/locations');
      const d = await res.json();
      if (res.ok) { setSlots(d.locations || []); setStats(d.stats || null); }
    } catch { /* transient */ }
    finally { gridBusy.current = false; }
  }, []);
  useEffect(() => {
    refreshGrid();
    const id = setInterval(refreshGrid, GRID_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refreshGrid]);

  // ---- dump poll ----
  const runDump = useCallback(async () => {
    if (dumpBusy.current) return;
    dumpBusy.current = true;
    setDump((d) => ({ ...d, syncing: true, error: null }));
    try {
      const { rows, total } = await loadOrderQcDump({ facility, workstation });
      if (rows.length === 0) {
        setDump({ syncing: false, last: new Date().toLocaleTimeString(), total: 0, error: null });
      } else {
        await syncDump(rows);
        setDump({ syncing: false, last: new Date().toLocaleTimeString(), total, error: null });
      }
    } catch (e) {
      setDump((d) => ({ ...d, syncing: false, error: (e as Error).message }));
    } finally {
      dumpBusy.current = false;
    }
  }, [facility, workstation]);
  useEffect(() => {
    runDump();
    const id = setInterval(runDump, DUMP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [runDump]);

  // ---- PICK ----
  const onPick = async () => {
    const barcode = itemVal.trim();
    setItemVal('');
    if (!barcode || busy.current) return;
    busy.current = true;
    try {
      const res = await fetch('/api/consolidate/scan-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, operatorColor: color }),
      });
      const d = await res.json();
      if (!res.ok || !d.location) {
        addLog(`PICK ${barcode}: ${d.error || 'failed'}`, 'err');
      } else {
        setCurrent({
          pkg: d.shippingPackageId, item: barcode,
          slotNumber: d.location.locationNumber, slotBarcode: d.location.barcode,
          rackNumber: d.location.rackNumber, expected: d.expected, placed: d.placed,
        });
        setStep(d.complete ? 'ACK' : 'PUT');
        addLog(`PICK ${barcode} → ${d.shippingPackageId} → slot #${d.location.locationNumber} (${d.placed}/${d.expected})`, 'ok');
        refreshGrid();
      }
    } catch (e) {
      addLog(`PICK ${barcode}: ${(e as Error).message}`, 'err');
    } finally {
      busy.current = false;
      focusActive();
    }
  };

  // ---- PUT / ACK (location field) ----
  const onLocation = async () => {
    const loc = locVal.trim();
    setLocVal('');
    if (!loc || busy.current) return;
    if (!current) { addLog('Scan an item first', 'err'); focusActive(); return; }
    if (loc !== current.slotBarcode) {
      addLog(`WRONG LOCATION ${loc} — expected slot #${current.slotNumber} (${current.slotBarcode})`, 'err');
      focusActive();
      return;
    }
    busy.current = true;
    try {
      if (stepRef.current === 'ACK') {
        const res = await fetch('/api/consolidate/complete-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationBarcode: loc }),
        });
        const d = await res.json();
        if (!res.ok) {
          addLog(`ACK slot #${current.slotNumber}: ${d.error || 'failed'}`, 'err');
        } else {
          addLog(`ACK slot #${current.slotNumber} — ${current.pkg} released, ready-to-ship`, 'ok');
          setCurrent(null);
          setStep('PICK');
        }
      } else {
        // PUT
        const res = await fetch('/api/consolidate/confirm-placement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode: current.item, locationBarcode: loc }),
        });
        const d = await res.json();
        if (!res.ok) {
          addLog(`PUT ${current.item}: ${d.error || 'failed'}`, 'err');
        } else {
          setCurrent((c) => (c ? { ...c, placed: d.placed, expected: d.expected } : c));
          if (d.complete) {
            setStep('ACK');
            addLog(`PUT ok — ORDER COMPLETE ${d.placed}/${d.expected} — scan location to ACKNOWLEDGE`, 'ok');
          } else {
            setStep('PICK');
            addLog(`PUT ok ${d.placed}/${d.expected} — PICK next item`, 'ok');
          }
          refreshGrid();
        }
      }
    } catch (e) {
      addLog(`${stepRef.current} ${loc}: ${(e as Error).message}`, 'err');
    } finally {
      busy.current = false;
      focusActive();
    }
  };

  const onEnter = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); fn(); }
  };
  const keepFocus = () => focusActive();

  const pct = current && current.expected > 0
    ? Math.min(100, Math.round((current.placed / current.expected) * 100)) : 0;

  const banner =
    step === 'PICK' ? { cls: 'pick', text: current ? '① PICK — scan next item barcode' : '① PICK — scan item barcode' }
    : step === 'PUT' ? { cls: 'put', text: `② PUT — scan LOCATION #${current?.slotNumber} · Rack ${current?.rackNumber}` }
    : { cls: 'ack', text: `✓ COMPLETE — scan LOCATION #${current?.slotNumber} to ACKNOWLEDGE & ship` };

  return (
    <div className="csl-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="csl-header">
        <div className="brand"><span className="glyph">◆</span><h1>ConsolidAte</h1><small>Order QC → PTL</small></div>
        <span className="spacer" />
        <span className="stat"><b>{dump.total}</b> dump</span>
        <span className="stat"><b className="amber">{stats?.consolidating ?? 0}</b> consolidating</span>
        <span className="stat"><b className="emerald">{stats?.complete ?? 0}</b> ready</span>
        <span className="stat"><b>{stats?.freeSlots ?? 0}</b> free</span>
        <span className={'pill ' + (dump.error ? 'err' : dump.syncing ? 'warn' : 'ok')}>
          {dump.error ? 'sync error' : dump.syncing ? 'syncing…' : `synced ${dump.last ?? '—'}`}
        </span>
      </header>

      {dump.error && <div className="csl-alert">Dump sync failed: {dump.error} — is the NexS tab logged in?</div>}

      <div className="csl-body">
        <section className="csl-console">
          <div className={'csl-banner ' + banner.cls}>{banner.text}</div>

          <div className="csl-fields">
            <label className={'csl-field' + (step === 'PICK' ? ' active' : '')}>
              <span>PICK · item</span>
              <input
                ref={pickRef}
                autoFocus
                disabled={step !== 'PICK'}
                value={itemVal}
                placeholder="scan item barcode"
                onChange={(e) => setItemVal(e.target.value)}
                onKeyDown={onEnter(onPick)}
                onBlur={keepFocus}
              />
            </label>
            <label className={'csl-field' + (step !== 'PICK' ? ' active' : '')}>
              <span>{step === 'ACK' ? 'ACK · location' : 'PUT · location'}</span>
              <input
                ref={locRef}
                disabled={step === 'PICK'}
                value={locVal}
                placeholder="scan location barcode"
                onChange={(e) => setLocVal(e.target.value)}
                onKeyDown={onEnter(onLocation)}
                onBlur={keepFocus}
              />
            </label>
          </div>

          {current && (
            <div className={'csl-task' + (step === 'ACK' ? ' done' : '')}>
              <div className="row"><span>Package</span><b title={current.pkg}>{current.pkg}</b></div>
              <div className="row"><span>Slot</span><b>#{current.slotNumber} · Rack {current.rackNumber}</b></div>
              <div className="bar"><i style={{ width: `${pct}%` }} className={step === 'ACK' ? 'ok' : ''} /></div>
              <div className="row sm"><span>Placed</span><b>{current.placed}/{current.expected}</b></div>
            </div>
          )}

          <div className="csl-log">
            {log.length === 0 ? <div className="empty">Scan an item to begin…</div>
              : log.map((l, i) => <div key={i} className={l.includes('✕') ? 'e' : l.includes('✓') ? 'o' : ''}>{l}</div>)}
          </div>
        </section>

        <section className="csl-gridwrap">
          <div className="csl-gridhead">PTL grid · <b>{stats?.totalSlots ?? slots.length}</b> slots</div>
          {slots.length === 0
            ? <div className="csl-noslots">No slots — run scripts/seed-consolidate-grid.cjs</div>
            : <ConsolidateGrid slots={slots} highlightLocationId={current ? slots.find((s) => s.locationNumber === current.slotNumber)?.id ?? null : null} />}
        </section>
      </div>
    </div>
  );
}

const CSS = `
.csl-root{
  --bg-0:#060708; --bg-1:#0d0f13; --bg-2:#14171d; --bg-3:#1b1f27;
  --line:#262b34; --line-strong:#343b47; --text:#f6f4ee; --text-2:#c4c9d2; --muted:#8b929e;
  --gold:#d9b75a; --gold-hi:#f1d690; --emerald:#46d39a; --crimson:#e5484d; --amber:#f5b942; --blue:#5b9cf6;
  min-height:calc(100vh - 3rem); margin:-1.5rem; border-radius:0; color:var(--text);
  background:radial-gradient(1200px 500px at 80% -10%,rgba(217,183,90,.06),transparent 60%),
             radial-gradient(900px 500px at 0% 110%,rgba(91,156,246,.05),transparent 55%),var(--bg-0);
  font:14px/1.5 "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;
  display:flex; flex-direction:column;
}
.csl-root *{ box-sizing:border-box; }
.csl-header{ padding:12px 20px; background:linear-gradient(180deg,#101319,#0b0d11); border-bottom:1px solid var(--line);
  display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.csl-header .brand{ display:flex; align-items:baseline; gap:8px; }
.csl-header .brand h1{ font-size:18px; margin:0; font-weight:800; letter-spacing:.4px; }
.csl-header .brand .glyph{ color:var(--gold); font-weight:800; }
.csl-header .brand small{ color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:2px; }
.csl-header .spacer{ flex:1; }
.csl-header .stat{ color:var(--text-2); font-size:12.5px; } .csl-header .stat b{ color:var(--text); font-weight:700; }
.csl-header .amber{ color:var(--amber)!important; } .csl-header .emerald{ color:var(--emerald)!important; }
.pill{ padding:4px 11px; border-radius:999px; font-size:10.5px; font-weight:800; letter-spacing:.4px; text-transform:uppercase; }
.pill.ok{ background:rgba(70,211,154,.15); color:var(--emerald); border:1px solid rgba(70,211,154,.35); }
.pill.warn{ background:rgba(245,185,66,.14); color:var(--amber); border:1px solid rgba(245,185,66,.3); }
.pill.err{ background:rgba(229,72,77,.15); color:var(--crimson); border:1px solid rgba(229,72,77,.35); }
.csl-alert{ margin:10px 20px 0; padding:9px 14px; border-radius:9px; background:rgba(245,185,66,.12);
  border:1px solid rgba(245,185,66,.3); color:var(--amber); font-size:13px; }
.csl-body{ flex:1; display:grid; grid-template-columns:minmax(360px,460px) 1fr; gap:16px; padding:16px 20px; }
.csl-console{ display:flex; flex-direction:column; gap:12px; }
.csl-banner{ padding:14px 16px; border-radius:12px; font-size:16px; font-weight:800; letter-spacing:.3px; text-align:center;
  border:1px solid var(--line-strong); }
.csl-banner.pick{ background:rgba(217,183,90,.12); color:var(--gold-hi); border-color:rgba(217,183,90,.4); }
.csl-banner.put{ background:rgba(91,156,246,.13); color:var(--blue); border-color:rgba(91,156,246,.4); }
.csl-banner.ack{ background:rgba(70,211,154,.14); color:var(--emerald); border-color:rgba(70,211,154,.45);
  animation:cslpulse 1.1s ease-in-out infinite; }
@keyframes cslpulse{ 0%,100%{ box-shadow:0 0 0 0 rgba(70,211,154,.0);} 50%{ box-shadow:0 0 22px 0 rgba(70,211,154,.35);} }
.csl-fields{ display:flex; flex-direction:column; gap:10px; }
.csl-field{ display:flex; flex-direction:column; gap:5px; opacity:.45; transition:opacity .15s; }
.csl-field.active{ opacity:1; }
.csl-field span{ font-size:10.5px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); font-weight:700; }
.csl-field input{ height:56px; font-size:22px; font-weight:700; letter-spacing:1px; padding:0 16px; border-radius:10px;
  background:var(--bg-3); border:1px solid var(--line-strong); color:var(--text); font-family:ui-monospace,Consolas,monospace; }
.csl-field.active input{ border-color:var(--gold); box-shadow:0 0 0 1px var(--gold),0 0 18px rgba(217,183,90,.18); }
.csl-field input:disabled{ background:var(--bg-1); color:var(--muted); }
.csl-task{ padding:12px 14px; border-radius:11px; background:var(--bg-1); border:1px solid var(--line); }
.csl-task.done{ border-color:rgba(70,211,154,.4); background:rgba(70,211,154,.06); }
.csl-task .row{ display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:13px; margin:2px 0; }
.csl-task .row.sm{ font-size:11.5px; color:var(--muted); }
.csl-task .row span{ color:var(--muted); } .csl-task .row b{ color:var(--text); font-weight:700; max-width:60%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.csl-task .bar{ height:9px; border-radius:999px; background:var(--bg-3); overflow:hidden; margin:8px 0 4px; }
.csl-task .bar i{ display:block; height:100%; background:var(--blue); border-radius:999px; transition:width .25s; }
.csl-task .bar i.ok{ background:var(--emerald); }
.csl-log{ flex:1; min-height:130px; max-height:38vh; overflow:auto; background:#0a0c0f; border:1px solid var(--line);
  border-radius:10px; padding:9px 11px; font-family:ui-monospace,Consolas,Menlo,monospace; font-size:12px; color:var(--muted); }
.csl-log .empty{ color:var(--muted); opacity:.6; }
.csl-log .o{ color:var(--emerald); } .csl-log .e{ color:var(--crimson); }
.csl-gridwrap{ background:var(--bg-1); border:1px solid var(--line); border-radius:12px; padding:14px 16px; overflow:auto; }
.csl-gridhead{ font-size:11px; text-transform:uppercase; letter-spacing:1.4px; color:var(--gold); margin-bottom:12px; }
.csl-gridhead b{ color:var(--text); }
.csl-noslots{ color:var(--muted); text-align:center; padding:40px 0; font-size:13px; }
.csl-grids{ display:flex; flex-direction:column; gap:18px; }
.csl-rack h3{ font-size:12px; color:var(--text-2); margin:0 0 8px; font-weight:700; }
.csl-grid{ display:grid; grid-template-columns:repeat(5,1fr); gap:8px; }
.csl-slot{ aspect-ratio:1; border-radius:9px; border:1px solid var(--line-strong); background:var(--bg-2);
  display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; color:var(--muted); }
.csl-slot.on{ background:var(--bg-3); }
.csl-slot.hi{ outline:2px solid var(--gold); outline-offset:2px; }
.csl-slot-no{ position:absolute; top:3px; left:5px; font-size:9px; opacity:.6; }
.csl-slot-count{ font-size:18px; font-weight:800; }
.csl-slot-tag{ font-size:8px; font-weight:800; letter-spacing:1px; }
.csl-slot-free{ font-size:16px; opacity:.4; }
@media (max-width:760px){
  .csl-body{ grid-template-columns:1fr; }
  .csl-header{ gap:10px; } .csl-header .stat{ font-size:11.5px; }
  .csl-field input{ height:52px; font-size:20px; }
  .csl-grid{ gap:5px; } .csl-slot-count{ font-size:15px; }
}
`;
