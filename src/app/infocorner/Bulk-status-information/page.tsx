//src/app/infocorner/Bulk-status-information/page.tsx

'use client';

import { useState, useTransition, useMemo, useRef } from 'react';
import {
  Card,
  CardBody,
  PageHeader,
  Button,
  Input,
  Field,
  Alert,
  Badge,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

type ResultRow = {
  product_id: string;
  barcode: string | null;
  status: string;
};

type ScanRow = {
  barcode: string;
  valid: boolean;
};

export default function BulkStatusPage() {
  const [locationId, setLocationId] = useState('');
  const [results, setResults] = useState<ResultRow[]>([]);
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [scanInput, setScanInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

  /** All valid barcodes returned by backend (ignore nulls) */
  const barcodeSet = useMemo(
    () =>
      new Set(
        results
          .map((r) => r.barcode)
          .filter((b): b is string => Boolean(b))
      ),
    [results]
  );

  /** All scanned + valid barcodes */
  const scannedValidSet = useMemo(
    () => new Set(scans.filter((s) => s.valid).map((s) => s.barcode)),
    [scans]
  );

  const matchedCount = useMemo(
    () =>
      results.filter((r) => r.barcode && scannedValidSet.has(r.barcode)).length,
    [results, scannedValidSet]
  );

  const handleFetch = () => {
    setError(null);
    setResults([]);
    setScans([]);

    if (!locationId.trim()) {
      setError('Please scan a valid Tray / Location ID.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/operations/bulk-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locationId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Request failed');
        }

        setResults(data.data || []);
      } catch {
        setError('Failed to fetch bulk status.');
      }
    });
  };

  /** Extract barcode from QR URL or raw scan */
  const extractBarcode = (raw: string): string => {
    try {
      if (raw.includes('barcode=')) {
        return raw.split('barcode=')[1].split('&')[0];
      }
      return raw;
    } catch {
      return raw;
    }
  };

  /** Scanner debounce handler (350 ms) */
  const handleScanChange = (value: string) => {
    setScanInput(value);

    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
    }

    scanTimerRef.current = setTimeout(() => {
      const raw = value.trim();
      if (!raw) return;

      const barcode = extractBarcode(raw);
      const valid = barcodeSet.has(barcode);

      setScans((prev) => [{ barcode, valid }, ...prev]);
      setScanInput('');
    }, 350);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Bulk Status + Physical Scan Check"
        subtitle="Fetch all products at a tray / location and validate them against a live physical scan session."
      />

      {/* Search Card */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Tray / Location ID" className="flex-1">
              <Input
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                placeholder="Scan Tray / Location ID"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFetch();
                }}
                autoFocus
              />
            </Field>

            <Button onClick={handleFetch} loading={isPending}>
              {isPending ? 'Fetching…' : 'Fetch'}
            </Button>
          </div>

          {error && <Alert tone="error">{error}</Alert>}
        </CardBody>
      </Card>

      {/* Main Content */}
      {results.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Products" value={results.length} tone="navy" />
            <StatCard label="Scanned" value={scans.length} tone="gold" />
            <StatCard label="Matched" value={matchedCount} tone="good" />
            <StatCard
              label="Remaining"
              value={Math.max(results.length - matchedCount, 0)}
              tone="notice"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Results Table */}
            <Card className="lg:col-span-2">
              <Table>
                <THead>
                  <TR>
                    <TH>Product ID</TH>
                    <TH>Barcode</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>

                <TBody>
                  {results.map((r, i) => (
                    <TR
                      key={i}
                      tone={
                        r.barcode && scannedValidSet.has(r.barcode)
                          ? 'good'
                          : undefined
                      }
                    >
                      <TD>{r.product_id}</TD>
                      <TD>{r.barcode ?? '-'}</TD>
                      <TD>{r.status}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Card>

            {/* Scan Session Panel */}
            <Card>
              <CardBody className="space-y-3">
                <h3 className="font-semibold text-brand-700">
                  Scan Validation (Session)
                </h3>

                <Field label="Scan barcode / QR">
                  <Input
                    value={scanInput}
                    onChange={(e) => handleScanChange(e.target.value)}
                    placeholder="Scan barcode / QR"
                    autoFocus
                  />
                </Field>

                <div className="max-h-[400px] space-y-2 overflow-auto">
                  {scans.length === 0 && (
                    <p className="text-sm text-gray-500">No scans yet.</p>
                  )}
                  {scans.map((s, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                        s.valid
                          ? 'bg-good-50 text-good-600'
                          : 'bg-danger-50 text-danger-600',
                      )}
                    >
                      <span className="truncate">{s.barcode}</span>
                      <Badge tone={s.valid ? 'good' : 'danger'}>
                        {s.valid ? 'Valid' : 'Invalid'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
