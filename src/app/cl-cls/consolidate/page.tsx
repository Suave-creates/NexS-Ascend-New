'use client';

// ConsolidAte — scanner-ONLY consolidation console (no physical PTL hardware;
// see /consolidate-ptl for the hardware-driven variant this was replicated
// from). Same put-to-light-STYLE flow, purely on-screen:
//   Scan item      -> its slot glows (operator colour); it becomes "pending".
//   Scan next item -> the previous item is CONFIRMED PLACED (its glow off),
//                     the new item's slot glows. Repeat.
//   Order complete -> that slot turns GREEN; scan its LOCATION barcode once to
//                     release it (glow off, ready-to-ship).
// The operator picks BOTH a rack (1-10, 20 slots each) and a Ranger colour
// before scanning — a brand-new package claims a slot strictly within the
// chosen rack. One scan field handles both: a value matching a slot barcode
// = release, anything else = an item scan. Dump sync + grid refresh run in
// the background.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ConsolidateGrid from './components/ConsolidateGrid';
import { loadOrderQcDump, syncDump } from './lib/nexsDump';
import type { Slot, Stats, OperatorColor } from './types';

const DUMP_INTERVAL_MS = 300_000; // 5 min — poll NexS Order QC dump (paginates per run)
const GRID_INTERVAL_MS = 3_000;   // local DB grid read only (cheap)
const RACKS = Array.from({ length: 10 }, (_, i) => i + 1); // Rack 1 (1-20) .. Rack 10 (181-200)

// Power Ranger operator colours. GREEN is reserved for a completed/ready slot,
// so it is not offered as an operator glow colour (would be ambiguous).
const RANGERS: { color: OperatorColor; name: string; hex: string }[] = [
  { color: 'RED', name: 'Red', hex: '#e5484d' },
  { color: 'BLUE', name: 'Blue', hex: '#5b9cf6' },
  { color: 'YELLOW', name: 'Yellow', hex: '#f5b942' },
  { color: 'PINK', name: 'Pink', hex: '#f26fb8' },
];

interface Current {
  pkg: string;
  item: string;
  slotNumber: number;
  slotBarcode: string;
  rackNumber: number;
  expected: number;
  placed: number;
  complete: boolean;
}

