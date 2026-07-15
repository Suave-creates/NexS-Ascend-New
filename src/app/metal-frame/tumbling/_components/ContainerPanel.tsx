'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { Card, CardHeader, CardBody, Button, Alert, Modal } from '@/components/ui';
import { cn } from '@/lib/cn';
import { computeProgress } from '@/services/metal-frame/tumbling/progress.service';
import type { StationContainerPanelDto, TumblingConfigValuesDto } from '@/services/metal-frame/tumbling/types';
import { containerStatusStyle } from '../_lib/statusStyles';
import { formatClockTime, formatDuration, formatFullDateTime } from '../_lib/format';
import { ProgressBar } from './ProgressBar';
import { ProcessTimeline } from './ProcessTimeline';
import { ProductFormModal } from './ProductFormModal';
import { AuthorizationModal } from './AuthorizationModal';

type EffectiveStatus = 'AVAILABLE' | 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'STOPPED' | 'INACTIVE';

function deriveStatus(panel: StationContainerPanelDto): EffectiveStatus {
  const p = panel.process;
  if (p && (p.status === 'DRAFT' || p.status === 'RUNNING')) return p.status;
  if (!panel.isActive) return 'INACTIVE';
  if (p && p.status === 'STOPPED') return 'STOPPED';
  if (p && (p.status === 'COMPLETED' || p.status === 'COMPLETED_EARLY')) return 'COMPLETED';
  return 'AVAILABLE';
}

