'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader, Alert, Card, CardHeader, CardBody, Field, Input, Button, Table, THead, TBody, TR, TH, TD } from '@/components/ui';

interface ContainerRow {
  id: number;
  stationNumber: number;
  side: 'LEFT' | 'RIGHT';
  displayName: string;
  isActive: boolean;
}

export default function TumblingSettingsPage() {
  const [containers, setContainers] = useState<ContainerRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');

  const [configDraft, setConfigDraft] = useState({ defaultDurationMinutes: '', nearCompletionThresholdMinutes: '' });
  const [containerDrafts, setContainerDrafts] = useState<Record<number, { displayName: string; isActive: boolean }>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [containersRes, configRes] = await Promise.all([
        fetch('/api/metal-frame/tumbling/containers'),
        fetch('/api/metal-frame/tumbling/configuration'),
      ]);
      const containersJson = await containersRes.json();
      const configJson = await configRes.json();
      if (!containersRes.ok) throw new Error(containersJson.error || 'Failed to load containers.');
      if (!configRes.ok) throw new Error(configJson.error || 'Failed to load configuration.');

      setContainers(containersJson.containers);
      setConfigDraft({
        defaultDurationMinutes: String(configJson.config.defaultDurationMinutes),
        nearCompletionThresholdMinutes: String(configJson.config.nearCompletionThresholdMinutes),
      });
      setContainerDrafts(
        Object.fromEntries(
          (containersJson.containers as ContainerRow[]).map((c) => [c.id, { displayName: c.displayName, isActive: c.isActive }]),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function requireCredentials(): boolean {
    if (!employeeCode.trim() || !password) {
      setError('Enter your Administrator ID and password above before saving.');
      return false;
    }
    return true;
  }

  async function saveConfig() {
    if (!requireCredentials()) return;
    setSavingKey('config');
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/metal-frame/tumbling/configuration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCode: employeeCode.trim(),
          password,
          defaultDurationMinutes: Number(configDraft.defaultDurationMinutes),
          nearCompletionThresholdMinutes: Number(configDraft.nearCompletionThresholdMinutes),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save configuration.');
      setSuccess('Configuration saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save configuration.');
    } finally {
      setSavingKey(null);
      setPassword('');
    }
  }

  async function saveContainer(containerId: number) {
    if (!requireCredentials()) return;
    const draft = containerDrafts[containerId];
    if (!draft) return;
    setSavingKey(String(containerId));
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/metal-frame/tumbling/containers/${containerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeCode: employeeCode.trim(), password, displayName: draft.displayName, isActive: draft.isActive }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save container.');
      setContainers((prev) => prev!.map((c) => (c.id === containerId ? { ...c, ...json.container } : c)));
      setSuccess('Saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save container.');
    } finally {
      setSavingKey(null);
      setPassword('');
    }
  }

  return (
    <div>
      <PageHeader
        title="Tumbling — Settings"
        subtitle="Every save below re-verifies your credentials against the portal login."
        actions={
          <Link href="/metal-frame/tumbling/admin-users" className="text-xs font-medium text-brand-700 hover:underline">
            Manage login accounts →
          </Link>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <span className="font-semibold text-gray-800">Authorized Credentials</span>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Employee Code">
            <Input value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} placeholder="Employee code" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
          </Field>
        </CardBody>
      </Card>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {success && <Alert tone="success" className="mb-4">{success}</Alert>}

      <Card className="mb-6">
        <CardHeader>
          <span className="font-semibold text-gray-800">Process Defaults</span>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Default Duration (minutes)" hint="Applies to new processes only; history is unaffected">
            <Input
              type="number"
              min={1}
              value={configDraft.defaultDurationMinutes}
              onChange={(e) => setConfigDraft((d) => ({ ...d, defaultDurationMinutes: e.target.value }))}
            />
          </Field>
          <Field label="Completing Soon Threshold (minutes)">
            <Input
              type="number"
              min={1}
              value={configDraft.nearCompletionThresholdMinutes}
              onChange={(e) => setConfigDraft((d) => ({ ...d, nearCompletionThresholdMinutes: e.target.value }))}
            />
          </Field>
          <div className="sm:col-span-2">
            <Button onClick={saveConfig} loading={savingKey === 'config'}>
              Save Process Defaults
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-semibold text-gray-800">Containers</span>
        </CardHeader>
        <CardBody>
          {!containers ? (
            <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Station</TH>
                  <TH>Side</TH>
                  <TH>Display Name</TH>
                  <TH>Active</TH>
                  <TH />
                </TR>
              </THead>
              <TBody>
                {containers.map((container) => {
                  const draft = containerDrafts[container.id] ?? { displayName: container.displayName, isActive: container.isActive };
                  return (
                    <TR key={container.id}>
                      <TD className="font-medium">Station {String(container.stationNumber).padStart(2, '0')}</TD>
                      <TD>{container.side === 'LEFT' ? 'Left' : 'Right'}</TD>
                      <TD>
                        <Input
                          value={draft.displayName}
                          onChange={(e) =>
                            setContainerDrafts((prev) => ({ ...prev, [container.id]: { ...draft, displayName: e.target.value } }))
                          }
                        />
                      </TD>
                      <TD>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={draft.isActive}
                            onChange={(e) =>
                              setContainerDrafts((prev) => ({ ...prev, [container.id]: { ...draft, isActive: e.target.checked } }))
                            }
                          />
                          {draft.isActive ? 'Active' : 'Inactive'}
                        </label>
                      </TD>
                      <TD>
                        <Button size="sm" variant="outline" onClick={() => saveContainer(container.id)} loading={savingKey === String(container.id)}>
                          Save
                        </Button>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
