// src/app/packing-dispatch/kitne-parcel-the-cl-cls/page.tsx
'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Card, CardBody, PageHeader, Textarea, Button, Badge, Alert } from '@/components/ui';

export default function KitneParcelTheClClsPage() {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [stamp, setStamp] = useState<{
    found: number;
    requested: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const awbCount = useMemo(
    () =>
      new Set(
        input
          .split(/\r?\n|,/)
          .map((s) => s.trim())
          .filter(Boolean),
      ).size,
    [input],
  );

  async function run() {
    setError(null);
    setStamp(null);
    if (awbCount === 0) {
      setError('AWB डालो.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/cl-cls/kitne-parcel-the-cl-cls', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: input,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Server error.');
        return;
      }

      if (!data.rows || data.rows.length === 0) {
        setError('कोई रिकॉर्ड नहीं मिला.');
        setStamp({
          found: 0,
          requested: data?.summary?.requested ?? awbCount,
        });
        return;
      }

      const cols = [
        'master_awb',
        ...Object.keys(data.rows[0]).filter((k) => k !== 'master_awb'),
      ];
      const csv = [
        cols.join(','),
        ...data.rows.map((r: Record<string, any>) =>
          cols.map((c) => csvCell(r[c])).join(','),
        ),
      ].join('\n');

      downloadFile(
        csv,
        `kitne-parcel-the-${ts()}.csv`,
        'text/csv;charset=utf-8;',
      );

      if (data.not_found?.length) {
        downloadFile(
          data.not_found.join('\n'),
          `not-found-${ts()}.txt`,
          'text/plain;charset=utf-8;',
        );
      }

      setStamp({
        found: data.summary.unique_awbs_found,
        requested: data.summary.requested,
      });
    } catch (e: any) {
      setError(e?.message ?? 'Network error.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title={
          <>
            कितने <span className="text-gold-600">पार्सल</span> थे?
          </>
        }
        subtitle="NexS Ascend · Packing & Dispatch"
      />

      <Card>
        <CardBody className="space-y-4">
          <Textarea
            ref={taRef}
            placeholder={'SNXS1270000003049758\nSNXS1270000003049759'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[200px] font-mono"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="navy">{awbCount.toLocaleString()} AWB</Badge>

            <Button
              className="ml-auto"
              onClick={run}
              loading={busy}
              disabled={busy || awbCount === 0}
            >
              {busy ? 'गिनती…' : 'गिनती करो'}
            </Button>
          </div>

          {error && <Alert tone="error">{error}</Alert>}
          {stamp && !error && (
            <Alert tone={stamp.found === 0 ? 'error' : 'success'}>
              {stamp.found === 0
                ? 'नहीं मिला'
                : `${stamp.found.toLocaleString()} / ${stamp.requested.toLocaleString()} · CSV ✓`}
            </Alert>
          )}
          {!error && !stamp && (
            <p className="text-sm italic text-gray-500">CSV अपने आप download होगी।</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

/* ───── helpers ───── */

function csvCell(v: any): string {
  if (v === null || v === undefined) return '';
  const s = v instanceof Date ? v.toISOString() : String(v);
  const escaped = s.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function ts(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours(),
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
