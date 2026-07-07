'use client';

// ConsolidAte — Order QC dump → PTL package-consolidation board.
// Mobile-first: operators scan at the racks on phones. Flow:
//   scan item barcode → slot glows → confirm placement → (repeat) →
//   all placed → slot turns GREEN → scan location barcode → slot released.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardBody, Button, Input, PageHeader, StatCard, Badge, Alert } from '@/components/ui';
import { cn } from '@/lib/cn';
import ConsolidateGrid from './components/ConsolidateGrid';
import { loadOrderQcDump, syncDump } from './lib/nexsDump';
import type { Slot, Stats, ScanResult, OperatorColor } from './types';

const OPERATOR_COLORS: OperatorColor[] = ['YELLOW', 'BLUE', 'PINK', 'RED'];
const COLOR_SWATCH: Record<OperatorColor, string> = {
  YELLOW: 'bg-yellow-400', BLUE: 'bg-blue-500', PINK: 'bg-pink-500', RED: 'bg-red-500', GREEN: 'bg-green-500',
};
const DUMP_INTERVAL_MS = 30_000;
const GRID_INTERVAL_MS = 3_000;

type Toast = { tone: 'success' | 'error' | 'warning' | 'info' | 'notice'; msg: string } | null;

export default function ConsolidatePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [color, setColor] = useState<OperatorColor>('YELLOW');
  const [facility, setFacility] = useState('NXS1');
  const [workstation, setWorkstation] = useState('QC01');

  const [itemBarcode, setItemBarcode] = useState('');
  const [locBarcode, setLocBarcode] = useState('');
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [lastItemBarcode, setLastItemBarcode] = useState('');
  const [busy, setBusy] = useState<'' | 'scan' | 'confirm' | 'complete'>('');
  const [toast, setToast] = useState<Toast>(null);
  const [dump, setDump] = useState<{ syncing: boolean; last: string | null; total: number; error: string | null }>({
    syncing: false, last: null, total: 0, error: null,
  });

  const itemRef = useRef<HTMLInputElement>(null);
  const dumpBusy = useRef(false);
  const gridBusy = useRef(false);
  const actionBusy = useRef(false); // synchronous guard vs. scanner double-Enter

  // Restore prefs.
  useEffect(() => {
    const c = localStorage.getItem('consolidate.color') as OperatorColor | null;
    if (c) setColor(c);
    const f = localStorage.getItem('consolidate.facility'); if (f) setFacility(f);
    const w = localStorage.getItem('consolidate.workstation'); if (w) setWorkstation(w);
  }, []);

  const flash = (t: Toast) => { setToast(t); if (t) setTimeout(() => setToast(null), 4000); };

  // ---- grid poll ----
  const refreshGrid = useCallback(async () => {
    if (gridBusy.current) return;
    gridBusy.current = true;
    try {
      const res = await fetch('/api/consolidate/locations');
      const d = await res.json();
      if (res.ok) { setSlots(d.locations || []); setStats(d.stats || null); }
    } catch { /* ignore transient */ }
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
        // Empty snapshot: skip reconcile to avoid mass-departing on a blank/auth blip.
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

  const focusItem = () => setTimeout(() => itemRef.current?.focus(), 30);

  // ---- actions ----
  const scanItem = async () => {
    const barcode = itemBarcode.trim();
    if (!barcode || actionBusy.current) return;
    actionBusy.current = true;
    setBusy('scan');
    try {
      const res = await fetch('/api/consolidate/scan-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, operatorColor: color }),
      });
      const d = await res.json();
      if (!res.ok) { flash({ tone: 'error', msg: d.error || 'Scan failed' }); }
      else {
        setLastScan(d as ScanResult);
        setLastItemBarcode(barcode);
        flash({ tone: 'success', msg: `Slot #${d.location?.locationNumber} glowing — place item` });
        refreshGrid();
      }
    } catch (e) { flash({ tone: 'error', msg: (e as Error).message }); }
    finally { actionBusy.current = false; setBusy(''); setItemBarcode(''); focusItem(); }
  };

  const confirmPlacement = async () => {
    if (!lastItemBarcode || actionBusy.current) return;
    actionBusy.current = true;
    setBusy('confirm');
    try {
      const res = await fetch('/api/consolidate/confirm-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: lastItemBarcode }),
      });
      const d = await res.json();
      if (!res.ok) { flash({ tone: 'error', msg: d.error || 'Confirm failed' }); }
      else {
        setLastScan((s) => (s ? { ...s, placed: d.placed, expected: d.expected } : s));
        flash(d.complete
          ? { tone: 'success', msg: `✅ Package complete — scan location #${d.location?.locationNumber} to release` }
          : { tone: 'info', msg: `Placed ${d.placed}/${d.expected}` });
        refreshGrid();
      }
    } catch (e) { flash({ tone: 'error', msg: (e as Error).message }); }
    finally { actionBusy.current = false; setBusy(''); focusItem(); }
  };

  const completeLocation = async () => {
    const locationBarcode = locBarcode.trim();
    if (!locationBarcode || actionBusy.current) return;
    actionBusy.current = true;
    setBusy('complete');
    try {
      const res = await fetch('/api/consolidate/complete-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationBarcode }),
      });
      const d = await res.json();
      if (!res.ok) {
        flash({ tone: 'error', msg: d.progress
          ? `Not ready: ${d.progress.accounted}/${d.progress.expected} placed`
          : d.error || 'Release failed' });
      } else {
        flash({ tone: 'success', msg: `Slot #${d.locationNumber} released — ready to ship` });
        setLastScan(null); setLastItemBarcode('');
        refreshGrid();
      }
    } catch (e) { flash({ tone: 'error', msg: (e as Error).message }); }
    finally { actionBusy.current = false; setBusy(''); setLocBarcode(''); }
  };

  const masterReset = async () => {
    if (!confirm('Clear ALL slots and turn every light off?')) return;
    await fetch('/api/consolidate/master-reset', { method: 'POST' });
    setLastScan(null); setLastItemBarcode('');
    flash({ tone: 'warning', msg: 'Board cleared' });
    refreshGrid();
  };

  const onEnter = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); fn(); }
  };

  const pct = lastScan && lastScan.expected > 0
    ? Math.min(100, Math.round((lastScan.placed / lastScan.expected) * 100)) : 0;
  const isComplete = !!lastScan && lastScan.expected > 0 && lastScan.placed >= lastScan.expected;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeader
        title="ConsolidAte"
        subtitle="Order QC → PTL package consolidation"
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={dump.error ? 'danger' : dump.syncing ? 'notice' : 'good'}>
              {dump.error ? 'Sync error' : dump.syncing ? 'Syncing…' : `Synced ${dump.last ?? '—'}`}
            </Badge>
            <Button size="sm" variant="outline" onClick={runDump} disabled={dump.syncing}>
              Sync now
            </Button>
          </div>
        }
      />

      {dump.error && <Alert tone="warning">Dump sync failed: {dump.error} — is the NexS tab logged in?</Alert>}
      {toast && <Alert tone={toast.tone}>{toast.msg}</Alert>}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Dump rows" value={dump.total} tone="navy" />
        <StatCard label="Consolidating" value={stats?.consolidating ?? 0} tone="notice" />
        <StatCard label="Ready" value={stats?.complete ?? 0} tone="good" />
        <StatCard label="Free slots" value={stats?.freeSlots ?? 0} tone="navy" />
        <StatCard label="Lights on" value={stats?.activeLights ?? 0} tone="gold" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Controls (top on mobile) */}
        <div className="space-y-4 lg:col-span-1">
          {/* Operator colour */}
          <Card>
            <CardBody className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Operator colour</p>
              <div className="flex gap-2">
                {OPERATOR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); localStorage.setItem('consolidate.color', c); }}
                    aria-label={c}
                    className={cn(
                      'h-10 flex-1 rounded-lg border-2 transition',
                      COLOR_SWATCH[c],
                      color === c ? 'border-brand-700 ring-2 ring-brand-300' : 'border-transparent opacity-70',
                    )}
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Step 1: scan item */}
          <Card>
            <CardBody className="space-y-3">
              <p className="text-sm font-semibold text-brand-700">1 · Scan item barcode</p>
              <Input
                ref={itemRef}
                autoFocus
                inputMode="text"
                className="h-12 text-lg"
                placeholder="Scan / type item barcode"
                value={itemBarcode}
                onChange={(e) => setItemBarcode(e.target.value)}
                onKeyDown={onEnter(scanItem)}
              />
              <Button size="lg" className="w-full" loading={busy === 'scan'} onClick={scanItem}>
                Find slot
              </Button>

              {lastScan && (
                <div className={cn(
                  'rounded-xl border p-3',
                  isComplete ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50',
                )}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">Slot</span>
                    <span className="text-lg font-bold text-brand-700">
                      #{lastScan.location?.locationNumber} · R{lastScan.location?.rackNumber}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-gray-500" title={lastScan.shippingPackageId}>
                    {lastScan.shippingPackageId}
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn('h-full rounded-full transition-all', isComplete ? 'bg-green-500' : 'bg-brand-600')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs font-medium text-gray-600">
                    {lastScan.placed}/{lastScan.expected} placed
                  </div>
                  <Button
                    variant={isComplete ? 'success' : 'primary'}
                    size="lg"
                    className="mt-3 w-full"
                    loading={busy === 'confirm'}
                    onClick={confirmPlacement}
                  >
                    {isComplete ? 'Complete ✓' : 'Confirm placement'}
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Step 2: scan location to release */}
          <Card>
            <CardBody className="space-y-3">
              <p className="text-sm font-semibold text-brand-700">2 · Scan location to release (green slot)</p>
              <Input
                inputMode="text"
                className="h-12 text-lg"
                placeholder="Scan location barcode"
                value={locBarcode}
                onChange={(e) => setLocBarcode(e.target.value)}
                onKeyDown={onEnter(completeLocation)}
              />
              <Button size="lg" variant="success" className="w-full" loading={busy === 'complete'} onClick={completeLocation}>
                Release slot
              </Button>
            </CardBody>
          </Card>

          <details className="rounded-xl border border-gray-200 bg-white p-3 text-sm">
            <summary className="cursor-pointer font-medium text-gray-600">Advanced</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs text-gray-500">Facility</span>
                <Input value={facility} onChange={(e) => { setFacility(e.target.value); localStorage.setItem('consolidate.facility', e.target.value); }} />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-gray-500">Workstation</span>
                <Input value={workstation} onChange={(e) => { setWorkstation(e.target.value); localStorage.setItem('consolidate.workstation', e.target.value); }} />
              </label>
            </div>
            <Button variant="danger" size="sm" className="mt-3 w-full" onClick={masterReset}>
              Master reset
            </Button>
          </details>
        </div>

        {/* Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-brand-700">PTL grid</h2>
                <span className="text-xs text-gray-500">{stats?.totalSlots ?? slots.length} slots</span>
              </div>
              {slots.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  No slots yet — seed the grid (scripts/seed-consolidate-grid.cjs).
                </p>
              ) : (
                <ConsolidateGrid slots={slots} highlightLocationId={lastScan?.location?.id ?? null} />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
