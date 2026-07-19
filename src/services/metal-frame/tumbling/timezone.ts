// All Tumbling timestamps are stored and computed in UTC. The one place the
// business (IST) timezone matters is "today" boundaries for dashboard KPIs —
// mirrors the IST_OFFSET convention already used in metal-frame/qc/route.ts.
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** UTC [start, end) instants that correspond to "today" in IST. */
export function istTodayRangeUtc(now: Date): { start: Date; end: Date } {
  const istNowMs = now.getTime() + IST_OFFSET_MS;
  const istMidnightMs = Math.floor(istNowMs / 86_400_000) * 86_400_000;
  const startUtcMs = istMidnightMs - IST_OFFSET_MS;
  return { start: new Date(startUtcMs), end: new Date(startUtcMs + 86_400_000) };
}
