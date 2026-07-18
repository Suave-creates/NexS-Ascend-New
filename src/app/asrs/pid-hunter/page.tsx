'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiMapPin, FiTarget, FiList, FiDownload, FiActivity } from 'react-icons/fi';
import {
  Button, Input, Textarea, Field,
  Card, CardHeader, CardBody, PageHeader, Alert, Badge, StatCard,
  Table, THead, TBody, TR, TH, TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScannedItem {
  pid: string;
  barcode: string;
  status: string;
  condition: string;
  availability: string;
  scan_location: string;
  scannedAt: Date;
  isMatched: boolean;     // matched against target PID list this session
  isPreScanned: boolean;  // already existed in DB (backend signals alreadyExists)
}

interface MatchToast {
  id: number;
  pid: string;
  barcode: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsePidList(raw: string): string[] {
  return raw.split(/[\n,\s]+/).map((s) => s.trim()).filter(Boolean);
}

function parsePidWithQuantity(raw: string): Map<string, number> {
  const map = new Map<string, number>();
  const lines = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  lines.forEach((line) => {
    const [pid, qtyStr] = line.split(':').map((s) => s.trim());
    if (pid) {
      const qty = parseInt(qtyStr, 10) || 1;
      map.set(pid, qty);
    }
  });
  return map;
}

type BadgeTone = 'good' | 'danger' | 'notice';

function statusTone(status: string): BadgeTone {
  const s = status?.toLowerCase();
  if (s === 'active' || s === 'available') return 'good';
  if (s === 'inactive' || s === 'unavailable') return 'danger';
  return 'notice';
}

function availTone(avail: string): 'good' | 'danger' {
  const a = avail?.toLowerCase();
  if (a === 'available' || a === 'yes' || a === 'true') return 'good';
  return 'danger';
}

function downloadCSV(items: ScannedItem[]) {
  const headers = ['Barcode', 'PID', 'Status', 'Condition', 'Availability', 'Scan Location', 'Scanned At', 'Target Match', 'Pre-Scanned'];
  const rows = items.map((i) => [
    i.barcode, i.pid, i.status, i.condition, i.availability,
    i.scan_location, i.scannedAt.toISOString(),
    i.isMatched ? 'YES' : 'NO',
    i.isPreScanned ? 'YES' : 'NO',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `scan-log-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── PID Chip ─────────────────────────────────────────────────────────────────

function PidChip({ pid, matched, pulse, preScanned, count, target }: {
  pid: string; matched: boolean; pulse: boolean; preScanned: boolean; count?: number; target?: number;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs font-bold tracking-wide transition-all duration-300',
        matched
          ? 'border-gold-500 bg-gold-500 text-brand-800'
          : preScanned
            ? 'border-brand-300 bg-brand-50 text-brand-700'
            : 'border-gray-300 bg-gray-100 text-gray-500',
        pulse && 'scale-110 ring-4 ring-gold-500/30',
      )}
    >
      {matched && <span className="text-[10px]">✓</span>}
      {preScanned && !matched && <span className="text-[10px]">↩</span>}
      {pid}
      {typeof count !== 'undefined' && typeof target !== 'undefined' && (
        <span className="ml-0.5 text-[9px] opacity-70">({count}/{target})</span>
      )}
    </span>
  );
}

// ─── Match Toast ──────────────────────────────────────────────────────────────

function MatchToastItem({ toast, onDone }: { toast: MatchToast; onDone: () => void }) {
  useEffect(() => {
    // Play sound
    const audio = new Audio('/soundtrack/FAAHH.mp3');
    audio.play().catch((err) => console.error('Failed to play sound:', err));

    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-5"
      style={{
        background: 'linear-gradient(135deg, var(--color-gold-500, #f0b400) 0%, var(--color-notice-600, #e8650a) 100%)',
        animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white text-5xl font-extrabold text-brand-700"
        style={{
          animation: 'checkPop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >✓</div>
      <div className="text-center text-white">
        <div className="mb-2 text-lg font-bold uppercase tracking-widest">PID Matched</div>
        <div className="mb-2 font-mono text-4xl font-bold tracking-wide">{toast.pid}</div>
        <div className="font-mono text-lg text-white/80">{toast.barcode}</div>
      </div>
      {/* timer bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden bg-white/20">
        <div className="h-full bg-white" style={{ animation: 'toastBar 3s linear forwards' }} />
      </div>
    </div>
  );
}

// ─── Scan Row ─────────────────────────────────────────────────────────────────

function ScanRow({ item, isNew }: { item: ScannedItem; isNew: boolean }) {
  const normalizedCondition = item.condition?.trim().toUpperCase();
  const normalizedStatus = item.status?.trim().toUpperCase();
  const isBadStatus =
    normalizedCondition === 'BAD' ||
    (normalizedStatus !== 'AVAILABLE' && normalizedStatus !== 'RELEASED');

  return (
    <TR
      tone={isBadStatus ? 'danger' : item.isMatched ? 'gold' : undefined}
      className={cn(!isBadStatus && !item.isMatched && item.isPreScanned && 'bg-brand-50 hover:bg-brand-50')}
      style={{ animation: isNew ? 'rowSlide 0.4s cubic-bezier(0.22,1,0.36,1)' : undefined }}
    >
      <TD className="w-8 text-center">
        {item.isMatched ? (
          <span aria-label="Target match">🎯</span>
        ) : item.isPreScanned ? (
          <span title="Already in DB" className="font-bold text-brand-700">↩</span>
        ) : (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300" />
        )}
      </TD>
      <TD className="font-mono text-xs font-semibold text-gray-900">{item.barcode}</TD>
      <TD className="font-mono text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn(item.isMatched ? 'font-bold text-brand-800' : 'text-brand-700')}>{item.pid}</span>
          {item.isPreScanned && <Badge tone="navy" className="px-1.5 py-0 text-[9px]">IN DB</Badge>}
        </span>
      </TD>
      <TD>
        <Badge tone={statusTone(item.status)}>{item.status}</Badge>
      </TD>
      <TD className="text-xs">{item.condition}</TD>
      <TD>
        <Badge tone={availTone(item.availability)}>{item.availability}</Badge>
      </TD>
    </TR>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

let toastSeq = 0;

export default function BarcodeScannerPage() {
  const [pidInput, setPidInput]           = useState('');
  const [targetPids, setTargetPids]       = useState<string[]>([]);
  const [targetPidMap, setTargetPidMap]   = useState<Map<string, number>>(new Map());
  const [matchedCounts, setMatchedCounts] = useState<Map<string, number>>(new Map());
  const [matchedPids, setMatchedPids]     = useState<Set<string>>(new Set());
  const [pulsingPids, setPulsingPids]     = useState<Set<string>>(new Set());
  const [preScannedPids, setPreScannedPids] = useState<Set<string>>(new Set());

  const [scanLocation, setScanLocation]   = useState('');
  const [locationLocked, setLocationLocked] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const [barcodeInput, setBarcodeInput]   = useState('');
  const [scannedItems, setScannedItems]   = useState<ScannedItem[]>([]);
  const [scanning, setScanning]           = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [flash, setFlash]                 = useState<'success' | 'error' | null>(null);
  const [toasts, setToasts]               = useState<MatchToast[]>([]);

  const barcodeRef    = useRef<HTMLInputElement>(null);
  const locationRef   = useRef<HTMLInputElement>(null);
  const autoTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus barcode when locked
  useEffect(() => {
    if (locationLocked) setTimeout(() => barcodeRef.current?.focus(), 60);
  }, [locationLocked]);

  const highlightPid = useCallback((pid: string) => {
    setMatchedPids((p) => new Set([...p, pid]));
    setPulsingPids((p) => new Set([...p, pid]));
    setTimeout(() => setPulsingPids((p) => { const n = new Set(p); n.delete(pid); return n; }), 900);
  }, []);

  const showToast = useCallback((pid: string, barcode: string) => {
    const id = ++toastSeq;
    setToasts((p) => [...p, { id, pid, barcode }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  // ── Core scan logic ───────────────────────────────────────────────────────
  const executeScan = useCallback(async (barcode: string) => {
    if (!barcode.trim()) return;

    if (!scanLocation.trim() || !locationLocked) {
      setLocationError(true);
      setTimeout(() => setLocationError(false), 1000);
      setError('Lock scan location before scanning.');
      locationRef.current?.focus();
      return;
    }

    setScanning(true);
    setError(null);
    setBarcodeInput('');

    try {
      const res  = await fetch('/api/asrs/pid-hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: barcode.trim().slice(-12), scan_location: scanLocation.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Scan failed.');
        setFlash('error');
        setTimeout(() => setFlash(null), 700);
        return;
      }

      const pid          = String(data.pid);
      const targetQty    = targetPidMap.get(pid) || 0;
      const currentCount = matchedCounts.get(pid) || 0;
      const isMatched    = targetQty > 0 && currentCount < targetQty;
      // backend may return `alreadyExists: true` for duplicate PIDs
      const isPreScanned = !!(data.alreadyExists);

      const item: ScannedItem = {
        pid, barcode: data.barcode, status: data.status,
        condition: data.condition, availability: data.availability,
        scan_location: data.scan_location, scannedAt: new Date(),
        isMatched, isPreScanned,
      };

      setScannedItems((p) => [item, ...p]);

      if (isMatched) {
        highlightPid(pid);
        showToast(pid, item.barcode);
        setMatchedCounts((prev) => new Map(prev).set(pid, currentCount + 1));
      }
      if (isPreScanned) { setPreScannedPids((p) => new Set([...p, pid])); }

      setFlash('success');
      setTimeout(() => setFlash(null), 500);
    } catch {
      setError('Network error. Please try again.');
      setFlash('error');
      setTimeout(() => setFlash(null), 700);
    } finally {
      setScanning(false);
      setBarcodeInput(''); // Clear for continuous scanning
      setTimeout(() => barcodeRef.current?.focus(), 10); // Re-arm scanner
    }
  }, [scanLocation, locationLocked, targetPids, targetPidMap, matchedCounts, highlightPid, showToast]);

  // ── Auto-scan 150 ms after last keystroke ─────────────────────────────────
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBarcodeInput(val);
    if (autoTimer.current) clearTimeout(autoTimer.current);
    if (val.trim().length >= 3) {
      autoTimer.current = setTimeout(() => executeScan(val), 150);
    }
  };

  const handleBarcodeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      executeScan(barcodeInput);
    }
  };

  const handleCommitPids = () => {
    const pidMap = parsePidWithQuantity(pidInput);
    const pids = Array.from(pidMap.keys());
    setTargetPids(pids);
    setTargetPidMap(pidMap);
    setMatchedCounts(new Map());
    setMatchedPids(new Set());
    setPulsingPids(new Set());
  };

  const handleLockLocation = () => {
    if (!scanLocation.trim()) {
      setLocationError(true);
      setTimeout(() => setLocationError(false), 1000);
      locationRef.current?.focus();
      return;
    }
    setLocationLocked(true);
  };

  const handleUnlockLocation = () => setLocationLocked(false);

  const totalTargetQty = Array.from(targetPidMap.values()).reduce((sum, qty) => sum + qty, 0);
  const totalMatched = Array.from(matchedCounts.values()).reduce((sum, count) => sum + count, 0);
  const progress = totalTargetQty > 0 ? Math.round((totalMatched / totalTargetQty) * 100) : 0;

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <style>{`
        @keyframes rowSlide  { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn   { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
        @keyframes checkPop  { from { transform:scale(0); } to { transform:scale(1); } }
        @keyframes toastBar  { from { width:100%; } to { width:0%; } }
        @keyframes scanPulse { 0% { box-shadow:0 0 0 0 rgba(232,180,0,0.45); } 70% { box-shadow:0 0 0 8px rgba(232,180,0,0); } 100% { box-shadow:0 0 0 0 rgba(232,180,0,0); } }
        @keyframes locShake  { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-5px); } 40% { transform:translateX(5px); } 60% { transform:translateX(-3px); } 80% { transform:translateX(3px); } }
        .loc-shake { animation: locShake 0.4s ease; }
      `}</style>

      {/* ── Match Toast overlays ──────────────────────────────────────────── */}
      {toasts.map((t) => (
        <MatchToastItem key={t.id} toast={t} onDone={() => removeToast(t.id)} />
      ))}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <PageHeader
        title="PID Hunter"
        subtitle="Barcode scanner — match scanned PIDs against your targets"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {locationLocked && (
              <Badge tone="gold" className="font-mono">
                <FiMapPin className="mr-1 h-3 w-3" />
                {scanLocation}
              </Badge>
            )}
            <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  scanning ? 'bg-notice-600' : locationLocked ? 'bg-good-600' : 'bg-gray-400',
                )}
              />
              {scanning ? 'Processing…' : locationLocked ? 'Ready' : 'Set Location'}
            </span>
          </div>
        }
      />

      {/* ── Layout ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">

        {/* ══ LEFT PANEL ══════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Scan Location */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiMapPin className={cn('h-4 w-4', locationLocked ? 'text-good-600' : 'text-brand-700')} />
                <span className="text-sm font-semibold text-brand-700">
                  {locationLocked ? 'Location Locked' : 'Scan Location'}
                </span>
                {!locationLocked && <Badge tone="danger" className="text-[10px]">Required</Badge>}
              </div>
              {locationLocked && (
                <Button variant="ghost" size="sm" onClick={handleUnlockLocation}>Unlock</Button>
              )}
            </CardHeader>
            <CardBody className="space-y-3">
              <Input
                ref={locationRef}
                type="text"
                placeholder="e.g. Warehouse A — Shelf 3"
                value={scanLocation}
                disabled={locationLocked}
                onChange={(e) => setScanLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLockLocation()}
                className={cn(locationError && 'loc-shake border-danger-600 focus:border-danger-600')}
              />
              {!locationLocked ? (
                <Button className="w-full" onClick={handleLockLocation}>Lock &amp; Enable Scanner →</Button>
              ) : (
                <Alert tone="success">✓ Scanner is active — start scanning</Alert>
              )}
              {locationError && (
                <Alert tone="error">Scan location must be set and locked first</Alert>
              )}
            </CardBody>
          </Card>

          {/* Target PIDs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiTarget className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-semibold text-brand-700">Target PIDs</span>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <Textarea
                rows={4}
                placeholder={'Enter PIDs with quantity — PID:qty\nPID001:5, PID002:3\nor each on new line'}
                value={pidInput}
                onChange={(e) => setPidInput(e.target.value)}
                className="font-mono text-xs leading-relaxed"
              />
              <Button className="w-full" onClick={handleCommitPids}>Set Target PIDs</Button>

              {targetPids.length > 0 && (
                <div className="space-y-3 pt-1">
                  {/* Progress */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        {totalMatched} / {totalTargetQty} matched
                      </span>
                      <span className={cn('text-xs font-bold', progress === 100 ? 'text-good-600' : 'text-gold-700')}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', progress === 100 ? 'bg-good-600' : 'bg-gold-500')}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 text-[10px] font-medium text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2.5 w-2.5 rounded border border-gold-500 bg-gold-500" /> Matched
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2.5 w-2.5 rounded border border-brand-300 bg-brand-50" /> In DB
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2.5 w-2.5 rounded border border-gray-300 bg-gray-100" /> Pending
                    </span>
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {targetPids.map((pid) => {
                      const targetQty = targetPidMap.get(pid) || 1;
                      const matchCount = matchedCounts.get(pid) || 0;
                      const isComplete = matchCount >= targetQty;
                      return (
                        <PidChip
                          key={pid} pid={pid}
                          matched={isComplete || matchedPids.has(pid)}
                          pulse={pulsingPids.has(pid)}
                          preScanned={preScannedPids.has(pid) && !matchedPids.has(pid)}
                          count={matchCount}
                          target={targetQty}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Scanned" value={scannedItems.length} tone="navy" />
            <StatCard label="PIDs Matched" value={matchedPids.size} tone="good" />
            <StatCard label="Already in DB" value={scannedItems.filter((i) => i.isPreScanned).length} tone="gold" />
            <StatCard label="Pending Qty" value={Math.max(0, totalTargetQty - totalMatched)} tone="notice" />
          </div>
        </div>

        {/* ══ RIGHT PANEL ════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Barcode Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiActivity className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-semibold text-brand-700">Barcode Input</span>
              </div>
              <Badge tone="gold" className="font-mono text-[10px]">AUTO · 150ms</Badge>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex gap-3">
                <Field className="flex-1">
                  <Input
                    ref={barcodeRef}
                    type="text"
                    placeholder={locationLocked ? 'Scan or type barcode — auto-submits in 150 ms…' : 'Lock scan location to activate scanner'}
                    value={barcodeInput}
                    onChange={handleBarcodeChange}
                    onKeyDown={handleBarcodeKey}
                    disabled={scanning || !locationLocked}
                    className="font-mono text-base tracking-wider"
                    style={{
                      borderColor: flash === 'success' ? 'var(--color-good-600)' : flash === 'error' ? 'var(--color-danger-600)' : undefined,
                      animation: locationLocked && !scanning ? 'scanPulse 2.5s infinite' : undefined,
                    }}
                  />
                </Field>
                <Button
                  onClick={() => { if (autoTimer.current) clearTimeout(autoTimer.current); executeScan(barcodeInput); }}
                  disabled={scanning || !barcodeInput.trim() || !locationLocked}
                  loading={scanning}
                >
                  Scan
                </Button>
              </div>

              {error && <Alert tone="error">{error}</Alert>}
            </CardBody>
          </Card>

          {/* Latest Scan Banner */}
          {scannedItems.length > 0 && (
            <Card className={cn('border-brand-800 bg-brand-700 text-white', scannedItems[0].isMatched && 'ring-2 ring-gold-500/50')}>
              <CardBody className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/50">Latest Scan</div>
                  <div className="font-mono text-lg font-bold tracking-wide">{scannedItems[0].barcode}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-sm text-gold-500">
                    PID: {scannedItems[0].pid}
                    {scannedItems[0].isMatched && (
                      <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-brand-800">🎯 MATCHED</span>
                    )}
                    {scannedItems[0].isPreScanned && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">↩ IN DB</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">Location</div>
                  <div className="font-mono text-sm font-semibold">{scannedItems[0].scan_location}</div>
                  <div className="mt-1 text-[10px] text-white/40">{scannedItems[0].scannedAt.toLocaleTimeString()}</div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Scan Log */}
          <Card className="overflow-hidden">
            <CardHeader className="flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FiList className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-semibold text-brand-700">Scan Log</span>
                {scannedItems.length > 0 && (
                  <span className="font-mono text-xs text-gray-400">
                    {scannedItems.length} record{scannedItems.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Row legend */}
                <div className="flex gap-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3.5 w-1 rounded-sm bg-gold-500" /> 🎯 Matched
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3.5 w-1 rounded-sm bg-brand-700" /> ↩ In DB
                  </span>
                </div>

                {/* Export */}
                {scannedItems.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => downloadCSV(scannedItems)}>
                    <FiDownload className="h-3.5 w-3.5" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardHeader>

            {scannedItems.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mb-2 text-3xl opacity-20">⬛</div>
                <div className="text-sm font-medium text-gray-500">
                  {locationLocked ? 'Start scanning barcodes above.' : 'Lock a scan location to begin.'}
                </div>
              </div>
            ) : (
              <div className="max-h-[560px] overflow-y-auto">
                <Table>
                  <THead className="sticky top-0 z-10">
                    <TR>
                      <TH className="w-8" />
                      <TH>Barcode</TH>
                      <TH>PID</TH>
                      <TH>Status</TH>
                      <TH>Condition</TH>
                      <TH>Availability</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {scannedItems.map((item, i) => (
                      <ScanRow key={`${item.barcode}-${i}`} item={item} isNew={i === 0} />
                    ))}
                  </TBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
