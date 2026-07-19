'use client';

import { useState } from 'react';
import { Modal, Field, Input, Select, Textarea, Button, Alert } from '@/components/ui';
import { STOP_REASONS, EARLY_COMPLETION_REASONS } from '@/services/metal-frame/tumbling/validators';

interface AuthorizationModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'EARLY' | 'STOP';
  processId: number;
  operatorName: string;
  onSuccess: () => void;
}

const REASONS = { EARLY: EARLY_COMPLETION_REASONS, STOP: STOP_REASONS } as const;
const ENDPOINT = { EARLY: 'complete-early', STOP: 'stop' } as const;
const TITLE = { EARLY: 'Authorize Early Completion', STOP: 'Authorize Stop Process' } as const;
const SUBMIT_LABEL = { EARLY: 'Authorize and Complete Early', STOP: 'Authorize and Stop Process' } as const;

export function AuthorizationModal({ open, onClose, mode, processId, operatorName, onSuccess }: AuthorizationModalProps) {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [destructiveConfirmed, setDestructiveConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setEmployeeCode('');
    setPassword('');
    setReason('');
    setRemarks('');
    setConfirmed(false);
    setDestructiveConfirmed(false);
    setError(null);
    setSubmitting(false);
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  async function submit() {
    if (!employeeCode.trim() || !password || !reason || !confirmed || (mode === 'STOP' && !destructiveConfirmed)) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/metal-frame/tumbling/processes/${processId}/${ENDPOINT[mode]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeCode: employeeCode.trim(), password, reason, remarks, operatorName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Authorization failed.');
      onSuccess();
      reset();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authorization failed.');
    } finally {
      // Password is never retained after a submit attempt, successful or not.
      setPassword('');
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const canSubmit = employeeCode.trim() && password && reason && confirmed && (mode !== 'STOP' || destructiveConfirmed);

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <h2 className="text-lg font-bold text-gray-900">{TITLE[mode]}</h2>
      <p className="mt-1 text-sm text-gray-500">Requires a Supervisor or Administrator credential.</p>

      <div className="mt-4 space-y-3">
        <Field label="Authorized User ID">
          <Input value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} placeholder="Employee code" autoFocus />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
        </Field>
        <Field label={mode === 'EARLY' ? 'Reason for Early Completion' : 'Reason for Stop'}>
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select a reason…</option>
            {REASONS[mode].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Remarks (optional)">
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Additional context for the audit log" />
        </Field>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" className="mt-0.5" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          I confirm I am authorized to perform this action and the details above are accurate.
        </label>

        {mode === 'STOP' && (
          <label className="flex items-start gap-2 text-sm font-medium text-danger-600">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={destructiveConfirmed}
              onChange={(e) => setDestructiveConfirmed(e.target.checked)}
            />
            This will immediately stop tumbling and cannot be undone. I understand the products will not complete a full cycle.
          </label>
        )}
      </div>

      {error && <Alert tone="error" className="mt-3">{error}</Alert>}

      <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
        <Button variant="outline" onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant={mode === 'STOP' ? 'danger' : 'primary'} onClick={submit} loading={submitting} disabled={!canSubmit}>
          {SUBMIT_LABEL[mode]}
        </Button>
      </div>
    </Modal>
  );
}
