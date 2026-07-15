import type { ProgressResult, TumblingProcessStatus } from './types';

export interface ComputeProgressInput {
  status: TumblingProcessStatus;
  startedAt: Date | null;
  expectedCompletionAt: Date | null;
  completedAt: Date | null;
  stoppedAt: Date | null;
  durationMinutes: number;
  now: Date;
  nearCompletionThresholdMinutes: number;
}

const ZERO: ProgressResult = {
  elapsedMs: 0,
  remainingMs: 0,
  progressPercent: 0,
  isNearCompletion: false,
  isOverdue: false,
};

function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

/**
 * Single source of truth for process progress math. Never derives from the
 * browser clock — every input is a backend timestamp (or the caller's
 * server-side "now"), so a page refresh or a stale client always recomputes
 * the same correct answer.
 */
export function computeProgress(input: ComputeProgressInput): ProgressResult {
  const totalMs = input.durationMinutes * 60_000;
  if (totalMs <= 0) return ZERO;

  switch (input.status) {
    case 'DRAFT':
    case 'CANCELLED':
      return ZERO;

    case 'RUNNING': {
      if (!input.startedAt) return ZERO;
      const elapsedMs = Math.max(0, input.now.getTime() - input.startedAt.getTime());
      const remainingMs = Math.max(0, totalMs - elapsedMs);
      const progressPercent = clampPercent((elapsedMs / totalMs) * 100);
      const thresholdMs = input.nearCompletionThresholdMinutes * 60_000;
      return {
        elapsedMs: Math.min(elapsedMs, totalMs),
        remainingMs,
        progressPercent,
        isNearCompletion: remainingMs > 0 && remainingMs <= thresholdMs,
        isOverdue: elapsedMs >= totalMs,
      };
    }

    case 'COMPLETED': {
      // Automatic completion always lands exactly at 100% — the sweep
      // freezes completedAt at expectedCompletionAt, not "now".
      return { elapsedMs: totalMs, remainingMs: 0, progressPercent: 100, isNearCompletion: false, isOverdue: false };
    }

    case 'COMPLETED_EARLY': {
      if (!input.startedAt || !input.completedAt) return ZERO;
      const elapsedMs = Math.max(0, input.completedAt.getTime() - input.startedAt.getTime());
      return {
        elapsedMs,
        remainingMs: 0,
        progressPercent: clampPercent((elapsedMs / totalMs) * 100),
        isNearCompletion: false,
        isOverdue: false,
      };
    }

    case 'STOPPED': {
      if (!input.startedAt || !input.stoppedAt) return ZERO;
      const elapsedMs = Math.max(0, input.stoppedAt.getTime() - input.startedAt.getTime());
      return {
        elapsedMs,
        remainingMs: 0,
        progressPercent: clampPercent((elapsedMs / totalMs) * 100),
        isNearCompletion: false,
        isOverdue: false,
      };
    }

    default:
      return ZERO;
  }
}
