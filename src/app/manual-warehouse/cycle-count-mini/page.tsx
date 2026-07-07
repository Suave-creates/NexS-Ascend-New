'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Input,
  Alert,
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
      : Math.max(
          ...pidKeys.map(pid => pidVisibility[pid].length)
        );

  const isCompletelyEmpty =
    location && pidKeys.length === 0;

  /* ===============================
     Render
  ================================ */
  return (
    <div className="space-y-8 p-6">
      <PageHeader title="LOCATION Cycle Count v1" className="justify-center text-center" />

      {/* ===============================
         Scanner Input
      ================================ */}
      <Card variant="floating" className="mx-auto max-w-4xl p-6">
        <Input
          type="text"
          autoFocus
          placeholder="Scan Location"
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
        />

        {isPending && (
          <p className="mt-2 text-sm text-gray-500">
            Processing scan…
          </p>
        )}

        {error && (
          <Alert tone="error" className="mt-4">
            {error}
          </Alert>
        )}
      </Card>

      {/* ===============================
         PID Visibility Grid
      ================================ */}
      <Card className="mx-auto min-h-[220px] max-w-5xl">
        <CardHeader>
          <h2 className="text-xl font-semibold text-brand-700">
            Location Map{' '}
            {location && (
              <span className="font-mono">({location})</span>
            )}
          </h2>
        </CardHeader>
        <CardBody>
        {!location ? (
          <div className="text-sm text-gray-500">
            Scan a location to view PID visibility
          </div>
        ) : isCompletelyEmpty ? (
          <div className="h-32 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold border">
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

              let bg = 'bg-blue-500 text-white'; // empty

              if (count > 0 && count < 5) {
                bg = 'bg-red-500 text-white';
              } else if (count >= 5 && count <= 15) {
                bg = 'bg-orange-500 text-white';
              } else if (count > 15) {
                bg = 'bg-green-500 text-white';
              }

              return (
                <div
                  key={pid}
                  className={`h-24 rounded-lg flex flex-col items-center justify-center font-semibold border ${bg}`}
                >
                  <div>PID {pid}</div>
                  <div className="text-xs mt-1">
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
      <Card className="mx-auto min-h-[200px] max-w-7xl">
        <CardHeader>
          <h2 className="text-xl font-semibold text-brand-700">
            PID Inventory
          </h2>
        </CardHeader>
        <CardBody>
        {pidKeys.length === 0 ? (
          <div className="text-sm text-gray-500">
            No inventory to display
          </div>
        ) : (
          <Table>
            <THead>
              <tr>
                {pidKeys.map(pid => (
                  <TH key={pid}>
                    PID {pid}
                  </TH>
                ))}
              </tr>
            </THead>

            <TBody>
              {Array.from({ length: maxRows }).map(
                (_, rowIdx) => (
                  <TR key={rowIdx}>
                    {pidKeys.map(pid => {
                      const item =
                        pidVisibility[pid][rowIdx];
                      return (
                        <TD
                          key={pid}
                          className="font-mono text-gray-700"
                        >
                          {item ? item.barcode : '-'}
                        </TD>
                      );
                    })}
                  </TR>
                )
              )}
            </TBody>
          </Table>
        )}
        </CardBody>
      </Card>
    </div>
  );
}
