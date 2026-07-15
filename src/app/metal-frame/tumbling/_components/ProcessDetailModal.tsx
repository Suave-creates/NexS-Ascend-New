'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import { Modal, Alert, Badge, Table, THead, TBody, TR, TH, TD } from '@/components/ui';
import { computeProgress } from '@/services/metal-frame/tumbling/progress.service';
import type { ProcessDetailDto, TumblingContainerSide } from '@/services/metal-frame/tumbling/types';
import { ProgressBar } from './ProgressBar';
import { ProcessTimeline } from './ProcessTimeline';
import { formatClockTime, formatDuration, formatFullDateTime, pluralize } from '../_lib/format';

interface ProcessDetailFull extends ProcessDetailDto {
  container: { stationNumber: number; side: TumblingContainerSide; displayName: string };
}

const POLL_INTERVAL_MS = 15_000;

const STATUS_TONE: Record<string, 'navy' | 'gold' | 'good' | 'danger' | 'gray'> = {
  DRAFT: 'gold',
  RUNNING: 'navy',
  COMPLETED: 'good',
  COMPLETED_EARLY: 'good',
  STOPPED: 'danger',
  CANCELLED: 'gray',
};

export function ProcessDetailModal({ processId, onClose }: { processId: number | null; onClose: () => void }) {
  const [process, setProcess] = useState<ProcessDetailFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const busyRef = useRef(false);
  const clockOffsetRef = useRef(0);

  const fetchDetail = useCallback(async () => {
    if (processId == null || busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await fetch(`/api/metal-frame/tumbling/processes/${processId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load this process.');
      clockOffsetRef.current = new Date(json.serverTime).getTime() - Date.now();
      setProcess(json.process);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load this process.');
    } finally {
      busyRef.current = false;
    }
  }, [processId]);

  useEffect(() => {
    if (processId == null) {
      setProcess(null);
      setError(null);
      return;
    }
    fetchDetail();
    const iv = setInterval(fetchDetail, POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [processId, fetchDetail]);

  useEffect(() => {
    if (processId == null) return;
    const iv = setInterval(() => setNow(new Date(Date.now() + clockOffsetRef.current)), 1000);
    return () => clearInterval(iv);
  }, [processId]);

  if (processId == null) return null;

  const liveProgress = process
    ? computeProgress({
        status: process.status,
        startedAt: process.startedAt ? new Date(process.startedAt) : null,
        expectedCompletionAt: process.expectedCompletionAt ? new Date(process.expectedCompletionAt) : null,
        completedAt: process.completedAt ? new Date(process.completedAt) : null,
        stoppedAt: process.stoppedAt ? new Date(process.stoppedAt) : null,
        durationMinutes: process.durationMinutes,
        now,
        nearCompletionThresholdMinutes: 60,
      })
    : null;

  const startedEvent = process?.events.find((e) => e.type === 'PROCESS_STARTED');
  const terminalEvent = process?.events.find((e) => e.type === 'PROCESS_COMPLETED_EARLY' || e.type === 'PROCESS_STOPPED');

  return (
    <Modal open onClose={onClose} size="lg" className="max-h-[85vh] overflow-y-auto">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-brand-700">{process?.processCode ?? 'Process'}</h2>
          {process && (
            <p className="mt-0.5 text-sm text-gray-500">
              Station {String(process.container.stationNumber).padStart(2, '0')} —{' '}
              {process.container.side === 'LEFT' ? 'Left Container' : 'Right Container'}
            </p>
          )}
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <Alert tone="error" className="mb-4">
          {error}
        </Alert>
      )}

      {!process ? (
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Badge tone={STATUS_TONE[process.status] ?? 'gray'}>{process.status.replace('_', ' ')}</Badge>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <FiRefreshCw className="h-3.5 w-3.5" /> {formatClockTime(now.toISOString())}
            </span>
          </div>

          {liveProgress && process.status !== 'DRAFT' && process.status !== 'CANCELLED' && (
            <div className="mb-4 space-y-2 rounded-2xl border border-gray-200 p-4">
              <ProgressBar
                percent={liveProgress.progressPercent}
                tone={process.status === 'STOPPED' ? 'danger' : liveProgress.isNearCompletion ? 'notice' : process.status === 'RUNNING' ? 'navy' : 'good'}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span>{Math.round(liveProgress.progressPercent)}% complete</span>
                {process.status === 'RUNNING' && <span>{formatDuration(liveProgress.remainingMs)} remaining</span>}
                <span>{pluralize(process.products.length, 'product')}</span>
              </div>
            </div>
          )}

          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoTile label="Duration" value={formatDuration(process.durationMinutes * 60_000)} />
            <InfoTile label="Start Time" value={process.startedAt ? formatFullDateTime(process.startedAt) : '—'} />
            <InfoTile label="Expected Completion" value={process.expectedCompletionAt ? formatFullDateTime(process.expectedCompletionAt) : '—'} />
            <InfoTile
              label="Actual Completion"
              value={process.completedAt ? formatFullDateTime(process.completedAt) : process.stoppedAt ? formatFullDateTime(process.stoppedAt) : '—'}
            />
            <InfoTile label="Started By" value={startedEvent?.by ?? process.startedByName ?? '—'} />
            <InfoTile label="Authorized By" value={terminalEvent?.authorizedBy ?? process.authorizedByName ?? '—'} />
            <InfoTile label="Reason" value={process.reason ?? '—'} />
          </div>

          {process.remarks && (
            <Alert tone="info" className="mb-4">
              {process.remarks}
            </Alert>
          )}

          <div className="mb-4">
            <div className="mb-2 text-sm font-semibold text-gray-800">Products ({process.products.length})</div>
            <Table>
              <THead>
                <TR>
                  <TH>PID</TH>
                  <TH>Sheet Code</TH>
                  <TH>Model Number</TH>
                  <TH>Additional Reference</TH>
                </TR>
              </THead>
              <TBody>
                {process.products.map((p) => (
                  <TR key={p.pid}>
                    <TD className="font-medium">{p.pid}</TD>
                    <TD>{p.sheetCode}</TD>
                    <TD>{p.modelNumber}</TD>
                    <TD>{p.additionalReference ?? '—'}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-gray-800">Event Timeline</div>
            <ProcessTimeline events={process.events} />
          </div>
        </>
      )}
    </Modal>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}
