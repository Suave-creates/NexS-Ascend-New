'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardBody,
  PageHeader,
  Input,
  Alert,
  StatCard,
  Spinner,
} from '@/components/ui';
import { cn } from '@/lib/cn';

/* ================= TYPES ================= */

type ScanRow = {
  barcode: string;
  pid: string | number;
  location: string;
  condition: string;
  status: string;
  availability: string;
  status_color: 'GREEN' | 'RED';
};

/* ================= PAGE ================= */

export default function BarcodeScannerPage() {
  const [scanValue, setScanValue] = useState('');
  const [currentScan, setCurrentScan] = useState<ScanRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /* ================= AUTO-TRIGGER SCAN ================= */

  useEffect(() => {
    if (scanValue.trim().length >= 12) {
      triggerScan(scanValue.trim());
    }
  }, [scanValue]);

  const triggerScan = (rawInput: string) => {
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/infocorner/barcode-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: rawInput }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Scan failed');

        setCurrentScan(data.row);
        setScanValue('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch barcode details');
      }
    });
  };

  /* ================= DERIVED VALUES ================= */

  const last3Pid =
    currentScan?.pid !== undefined ? String(currentScan.pid).slice(-3) : '';

  // Frontend only consumes backend decision
  const isGood = currentScan?.status_color === 'GREEN';

  /* ================= RENDER ================= */

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="IMS Barcode Condition Scanner"
        subtitle="Scan a barcode or paste a link to check item condition and availability"
      />

      {/* ================= SCANNER INPUT ================= */}
      <Card className="mx-auto w-full max-w-2xl">
        <CardBody className="space-y-3">
          <Input
            autoFocus
            type="text"
            placeholder="Scan Barcode / Paste Link"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            className="px-4 py-3 text-lg"
          />

          {isPending && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Spinner />
              Processing scan…
            </div>
          )}

          {error && (
            <Alert tone="error" role="alert">
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* ================= VISIBILITY PANEL ================= */}
      {currentScan && (
        <Card className="mx-auto w-full max-w-5xl">
          <CardBody className="space-y-8 p-6 text-center sm:p-10">
            {/* ===== HUGE PID (LAST 3 DIGITS) ===== */}
            <div
              className={cn(
                'text-[11rem] font-extrabold leading-none tracking-widest',
                isGood ? 'text-good-600' : 'text-danger-600',
              )}
            >
              {last3Pid}
            </div>

            {/* ===== METADATA GRID (4 TILES) ===== */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <StatCard
                label="Location"
                value={currentScan.location || '—'}
                tone="navy"
              />
              <StatCard
                label="Barcode"
                value={
                  <span className="break-all font-mono text-xl">
                    {currentScan.barcode}
                  </span>
                }
                tone="navy"
              />
              <StatCard label="PID" value={currentScan.pid} tone="navy" />
              <StatCard
                label="Condition"
                value={currentScan.condition}
                tone={isGood ? 'good' : 'danger'}
              />
            </div>

            {/* ===== STATUS / AVAILABILITY ===== */}
            <div className="text-sm text-gray-400">
              Status: {currentScan.status} | Availability:{' '}
              {currentScan.availability}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
