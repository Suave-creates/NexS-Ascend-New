'use client';

import { useState } from 'react';
import { Modal, Field, Input, Button, Alert } from '@/components/ui';
import { validateProduct } from '@/services/metal-frame/tumbling/validators';
import { formatDuration, formatFullDateTime } from '../_lib/format';

interface ProductDraft {
  pid: string;
  sheetCode: string;
  modelNumber: string;
  additionalReference: string;
}

function blankDraft(): ProductDraft {
  return { pid: '', sheetCode: '', modelNumber: '', additionalReference: '' };
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  additionalFieldLabel: string;
  operatorName: string;
  containerId: number;
  stationLabel: string;
  durationMinutes: number;
  onSaved: () => void;
}

/** One container = one product per tumbling process. */
export function ProductFormModal({
  open,
  onClose,
  additionalFieldLabel,
  operatorName,
  containerId,
  stationLabel,
  durationMinutes,
  onSaved,
}: ProductFormModalProps) {
  const [draft, setDraft] = useState<ProductDraft>(blankDraft());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function reset() {
    setDraft(blankDraft());
    setError(null);
    setSubmitting(false);
    setConfirming(false);
  }

  function handleClose() {
    if (submitting) return;
    reset();
    onClose();
  }

  function update(field: keyof ProductDraft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function validated() {
    return validateProduct(draft);
  }

  async function saveDraft() {
    setSubmitting(true);
    setError(null);
    try {
      const product = validated();
      const res = await fetch('/api/metal-frame/tumbling/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ containerId, product, operatorName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save the draft.');
      onSaved();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save the draft.');
    } finally {
      setSubmitting(false);
    }
  }

  function reviewBeforeStart() {
    try {
      validated();
      setError(null);
      setConfirming(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please check the product fields.');
    }
  }

  async function confirmAndStart() {
    setSubmitting(true);
    setError(null);
    try {
      const product = validated();
      const createRes = await fetch('/api/metal-frame/tumbling/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ containerId, product, operatorName }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error || 'Failed to create the process.');

      const startRes = await fetch(`/api/metal-frame/tumbling/processes/${createJson.process.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorName }),
      });
      const startJson = await startRes.json();
      if (!startRes.ok) throw new Error(startJson.error || 'Failed to start the process.');

      onSaved();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start the process.');
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  if (confirming) {
    const expected = new Date(Date.now() + durationMinutes * 60_000);
    return (
      <Modal open={open} onClose={handleClose} size="md">
        <h2 className="text-lg font-bold text-gray-900">Confirm Tumbling Process</h2>
        <p className="mt-3 text-sm text-gray-600">
          You are starting a {formatDuration(durationMinutes * 60_000)} tumbling process for PID{' '}
          <span className="font-semibold">{draft.pid}</span> in <span className="font-semibold">{stationLabel}</span>.
          Expected completion: <span className="font-semibold">{formatFullDateTime(expected)}</span>.
        </p>
        {error && <Alert tone="error" className="mt-3">{error}</Alert>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirming(false)} disabled={submitting}>
            Back
          </Button>
          <Button variant="primary" onClick={confirmAndStart} loading={submitting}>
            Confirm &amp; Start Process
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <h2 className="text-lg font-bold text-gray-900">Add Product</h2>
      <p className="mt-1 text-sm text-gray-500">{stationLabel} — one product per tumbling process</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="PID">
          <Input
            value={draft.pid}
            onChange={(e) => update('pid', e.target.value)}
            placeholder="Scan or type PID"
            autoFocus
          />
        </Field>
        <Field label="Sheet Code">
          <Input value={draft.sheetCode} onChange={(e) => update('sheetCode', e.target.value)} />
        </Field>
        <Field label="Model Number">
          <Input value={draft.modelNumber} onChange={(e) => update('modelNumber', e.target.value)} />
        </Field>
        <Field label={additionalFieldLabel}>
          <Input value={draft.additionalReference} onChange={(e) => update('additionalReference', e.target.value)} />
        </Field>
      </div>

      {error && <Alert tone="error" className="mt-3">{error}</Alert>}

      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        <Button variant="outline" onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={saveDraft} loading={submitting}>
          Save Draft
        </Button>
        <Button variant="primary" onClick={reviewBeforeStart} disabled={submitting}>
          Review &amp; Start Process
        </Button>
      </div>
    </Modal>
  );
}
