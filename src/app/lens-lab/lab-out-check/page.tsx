// src/app/lens-lab/lab-out-check/page.tsx

'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import {
  Card,
  CardBody,
  PageHeader,
  Button,
  Input,
  Field,
  Alert,
  Badge,
  Spinner,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

type ResultRow = {
  location_id: string;
  product_id: string;
  barcode: string | null;
  updated_at_ist: string;
  is_valid: boolean;
};

type TrayLog = {
  location_id: string;
  product1?: ResultRow;
  product2?: ResultRow;
  allGreen: boolean;
};

export default function LocationBlankCheckPage() {
  const [operatorId, setOperatorId] = useState('');
  const [operatorConfirmed, setOperatorConfirmed] = useState(false);

  const [locationId, setLocationId] = useState('');
  const [trayLogs, setTrayLogs] = useState<TrayLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  const invalidSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  const trayRegex = /^CT\d{5}$/;

  /* ---------------- Load Sounds ---------------- */

  useEffect(() => {
    invalidSoundRef.current = new Audio('/soundtrack/FAAHH.mp3');
    invalidSoundRef.current.preload = 'auto';

    errorSoundRef.current = new Audio('/soundtrack/BUZZER.mp3');
    errorSoundRef.current.preload = 'auto';
  }, []);

  /* ---------------- Focus Lock ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        operatorConfirmed &&
        scanInputRef.current &&
        document.activeElement !== scanInputRef.current
      ) {
        scanInputRef.current.focus();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [operatorConfirmed]);

  /* ---------------- Operator Confirm ---------------- */

  const handleOperatorConfirm = () => {
    if (!operatorId.trim()) return;

    setOperatorConfirmed(true);

    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 100);
  };

  /* ---------------- Fetch Tray ---------------- */

  const fetchTray = (tray: string) => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/lens-lab/lab-out-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locationId: tray,
            operatorId: operatorId.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Request failed');
        }

        const rows: ResultRow[] = data.data;

        const newLog: TrayLog = {
          location_id: tray,
          product1: rows[0],
          product2: rows[1],
          allGreen: data.allGreen,
        };

        setTrayLogs((prev) => [newLog, ...prev]);
        setError(null);

        /* Play INVALID sound */

        if (!data.allGreen && invalidSoundRef.current) {
          invalidSoundRef.current.currentTime = 0;
          invalidSoundRef.current.play().catch(() => {});
          navigator.vibrate?.(200);
        }
      } catch {
        setError('Failed to fetch location data');

        /* Play ERROR buzzer */

        if (errorSoundRef.current) {
          errorSoundRef.current.currentTime = 0;
          errorSoundRef.current.play().catch(() => {});
          navigator.vibrate?.(300);
        }
      } finally {
        setLocationId('');
        scanInputRef.current?.focus();
      }
    });
  };

  /* ---------------- Handle Scan ---------------- */

  const handleScanChange = (value: string) => {
    const formatted = value.toUpperCase().trim();

    setLocationId(formatted);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (trayRegex.test(formatted) && !isPending) {
        fetchTray(formatted);
      }
    }, 250);
  };

  /* ---------------- Operator Entry Screen ---------------- */

  if (!operatorConfirmed) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Card variant="floating" className="w-full max-w-sm">
          <CardBody className="flex flex-col gap-4">
            <PageHeader
              title="Lab Out Check"
              subtitle="Enter your Operator ID to begin"
              className="text-center"
            />

            <Field label="Operator ID" htmlFor="operatorId">
              <Input
                id="operatorId"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleOperatorConfirm()}
                placeholder="Operator ID"
                className="py-3 text-center text-lg tracking-widest"
                autoFocus
              />
            </Field>

            <Button
              onClick={handleOperatorConfirm}
              disabled={!operatorId.trim()}
              size="lg"
              className="font-semibold"
            >
              Confirm
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  /* ---------------- Main Scan Screen ---------------- */

  return (
    <div
      className="mx-auto max-w-6xl space-y-6"
      onClick={() => scanInputRef.current?.focus()}
    >
      <PageHeader
        title="Lab Out Check"
        subtitle="Scan a tray to verify lab-out lens blanks"
        actions={
          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
            <span className="text-gray-500">Operator</span>
            <span className="font-bold tracking-wide text-brand-700">
              {operatorId}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOperatorConfirmed(false);
                setOperatorId('');
                setTrayLogs([]);
                setError(null);
              }}
            >
              Change
            </Button>
          </div>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <CardBody className="space-y-4">
          <Field label="Scan Tray" htmlFor="scanTray">
            <Input
              id="scanTray"
              ref={scanInputRef}
              value={locationId}
              onChange={(e) => handleScanChange(e.target.value)}
              placeholder="Scan Tray (CT12345)"
              className="py-3 text-lg"
              disabled={isPending}
              autoFocus
            />
          </Field>

          {isPending && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Spinner /> Fetching...
            </div>
          )}

          {error && <Alert tone="error">{error}</Alert>}
        </CardBody>
      </Card>

      {trayLogs.length > 0 && (
        <Card>
          <Table>
            <THead>
              <TR>
                <TH className="text-center">Location ID</TH>
                <TH className="text-center">Product - Barcode (1)</TH>
                <TH className="text-center">Product - Barcode (2)</TH>
                <TH className="text-center">Updated At (IST)</TH>
                <TH className="text-center">Status</TH>
              </TR>
            </THead>

            <TBody>
              {trayLogs.map((tray, i) => (
                <TR key={i} tone={tray.allGreen ? 'good' : 'danger'}>
                  <TD className="text-center font-medium">{tray.location_id}</TD>

                  <TD
                    className={cn(
                      'text-center font-semibold',
                      tray.product1?.is_valid
                        ? 'text-good-600'
                        : 'text-danger-600',
                    )}
                  >
                    {tray.product1
                      ? `${tray.product1.product_id} - ${tray.product1.barcode}`
                      : '-'}
                  </TD>

                  <TD
                    className={cn(
                      'text-center font-semibold',
                      tray.product2?.is_valid
                        ? 'text-good-600'
                        : 'text-danger-600',
                    )}
                  >
                    {tray.product2
                      ? `${tray.product2.product_id} - ${tray.product2.barcode}`
                      : '-'}
                  </TD>

                  <TD className="text-center">
                    {tray.product1?.updated_at_ist || '-'}
                  </TD>

                  <TD className="text-center">
                    <Badge tone={tray.allGreen ? 'good' : 'danger'}>
                      {tray.allGreen ? 'VALID' : 'INVALID'}
                    </Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
