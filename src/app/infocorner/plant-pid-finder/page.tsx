'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Button,
  Textarea,
  Label,
  Alert,
  Badge,
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
    <div className="space-y-4">

      {/* HEADER */}
      <PageHeader
        title="Inventory Lookup"
        subtitle="Retrieve available inventory by PID (bulk supported)"
      />

      {/* INPUT CARD */}
      <Card>
        <CardBody className="space-y-2">

          <Label>PID Input</Label>

          <Textarea
            rows={5}
            placeholder="Enter PID(s) — one per line"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-2">

            <div className="flex gap-3">
              <Button onClick={() => handleFetch(false)}>
                Fetch Data
              </Button>

              <Button
                onClick={() => handleFetch(true)}
                className="bg-gold-500 text-brand-700 hover:bg-gold-500/90 focus-visible:ring-gold-500"
              >
                Download CSV
              </Button>
            </div>

            {loading && (
              <span className="text-sm text-gray-500">
                Fetching...
              </span>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <Alert tone="error" className="mt-4">
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* TABLE CARD */}
      <Card>

        {/* TABLE HEADER */}
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700">
            Inventory Records
          </h2>

          <Badge tone="navy" className="font-mono">
            {rows.length} rows
          </Badge>
        </CardHeader>

        {/* TABLE */}
        <div className="p-4">
          <Table>

            <THead>
              <tr>
                <TH>
                  PID
                </TH>
                <TH>
                  Location
                </TH>
                <TH>
                  Barcode
                </TH>
              </tr>
            </THead>

            <TBody>
              {rows.map((r, i) => (
                <TR key={i}>
                  <TD className="font-medium text-gray-900">
                    {r.pid}
                  </TD>
                  <TD>
                    {r.location}
                  </TD>
                  <TD className="font-mono text-xs">
                    {r.barcode}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* EMPTY STATE */}
          {!loading && rows.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              No inventory data available
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
