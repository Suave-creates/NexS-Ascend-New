import { ProcessEventEntry } from './types';

/**
 * Pure helper that appends one immutable timeline entry to a process's
 * `events` JSON array. No DB access here — the caller persists the
 * resulting array as part of the same update that changes the process's
 * other fields, so the event and the state change always land atomically
 * in one row write.
 */
export function appendEvent(
  events: ProcessEventEntry[],
  entry: Omit<ProcessEventEntry, 'at'>,
): ProcessEventEntry[] {
  return [...events, { ...entry, at: new Date().toISOString() }];
}
