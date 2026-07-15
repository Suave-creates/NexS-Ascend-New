import { cn } from '@/lib/cn';
import { StatusPill } from '@/components/ui';
import { computeProgress } from '@/services/metal-frame/tumbling/progress.service';
import type { DashboardContainerSummary, DashboardStationCard as StationCardData } from '@/services/metal-frame/tumbling/types';
import { containerStatusStyle, stationStatusStyle } from '../_lib/statusStyles';
import { formatClockTime, formatDuration, pluralize } from '../_lib/format';
import { ProgressBar } from './ProgressBar';

const PILL_TONE_MAP = { gray: 'gold', navy: 'gold', good: 'good', danger: 'danger', notice: 'notice', gold: 'gold' } as const;

const STATUS_TEXT_CLASS: Record<'gray' | 'navy' | 'good' | 'danger' | 'notice' | 'gold', string> = {
  gray: 'text-gray-500',
  navy: 'text-brand-600',
  good: 'text-good-600',
  danger: 'text-danger-600',
  notice: 'text-notice-600',
  gold: 'text-gold-700',
};

function ContainerPanel({
  container,
  now,
  nearCompletionThresholdMinutes,
}: {
  container: DashboardContainerSummary;
  now: Date;
  nearCompletionThresholdMinutes: number;
}) {
  const style = containerStatusStyle(container.status);
  const Icon = style.icon;
  const proc = container.activeProcess;

  const liveProgress = proc
    ? computeProgress({
        status: proc.status,
        startedAt: proc.startedAt ? new Date(proc.startedAt) : null,
        expectedCompletionAt: proc.expectedCompletionAt ? new Date(proc.expectedCompletionAt) : null,
        completedAt: proc.completedAt ? new Date(proc.completedAt) : null,
        stoppedAt: proc.stoppedAt ? new Date(proc.stoppedAt) : null,
        durationMinutes: proc.durationMinutes,
        now,
        nearCompletionThresholdMinutes,
      })
    : null;

  return (
    <div className="rounded-xl bg-gray-50/70 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {container.side === 'LEFT' ? 'Left Container' : 'Right Container'}
        </span>
        <span className={cn('flex items-center gap-1 text-xs font-semibold', STATUS_TEXT_CLASS[style.tone])}>
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {style.label}
        </span>
      </div>

      {container.status === 'RUNNING' && proc && liveProgress ? (
        <div className="mt-2 space-y-1.5">
          <div className="text-xs text-gray-500">{pluralize(proc.productCount, 'Product')}</div>
          <ProgressBar percent={liveProgress.progressPercent} tone={liveProgress.isNearCompletion ? 'notice' : 'navy'} />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDuration(liveProgress.remainingMs)} remaining</span>
            <span>Completes {formatClockTime(proc.expectedCompletionAt)}</span>
          </div>
        </div>
      ) : container.status === 'DRAFT' && proc ? (
        <div className="mt-2 text-xs text-gray-500">{pluralize(proc.productCount, 'product')} added · not started</div>
      ) : container.status === 'COMPLETED' && proc ? (
        <div className="mt-2 text-xs text-gray-500">
          {proc.completionType === 'EARLY' ? 'Completed early' : 'Completed'} ·{' '}
          {formatClockTime(proc.completedAt)} · {pluralize(proc.productCount, 'product')}
        </div>
      ) : container.status === 'STOPPED' && proc ? (
        <div className="mt-2 text-xs font-medium text-danger-600">Stopped at {formatClockTime(proc.stoppedAt)}</div>
      ) : container.status === 'INACTIVE' ? (
        <div className="mt-2 text-xs text-gray-400">This container is deactivated</div>
      ) : (
        <div className="mt-2 text-xs text-gray-500">Ready for a new tumbling process</div>
      )}
    </div>
  );
}

export function StationCard({
  station,
  now,
  nearCompletionThresholdMinutes,
  onOpen,
}: {
  station: StationCardData;
  now: Date;
  nearCompletionThresholdMinutes: number;
  onOpen: (stationNumber: number) => void;
}) {
  const overall = stationStatusStyle(station.overallStatus);
  const attentionNeeded = station.overallStatus === 'STOPPED';
  const label = `Station ${String(station.stationNumber).padStart(2, '0')}`;

  return (
    <button
      type="button"
      onClick={() => onOpen(station.stationNumber)}
      className={cn(
        'group block w-full rounded-2xl border bg-white p-5 text-left shadow-sm outline-none transition',
        'hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        attentionNeeded ? 'border-danger-200' : 'border-gray-200',
      )}
      aria-label={`Open ${label}, status ${overall.label}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-base font-bold text-gray-900">{label}</div>
          <div className="truncate text-xs text-gray-400">Metal Frame Tumbling</div>
        </div>
        <StatusPill tone={PILL_TONE_MAP[overall.tone]}>{overall.label}</StatusPill>
      </div>

      <div className="mt-4 space-y-2.5">
        <ContainerPanel container={station.left} now={now} nearCompletionThresholdMinutes={nearCompletionThresholdMinutes} />
        <ContainerPanel container={station.right} now={now} nearCompletionThresholdMinutes={nearCompletionThresholdMinutes} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
        <span>Updated {formatClockTime(station.updatedAt)}</span>
        <span className="text-brand-600 opacity-0 transition group-hover:opacity-100">Open station →</span>
      </div>
    </button>
  );
}
