const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const STOCK_IN_ANALYTICS_MAX_RANGE_DAYS = 62;
export const STOCK_IN_ANALYTICS_TIME_ZONE = 'Asia/Kolkata';

const IST_OFFSET_MS = 330 * 60_000;
const DEFAULT_WINDOW_MS = 48 * 60 * 60_000;

export type StockInAnalyticsRange = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export type StockInAnalyticsRangeResult =
  | { ok: true; range: StockInAnalyticsRange }
  | { ok: false; error: string };

function dateAtUtc(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = dateAtUtc(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function dateTimeAtUtc(date: string, time: string) {
  return new Date(`${date}T${time}:00Z`);
}

/** The default window is the most recent 48 hours expressed as IST form inputs. */
export function rollingStockInAnalyticsRange(now = Date.now()): StockInAnalyticsRange {
  const inputParts = (timestamp: number) => {
    const value = new Date(timestamp + IST_OFFSET_MS).toISOString();
    return { date: value.slice(0, 10), time: value.slice(11, 16) };
  };
  const start = inputParts(now - DEFAULT_WINDOW_MS);
  const end = inputParts(now);
  return {
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
  };
}

export function stockInAnalyticsRangeElapsedMinutes(range: StockInAnalyticsRange): number {
  const start = dateTimeAtUtc(range.startDate, range.startTime).getTime();
  const end = dateTimeAtUtc(range.endDate, range.endTime).getTime();
  return (end - start) / 60_000;
}

/** Parse and validate the shared Stock In analytics date/time query contract. */
export function stockInAnalyticsRange(
  searchParams: URLSearchParams,
  now = Date.now(),
): StockInAnalyticsRangeResult {
  const useDefaultRange = !searchParams.has('startDate') && !searchParams.has('endDate');
  const defaults = useDefaultRange ? rollingStockInAnalyticsRange(now) : null;
  const startDate = searchParams.get('startDate') || defaults?.startDate || '';
  const endDate = searchParams.get('endDate') || defaults?.endDate || '';
  const startTime = searchParams.get('startTime') || defaults?.startTime || '00:00';
  const endTime = searchParams.get('endTime') || defaults?.endTime || '23:59';

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { ok: false, error: 'startDate and endDate must use YYYY-MM-DD.' };
  }
  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
    return { ok: false, error: 'startTime and endTime must use HH:mm in 24-hour time.' };
  }

  const start = dateAtUtc(startDate);
  const end = dateAtUtc(endDate);
  const rangeDays = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (
    !Number.isFinite(rangeDays)
    || rangeDays < 1
    || rangeDays > STOCK_IN_ANALYTICS_MAX_RANGE_DAYS
  ) {
    return {
      ok: false,
      error: `Select a date range between 1 and ${STOCK_IN_ANALYTICS_MAX_RANGE_DAYS} days.`,
    };
  }
  if (dateTimeAtUtc(endDate, endTime) < dateTimeAtUtc(startDate, startTime)) {
    return { ok: false, error: 'The end date and time cannot be earlier than the start date and time.' };
  }

  return { ok: true, range: { startDate, startTime, endDate, endTime } };
}
