'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, CardBody, Field, Input, Label, PageHeader, Textarea } from '@/components/ui';
import { syncAutoQcDump } from './nexsDump';

type Status = {
  runId?: string | null; credentialsVerified?: boolean; sessionReady?: boolean; sessionUsername?: string | null;
  running: boolean; total: number; completed: number; failed: number; current: string | null; message: string;
};

export default function QcAutoPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shippingPackageIds, setShippingPackageIds] = useState('');
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [dumpMessage, setDumpMessage] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [dumpProgress, setDumpProgress] = useState({ loaded: 0, total: 0, page: 0 });
  const dumpBusy = useRef(false);

  const packageCount = new Set(shippingPackageIds.split(/[\r\n,]+/).map(value => value.trim()).filter(Boolean)).size;
  const reusableSession = !!status?.sessionReady && (!username || status.sessionUsername === username);

  const loadStatus = useCallback(async (id?: string | null) => {
    const suffix = id ? `?runId=${encodeURIComponent(id)}` : '';
    const response = await fetch(`/api/cl-cls/qc-auto${suffix}`, { cache: 'no-store' });
    const next = await response.json();
    setStatus(next);
    if (!username && next.sessionUsername) setUsername(next.sessionUsername);
  }, [username]);

  useEffect(() => { void loadStatus(runId); }, [loadStatus, runId]);
  useEffect(() => {
    if (!runId) return;
    const id = setInterval(() => void loadStatus(runId), 1500);
    return () => clearInterval(id);
  }, [loadStatus, runId]);

  const refreshDump = useCallback(async (force: boolean) => {
    if (dumpBusy.current) return;
    dumpBusy.current = true;
    setError(''); setDumpMessage(''); setDumpProgress({ loaded: 0, total: 0, page: 0 }); setSyncing(true);
    try {
      const result = await syncAutoQcDump(setDumpProgress, force);
      setLastSyncedAt(result.lastSuccessfulAt || null);
      setDumpMessage(`Database refreshed: ${result.stored}/${result.total} rows · ${result.removed} old removed`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      dumpBusy.current = false; setSyncing(false);
    }
  }, []);

  useEffect(() => {
    void refreshDump(false);
    const id = setInterval(() => void refreshDump(false), 5 * 60_000);
    return () => clearInterval(id);
  }, [refreshDump]);

  async function start() {
    setError('');
    const response = await fetch('/api/cl-cls/qc-auto', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, shippingPackageIds }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'Could not start QC');
    else { setPassword(''); setStatus(data); setRunId(data.runId); }
  }

  return <div className="mx-auto max-w-xl space-y-5">
    <PageHeader title="CL / CLS Auto Order QC" subtitle="Combined dump → automatic barcode QC" />
    <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-gray-600">Automatic refresh every 5 minutes</div>
          <div className="text-xs text-gray-500">Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Not yet'}</div>
        </div>
        <Button onClick={() => void refreshDump(true)} loading={syncing} disabled={syncing}>Sync now</Button>
      </div>
      {syncing && <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600"><span>{dumpProgress.loaded.toLocaleString()} line items loaded</span><span>{dumpProgress.total ? `${dumpProgress.total.toLocaleString()} total` : `page ${dumpProgress.page}`}</span></div>
        <div className="h-2 overflow-hidden rounded bg-gray-200"><div className="h-full bg-blue-500 transition-all" style={{ width: dumpProgress.total ? `${Math.min(100, (dumpProgress.loaded / dumpProgress.total) * 100)}%` : '8%' }} /></div>
      </div>}
      {dumpMessage && <div className="text-xs text-emerald-700">{dumpMessage}</div>}
    </div>
    <Card><CardBody className="space-y-4">
      <Field><Label>Employee code</Label><Input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /></Field>
      <Field><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder={reusableSession ? 'Saved in active QC session' : ''} /></Field>
      {reusableSession && <Alert tone="success">QC browser session is active. Password is not required again.</Alert>}
      <Field><Label>Shipping Package IDs</Label><Textarea className="min-h-[140px] font-mono" placeholder={'SNXS1270000005447002\nSNXS1270000005447003'} value={shippingPackageIds} onChange={e => setShippingPackageIds(e.target.value)} spellCheck={false} /></Field>
      <div className="text-xs text-gray-500">{packageCount} unique package{packageCount === 1 ? '' : 's'} · one per line or comma-separated</div>
      <Button className="w-full" onClick={start} loading={status?.running} disabled={!username || (!password && !reusableSession) || packageCount === 0 || status?.running}>QC selected packages</Button>
      <p className="text-xs text-gray-500">The authenticated browser and password stay only in server memory for fast subsequent runs. Nothing is written to disk.</p>
    </CardBody></Card>
    {error && <Alert tone="error">{error}</Alert>}
    {status && <Card><CardBody className="space-y-3">
      <div className="flex flex-wrap gap-2"><Badge tone={status.running ? 'amber' : 'navy'}>{status.running ? 'Running' : 'Idle'}</Badge><Badge tone="good">{status.completed} completed</Badge>{status.failed > 0 && <Badge tone="danger">{status.failed} failed</Badge>}</div>
      {status.credentialsVerified && <Alert tone="success">QC session verified successfully.</Alert>}
      <div className="text-sm font-medium">{status.message}</div>
      {status.current && <div className="font-mono text-xs text-gray-600">{status.current}</div>}
      {status.total > 0 && <div className="h-2 overflow-hidden rounded bg-gray-200"><div className="h-full bg-emerald-500" style={{ width: `${Math.round(((status.completed + status.failed) / status.total) * 100)}%` }} /></div>}
    </CardBody></Card>}
  </div>;
}
