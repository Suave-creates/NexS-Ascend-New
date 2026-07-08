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
import type { Slot, Stats, OperatorColor } from './types';

const DUMP_INTERVAL_MS = 300_000; // 5 min — poll NexS Order QC dump (paginates per run)
const GRID_INTERVAL_MS = 3_000;   // local DB grid read only (cheap)

// Power Ranger operator colours. GREEN is reserved for a completed/ready slot,
// so it is not offered as an operator glow colour (would be ambiguous).
const RANGERS: { color: OperatorColor; name: string; hex: string }[] = [
  { color: 'RED', name: 'Red', hex: '#e5484d' },
  { color: 'BLUE', name: 'Blue', hex: '#5b9cf6' },
  { color: 'YELLOW', name: 'Yellow', hex: '#f5b942' },
  { color: 'PINK', name: 'Pink', hex: '#f26fb8' },
];

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
  const currentRef = useRef<Current | null>(null);
  currentRef.current = current;

  const [color, setColor] = useState<OperatorColor>('BLUE');
  const facility = (typeof window !== 'undefined' && localStorage.getItem('consolidate.facility')) || 'NXS1';
  const workstation = (typeof window !== 'undefined' && localStorage.getItem('consolidate.workstation')) || 'QC01';

  useEffect(() => {
    const c = localStorage.getItem('consolidate.color') as OperatorColor | null;
    if (c) setColor(c);
  }, []);

  const chooseColor = (c: OperatorColor) => {
    setColor(c);
    localStorage.setItem('consolidate.color', c);
    // input onBlur -> keepFocus refocuses the active scan field after the click.
  };

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

  // Resolve a scanned value as a dump ITEM (PICK). 'ok' | 'notfound' | 'error'.
  const pick = async (barcode: string): Promise<'ok' | 'notfound' | 'error'> => {
    try {
      const res = await fetch('/api/consolidate/scan-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, operatorColor: color }),
      });
      if (res.status === 404) return 'notfound';
      const d = await res.json();
      if (!res.ok || !d.location) { addLog(`PICK ${barcode}: ${d.error || 'failed'}`, 'err'); return 'error'; }
      const prev = currentRef.current;
      if (prev && prev.pkg !== d.shippingPackageId && prev.placed < prev.expected) {
        addLog(`Switched from ${prev.pkg} (${prev.placed}/${prev.expected}, NOT released)`, 'err');
      }
      setCurrent({
        pkg: d.shippingPackageId, item: barcode,
        slotNumber: d.location.locationNumber, slotBarcode: d.location.barcode,
        rackNumber: d.location.rackNumber, expected: d.expected, placed: d.placed,
      });
      setStep(d.complete ? 'ACK' : 'PUT');
      // Optimistically glow the slot NOW — the UI must not wait on the grid poll
      // (or the fire-and-forget ESP32) to light up. refreshGrid() reconciles.
      const locId = d.location.id as number;
      setSlots((prev) => prev.map((s) =>
        s.id === locId
          ? { ...s, lightState: 'ON', status: d.complete ? 'COMPLETE' : 'CONSOLIDATING',
              operatorColor: color, shippingPackageId: d.shippingPackageId,
              expected: d.expected, accounted: d.placed }
          : s));
      addLog(`PICK ${barcode} → ${d.shippingPackageId} → slot #${d.location.locationNumber} (${d.placed}/${d.expected})`, 'ok');
      refreshGrid();
      return 'ok';
    } catch (e) {
      addLog(`PICK ${barcode}: ${(e as Error).message}`, 'err');
      return 'error';
    }
  };

  // ---- PICK field ----
  const onPick = async () => {
    const barcode = itemVal.trim();
    setItemVal('');
    if (!barcode || busy.current) return;
    busy.current = true;
    try {
      const r = await pick(barcode);
      if (r === 'notfound') addLog(`PICK ${barcode}: not in QC dump`, 'err');
    } finally {
      busy.current = false;
      focusActive();
    }
  };

  // ---- LOCATION field (PUT / ACK, with scanner-only re-pick escape) ----
  const onLocation = async () => {
    const loc = locVal.trim();
    setLocVal('');
    if (!loc || busy.current) return;
    const cur = currentRef.current;
    if (!cur) { addLog('Scan an item first', 'err'); focusActive(); return; }
    busy.current = true;
    try {
      // A scan that isn't the expected slot may be a different ITEM — re-pick it
      // (scanner-only escape when the wrong item was picked / can't be placed).
      if (loc !== cur.slotBarcode) {
        const r = await pick(loc);
        if (r !== 'ok') addLog(`WRONG LOCATION ${loc} — expected slot #${cur.slotNumber} (${cur.slotBarcode})`, 'err');
        return;
      }

      if (stepRef.current === 'ACK') {
        const res = await fetch('/api/consolidate/complete-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationBarcode: loc }),
        });
        const d = await res.json();
        if (!res.ok) {
          if (d.error === 'NOT_COMPLETE') {
            // Dump changed after it went green — reopen so PICK is usable again.
            setStep('PICK');
            if (d.progress) setCurrent((c) => (c ? { ...c, placed: d.progress.accounted, expected: d.progress.expected } : c));
            addLog(`No longer complete (${d.progress?.accounted ?? '?'}/${d.progress?.expected ?? '?'}) — PICK missing item(s)`, 'err');
          } else {
            addLog(`ACK slot #${cur.slotNumber}: ${d.error || 'failed'}`, 'err');
          }
        } else {
          addLog(`ACK slot #${cur.slotNumber} — ${cur.pkg} released, ready-to-ship`, 'ok');
          // Optimistically free the slot on the board (light off).
          setSlots((prev) => prev.map((s) =>
            s.locationNumber === cur.slotNumber
              ? { ...s, lightState: 'OFF', status: 'FREE', shippingPackageId: null,
                  operatorColor: null, expected: 0, accounted: 0 }
              : s));
          setCurrent(null);
          setStep('PICK');
          refreshGrid();
        }
      } else {
        // PUT
        const res = await fetch('/api/consolidate/confirm-placement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode: cur.item, locationBarcode: loc }),
        });
        const d = await res.json();
        if (!res.ok) {
          addLog(`PUT ${cur.item}: ${d.error || 'failed'}`, 'err');
        } else {
          setCurrent((c) => (c ? { ...c, placed: d.placed, expected: d.expected } : c));
          // Put-to-light: item placed → the slot's light goes OFF, so only the
          // next PICK's target is ever lit. Count updates; green when complete.
          setSlots((prev) => prev.map((s) =>
            s.locationNumber === cur.slotNumber
              ? { ...s, lightState: 'OFF', status: d.complete ? 'COMPLETE' : 'CONSOLIDATING',
                  expected: d.expected, accounted: d.placed }
              : s));
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
          {/* Power Ranger operator picker (one-time per shift; not part of the scan loop) */}
          <div className="csl-rangers">
            <span className="lbl">Ranger</span>
            {RANGERS.map((r) => (
              <button
                key={r.color}
                type="button"
                className={'ranger' + (color === r.color ? ' on' : '')}
                style={{ '--rc': r.hex } as React.CSSProperties}
                onClick={() => chooseColor(r.color)}
                title={`${r.name} Ranger`}
                aria-pressed={color === r.color}
              >
                <span className="dot" />
                <span className="nm">{r.name}</span>
              </button>
            ))}
          </div>

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
  --bg-0:#0a0b0d; --bg-1:#101216; --bg-2:#15181e; --bg-3:#1c2027;
  --line:rgba(255,255,255,.07); --line-strong:rgba(255,255,255,.14);
  --text:#f3f4f6; --text-2:#b4bac4; --muted:#6f7783;
  --gold:#d9b75a; --gold-hi:#e8cf88; --emerald:#46d39a; --crimson:#f0616a; --amber:#fbbf24; --blue:#60a5fa;
  --shadow:0 16px 44px -18px rgba(0,0,0,.75);
  min-height:calc(100vh - 3rem); margin:-1.5rem; color:var(--text);
  background:radial-gradient(900px 420px at 88% -12%, rgba(217,183,90,.05), transparent 62%),
             linear-gradient(180deg,#0c0d10,var(--bg-0));
  font-family:var(--font-sans, "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
  font-size:14px; line-height:1.5; letter-spacing:-.01em; -webkit-font-smoothing:antialiased;
  display:flex; flex-direction:column;
}
.csl-root *{ box-sizing:border-box; }
.csl-header{ padding:16px 26px; border-bottom:1px solid var(--line);
  background:linear-gradient(180deg,rgba(255,255,255,.025),transparent);
  display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.csl-header .brand{ display:flex; align-items:baseline; gap:9px; }
.csl-header .brand h1{ font-size:19px; margin:0; font-weight:700; letter-spacing:-.3px; }
.csl-header .brand .glyph{ color:var(--gold); font-weight:700; }
.csl-header .brand small{ color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:2.5px; font-weight:600; }
.csl-header .spacer{ flex:1; }
.csl-header .stat{ display:inline-flex; align-items:baseline; gap:5px; padding:6px 12px; border:1px solid var(--line);
  border-radius:10px; background:rgba(255,255,255,.02); color:var(--muted); font-size:10.5px; text-transform:uppercase; letter-spacing:.5px; font-weight:600; }
.csl-header .stat b{ color:var(--text); font-weight:700; font-size:14px; font-variant-numeric:tabular-nums; letter-spacing:0; }
.csl-header .amber{ color:var(--amber)!important; } .csl-header .emerald{ color:var(--emerald)!important; }
.pill{ padding:6px 13px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }
.pill.ok{ background:rgba(70,211,154,.12); color:var(--emerald); border:1px solid rgba(70,211,154,.28); }
.pill.warn{ background:rgba(251,191,36,.12); color:var(--amber); border:1px solid rgba(251,191,36,.28); }
.pill.err{ background:rgba(240,97,106,.12); color:var(--crimson); border:1px solid rgba(240,97,106,.3); }
.csl-alert{ margin:12px 26px 0; padding:10px 15px; border-radius:11px; background:rgba(251,191,36,.1);
  border:1px solid rgba(251,191,36,.28); color:var(--amber); font-size:13px; }
.csl-body{ flex:1; display:grid; grid-template-columns:minmax(380px,440px) 1fr; gap:22px; padding:22px 26px; align-items:start; }
.csl-console{ display:flex; flex-direction:column; gap:14px; }
.csl-banner{ padding:16px 18px; border-radius:14px; font-size:15px; font-weight:700; letter-spacing:-.1px; text-align:center;
  border:1px solid var(--line); background:var(--bg-1); box-shadow:var(--shadow); }
.csl-banner.pick{ color:var(--gold-hi); border-color:rgba(217,183,90,.32); background:linear-gradient(180deg,rgba(217,183,90,.08),var(--bg-1)); }
.csl-banner.put{ color:var(--blue); border-color:rgba(96,165,250,.32); background:linear-gradient(180deg,rgba(96,165,250,.09),var(--bg-1)); }
.csl-banner.ack{ color:var(--emerald); border-color:rgba(70,211,154,.4); background:linear-gradient(180deg,rgba(70,211,154,.1),var(--bg-1));
  animation:cslpulse 1.5s ease-in-out infinite; }
@keyframes cslpulse{ 0%,100%{ box-shadow:var(--shadow);} 50%{ box-shadow:var(--shadow),0 0 26px -2px rgba(70,211,154,.4);} }
.csl-rangers{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.csl-rangers .lbl{ font-size:10px; text-transform:uppercase; letter-spacing:1.6px; color:var(--muted); font-weight:700; margin-right:2px; }
.csl-root .ranger{ display:inline-flex; align-items:center; gap:8px; padding:7px 14px; border-radius:999px; font:inherit;
  font-weight:600; font-size:12.5px; letter-spacing:.2px; cursor:pointer; color:var(--text-2);
  background:rgba(255,255,255,.02); border:1px solid var(--line-strong); transition:all .14s ease; }
.csl-root .ranger .dot{ width:10px; height:10px; border-radius:999px; background:var(--rc); box-shadow:0 0 8px var(--rc); }
.csl-root .ranger:hover{ border-color:var(--rc); color:var(--text); }
.csl-root .ranger.on{ color:#0b0d11; background:var(--rc); border-color:var(--rc); font-weight:700; box-shadow:0 6px 18px -6px var(--rc); }
.csl-root .ranger.on .dot{ background:#0b0d11; box-shadow:none; }
.csl-fields{ display:flex; flex-direction:column; gap:12px; }
.csl-field{ display:flex; flex-direction:column; gap:6px; opacity:.4; transition:opacity .15s; }
.csl-field.active{ opacity:1; }
.csl-field span{ font-size:10px; text-transform:uppercase; letter-spacing:1.6px; color:var(--muted); font-weight:700; }
.csl-field input{ height:60px; font-size:22px; font-weight:600; letter-spacing:.4px; padding:0 18px; border-radius:14px;
  background:var(--bg-2); border:1px solid var(--line-strong); color:var(--text); font-family:inherit; font-variant-numeric:tabular-nums;
  transition:border-color .15s, box-shadow .15s, background .15s; }
.csl-field input::placeholder{ color:var(--muted); font-weight:500; letter-spacing:0; }
.csl-field.active input{ border-color:var(--gold); box-shadow:0 0 0 4px rgba(217,183,90,.13); background:var(--bg-3); }
.csl-field input:disabled{ background:var(--bg-1); color:var(--muted); border-color:var(--line); }
.csl-task{ padding:14px 16px; border-radius:14px; background:var(--bg-1); border:1px solid var(--line); box-shadow:var(--shadow); }
.csl-task.done{ border-color:rgba(70,211,154,.35); }
.csl-task .row{ display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:13px; margin:3px 0; }
.csl-task .row.sm{ font-size:11.5px; }
.csl-task .row span{ color:var(--muted); text-transform:uppercase; font-size:10px; letter-spacing:1px; font-weight:600; }
.csl-task .row b{ color:var(--text); font-weight:700; max-width:62%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-variant-numeric:tabular-nums; }
.csl-task .bar{ height:8px; border-radius:999px; background:var(--bg-3); overflow:hidden; margin:10px 0 5px; border:1px solid var(--line); }
.csl-task .bar i{ display:block; height:100%; background:linear-gradient(90deg,var(--blue),#8fbcff); border-radius:999px; transition:width .3s ease; }
.csl-task .bar i.ok{ background:linear-gradient(90deg,var(--emerald),#7be6b6); }
.csl-log{ flex:1; min-height:120px; max-height:34vh; overflow:auto; background:var(--bg-1); border:1px solid var(--line);
  border-radius:14px; padding:12px 15px; font-family:inherit; font-size:12px; color:var(--muted); box-shadow:var(--shadow); }
.csl-log div{ padding:1.5px 0; font-variant-numeric:tabular-nums; }
.csl-log .empty{ color:var(--muted); opacity:.6; }
.csl-log .o{ color:var(--emerald); } .csl-log .e{ color:var(--crimson); }
.csl-gridwrap{ background:var(--bg-1); border:1px solid var(--line); border-radius:16px; padding:20px 22px; overflow:auto; box-shadow:var(--shadow); }
.csl-gridhead{ font-size:10px; text-transform:uppercase; letter-spacing:1.6px; color:var(--muted); font-weight:700; margin-bottom:18px; }
.csl-gridhead b{ color:var(--text); }
.csl-noslots{ color:var(--muted); text-align:center; padding:48px 0; font-size:13px; }
.csl-grids{ display:flex; flex-wrap:wrap; gap:28px; }
.csl-rack{ width:290px; }
.csl-rack h3{ font-size:11px; color:var(--text-2); margin:0 0 11px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; }
.csl-grid{ display:grid; grid-template-columns:repeat(5,1fr); gap:7px; }
.csl-slot{ aspect-ratio:1; border-radius:12px; border:1px solid var(--line); background:var(--bg-2);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; position:relative; color:var(--muted); transition:all .15s ease; }
.csl-slot.asg{ background:rgba(255,255,255,.02); }
.csl-slot.on{ background:rgba(255,255,255,.05); animation:cslslot 1.1s ease-in-out infinite; }
@keyframes cslslot{ 0%,100%{ filter:brightness(1);} 50%{ filter:brightness(1.4);} }
.csl-slot.hi{ outline:2px solid var(--gold); outline-offset:2px; }
.csl-slot-no{ font-size:21px; font-weight:800; line-height:1; font-variant-numeric:tabular-nums; letter-spacing:-.5px; }
.csl-slot.on .csl-slot-no, .csl-slot.asg .csl-slot-no{ font-size:17px; }
.csl-slot-count{ font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; }
.csl-slot-tag{ font-size:7.5px; font-weight:800; letter-spacing:1px; }
@media (max-width:760px){
  .csl-body{ grid-template-columns:1fr; padding:16px; gap:16px; }
  .csl-header{ gap:10px; padding:14px 16px; }
  .csl-field input{ height:56px; font-size:20px; }
  .csl-rack{ width:100%; } .csl-grid{ gap:6px; }
  .csl-slot-no{ font-size:24px; } .csl-slot.on .csl-slot-no, .csl-slot.asg .csl-slot-no{ font-size:20px; }
}
`;
