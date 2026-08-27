'use client';

import { FormEvent, useCallback, useState } from 'react';
import { FiLock, FiMove, FiRefreshCw, FiShield } from 'react-icons/fi';
import {
  Alert, Badge, Button, Card, CardBody, CardHeader, Field, Input, PageHeader,
  Table, TBody, TD, TH, THead, TR,
} from '@/components/ui';

type ToteOverview = {
  toteNumber: number;
  toteId: string;
  partitions: number[];
  total: number;
};

async function postApi(body: Record<string, unknown>) {
  const response = await fetch('/api/asrs/pid-hunter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Compaction request failed');
  return payload;
}

function PartitionSelect({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="block h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
      {[1, 2, 3, 4].map((number) => <option key={number} value={number}>Partition {number}</option>)}
    </select>
  );
}

export default function PidHunterCompactionPage() {
  const [passwordInput, setPasswordInput] = useState('');
  const [password, setPassword] = useState('');
  const [totes, setTotes] = useState<ToteOverview[]>([]);
  const [sourceTote, setSourceTote] = useState('');
  const [sourcePartition, setSourcePartition] = useState('1');
  const [destinationTote, setDestinationTote] = useState('');
  const [destinationPartition, setDestinationPartition] = useState('1');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);

  const loadOverview = useCallback(async (secret: string) => {
    const payload = await postApi({ action: 'overview', password: secret });
    setTotes(payload.totes || []);
  }, []);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await postApi({ action: 'unlock', password: passwordInput });
      await loadOverview(passwordInput);
      setPassword(passwordInput);
      setPasswordInput('');
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function moveItems(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const payload = await postApi({
        action: 'compact',
        password,
        sourceToteNumber: Number(sourceTote),
        sourcePartition: Number(sourcePartition),
        destinationToteNumber: Number(destinationTote),
        destinationPartition: Number(destinationPartition),
      });
      await loadOverview(password);
      const inventoryMoved = Number(payload.inventoryMoved ?? payload.moved ?? 0);
      setMessage({
        tone: 'success',
        text: `${payload.moved} barcode${payload.moved === 1 ? '' : 's'} moved; ${inventoryMoved} active inventory record${inventoryMoved === 1 ? '' : 's'} updated in the database.`,
      });
      setSourceTote('');
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  if (!password) {
    return (
      <div className="mx-auto max-w-lg pt-10">
        <Card>
          <CardHeader><div className="flex items-center gap-2 font-semibold text-gray-900"><FiShield /> PID Hunter Compaction</div></CardHeader>
          <CardBody>
            {message && <Alert tone={message.tone} className="mb-4">{message.text}</Alert>}
            <form className="space-y-4" onSubmit={unlock}>
              <Field label="Compaction password" htmlFor="compaction-password">
                <Input id="compaction-password" type="password" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} autoFocus autoComplete="current-password" />
              </Field>
              <Button className="w-full" loading={busy}><FiLock /> Unlock compaction</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="PID Hunter Compaction"
        subtitle="Move every barcode between tote partitions in active inventory while retaining the complete audit history."
        actions={<Button variant="outline" onClick={() => void loadOverview(password)} disabled={busy} title="Refresh overview"><FiRefreshCw /> Refresh</Button>}
      />
      {message && <Alert tone={message.tone} className="mb-5">{message.text}</Alert>}

      <div className="grid min-w-0 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="self-start">
          <CardHeader><div className="flex items-center gap-2 font-semibold text-gray-900"><FiMove /> Move partition</div><Badge tone="danger">PROTECTED</Badge></CardHeader>
          <CardBody>
            <form className="space-y-5" onSubmit={moveItems}>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-3 text-sm font-semibold text-gray-900">Source</div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tote number" htmlFor="source-tote"><Input id="source-tote" type="number" min="1" value={sourceTote} onChange={(event) => setSourceTote(event.target.value)} required /></Field>
                  <Field label="Partition"><PartitionSelect id="source-partition" value={sourcePartition} onChange={setSourcePartition} /></Field>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-3 text-sm font-semibold text-gray-900">Destination</div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tote number" htmlFor="destination-tote"><Input id="destination-tote" type="number" min="1" value={destinationTote} onChange={(event) => setDestinationTote(event.target.value)} required /></Field>
                  <Field label="Partition"><PartitionSelect id="destination-partition" value={destinationPartition} onChange={setDestinationPartition} /></Field>
                </div>
              </div>
              <Button className="w-full" loading={busy}><FiMove /> Move current barcodes</Button>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0">
          <CardHeader><div className="font-semibold text-gray-900">Tote occupancy</div><Badge tone="navy">LATEST BARCODE STATE</Badge></CardHeader>
          <CardBody className="p-0">
            <Table className="border-0">
              <THead><TR><TH>Tote #</TH><TH>Tote ID</TH><TH className="text-right">Partition 1</TH><TH className="text-right">Partition 2</TH><TH className="text-right">Partition 3</TH><TH className="text-right">Partition 4</TH><TH className="text-right">Total</TH></TR></THead>
              <TBody>
                {totes.length === 0 && <TR><TD colSpan={7} className="py-10 text-center text-gray-500">No active totes found.</TD></TR>}
                {totes.map((tote) => (
                  <TR key={tote.toteNumber}>
                    <TD className="font-semibold text-brand-700">{tote.toteNumber}</TD>
                    <TD className="font-mono text-xs">{tote.toteId}</TD>
                    {tote.partitions.map((count, index) => <TD key={index} className="text-right tabular-nums">{count || '-'}</TD>)}
                    <TD className="text-right font-bold tabular-nums">{tote.total}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
