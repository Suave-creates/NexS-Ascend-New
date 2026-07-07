'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Button,
  Textarea,
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

type Row = {
  pid: string;
  location: string;
  barcode: string;
};

export default function InventoryPage() {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async (download = false) => {
    setError('');
    setLoading(true);

    try {
      const pids = input
        .split('\n')
        .map(x => x.trim())
        .filter(Boolean);

      if (pids.length === 0) {
        setError('Enter at least one PID');
        return;
      }

      const res = await fetch('/api/order-info/plant-pid-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pids, download }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      if (download) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory.csv';
        a.click();

        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        setRows(data.rows || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Inventory Lookup"
        subtitle="Retrieve available inventory by PID (bulk supported)"
      />

      {/* INPUT CARD */}
      <Card>
        <CardBody className="space-y-4">
          <Field label="PID Input">
            <Textarea
              rows={5}
              placeholder="Enter PID(s) — one per line"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Field>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button onClick={() => handleFetch(false)} loading={loading}>
                Fetch Data
              </Button>

              <Button variant="outline" onClick={() => handleFetch(true)} loading={loading}>
                Download CSV
              </Button>
            </div>

            {loading && (
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Spinner /> Fetching...
              </span>
            )}
          </div>

          {error && <Alert tone="error">{error}</Alert>}
        </CardBody>
      </Card>

      {/* TABLE CARD */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-brand-700">
            Inventory Records
          </h2>

          <Badge tone="navy" className="font-mono">
            {rows.length} rows
          </Badge>
        </CardHeader>

        <Table>
          <THead>
            <TR>
              <TH>PID</TH>
              <TH>Location</TH>
              <TH>Barcode</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r, i) => (
              <TR key={i}>
                <TD className="font-medium text-gray-900">{r.pid}</TD>
                <TD>{r.location}</TD>
                <TD className="font-mono text-xs">{r.barcode}</TD>
              </TR>
            ))}
          </TBody>
        </Table>

        {!loading && rows.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No inventory data available
          </div>
        )}
      </Card>
    </div>
  );
}
