'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import {
  INVENTORY_SOURCES,
  type LensDecantingRow,
  type LensDecantingSummary,
  type SourceMetrics,
} from '@/lib/lensDecanting';
import {
  FRAME_INVENTORY_SOURCES,
  type FrameDecantingRow,
  type FrameDecantingSummary,
} from '@/lib/frameDecanting';

export type DecantingDashboardKind = 'lens' | 'frame';

type DecantingRow = LensDecantingRow | FrameDecantingRow;
type DecantingSummary = LensDecantingSummary | FrameDecantingSummary;

type DecantingResponse = {
  rows: DecantingRow[];
  summary: DecantingSummary;
  filteredSummary: DecantingSummary;
  pagination: { page: number; pageSize: number; totalRows: number; totalPages: number };
  filterOptions: { decantComments: string[]; productTypes: string[]; brands: string[] };
  asOfDate: string;
  rosWindow: { startDate: string; endDate: string };
  generatedAt: string;
  sources: Record<string, string | number>;
  sourceRows: Record<string, string | number>;
  warnings: string[];
};

type DashboardConfig = {
  apiPath: string;
  slug: string;
  title: string;
  description: string;
  rosHelp: string;
  cacheHelp: string;
};

const DASHBOARD_CONFIG: Record<DecantingDashboardKind, DashboardConfig> = {
  lens: {
    apiPath: '/api/stock-in/lens-decanting',
    slug: 'lens-decanting',
    title: 'Lens Decanting',
    description: 'PID-level lens replenishment priorities using seven-day ROS, multi-inventory availability, GRN status, and decant business rules.',
    rosHelp: 'ROS uses the seven complete days ending two days before the as-of date.',
    cacheHelp: 'ten-hour',
  },
  frame: {
    apiPath: '/api/stock-in/frame-decanting',
    slug: 'frame-decanting',
    title: 'Frame Decanting',
    description: 'PID-level frame replenishment priorities using highest-month ROS, multi-inventory availability, GRN status, and decant business rules.',
    rosHelp: 'ROS uses the highest daily rate across the three calendar months ending three days before the as-of date.',
    cacheHelp: '30-minute',
  },
};

const PAGE_SIZES = [25, 50, 100];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const numberFormat = new Intl.NumberFormat('en-IN');
const decimalFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const rosFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 });

const SOURCE_BAR_CLASS: Record<string, string> = {
  asrs: 'bg-teal-500',
  nxs1: 'bg-blue-500',
  nxs2: 'bg-violet-500',
  eglManual: 'bg-amber-500',
  putawayPending: 'bg-orange-500',
  plManual: 'bg-cyan-500',
  pl10: 'bg-rose-500',
  pl11: 'bg-fuchsia-500',
  pl40: 'bg-lime-500',
};

function todayInIndia() {
  return new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
}

function validCalendarDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function formatDate(value: string, withYear = true) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

function formatUpdatedAt(value: string) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return '';
  return parsed.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function decantBarClass(value: string) {
  if (value.startsWith('Decant (300')) return 'bg-rose-500';
  if (value.startsWith('Decant (700')) return 'bg-orange-500';
  if (value.startsWith('Decant (7 Day')) return 'bg-amber-500';
  if (value.startsWith('P0')) return 'bg-rose-500';
  if (value.startsWith('P1')) return 'bg-orange-500';
  if (value.startsWith('HHD')) return 'bg-amber-500';
  if (value === 'Extra in ASRS' || value === 'Over Decanted') return 'bg-blue-500';
  if (value.toLowerCase() === 'check for transfers') return 'bg-violet-500';
  return 'bg-zinc-500';
}

function decantBadgeClass(value: string) {
  if (value.startsWith('Decant (300')) return 'border-rose-700 bg-rose-950 text-rose-200';
  if (value.startsWith('Decant (700')) return 'border-orange-700 bg-orange-950 text-orange-200';
  if (value.startsWith('Decant (7 Day')) return 'border-amber-700 bg-amber-950 text-amber-200';
  if (value.startsWith('P0')) return 'border-rose-700 bg-rose-950 text-rose-200';
  if (value.startsWith('P1')) return 'border-orange-700 bg-orange-950 text-orange-200';
  if (value.startsWith('HHD')) return 'border-amber-700 bg-amber-950 text-amber-200';
  if (value === 'Extra in ASRS' || value === 'Over Decanted') return 'border-blue-700 bg-blue-950 text-blue-200';
  if (value.toLowerCase() === 'check for transfers') return 'border-violet-700 bg-violet-950 text-violet-200';
  return 'border-zinc-600 bg-zinc-800 text-zinc-300';
}