export function ContainerPanel({
  stationLabel,
  panel,
  config,
  operatorName,
  now,
  onRefresh,
}: {
  stationLabel: string;
  panel: StationContainerPanelDto;
  config: TumblingConfigValuesDto;
  operatorName: string;
  now: Date;
  onRefresh: () => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'start' | 'cancel' | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'EARLY' | 'STOP' | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const status = deriveStatus(panel);
  const style = containerStatusStyle(status);
  const process = panel.process;
  const sideLabel = panel.side === 'LEFT' ? 'Left Container' : 'Right Container';
  const fullLabel = `${stationLabel} — ${sideLabel}`;

  const liveProgress = process
    ? computeProgress({
        status: process.status,
        startedAt: process.startedAt ? new Date(process.startedAt) : null,
        expectedCompletionAt: process.expectedCompletionAt ? new Date(process.expectedCompletionAt) : null,
        completedAt: process.completedAt ? new Date(process.completedAt) : null,
        stoppedAt: process.stoppedAt ? new Date(process.stoppedAt) : null,
        durationMinutes: process.durationMinutes,
        now,
        nearCompletionThresholdMinutes: config.nearCompletionThresholdMinutes,
      })
    : null;

  async function runConfirmedAction() {
    if (!process || !confirmAction) return;
    setActionBusy(true);
    setActionError(null);
    try {
      const endpoint = confirmAction === 'start' ? 'start' : 'cancel';
      const res = await fetch(`/api/metal-frame/tumbling/processes/${process.id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Action failed.');
      setConfirmAction(null);
      onRefresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Action failed.');
    } finally {
      setActionBusy(false);
    }
  }

  const StyleIcon = style.icon;

  return (
    <Card className={cn(status === 'STOPPED' && 'border-danger-200')}>
      <CardHeader>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{sideLabel}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <StyleIcon className="h-4 w-4" aria-hidden="true" />
            {style.label}
          </div>
        </div>
        {process && <span className="text-xs text-gray-400">{process.processCode}</span>}
      </CardHeader>

      <CardBody className="space-y-4">
        {actionError && <Alert tone="error">{actionError}</Alert>}

        {status === 'INACTIVE' && <p className="text-sm text-gray-500">This container is currently deactivated.</p>}

        {status === 'AVAILABLE' && (
          <>
            <p className="text-sm text-gray-500">Ready for a new tumbling process.</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddModal(true)}>Add Product</Button>
              <Link href={`/metal-frame/tumbling/processes?containerId=${panel.containerId}`}>
                <Button variant="outline">View History</Button>
              </Link>
            </div>
          </>
        )}

        {(status === 'DRAFT' || status === 'RUNNING') && process && (
          <>
            {status === 'RUNNING' && liveProgress && (
              <div className="space-y-1.5">
                <ProgressBar percent={liveProgress.progressPercent} tone={liveProgress.isNearCompletion ? 'notice' : 'navy'} />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{Math.round(liveProgress.progressPercent)}% · {formatDuration(liveProgress.remainingMs)} remaining</span>
                  <span>
                    Started {formatClockTime(process.startedAt)} · Completes {formatClockTime(process.expectedCompletionAt)}
                  </span>
                </div>
              </div>
            )}
            {status === 'DRAFT' && <p className="text-sm text-gray-500">Draft — not started yet.</p>}

            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Product</div>
              <ul className="space-y-1">
                {process.products.map((p) => (
                  <li key={p.pid} className="rounded-lg bg-gray-50 px-3 py-1.5 text-sm">
                    <span className="truncate">
                      <span className="font-medium text-gray-800">{p.pid}</span>{' '}
                      <span className="text-gray-400">· {p.sheetCode} · {p.modelNumber}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {status === 'DRAFT' && (
                <>
                  <Button onClick={() => setConfirmAction('start')}>Start Process</Button>
                  <Button variant="ghost" onClick={() => setConfirmAction('cancel')}>
                    Cancel Draft
                  </Button>
                </>
              )}
              {status === 'RUNNING' && (
                <>
                  <Button variant="secondary" onClick={() => setAuthModalMode('EARLY')}>
                    Complete Early
                  </Button>
                  <Button variant="danger" onClick={() => setAuthModalMode('STOP')}>
                    Stop Process
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {(status === 'COMPLETED' || status === 'STOPPED') && process && liveProgress && (
          <>
            <div className="space-y-1.5">
              <ProgressBar percent={liveProgress.progressPercent} tone={status === 'STOPPED' ? 'danger' : 'good'} />
              <div className="text-xs text-gray-500">
                {process.products[0]?.pid} ·{' '}
                {status === 'STOPPED'
                  ? `Stopped at ${formatClockTime(process.stoppedAt)}`
                  : `${process.completionType === 'EARLY' ? 'Completed early' : 'Completed'} at ${formatClockTime(process.completedAt)}`}
              </div>
              {process.reason && <div className="text-xs text-gray-500">Reason: {process.reason}</div>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddModal(true)}>Start New Process</Button>
              <Link href={`/metal-frame/tumbling/processes?containerId=${panel.containerId}`}>
                <Button variant="outline">View History</Button>
              </Link>
            </div>
          </>
        )}

        {process && process.events && process.events.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={() => setShowTimeline((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
            >
              Timeline
              <FiChevronDown className={cn('h-4 w-4 transition-transform', showTimeline && 'rotate-180')} />
            </button>
            {showTimeline && (
              <div className="mt-3">
                <ProcessTimeline events={process.events} />
              </div>
            )}
          </div>
        )}
      </CardBody>

      <ProductFormModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        additionalFieldLabel={config.additionalFieldLabel}
        operatorName={operatorName}
        containerId={panel.containerId}
        stationLabel={fullLabel}
        durationMinutes={config.defaultDurationMinutes}
        onSaved={onRefresh}
      />

      {authModalMode && process && (
        <AuthorizationModal
          open
          onClose={() => setAuthModalMode(null)}
          mode={authModalMode}
          processId={process.id}
          operatorName={operatorName}
          onSuccess={onRefresh}
        />
      )}

      {confirmAction && process && (
        <Modal open onClose={() => (actionBusy ? undefined : setConfirmAction(null))} size="sm">
          <h2 className="text-base font-bold text-gray-900">
            {confirmAction === 'start' ? 'Start Tumbling Process' : 'Cancel Draft'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {confirmAction === 'start'
              ? `Start a ${formatDuration(process.durationMinutes * 60_000)} tumbling process for PID ${
                  process.products[0]?.pid
                } in ${fullLabel}. Expected completion: ${formatFullDateTime(new Date(now.getTime() + process.durationMinutes * 60_000))}.`
              : 'This will discard this draft. This cannot be undone.'}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmAction(null)} disabled={actionBusy}>
              Back
            </Button>
            <Button
              variant={confirmAction === 'cancel' ? 'danger' : 'primary'}
              onClick={runConfirmedAction}
              loading={actionBusy}
            >
              {confirmAction === 'start' ? 'Confirm & Start' : 'Confirm Cancel'}
            </Button>
          </div>
        </Modal>
      )}
    </Card>
  );
}
