'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronDown,
  FiDownload,
  FiFilter,
  FiMapPin,
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

type OutwardAnalyticsRow = {
  date: string;
  itemType: string;
  outputScope: string;
  outward: number;
};

type ApiResponse = {
  range: DateTimeRange;
  timeZone: 'Asia/Kolkata';
  data: AnalyticsRow[];
  outputScopes: string[];
  outwardData: OutwardAnalyticsRow[];
  generatedAt: string;
  cache?: {
    status: 'hit' | 'stale' | 'miss' | 'refreshed';
    refreshing: boolean;
    expiresAt: string;
    coverage: DateTimeRange;
  };
  warning?: string;
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
  outward: number;
  fromEglPl: number;
  direct: number;
};

type ReportMetric = 'inbound' | 'outward' | 'net';

const DAY_MS = 86_400_000;
const IST_OFFSET_MS = 330 * 60_000;
const DEFAULT_WINDOW_MS = 48 * 60 * 60_000;
const numberFormat = new Intl.NumberFormat('en-IN');
const API_PATH = '/api/stock-in/bermuda-triangle-analytics';
const FACILITY = 'NXS1';
const DESTINATION = 'Bermuda Triangle';
const DESTINATION_LABEL = 'Bermuda Triangle';
const METRIC_LABEL = 'Bermuda Triangle';
const FILENAME_SLUG = 'bermuda-triangle';
const TREND_LOCATION = 'the Bermuda Triangle pool';

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

function inputScope(row: Pick<AnalyticsRow, 'inputScope'>) {
  return String(row.inputScope || '').trim() || 'Unclassified location';
}

function outputScope(row: Pick<OutwardAnalyticsRow, 'outputScope'>) {
  return String(row.outputScope || '').trim() || 'Unclassified location';
}

