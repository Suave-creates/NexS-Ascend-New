'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Input,
  Field,
  Button,
  Alert,
  Badge,
  StatCard,
  StatusPill,
  Spinner,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

type StockOutMode = 'barcode' | 'location';

interface LogEntry {
  value: string;
  mode: StockOutMode;
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
  const [mode, setMode] = useState<StockOutMode>('barcode');
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

    // Only barcodes use the link-barcode rightmost-12 rule. Locations remain whole.
    const finalValue = mode === 'barcode' ? trimmed.slice(-12) : trimmed;

    setIsLoading(true);
    setToast({ type: 'loading', message: `Processing ${mode} stock-out for ${finalValue}…` });

    try {
      const res = await fetch('/api/asrs/pid-hunted-stock-out', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'location'
            ? { mode, scan_location: finalValue }
            : { mode, barcode: finalValue },
        ),
      });

      const data: StockOutResponse = await res.json();

      if (data.success) {
        const count = data.deletedCount ?? 0;
        setStatScans((s) => s + 1);
        setStatDeleted((s) => s + count);
        setToast({
          type: 'success',
          message: `Stocked out ${mode} "${finalValue}" — ${count} record(s) deleted`,
        });

        const now = new Date();
        const entry: LogEntry = {
          value: finalValue,
          mode,
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
  }, [barcode, continuous, focusInput, mode]);

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
    const header = ['Mode', 'Value', 'Records Deleted', 'Time', 'Timestamp'];
    const rows = log.map((e) => [e.mode, e.value, e.deletedCount, e.time, e.timestamp]);
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
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Stock-Out Module"
        subtitle="Stock out one barcode or every record at a scan location"
        actions={
          <>
            <Button
              variant={continuous ? 'primary' : 'outline'}
              size="sm"
              onClick={toggleContinuous}
            >
              Continuous {continuous ? 'On' : 'Off'}
            </Button>
            {continuous && <StatusPill tone="gold">● Live</StatusPill>}
          </>
        }
      />

      {/* Scan area */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            <Button
              type="button"
              size="sm"
              variant={mode === 'barcode' ? 'primary' : 'ghost'}
              className="flex-1"
              onClick={() => { setMode('barcode'); setBarcode(''); focusInput(); }}
              disabled={isLoading}
            >
              Barcode
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === 'location' ? 'primary' : 'ghost'}
              className="flex-1"
              onClick={() => { setMode('location'); setBarcode(''); focusInput(); }}
              disabled={isLoading}
            >
              Scan Location
            </Button>
          </div>

          <Field label={mode === 'location' ? 'Scan Location' : 'Barcode'}>
            <div
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-white px-4 py-3 transition',
                continuous && 'border-solid border-gold-500',
              )}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-brand-700">
                <ScanIcon />
              </div>
              <Input
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={mode === 'location' ? 'Scan or type the full location…' : 'Scan or type barcode…'}
                className="border-0 bg-transparent px-0 font-mono text-xl font-semibold text-brand-700 shadow-none focus:ring-0"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <Button
                variant="danger"
                onClick={submitStockOut}
                disabled={isLoading || !barcode.trim()}
                loading={isLoading}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {isLoading ? 'Processing…' : mode === 'location' ? 'Stock Out Location' : 'Stock Out'}
              </Button>
            </div>
          </Field>

          {/* Toast */}
          {toast.type !== 'idle' && (
            <Alert tone={TOAST_TONES[toast.type]} className="flex items-center gap-2.5">
              {toast.type === 'loading' ? (
                <Spinner className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ToastIcon type={toast.type} />
              )}
              <span>{toast.message}</span>
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard tone="navy" label="Session scans" value={statScans} />
        <StatCard tone="danger" label="Records deleted" value={statDeleted} />
        <StatCard tone="good" label="Actions logged" value={log.length} />
      </div>

      {/* Log */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-brand-700">Stock-out Log</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={clearLog} disabled={!log.length}>
              Clear
            </Button>
            <Button size="sm" variant="success" onClick={exportCSV} disabled={!log.length}>
              Export CSV
            </Button>
          </div>
        </CardHeader>

        <div className="max-h-[320px] overflow-y-auto">
          {log.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              Nothing stocked out yet
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Mode</TH>
                  <TH>Value</TH>
                  <TH>Records Deleted</TH>
                  <TH className="text-right">Time</TH>
                </TR>
              </THead>
              <TBody>
                {log.map((entry, i) => (
                  <TR key={`${entry.mode}-${entry.value}-${i}`}>
                    <TD><Badge tone={entry.mode === 'location' ? 'gold' : 'navy'}>{entry.mode}</Badge></TD>
                    <TD className="font-mono font-semibold text-brand-700">{entry.value}</TD>
                    <TD>
                      <Badge tone="danger">-{entry.deletedCount} records</Badge>
                    </TD>
                    <TD className="whitespace-nowrap text-right text-xs text-gray-500">
                      {entry.time}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
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

function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="4" height="12" rx="1" />
      <rect x="8" y="6" width="2" height="12" rx="1" />
      <rect x="12" y="6" width="4" height="12" rx="1" />
      <rect x="18" y="6" width="4" height="12" rx="1" />
    </svg>
  );
}