export default function ConsolidatePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [current, setCurrent] = useState<Current | null>(null);
  const [scanVal, setScanVal] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [dump, setDump] = useState<{ syncing: boolean; last: string | null; total: number; error: string | null }>({
    syncing: false, last: null, total: 0, error: null,
  });

  const scanRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const dumpBusy = useRef(false);
  const gridBusy = useRef(false);
  const lastMutateAt = useRef(0); // guards the grid poll from clobbering optimistic state
  const currentRef = useRef<Current | null>(null);
  currentRef.current = current;
  const slotsRef = useRef<Slot[]>([]);
  slotsRef.current = slots;
  const rackRef = useRef(1);

  const [color, setColor] = useState<OperatorColor>('BLUE');
  const [rack, setRack] = useState(1);
  rackRef.current = rack;
  const facility = (typeof window !== 'undefined' && localStorage.getItem('consolidate.facility')) || 'NXS1';
  const workstation = (typeof window !== 'undefined' && localStorage.getItem('consolidate.workstation')) || 'QC01';

  useEffect(() => {
    const c = localStorage.getItem('consolidate.color') as OperatorColor | null;
    if (c) setColor(c);
    const r = Number(localStorage.getItem('consolidate.rack'));
    if (r >= 1 && r <= RACKS.length) setRack(r);
  }, []);

  const chooseColor = (c: OperatorColor) => {
    // Switching colour mid-order would orphan the pending scan tagged with
    // the OLD colour — the server only lets an operator's OWN colour confirm
    // their own pending item, so a switch here would leave that item stuck
    // lit forever. Finish or release the current order first.
    if (current && !current.complete) {
      addLog(`Finish or release the current order before switching Ranger colour`, 'err');
      return;
    }
    setColor(c);
    localStorage.setItem('consolidate.color', c);
    // input onBlur -> keepFocus refocuses the scan field after the click.
  };

  const chooseRack = (r: number) => {
    // Unlike colour, the rack only affects where a BRAND-NEW package claims a
    // slot — an in-progress order keeps its already-assigned slot regardless
    // of which rack is selected now, so switching racks mid-order is safe.
    setRack(r);
    localStorage.setItem('consolidate.rack', String(r));
  };

  const addLog = useCallback((msg: string, kind: 'ok' | 'err' | 'info' = 'info') => {
    const t = new Date().toLocaleTimeString();
    const mark = kind === 'err' ? '✕' : kind === 'ok' ? '✓' : '·';
    setLog((l) => [`${t}  ${mark} ${msg}`, ...l].slice(0, 60));
  }, []);

  // Keep the scan field focused (kiosk / scanner).
  const focusActive = useCallback(() => {
    setTimeout(() => scanRef.current?.focus(), 20);
  }, []);
  useEffect(() => { focusActive(); }, [focusActive]);

  // ---- grid poll ----
  const refreshGrid = useCallback(async () => {
    if (gridBusy.current) return;
    gridBusy.current = true;
    const startedAt = Date.now();
    try {
      const res = await fetch('/api/cl-cls/consolidate/locations');
      const d = await res.json();
      // Don't let a poll that STARTED before an optimistic scan update overwrite
      // it with pre-scan data — a mutation since this fetch began means it's stale.
      if (res.ok && startedAt >= lastMutateAt.current) {
        setSlots(d.locations || []);
        setStats(d.stats || null);
      }
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

  // ---- ITEM scan: glow this item's slot, confirm the previous pending item ----
  const scanItem = async (barcode: string) => {
    try {
      const res = await fetch('/api/cl-cls/consolidate/scan-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, operatorColor: color, rackNumber: rackRef.current }),
      });
      if (res.status === 404) { addLog(`${barcode}: not in QC dump`, 'err'); return; }
      const d = await res.json();
      if (!res.ok || !d.location) {
        if (d.error === 'RACK_FULL') { addLog(`Rack ${rackRef.current} is full — pick another rack`, 'err'); return; }
        if (d.error === 'INVALID_RACK') { addLog(`Rack ${rackRef.current} doesn't exist — pick another rack`, 'err'); return; }
        addLog(`${barcode}: ${d.error || 'failed'}`, 'err');
        return;
      }

      const dimmed: number[] = d.dimmed || [];
      const greened: number[] = d.greened || [];
      const dual: { locationNumber: number; colors: OperatorColor[] }[] = d.dual || [];
      const activeColors: OperatorColor[] = d.activeColors || [color];
      const locId = d.location.id as number;
      // Optimistic glow: active slot amber/green (with its full set of active
      // colours, not just this operator's — a shared slot may already have
      // another operator's own live pending item), previous pending(s) dark,
      // any newly-completed slots green, any dual-color slots kept ON with
      // their other operator's colour. refreshGrid() reconciles from the DB.
      setSlots((prev) => prev.map((s) => {
        if (s.id === locId) {
          return {
            ...s, lightState: 'ON', status: d.complete ? 'COMPLETE' : 'CONSOLIDATING',
            operatorColor: color, operatorColors: d.complete ? [color] : activeColors,
            shippingPackageId: d.shippingPackageId,
            expected: d.expected, accounted: d.placed,
          };
        }
        if (greened.includes(s.locationNumber)) return { ...s, lightState: 'ON', status: 'COMPLETE' };
        const dualHit = dual.find((x) => x.locationNumber === s.locationNumber);
        if (dualHit) return { ...s, lightState: 'ON', operatorColors: dualHit.colors, operatorColor: dualHit.colors[0] ?? s.operatorColor };
        if (dimmed.includes(s.locationNumber)) return { ...s, lightState: 'OFF' };
        return s;
      }));
      lastMutateAt.current = Date.now();

      setCurrent({
        pkg: d.shippingPackageId, item: barcode,
        slotNumber: d.location.locationNumber, slotBarcode: d.location.barcode,
        rackNumber: d.location.rackNumber, expected: d.expected, placed: d.placed, complete: d.complete,
      });

      if (d.complete) {
        addLog(`ORDER COMPLETE — ${d.shippingPackageId} @ slot #${d.location.locationNumber} — scan its LOCATION to release`, 'ok');
      } else if (d.alreadyScanned) {
        addLog(`${barcode} already scanned — slot #${d.location.locationNumber} (${d.placed}/${d.expected})`, 'info');
      } else {
        addLog(`${barcode} → ${d.shippingPackageId} → slot #${d.location.locationNumber} (${d.placed}/${d.expected})`, 'ok');
      }
      refreshGrid();
    } catch (e) {
      addLog(`${barcode}: ${(e as Error).message}`, 'err');
    }
  };

  // ---- LOCATION scan: release a completed (green) slot ----
  const release = async (locationBarcode: string, slot: Slot) => {
    try {
      const res = await fetch('/api/cl-cls/consolidate/complete-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationBarcode }),
      });
      const d = await res.json();
      if (!res.ok) {
        if (d.error === 'NOT_COMPLETE') {
          addLog(`Slot #${slot.locationNumber} not complete (${d.progress?.accounted ?? '?'}/${d.progress?.expected ?? '?'}) — scan the missing item(s)`, 'err');
        } else if (d.error === 'SLOT_EMPTY') {
          addLog(`Slot #${slot.locationNumber} is empty`, 'err');
        } else {
          addLog(`Release #${slot.locationNumber}: ${d.error || 'failed'}`, 'err');
        }
        return;
      }
      addLog(`RELEASED slot #${slot.locationNumber}${d.shippingPackageId ? ` — ${d.shippingPackageId}` : ''} — ready to ship`, 'ok');
      setSlots((prev) => prev.map((s) =>
        s.locationNumber === slot.locationNumber
          ? { ...s, lightState: 'OFF', status: 'FREE', shippingPackageId: null, operatorColor: null, operatorColors: [], expected: 0, accounted: 0 }
          : s));
      lastMutateAt.current = Date.now();
      if (currentRef.current?.slotNumber === slot.locationNumber) setCurrent(null);
      refreshGrid();
    } catch (e) {
      addLog(`Release: ${(e as Error).message}`, 'err');
    }
  };

  // ---- single scan field: route location-barcode -> release, else -> item ----
  const onScan = async () => {
    const v = scanVal.trim();
    setScanVal('');
    if (!v) return;
    if (busy.current) { addLog(`${v}: busy — please re-scan`, 'err'); return; } // don't drop silently
    busy.current = true;
    try {
      const slot = slotsRef.current.find((s) => s.barcode === v);
      if (slot) await release(v, slot);
      else await scanItem(v);
    } finally {
      busy.current = false;
      focusActive();
    }
  };

  // ---- master reset: clear the whole board (recovery for a wedged slot) ----
  const RESET_PASSWORD = '0000';
  const resetBoard = async () => {
    if (busy.current) return;
    const pw = window.prompt('Enter password to reset the ENTIRE board:\n\nThis clears ALL in-progress consolidations. Order QC history is kept.');
    if (pw === null) { focusActive(); return; }
    if (pw !== RESET_PASSWORD) { addLog('Master reset: wrong password', 'err'); focusActive(); return; }
    busy.current = true;
    try {
      const res = await fetch('/api/cl-cls/consolidate/master-reset', { method: 'POST' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { addLog(`Master reset failed: ${d.error || res.status}`, 'err'); return; }
      setCurrent(null);
      setSlots((prev) => prev.map((s) => ({
        ...s, lightState: 'OFF', status: 'FREE', shippingPackageId: null,
        operatorColor: null, operatorColors: [], expected: 0, accounted: 0,
      })));
      lastMutateAt.current = Date.now();
      addLog('Master reset — board cleared', 'ok');
      refreshGrid();
    } catch (e) {
      addLog(`Master reset: ${(e as Error).message}`, 'err');
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

  const banner = current?.complete
    ? { cls: 'ack', text: `✓ COMPLETE — scan LOCATION #${current.slotNumber} to release & ship` }
    : current
    ? { cls: 'put', text: 'SCAN — next item · or a completed slot’s location to release' }
    : { cls: 'pick', text: 'SCAN — item barcode to begin' };

  return (
    <div className="csl-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* HHD-only: full-screen green flash on order complete (station monitors keep the pulsing banner instead) */}
      <div className={'csl-flash' + (current?.complete ? ' on' : '')} aria-hidden={!current?.complete}>
        <div className="csl-flash-msg">
          <span className="tick">✓</span>
          <span className="txt">Order Complete</span>
          {current && <span className="loclabel">Location</span>}
          {current && <span className="loc">{current.slotNumber}</span>}
          {current && <span className="sub">Rack {current.rackNumber} · scan to release</span>}
        </div>
      </div>

      <header className="csl-header">
        <div className="brand"><span className="glyph">◆</span><h1>ConsolidAte</h1><small>Order QC → Consolidation</small></div>
        <span className="spacer" />
        <span className="stat"><b>{dump.total}</b> dump</span>
        <span className="stat"><b className="amber">{stats?.consolidating ?? 0}</b> consolidating</span>
        <span className="stat"><b className="emerald">{stats?.complete ?? 0}</b> ready</span>
        <span className="stat"><b>{stats?.freeSlots ?? 0}</b> free</span>
        <span className={'pill ' + (dump.error ? 'err' : dump.syncing ? 'warn' : 'ok')}>
          {dump.error ? 'sync error' : dump.syncing ? 'syncing…' : `synced ${dump.last ?? '—'}`}
        </span>
        <Link href="/cl-cls/consolidate/history" className="csl-history" title="Released consolidations — survives Master Reset">
          History
        </Link>
        <button type="button" className="csl-reset" onClick={resetBoard} onBlur={keepFocus} title="Clear ALL slots (recover a stuck slot)">
          ⟲ Reset
        </button>
      </header>

      {dump.error && <div className="csl-alert">Dump sync failed: {dump.error} — is the NexS tab logged in?</div>}

      <div className="csl-body">
        <section className="csl-console">
          {/* Rack + Ranger pickers (one-time per shift/relocation; not part of the scan loop).
              Rack is TAP BUTTONS, not a native <select>: the scan field auto-refocuses
              (autoarming), which yanks focus back and snaps a dropdown shut before you can
              pick — a single-tap button completes before the refocus, same as the Rangers. */}
          <div className="csl-rangers csl-racks">
            <span className="lbl">Rack</span>
            {RACKS.map((r) => (
              <button
                key={r}
                type="button"
                className={'rackbtn' + (rack === r ? ' on' : '')}
                onClick={() => chooseRack(r)}
                aria-pressed={rack === r}
                title={`Rack ${r} · slots ${(r - 1) * 20 + 1}-${r * 20}`}
              >
                {r}
              </button>
            ))}
          </div>
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

          {/* HHD-only: big location card + status bar (hidden on the station-monitor layout, which has the full grid) */}
          <div className={'csl-hhdcard' + (current?.complete ? ' done' : '')}>
            {current ? (
              <>
                <span className="hhd-label">{current.complete ? 'Scan to release' : 'Go to location'}</span>
                <span className="hhd-num">{current.slotNumber}</span>
                <span className="hhd-rack">Rack {current.rackNumber}</span>
                <div className="hhd-bar"><i style={{ width: `${pct}%` }} className={current.complete ? 'ok' : ''} /></div>
                <span className="hhd-count">{current.placed}/{current.expected} scanned</span>
              </>
            ) : (
              <span className="hhd-idle">Scan an item to begin</span>
            )}
          </div>

          <div className="csl-fields">
            <label className="csl-field active">
              <span>Scan · item or location</span>
              <input
                ref={scanRef}
                autoFocus
                value={scanVal}
                placeholder="scan item barcode…"
                onChange={(e) => setScanVal(e.target.value)}
                onKeyDown={onEnter(onScan)}
                onBlur={keepFocus}
              />
            </label>
          </div>

          {current && (
            <div className={'csl-task' + (current.complete ? ' done' : '')}>
              <div className="row"><span>Package</span><b title={current.pkg}>{current.pkg}</b></div>
              <div className="row"><span>Slot</span><b>#{current.slotNumber} · Rack {current.rackNumber}</b></div>
              <div className="bar"><i style={{ width: `${pct}%` }} className={current.complete ? 'ok' : ''} /></div>
              <div className="row sm"><span>Scanned</span><b>{current.placed}/{current.expected}</b></div>
            </div>
          )}

          <div className="csl-log">
            {log.length === 0 ? <div className="empty">Scan an item to begin…</div>
              : log.map((l, i) => <div key={i} className={l.includes('✕') ? 'e' : l.includes('✓') ? 'o' : ''}>{l}</div>)}
          </div>
        </section>

        <section className="csl-gridwrap">
          <div className="csl-gridhead">All racks · <b>{stats?.totalSlots ?? slots.length}</b> slots · loading into <b className="gold">Rack {rack}</b></div>
          {slots.length === 0
            ? <div className="csl-noslots">No slots — run scripts/seed-consolidate-grid.cjs</div>
            : <ConsolidateGrid
                slots={slots}
                selectedRack={rack}
                highlightLocationId={current ? slots.find((s) => s.locationNumber === current.slotNumber)?.id ?? null : null}
              />}
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
.csl-reset, .csl-history{ padding:6px 13px; border-radius:10px; font:inherit; font-size:10px; font-weight:700; letter-spacing:.5px;
  text-transform:uppercase; cursor:pointer; color:var(--muted); background:rgba(255,255,255,.02); border:1px solid var(--line-strong); transition:all .14s ease;
  text-decoration:none; display:inline-flex; align-items:center; }
.csl-reset:hover{ color:var(--crimson); border-color:var(--crimson); background:rgba(240,97,106,.08); }
.csl-history:hover{ color:var(--gold-hi); border-color:var(--gold); background:rgba(217,183,90,.08); }
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
.csl-root .rackbtn{ min-width:36px; height:34px; padding:0 9px; border-radius:10px; font:inherit; font-weight:700; font-size:13px;
  font-variant-numeric:tabular-nums; cursor:pointer; color:var(--text-2); background:rgba(255,255,255,.02);
  border:1px solid var(--line-strong); transition:all .14s ease; }
.csl-root .rackbtn:hover{ border-color:var(--gold); color:var(--text); }
.csl-root .rackbtn.on{ color:#0b0d11; background:var(--gold); border-color:var(--gold); font-weight:800; box-shadow:0 6px 18px -6px var(--gold); }
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
.csl-field input{ width:100%; height:60px; font-size:22px; font-weight:600; letter-spacing:.4px; padding:0 18px; border-radius:14px;
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
.csl-gridhead b.gold{ color:var(--gold-hi); }
.csl-noslots{ color:var(--muted); text-align:center; padding:48px 0; font-size:13px; }
.csl-grids{ display:flex; flex-wrap:wrap; gap:28px; }
.csl-rack{ width:290px; }
.csl-rack h3{ font-size:11px; color:var(--text-2); margin:0 0 11px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; }
.csl-rack.sel h3{ color:var(--gold-hi); }
.csl-rack .loadhere{ margin-left:8px; font-size:8px; padding:2px 7px; border-radius:999px; background:rgba(217,183,90,.14);
  border:1px solid rgba(217,183,90,.4); color:var(--gold-hi); letter-spacing:1px; vertical-align:middle; }
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

/* ---- HHD (hand-held device) mode — 4.6"–5.8" scanner screens ----
   No physical light here either, so the on-screen grid is dropped in favour
   of: the location to go to, the current order's progress, and an
   unmissable full-screen flash on completion. */
.csl-hhdcard{ display:none; }
.csl-flash{ display:none; }

@media (max-width:560px){
  .csl-root{ font-size:15px; }
  .csl-header{ padding:10px 12px; gap:8px; }
  .csl-header .brand small{ display:none; }
  .csl-header .stat{ display:none; }
  .csl-header .pill{ font-size:9px; padding:5px 9px; }
  .csl-reset, .csl-history{ display:none; }
  .csl-alert{ margin:10px 12px 0; font-size:12px; }
  .csl-rangers .lbl{ display:none; }
  .csl-racks .lbl{ display:inline; }               /* keep "Rack" — bare numbers are ambiguous on HHD */
  .csl-root .ranger{ padding:9px; }
  .csl-root .ranger .nm{ display:none; }
  .csl-root .rackbtn{ min-width:42px; height:40px; font-size:15px; }  /* bigger tap target on HHD */
  .csl-banner{ font-size:13px; padding:13px 14px; }
  .csl-gridwrap{ display:none; }
  .csl-body{ padding:10px; gap:10px; }
  .csl-log{ max-height:16vh; font-size:11px; }
  .csl-field input{ height:64px; font-size:24px; }

  .csl-hhdcard{
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; text-align:center;
    padding:22px 16px; border-radius:18px; background:var(--bg-1); border:1px solid var(--line-strong); box-shadow:var(--shadow);
  }
  .csl-hhdcard .hhd-label{ font-size:11px; text-transform:uppercase; letter-spacing:2px; font-weight:700; color:var(--muted); }
  .csl-hhdcard .hhd-num{ font-size:84px; font-weight:900; line-height:1; letter-spacing:-2px; font-variant-numeric:tabular-nums; color:var(--gold-hi); }
  .csl-hhdcard.done .hhd-num{ color:var(--emerald); }
  .csl-hhdcard .hhd-rack{ font-size:13px; font-weight:600; color:var(--text-2); }
  .csl-hhdcard .hhd-bar{ width:100%; max-width:220px; height:9px; border-radius:999px; background:var(--bg-3); overflow:hidden; margin-top:8px; border:1px solid var(--line); }
  .csl-hhdcard .hhd-bar i{ display:block; height:100%; background:linear-gradient(90deg,var(--blue),#8fbcff); border-radius:999px; transition:width .3s ease; }
  .csl-hhdcard .hhd-bar i.ok{ background:linear-gradient(90deg,var(--emerald),#7be6b6); }
  .csl-hhdcard .hhd-count{ font-size:12px; font-weight:600; color:var(--text-2); }
  .csl-hhdcard .hhd-idle{ font-size:19px; font-weight:700; color:var(--muted); padding:20px 0; }

  .csl-flash{ position:fixed; inset:0; z-index:999; display:flex; align-items:center; justify-content:center;
    background:#16a34a; opacity:0; pointer-events:none; transition:opacity .2s ease; }
  .csl-flash.on{ opacity:1; }
  .csl-flash-msg{ display:flex; flex-direction:column; align-items:center; gap:4px; color:#06210f; text-align:center; padding:0 16px; }
  .csl-flash-msg .tick{ font-size:60px; font-weight:900; line-height:1; }
  .csl-flash-msg .txt{ font-size:20px; font-weight:800; letter-spacing:2px; text-transform:uppercase; }
  .csl-flash-msg .loclabel{ font-size:13px; font-weight:800; letter-spacing:4px; text-transform:uppercase; opacity:.75; margin-top:6px; }
  /* The location the operator must walk to and scan — the hero of this screen.
     Scales with viewport width, capped, so up to 3 digits (slot 200) still fit. */
  .csl-flash-msg .loc{ font-size:clamp(110px, 44vw, 200px); font-weight:900; line-height:.85; letter-spacing:-5px; font-variant-numeric:tabular-nums; }
  .csl-flash-msg .sub{ font-size:14px; font-weight:700; opacity:.85; text-transform:uppercase; letter-spacing:1.5px; margin-top:4px; }
}
`;
