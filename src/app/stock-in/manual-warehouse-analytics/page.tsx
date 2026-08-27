'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronDown,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiClock,
} from 'react-icons/fi';

type AnalyticsRow = {
  date: string;
  itemType: string;
  inputScope: string;
  inbound: number;
  fromEglPl: number;
  direct: number;
};

type ApiResponse = {
  range: DateTimeRange;
  timeZone: 'Asia/Kolkata';
  data: AnalyticsRow[];
  generatedAt: string;
};

type DateTimeRange = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

type DailyRow = {
  date: string;
  inbound: number;
  fromEglPl: number;
  direct: number;
};

const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 330 * 60_000;
const DEFAULT_WINDOW_MS = 48 * 60 * 60_000;
const numberFormat = new Intl.NumberFormat('en-IN');
const API_PATH = '/api/stock-in/manual-warehouse-analytics';
const DESTINATION = 'the manual warehouse';
const DESTINATION_LABEL = 'Manual Warehouse';
const METRIC_LABEL = 'manual WH';
const FILENAME_SLUG = 'manual-warehouse-analytics';
const TREND_LOCATION = 'configured manual warehouse locations';

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultRange() {
  const now = Date.now();
  const start = new Date(now - DEFAULT_WINDOW_MS + IST_OFFSET_MS);
  const end = new Date(now + IST_OFFSET_MS);
  return {
    startDate: isoDate(start),
    startTime: start.toISOString().slice(11, 16),
    endDate: isoDate(end),
    endTime: end.toISOString().slice(11, 16),
  };
}

function inputScope(row: AnalyticsRow) {
  return String(row.inputScope || '').trim() || 'Unclassified input';
}

function rangeError(range: DateTimeRange) {
  if (!range.startDate || !range.endDate) return 'Choose both a start date and an end date.';
  if (!range.startTime || !range.endTime) return 'Choose both a start time and an end time.';
  const start = new Date(`${range.startDate}T${range.startTime}:00Z`);
  const end = new Date(`${range.endDate}T${range.endTime}:00Z`);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return 'Choose a valid date and time range.';
  if (end < start) return 'End date and time cannot be earlier than start date and time.';
  const spanDays = Math.floor(
    (new Date(`${range.endDate}T00:00:00Z`).getTime() - new Date(`${range.startDate}T00:00:00Z`).getTime()) / DAY_MS,
  ) + 1;
  if (spanDays < 1 || spanDays > 62) return 'Select a date range between 1 and 62 days.';
  return '';
}

function formatDate(value: string, withYear = false) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

function csvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function dailySeries(rows: AnalyticsRow[], startDate: string, endDate: string): DailyRow[] {
  const totals = new Map<string, DailyRow>();
  for (const row of rows) {
    const current = totals.get(row.date) || { date: row.date, inbound: 0, fromEglPl: 0, direct: 0 };
    current.inbound += row.inbound;
    current.fromEglPl += row.fromEglPl;
    current.direct += row.direct;
    totals.set(row.date, current);
  }

  const result: DailyRow[] = [];
  for (
    let cursor = new Date(`${startDate}T00:00:00Z`);
    cursor <= new Date(`${endDate}T00:00:00Z`);
    cursor = new Date(cursor.getTime() + DAY_MS)
  ) {
    const date = isoDate(cursor);
    result.push(totals.get(date) || { date, inbound: 0, fromEglPl: 0, direct: 0 });
  }
  return result;
}

