'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Field,
  Input,
  Alert,
  Spinner,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

type InventoryItem = {
  barcode: string;
  location: string;
};

type PIDVisibilityMap = Record<string, InventoryItem[]>;

export default function LocationMasterPage() {
  const [scanValue, setScanValue] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [pidVisibility, setPidVisibility] =
    useState<PIDVisibilityMap>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     500ms Debounced Auto Trigger
  ================================ */
  useEffect(() => {
    if (!scanValue.trim()) return;

    const timer = setTimeout(() => {
      triggerScan(scanValue.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [scanValue]);

  /* ===============================
     API Trigger
  ================================ */
  const triggerScan = (locationInput: string) => {
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/manual-warehouse/cc-mini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: locationInput }),
        });

        const text = await res.text();
        if (text.startsWith('<!DOCTYPE')) {
          throw new Error('Invalid API response');
        }

        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.error);

        setLocation(data.location);
        setPidVisibility(data.pidVisibility);
        setScanValue('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch location data');
        setLocation(null);
        setPidVisibility({});
      }
    });
  };

  /* ===============================
     Derived Helpers
  ================================ */
  const pidKeys = Object.keys(pidVisibility).sort(
    (a, b) => Number(a) - Number(b)
  );

  const maxRows =
    pidKeys.length === 0
      ? 0
      : Math.max(...pidKeys.map(pid => pidVisibility[pid].length));

  const isCompletelyEmpty = location && pidKeys.length === 0;

  /* ===============================
     Render
  ================================ */
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Location Cycle Count v1"
        subtitle="Scan a location to view PID visibility and inventory"
      />

      {/* ===============================
         Scanner Input
      ================================ */}
      <Card>
        <CardBody className="space-y-3">
          <Field label="Scan Location">
            <Input
              type="text"
              autoFocus
              placeholder="Scan Location"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
            />
          </Field>

          {isPending && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Spinner />
              Processing scan…
            </div>
          )}

          {error && <Alert tone="error">{error}</Alert>}
        </CardBody>
      </Card>

      {/* ===============================
         PID Visibility Grid
      ================================ */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-brand-700">
            Location Map{' '}
            {location && <span className="font-mono">({location})</span>}
          </h2>
        </CardHeader>
        <CardBody className="min-h-[160px]">
          {!location ? (
            <div className="text-sm text-gray-500">
              Scan a location to view PID visibility
            </div>
          ) : isCompletelyEmpty ? (
            <div className="flex h-32 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold text-white">
              LOCATION EMPTY
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  pidKeys.length,
                  4
                )}, minmax(0, 1fr))`,
              }}
            >
              {pidKeys.map(pid => {
                const items = pidVisibility[pid];
                const count = items.length;

                let bg = 'bg-blue-500 text-white'; // empty / info

                if (count > 0 && count < 5) {
                  bg = 'bg-danger-600 text-white';
                } else if (count >= 5 && count <= 15) {
                  bg = 'bg-notice-600 text-white';
                } else if (count > 15) {
                  bg = 'bg-good-600 text-white';
                }

                return (
                  <div
                    key={pid}
                    className={`flex h-24 flex-col items-center justify-center rounded-lg font-semibold ${bg}`}
                  >
                    <div>PID {pid}</div>
                    <div className="mt-1 text-xs">
                      {count === 0 ? 'Empty' : `${count} items`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ===============================
         PID Inventory Table
      ================================ */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-brand-700">
            PID Inventory
          </h2>
        </CardHeader>
        <CardBody className="min-h-[160px]">
          {pidKeys.length === 0 ? (
            <div className="text-sm text-gray-500">
              No inventory to display
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  {pidKeys.map(pid => (
                    <TH key={pid}>PID {pid}</TH>
                  ))}
                </TR>
              </THead>

              <TBody>
                {Array.from({ length: maxRows }).map((_, rowIdx) => (
                  <TR key={rowIdx}>
                    {pidKeys.map(pid => {
                      const item = pidVisibility[pid][rowIdx];
                      return (
                        <TD key={pid} className="font-mono text-gray-700">
                          {item ? item.barcode : '-'}
                        </TD>
                      );
                    })}
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
