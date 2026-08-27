'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFileText,
  FiFilter,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTag,
} from 'react-icons/fi';
import { cn } from '@/lib/cn';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  PageHeader,
  Select,
  StatCard,
  StatusPill,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from '@/components/ui';

type Decision = 'CONCERN' | 'REVIEW';
type DecisionFilter = 'ALL' | Decision;

type DateRange = {
  startDate: string;
  endDate: string;
};

type CancellationRecord = {
  incrementId: string;
  uwItemCount: number;
  uwItemIds: string[];
  createdAt: string;
  cancelledAt: string;
  ageingDays: number;
  cancelledBy: string;
  initiator: string;
  reason: string;
  handoverTypes: string[];
  channel: string;
  decision: Decision;
  rule: string;
  evidence: string[];
};

type BreakdownRow = {
  name: string;
  total: number;
  concerned: number;
};

type DashboardResponse = {
  range: DateRange;
  generatedAt: string;
  metrics: {
    totalOrders: number;
    sourceRows: number;
    totalItemIds: number;
    totalUwItemIds: number;
    missingUwItemRows: number;
    duplicateUwItemRows: number;
    candidateOrders: number;
    concernedOrders: number;
    outOfScopeOrders: number;
    needsReviewOrders: number;
  };
  sources: {
    powerBi: string;
    googleSheets: string;
    cancellationPortal: string;
    warnings: string[];
  };
  records: CancellationRecord[];
  breakdowns: {
    reasons: BreakdownRow[];
    facilities: BreakdownRow[];
  };
};

type SourceTone = 'good' | 'gold' | 'danger' | 'gray';

const API_PATH = '/api/planning-and-process-excellence/order-cancellation';
const AUTO_REFRESH_MS = 5 * 60_000;
const AUTO_REFRESH_CHECK_MS = 30_000;
const IST_OFFSET_MS = 330 * 60_000;
const PAGE_SIZE = 50;
const numberFormat = new Intl.NumberFormat('en-IN');
const decimalFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 });

const SOURCE_STYLES: Record<
  SourceTone,
  { panel: string; icon: string; dot: string; badge: 'good' | 'gold' | 'danger' | 'gray' }
> = {
  good: {
    panel: 'border-good-600/20 bg-good-50/60',
    icon: 'bg-good-600 text-white',
    dot: 'bg-good-600',
    badge: 'good',
  },
  gold: {
    panel: 'border-gold-500/30 bg-gold-100/60',
    icon: 'bg-gold-500 text-[#3a2800]',
    dot: 'bg-gold-500',
    badge: 'gold',
  },
  danger: {
    panel: 'border-danger-600/20 bg-danger-50/60',
    icon: 'bg-danger-600 text-white',
    dot: 'bg-danger-600',
    badge: 'danger',
  },
  gray: {
    panel: 'border-gray-200 bg-gray-50',
    icon: 'bg-gray-200 text-gray-600',
    dot: 'bg-gray-400',
    badge: 'gray',
  },
};

