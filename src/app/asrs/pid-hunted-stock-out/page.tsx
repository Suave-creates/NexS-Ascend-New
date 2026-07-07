'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardBody, PageHeader, Input, Button, Alert, StatCard, StatusPill, Spinner } from '@/components/ui';
import { cn } from '@/lib/cn';

interface LogEntry {
  barcode: string;
  deletedCount: number;
  time: string;
  timestamp: string;
}

interface StockOutResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}

type ToastType = 'idle' | 'loading' | 'success' | 'error';

interface ToastState {
  type: ToastType;
  message: string;
}

const TOAST_TONES: Record<Exclude<ToastType, 'idle'>, 'notice' | 'success' | 'error'> = {
  loading: 'notice',
  success: 'success',
  error: 'error',
};

export default function StockOutModule() {
  const [barcode, setBarcode] = useState('');
  const [continuous, setContinuous] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [toast, setToast] = useState<ToastState>({ type: 'idle', message: '' });
  const [statScans, setStatScans] = useState(0);
  const [statDeleted, setStatDeleted] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const submitStockOut = useCallback(async () => {
    const trimmed = barcode.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    // Extract last 12 characters (right 12 of input string)
    const finalBarcode = trimmed.slice(-12);

    setIsLoading(true);
    setToast({ type: 'loading', message: `Processing stock-out for ${finalBarcode}…` });

    try {
      const res = await fetch('/api/asrs/pid-hunted-stock-out', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: finalBarcode }),
      });

      const data: StockOutResponse = await res.json();

      if (data.success) {
        const count = data.deletedCount ?? 0;
        setStatScans((s) => s + 1);
        setStatDeleted((s) => s + count);
        setToast({
          type: 'success',
          message: `Stocked out "${finalBarcode}" — ${count} record(s) deleted`,
        });

        const now = new Date();
        const entry: LogEntry = {
          barcode: finalBarcode,
          deletedCount: count,
          time: now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          timestamp: now.toISOString(),
        };
        setLog((prev) => [entry, ...prev]);
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to stock out barcode' });
      }
    } catch {
      setToast({ type: 'error', message: 'Network error — could not reach server' });
    } finally {
      setIsLoading(false);
      setBarcode('');
      if (continuous) {
        focusInput();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [barcode, continuous, focusInput]);

  // Auto-submit after 150ms of barcode input
  useEffect(() => {
    if (barcode.trim() && !isLoading) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        submitStockOut();
      }, 150);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [barcode, isLoading, submitStockOut]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submitStockOut();
  };

  const clearLog = () => {
    setLog([]);
    setStatScans(0);
    setStatDeleted(0);
    setToast({ type: 'idle', message: '' });
    inputRef.current?.focus();
  };

  const exportCSV = () => {
    if (!log.length) return;
    const header = ['Barcode', 'Records Deleted', 'Time', 'Timestamp'];
    const rows = log.map((e) => [e.barcode, e.deletedCount, e.time, e.timestamp]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stockout_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleContinuous = () => {
    setContinuous((prev) => {
      if (!prev) inputRef.current?.focus();
      return !prev;
    });
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3.5 bg-brand-900 px-6 py-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500">
          <BarcodeIcon />
        </div>
        <PageHeader
          title="Stock-Out Module"
          subtitle="Scan barcode to remove all inventory records"
          className="mb-0 flex-1 [&_h1]:text-base [&_h1]:font-medium [&_h1]:text-white [&_p]:mt-0.5 [&_p]:text-white/50"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 border-b border-white/10 bg-brand-700 px-6 py-3">
        <button
          type="button"
          onClick={toggleContinuous}
          className="flex select-none items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5"
        >
          <span
            className={cn(
              'relative h-4 w-7 flex-shrink-0 rounded-full transition-colors',
              continuous ? 'bg-gold-500' : 'bg-white/20',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-3 w-3 rounded-full bg-white transition-[left]',
                continuous ? 'left-3.5' : 'left-0.5',
              )}
            />
          </span>
          <span className="text-xs font-medium text-white/75">Continuous Scanning</span>
        </button>
        {continuous && (
          <StatusPill tone="gold" className="ml-auto normal-case tracking-normal">
            ● LIVE
          </StatusPill>
        )}
      </div>

      <CardBody className="flex flex-col gap-4">
        {/* Scan area */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-5 transition',
            continuous && 'border-solid border-gold-500',
          )}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <ScanIcon />
          </div>
          <div className="flex-1">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-gray-500">Barcode</div>
            <Input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Scan or type barcode…"
              className="border-0 bg-transparent px-0 font-mono text-xl font-semibold text-brand-900 shadow-none focus:ring-0"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <Button
            variant="danger"
            onClick={submitStockOut}
            disabled={isLoading || !barcode.trim()}
            loading={isLoading}
            className="flex-shrink-0 whitespace-nowrap"
          >
            {isLoading ? 'Processing…' : 'Stock Out'}
          </Button>
        </div>

        {/* Toast */}
        {toast.type !== 'idle' && (
          <Alert tone={TOAST_TONES[toast.type]} className="flex items-center gap-2.5">
            {toast.type === 'loading' ? <Spinner className="h-4 w-4 flex-shrink-0" /> : <ToastIcon type={toast.type} />}
            <span>{toast.message}</span>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard tone="navy" label="Session scans" value={statScans} />
          <StatCard tone="danger" label="Records deleted" value={statDeleted} />
          <StatCard tone="good" label="Barcodes logged" value={log.length} />
        </div>

        {/* Log */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/60 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-[0.06em] text-gray-500">Deleted Barcodes</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="danger"
                onClick={clearLog}
                disabled={!log.length}
              >
                Clear
              </Button>
              <Button
                size="sm"
                variant="success"
                onClick={exportCSV}
                disabled={!log.length}
              >
                Export CSV
              </Button>
            </div>
          </div>

          <div className="max-h-[220px] overflow-y-auto">
            {log.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No barcodes stocked out yet</div>
            ) : (
              log.map((entry, i) => (
                <div
                  key={`${entry.barcode}-${i}`}
                  className="flex items-center gap-3 border-b border-gray-200/50 px-4 py-2.5"
                >
                  <span className="flex-1 font-mono text-sm font-semibold text-brand-900">{entry.barcode}</span>
                  <span className="rounded-md bg-danger-50 px-2 py-0.5 text-xs font-medium text-danger-600">-{entry.deletedCount} records</span>
                  <span className="flex-shrink-0 text-[11px] text-gray-500">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* ─── Sub-components ─── */

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function BarcodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#151d42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5v14M7 5v14M11 5v14M15 5v9M19 5v9M15 17l2 2 4-4" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2f3d7e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="4" height="12" rx="1" />
      <rect x="8" y="6" width="2" height="12" rx="1" />
      <rect x="12" y="6" width="4" height="12" rx="1" />
      <rect x="18" y="6" width="4" height="12" rx="1" />
    </svg>
  );
}