function stockStatusClass(value: SourceMetrics['status7Day']) {
  if (value === 'Sufficient') return 'text-emerald-400';
  if (value === 'Insufficient') return 'text-rose-400';
  return 'text-amber-400';
}

function sourceHealthClass(value: string | number | undefined) {
  if (value == null || value === '') return 'border-zinc-700 bg-zinc-900 text-zinc-300';
  const normalized = String(value).toLowerCase();
  if (normalized.includes('ok') || normalized.includes('cache')) {
    return 'border-emerald-800 bg-emerald-950 text-emerald-300';
  }
  return 'border-amber-800 bg-amber-950 text-amber-300';
}

function sourceNumber(value: string | number | undefined): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function MetricCell({ metrics }: { metrics: SourceMetrics }) {
  return (
    <td className="px-3 py-3 text-right">
      <span className="font-semibold text-zinc-100">{numberFormat.format(metrics.count)}</span>
      {metrics.status7Day && (
        <span className={`mt-0.5 block whitespace-nowrap text-[10px] ${stockStatusClass(metrics.status7Day)}`}>
          {metrics.status7Day}
        </span>
      )}
    </td>
  );
}

function DohCell({ metrics }: { metrics: SourceMetrics }) {
  return (
    <td className="px-3 py-3 text-right text-zinc-300">
      {metrics.doh == null ? '—' : decimalFormat.format(metrics.doh)}
    </td>
  );
}

function FlagCell({ value }: { value: string }) {
  return (
    <td className="px-3 py-3">
      {value
        ? <span className="whitespace-nowrap rounded-full border border-rose-800 bg-rose-950 px-2 py-1 text-[10px] font-bold text-rose-300">{value}</span>
        : <span className="text-zinc-600">—</span>}
    </td>
  );
}

