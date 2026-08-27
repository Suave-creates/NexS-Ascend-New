'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiDownload, FiLock, FiMapPin, FiRefreshCw, FiTarget, FiUnlock } from 'react-icons/fi';
import {
  Alert, Badge, Button, Card, CardBody, CardHeader, Field, Input, PageHeader,
  Table, TBody, TD, TH, THead, TR, Textarea,
} from '@/components/ui';

type Mode = 'SCAN' | 'PLACEMENT';
type ScanItem = {
  pid: string;
  barcode: string;
  status: string;
  condition: string;
  availability: string;
  nexs_location: string | null;
  current_location: string;
  tote_id: string | null;
  tote_number: number | null;
  partition: number | null;
  bucket: 'GOOD' | 'BAD' | 'SYNC_ISSUE' | 'LOST';
  bin_name: string | null;
  mode: string;
  scanned_at: string;
};

async function postApi(body: Record<string, unknown>) {
  const response = await fetch('/api/asrs/pid-hunter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'PID Hunter request failed');
  return payload;
}

function parseTargets(raw: string) {
  return new Set(raw.split(/[\s,]+/).map((value) => value.trim()).filter(Boolean));
}

function bucketTone(bucket: ScanItem['bucket']): 'good' | 'danger' | 'notice' | 'gold' {
  if (bucket === 'GOOD') return 'good';
  if (bucket === 'BAD') return 'danger';
  if (bucket === 'SYNC_ISSUE') return 'notice';
  return 'gold';
}

function exportCsv(items: ScanItem[], mode: Mode) {
  const rows = [
    ['Barcode', 'PID', 'Bucket', 'Status', 'Condition', 'Availability', 'NexS Location', 'Placement', 'Scanned At'],
    ...items.map((item) => [item.barcode, item.pid, item.bucket, item.status, item.condition, item.availability, item.nexs_location || '', item.current_location, item.scanned_at]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `pid-hunter-${mode.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PidHunterDashboard({ mode }: { mode: Mode }) {
  const [toteInput, setToteInput] = useState('');
  const [partition, setPartition] = useState('1');
  const [locked, setLocked] = useState<{ toteId: string; toteNumber: number; partition: number } | null>(null);
  const [barcode, setBarcode] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [targets, setTargets] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<ScanItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  const loadRecent = useCallback(async () => {
    try {
      const payload = await postApi({ action: 'recent', mode });
      setItems(payload.items || []);
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    }
  }, [mode]);

  useEffect(() => { void loadRecent(); }, [loadRecent]);

  async function lockTote(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const selectedPartition = Number(partition);
      if (![1, 2, 3, 4].includes(selectedPartition)) throw new Error('Partition must be between 1 and 4');
      const payload = await postApi({ action: 'resolve-tote', toteId: toteInput.trim().toUpperCase() });
      setLocked({ ...payload.tote, partition: selectedPartition });
      setMessage({ tone: 'success', text: `Locked ${payload.tote.toteId} at ${payload.tote.toteNumber}-${selectedPartition}` });
      setTimeout(() => barcodeRef.current?.focus(), 0);
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function submitScan(event: FormEvent) {
    event.preventDefault();
    if (!barcode.trim()) return;
    setBusy(true);
    setMessage(null);
    try {
      const payload = await postApi({
        action: 'scan',
        mode,
        barcode,
        toteId: locked?.toteId,
        toteNumber: locked?.toteNumber,
        partition: locked?.partition,
      });
      const item = payload.item as ScanItem;
      setItems((previous) => [item, ...previous].slice(0, 200));
      setBarcode('');
      const matched = targets.has(item.pid);
      setMessage({
        tone: matched ? 'success' : item.bucket === 'GOOD' ? 'info' : 'error',
        text: matched ? `Target PID ${item.pid} matched at ${item.current_location}` : `${item.bucket.replace('_', ' ')}: ${item.current_location}`,
      });
      setTimeout(() => barcodeRef.current?.focus(), 0);
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
      setBarcode('');
      setTimeout(() => barcodeRef.current?.focus(), 0);
    } finally {
      setBusy(false);
    }
  }

  const subtitle = mode === 'SCAN'
    ? 'Scan into a locked tote partition; exception inventory is routed to its assigned bin.'
    : 'Scan inventory and automatically place matching PIDs together or use the next free partition.';

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="PID HUNTER"
        subtitle={subtitle}
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm" aria-label="PID Hunter mode">
              <Link href="/asrs/pid-hunter" className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === 'SCAN' ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Scan</Link>
              <Link href="/asrs/pid-hunter-placement" className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === 'PLACEMENT' ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Placement</Link>
            </div>
            <Button variant="outline" onClick={() => exportCsv(items, mode)} disabled={!items.length} title="Export scan log">
              <FiDownload /> Export
            </Button>
          </div>
        )}
      />

      {message && <Alert tone={message.tone} className="mb-5">{message.text}</Alert>}

      <div className="grid min-w-0 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          {mode === 'SCAN' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 font-semibold text-gray-900"><FiMapPin /> Scan location</div>
                <Badge tone={locked ? 'good' : 'gray'}>{locked ? 'LOCKED' : 'UNLOCKED'}</Badge>
              </CardHeader>
              <CardBody>
                {locked ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-good-600/30 bg-good-50 p-4 text-center">
                      <div className="font-mono text-lg font-bold text-good-600">{locked.toteId}</div>
                      <div className="mt-1 text-sm text-gray-600">Tote {locked.toteNumber}, partition {locked.partition}</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setLocked(null)}><FiUnlock /> Change location</Button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={lockTote}>
                    <Field label="Tote ID" htmlFor="tote-id"><Input id="tote-id" value={toteInput} onChange={(e) => setToteInput(e.target.value)} placeholder="TL0000005572" autoComplete="off" /></Field>
                    <Field label="Partition" htmlFor="partition">
                      <select id="partition" value={partition} onChange={(e) => setPartition(e.target.value)} className="block h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
                        {[1, 2, 3, 4].map((number) => <option key={number} value={number}>Partition {number}</option>)}
                      </select>
                    </Field>
                    <Button className="w-full" loading={busy}><FiLock /> Resolve and lock</Button>
                  </form>
                )}
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader><div className="flex items-center gap-2 font-semibold text-gray-900"><FiTarget /> Target PIDs</div></CardHeader>
            <CardBody className="space-y-3">
              <Textarea value={targetInput} onChange={(e) => setTargetInput(e.target.value)} placeholder="Enter PIDs separated by spaces, commas, or lines" />
              <Button variant="outline" className="w-full" onClick={() => setTargets(parseTargets(targetInput))}>Load {parseTargets(targetInput).size} targets</Button>
              {targets.size > 0 && <div className="text-sm text-gray-500">{targets.size} active targets</div>}
            </CardBody>
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader>
              <div className="font-semibold text-gray-900">Barcode scanner</div>
              {mode === 'PLACEMENT' && <Badge tone="navy">AUTO PLACEMENT</Badge>}
            </CardHeader>
            <CardBody>
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submitScan}>
                <Input ref={barcodeRef} value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Scan barcode" autoFocus={mode === 'PLACEMENT'} autoComplete="off" className="h-12 flex-1 font-mono text-base" />
                <Button size="lg" loading={busy} disabled={mode === 'SCAN' && !locked}>Scan</Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="font-semibold text-gray-900">Recent scan log</div>
              <Button size="sm" variant="ghost" onClick={loadRecent} title="Refresh scan log"><FiRefreshCw /></Button>
            </CardHeader>
            <CardBody className="p-0">
              <Table className="border-0">
                <THead><TR><TH>Barcode</TH><TH>PID</TH><TH>Bucket</TH><TH>Status</TH><TH>Placement</TH><TH>Scanned</TH></TR></THead>
                <TBody>
                  {items.length === 0 && <TR><TD colSpan={6} className="py-10 text-center text-gray-500">No scans in this mode yet.</TD></TR>}
                  {items.map((item, index) => (
                    <TR key={`${item.barcode}-${item.scanned_at}-${index}`} tone={item.bucket === 'BAD' ? 'danger' : targets.has(item.pid) ? 'gold' : undefined}>
                      <TD className="font-mono text-xs font-semibold">{item.barcode}</TD>
                      <TD className="font-mono text-xs text-brand-700">{item.pid}</TD>
                      <TD><Badge tone={bucketTone(item.bucket)}>{item.bucket.replace('_', ' ')}</Badge></TD>
                      <TD className="text-xs">{item.status || '-'}</TD>
                      <TD className="font-mono text-xs">{item.current_location}</TD>
                      <TD className="whitespace-nowrap text-xs">{new Date(item.scanned_at).toLocaleString()}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
