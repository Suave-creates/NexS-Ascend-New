'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

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

function statusColor(status: string) {
  const s = status?.toLowerCase();
  if (s === 'active' || s === 'available')     return { color: '#1a7a4a', bg: '#edfaf3', dot: '#1a7a4a' };
  if (s === 'inactive' || s === 'unavailable') return { color: '#c0392b', bg: '#fff0ee', dot: '#c0392b' };
  return { color: '#e8650a', bg: '#fff3e8', dot: '#e8650a' };
}

function availColor(avail: string) {
  const a = avail?.toLowerCase();
  if (a === 'available' || a === 'yes' || a === 'true') return { color: '#1a7a4a', bg: '#edfaf3' };
  return { color: '#c0392b', bg: '#fff0ee' };
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
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 11px', borderRadius: 6,
      fontSize: 12, fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
      border: matched ? '1.5px solid #e8b400' : preScanned ? '1.5px solid #2f3d7e' : '1.5px solid #d8dde8',
      background: matched ? '#e8b400' : preScanned ? 'rgba(47,61,126,0.1)' : '#f0f2f7',
      color: matched ? '#1f295c' : preScanned ? '#2f3d7e' : '#7a85a8',
      boxShadow: pulse ? '0 0 0 5px rgba(232,180,0,0.22)' : matched ? '0 0 0 2px rgba(232,180,0,0.12)' : 'none',
      transform: pulse ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {matched && <span style={{ fontSize: 10 }}>✓</span>}
      {preScanned && !matched && <span style={{ fontSize: 10 }}>↩</span>}
      {pid}
      {typeof count !== 'undefined' && typeof target !== 'undefined' && (
        <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>({count}/{target})</span>
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
    <div style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20,
      background: 'linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)',
      zIndex: 99999,
      animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 48, fontWeight: 800, color: '#ff6b00',
        animation: 'checkPop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>✓</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          PID Matched
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#fff', fontSize: 42, letterSpacing: '0.04em', marginBottom: 8 }}>
          {toast.pid}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
          {toast.barcode}
        </div>
      </div>
      {/* timer bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
        overflow: 'hidden', background: 'rgba(255,255,255,0.2)',
      }}>
        <div style={{ height: '100%', background: '#fff', animation: 'toastBar 3s linear forwards' }} />
      </div>
    </div>
  );
}

// ─── Scan Row ─────────────────────────────────────────────────────────────────

function ScanRow({ item, isNew }: { item: ScannedItem; isNew: boolean }) {
  const sc = statusColor(item.status);
  const ac = availColor(item.availability);

  const rowBg     = item.isMatched ? 'rgba(232,180,0,0.07)' : item.isPreScanned ? 'rgba(47,61,126,0.05)' : '#fff';
  const rowBorder = item.isMatched ? 'rgba(232,180,0,0.2)'  : item.isPreScanned ? 'rgba(47,61,126,0.12)' : '#d8dde8';
  const leftBorder = item.isMatched ? '#e8b400' : item.isPreScanned ? '#2f3d7e' : 'transparent';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '22px 1fr 1fr 100px 85px 110px',
      padding: '9px 14px',
      background: rowBg,
      borderBottom: `1px solid ${rowBorder}`,
      borderLeft: `3px solid ${leftBorder}`,
      alignItems: 'center',
      animation: isNew ? 'rowSlide 0.4s cubic-bezier(0.22,1,0.36,1)' : 'none',
    }}>
      <span style={{ fontSize: 13 }}>
        {item.isMatched ? '🎯' : item.isPreScanned ? (
          <span title="Already in DB" style={{ color: '#2f3d7e', fontWeight: 700, fontSize: 13 }}>↩</span>
        ) : (
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d8dde8', display: 'inline-block' }} />
        )}
      </span>

      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#1a2040', fontWeight: 600 }}>
        {item.barcode}
      </span>

      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        color: item.isMatched ? '#1f295c' : '#2f3d7e',
        fontWeight: item.isMatched ? 700 : 500,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {item.pid}
        {item.isPreScanned && (
          <span style={{
            fontSize: 9, fontWeight: 700,
            background: 'rgba(47,61,126,0.12)', color: '#2f3d7e',
            padding: '1px 5px', borderRadius: 4,
          }}>IN DB</span>
        )}
      </span>

      <span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
          background: sc.bg, color: sc.color,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
          {item.status}
        </span>
      </span>

      <span style={{ fontSize: 11, color: '#1a2040' }}>{item.condition}</span>

      <span>
        <span style={{
          display: 'inline-block', padding: '2px 8px', borderRadius: 20,
          fontSize: 10, fontWeight: 700, background: ac.bg, color: ac.color,
        }}>
          {item.availability}
        </span>
      </span>
    </div>
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
    <div className="ph-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

        :root {
          --navy:   #1f295c; --navy-d: #151d42; --navy-l: #2f3d7e;
          --accent: #e8b400; --red: #c0392b; --red-bg: #fff0ee;
          --orange: #e8650a; --orange-bg: #fff3e8;
          --green: #1a7a4a; --green-bg: #edfaf3;
          --border: #d8dde8; --text: #1a2040; --muted: #7a85a8;
          --bg: #f0f2f7; --white: #ffffff;
        }
        .ph-root, .ph-root *, .ph-root *::before, .ph-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .ph-root { background: var(--bg); font-family: 'Inter', sans-serif; color: var(--text); min-height: 100%; }

        @keyframes rowSlide    { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn     { from { opacity:0; transform:translateX(36px) scale(0.94); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes checkPop    { from { transform:scale(0); } to { transform:scale(1); } }
        @keyframes toastBar    { from { width:100%; } to { width:0%; } }
        @keyframes scanPulse   { 0% { box-shadow:0 0 0 0 rgba(232,180,0,0.45); } 70% { box-shadow:0 0 0 8px rgba(232,180,0,0); } 100% { box-shadow:0 0 0 0 rgba(232,180,0,0); } }
        @keyframes locShake    { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-5px); } 40% { transform:translateX(5px); } 60% { transform:translateX(-3px); } 80% { transform:translateX(3px); } }

        .ph-root .loc-shake { animation: locShake 0.4s ease; }
        .ph-root textarea:focus, .ph-root input:focus { outline: none; }
        .ph-root ::-webkit-scrollbar { width: 5px; }
        .ph-root ::-webkit-scrollbar-track { background: var(--bg); }
        .ph-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      `}</style>

      {/* ── Toast Stack ───────────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
        {toasts.map((t) => (
          <MatchToastItem key={t.id} toast={t} onDone={() => removeToast(t.id)} />
        ))}
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={{
        background: 'var(--navy-d)', borderBottom: '2px solid var(--accent)',
        padding: '0 32px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--accent)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: 'var(--navy-d)',
          }}>Z</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '0.02em' }}>
            PID <span style={{ color: 'var(--accent)' }}>HUNTER</span>
          </span>
          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            / Barcode Scanner
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {locationLocked && (
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--accent)',
              background: 'rgba(232,180,0,0.1)', padding: '3px 10px', borderRadius: 20,
              border: '1px solid rgba(232,180,0,0.25)',
            }}>📍 {scanLocation}</span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: scanning ? 'var(--orange)' : locationLocked ? 'var(--green)' : 'var(--muted)',
              boxShadow: scanning ? '0 0 0 3px rgba(232,101,10,0.3)' : locationLocked ? '0 0 0 3px rgba(26,122,74,0.3)' : 'none',
              transition: 'all 0.3s',
            }} />
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace" }}>
              {scanning ? 'Processing…' : locationLocked ? 'Ready' : 'Set Location'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Layout ────────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: '24px',
        display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start',
      }}>

        {/* ══ LEFT PANEL ══════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Scan Location */}
          <div style={{
            background: 'var(--white)', borderRadius: 12,
            border: locationError ? '1.5px solid var(--red)' : locationLocked ? '1px solid rgba(26,122,74,0.4)' : '1px solid var(--border)',
            overflow: 'hidden', transition: 'border-color 0.2s',
          }}>
            <div style={{
              background: locationLocked ? 'var(--green)' : 'var(--navy)',
              padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'background 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8b400" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: '#fff', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {locationLocked ? 'Location Locked' : 'Scan Location · Required'}
                </span>
              </div>
              {locationLocked && (
                <button onClick={handleUnlockLocation} style={{
                  fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                  background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 4,
                  padding: '2px 8px', cursor: 'pointer', letterSpacing: '0.05em',
                }}>UNLOCK</button>
              )}
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                ref={locationRef}
                type="text"
                placeholder="e.g. Warehouse A — Shelf 3"
                value={scanLocation}
                disabled={locationLocked}
                onChange={(e) => setScanLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLockLocation()}
                className={locationError ? 'loc-shake' : ''}
                style={{
                  width: '100%', padding: '9px 12px',
                  border: locationError ? '1.5px solid var(--red)' : '1.5px solid var(--border)',
                  borderRadius: 7, fontSize: 13, fontFamily: 'Inter,sans-serif', color: 'var(--text)',
                  background: locationLocked ? '#f8f9fc' : 'var(--bg)',
                  cursor: locationLocked ? 'not-allowed' : 'text',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { if (!locationLocked) e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
              {!locationLocked ? (
                <button onClick={handleLockLocation} style={{
                  padding: '9px 0', background: 'var(--navy)', color: '#fff',
                  border: 'none', borderRadius: 7, cursor: 'pointer',
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: '0.07em', textTransform: 'uppercase', transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.background = 'var(--navy-l)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'var(--navy)')}
                >Lock & Enable Scanner →</button>
              ) : (
                <div style={{
                  padding: '6px 10px', borderRadius: 7, background: 'var(--green-bg)',
                  border: '1px solid rgba(26,122,74,0.2)',
                  fontSize: 11, color: 'var(--green)', fontWeight: 600, textAlign: 'center',
                }}>✓ Scanner is active — start scanning</div>
              )}
              {locationError && (
                <div style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ⚠ Scan location must be set and locked first
                </div>
              )}
            </div>
          </div>

          {/* Target PIDs */}
          <div style={{ background: 'var(--white)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--navy)', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8b400" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: '#fff', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Target PIDs
              </span>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                rows={4}
                placeholder={"Enter PIDs with quantity — PID:qty\nPID001:5, PID002:3\nor each on new line"}
                value={pidInput}
                onChange={(e) => setPidInput(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', resize: 'vertical',
                  border: '1.5px solid var(--border)', borderRadius: 7,
                  fontSize: 12, fontFamily: "'JetBrains Mono',monospace",
                  color: 'var(--text)', background: 'var(--bg)', lineHeight: 1.8,
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
              <button onClick={handleCommitPids} style={{
                padding: '8px 0', background: 'var(--navy)', color: '#fff',
                border: 'none', borderRadius: 7, cursor: 'pointer',
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12,
                letterSpacing: '0.07em', textTransform: 'uppercase', transition: 'background 0.2s',
              }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = 'var(--navy-l)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'var(--navy)')}
              >Set Target PIDs</button>

              {targetPids.length > 0 && (
                <div>
                  {/* Progress */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      {totalMatched} / {totalTargetQty} matched
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: progress === 100 ? 'var(--green)' : 'var(--accent)' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: progress === 100 ? 'var(--green)' : 'var(--accent)',
                      width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
                    }} />
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: '✓ Matched', color: '#e8b400', bg: '#e8b400' },
                      { label: '↩ In DB',   color: '#2f3d7e', bg: 'rgba(47,61,126,0.15)' },
                      { label: '· Pending', color: '#d8dde8', bg: '#f0f2f7' },
                    ].map((l) => (
                      <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: l.bg, border: `1.5px solid ${l.color}`, display: 'inline-block' }} />
                        {l.label}
                      </span>
                    ))}
                  </div>

                  {/* Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
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
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Total Scanned', value: scannedItems.length,                               color: 'var(--navy)' },
              { label: 'PIDs Matched',  value: matchedPids.size,                                   color: 'var(--green)' },
              { label: 'Already in DB', value: scannedItems.filter((i) => i.isPreScanned).length,  color: 'var(--navy-l)' },
              { label: 'Pending Qty',   value: Math.max(0, totalTargetQty - totalMatched),  color: 'var(--orange)' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'var(--white)', borderRadius: 10, border: '1px solid var(--border)', padding: '12px 14px' }}>
                <div style={{ fontSize: 22, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT PANEL ════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Barcode Input */}
          <div style={{
            background: 'var(--white)', borderRadius: 12,
            border: locationLocked ? '1px solid rgba(232,180,0,0.3)' : '1px solid var(--border)',
            overflow: 'hidden', transition: 'border-color 0.3s',
          }}>
            <div style={{ background: 'var(--navy-d)', padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8b400" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 5v4M3 15v4M21 5v4M21 15v4M7 5h10M7 19h10M5 9h14M5 15h14"/>
                </svg>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Barcode Input
                </span>
              </div>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>
                AUTO · 150ms
              </span>
            </div>

            <div style={{ padding: '14px 16px', display: 'flex', gap: 10 }}>
              <input
                ref={barcodeRef}
                type="text"
                placeholder={locationLocked ? 'Scan or type barcode — auto-submits in 150 ms…' : 'Lock scan location to activate scanner'}
                value={barcodeInput}
                onChange={handleBarcodeChange}
                onKeyDown={handleBarcodeKey}
                disabled={scanning || !locationLocked}
                style={{
                  flex: 1, padding: '12px 16px',
                  border: `1.5px solid ${flash === 'success' ? 'var(--green)' : flash === 'error' ? 'var(--red)' : 'var(--border)'}`,
                  borderRadius: 8, fontSize: 15,
                  fontFamily: "'JetBrains Mono',monospace",
                  color: 'var(--text)',
                  background: !locationLocked ? '#f5f6fa' : scanning ? '#fffdf0' : 'var(--bg)',
                  letterSpacing: '0.06em',
                  cursor: !locationLocked ? 'not-allowed' : 'text',
                  transition: 'border-color 0.15s, background 0.2s',
                  animation: locationLocked && !scanning ? 'scanPulse 2.5s infinite' : 'none',
                }}
                onFocus={(e) => { if (locationLocked) e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
              <button
                onClick={() => { if (autoTimer.current) clearTimeout(autoTimer.current); executeScan(barcodeInput); }}
                disabled={scanning || !barcodeInput.trim() || !locationLocked}
                style={{
                  padding: '12px 22px',
                  background: (!locationLocked || scanning) ? 'var(--muted)' : 'var(--accent)',
                  color: (!locationLocked || scanning) ? '#fff' : 'var(--navy-d)',
                  border: 'none', borderRadius: 8,
                  cursor: (!locationLocked || scanning) ? 'not-allowed' : 'pointer',
                  fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >{scanning ? '…' : 'Scan'}</button>
            </div>

            {error && (
              <div style={{
                margin: '0 16px 14px', padding: '9px 12px',
                background: 'var(--red-bg)', border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>{error}</span>
              </div>
            )}
          </div>

          {/* Latest Scan Banner */}
          {scannedItems.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-l) 100%)',
              borderRadius: 12, padding: '14px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: scannedItems[0].isMatched ? '1.5px solid rgba(232,180,0,0.5)' : '1px solid rgba(255,255,255,0.06)',
            }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>
                  Latest Scan
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '0.07em' }}>
                  {scannedItems[0].barcode}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: 'var(--accent)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  PID: {scannedItems[0].pid}
                  {scannedItems[0].isMatched && (
                    <span style={{ background: 'var(--accent)', color: 'var(--navy-d)', padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 800 }}>🎯 MATCHED</span>
                  )}
                  {scannedItems[0].isPreScanned && (
                    <span style={{ background: 'rgba(47,61,126,0.5)', color: '#a0b4ff', padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>↩ IN DB</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Location</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#fff', fontWeight: 600 }}>
                  {scannedItems[0].scan_location}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                  {scannedItems[0].scannedAt.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {/* Scan Log */}
          <div style={{ background: 'var(--white)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{
              background: 'var(--navy-d)', padding: '11px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8b400" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
                </svg>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Scan Log
                </span>
                {scannedItems.length > 0 && (
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)' }}>
                    {scannedItems.length} record{scannedItems.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Row legend */}
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { color: '#e8b400', label: '🎯 Matched' },
                    { color: '#2f3d7e', label: '↩ In DB' },
                  ].map((l) => (
                    <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--muted)' }}>
                      <span style={{ width: 3, height: 14, borderRadius: 2, background: l.color, display: 'inline-block' }} />
                      {l.label}
                    </span>
                  ))}
                </div>

                {/* Export */}
                {scannedItems.length > 0 && (
                  <button onClick={downloadCSV.bind(null, scannedItems)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px',
                    background: 'rgba(232,180,0,0.14)', color: 'var(--accent)',
                    border: '1px solid rgba(232,180,0,0.28)', borderRadius: 6,
                    cursor: 'pointer', fontFamily: "'Syne',sans-serif",
                    fontWeight: 700, fontSize: 11, letterSpacing: '0.06em',
                    textTransform: 'uppercase', transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,180,0,0.24)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(232,180,0,0.14)'; }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export CSV
                  </button>
                )}
              </div>
            </div>

            {scannedItems.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 10, opacity: 0.18 }}>⬛</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500 }}>
                  {locationLocked ? 'Start scanning barcodes above.' : 'Lock a scan location to begin.'}
                </div>
              </div>
            ) : (
              <div style={{ maxHeight: 560, overflowY: 'auto' }}>
                {/* Sticky column headers */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '22px 1fr 1fr 100px 85px 110px',
                  padding: '7px 14px', background: 'var(--bg)',
                  borderBottom: '1px solid var(--border)',
                  position: 'sticky', top: 0, zIndex: 1,
                }}>
                  <span />
                  {['Barcode', 'PID', 'Status', 'Condition', 'Availability'].map((h) => (
                    <span key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>{h}</span>
                  ))}
                </div>
                {scannedItems.map((item, i) => (
                  <ScanRow key={`${item.barcode}-${i}`} item={item} isNew={i === 0} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}