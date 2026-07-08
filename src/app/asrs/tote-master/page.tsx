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
  Badge,
  StatCard,
  Spinner,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

type InventoryItem = {
  pid: number;
  barcode: string;
};

type PartitionMap = Record<string, InventoryItem[]>;

export default function ToteMasterPage() {
  const [scanValue, setScanValue] = useState('');
  const [toteId, setToteId] = useState<string | null>(null);
  const [partitions, setPartitions] = useState<PartitionMap>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  /* ===============================
     Normalization (scanner-safe)
  ================================ */
  const normalizeTote = (raw: string) => {
    return raw.trim().toUpperCase().slice(0, 12);
  };

  /* ===============================
     Validation
  ================================ */
  const isValidToteScan = (val: string) => {
    return (
      val.length === 12 &&
      (val.startsWith('TL') || val.startsWith('TS'))
    );
  };

  /* ===============================
     Auto-trigger on 12 chars
  ================================ */
  useEffect(() => {
    if (isPending) return;

    const normalized = normalizeTote(scanValue);

    if (normalized.length < 12) return;

    if (!isValidToteScan(normalized)) {
      setError('Invalid Tote ID (must start with TL or TS)');
      return;
    }

    if (normalized === lastTriggered) return;

    setLastTriggered(normalized);
    triggerScan(normalized);
  }, [scanValue]);

  /* ===============================
     API trigger
  ================================ */
  const triggerScan = (input: string) => {
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/asrs/tote-master', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        });

        const text = await res.text();
        if (text.startsWith('<!DOCTYPE')) {
          throw new Error('Invalid API response');
        }

        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.error);

        setToteId(data.toteId);
        setPartitions(data.partitions);
        setScanValue('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tote data.');
        setToteId(null);
        setPartitions({});
      }
    });
  };

  /* ===============================
     Derived helpers
  ================================ */
  const partitionKeys = Object.keys(partitions).sort(
    (a, b) => Number(a.replace('PR', '')) - Number(b.replace('PR', ''))
  );

  const totalPartitions =
    partitionKeys.length === 0
      ? 0
      : Math.max(...partitionKeys.map(p => Number(p.replace('PR', ''))));

  const maxRows =
    partitionKeys.length === 0
      ? 0
      : Math.max(...partitionKeys.map(pr => partitions[pr].length));

  const isCompletelyEmpty =
    toteId && Object.keys(partitions).length === 0;

  const occupiedCount = partitionKeys.filter(
    pr => partitions[pr].length > 0
  ).length;

  const conflictCount = partitionKeys.filter(
    pr => new Set(partitions[pr].map(i => i.pid)).size > 1
  ).length;

  const totalItems = partitionKeys.reduce(
    (sum, pr) => sum + partitions[pr].length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Tote Master Visualiser"
        subtitle="Scan a tote to inspect its partition layout and inventory"
      />

      {/* ===============================
         Scanner Input
      ================================ */}
      <Card>
        <CardBody className="space-y-3">
          <Field label="Tote ID" hint="Scan a tote barcode (starts with TL or TS)">
            <Input
              type="text"
              autoFocus
              placeholder="Scan Tote ID"
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
         KPI Row
      ================================ */}
      {toteId && !isCompletelyEmpty && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Partitions" value={totalPartitions} tone="navy" />
          <StatCard label="Occupied" value={occupiedCount} tone="notice" />
          <StatCard label="Total Items" value={totalItems} tone="navy" />
          <StatCard
            label="Conflicts"
            value={conflictCount}
            tone={conflictCount > 0 ? 'danger' : 'good'}
          />
        </div>
      )}

      {/* ===============================
         Tote Map
      ================================ */}
      <Card className="min-h-[220px]">
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-700">
            Tote Map
            {toteId && <Badge tone="navy">{toteId}</Badge>}
          </h2>
        </CardHeader>
        <CardBody>
          {!toteId ? (
            <p className="text-sm text-gray-500">Scan a tote to view partitions</p>
          ) : isCompletelyEmpty ? (
            <div className="flex h-32 items-center justify-center rounded-xl bg-good-600 text-xl font-bold text-white">
              READY FOR DECANT
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.min(totalPartitions, 4)}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: totalPartitions }).map((_, idx) => {
                const pr = `PR${idx + 1}`;
                const items = partitions[pr] || [];

                let bg = 'border-gray-200 bg-gray-100 text-gray-500';
                if (items.length > 0) bg = 'border-danger-600 bg-danger-600 text-white';
                if (new Set(items.map(i => i.pid)).size > 1)
                  bg = 'border-danger-600 bg-danger-600 text-white';

                return (
                  <div
                    key={pr}
                    className={cn(
                      'flex h-24 flex-col items-center justify-center rounded-lg border font-semibold',
                      bg,
                    )}
                  >
                    <div>{pr}</div>
                    <div className="mt-1 text-xs">
                      {items.length > 0
                        ? `${items.length} item${items.length > 1 ? 's' : ''}`
                        : 'Empty'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ===============================
         Partition Inventory Table
      ================================ */}
      <Card className="min-h-[200px]">
        <CardHeader>
          <h2 className="text-lg font-semibold text-brand-700">
            Partition Inventory
          </h2>
        </CardHeader>
        <CardBody>
          {partitionKeys.length === 0 ? (
            <p className="text-sm text-gray-500">No inventory to display</p>
          ) : (
            <Table>
              <THead>
                <TR>
                  {partitionKeys.map(pr => (
                    <TH key={pr}>{pr}</TH>
                  ))}
                </TR>
              </THead>

              <TBody>
                {Array.from({ length: maxRows }).map((_, rowIdx) => (
                  <TR key={rowIdx}>
                    {partitionKeys.map(pr => {
                      const item = partitions[pr][rowIdx];
                      return (
                        <TD key={pr} className="font-mono">
                          {item ? `${item.pid} — ${item.barcode}` : '-'}
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
