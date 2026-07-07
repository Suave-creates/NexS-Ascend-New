'use client';

import { useState, useTransition } from 'react';
import {
  PageHeader,
  Card,
  CardBody,
  Textarea,
  Button,
  Alert,
} from '@/components/ui';

export default function POBulkCSVExportPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const parsePONumbers = (raw: string): string[] => {
    return Array.from(
      new Set(
        raw
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
      )
    );
  };

  const handleDownload = () => {
    setError(null);

    const poNums = parsePONumbers(input);

    if (poNums.length === 0) {
      setError('Please paste at least one PO number.');
      return;
    }

    if (poNums.length > 10) {
      setError('Maximum of 10 PO numbers allowed per request.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/order-info/po-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ po_nums: poNums }),
        });

        if (!res.ok) {
          throw new Error('CSV generation failed');
        }

        const csv = await res.text();

        const blob = new Blob([csv], {
          type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `purchase_order_items_${Date.now()}.csv`;
        a.click();

        URL.revokeObjectURL(url);
      } catch {
        setError('Failed to generate CSV. Please try again.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader
        className="flex-col items-center justify-center text-center"
        title="Purchase Order CSV Export"
        subtitle="Export purchase order line items directly from NexS DB"
      />

      {/* Input Card */}
      <Card className="mx-auto max-w-4xl">
        <CardBody>
          <div className="mb-4 text-sm text-gray-600">
            Paste PO numbers below, one per line.
            <br />
            Maximum <span className="font-semibold">10 PO numbers</span> per export.
          </div>

          <Textarea
            rows={9}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`PNXS2-25-0067982\nPNXS2-25-0067983`}
          />

          {/* Footer Row */}
          <div className="mt-4 flex items-center justify-between gap-4">
            {error ? (
              <Alert tone="error">
                {error}
              </Alert>
            ) : (
              <div className="text-xs text-gray-500">
                Duplicate PO numbers are automatically ignored
              </div>
            )}

            <Button
              onClick={handleDownload}
              disabled={isPending}
              className="px-8"
            >
              {isPending ? 'Generating CSV…' : 'Download CSV'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