function TrendChart({ rows }: { rows: DailyRow[] }) {
  const width = 920;
  const height = 280;
  const inset = { top: 22, right: 18, bottom: 40, left: 54 };
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;
  const maximum = Math.max(1, ...rows.flatMap((row) => [row.inbound, row.fromEglPl, row.direct]));
  const ceiling = Math.ceil(maximum / 10) * 10 || 10;
  const x = (index: number) => inset.left + (rows.length <= 1 ? plotWidth / 2 : (index / (rows.length - 1)) * plotWidth);
  const y = (value: number) => inset.top + plotHeight - (value / ceiling) * plotHeight;
  const path = (key: keyof Pick<DailyRow, 'inbound' | 'fromEglPl' | 'direct'>) =>
    rows.map((row, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(1)} ${y(row[key]).toFixed(1)}`).join(' ');
  const labelStep = Math.max(1, Math.ceil(rows.length / 6));

  return (
    <div className="min-h-[280px] w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label="Daily Manual Warehouse inbound trend">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = Math.round(ceiling * (1 - ratio));
          const lineY = inset.top + plotHeight * ratio;
          return (
            <g key={ratio}>
              <line x1={inset.left} y1={lineY} x2={width - inset.right} y2={lineY} stroke="#34363c" strokeWidth="1" />
              <text x={inset.left - 10} y={lineY + 4} textAnchor="end" fontSize="11" fill="#a1a1aa">{numberFormat.format(value)}</text>
            </g>
          );
        })}
        <path d={path('inbound')} fill="none" stroke="#0f766e" strokeWidth="3" />
        <path d={path('fromEglPl')} fill="none" stroke="#2563eb" strokeWidth="2.5" />
        <path d={path('direct')} fill="none" stroke="#ea580c" strokeWidth="2.5" />
        {rows.map((row, index) => (
          <g key={row.date}>
            <circle cx={x(index)} cy={y(row.inbound)} r="3.5" fill="#15171b" stroke="#2dd4bf" strokeWidth="2">
              <title>{`${formatDate(row.date, true)}: ${numberFormat.format(row.inbound)} inbound`}</title>
            </circle>
            {(index % labelStep === 0 || index === rows.length - 1) && (
              <text x={x(index)} y={height - 14} textAnchor="middle" fontSize="11" fill="#a1a1aa">{formatDate(row.date)}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ManualWarehouseAnalyticsPage() {
  const defaults = useMemo(defaultRange, []);
  const [draftRange, setDraftRange] = useState(defaults);
  const [range, setRange] = useState(defaults);
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([]);
  const [selectedInputScopes, setSelectedInputScopes] = useState<string[]>([]);
  const [hsnFilterOpen, setHsnFilterOpen] = useState(false);
  const [scopeFilterOpen, setScopeFilterOpen] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const draftRangeError = useMemo(() => rangeError(draftRange), [draftRange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(range);
      const request = await fetch(`${API_PATH}?${params}`, { cache: 'no-store' });
      const body = await request.json();
      if (!request.ok) throw new Error(body.error || 'Unable to load analytics.');
      setResponse(body as ApiResponse);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load analytics.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const itemTypes = useMemo(
    () => [...new Set((response?.data || []).map((row) => row.itemType))].sort((a, b) => a.localeCompare(b)),
    [response?.data],
  );
  const inputScopes = useMemo(
    () => [...new Set((response?.data || []).map(inputScope))].sort((a, b) => a.localeCompare(b)),
    [response?.data],
  );

  useEffect(() => {
    setSelectedItemTypes((current) => current.filter((type) => itemTypes.includes(type)));
  }, [itemTypes]);

  useEffect(() => {
    setSelectedInputScopes((current) => current.filter((scope) => inputScopes.includes(scope)));
  }, [inputScopes]);

  const scopeFilteredRows = useMemo(
    () => (response?.data || []).filter((row) => !selectedInputScopes.length || selectedInputScopes.includes(inputScope(row))),
    [selectedInputScopes, response?.data],
  );
  const itemTypeFilteredRows = useMemo(
    () => (response?.data || []).filter((row) => !selectedItemTypes.length || selectedItemTypes.includes(row.itemType)),
    [selectedItemTypes, response?.data],
  );
  const filteredRows = useMemo(
    () => scopeFilteredRows.filter((row) => !selectedItemTypes.length || selectedItemTypes.includes(row.itemType)),
    [scopeFilteredRows, selectedItemTypes],
  );
  const daily = useMemo(
    () => dailySeries(filteredRows, range.startDate, range.endDate),
    [filteredRows, range.endDate, range.startDate],
  );
  const totals = useMemo(() => filteredRows.reduce(
    (sum, row) => ({
      inbound: sum.inbound + row.inbound,
      fromEglPl: sum.fromEglPl + row.fromEglPl,
      direct: sum.direct + row.direct,
    }),
    { inbound: 0, fromEglPl: 0, direct: 0 },
  ), [filteredRows]);
  const peak = useMemo(
    () => daily.reduce((best, row) => row.inbound > best.inbound ? row : best, daily[0] || { date: '', inbound: 0, fromEglPl: 0, direct: 0 }),
    [daily],
  );
  const classifications = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const row of scopeFilteredRows) grouped.set(row.itemType, (grouped.get(row.itemType) || 0) + row.inbound);
    return [...grouped.entries()].map(([name, inbound]) => ({ name, inbound })).sort((a, b) => b.inbound - a.inbound);
  }, [scopeFilteredRows]);
  const inputScopeDistribution = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const row of itemTypeFilteredRows) {
      const scope = inputScope(row);
      grouped.set(scope, (grouped.get(scope) || 0) + row.inbound);
    }
    return [...grouped.entries()]
      .map(([name, inbound]) => ({ name, inbound }))
      .sort((a, b) => b.inbound - a.inbound || a.name.localeCompare(b.name));
  }, [itemTypeFilteredRows]);
  const maximumDay = Math.max(1, ...daily.map((row) => row.inbound));
  const priorShare = totals.inbound ? (totals.fromEglPl / totals.inbound) * 100 : 0;
  const reportItemTypes = selectedItemTypes.length ? selectedItemTypes : itemTypes;
  const daywiseReport = useMemo(() => daily.map((day) => {
    const values = Object.fromEntries(reportItemTypes.map((type) => [type, 0])) as Record<string, number>;
    for (const row of filteredRows) {
      if (row.date === day.date) values[row.itemType] = (values[row.itemType] || 0) + row.inbound;
    }
    return { date: day.date, values, total: Object.values(values).reduce((sum, value) => sum + value, 0) };
  }), [daily, filteredRows, reportItemTypes]);
  const scopeDaywiseReport = useMemo(() => {
    const grouped = new Map<string, { date: string; inputScope: string; values: Record<string, number> }>();
    for (const row of filteredRows) {
      const scope = inputScope(row);
      const key = `${row.date}\u0000${scope}`;
      const current = grouped.get(key) || {
        date: row.date,
        inputScope: scope,
        values: Object.fromEntries(reportItemTypes.map((type) => [type, 0])) as Record<string, number>,
      };
      current.values[row.itemType] = (current.values[row.itemType] || 0) + row.inbound;
      grouped.set(key, current);
    }
    return [...grouped.values()]
      .map((row) => ({
        ...row,
        total: Object.values(row.values).reduce((sum, value) => sum + value, 0),
      }))
      .sort((a, b) => a.date.localeCompare(b.date) || a.inputScope.localeCompare(b.inputScope));
  }, [filteredRows, reportItemTypes]);

  const toggleItemType = (type: string) => {
    setSelectedItemTypes((current) => current.includes(type)
      ? current.filter((item) => item !== type)
      : [...current, type]);
  };

  const toggleInputScope = (scope: string) => {
    setSelectedInputScopes((current) => current.includes(scope)
      ? current.filter((item) => item !== scope)
      : [...current, scope]);
  };

  const applyRange = () => {
    setSelectedItemTypes([]);
    setSelectedInputScopes([]);
    setRange(draftRange);
  };

  const exportCsv = () => {
    if (!scopeDaywiseReport.length) return;
    const header = ['Date', 'Input prefix / scope', ...reportItemTypes, 'Daily total'];
    const lines = [header, ...scopeDaywiseReport.map((row) => [
      row.date,
      row.inputScope,
      ...reportItemTypes.map((type) => row.values[type] || 0),
      row.total,
    ])]
      .map((row) => row.map(csvCell).join(','));
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    const startStamp = `${range.startDate}-${range.startTime.replace(':', '')}`;
    const endStamp = `${range.endDate}-${range.endTime.replace(':', '')}`;
    link.download = `${FILENAME_SLUG}-${startStamp}-to-${endStamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="-m-6 min-h-full bg-[#0c0d0f] p-6 text-zinc-100">
    <div className="mx-auto max-w-[1600px] space-y-5 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-teal-400">Stock In / {DESTINATION_LABEL}</p>
          <h1 className="text-2xl font-bold text-white">Manual Warehouse Analytics</h1>
          <p className="mt-1 text-sm text-zinc-400">Daily new inbound movement into {DESTINATION}, classified by input prefix, HSN, and upstream EGL/PL history.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className={`h-2 w-2 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {loading ? 'Query running' : error ? 'Data unavailable' : `Updated ${response ? new Date(response.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}`}
        </div>
      </header>

      <section className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
        <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[150px] flex-1 text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiCalendar /> Start date</span>
          <input type="date" value={draftRange.startDate} max={draftRange.endDate} onChange={(event) => setDraftRange((current) => ({ ...current, startDate: event.target.value }))} className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500" />
        </label>
        <label className="min-w-[130px] flex-1 text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiClock /> Start time (IST)</span>
          <input type="time" step="60" value={draftRange.startTime} onChange={(event) => setDraftRange((current) => ({ ...current, startTime: event.target.value }))} className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500" />
        </label>
        <label className="min-w-[150px] flex-1 text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiCalendar /> End date</span>
          <input type="date" value={draftRange.endDate} min={draftRange.startDate} onChange={(event) => setDraftRange((current) => ({ ...current, endDate: event.target.value }))} className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500" />
        </label>
        <label className="min-w-[130px] flex-1 text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiClock /> End time (IST)</span>
          <input type="time" step="60" value={draftRange.endTime} onChange={(event) => setDraftRange((current) => ({ ...current, endTime: event.target.value }))} className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500" />
        </label>
        <div className="relative min-w-[240px] flex-[1.4] text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiFilter /> HSN classification</span>
          <button type="button" onClick={() => { setHsnFilterOpen((open) => !open); setScopeFilterOpen(false); }} disabled={!itemTypes.length} className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-left text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 disabled:opacity-50">
            <span className="truncate">{selectedItemTypes.length ? `${selectedItemTypes.length} selected` : 'All classifications'}</span><FiChevronDown className={hsnFilterOpen ? 'rotate-180' : ''} />
          </button>
          {hsnFilterOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-[280px] overflow-auto rounded-lg border border-zinc-600 bg-zinc-900 p-2 shadow-2xl">
              <button type="button" onClick={() => setSelectedItemTypes([])} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800">
                <input type="checkbox" readOnly checked={!selectedItemTypes.length} className="accent-teal-500" /> All classifications
              </button>
              {itemTypes.map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-normal text-zinc-200 hover:bg-zinc-800">
                  <input type="checkbox" checked={selectedItemTypes.includes(type)} onChange={() => toggleItemType(type)} className="accent-teal-500" /><span className="truncate">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="relative min-w-[240px] flex-[1.4] text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiFilter /> Input prefix / scope</span>
          <button type="button" onClick={() => { setScopeFilterOpen((open) => !open); setHsnFilterOpen(false); }} disabled={!inputScopes.length} className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-left text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 disabled:opacity-50">
            <span className="truncate">{selectedInputScopes.length ? `${selectedInputScopes.length} selected` : 'All input scopes'}</span><FiChevronDown className={scopeFilterOpen ? 'rotate-180' : ''} />
          </button>
          {scopeFilterOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-[300px] overflow-auto rounded-lg border border-zinc-600 bg-zinc-900 p-2 shadow-2xl">
              <button type="button" onClick={() => setSelectedInputScopes([])} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800">
                <input type="checkbox" readOnly checked={!selectedInputScopes.length} className="accent-teal-500" /> All input scopes
              </button>
              {inputScopes.map((scope) => (
                <label key={scope} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-normal text-zinc-200 hover:bg-zinc-800">
                  <input type="checkbox" checked={selectedInputScopes.includes(scope)} onChange={() => toggleInputScope(scope)} className="accent-teal-500" /><span className="truncate" title={scope}>{scope}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={applyRange} disabled={loading || Boolean(draftRangeError)} className="h-10 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">Apply range</button>
        <button type="button" onClick={() => void loadData()} disabled={loading} title="Refresh BigQuery data" aria-label="Refresh BigQuery data" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"><FiRefreshCw className={loading ? 'animate-spin' : ''} /></button>
        <button type="button" onClick={exportCsv} disabled={!filteredRows.length} title="Export day-wise input-scope report" aria-label="Export day-wise input-scope report" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"><FiDownload /></button>
        </div>
        {draftRangeError ? (
          <p role="alert" className="mt-2 text-xs font-medium text-amber-400">{draftRangeError}</p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">Defaults to the rolling last 48 hours through the current IST minute. UTC database timestamps are converted automatically; the end minute is inclusive.</p>
        )}
      </section>

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
          <FiAlertCircle className="shrink-0 text-lg" /><div><b>BigQuery request failed.</b> {error}</div>
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-busy={loading}>
        <article className="rounded-lg border-l-4 border-teal-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">New {METRIC_LABEL} inbound</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.inbound)}</strong><span className="text-xs text-zinc-400">Distinct barcode-days</span></article>
        <article className="rounded-lg border-l-4 border-blue-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">From EGL / PL</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.fromEglPl)}</strong><span className="text-xs text-zinc-400">Prior movement detected</span></article>
        <article className="rounded-lg border-l-4 border-orange-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">Direct to {METRIC_LABEL}</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.direct)}</strong><span className="text-xs text-zinc-400">No EGL / PL history</span></article>
        <article className="rounded-lg border-l-4 border-violet-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">EGL / PL share</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : `${priorShare.toFixed(1)}%`}</strong><span className="text-xs text-zinc-400">Of selected inbound</span></article>
        <article className="col-span-2 rounded-lg border-l-4 border-rose-500 bg-[#191b20] p-4 shadow-lg lg:col-span-1"><p className="text-xs font-semibold uppercase text-zinc-400">Peak day</p><strong className="mt-2 block text-2xl text-white">{loading || !peak.date ? '-' : numberFormat.format(peak.inbound)}</strong><span className="text-xs text-zinc-400">{peak.date ? formatDate(peak.date, true) : 'No movement'}</span></article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.7fr)_minmax(270px,0.7fr)]">
        <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-base font-bold text-white">Daily inbound trend</h2><p className="text-xs text-zinc-400">Distinct barcodes entering {TREND_LOCATION}</p></div>
            <div className="flex flex-wrap gap-3 text-xs text-zinc-300"><span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-teal-400" />Inbound</span><span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-blue-500" />EGL / PL</span><span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-orange-500" />Direct</span></div>
          </div>
          {loading ? <div className="h-[280px] animate-pulse rounded-lg bg-zinc-800" /> : <TrendChart rows={daily} />}
        </article>

        <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
          <div className="mb-4"><h2 className="text-base font-bold text-white">HSN mix</h2><p className="text-xs text-zinc-400">Inbound contribution by classification</p></div>
          <div className="max-h-[300px] space-y-3 overflow-auto pr-1">
            {classifications.length ? classifications.map((classification) => (
              <button key={classification.name} type="button" onClick={() => toggleItemType(classification.name)} className={`block w-full border-l-2 pl-2 text-left ${selectedItemTypes.includes(classification.name) ? 'border-teal-400' : 'border-transparent'}`} title={`Toggle ${classification.name}`}>
                <span className="mb-1 flex items-center justify-between gap-3 text-xs"><b className="truncate text-zinc-200">{classification.name}</b><span className="text-zinc-400">{numberFormat.format(classification.inbound)}</span></span>
                <span className="block h-2 bg-zinc-800"><i className="block h-full bg-violet-500" style={{ width: `${totalsForClassifications(classifications, classification.inbound)}%` }} /></span>
              </button>
            )) : <p className="py-12 text-center text-sm text-zinc-400">No classifications in this range</p>}
          </div>
        </article>

        <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
          <div className="mb-4"><h2 className="text-base font-bold text-white">Input scope mix</h2><p className="text-xs text-zinc-400">Inbound grouped by the matched location-prefix scope</p></div>
          <div className="max-h-[300px] space-y-3 overflow-auto pr-1">
            {inputScopeDistribution.length ? inputScopeDistribution.map((scope) => (
              <button key={scope.name} type="button" onClick={() => toggleInputScope(scope.name)} className={`block w-full border-l-2 pl-2 text-left ${selectedInputScopes.includes(scope.name) ? 'border-teal-400' : 'border-transparent'}`} title={`Toggle ${scope.name}`}>
                <span className="mb-1 flex items-center justify-between gap-3 text-xs"><b className="truncate text-zinc-200" title={scope.name}>{scope.name}</b><span className="text-zinc-400">{numberFormat.format(scope.inbound)}</span></span>
                <span className="block h-2 bg-zinc-800"><i className="block h-full bg-cyan-500" style={{ width: `${totalsForClassifications(inputScopeDistribution, scope.inbound)}%` }} /></span>
              </button>
            )) : <p className="py-12 text-center text-sm text-zinc-400">No input scopes in this range</p>}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
        <div className="mb-4"><h2 className="text-base font-bold text-white">Daily source split</h2><p className="text-xs text-zinc-400">EGL/PL history versus direct {DESTINATION_LABEL} inbound</p></div>
        <div className="flex h-[230px] items-end gap-1 overflow-x-auto border-b border-zinc-700 px-1 pt-4">
          {daily.map((row) => (
            <div key={row.date} className="flex h-full min-w-[24px] flex-1 flex-col items-center justify-end gap-1" title={`${formatDate(row.date, true)}: ${row.fromEglPl} EGL/PL, ${row.direct} direct`}>
              <span className="text-[10px] text-zinc-400">{row.inbound || ''}</span>
              <div className="flex w-full max-w-[34px] flex-col justify-end" style={{ height: `${Math.max(2, (row.inbound / maximumDay) * 170)}px` }}>
                <i className="block bg-blue-600" style={{ height: `${row.inbound ? (row.fromEglPl / row.inbound) * 100 : 0}%` }} />
                <i className="block bg-orange-500" style={{ height: `${row.inbound ? (row.direct / row.inbound) * 100 : 0}%` }} />
              </div>
              <small className="whitespace-nowrap text-[9px] text-zinc-400">{formatDate(row.date)}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-700 bg-[#15171b] shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700 px-4 py-3"><div><h2 className="text-base font-bold text-white">Number Reporting</h2><p className="text-xs text-zinc-400">Day-wise sum for {selectedItemTypes.length ? `${selectedItemTypes.length} chosen HSN classifications` : 'all HSN classifications'} across {selectedInputScopes.length ? `${selectedInputScopes.length} chosen input scopes` : 'all input scopes'}</p></div><span className="text-xs text-zinc-400">{numberFormat.format(daywiseReport.length)} days</span></div>
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="sticky top-0 bg-zinc-800 text-left text-xs uppercase text-zinc-300"><tr><th className="sticky left-0 bg-zinc-800 px-4 py-3">Date</th>{reportItemTypes.map((type) => <th key={type} className="whitespace-nowrap px-4 py-3 text-right">{type}</th>)}<th className="whitespace-nowrap px-4 py-3 text-right">Daily total</th></tr></thead>
            <tbody className="divide-y divide-zinc-800">
              {daywiseReport.length ? daywiseReport.map((row) => (
                <tr key={row.date} className="hover:bg-zinc-800/70"><td className="sticky left-0 whitespace-nowrap bg-[#15171b] px-4 py-3 font-medium text-zinc-300">{formatDate(row.date, true)}</td>{reportItemTypes.map((type) => <td key={type} className="px-4 py-3 text-right text-zinc-200">{numberFormat.format(row.values[type] || 0)}</td>)}<td className="px-4 py-3 text-right font-bold text-teal-400">{numberFormat.format(row.total)}</td></tr>
              )) : <tr><td colSpan={reportItemTypes.length + 2} className="px-4 py-12 text-center text-zinc-400">No manual warehouse movement found for the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </div>
  );
}

function totalsForClassifications(rows: Array<{ inbound: number }>, value: number) {
  const maximum = Math.max(1, ...rows.map((row) => row.inbound));
  return Math.max(2, (value / maximum) * 100);
}
