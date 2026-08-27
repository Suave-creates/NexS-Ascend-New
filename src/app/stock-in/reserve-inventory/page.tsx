'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronDown,
  FiDownload,
  FiFilter,
  FiRefreshCw,
} from 'react-icons/fi';

type InventoryRow = {
  date: string;
  itemType: string;
  location: string;
  inward: number;
  outward: number;
  inventory: number;
};

type ApiResponse = {
  range: { startDate: string; endDate: string };
  timeZone: 'Asia/Kolkata';
  locations: string[];
  data: InventoryRow[];
  generatedAt: string;
  cache?: {
    status: 'hit' | 'miss' | 'stale' | 'refreshed';
    coverage: { startDate: string; endDate: string };
    expiresAt: string;
  };
  warning?: string;
};

type HsnInventoryRow = Omit<InventoryRow, 'location'>;

type LocationPivotRow = {
  date: string;
  inventoryByLocation: Record<string, number>;
  grandTotal: number;
};

type DailyInventory = {
  date: string;
  inward: number;
  outward: number;
  inventory: number;
  hasData: boolean;
};

const DAY_MS = 86_400_000;
const MAX_RANGE_DAYS = 62;
const numberFormat = new Intl.NumberFormat('en-IN');

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function todayInIndia() {
  return isoDate(new Date(Date.now() + 330 * 60_000));
}

function defaultRange() {
  const endDate = todayInIndia();
  const start = new Date(`${endDate}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 1);
  return { startDate: isoDate(start), endDate };
}

function formatDate(value: string, withYear = false) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

function classification(row: InventoryRow) {
  return String(row.itemType || '').trim() || 'Unclassified';
}

function inventoryLocation(row: InventoryRow) {
  return String(row.location || '').trim();
}

function safeCount(value: unknown) {
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
}

function rangeError(startDate: string, endDate: string, today: string) {
  if (!startDate || !endDate) return 'Choose both a start date and an end date.';
  if (startDate > endDate) return 'Start date cannot be later than end date.';
  if (endDate > today) return 'End date cannot be in the future.';

  const span = Math.floor(
    (new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${startDate}T00:00:00Z`).getTime()) / DAY_MS,
  ) + 1;
  if (!Number.isFinite(span)) return 'Enter a valid date range.';
  if (span > MAX_RANGE_DAYS) return `Choose a range of ${MAX_RANGE_DAYS} days or less.`;
  return '';
}

function csvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function combinedRows(rows: InventoryRow[]): HsnInventoryRow[] {
  const grouped = new Map<string, HsnInventoryRow>();
  for (const row of rows) {
    const itemType = classification(row);
    const key = `${row.date}\u0000${itemType}`;
    const current = grouped.get(key) || {
      date: row.date,
      itemType,
      inward: 0,
      outward: 0,
      inventory: 0,
    };
    current.inward += safeCount(row.inward);
    current.outward += safeCount(row.outward);
    current.inventory += safeCount(row.inventory);
    grouped.set(key, current);
  }
  return [...grouped.values()].sort(
    (left, right) => left.date.localeCompare(right.date) || left.itemType.localeCompare(right.itemType),
  );
}

function locationPivot(rows: InventoryRow[], locations: string[]): LocationPivotRow[] {
  const grouped = new Map<string, Record<string, number>>();
  const visibleLocations = new Set(locations);

  for (const row of rows) {
    const location = inventoryLocation(row);
    if (!visibleLocations.has(location)) continue;
    const inventoryByLocation = grouped.get(row.date) || {};
    inventoryByLocation[location] = (inventoryByLocation[location] || 0) + safeCount(row.inventory);
    grouped.set(row.date, inventoryByLocation);
  }

  return [...grouped.entries()]
    .map(([date, inventoryByLocation]) => ({
      date,
      inventoryByLocation,
      grandTotal: locations.reduce(
        (total, location) => total + (inventoryByLocation[location] || 0),
        0,
      ),
    }))
    .sort((left, right) => right.date.localeCompare(left.date));
}

