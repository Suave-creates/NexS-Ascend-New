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

  return (
    <div className="space-y-8 p-6">
      <PageHeader title="TOTE MASTER VISUALISER v1" className="justify-center text-center" />

      {/* ===============================
         Scanner Input
      ================================ */}
      <Card variant="floating" className="mx-auto max-w-4xl p-6">
        <Input
          type="text"
          autoFocus
          placeholder="Scan Tote ID"
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
         Tote Map
      ================================ */}
      <Card className="mx-auto min-h-[220px] max-w-5xl">
        <CardHeader>
          <h2 className="text-xl font-semibold text-brand-700">
            Tote Map {toteId && <span className="font-mono">({toteId})</span>}
          </h2>
        </CardHeader>
        <CardBody>
        {!toteId ? (
          <div className="text-sm text-gray-500">
            Scan a tote to view partitions
          </div>
        ) : isCompletelyEmpty ? (
          <div className="h-32 rounded-xl bg-green-500 text-white flex items-center justify-center text-xl font-bold border">
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

              let bg = 'bg-gray-200 text-gray-600';
              if (items.length > 0) bg = 'bg-red-500 text-white';
              if (new Set(items.map(i => i.pid)).size > 1)
                bg = 'bg-red-500 text-white';

              return (
                <div
                  key={pr}
                  className={`h-24 rounded-lg flex flex-col items-center justify-center font-semibold border ${bg}`}
                >
                  <div>{pr}</div>
                  <div className="text-xs mt-1">
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
      <Card className="mx-auto min-h-[200px] max-w-7xl">
        <CardHeader>
          <h2 className="text-xl font-semibold text-brand-700">
            Partition Inventory
          </h2>
        </CardHeader>
        <CardBody>
        {partitionKeys.length === 0 ? (
          <div className="text-sm text-gray-500">
            No inventory to display
          </div>
        ) : (
          <Table>
            <THead>
              <tr>
                {partitionKeys.map(pr => (
                  <TH key={pr}>
                    {pr}
                  </TH>
                ))}
              </tr>
            </THead>

            <TBody>
              {Array.from({ length: maxRows }).map((_, rowIdx) => (
                <TR key={rowIdx}>
                  {partitionKeys.map(pr => {
                    const item = partitions[pr][rowIdx];
                    return (
                      <TD
                        key={pr}
                        className="font-mono text-gray-700"
                      >
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