function isoDateInIst(now = new Date()) {
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

function shiftIsoDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function defaultDateRange(): DateRange {
  const endDate = isoDateInIst();
  return { startDate: shiftIsoDate(endDate, -6), endDate };
}

function formatCalendarDate(value: string) {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString('en-IN', {
        timeZone: 'UTC',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : value;
}

function formatDateTime(value: string) {
  if (!value) return '—';
  const source = value.includes('T') && !/(?:z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? `${value}+05:30`
    : value;
  const date = new Date(source);
  return Number.isFinite(date.getTime())
    ? date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : value;
}

function formatPercent(value: number, total: number) {
  return total > 0 ? `${decimalFormat.format((value / total) * 100)}%` : '0%';
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' }),
  );
}

function csvCell(value: unknown, forceText = false) {
  let text = String(value ?? '');
  if (text && (forceText || /^[=+\-@\t\r]/.test(text))) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDashboardResponse(value: unknown): value is DashboardResponse {
  if (!isObject(value)) return false;
  const { range, metrics, sources, records, breakdowns } = value;
  return (
    isObject(range) &&
    typeof range.startDate === 'string' &&
    typeof range.endDate === 'string' &&
    typeof value.generatedAt === 'string' &&
    isObject(metrics) &&
    typeof metrics.totalOrders === 'number' &&
    typeof metrics.sourceRows === 'number' &&
    typeof metrics.totalItemIds === 'number' &&
    typeof metrics.totalUwItemIds === 'number' &&
    typeof metrics.missingUwItemRows === 'number' &&
    typeof metrics.duplicateUwItemRows === 'number' &&
    typeof metrics.candidateOrders === 'number' &&
    typeof metrics.concernedOrders === 'number' &&
    typeof metrics.outOfScopeOrders === 'number' &&
    typeof metrics.needsReviewOrders === 'number' &&
    isObject(sources) &&
    typeof sources.powerBi === 'string' &&
    typeof sources.googleSheets === 'string' &&
    typeof sources.cancellationPortal === 'string' &&
    Array.isArray(sources.warnings) &&
    Array.isArray(records) &&
    isObject(breakdowns) &&
    Array.isArray(breakdowns.reasons) &&
    Array.isArray(breakdowns.facilities)
  );
}

function errorMessage(value: unknown, fallback: string) {
  if (!isObject(value)) return fallback;
  const message = value.error ?? value.message;
  return typeof message === 'string' && message.trim() ? message : fallback;
}

function sourceTone(status: string): SourceTone {
  const normalized = status.trim().toLowerCase();
  if (!normalized) return 'gray';
  if (/error|fail|down|unavailable|missing|unauthor|not configured|disabled/.test(normalized)) {
    return 'danger';
  }
  if (/warn|stale|partial|fallback|cached|degraded|review/.test(normalized)) return 'gold';
  if (/ok|healthy|ready|live|connected|success|available|fresh/.test(normalized)) return 'good';
  return 'gray';
}

function SourceStatus({
  label,
  status,
  icon: Icon,
}: {
  label: string;
  status: string;
  icon: IconType;
}) {
  const tone = sourceTone(status);
  const styles = SOURCE_STYLES[tone];
  return (
    <div className={cn('flex min-w-0 items-start gap-3 rounded-xl border p-3.5', styles.panel)}>
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', styles.icon)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
          <span className={cn('h-2 w-2 rounded-full', styles.dot)} aria-hidden="true" />
        </div>
        <p className="mt-0.5 break-words text-xs leading-5 text-gray-600">
          {status || 'Status not reported'}
        </p>
      </div>
      <Badge tone={styles.badge} className="shrink-0 capitalize">
        {tone === 'good' ? 'Ready' : tone === 'gold' ? 'Watch' : tone === 'danger' ? 'Issue' : 'Info'}
      </Badge>
    </div>
  );
}

function BreakdownPanel({
  title,
  subtitle,
  rows,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  rows: BreakdownRow[];
  icon: IconType;
}) {
  const sortedRows = [...rows]
    .sort((a, b) => b.concerned - a.concerned || b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, 6);
  const maximumConcerned = Math.max(1, ...sortedRows.map((row) => row.concerned));

  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <Badge tone="navy">Top {sortedRows.length || 0}</Badge>
      </CardHeader>
      <CardBody className="space-y-4">
        {sortedRows.length ? (
          sortedRows.map((row) => {
            const comparisonWidth = row.concerned
              ? Math.max(2, (row.concerned / maximumConcerned) * 100)
              : 0;
            return (
              <div key={row.name || 'Unspecified'}>
                <div className="mb-1.5 flex items-start justify-between gap-4 text-xs">
                  <span className="min-w-0 truncate font-medium text-gray-700" title={row.name || 'Unspecified'}>
                    {row.name || 'Unspecified'}
                  </span>
                  <span className="shrink-0 text-gray-500">
                    <strong className="text-danger-600">{numberFormat.format(row.concerned)}</strong>
                    {' / '}
                    {numberFormat.format(row.total)}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-label={`${row.name || 'Unspecified'} concerned orders`}
                  aria-valuemin={0}
                  aria-valuemax={maximumConcerned}
                  aria-valuenow={row.concerned}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-notice-600 to-danger-600"
                    style={{ width: `${comparisonWidth}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[11px] text-gray-400">
                  {formatPercent(row.concerned, row.total)} concern rate
                </p>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">No breakdown data for this range.</div>
        )}
      </CardBody>
    </Card>
  );
}

export default function OrderCancellationPage() {
  const defaults = useMemo(defaultDateRange, []);
  const [draftRange, setDraftRange] = useState<DateRange>(defaults);
  const [range, setRange] = useState<DateRange>(defaults);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<DecisionFilter>('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [handoverTypeFilter, setHandoverTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const controllerRef = useRef<AbortController | null>(null);
  const lastLoadedAtRef = useRef(0);

  const loadDashboard = useCallback(async (targetRange: DateRange, force = false) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams(targetRange);
      if (force) params.set('refresh', '1');
      const response = await fetch(`${API_PATH}?${params.toString()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        throw new Error('The order-cancellation service returned an unreadable response.');
      }

      if (!response.ok) {
        throw new Error(errorMessage(body, `Unable to load the dashboard (${response.status}).`));
      }
      if (!isDashboardResponse(body)) {
        throw new Error('The order-cancellation service returned an unexpected response shape.');
      }

      setData(body);
      lastLoadedAtRef.current = Date.now();
    } catch (loadError) {
      if (loadError instanceof Error && loadError.name === 'AbortError') return;
      setError(loadError instanceof Error ? loadError.message : 'Unable to load the dashboard.');
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadDashboard(range);
    return () => controllerRef.current?.abort();
  }, [loadDashboard, range]);

  useEffect(() => {
    const refreshIfStale = () => {
      if (
        document.visibilityState === 'visible' &&
        !controllerRef.current &&
        Date.now() - lastLoadedAtRef.current >= AUTO_REFRESH_MS
      ) {
        // Use the normal request so open dashboards share the server's cache.
        // Manual Refresh remains the force-refresh action.
        void loadDashboard(range);
      }
    };
    // Check more often than the refresh period so timer drift cannot turn the
    // advertised five-minute cadence into ten minutes.
    const interval = window.setInterval(refreshIfStale, AUTO_REFRESH_CHECK_MS);
    document.addEventListener('visibilitychange', refreshIfStale);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshIfStale);
    };
  }, [loadDashboard, range]);

  const draftRangeDays = draftRange.startDate && draftRange.endDate
    ? Math.floor(
        (Date.parse(`${draftRange.endDate}T00:00:00Z`) -
          Date.parse(`${draftRange.startDate}T00:00:00Z`)) /
          86_400_000,
      ) + 1
    : 0;
  const rangeError = !draftRange.startDate || !draftRange.endDate
    ? 'Choose both a start and end date.'
    : draftRange.startDate > draftRange.endDate
      ? 'Start date must be on or before end date.'
      : draftRangeDays > 31
        ? 'Choose a date range of 31 days or less.'
        : '';

  const records = useMemo(() => data?.records ?? [], [data?.records]);
  const reasonOptions = useMemo(
    () => uniqueSorted(records.map((record) => record.reason)),
    [records],
  );
  const handoverTypeOptions = useMemo(
    () => uniqueSorted(records.flatMap((record) => record.handoverTypes)),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase('en-IN');
    return records.filter((record) => {
      if (decisionFilter !== 'ALL' && record.decision !== decisionFilter) return false;
      if (reasonFilter !== 'ALL' && record.reason.trim() !== reasonFilter) return false;
      if (handoverTypeFilter !== 'ALL' && !record.handoverTypes.includes(handoverTypeFilter)) return false;
      if (!needle) return true;
      return [
        record.incrementId,
        ...record.uwItemIds,
        record.cancelledBy,
        record.initiator,
        record.reason,
        ...record.handoverTypes,
        record.channel,
        record.rule,
        ...record.evidence,
      ].some((value) => String(value ?? '').toLocaleLowerCase('en-IN').includes(needle));
    });
  }, [decisionFilter, handoverTypeFilter, reasonFilter, records, search]);

  useEffect(() => setPage(1), [decisionFilter, handoverTypeFilter, reasonFilter, search, records]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(pageStart, pageStart + PAGE_SIZE);
  const visibleFrom = filteredRecords.length ? pageStart + 1 : 0;
  const visibleTo = Math.min(pageStart + PAGE_SIZE, filteredRecords.length);

  const warnings = data?.sources.warnings ?? [];
  const sourceItems: Array<{ label: string; status: string; icon: IconType }> = [
    { label: 'Power BI', status: data?.sources.powerBi ?? 'Waiting for response', icon: FiBarChart2 },
    { label: 'Google Sheets', status: data?.sources.googleSheets ?? 'Waiting for response', icon: FiFileText },
    {
      label: 'Cancellation Portal',
      status: data?.sources.cancellationPortal ?? 'Waiting for response',
      icon: FiShield,
    },
  ];
  const sourceNeedsAttention = sourceItems.some(({ status }) => {
    const tone = sourceTone(status);
    return tone === 'danger' || tone === 'gold';
  });
  const overallTone: 'danger' | 'gold' | 'good' | 'gray' = error
    ? 'danger'
    : loading
      ? 'gold'
      : warnings.length || sourceNeedsAttention
        ? 'gold'
        : data
          ? 'good'
          : 'gray';
  const overallLabel = error
    ? 'Refresh failed'
    : loading
      ? 'Refreshing data'
      : warnings.length || sourceNeedsAttention
        ? 'Source attention'
        : data
          ? 'Data current'
          : 'Waiting for data';

  const handleApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rangeError) return;
    if (draftRange.startDate === range.startDate && draftRange.endDate === range.endDate) {
      void loadDashboard(range, true);
      return;
    }
    setRange(draftRange);
  };

  const clearTableFilters = () => {
    setSearch('');
    setDecisionFilter('ALL');
    setReasonFilter('ALL');
    setHandoverTypeFilter('ALL');
  };

  const exportCsv = () => {
    if (!filteredRecords.length) return;
    const header = [
      'Increment ID',
      'UW Item ID Count',
      'UW Item IDs',
      'Decision',
      'Created At',
      'Cancelled At',
      'Ageing Days',
      'Cancelled By',
      'Initiator',
      'Reason',
      'Handover Type',
      'Channel',
      'Rule',
      'Evidence',
    ];
    const lines = [
      header.map((value) => csvCell(value)).join(','),
      ...filteredRecords.map((record) =>
        [
          csvCell(record.incrementId, true),
          csvCell(record.uwItemCount),
          csvCell(record.uwItemIds.join(' | '), true),
          csvCell(record.decision),
          csvCell(record.createdAt),
          csvCell(record.cancelledAt),
          csvCell(record.ageingDays),
          csvCell(record.cancelledBy),
          csvCell(record.initiator),
          csvCell(record.reason),
          csvCell(record.handoverTypes.join(' | ')),
          csvCell(record.channel),
          csvCell(record.rule),
          csvCell(record.evidence.join(' | ')),
        ].join(','),
      ),
    ];
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-cancellation-rca-${range.startDate}-to-${range.endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const metrics = data?.metrics;
  const uwAuditNeedsAttention = Boolean(
    metrics &&
      (metrics.missingUwItemRows > 0 ||
        metrics.duplicateUwItemRows > 0 ||
        metrics.totalItemIds !== metrics.totalUwItemIds),
  );
  const filteredUwItemCount = useMemo(
    () => new Set(filteredRecords.flatMap((record) => record.uwItemIds)).size,
    [filteredRecords],
  );
  const hasTableFilters =
    Boolean(search.trim()) ||
    decisionFilter !== 'ALL' ||
    reasonFilter !== 'ALL' ||
    handoverTypeFilter !== 'ALL';

  return (
    <div className="mx-auto max-w-[1800px] space-y-6 pb-8">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">
          <FiBarChart2 className="h-4 w-4" aria-hidden="true" />
          Planning and Process Excellence
        </div>
        <PageHeader
          className="mb-0"
          title="Order Cancellation RCA"
          subtitle="Increment-level plant concern classification with source-backed decision evidence."
          actions={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge tone={overallTone}>{overallLabel}</Badge>
              <span className="text-xs text-gray-500" aria-live="polite">
                {data ? `Updated ${formatDateTime(data.generatedAt)} IST` : 'No successful refresh yet'}
              </span>
            </div>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-gray-800">
              <FiCalendar className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Analysis window
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">Calendar dates are interpreted in IST.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="gray">Auto-refresh: 5 min</Badge>
            <Badge tone="navy">Default: last 7 days</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleApply}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_auto_auto]"
          >
            <Field label="Start date" htmlFor="cancellation-start-date">
              <Input
                id="cancellation-start-date"
                type="date"
                value={draftRange.startDate}
                max={draftRange.endDate || defaults.endDate}
                onChange={(event) =>
                  setDraftRange((current) => ({ ...current, startDate: event.target.value }))
                }
                aria-invalid={Boolean(rangeError)}
                required
              />
            </Field>
            <Field label="End date" htmlFor="cancellation-end-date">
              <Input
                id="cancellation-end-date"
                type="date"
                value={draftRange.endDate}
                min={draftRange.startDate}
                max={defaults.endDate}
                onChange={(event) =>
                  setDraftRange((current) => ({ ...current, endDate: event.target.value }))
                }
                aria-invalid={Boolean(rangeError)}
                required
              />
            </Field>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full xl:w-auto"
                disabled={Boolean(rangeError) || loading}
              >
                <FiFilter className="h-4 w-4" aria-hidden="true" />
                Apply dates
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="w-full xl:w-auto"
                onClick={() => void loadDashboard(range, true)}
                disabled={loading}
                title="Refresh the currently applied date range"
              >
                <FiRefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
                Refresh
              </Button>
            </div>
          </form>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className={rangeError ? 'font-medium text-danger-600' : 'text-gray-500'} role={rangeError ? 'alert' : undefined}>
              {rangeError || `Applied: ${formatCalendarDate(range.startDate)} to ${formatCalendarDate(range.endDate)}`}
            </p>
            {data?.range &&
              (data.range.startDate !== range.startDate || data.range.endDate !== range.endDate) && (
                <p className="text-gray-500">
                  Service range: {formatCalendarDate(data.range.startDate)} to {formatCalendarDate(data.range.endDate)}
                </p>
              )}
          </div>
        </CardBody>
      </Card>

      {error && (
        <Alert tone="error" role="alert">
          <span className="flex items-start gap-2">
            <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Dashboard refresh failed.</strong> {error}
              {data ? ' The last successful result remains visible below.' : ''}
            </span>
          </span>
        </Alert>
      )}

      <section aria-labelledby="source-health-heading">
        <Card>
          <CardHeader>
            <div>
              <h2 id="source-health-heading" className="font-semibold text-gray-800">
                Source health
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Freshness and availability of the three inputs used by the classifier.
              </p>
            </div>
            <Badge tone={warnings.length || sourceNeedsAttention ? 'gold' : data ? 'good' : 'gray'}>
              {warnings.length
                ? `${warnings.length} warning${warnings.length === 1 ? '' : 's'}`
                : sourceNeedsAttention
                  ? 'Check sources'
                  : data
                    ? 'No warnings'
                    : 'Pending'}
            </Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-3" aria-busy={loading}>
              {sourceItems.map((source) => (
                <SourceStatus key={source.label} {...source} />
              ))}
            </div>
            {warnings.length > 0 && (
              <Alert tone="warning" role="alert">
                <div className="flex items-start gap-2">
                  <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <div>
                    <strong>Classification completed with source warnings.</strong>
                    <ul className="mt-1 list-disc space-y-1 pl-5 font-normal">
                      {warnings.map((warning, index) => (
                        <li key={`${warning}-${index}`}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Alert>
            )}
          </CardBody>
        </Card>
      </section>

      <section aria-labelledby="order-cancellation-kpis">
        <h2 id="order-cancellation-kpis" className="sr-only">
          Order cancellation key performance indicators
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6" aria-busy={loading}>
          <StatCard
            label="Total orders"
            value={metrics ? numberFormat.format(metrics.totalOrders) : '—'}
            sub="Orders in selected period"
            tone="navy"
          />
          <StatCard
            label="UW item IDs"
            value={metrics ? numberFormat.format(metrics.totalUwItemIds) : '—'}
            sub={
              metrics
                ? uwAuditNeedsAttention
                  ? `${numberFormat.format(metrics.sourceRows)} rows · ${numberFormat.format(metrics.totalItemIds)} item IDs`
                  : `Matches ${numberFormat.format(metrics.sourceRows)} source rows`
                : 'Distinct IDs in selected period'
            }
            tone={uwAuditNeedsAttention ? 'danger' : 'good'}
          />
          <StatCard
            label="Candidate orders"
            value={metrics ? numberFormat.format(metrics.candidateOrders) : '—'}
            sub={metrics ? `${formatPercent(metrics.candidateOrders, metrics.totalOrders)} of total` : 'Rule candidates'}
            tone="notice"
          />
          <StatCard
            label="Plant concerns"
            value={metrics ? numberFormat.format(metrics.concernedOrders) : '—'}
            sub={metrics ? `${formatPercent(metrics.concernedOrders, metrics.candidateOrders)} of candidates` : 'Actionable cases'}
            tone="danger"
          />
          <StatCard
            label="Needs review"
            value={metrics ? numberFormat.format(metrics.needsReviewOrders) : '—'}
            sub="Manual evidence check"
            tone="gold"
          />
          <StatCard
            label="Out of scope"
            value={metrics ? numberFormat.format(metrics.outOfScopeOrders) : '—'}
            sub={metrics ? `${formatPercent(metrics.outOfScopeOrders, metrics.totalOrders)} automatically excluded` : 'Excluded by rules'}
            tone="good"
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2" aria-label="Cancellation concern breakdowns">
        <BreakdownPanel
          title="Reason hotspots"
          subtitle="Concerned orders against all assessed orders by reason"
          rows={data?.breakdowns.reasons ?? []}
          icon={FiTag}
        />
        <BreakdownPanel
          title="Facility hotspots"
          subtitle="Concern concentration across plants and facilities"
          rows={data?.breakdowns.facilities ?? []}
          icon={FiMapPin}
        />
      </section>

      <section aria-labelledby="concern-records-heading">
        <Card>
          <CardHeader className="flex-wrap">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="concern-records-heading" className="font-semibold text-gray-800">
                  Concern and review queue
                </h2>
                <Badge tone="navy">{numberFormat.format(filteredRecords.length)} visible</Badge>
                <Badge tone="gray">{numberFormat.format(filteredUwItemCount)} UW item IDs</Badge>
              </div>
              <p id="records-summary" className="mt-0.5 text-xs text-gray-500">
                Increment-level decisions, candidate UW item IDs, applied rule, and supporting evidence.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={exportCsv} disabled={!filteredRecords.length}>
              <FiDownload className="h-4 w-4" aria-hidden="true" />
              Export filtered CSV
            </Button>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1.6fr)_minmax(150px,0.7fr)_minmax(190px,1fr)_minmax(190px,1fr)_auto]">
              <Field label="Search records" htmlFor="cancellation-record-search">
                <div className="relative">
                  <FiSearch
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="cancellation-record-search"
                    type="search"
                    className="pl-9"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Increment ID, UW item ID, owner, rule…"
                    autoComplete="off"
                  />
                </div>
              </Field>
              <Field label="Decision" htmlFor="cancellation-decision-filter">
                <Select
                  id="cancellation-decision-filter"
                  value={decisionFilter}
                  onChange={(event) => setDecisionFilter(event.target.value as DecisionFilter)}
                >
                  <option value="ALL">All decisions</option>
                  <option value="CONCERN">Concern</option>
                  <option value="REVIEW">Review</option>
                </Select>
              </Field>
              <Field label="Reason" htmlFor="cancellation-reason-filter">
                <Select
                  id="cancellation-reason-filter"
                  value={reasonFilter}
                  onChange={(event) => setReasonFilter(event.target.value)}
                >
                  <option value="ALL">All reasons</option>
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Handover Type" htmlFor="cancellation-handover-type-filter">
                <Select
                  id="cancellation-handover-type-filter"
                  value={handoverTypeFilter}
                  onChange={(event) => setHandoverTypeFilter(event.target.value)}
                >
                  <option value="ALL">All handover types</option>
                  {handoverTypeOptions.map((handoverType) => (
                    <option key={handoverType} value={handoverType}>
                      {handoverType}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full xl:w-auto"
                  onClick={clearTableFilters}
                  disabled={!hasTableFilters}
                >
                  Clear filters
                </Button>
              </div>
            </div>

            <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <span>
                Showing {numberFormat.format(visibleFrom)}–{numberFormat.format(visibleTo)} of{' '}
                {numberFormat.format(filteredRecords.length)} matching records
              </span>
              {hasTableFilters && (
                <span>
                  Filtered from {numberFormat.format(records.length)} concern/review records
                </span>
              )}
            </div>

            <Table className="min-w-[1420px]" aria-describedby="records-summary" aria-busy={loading}>
              <caption className="sr-only">
                Order cancellation records classified as plant concerns or requiring manual review
              </caption>
              <THead>
                <TR>
                  <TH scope="col">Decision</TH>
                  <TH scope="col">Increment ID</TH>
                  <TH scope="col">Timeline</TH>
                  <TH scope="col">Initiator</TH>
                  <TH scope="col">Cancellation reason</TH>
                  <TH scope="col">Handover Type</TH>
                  <TH scope="col">Rule and evidence</TH>
                </TR>
              </THead>
              <TBody>
                {visibleRecords.length ? (
                  visibleRecords.map((record, index) => (
                    <TR
                      key={`${record.incrementId}-${pageStart + index}`}
                      className={record.decision === 'CONCERN' ? 'bg-danger-50/40' : 'bg-gold-100/35'}
                    >
                      <TD className="w-[112px]">
                        <StatusPill tone={record.decision === 'CONCERN' ? 'danger' : 'gold'}>
                          {record.decision}
                        </StatusPill>
                      </TD>
                      <TD className="min-w-[160px]">
                        <div className="font-mono text-sm font-semibold text-brand-700">
                          {record.incrementId || '—'}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {numberFormat.format(record.uwItemCount)} candidate UW item ID
                          {record.uwItemCount === 1 ? '' : 's'}
                        </div>
                      </TD>
                      <TD className="min-w-[225px]">
                        <dl className="space-y-1 text-xs">
                          <div className="flex gap-2">
                            <dt className="w-16 shrink-0 text-gray-400">Created</dt>
                            <dd>{formatDateTime(record.createdAt)}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="w-16 shrink-0 text-gray-400">Cancelled</dt>
                            <dd>{formatDateTime(record.cancelledAt)}</dd>
                          </div>
                        </dl>
                        <Badge tone={record.ageingDays > 5 ? 'danger' : record.ageingDays > 1 ? 'gold' : 'gray'} className="mt-2">
                          {decimalFormat.format(record.ageingDays)} day{record.ageingDays === 1 ? '' : 's'} ageing
                        </Badge>
                      </TD>
                      <TD className="min-w-[210px]">
                        <div className="font-medium text-gray-800">{record.initiator || 'Unknown'}</div>
                        <div className="mt-1 break-all font-mono text-xs text-gray-500">
                          {record.cancelledBy || 'No canceller recorded'}
                        </div>
                        {record.channel && (
                          <Badge tone="gray" className="mt-2">
                            {record.channel}
                          </Badge>
                        )}
                      </TD>
                      <TD className="min-w-[220px] max-w-[300px]">
                        <p className="font-medium leading-5 text-gray-800">{record.reason || 'Not specified'}</p>
                      </TD>
                      <TD className="min-w-[190px]">
                        {record.handoverTypes.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {record.handoverTypes.map((handoverType) => (
                              <Badge key={handoverType} tone="gray">
                                {handoverType}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unspecified</span>
                        )}
                      </TD>
                      <TD className="min-w-[360px] max-w-[480px]">
                        <p className="text-xs font-semibold leading-5 text-gray-800">
                          {record.rule || 'Manual review rule'}
                        </p>
                        {record.evidence.length ? (
                          <div className="mt-2 text-xs leading-5 text-gray-600">
                            <ul className="list-disc space-y-0.5 pl-4">
                              {record.evidence.slice(0, 2).map((item, evidenceIndex) => (
                                <li key={`${item}-${evidenceIndex}`}>{item}</li>
                              ))}
                            </ul>
                            {record.evidence.length > 2 && (
                              <details className="mt-1">
                                <summary className="cursor-pointer font-medium text-brand-700 hover:text-brand-800">
                                  Show {record.evidence.length - 2} more evidence item
                                  {record.evidence.length - 2 === 1 ? '' : 's'}
                                </summary>
                                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                                  {record.evidence.slice(2).map((item, evidenceIndex) => (
                                    <li key={`${item}-${evidenceIndex + 2}`}>{item}</li>
                                  ))}
                                </ul>
                              </details>
                            )}
                          </div>
                        ) : (
                          <p className="mt-1 text-xs italic text-gray-400">No supporting evidence supplied.</p>
                        )}
                      </TD>
                    </TR>
                  ))
                ) : (
                  <TR>
                    <TD colSpan={7} className="py-16 text-center">
                      <FiCheckCircle className="mx-auto mb-3 h-8 w-8 text-gray-300" aria-hidden="true" />
                      <p className="font-medium text-gray-700">
                        {loading ? 'Loading cancellation records…' : 'No records match the current filters.'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {loading
                          ? 'Results will appear as soon as classification completes.'
                          : 'Try clearing a filter or applying a wider date range.'}
                      </p>
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>

            <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Cancellation records pagination">
              <p className="text-xs text-gray-500">
                Page {numberFormat.format(currentPage)} of {numberFormat.format(pageCount)} · up to{' '}
                {PAGE_SIZE} records per page
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage <= 1}
                >
                  <FiChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={currentPage >= pageCount}
                >
                  Next
                  <FiChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </nav>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
