//src/app/infocorner/Bulk-status-information/Page.tsx

'use client';

import { useState, useTransition, useMemo, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Button,
  Input,
  Alert,
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
    <div className="space-y-6">
      <PageHeader title="BULK STATUS + PHYSICAL SCAN CHECK" />

      {/* Search Card */}
      <Card className="mx-auto max-w-4xl">
        <CardBody>
          <div className="flex justify-center gap-4">
            <Input
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="Scan Tray / Location ID"
              className="max-w-md"
            />

            <Button
              onClick={handleFetch}
              disabled={isPending}
              className="px-6"
            >
              {isPending ? 'Fetching…' : 'Fetch'}
            </Button>
          </div>

          {error && (
            <Alert tone="error" className="mt-4 text-center">
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Main Content */}
      {results.length > 0 && (
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6">
          {/* Results Table */}
          <Card className="col-span-2">
            <div className="overflow-auto p-4">
              <Table>
                <THead>
                  <tr>
                    <TH>Product ID</TH>
                    <TH>Barcode</TH>
                    <TH>Status</TH>
                  </tr>
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
                      <TD>
                        {r.product_id}
                      </TD>
                      <TD>
                        {r.barcode ?? '-'}
                      </TD>
                      <TD>
                        {r.status}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </Card>

          {/* Scan Session Panel */}
          <Card>
            <CardBody>
              <h3 className="mb-3 font-semibold text-gray-700">
                Scan Validation (Session)
              </h3>

              <Input
                value={scanInput}
                onChange={(e) => handleScanChange(e.target.value)}
                placeholder="Scan barcode / QR"
                className="mb-3"
                autoFocus
              />

              <div className="max-h-[400px] space-y-2 overflow-auto">
                {scans.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded px-3 py-2 text-sm font-medium',
                      s.valid
                        ? 'bg-good-50 text-good-600'
                        : 'bg-danger-50 text-danger-600',
                    )}
                  >
                    {s.barcode}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