function reportMetricValue(metric: ReportMetric, inbound: number, outward: number) {
  if (metric === 'inbound') return inbound;
  if (metric === 'outward') return outward;
  return inbound - outward;
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
  let text = String(value ?? '');
  if (/^[\s=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function dailySeries(
  inboundRows: AnalyticsRow[],
  outwardRows: OutwardAnalyticsRow[],
  startDate: string,
  endDate: string,
): DailyRow[] {
  const totals = new Map<string, DailyRow>();
  for (const row of inboundRows) {
    const current = totals.get(row.date) || { date: row.date, inbound: 0, outward: 0, fromEglPl: 0, direct: 0 };
    current.inbound += row.inbound;
    current.fromEglPl += row.fromEglPl;
    current.direct += row.direct;
    totals.set(row.date, current);
  }
  for (const row of outwardRows) {
    const current = totals.get(row.date) || { date: row.date, inbound: 0, outward: 0, fromEglPl: 0, direct: 0 };
    current.outward += row.outward;
    totals.set(row.date, current);
  }

  const result: DailyRow[] = [];
  for (
    let cursor = new Date(`${startDate}T00:00:00Z`);
    cursor <= new Date(`${endDate}T00:00:00Z`);
    cursor = new Date(cursor.getTime() + DAY_MS)
  ) {
    const date = isoDate(cursor);
    result.push(totals.get(date) || { date, inbound: 0, outward: 0, fromEglPl: 0, direct: 0 });
  }
  return result;
}

function TrendChart({ rows, destination }: { rows: DailyRow[]; destination: string }) {
  const width = 920;
  const height = 280;
  const inset = { top: 22, right: 18, bottom: 40, left: 54 };
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;
  const maximum = Math.max(1, ...rows.flatMap((row) => [row.inbound, row.outward]));
  const ceiling = Math.ceil(maximum / 10) * 10 || 10;
  const x = (index: number) => inset.left + (rows.length <= 1 ? plotWidth / 2 : (index / (rows.length - 1)) * plotWidth);
  const y = (value: number) => inset.top + plotHeight - (value / ceiling) * plotHeight;
  const path = (key: keyof Pick<DailyRow, 'inbound' | 'outward'>) =>
    rows.map((row, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(1)} ${y(row[key]).toFixed(1)}`).join(' ');
  const labelStep = Math.max(1, Math.ceil(rows.length / 6));

  return (
    <div className="min-h-[280px] w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={`Daily ${destination} inbound and outward trend`}>
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
        <path d={path('outward')} fill="none" stroke="#f43f5e" strokeWidth="3" />
        {rows.map((row, index) => (
          <g key={row.date}>
            <circle cx={x(index)} cy={y(row.inbound)} r="3.5" fill="#15171b" stroke="#2dd4bf" strokeWidth="2">
              <title>{`${formatDate(row.date, true)}: ${numberFormat.format(row.inbound)} inbound`}</title>
            </circle>
            <circle cx={x(index)} cy={y(row.outward)} r="3.5" fill="#15171b" stroke="#fb7185" strokeWidth="2">
              <title>{`${formatDate(row.date, true)}: ${numberFormat.format(row.outward)} outward`}</title>
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

export default function BermudaTriangleAnalyticsPage() {
  const defaults = useMemo(defaultRange, []);
  const [draftRange, setDraftRange] = useState(defaults);
  const [range, setRange] = useState(defaults);
  const [rollingPreset, setRollingPreset] = useState(true);
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([]);
  const [selectedInputScopes, setSelectedInputScopes] = useState<string[]>([]);
  const [hsnFilterOpen, setHsnFilterOpen] = useState(false);
  const [scopeFilterOpen, setScopeFilterOpen] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportView, setReportView] = useState<'datewise' | 'locationwise'>('datewise');
  const [reportMetric, setReportMetric] = useState<ReportMetric>('inbound');
  const [dumpLoading, setDumpLoading] = useState<'inbound' | 'outward' | null>(null);
  const [dumpError, setDumpError] = useState('');
  const requestSequence = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);
  const foregroundLoading = useRef(false);
  const draftRangeError = useMemo(() => rangeError(draftRange), [draftRange]);

  const loadData = useCallback(async (force = false, silent = false) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    const sequence = requestSequence.current + 1;
    requestSequence.current = sequence;
    activeRequest.current = controller;
    if (!silent) {
      foregroundLoading.current = true;
      setLoading(true);
      setError('');
    }
    try {
      const params = rollingPreset
        ? new URLSearchParams({ preset: 'rolling48h' })
        : new URLSearchParams(range);
      const request = await fetch(`${API_PATH}?${params}`, {
        cache: 'no-store',
        method: force && rollingPreset ? 'POST' : 'GET',
        signal: controller.signal,
      });
      const body = await request.json() as ApiResponse & { error?: string };
      if (!request.ok) throw new Error(body.error || 'Unable to load Bermuda Triangle analytics.');
      if (sequence !== requestSequence.current) return;
      setResponse(body);
      if (rollingPreset) setDraftRange(body.range);
    } catch (loadError) {
      if (controller.signal.aborted || sequence !== requestSequence.current) return;
      if (!silent) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load Bermuda Triangle analytics.');
        if (!rollingPreset) setResponse(null);
      }
    } finally {
      if (sequence === requestSequence.current) {
        if (activeRequest.current === controller) activeRequest.current = null;
        if (!silent) {
          foregroundLoading.current = false;
          setLoading(false);
        }
      }
    }
  }, [range, rollingPreset]);

  useEffect(() => {
    void loadData(false);
  }, [loadData]);

  useEffect(() => () => {
    requestSequence.current += 1;
    activeRequest.current?.abort();
  }, []);

  useEffect(() => {
    if (!rollingPreset || response?.cache?.status !== 'stale') return;
    let polling = false;
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (foregroundLoading.current || loading || polling || attempts >= 30) return;
      polling = true;
      attempts += 1;
      void loadData(false, true).finally(() => {
        polling = false;
      });
    }, 20_000);
    return () => window.clearInterval(timer);
  }, [loadData, loading, response?.cache?.status, response?.generatedAt, rollingPreset]);

  const activeRange = response?.range || range;

  const itemTypes = useMemo(() => [...new Set([
    ...(response?.data || []).map((row) => row.itemType),
    ...(response?.outwardData || []).map((row) => row.itemType),
  ])].sort((a, b) => a.localeCompare(b)), [response?.data, response?.outwardData]);
  const locations = useMemo(() => [...new Set([
    ...(response?.data || []).map(inputScope),
    ...(response?.outwardData || []).map(outputScope),
    ...(response?.outputScopes || []).map((scope) => String(scope || '').trim() || 'Unclassified location'),
  ])].sort((a, b) => a.localeCompare(b)), [response?.data, response?.outputScopes, response?.outwardData]);

  useEffect(() => {
    setSelectedItemTypes((current) => current.filter((type) => itemTypes.includes(type)));
  }, [itemTypes]);

  useEffect(() => {
    setSelectedInputScopes((current) => current.filter((scope) => locations.includes(scope)));
  }, [locations]);

  const locationFilteredInboundRows = useMemo(
    () => (response?.data || []).filter((row) => !selectedInputScopes.length || selectedInputScopes.includes(inputScope(row))),
    [selectedInputScopes, response?.data],
  );
  const locationFilteredOutwardRows = useMemo(
    () => (response?.outwardData || []).filter((row) => !selectedInputScopes.length || selectedInputScopes.includes(outputScope(row))),
    [selectedInputScopes, response?.outwardData],
  );
  const itemTypeFilteredInboundRows = useMemo(
    () => (response?.data || []).filter((row) => !selectedItemTypes.length || selectedItemTypes.includes(row.itemType)),
    [selectedItemTypes, response?.data],
  );
  const itemTypeFilteredOutwardRows = useMemo(
    () => (response?.outwardData || []).filter((row) => !selectedItemTypes.length || selectedItemTypes.includes(row.itemType)),
    [selectedItemTypes, response?.outwardData],
  );
  const filteredInboundRows = useMemo(
    () => locationFilteredInboundRows.filter((row) => !selectedItemTypes.length || selectedItemTypes.includes(row.itemType)),
    [locationFilteredInboundRows, selectedItemTypes],
  );
  const filteredOutwardRows = useMemo(
    () => locationFilteredOutwardRows.filter((row) => !selectedItemTypes.length || selectedItemTypes.includes(row.itemType)),
    [locationFilteredOutwardRows, selectedItemTypes],
  );
  const daily = useMemo(
    () => dailySeries(filteredInboundRows, filteredOutwardRows, activeRange.startDate, activeRange.endDate),
    [activeRange.endDate, activeRange.startDate, filteredInboundRows, filteredOutwardRows],
  );
  const totals = useMemo(() => {
    const inbound = filteredInboundRows.reduce((sum, row) => ({
      inbound: sum.inbound + row.inbound,
      fromEglPl: sum.fromEglPl + row.fromEglPl,
      direct: sum.direct + row.direct,
    }), { inbound: 0, fromEglPl: 0, direct: 0 });
    const outward = filteredOutwardRows.reduce((sum, row) => sum + row.outward, 0);
    return { ...inbound, outward, net: inbound.inbound - outward };
  }, [filteredInboundRows, filteredOutwardRows]);
  const classifications = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const row of locationFilteredInboundRows) grouped.set(row.itemType, (grouped.get(row.itemType) || 0) + row.inbound);
    return [...grouped.entries()].map(([name, inbound]) => ({ name, inbound })).sort((a, b) => b.inbound - a.inbound);
  }, [locationFilteredInboundRows]);
  const inputScopeDistribution = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const row of itemTypeFilteredInboundRows) {
      const scope = inputScope(row);
      grouped.set(scope, (grouped.get(scope) || 0) + row.inbound);
    }
    return [...grouped.entries()]
      .map(([name, inbound]) => ({ name, inbound }))
      .sort((a, b) => b.inbound - a.inbound || a.name.localeCompare(b.name));
  }, [itemTypeFilteredInboundRows]);
  const maximumDay = Math.max(1, ...daily.flatMap((row) => [row.inbound, row.outward]));
  const priorShare = totals.inbound ? (totals.fromEglPl / totals.inbound) * 100 : 0;
  const reportItemTypes = selectedItemTypes.length ? selectedItemTypes : itemTypes;
  const daywiseReport = useMemo(() => daily.map((day) => {
    const inboundValues = Object.fromEntries(reportItemTypes.map((type) => [type, 0])) as Record<string, number>;
    const outwardValues = Object.fromEntries(reportItemTypes.map((type) => [type, 0])) as Record<string, number>;
    for (const row of filteredInboundRows) {
      if (row.date === day.date) inboundValues[row.itemType] = (inboundValues[row.itemType] || 0) + row.inbound;
    }
    for (const row of filteredOutwardRows) {
      if (row.date === day.date) outwardValues[row.itemType] = (outwardValues[row.itemType] || 0) + row.outward;
    }
    const values = Object.fromEntries(reportItemTypes.map((type) => [
      type,
      reportMetricValue(reportMetric, inboundValues[type] || 0, outwardValues[type] || 0),
    ])) as Record<string, number>;
    return { date: day.date, values, total: Object.values(values).reduce((sum, value) => sum + value, 0) };
  }), [daily, filteredInboundRows, filteredOutwardRows, reportItemTypes, reportMetric]);
  const reportLocations = useMemo(
    () => (selectedInputScopes.length
      ? [...selectedInputScopes]
      : [...new Set([
        ...filteredInboundRows.map(inputScope),
        ...filteredOutwardRows.map(outputScope),
      ])]
    ).sort((a, b) => a.localeCompare(b)),
    [filteredInboundRows, filteredOutwardRows, selectedInputScopes],
  );
  const locationDaywiseReport = useMemo(() => daily.map((day) => {
    const inboundValues = Object.fromEntries(reportLocations.map((location) => [location, 0])) as Record<string, number>;
    const outwardValues = Object.fromEntries(reportLocations.map((location) => [location, 0])) as Record<string, number>;
    for (const row of filteredInboundRows) {
      if (row.date !== day.date) continue;
      const location = inputScope(row);
      inboundValues[location] = (inboundValues[location] || 0) + row.inbound;
    }
    for (const row of filteredOutwardRows) {
      if (row.date !== day.date) continue;
      const location = outputScope(row);
      outwardValues[location] = (outwardValues[location] || 0) + row.outward;
    }
    const values = Object.fromEntries(reportLocations.map((location) => [
      location,
      reportMetricValue(reportMetric, inboundValues[location] || 0, outwardValues[location] || 0),
    ])) as Record<string, number>;
    return { date: day.date, values, total: Object.values(values).reduce((sum, value) => sum + value, 0) };
  }), [daily, filteredInboundRows, filteredOutwardRows, reportLocations, reportMetric]);
  const hasReportMovement = reportMetric === 'inbound'
    ? filteredInboundRows.length > 0
    : reportMetric === 'outward'
      ? filteredOutwardRows.length > 0
      : filteredInboundRows.length > 0 || filteredOutwardRows.length > 0;
  const reportMetricLabel = reportMetric === 'inbound' ? 'Inbound' : reportMetric === 'outward' ? 'Outward' : 'Net flow';

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
    requestSequence.current += 1;
    activeRequest.current?.abort();
    activeRequest.current = null;
    setSelectedItemTypes([]);
    setSelectedInputScopes([]);
    setDumpError('');
    setResponse(null);
    setRollingPreset(false);
    setRange({ ...draftRange });
  };

  const useRollingRange = () => {
    requestSequence.current += 1;
    activeRequest.current?.abort();
    activeRequest.current = null;
    setSelectedItemTypes([]);
    setSelectedInputScopes([]);
    setDumpError('');
    if (rollingPreset) {
      void loadData(false);
      return;
    }
    setResponse(null);
    setRollingPreset(true);
  };

  const exportCsv = () => {
    if (!hasReportMovement) return;
    const isHsnView = reportView === 'datewise';
    const columns = isHsnView ? reportItemTypes : reportLocations;
    const rows = isHsnView ? daywiseReport : locationDaywiseReport;
    const header = ['Date', ...columns, 'Daily total'];
    const lines = [header, ...rows.map((row) => [
      row.date,
      ...columns.map((column) => row.values[column] || 0),
      row.total,
    ])]
      .map((row) => row.map(csvCell).join(','));
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    const startStamp = `${activeRange.startDate}-${activeRange.startTime.replace(':', '')}`;
    const endStamp = `${activeRange.endDate}-${activeRange.endTime.replace(':', '')}`;
    const viewSlug = isHsnView ? 'hsn' : 'location';
    link.download = `${FILENAME_SLUG}-datewise-${viewSlug}-${reportMetric}-report-${startStamp}-to-${endStamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadBarcodeDump = async (direction: 'inbound' | 'outward') => {
    if (dumpLoading) return;
    setDumpLoading(direction);
    setDumpError('');

    try {
      const params = new URLSearchParams(activeRange);
      const endpoint = direction === 'outward' ? 'outward-barcode-dump' : 'barcode-dump';
      const request = await fetch(`${API_PATH}/${endpoint}?${params}`, { cache: 'no-store' });
      if (!request.ok) {
        let message = `Unable to prepare the ${direction} barcode-level dump.`;
        try {
          if (request.headers.get('content-type')?.includes('application/json')) {
            const body = await request.json() as { error?: string };
            if (body.error) message = body.error;
          } else {
            const body = await request.text();
            if (body.trim()) message = body.trim();
          }
        } catch {
          // Keep the user-friendly fallback when an upstream error body cannot be parsed.
        }
        throw new Error(message);
      }

      const blob = await request.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const startStamp = `${activeRange.startDate}-${activeRange.startTime.replace(':', '')}`;
      const endStamp = `${activeRange.endDate}-${activeRange.endTime.replace(':', '')}`;
      const dispositionName = request.headers.get('content-disposition')?.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i)?.[1]?.trim();
      let filename = `${FILENAME_SLUG}-${direction}-barcode-level-dump-${startStamp}-to-${endStamp}.csv`;
      if (dispositionName) {
        try {
          filename = decodeURIComponent(dispositionName);
        } catch {
          filename = dispositionName;
        }
      }
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setDumpError(downloadError instanceof Error ? downloadError.message : `Unable to prepare the ${direction} barcode-level dump.`);
    } finally {
      setDumpLoading(null);
    }
  };

  const updatedTime = response
    ? new Date(response.generatedAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';
  const cacheStatus = response?.cache?.status;
  const statusText = loading
    ? response ? 'Refreshing view' : 'Loading snapshot'
    : error
      ? 'Data unavailable'
      : cacheStatus === 'stale'
        ? `Snapshot ${updatedTime} / ${response?.cache?.refreshing ? 'refresh running' : 'refresh retry queued'}`
        : cacheStatus
          ? `Snapshot ${updatedTime}`
          : `Updated ${updatedTime}`;

  return (
    <div className="-m-6 min-h-full bg-[#0c0d0f] p-6 text-zinc-100">
    <div className="mx-auto max-w-[1600px] space-y-5 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-teal-400">Stock In / {DESTINATION_LABEL}</p>
          <h1 className="text-2xl font-bold text-white">Bermuda Triangle Analytics</h1>
          <p className="mt-1 text-sm text-zinc-400">Daily inbound and outward movement for {DESTINATION} within {FACILITY}, classified by Location and HSN.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className={`h-2 w-2 rounded-full ${error ? 'bg-red-500' : loading || cacheStatus === 'stale' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {statusText}
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
        <label className="min-w-[130px] flex-1 text-xs font-semibold text-zinc-300">
          <span className="mb-1.5 flex items-center gap-1.5"><FiMapPin /> Facility</span>
          <select value={FACILITY} disabled aria-label="Bermuda Triangle facility" className="h-10 w-full cursor-not-allowed rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm font-semibold text-zinc-300 opacity-80">
            <option value={FACILITY}>{FACILITY} only</option>
          </select>
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
          <span className="mb-1.5 flex items-center gap-1.5"><FiFilter /> Location</span>
          <button type="button" onClick={() => { setScopeFilterOpen((open) => !open); setHsnFilterOpen(false); }} disabled={!locations.length} className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-left text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 disabled:opacity-50">
            <span className="truncate">{selectedInputScopes.length ? `${selectedInputScopes.length} selected` : 'All Locations'}</span><FiChevronDown className={scopeFilterOpen ? 'rotate-180' : ''} />
          </button>
          {scopeFilterOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-[300px] overflow-auto rounded-lg border border-zinc-600 bg-zinc-900 p-2 shadow-2xl">
              <button type="button" onClick={() => setSelectedInputScopes([])} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800">
                <input type="checkbox" readOnly checked={!selectedInputScopes.length} className="accent-teal-500" /> All Locations
              </button>
              {locations.map((scope) => (
                <label key={scope} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-normal text-zinc-200 hover:bg-zinc-800">
                  <input type="checkbox" checked={selectedInputScopes.includes(scope)} onChange={() => toggleInputScope(scope)} className="accent-teal-500" /><span className="truncate" title={scope}>{scope}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={applyRange} disabled={loading || Boolean(draftRangeError)} className="h-10 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">Apply range</button>
        <button type="button" onClick={useRollingRange} disabled={loading} className={`h-10 rounded-lg border px-3 text-sm font-semibold disabled:opacity-50 ${rollingPreset ? 'border-teal-600 bg-teal-950 text-teal-200' : 'border-zinc-600 bg-zinc-900 text-zinc-300 hover:border-teal-600'}`}>Last 48h</button>
        <button type="button" onClick={() => void loadData(false)} disabled={loading} title={rollingPreset ? 'Reload the rolling 48-hour snapshot' : 'Reload this exact custom range'} aria-label="Refresh Bermuda Triangle data" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"><FiRefreshCw className={loading ? 'animate-spin' : ''} /></button>
        <button type="button" onClick={() => void downloadBarcodeDump('inbound')} disabled={dumpLoading !== null || !response} title="Download NXS1 Bermuda inbound barcode-level rows for the applied date and time range" className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-teal-700 bg-zinc-900 px-3 text-sm font-semibold text-teal-300 hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-50">
          {dumpLoading === 'inbound' ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
          {dumpLoading === 'inbound' ? 'Preparing inbound...' : 'Inbound Barcode Dump'}
        </button>
        <button type="button" onClick={() => void downloadBarcodeDump('outward')} disabled={dumpLoading !== null || !response} title="Download NXS1 Bermuda outward barcode-level rows for the applied date and time range" className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-rose-700 bg-zinc-900 px-3 text-sm font-semibold text-rose-300 hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-50">
          {dumpLoading === 'outward' ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
          {dumpLoading === 'outward' ? 'Preparing outward...' : 'Outward Barcode Dump'}
        </button>
        <button type="button" onClick={exportCsv} disabled={!hasReportMovement} title={`Export current ${reportMetric} ${reportView === 'datewise' ? 'HSN' : 'Location'} report`} aria-label="Export current Bermuda Triangle number report" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"><FiDownload /></button>
        </div>
        {draftRangeError ? (
          <p role="alert" className="mt-2 text-xs font-medium text-amber-400">{draftRangeError}</p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">Facility is locked to NXS1. Location means origin for inbound and destination for outward. Last 48h opens from a persistent snapshot immediately; refreshes run once in the background. Custom ranges remain exact live queries.</p>
        )}
        <p className="mt-1 text-xs text-zinc-500">Inbound and Outward Barcode Dumps include all matching NXS1 Bermuda rows in the applied date/time range (maximum 7 days); on-screen HSN and Location filters do not narrow them.</p>
        {response?.warning && <p role="status" className="mt-2 text-xs font-medium text-amber-300">{response.warning}</p>}
        {dumpError && <p role="alert" className="mt-2 text-xs font-medium text-red-400">Barcode dump failed: {dumpError}</p>}
      </section>

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
          <FiAlertCircle className="shrink-0 text-lg" /><div><b>Bermuda Triangle request failed.</b> {error}</div>
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6" aria-busy={loading}>
        <article className="rounded-lg border-l-4 border-teal-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">New {METRIC_LABEL} inbound</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.inbound)}</strong><span className="text-xs text-zinc-400">Distinct barcode-days</span></article>
        <article className="rounded-lg border-l-4 border-rose-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">{METRIC_LABEL} outward</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.outward)}</strong><span className="text-xs text-zinc-400">Distinct barcode-days</span></article>
        <article className={`rounded-lg border-l-4 bg-[#191b20] p-4 shadow-lg ${totals.net < 0 ? 'border-rose-500' : 'border-emerald-500'}`}><p className="text-xs font-semibold uppercase text-zinc-400">Net flow</p><strong className={`mt-2 block text-2xl ${totals.net < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>{loading ? '-' : numberFormat.format(totals.net)}</strong><span className="text-xs text-zinc-400">Inbound minus outward</span></article>
        <article className="rounded-lg border-l-4 border-blue-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">From EGL / PL</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.fromEglPl)}</strong><span className="text-xs text-zinc-400">Prior movement detected</span></article>
        <article className="rounded-lg border-l-4 border-orange-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">Direct to {METRIC_LABEL}</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : numberFormat.format(totals.direct)}</strong><span className="text-xs text-zinc-400">No EGL / PL history</span></article>
        <article className="rounded-lg border-l-4 border-violet-500 bg-[#191b20] p-4 shadow-lg"><p className="text-xs font-semibold uppercase text-zinc-400">EGL / PL share</p><strong className="mt-2 block text-2xl text-white">{loading ? '-' : `${priorShare.toFixed(1)}%`}</strong><span className="text-xs text-zinc-400">Of selected Bermuda Triangle inbound</span></article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,0.7fr)_minmax(270px,0.7fr)]">
        <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-base font-bold text-white">Daily Bermuda Triangle flow trend</h2><p className="text-xs text-zinc-400">Distinct barcodes entering and leaving {TREND_LOCATION}</p></div>
            <div className="flex flex-wrap gap-3 text-xs text-zinc-300"><span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-teal-400" />Inbound</span><span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-rose-500" />Outward</span></div>
          </div>
          {loading ? <div className="h-[280px] animate-pulse rounded-lg bg-zinc-800" /> : <TrendChart rows={daily} destination={DESTINATION} />}
        </article>

        <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
          <div className="mb-4"><h2 className="text-base font-bold text-white">Inbound HSN mix</h2><p className="text-xs text-zinc-400">Bermuda Triangle inbound contribution by classification</p></div>
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
          <div className="mb-4"><h2 className="text-base font-bold text-white">Inbound Location mix</h2><p className="text-xs text-zinc-400">Bermuda Triangle inbound grouped by categorized origin Location</p></div>
          <div className="max-h-[300px] space-y-3 overflow-auto pr-1">
            {inputScopeDistribution.length ? inputScopeDistribution.map((scope) => (
              <button key={scope.name} type="button" onClick={() => toggleInputScope(scope.name)} className={`block w-full border-l-2 pl-2 text-left ${selectedInputScopes.includes(scope.name) ? 'border-teal-400' : 'border-transparent'}`} title={`Toggle ${scope.name}`}>
                <span className="mb-1 flex items-center justify-between gap-3 text-xs"><b className="truncate text-zinc-200" title={scope.name}>{scope.name}</b><span className="text-zinc-400">{numberFormat.format(scope.inbound)}</span></span>
                <span className="block h-2 bg-zinc-800"><i className="block h-full bg-cyan-500" style={{ width: `${totalsForClassifications(inputScopeDistribution, scope.inbound)}%` }} /></span>
              </button>
            )) : <p className="py-12 text-center text-sm text-zinc-400">No Locations in this range</p>}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="text-base font-bold text-white">Daily Bermuda Triangle source and outward flow</h2><p className="text-xs text-zinc-400">Stacked inbound source beside total outward movement</p></div>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-3 bg-blue-600" />Inbound from EGL / PL</span>
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-3 bg-orange-500" />Direct inbound</span>
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-3 bg-rose-500" />Outward</span>
          </div>
        </div>
        <div className="flex h-[230px] items-end gap-1 overflow-x-auto border-b border-zinc-700 px-1 pt-4">
          {daily.map((row) => (
            <div key={row.date} className="flex h-full min-w-[46px] flex-1 flex-col items-center justify-end gap-1" title={`${formatDate(row.date, true)}: ${row.fromEglPl} EGL/PL inbound, ${row.direct} direct inbound, ${row.outward} outward`}>
              <span className="text-[10px] text-zinc-400">I {numberFormat.format(row.inbound)} / O {numberFormat.format(row.outward)}</span>
              <div className="flex h-[170px] w-full items-end justify-center gap-1">
                <div className="flex w-4 flex-col justify-end" style={{ height: row.inbound ? `${Math.max(2, (row.inbound / maximumDay) * 170)}px` : '0px' }}>
                  <i className="block bg-blue-600" style={{ height: `${row.inbound ? (row.fromEglPl / row.inbound) * 100 : 0}%` }} />
                  <i className="block bg-orange-500" style={{ height: `${row.inbound ? (row.direct / row.inbound) * 100 : 0}%` }} />
                </div>
                <i className="block w-4 bg-rose-500" style={{ height: row.outward ? `${Math.max(2, (row.outward / maximumDay) * 170)}px` : '0px' }} />
              </div>
              <small className="whitespace-nowrap text-[9px] text-zinc-400">{formatDate(row.date)}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-700 bg-[#15171b] shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700 px-4 py-3">
          <div>
            <h2 className="text-base font-bold text-white">Bermuda Triangle Number Reporting</h2>
            <p className="text-xs text-zinc-400">
              {reportView === 'datewise'
                ? `${reportMetricLabel} by date and HSN across ${selectedInputScopes.length ? `${selectedInputScopes.length} chosen Locations` : 'all Locations'}`
                : `${reportMetricLabel} by date and Location for ${selectedItemTypes.length ? `${selectedItemTypes.length} chosen HSN classifications` : 'all HSN classifications'}`}
            </p>
          </div>
          <span className="text-xs text-zinc-400">
            {reportView === 'datewise'
              ? `${numberFormat.format(daywiseReport.length)} days / ${numberFormat.format(reportItemTypes.length)} HSN classifications`
              : `${numberFormat.format(locationDaywiseReport.length)} days / ${numberFormat.format(reportLocations.length)} Locations`}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700 bg-zinc-900/40 px-4 py-3">
          <div className="inline-flex flex-wrap rounded-lg border border-zinc-700 bg-zinc-900 p-1" role="group" aria-label="Number reporting view">
            <button type="button" aria-pressed={reportView === 'datewise'} onClick={() => setReportView('datewise')} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${reportView === 'datewise' ? 'bg-teal-700 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}>Datewise HSN</button>
            <button type="button" aria-pressed={reportView === 'locationwise'} onClick={() => setReportView('locationwise')} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${reportView === 'locationwise' ? 'bg-teal-700 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}>Datewise Location</button>
          </div>
          <div className="inline-flex flex-wrap rounded-lg border border-zinc-700 bg-zinc-900 p-1" role="group" aria-label="Number reporting metric">
            {(['inbound', 'outward', 'net'] as ReportMetric[]).map((metric) => (
              <button key={metric} type="button" aria-pressed={reportMetric === metric} onClick={() => setReportMetric(metric)} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${reportMetric === metric ? metric === 'outward' ? 'bg-rose-700 text-white' : 'bg-teal-700 text-white' : 'text-zinc-400 hover:text-zinc-100'}`}>
                {metric === 'net' ? 'Net flow' : metric}
              </button>
            ))}
          </div>
        </div>
        {reportView === 'datewise' ? (
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="sticky top-0 bg-zinc-800 text-left text-xs uppercase text-zinc-300"><tr><th className="sticky left-0 bg-zinc-800 px-4 py-3">Date</th>{reportItemTypes.map((type) => <th key={type} className="whitespace-nowrap px-4 py-3 text-right">{type}</th>)}<th className="whitespace-nowrap px-4 py-3 text-right">Daily total</th></tr></thead>
              <tbody className="divide-y divide-zinc-800">
                {hasReportMovement ? daywiseReport.map((row) => (
                  <tr key={row.date} className="hover:bg-zinc-800/70"><td className="sticky left-0 whitespace-nowrap bg-[#15171b] px-4 py-3 font-medium text-zinc-300">{formatDate(row.date, true)}</td>{reportItemTypes.map((type) => <td key={type} className="px-4 py-3 text-right text-zinc-200">{numberFormat.format(row.values[type] || 0)}</td>)}<td className={`px-4 py-3 text-right font-bold ${reportMetric === 'outward' ? 'text-rose-400' : 'text-teal-400'}`}>{numberFormat.format(row.total)}</td></tr>
                )) : <tr><td colSpan={reportItemTypes.length + 2} className="px-4 py-12 text-center text-zinc-400">No Bermuda Triangle movement found for the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="sticky top-0 bg-zinc-800 text-left text-xs uppercase text-zinc-300">
                <tr><th className="sticky left-0 bg-zinc-800 px-4 py-3">Date</th>{reportLocations.map((location) => <th key={location} className="whitespace-nowrap px-4 py-3 text-right">{location}</th>)}<th className="whitespace-nowrap px-4 py-3 text-right">Daily total</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {hasReportMovement ? locationDaywiseReport.map((row) => (
                  <tr key={row.date} className="hover:bg-zinc-800/70">
                    <td className="sticky left-0 whitespace-nowrap bg-[#15171b] px-4 py-3 font-medium text-zinc-300">{formatDate(row.date, true)}</td>
                    {reportLocations.map((location) => <td key={location} className="px-4 py-3 text-right text-zinc-200">{numberFormat.format(row.values[location] || 0)}</td>)}
                    <td className={`px-4 py-3 text-right font-bold ${reportMetric === 'outward' ? 'text-rose-400' : 'text-teal-400'}`}>{numberFormat.format(row.total)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={reportLocations.length + 2} className="px-4 py-12 text-center text-zinc-400">No Bermuda Triangle movement found for the selected filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
    </div>
  );
}

function totalsForClassifications(rows: Array<{ inbound: number }>, value: number) {
  const maximum = Math.max(1, ...rows.map((row) => row.inbound));
  return Math.max(2, (value / maximum) * 100);
}