function FrameReportRow({ row }: { row: FrameDecantingRow }) {
  return (
    <tr className="group hover:bg-zinc-800/70">
      <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-[#15171b] px-3 py-3 text-left font-bold text-teal-400 group-hover:bg-zinc-800">{row.productId}</th>
      <td className="px-3 py-3 text-zinc-200">{row.brand || '—'}</td>
      <td className="px-3 py-3 text-zinc-300">{row.productType || '—'}</td>
      <td className="px-3 py-3 text-zinc-300">{row.plc || '—'}</td>
      <FlagCell value={row.flag} />
      <td className="px-3 py-3 text-right font-semibold text-zinc-100">{rosFormat.format(row.rosPerDayHighestMonth)}</td>
      <MetricCell metrics={row.sources.asrs} />
      <DohCell metrics={row.sources.asrs} />
      <MetricCell metrics={row.sources.nxs1} />
      <DohCell metrics={row.sources.nxs1} />
      <MetricCell metrics={row.sources.nxs2} />
      <DohCell metrics={row.sources.nxs2} />
      <MetricCell metrics={row.sources.eglManual} />
      <MetricCell metrics={row.sources.putawayPending} />
      <td className="px-3 py-3 text-right text-amber-300">{numberFormat.format(row.grnQty)}</td>
      <td className="px-3 py-3 text-xs text-zinc-300">{row.iqcStatus || '—'}</td>
      <td className="px-3 py-3 text-right text-cyan-300">{numberFormat.format(row.transferPendency)}</td>
      <td className="px-3 py-3 text-right text-orange-300">{numberFormat.format(row.bulkRequired)}</td>
      <td className={`px-3 py-3 text-right font-semibold ${row.sevenDayShortage > 0 ? 'text-rose-400' : 'text-zinc-100'}`}>{decimalFormat.format(row.sevenDayShortage)}</td>
      <td className="px-3 py-3">
        <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${decantBadgeClass(row.decantComment)}`}>{row.decantComment}</span>
      </td>
      <td className="px-3 py-3 text-xs leading-5 text-zinc-300">{row.comments || '—'}</td>
    </tr>
  );
}

function FilterSelect({
  id,
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  allLabel: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="min-w-[190px] flex-1 text-xs font-semibold text-zinc-300">
      <span className="mb-1.5 flex items-center gap-1.5"><FiFilter aria-hidden="true" /> {label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 focus:border-teal-500 disabled:opacity-50"
        disabled={!options.length}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function DecantingDashboard({ kind }: { kind: DecantingDashboardKind }) {
  const config = DASHBOARD_CONFIG[kind];
  const idPrefix = config.slug;
  const today = useMemo(todayInIndia, []);
  const [draftAsOfDate, setDraftAsOfDate] = useState(today);
  const [asOfDate, setAsOfDate] = useState(today);
  const [response, setResponse] = useState<DecantingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [decantFilter, setDecantFilter] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [flagFilter, setFlagFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const requestSequence = useRef(0);

  const dateError = useMemo(() => {
    if (!validCalendarDate(draftAsOfDate)) return 'Choose a valid as-of date.';
    if (draftAsOfDate > today) return 'As-of date cannot be in the future.';
    return '';
  }, [draftAsOfDate, today]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const requestQuery = useMemo(() => {
    const params = new URLSearchParams({
      asOfDate,
      page: String(page),
      pageSize: String(pageSize),
    });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (decantFilter) params.set('decantComment', decantFilter);
    if (productTypeFilter) params.set('productType', productTypeFilter);
    if (brandFilter) params.set('brand', brandFilter);
    if (flagFilter) params.set('flag', flagFilter);
    return params.toString();
  }, [
    asOfDate,
    brandFilter,
    debouncedSearch,
    decantFilter,
    flagFilter,
    page,
    pageSize,
    productTypeFilter,
  ]);

  const loadData = useCallback(async (force = false) => {
    const sequence = ++requestSequence.current;
    setLoading(true);
    setError('');
    setExportError('');
    setResponse((current) => current?.asOfDate === asOfDate ? current : null);
    try {
      const request = await fetch(`${config.apiPath}?${requestQuery}`, {
        cache: 'no-store',
        method: force ? 'POST' : 'GET',
      });
      const body = await request.json().catch(() => null) as (Partial<DecantingResponse> & { error?: unknown }) | null;
      if (!request.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : `Unable to load ${config.title}.`);
      }
      if (
        !body
        || !Array.isArray(body.rows)
        || !body.summary
        || !body.filteredSummary
        || !body.pagination
        || !body.filterOptions
        || typeof body.asOfDate !== 'string'
        || !body.rosWindow
        || typeof body.generatedAt !== 'string'
        || !body.sources
        || !body.sourceRows
        || !Array.isArray(body.warnings)
      ) {
        throw new Error(`${config.title} returned an unexpected response.`);
      }
      if (sequence === requestSequence.current) setResponse(body as DecantingResponse);
    } catch (loadError) {
      if (sequence === requestSequence.current) {
        setError(loadError instanceof Error ? loadError.message : `Unable to load ${config.title}.`);
      }
    } finally {
      if (sequence === requestSequence.current) setLoading(false);
    }
  }, [asOfDate, config.apiPath, config.title, requestQuery]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const rows = response?.rows ?? [];
  const filteredSummary = response?.filteredSummary;
  const decantOptions = response?.filterOptions.decantComments ?? [];
  const productTypeOptions = response?.filterOptions.productTypes ?? [];
  const brandOptions = response?.filterOptions.brands ?? [];
  const priorities = filteredSummary?.priority ?? {
    p0: 0,
    p1: 0,
    hhd: 0,
    extraInAsrs: 0,
    checkTransfers: 0,
  };
  const decantDistribution = filteredSummary?.decantDistribution ?? [];
  const inventorySources = (kind === 'lens' ? INVENTORY_SOURCES : FRAME_INVENTORY_SOURCES) as readonly {
    key: string;
    label: string;
    hasDoh: boolean;
  }[];
  const sourceTotals = (filteredSummary?.sourceTotals ?? Object.fromEntries(
    inventorySources.map((source) => [source.key, 0]),
  )) as Record<string, number>;
  const largestDecantGroup = Math.max(1, ...decantDistribution.map((item) => item.count));
  const largestSourceTotal = Math.max(
    1,
    ...Object.values(sourceTotals).map((total) => Math.max(0, total)),
  );
  const currentPage = response?.pagination.page ?? page;
  const totalRows = response?.pagination.totalRows ?? 0;
  const totalPages = Math.max(1, response?.pagination.totalPages ?? 1);
  const effectivePageSize = response?.pagination.pageSize ?? pageSize;
  const pageStart = totalRows ? (currentPage - 1) * effectivePageSize + 1 : 0;
  const pageEnd = totalRows ? pageStart + rows.length - 1 : 0;
  const hasActiveFilters = Boolean(
    search.trim() || decantFilter || productTypeFilter || brandFilter || flagFilter,
  );
  const searchPending = search.trim() !== debouncedSearch;
  const sourceRowCounts = {
    powerBi: sourceNumber(response?.sourceRows.powerBi),
    grn: sourceNumber(response?.sourceRows.grn),
    inventory: sourceNumber(response?.sourceRows.inventory),
    products: sourceNumber(response?.sourceRows.products),
    scopedPids: sourceNumber(response?.sourceRows.scopedPids),
  };

  const applyAsOfDate = () => {
    if (dateError || loading) return;
    if (draftAsOfDate === asOfDate) {
      if (page === 1) void loadData();
      else setPage(1);
      return;
    }
    setPage(1);
    setAsOfDate(draftAsOfDate);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDecantFilter('');
    setProductTypeFilter('');
    setBrandFilter('');
    setFlagFilter('');
    setPage(1);
  };

  const exportXlsx = async () => {
    if (!response || totalRows === 0 || exporting || searchPending) return;
    setExporting(true);
    setExportError('');
    try {
      const params = new URLSearchParams(requestQuery);
      params.set('export', 'xlsx');
      const request = await fetch(`${config.apiPath}?${params}`, {
        cache: 'no-store',
        method: 'GET',
      });
      if (!request.ok) {
        const body = await request.json().catch(() => null) as { error?: unknown } | null;
        throw new Error(typeof body?.error === 'string' ? body.error : `Unable to export ${config.title} XLSX.`);
      }
      const blob = await request.blob();
      const disposition = request.headers.get('content-disposition') || '';
      const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1]
        || `${config.slug}-${response.asOfDate}.xlsx`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (exportFailure) {
      setExportError(exportFailure instanceof Error ? exportFailure.message : `Unable to export ${config.title} XLSX.`);
    } finally {
      setExporting(false);
    }
  };

  const priorityCards = kind === 'lens' ? [
    { label: 'P0 Decant', value: priorities.p0, note: 'ASRS DOH up to 3 days', border: 'border-rose-500', text: 'text-rose-400' },
    { label: 'P1 Decant', value: priorities.p1, note: 'ASRS DOH between 3 and 7', border: 'border-orange-500', text: 'text-orange-400' },
    { label: 'HHD Decant', value: priorities.hhd, note: 'Available quantity up to 60', border: 'border-amber-500', text: 'text-amber-400' },
    { label: 'Check transfers', value: priorities.checkTransfers, note: 'Needs transfer review', border: 'border-violet-500', text: 'text-violet-400' },
    { label: 'Extra in ASRS', value: priorities.extraInAsrs, note: 'ASRS exceeds 7-day need', border: 'border-blue-500', text: 'text-blue-400' },
  ] : [
    { label: 'Decant 300', value: priorities.p0, note: 'Exclusive PLC replenishment', border: 'border-rose-500', text: 'text-rose-400' },
    { label: 'Decant 700', value: priorities.p1, note: 'Core PLC replenishment', border: 'border-orange-500', text: 'text-orange-400' },
    { label: 'Decant 7-day', value: priorities.hhd, note: 'Seven-day demand replenishment', border: 'border-amber-500', text: 'text-amber-400' },
    { label: 'Check transfers', value: priorities.checkTransfers, note: 'Needs transfer review', border: 'border-violet-500', text: 'text-violet-400' },
    { label: 'Over decanted', value: priorities.extraInAsrs, note: 'ASRS stock exceeds need', border: 'border-blue-500', text: 'text-blue-400' },
  ];

  return (
    <div className="-m-6 min-h-full bg-[#0c0d0f] p-4 text-zinc-100 sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-400">Stock In / {config.title}</p>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="mt-1 max-w-4xl text-sm text-zinc-400">
              {config.description}
            </p>
            {response && (
              <p className="mt-1 text-xs text-zinc-500">
                As of {formatDate(response.asOfDate)} · ROS window {formatDate(response.rosWindow.startDate)}–{formatDate(response.rosWindow.endDate)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400" aria-live="polite">
            <span className={`h-2 w-2 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {loading
              ? 'Source refresh running'
              : error
                ? 'Data unavailable'
                : `Updated ${response ? formatUpdatedAt(response.generatedAt) : ''}`}
          </div>
        </header>

        <section className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg" aria-label={`${config.title} filters`}>
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              applyAsOfDate();
            }}
          >
            <label htmlFor={`${idPrefix}-as-of-date`} className="min-w-[170px] text-xs font-semibold text-zinc-300">
              <span className="mb-1.5 flex items-center gap-1.5"><FiCalendar aria-hidden="true" /> As-of date</span>
              <input
                id={`${idPrefix}-as-of-date`}
                type="date"
                value={draftAsOfDate}
                max={today}
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? `${idPrefix}-date-error` : `${idPrefix}-date-help`}
                onChange={(event) => setDraftAsOfDate(event.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500"
              />
            </label>
            <label htmlFor={`${idPrefix}-search`} className="min-w-[250px] flex-[1.4] text-xs font-semibold text-zinc-300">
              <span className="mb-1.5 flex items-center gap-1.5"><FiSearch aria-hidden="true" /> Search</span>
              <input
                id={`${idPrefix}-search`}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="PID, brand, or product type"
                className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-teal-500"
              />
            </label>
            <FilterSelect
              id={`${idPrefix}-decant-filter`}
              label="Decant comment"
              value={decantFilter}
              allLabel="All decant priorities"
              options={decantOptions}
              onChange={(value) => {
                setDecantFilter(value);
                setPage(1);
              }}
            />
            <FilterSelect
              id={`${idPrefix}-product-filter`}
              label="Product type"
              value={productTypeFilter}
              allLabel="All product types"
              options={productTypeOptions}
              onChange={(value) => {
                setProductTypeFilter(value);
                setPage(1);
              }}
            />
            <FilterSelect
              id={`${idPrefix}-brand-filter`}
              label="Brand"
              value={brandFilter}
              allLabel="All brands"
              options={brandOptions}
              onChange={(value) => {
                setBrandFilter(value);
                setPage(1);
              }}
            />
            <label htmlFor={`${idPrefix}-flag-filter`} className="min-w-[170px] text-xs font-semibold text-zinc-300">
              <span className="mb-1.5 flex items-center gap-1.5"><FiFilter aria-hidden="true" /> PID flag</span>
              <select
                id={`${idPrefix}-flag-filter`}
                value={flagFilter}
                onChange={(event) => {
                  setFlagFilter(event.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 focus:border-teal-500"
              >
                <option value="">All PIDs</option>
                <option value="new">New PID</option>
                <option value="existing">Existing PID</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading || Boolean(dateError)}
              className="h-10 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply date
            </button>
            <button
              type="button"
              onClick={() => void loadData(true)}
              disabled={loading || searchPending}
              title={`Force-refresh every source for the applied date ${asOfDate}`}
              aria-label={`Force-refresh every ${config.title} source for ${asOfDate}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
            >
              <FiRefreshCw aria-hidden="true" className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={() => void exportXlsx()}
              disabled={!response || totalRows === 0 || loading || exporting || searchPending}
              title="Export all filtered rows as a colored XLSX workbook"
              aria-label={`Export all filtered ${config.title} rows as a colored XLSX workbook`}
              aria-busy={exporting}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
            >
              {exporting
                ? <FiRefreshCw aria-hidden="true" className="animate-spin" />
                : <FiDownload aria-hidden="true" />}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <FiX aria-hidden="true" /> Clear filters
              </button>
            )}
          </form>
          {dateError ? (
            <p id={`${idPrefix}-date-error`} role="alert" className="mt-2 text-xs font-medium text-amber-400">{dateError}</p>
          ) : (
            <p id={`${idPrefix}-date-help`} className="mt-3 text-xs text-zinc-500">
              {config.rosHelp} Force refresh bypasses the server’s {config.cacheHelp} source cache.
            </p>
          )}
          {response && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-800 pt-3 text-xs text-zinc-400" aria-live="polite">
              <span><b className="text-zinc-200">{numberFormat.format(totalRows)}</b> of {numberFormat.format(response.summary.totalPids)} PIDs match</span>
              <span>{numberFormat.format(response.filteredSummary.newPids)} new PIDs</span>
              <span>{numberFormat.format(response.filteredSummary.grnMatchedPids)} GRN-matched</span>
              <span>{numberFormat.format(response.filteredSummary.totalInventory)} total inventory</span>
            </div>
          )}
        </section>

        {error && (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
            <FiAlertCircle aria-hidden="true" className="shrink-0 text-lg" />
            <div className="min-w-0 flex-1"><b>{config.title} request failed.</b> {error}</div>
            <button type="button" onClick={() => void loadData()} disabled={loading} className="rounded-md border border-red-700 px-3 py-1.5 font-semibold hover:bg-red-900 disabled:opacity-50">Try again</button>
          </div>
        )}

        {exportError && (
          <div role="alert" className="flex items-center gap-3 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
            <FiAlertCircle aria-hidden="true" className="shrink-0 text-lg" />
            <div><b>XLSX export failed.</b> {exportError}</div>
          </div>
        )}

        {response && response.warnings.length > 0 && (
          <section aria-label="Source warnings" className="rounded-lg border border-amber-800 bg-amber-950/80 px-4 py-3 text-sm text-amber-200">
            <div className="flex items-start gap-3">
              <FiAlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-lg" />
              <div>
                <h2 className="font-bold">Source refresh completed with warnings</h2>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-amber-300">
                  {response.warnings.map((warning, index) => <li key={`${index}-${warning}`}>{warning}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-busy={loading} aria-label={`${config.title} priority summary`}>
          {priorityCards.map((card, index) => (
            <article
              key={card.label}
              className={`rounded-lg border-l-4 ${card.border} bg-[#191b20] p-4 shadow-lg ${index === priorityCards.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}
            >
              <p className="text-xs font-semibold uppercase text-zinc-400">{card.label}</p>
              <strong className={`mt-2 block text-2xl ${card.text}`}>{!response ? '—' : numberFormat.format(card.value)}</strong>
              <span className="text-xs text-zinc-400">{card.note}</span>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Decant priority distribution</h2>
                <p className="text-xs text-zinc-400">PID count by current business-rule outcome; select a bar to filter the report.</p>
              </div>
              <span className="text-xs text-zinc-400">{numberFormat.format(totalRows)} PIDs</span>
            </div>
            {loading && !response ? (
              <div className="space-y-4" aria-label="Loading priority distribution">
                {[1, 2, 3, 4, 5].map((key) => <div key={key} className="h-9 animate-pulse rounded bg-zinc-800" />)}
              </div>
            ) : !response ? (
              <div className="flex h-[230px] items-center justify-center rounded-lg border border-dashed border-zinc-700 px-4 text-center text-sm text-zinc-400">Priority data is unavailable. Retry the source request above.</div>
            ) : decantDistribution.length ? (
              <div className="max-h-[330px] space-y-3 overflow-auto pr-1">
                {decantDistribution.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setDecantFilter((current) => current === item.name ? '' : item.name);
                      setPage(1);
                    }}
                    aria-pressed={decantFilter === item.name}
                    className={`block w-full border-l-2 pl-2 text-left ${decantFilter === item.name ? 'border-teal-400' : 'border-transparent'}`}
                  >
                    <span className="mb-1 flex items-center justify-between gap-3 text-xs">
                      <b className="truncate text-zinc-200" title={item.name}>{item.name}</b>
                      <span className="text-zinc-400">{numberFormat.format(item.count)}</span>
                    </span>
                    <span className="block h-2 rounded-full bg-zinc-800">
                      <i
                        role="progressbar"
                        aria-label={`${item.name}: ${item.count} PIDs`}
                        aria-valuemin={0}
                        aria-valuemax={largestDecantGroup}
                        aria-valuenow={item.count}
                        className={`block h-full rounded-full ${decantBarClass(item.name)}`}
                        style={{ width: `${Math.max(2, (item.count / largestDecantGroup) * 100)}%` }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-[230px] items-center justify-center rounded-lg border border-dashed border-zinc-700 px-4 text-center text-sm text-zinc-400">No priorities match the selected filters.</div>
            )}
          </article>

          <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Inventory source totals</h2>
                <p className="text-xs text-zinc-400">Available quantities across every PID matching the current filters.</p>
              </div>
              {response && (
                <div className="flex flex-wrap justify-end gap-1.5 text-[10px]">
                  <span className={`rounded-full border px-2 py-1 ${sourceHealthClass(response.sources.powerBi)}`}>Power BI: {response.sources.powerBi ?? 'unknown'}</span>
                  <span className={`rounded-full border px-2 py-1 ${sourceHealthClass(response.sources.googleSheets)}`}>Sheets: {response.sources.googleSheets ?? 'unknown'}</span>
                  <span className={`rounded-full border px-2 py-1 ${sourceHealthClass(response.sources.bigQuery)}`}>BigQuery: {response.sources.bigQuery ?? 'unknown'}</span>
                </div>
              )}
            </div>
            {loading && !response ? (
              <div className="space-y-3" aria-label="Loading source totals">
                {[1, 2, 3, 4, 5, 6].map((key) => <div key={key} className="h-7 animate-pulse rounded bg-zinc-800" />)}
              </div>
            ) : !response ? (
              <div className="flex h-[230px] items-center justify-center rounded-lg border border-dashed border-zinc-700 px-4 text-center text-sm text-zinc-400">Inventory source totals are unavailable.</div>
            ) : (
              <div className="grid max-h-[330px] gap-x-5 gap-y-3 overflow-auto pr-1 sm:grid-cols-2">
                {inventorySources.map((source) => {
                  const total = sourceTotals[source.key] ?? 0;
                  const visualTotal = Math.max(0, total);
                  return (
                    <div key={source.key}>
                      <span className="mb-1 flex items-center justify-between gap-3 text-xs">
                        <b className="truncate text-zinc-200">{source.label}</b>
                        <span className="text-zinc-400">{numberFormat.format(total)}</span>
                      </span>
                      <span className="block h-2 rounded-full bg-zinc-800">
                        <i
                          role="progressbar"
                          aria-label={`${source.label}: ${total} units`}
                          aria-valuemin={0}
                          aria-valuemax={largestSourceTotal}
                          aria-valuenow={visualTotal}
                          className={`block h-full rounded-full ${SOURCE_BAR_CLASS[source.key] ?? 'bg-teal-500'}`}
                          style={{ width: `${visualTotal ? Math.max(2, (visualTotal / largestSourceTotal) * 100) : 0}%` }}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {response && (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-800 pt-3 text-[11px] text-zinc-500">
                {sourceRowCounts.powerBi != null && <span>Power BI: {numberFormat.format(sourceRowCounts.powerBi)} rows</span>}
                {sourceRowCounts.grn != null && <span>GRN: {numberFormat.format(sourceRowCounts.grn)} rows</span>}
                {sourceRowCounts.inventory != null && sourceRowCounts.scopedPids != null && <span>Inventory: {numberFormat.format(sourceRowCounts.inventory)}/{numberFormat.format(sourceRowCounts.scopedPids)} PIDs</span>}
                {sourceRowCounts.products != null && sourceRowCounts.scopedPids != null && <span>Products: {numberFormat.format(sourceRowCounts.products)}/{numberFormat.format(sourceRowCounts.scopedPids)} PIDs</span>}
              </div>
            )}
          </article>
        </section>

        <section className="overflow-hidden rounded-lg border border-zinc-700 bg-[#15171b] shadow-lg" aria-busy={loading}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700 px-4 py-3">
            <div>
              <h2 className="text-base font-bold text-white">PID-level decanting report</h2>
              <p className="text-xs text-zinc-400">ROS, source availability, DOH coverage, GRN context, and final business comments.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span aria-live="polite">Showing {numberFormat.format(pageStart)}–{numberFormat.format(pageEnd)} of {numberFormat.format(totalRows)}</span>
              <label htmlFor={`${idPrefix}-page-size`} className="flex items-center gap-2">
                Rows
                <select
                  id={`${idPrefix}-page-size`}
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="h-8 rounded-md border border-zinc-600 bg-zinc-900 px-2 text-zinc-200 outline-none focus:border-teal-500"
                >
                  {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div
            role="region"
            aria-label={`Scrollable PID-level ${config.title} report`}
            tabIndex={0}
            className="max-h-[560px] overflow-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
          >
            <table className="w-full min-w-[2650px] border-collapse text-sm">
              <caption className="sr-only">Detailed PID-level {config.title} report</caption>
              <thead className="sticky top-0 z-20 bg-zinc-800 text-left text-[11px] uppercase tracking-wide text-zinc-300">
                {kind === 'lens' ? (
                  <tr>
                  <th scope="col" className="sticky left-0 z-30 min-w-[130px] bg-zinc-800 px-3 py-3">Product ID</th>
                  <th scope="col" className="min-w-[170px] px-3 py-3">HSN</th>
                  <th scope="col" className="min-w-[150px] px-3 py-3">Brand</th>
                  <th scope="col" className="min-w-[170px] px-3 py-3">Product type</th>
                  <th scope="col" className="px-3 py-3">Flag</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">ROS units</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">ROS / day</th>
                  <th scope="col" className="px-3 py-3 text-right">ASRS</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">ASRS DOH</th>
                  <th scope="col" className="px-3 py-3 text-right">NXS1</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">NXS1 DOH</th>
                  <th scope="col" className="px-3 py-3 text-right">NXS2</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">NXS2 DOH</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Putaway pending</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">7-day req.</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">7-day shortage</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Other than ASRS</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">GRN qty</th>
                  <th scope="col" className="min-w-[130px] px-3 py-3">IQC status</th>
                  <th scope="col" className="min-w-[250px] px-3 py-3">Decant comment</th>
                  <th scope="col" className="min-w-[400px] px-3 py-3">Comments</th>
                  </tr>
                ) : (
                  <tr>
                    <th scope="col" className="sticky left-0 z-30 min-w-[130px] bg-zinc-800 px-3 py-3">Product ID</th>
                    <th scope="col" className="min-w-[150px] px-3 py-3">Brand</th>
                    <th scope="col" className="min-w-[170px] px-3 py-3">Product type</th>
                    <th scope="col" className="min-w-[130px] px-3 py-3">PLC</th>
                    <th scope="col" className="px-3 py-3">Flag</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Highest-month ROS</th>
                    <th scope="col" className="px-3 py-3 text-right">ASRS</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">ASRS DOH</th>
                    <th scope="col" className="px-3 py-3 text-right">NXS1</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">NXS1 DOH</th>
                    <th scope="col" className="px-3 py-3 text-right">NXS2</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">NXS2 DOH</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">EGL manual</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Putaway pending</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">GRN qty</th>
                    <th scope="col" className="min-w-[130px] px-3 py-3">IQC status</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Transfer pendency</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">Bulk required</th>
                    <th scope="col" className="whitespace-nowrap px-3 py-3 text-right">7-day shortage</th>
                    <th scope="col" className="min-w-[250px] px-3 py-3">Decant comment</th>
                    <th scope="col" className="min-w-[400px] px-3 py-3">Comments</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading && !response ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index} aria-hidden="true">
                      <td colSpan={21} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-zinc-800" /></td>
                    </tr>
                  ))
                ) : kind === 'lens' && rows.length ? (rows as LensDecantingRow[]).map((row) => (
                  <tr key={row.productId} className="group hover:bg-zinc-800/70">
                    <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-[#15171b] px-3 py-3 text-left font-bold text-teal-400 group-hover:bg-zinc-800">{row.productId}</th>
                    <td className="px-3 py-3 text-zinc-300">{row.hsnClassification || '—'}</td>
                    <td className="px-3 py-3 text-zinc-200">{row.brand || '—'}</td>
                    <td className="px-3 py-3 text-zinc-300">{row.productType || '—'}</td>
                    <td className="px-3 py-3">
                      {row.flag ? <span className="whitespace-nowrap rounded-full border border-rose-800 bg-rose-950 px-2 py-1 text-[10px] font-bold text-rose-300">{row.flag}</span> : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-zinc-300">{rosFormat.format(row.rosUnits7Day)}</td>
                    <td className="px-3 py-3 text-right font-semibold text-zinc-100">{rosFormat.format(row.rosPerDay7Day)}</td>
                    <MetricCell metrics={row.sources.asrs} />
                    <DohCell metrics={row.sources.asrs} />
                    <MetricCell metrics={row.sources.nxs1} />
                    <DohCell metrics={row.sources.nxs1} />
                    <MetricCell metrics={row.sources.nxs2} />
                    <DohCell metrics={row.sources.nxs2} />
                    <td className="px-3 py-3 text-right font-semibold text-orange-300">{numberFormat.format(row.sources.putawayPending.count)}</td>
                    <td className="px-3 py-3 text-right text-zinc-300">{decimalFormat.format(row.sevenDayRequirement)}</td>
                    <td className={`px-3 py-3 text-right font-semibold ${row.sevenDayShortage > 0 ? 'text-rose-400' : 'text-zinc-100'}`}>{decimalFormat.format(row.sevenDayShortage)}</td>
                    <td className={`px-3 py-3 text-right font-semibold ${row.availableOtherThanAsrs > 0 ? 'text-teal-400' : 'text-zinc-400'}`}>{numberFormat.format(row.availableOtherThanAsrs)}</td>
                    <td className="px-3 py-3 text-right text-amber-300">{numberFormat.format(row.grnQty)}</td>
                    <td className="px-3 py-3 text-xs text-zinc-300">{row.iqcStatus || '—'}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${decantBadgeClass(row.decantComment)}`}>{row.decantComment}</span>
                    </td>
                    <td className="px-3 py-3 text-xs leading-5 text-zinc-300">{row.comments || '—'}</td>
                  </tr>
                )) : rows.length ? (rows as FrameDecantingRow[]).map((row) => (
                  <FrameReportRow key={row.productId} row={row} />
                )) : (
                  <tr>
                    <td colSpan={21} className="px-4 py-16 text-center text-zinc-400">
                      {!response
                        ? `${config.title} data is unavailable. Retry the source request above.`
                        : hasActiveFilters
                          ? 'No PIDs match the selected search and filters.'
                          : `No ${config.title} records are available for this as-of date.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-700 px-4 py-3 text-xs text-zinc-400" aria-label={`${config.title} report pagination`}>
            <span>Page {numberFormat.format(currentPage)} of {numberFormat.format(totalPages)}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={loading || currentPage <= 1}
                className="flex h-9 items-center gap-1 rounded-lg border border-zinc-600 bg-zinc-900 px-3 font-semibold text-zinc-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft aria-hidden="true" /> Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={loading || currentPage >= totalPages}
                className="flex h-9 items-center gap-1 rounded-lg border border-zinc-600 bg-zinc-900 px-3 font-semibold text-zinc-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
}
