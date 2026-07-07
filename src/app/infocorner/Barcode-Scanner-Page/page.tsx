'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardBody, PageHeader, Input, Alert } from '@/components/ui';
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
        const res = await fetch('/api/order-info/barcode-scan', {
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
    currentScan?.pid !== undefined
      ? String(currentScan.pid).slice(-3)
      : '';

  // Frontend only consumes backend decision
  const isGood = currentScan?.status_color === 'GREEN';

  /* ================= RENDER ================= */

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <PageHeader title="IMS BARCODE CONDITION SCANNER" />

      {/* ================= SCANNER INPUT ================= */}
      <Card className="mx-auto w-full max-w-2xl">
        <CardBody>
          <Input
            autoFocus
            type="text"
            placeholder="Scan Barcode / Paste Link"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            className="px-4 py-3 text-lg"
          />

          {isPending && (
            <p className="mt-2 text-center text-sm text-gray-500">
              Processing scan…
            </p>
          )}

          {error && (
            <Alert tone="error" className="mt-3 text-center" role="alert">
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* ================= VISIBILITY PANEL ================= */}
      {currentScan && (
        <div className="mt-8 flex flex-1 items-center justify-center">
          <Card className="w-full max-w-5xl rounded-3xl p-10 text-center shadow-xl">

            {/* ===== HUGE PID (LAST 3 DIGITS) ===== */}
            <div
              className={cn(
                'text-[11rem] font-extrabold leading-none tracking-widest',
                isGood ? 'text-good-600' : 'text-danger-600',
              )}
            >
              {last3Pid}
            </div>

            {/* ===== METADATA GRID (4 BOXES) ===== */}
            <div className="mt-8 grid grid-cols-1 gap-6 text-sm md:grid-cols-4">

              {/* 1️⃣ Location */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-1 text-gray-500">Location</div>
                <div className="text-xl font-semibold">
                  {currentScan.location || '—'}
                </div>
              </div>

              {/* 2️⃣ Barcode */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-1 text-gray-500">Barcode</div>
                <div className="break-all font-mono text-xl">
                  {currentScan.barcode}
                </div>
              </div>

              {/* 3️⃣ PID */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-1 text-gray-500">PID</div>
                <div className="text-xl font-semibold">
                  {currentScan.pid}
                </div>
              </div>

              {/* 4️⃣ Condition */}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="mb-1 text-gray-500">Condition</div>
                <div
                  className={cn(
                    'text-xl font-bold',
                    isGood ? 'text-good-600' : 'text-danger-600',
                  )}
                >
                  {currentScan.condition}
                </div>
              </div>
            </div>

            {/* ===== STATUS / AVAILABILITY (FONT +10%) ===== */}
            <div className="mt-6 text-sm text-gray-400">
              Status: {currentScan.status} | Availability: {currentScan.availability}
            </div>

          </Card>
        </div>
      )}
    </div>
  );
}