function dailySeries(rows: HsnInventoryRow[], startDate: string, endDate: string): DailyInventory[] {
  const grouped = new Map<string, DailyInventory>();
  for (const row of rows) {
    const current = grouped.get(row.date) || {
      date: row.date,
      inward: 0,
      outward: 0,
      inventory: 0,
      hasData: true,
    };
    current.inward += row.inward;
    current.outward += row.outward;
    current.inventory += row.inventory;
    grouped.set(row.date, current);
  }

  const days: DailyInventory[] = [];
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  for (let cursor = new Date(`${startDate}T00:00:00Z`).getTime(); cursor <= end; cursor += DAY_MS) {
    const date = isoDate(new Date(cursor));
    days.push(grouped.get(date) || { date, inward: 0, outward: 0, inventory: 0, hasData: false });
  }
  return days;
}

const InventoryTrendChart = memo(function InventoryTrendChart({ rows }: { rows: DailyInventory[] }) {
  const width = 980;
  const height = 310;
  const inset = { top: 24, right: 22, bottom: 44, left: 62 };
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;
  const geometry = useMemo(() => {
    const maximum = Math.max(1, ...rows.flatMap((row) => [row.inward, row.outward, row.inventory]));
    const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(maximum)) - 1);
    const ceiling = Math.ceil(maximum / magnitude) * magnitude;
    const x = (index: number) => inset.left
      + (rows.length <= 1 ? plotWidth / 2 : (index / (rows.length - 1)) * plotWidth);
    const y = (value: number) => inset.top + plotHeight - (value / ceiling) * plotHeight;
    const path = (key: keyof Pick<DailyInventory, 'inward' | 'outward' | 'inventory'>) => rows
      .map((row, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(1)} ${y(row[key]).toFixed(1)}`)
      .join(' ');
    const inventoryPath = path('inventory');
    const plotBottom = inset.top + plotHeight;
    return {
      ceiling,
      labelStep: Math.max(1, Math.ceil(rows.length / 7)),
      x,
      y,
      inventoryPath,
      inwardPath: path('inward'),
      outwardPath: path('outward'),
      inventoryArea: rows.length
        ? `${inventoryPath} L ${x(rows.length - 1).toFixed(1)} ${plotBottom.toFixed(1)} L ${x(0).toFixed(1)} ${plotBottom.toFixed(1)} Z`
        : '',
    };
  }, [inset.left, inset.top, plotHeight, plotWidth, rows]);

  return (
    <div className="min-h-[310px] w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full"
        role="img"
        aria-labelledby="reserve-chart-title reserve-chart-description"
      >
        <title id="reserve-chart-title">Reserve inventory daily movement</title>
        <desc id="reserve-chart-description">Line chart comparing daily inward, outward, and inventory levels.</desc>
        <defs>
          <linearGradient id="reserve-inventory-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = Math.round(geometry.ceiling * (1 - ratio));
          const lineY = inset.top + plotHeight * ratio;
          return (
            <g key={ratio}>
              <line x1={inset.left} y1={lineY} x2={width - inset.right} y2={lineY} stroke="#34363c" />
              <text x={inset.left - 12} y={lineY + 4} textAnchor="end" fontSize="11" fill="#a1a1aa">
                {numberFormat.format(value)}
              </text>
            </g>
          );
        })}
        <path d={geometry.inventoryArea} fill="url(#reserve-inventory-area)" />
        <path d={geometry.inventoryPath} fill="none" stroke="#60a5fa" strokeWidth="3" />
        <path d={geometry.inwardPath} fill="none" stroke="#2dd4bf" strokeWidth="2.5" />
        <path d={geometry.outwardPath} fill="none" stroke="#fb923c" strokeWidth="2.5" />
        {rows.map((row, index) => (
          <g key={row.date}>
            <circle cx={geometry.x(index)} cy={geometry.y(row.inventory)} r="3" fill="#15171b" stroke="#60a5fa" strokeWidth="2">
              <title>{`${formatDate(row.date, true)} — inventory ${numberFormat.format(row.inventory)}, inward ${numberFormat.format(row.inward)}, outward ${numberFormat.format(row.outward)}`}</title>
            </circle>
            {(index % geometry.labelStep === 0 || index === rows.length - 1) && (
              <text x={geometry.x(index)} y={height - 15} textAnchor="middle" fontSize="11" fill="#a1a1aa">
                {formatDate(row.date)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
});

export default function ReserveInventoryPage() {
  const defaults = useMemo(defaultRange, []);
  const today = useMemo(todayInIndia, []);
  const [draftRange, setDraftRange] = useState(defaults);
  const [range, setRange] = useState(defaults);
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationFilterOpen, setLocationFilterOpen] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestSequence = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);

  const validationError = useMemo(
    () => rangeError(draftRange.startDate, draftRange.endDate, today),
    [draftRange.endDate, draftRange.startDate, today],
  );
  const rangeDirty = draftRange.startDate !== range.startDate
    || draftRange.endDate !== range.endDate;

  const loadData = useCallback(async (force = false) => {
    const sequence = ++requestSequence.current;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(range);
      const request = await fetch(`/api/stock-in/reserve-inventory?${params}`, {
        cache: 'no-store',
        method: force ? 'POST' : 'GET',
        signal: controller.signal,
      });
      const body = await request.json().catch(() => null) as (ApiResponse & { error?: string }) | null;
      if (!request.ok) throw new Error(body?.error || 'Unable to load reserve inventory.');
      if (!body || !Array.isArray(body.data) || !Array.isArray(body.locations) || !body.generatedAt) {
        throw new Error('Reserve inventory returned an unexpected response.');
      }
      if (sequence === requestSequence.current) setResponse(body);
    } catch (loadError) {
      if (!controller.signal.aborted && sequence === requestSequence.current) {
        setResponse(null);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load reserve inventory.');
      }
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
      if (sequence === requestSequence.current) setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void loadData();
    return () => {
      requestSequence.current += 1;
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [loadData]);

  const itemTypes = useMemo(
    () => [...new Set((response?.data || []).map(classification))].sort((a, b) => a.localeCompare(b)),
    [response?.data],
  );
  const locations = useMemo(() => {
    const seen = new Set<string>();
    return (response?.locations || []).reduce<string[]>((values, value) => {
      const location = String(value || '').trim();
      if (location && !seen.has(location)) {
        seen.add(location);
        values.push(location);
      }
      return values;
    }, []);
  }, [response?.locations]);
  const selectedItemTypeSet = useMemo(() => new Set(selectedItemTypes), [selectedItemTypes]);
  const selectedLocationSet = useMemo(() => new Set(selectedLocations), [selectedLocations]);

  useEffect(() => {
    const allowed = new Set(itemTypes);
    setSelectedItemTypes((current) => {
      const next = current.filter((type) => allowed.has(type));
      return next.length === current.length ? current : next;
    });
  }, [itemTypes]);

  useEffect(() => {
    const allowed = new Set(locations);
    setSelectedLocations((current) => {
      const next = current.filter((location) => allowed.has(location));
      return next.length === current.length ? current : next;
    });
  }, [locations]);

  const filteredRows = useMemo(
    () => (response?.data || []).filter(
      (row) => (!selectedItemTypeSet.size || selectedItemTypeSet.has(classification(row)))
        && (!selectedLocationSet.size || selectedLocationSet.has(inventoryLocation(row))),
    ),
    [response?.data, selectedItemTypeSet, selectedLocationSet],
  );
  const reportRows = useMemo(() => combinedRows(filteredRows), [filteredRows]);
  const displayedLocations = useMemo(
    () => selectedLocationSet.size
      ? locations.filter((location) => selectedLocationSet.has(location))
      : locations,
    [locations, selectedLocationSet],
  );
  const locationPivotRows = useMemo(
    () => locationPivot(filteredRows, displayedLocations),
    [displayedLocations, filteredRows],
  );
  const daily = useMemo(
    () => dailySeries(reportRows, range.startDate, range.endDate),
    [range.endDate, range.startDate, reportRows],
  );
  const populatedDays = useMemo(() => daily.filter((day) => day.hasData), [daily]);
  const latestDay = populatedDays[populatedDays.length - 1];
  const totals = useMemo(() => reportRows.reduce(
    (total, row) => ({
      inward: total.inward + row.inward,
      outward: total.outward + row.outward,
    }),
    { inward: 0, outward: 0 },
  ), [reportRows]);
  const netMovement = totals.inward - totals.outward;
  const latestDate = latestDay?.date || '';
  const inventoryByClassification = useMemo(() => reportRows
    .filter((row) => row.date === latestDate)
    .map((row) => ({ itemType: row.itemType, inventory: row.inventory }))
    .sort((left, right) => right.inventory - left.inventory), [latestDate, reportRows]);
  const largestClassification = Math.max(1, ...inventoryByClassification.map((row) => row.inventory));
  const visibleItemTypeCount = useMemo(
    () => new Set(reportRows.map((row) => row.itemType)).size,
    [reportRows],
  );
  const responseTime = response
    ? new Date(response.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '';

  const toggleItemType = (itemType: string) => {
    setSelectedItemTypes((current) => current.includes(itemType)
      ? current.filter((value) => value !== itemType)
      : [...current, itemType]);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((current) => current.includes(location)
      ? current.filter((value) => value !== location)
      : [...current, location]);
  };

  const applyRange = () => {
    if (validationError) return;
    setFilterOpen(false);
    setLocationFilterOpen(false);
    if (!rangeDirty) return;
    setRange({ ...draftRange });
  };

  const exportCsv = () => {
    if (!locationPivotRows.length) return;
    const lines = [
      ['Date', ...displayedLocations, 'Grand Total'],
      ...locationPivotRows.map((row) => [
        row.date,
        ...displayedLocations.map((location) => row.inventoryByLocation[location] || 0),
        row.grandTotal,
      ]),
    ].map((row) => row.map(csvCell).join(','));
    const url = URL.createObjectURL(new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `reserve-inventory-by-location-${range.startDate}-to-${range.endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="-m-6 min-h-full bg-[#0c0d0f] p-4 text-zinc-100 sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-400">Stock In / Reserve Inventory</p>
            <h1 className="text-2xl font-bold text-white">Reserve Inventory</h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400">
              Day-wise inventory levels and stock movement across configured EGL and PL reserve locations, classified by HSN.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              EGL 05, 20, 21, 22, 23, 24 · PL 10, 11, 40
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400" aria-live="polite">
            <span className={`h-2 w-2 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {loading
              ? 'Query running'
              : error
                ? 'Data unavailable'
                : `${response?.cache?.status === 'stale' ? 'Cached' : 'Updated'} ${responseTime}`}
          </div>
        </header>

        <section className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg" aria-label="Reserve inventory filters">
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-[160px] flex-1 text-xs font-semibold text-zinc-300">
              <span className="mb-1.5 flex items-center gap-1.5"><FiCalendar aria-hidden="true" /> Start date</span>
              <input
                type="date"
                value={draftRange.startDate}
                max={draftRange.endDate || today}
                aria-invalid={Boolean(validationError)}
                aria-describedby={validationError ? 'reserve-date-error' : undefined}
                onChange={(event) => setDraftRange((current) => ({ ...current, startDate: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500"
              />
            </label>
            <label className="min-w-[160px] flex-1 text-xs font-semibold text-zinc-300">
              <span className="mb-1.5 flex items-center gap-1.5"><FiCalendar aria-hidden="true" /> End date</span>
              <input
                type="date"
                value={draftRange.endDate}
                min={draftRange.startDate}
                max={today}
                aria-invalid={Boolean(validationError)}
                aria-describedby={validationError ? 'reserve-date-error' : undefined}
                onChange={(event) => setDraftRange((current) => ({ ...current, endDate: event.target.value }))}
                className="h-10 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none [color-scheme:dark] focus:border-teal-500"
              />
            </label>
            <div
              className="relative min-w-[240px] flex-[1.4] text-xs font-semibold text-zinc-300"
              onKeyDown={(event) => {
                if (event.key === 'Escape') setLocationFilterOpen(false);
              }}
            >
              <span id="location-filter-label" className="mb-1.5 flex items-center gap-1.5"><FiFilter aria-hidden="true" /> Location</span>
              <button
                type="button"
                aria-labelledby="location-filter-label location-filter-value"
                aria-expanded={locationFilterOpen}
                aria-controls="location-filter-options"
                onClick={() => {
                  setLocationFilterOpen((open) => !open);
                  setFilterOpen(false);
                }}
                disabled={!locations.length}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-left text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 focus:border-teal-500 disabled:opacity-50"
              >
                <span id="location-filter-value" className="truncate">
                  {selectedLocations.length ? `${selectedLocations.length} selected` : 'All locations'}
                </span>
                <FiChevronDown aria-hidden="true" className={`shrink-0 transition-transform ${locationFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationFilterOpen && (
                <div id="location-filter-options" role="group" aria-label="Choose reserve locations" className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-[280px] overflow-auto rounded-lg border border-zinc-600 bg-zinc-900 p-2 shadow-2xl">
                  <button type="button" onClick={() => setSelectedLocations([])} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800">
                    <input type="checkbox" readOnly tabIndex={-1} checked={!selectedLocations.length} className="accent-teal-500" />
                    All locations
                  </button>
                  {locations.map((location) => (
                    <label key={location} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-normal text-zinc-200 hover:bg-zinc-800">
                      <input type="checkbox" checked={selectedLocationSet.has(location)} onChange={() => toggleLocation(location)} className="accent-teal-500" />
                      <span className="truncate">{location}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div
              className="relative min-w-[240px] flex-[1.4] text-xs font-semibold text-zinc-300"
              onKeyDown={(event) => {
                if (event.key === 'Escape') setFilterOpen(false);
              }}
            >
              <span id="hsn-filter-label" className="mb-1.5 flex items-center gap-1.5"><FiFilter aria-hidden="true" /> HSN classification</span>
              <button
                type="button"
                aria-labelledby="hsn-filter-label hsn-filter-value"
                aria-expanded={filterOpen}
                aria-controls="hsn-filter-options"
                onClick={() => {
                  setFilterOpen((open) => !open);
                  setLocationFilterOpen(false);
                }}
                disabled={!itemTypes.length}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-600 bg-zinc-900 px-3 text-left text-sm font-medium text-zinc-100 outline-none hover:border-teal-500 focus:border-teal-500 disabled:opacity-50"
              >
                <span id="hsn-filter-value" className="truncate">
                  {selectedItemTypes.length ? `${selectedItemTypes.length} selected` : 'All classifications'}
                </span>
                <FiChevronDown aria-hidden="true" className={`shrink-0 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              {filterOpen && (
                <div id="hsn-filter-options" role="group" aria-label="Choose HSN classifications" className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full min-w-[280px] overflow-auto rounded-lg border border-zinc-600 bg-zinc-900 p-2 shadow-2xl">
                  <button type="button" onClick={() => setSelectedItemTypes([])} className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800">
                    <input type="checkbox" readOnly tabIndex={-1} checked={!selectedItemTypes.length} className="accent-teal-500" />
                    All classifications
                  </button>
                  {itemTypes.map((itemType) => (
                    <label key={itemType} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-normal text-zinc-200 hover:bg-zinc-800">
                      <input type="checkbox" checked={selectedItemTypeSet.has(itemType)} onChange={() => toggleItemType(itemType)} className="accent-teal-500" />
                      <span className="truncate">{itemType}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={applyRange}
              disabled={loading || Boolean(validationError) || !rangeDirty}
              className="h-10 rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply dates
            </button>
            <button type="button" onClick={() => void loadData(true)} disabled={loading} title={`Force-refresh reserve inventory for ${range.startDate} to ${range.endDate}`} aria-label={`Force-refresh reserve inventory for ${range.startDate} to ${range.endDate}`} className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50">
              <FiRefreshCw aria-hidden="true" className={loading ? 'animate-spin' : ''} />
            </button>
            <button type="button" onClick={exportCsv} disabled={!locationPivotRows.length || loading} title="Export day-wise location inventory" aria-label="Export day-wise location inventory as CSV" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50">
              <FiDownload aria-hidden="true" />
            </button>
          </div>
          {validationError && <p id="reserve-date-error" role="alert" className="mt-2 text-xs font-medium text-amber-400">{validationError}</p>}
          {!validationError && rangeDirty && (
            <p role="status" className="mt-2 text-xs font-medium text-amber-400">
              Date changes are not applied yet. Select Apply dates to update the dashboard.
            </p>
          )}
          <p className="mt-3 text-xs text-zinc-500">
            Dates are IST calendar days. Available inventory requires GOOD condition, AVAILABLE status, and AVAILABLE availability. Inward and outward are movements into and out of the selected reserve locations; transfers between selected locations can appear on both sides.
          </p>
        </section>

        {error && (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
            <FiAlertCircle aria-hidden="true" className="shrink-0 text-lg" />
            <div className="min-w-0 flex-1"><b>Reserve inventory request failed.</b> {error}</div>
            <button type="button" onClick={() => void loadData()} className="rounded-md border border-red-700 px-3 py-1.5 font-semibold hover:bg-red-900">Try again</button>
          </div>
        )}

        {response?.warning && (
          <div role="alert" className="flex items-center gap-3 rounded-lg border border-amber-800 bg-amber-950/80 px-4 py-3 text-sm text-amber-200">
            <FiAlertCircle aria-hidden="true" className="shrink-0 text-lg" />
            <div><b>Reserve inventory cache notice.</b> {response.warning}</div>
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-busy={loading} aria-label="Reserve inventory summary">
          <article className="rounded-lg border-l-4 border-blue-500 bg-[#191b20] p-4 shadow-lg">
            <p className="text-xs font-semibold uppercase text-zinc-400">Latest inventory</p>
            <strong className="mt-2 block text-2xl text-white">{loading ? '—' : numberFormat.format(latestDay?.inventory || 0)}</strong>
            <span className="text-xs text-zinc-400">{latestDate ? `As of ${formatDate(latestDate, true)}` : 'No recorded level'}</span>
          </article>
          <article className="rounded-lg border-l-4 border-teal-500 bg-[#191b20] p-4 shadow-lg">
            <p className="text-xs font-semibold uppercase text-zinc-400">Location inward</p>
            <strong className="mt-2 block text-2xl text-white">{loading ? '—' : numberFormat.format(totals.inward)}</strong>
            <span className="text-xs text-zinc-400">Across selected HSN and locations</span>
          </article>
          <article className="rounded-lg border-l-4 border-orange-500 bg-[#191b20] p-4 shadow-lg">
            <p className="text-xs font-semibold uppercase text-zinc-400">Location outward</p>
            <strong className="mt-2 block text-2xl text-white">{loading ? '—' : numberFormat.format(totals.outward)}</strong>
            <span className="text-xs text-zinc-400">Across selected HSN and locations</span>
          </article>
          <article className={`rounded-lg border-l-4 ${netMovement < 0 ? 'border-rose-500' : 'border-violet-500'} bg-[#191b20] p-4 shadow-lg`}>
            <p className="text-xs font-semibold uppercase text-zinc-400">Net movement</p>
            <strong className={`mt-2 block text-2xl ${netMovement < 0 ? 'text-rose-400' : 'text-white'}`}>{loading ? '—' : `${netMovement > 0 ? '+' : ''}${numberFormat.format(netMovement)}`}</strong>
            <span className="text-xs text-zinc-400">Inward minus outward</span>
          </article>
          <article className="col-span-2 rounded-lg border-l-4 border-fuchsia-500 bg-[#191b20] p-4 shadow-lg lg:col-span-1">
            <p className="text-xs font-semibold uppercase text-zinc-400">HSN classes</p>
            <strong className="mt-2 block text-2xl text-white">{loading ? '—' : numberFormat.format(visibleItemTypeCount)}</strong>
            <span className="text-xs text-zinc-400">Matching both filters</span>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.8fr)]">
          <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">Daily inventory and location movement</h2>
                <p className="text-xs text-zinc-400">Inventory is a daily level; inward and outward are daily location movements.</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-zinc-300" aria-label="Chart legend">
                <span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-blue-400" />Inventory</span>
                <span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-teal-400" />Inward</span>
                <span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-orange-400" />Outward</span>
              </div>
            </div>
            {loading ? (
              <div className="h-[310px] animate-pulse rounded-lg bg-zinc-800" aria-label="Loading daily inventory chart" />
            ) : reportRows.length ? (
              <InventoryTrendChart rows={daily} />
            ) : (
              <div className="flex h-[310px] items-center justify-center rounded-lg border border-dashed border-zinc-700 text-center text-sm text-zinc-400">
                <p>No inventory records found for the selected dates, locations, and HSN filters.</p>
              </div>
            )}
          </article>

          <article className="rounded-lg border border-zinc-700 bg-[#15171b] p-4 shadow-lg">
            <div className="mb-4">
              <h2 className="text-base font-bold text-white">Latest HSN split</h2>
              <p className="text-xs text-zinc-400">Inventory contribution {latestDate ? `on ${formatDate(latestDate, true)}` : 'for the latest day'}</p>
            </div>
            {loading ? (
              <div className="space-y-4" aria-label="Loading HSN inventory split">
                {[1, 2, 3, 4].map((key) => <div key={key} className="h-9 animate-pulse rounded bg-zinc-800" />)}
              </div>
            ) : inventoryByClassification.length ? (
              <div className="max-h-[310px] space-y-3 overflow-auto pr-1">
                {inventoryByClassification.map((row) => (
                  <button key={row.itemType} type="button" onClick={() => toggleItemType(row.itemType)} className={`block w-full border-l-2 pl-2 text-left ${selectedItemTypeSet.has(row.itemType) ? 'border-teal-400' : 'border-transparent'}`} aria-pressed={selectedItemTypeSet.has(row.itemType)} title={`Filter by ${row.itemType}`}>
                    <span className="mb-1 flex items-center justify-between gap-3 text-xs">
                      <b className="truncate text-zinc-200">{row.itemType}</b>
                      <span className="text-zinc-400">{numberFormat.format(row.inventory)}</span>
                    </span>
                    <span className="block h-2 rounded-full bg-zinc-800">
                      <i className="block h-full rounded-full bg-blue-500" style={{ width: `${Math.max(2, (row.inventory / largestClassification) * 100)}%` }} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-20 text-center text-sm text-zinc-400">No HSN inventory to show.</p>
            )}
          </article>
        </section>

        <section className="overflow-hidden rounded-lg border border-zinc-700 bg-[#15171b] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700 px-4 py-3">
            <div>
              <h2 className="text-base font-bold text-white">Day-wise inventory by location</h2>
              <p className="text-xs text-zinc-400">Closing inventory summed across selected HSN classifications, with a total for every day.</p>
            </div>
            <span className="text-xs text-zinc-400">{loading ? 'Loading…' : `${numberFormat.format(locationPivotRows.length)} days`}</span>
          </div>
          <div className="max-h-[460px] overflow-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">Day-wise reserve inventory totals by location</caption>
              <thead className="sticky top-0 z-10 bg-zinc-800 text-left text-xs uppercase text-zinc-300">
                <tr>
                  <th scope="col" className="px-4 py-3">Date</th>
                  {displayedLocations.map((location) => (
                    <th key={location} scope="col" className="whitespace-nowrap px-4 py-3 text-right">{location}</th>
                  ))}
                  <th scope="col" className="whitespace-nowrap border-l border-zinc-700 px-4 py-3 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  [...Array(6)].map((_, index) => (
                    <tr key={index} aria-hidden="true">
                      <td colSpan={displayedLocations.length + 2} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-zinc-800" /></td>
                    </tr>
                  ))
                ) : locationPivotRows.length ? locationPivotRows.map((row) => (
                  <tr key={row.date} className="hover:bg-zinc-800/70">
                    <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium text-zinc-300">{formatDate(row.date, true)}</th>
                    {displayedLocations.map((location) => (
                      <td key={location} className="px-4 py-3 text-right font-medium text-blue-300">
                        {numberFormat.format(row.inventoryByLocation[location] || 0)}
                      </td>
                    ))}
                    <td className="border-l border-zinc-800 px-4 py-3 text-right font-bold text-blue-400">{numberFormat.format(row.grandTotal)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={displayedLocations.length + 2} className="px-4 py-14 text-center text-zinc-400">No reserve inventory records match the selected range, locations, and HSN classifications.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
