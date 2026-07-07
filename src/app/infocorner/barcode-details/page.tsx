'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Button,
  Input,
  Textarea,
  Badge,
  StatCard,
  Alert,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  StatusPill,
} from '@/components/ui';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResultRow {
  pid:          string;
  barcode:      string;
  latest_location:         string;
  "2nd_latest_location":         string;
  "3rd_latest_location":         string;
  "4th_latest_location":         string;
  updated_at:   string;
  status:       string;
  condition:    string;
  availability: string;
}

type RunStatus = 'idle' | 'running' | 'done' | 'error';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_BARCODES = 100_000;

const COLUMNS: { key: keyof ResultRow; label: string }[] = [
  { key: 'pid',          label: 'PID'              },
  { key: 'barcode',      label: 'Barcode'          },
  { key: 'latest_location',         label: 'Latest Loc'       },
  { key: '2nd_latest_location',         label: '2nd Latest'       },
  { key: '3rd_latest_location',         label: '3rd Latest'       },
  { key: '4th_latest_location',         label: '4th Latest'       },
  { key: 'updated_at',   label: 'Updated At'       },
  { key: 'status',       label: 'Status'           },
  { key: 'condition',    label: 'Condition'        },
  { key: 'availability', label: 'Availability'     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseBarcodes(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function statusStyle(val: string): React.CSSProperties {
  const v = (val ?? '').toLowerCase();
  if (v.includes('fail') || v.includes('damage') || v.includes('lost'))
    return { background: '#fff0ee', color: '#c0392b' };
  if (v.includes('available') || v.includes('good') || v.includes('active'))
    return { background: '#edfaf3', color: '#1a7a4a' };
  if (v.includes('pending') || v.includes('hold') || v.includes('transit'))
    return { background: '#fff3e8', color: '#e8650a' };
  if (v.includes('inactive') || v.includes('retire') || v.includes('discard'))
    return { background: '#f5f5f5', color: '#7a85a8' };
  return { background: '#f0f2f7', color: '#1f295c' };
}

function rowsToCSV(rows: ResultRow[]): string {
  const header = COLUMNS.map((c) => c.label).join(',');
  const body = rows.map((r) =>
    COLUMNS.map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  return header + '\n' + body;
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function getAllValues(rows: ResultRow[], key: keyof ResultRow): string[] {
  return Array.from(new Set(rows.map((r) => String(r[key] ?? '')).filter(Boolean))).sort();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProgressBarProps { percent: number; chunkInfo: string }
function ProgressBar({ percent, chunkInfo }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gold-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-xs text-gray-500">
        <span>{chunkInfo}</span>
        <span className="font-semibold text-brand-700">{percent}%</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BulkBarcodeLookupPage() {
  const [input,        setInput]        = useState('');
  const [status,       setStatus]       = useState<RunStatus>('idle');
  const [progress,     setProgress]     = useState(0);
  const [chunkInfo,    setChunkInfo]    = useState('');
  const [results,      setResults]      = useState<ResultRow[]>([]);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [condFilter,   setCondFilter]   = useState('ALL');
  const [availFilter,  setAvailFilter]  = useState('ALL');
  const [textFilter,   setTextFilter]   = useState('');
  const [sortCol,      setSortCol]      = useState<keyof ResultRow | null>(null);
  const [sortDir,      setSortDir]      = useState<'asc' | 'desc'>('asc');

  const abortRef = useRef<AbortController | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────

  const barcodes     = useMemo(() => parseBarcodes(input), [input]);
  const isRunning    = status === 'running';
  const allStatuses  = useMemo(() => getAllValues(results, 'status'),       [results]);
  const allConds     = useMemo(() => getAllValues(results, 'condition'),    [results]);
  const allAvails    = useMemo(() => getAllValues(results, 'availability'), [results]);

  const filtered = useMemo(() => {
    let r = results;
    if (statusFilter !== 'ALL') r = r.filter((row) => row.status       === statusFilter);
    if (condFilter   !== 'ALL') r = r.filter((row) => row.condition    === condFilter);
    if (availFilter  !== 'ALL') r = r.filter((row) => row.availability === availFilter);
    if (textFilter.trim()) {
      const q = textFilter.toLowerCase();
      r = r.filter((row) =>
        COLUMNS.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortCol) {
      r = [...r].sort((a, b) => {
        const av = String(a[sortCol] ?? '');
        const bv = String(b[sortCol] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return r;
  }, [results, statusFilter, condFilter, availFilter, textFilter, sortCol, sortDir]);

  const handleSort = (col: keyof ResultRow) => {
    if (sortCol === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  // ── Run ──────────────────────────────────────────────────────────────────

  const runLookup = useCallback(async () => {
    setErrorMsg('');
    if (barcodes.length === 0) { setErrorMsg('Paste at least one barcode, one per line.'); return; }
    if (barcodes.length > MAX_BARCODES) { setErrorMsg(`Max ${MAX_BARCODES.toLocaleString()} barcodes allowed.`); return; }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setStatus('running');
    setProgress(0);
    setChunkInfo('');
    setResults([]);
    setStatusFilter('ALL');
    setCondFilter('ALL');
    setAvailFilter('ALL');
    setTextFilter('');

    try {
      const res = await fetch('/api/order-info/barcode-details', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: barcodes.join('\n'),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';
      let   csvStarted = false;
      let   headerSkipped = false;
      const collected: ResultRow[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const t = line.trim();
          if (!t) continue;

          if (t === 'CSV_START') { csvStarted = true; continue; }

          if (t.startsWith('PROGRESS:')) {
            const [, pct, chunk, total] = t.split(':');
            setProgress(Number(pct));
            setChunkInfo(`Chunk ${chunk} / ${total}`);
            // progressive render
            if (collected.length > 0) setResults([...collected]);
            continue;
          }

          if (csvStarted) {
            if (!headerSkipped) { headerSkipped = true; continue; }

            // Parse quoted CSV: "val","val",...
            const cols = t.match(/"(?:[^"]|"")*"/g) ?? [];
            const clean = (s: string | undefined) => s ? s.slice(1, -1).replace(/""/g, '"') : '';

            if (cols.length >= 10) {
              collected.push({
                pid:          clean(cols[0]),
                barcode:      clean(cols[1]),
                latest_location:         clean(cols[2]),
                "2nd_latest_location":         clean(cols[3]),
                "3rd_latest_location":         clean(cols[4]),
                "4th_latest_location":         clean(cols[5]),
                updated_at:   clean(cols[6]),
                status:       clean(cols[7]),
                condition:    clean(cols[8]),
                availability: clean(cols[9]),
              });
            }
          }
        }
      }

      setResults([...collected]);
      setProgress(100);
      setChunkInfo('');
      setStatus('done');
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') { setStatus('idle'); return; }
      setErrorMsg((err as Error).message ?? 'Unknown error occurred.');
      setStatus('error');
    }
  }, [barcodes]);

  const cancelLookup = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
    setProgress(0);
    setChunkInfo('');
  }, []);

  const clearAll = useCallback(() => {
    abortRef.current?.abort();
    setInput('');
    setResults([]);
    setProgress(0);
    setChunkInfo('');
    setStatus('idle');
    setErrorMsg('');
    setStatusFilter('ALL');
    setCondFilter('ALL');
    setAvailFilter('ALL');
    setTextFilter('');
    setSortCol(null);
  }, []);

  const exportCSV = useCallback(() => {
    if (filtered.length === 0) return;
    downloadCSV(rowsToCSV(filtered), 'barcode_locations.csv');
  }, [filtered]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const statusPillTone: Record<RunStatus, 'notice' | 'gold' | 'good' | 'danger'> = {
    idle: 'notice', running: 'gold', done: 'good', error: 'danger',
  };
  const statusLabel: Record<RunStatus, string> = {
    idle: 'Idle', running: 'Processing', done: 'Complete', error: 'Error',
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <PageHeader
        title="Bulk Barcode Location Lookup"
        subtitle="nexs_ims · barcode_item_history · top-4 locations"
        actions={
          <>
            {/* Status pill */}
            <StatusPill tone={statusPillTone[status]}>
              {statusLabel[status]}
            </StatusPill>
            <Badge tone="navy" className="font-mono">NexS Ascend</Badge>
          </>
        }
      />

      {/* ── Input card ── */}
      <Card>
        <CardHeader>
          <span className="text-sm font-semibold text-gray-700">Input — Barcodes (one per line)</span>
        </CardHeader>
        <CardBody className="space-y-3.5">
          <div className="flex flex-wrap items-start gap-4">

            {/* Textarea */}
            <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
              <Textarea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                placeholder={'BAR-000001\nBAR-000002\nBAR-000003'}
                className="h-[150px] font-mono text-xs"
                spellCheck={false}
              />
              <div className="font-mono text-xs text-gray-500">
                One barcode per line ·{' '}
                <span className="font-semibold text-gold-700">{barcodes.length.toLocaleString()}</span>
                {' '}parsed · max{' '}
                <span className="font-semibold text-gold-700">{MAX_BARCODES.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions column */}
            <div className="flex flex-col gap-2.5 pt-0.5">
              {!isRunning ? (
                <Button
                  onClick={runLookup}
                  disabled={barcodes.length === 0}
                >
                  Run Lookup
                </Button>
              ) : (
                <Button variant="danger" onClick={cancelLookup}>
                  Cancel
                </Button>
              )}
              <Button variant="outline" onClick={clearAll}>Clear All</Button>
              {results.length > 0 && (
                <Button
                  onClick={exportCSV}
                  className="bg-gold-500 text-brand-700 hover:bg-gold-500/90 focus-visible:ring-gold-500"
                >
                  Export CSV ↓
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          {isRunning && <ProgressBar percent={progress} chunkInfo={chunkInfo} />}

          {/* Error */}
          {errorMsg && (
            <Alert tone="error"><strong>Error:</strong> {errorMsg}</Alert>
          )}
        </CardBody>
      </Card>

      {/* ── Stats + filter chips ── */}
      {results.length > 0 && (
        <div className="flex flex-wrap items-start gap-4">

          {/* Stat cards */}
          <div className="flex flex-wrap gap-2.5">
            <StatCard value={barcodes.length.toLocaleString()} label="Queried"  tone="navy" />
            <StatCard value={results.length.toLocaleString()}  label="Matched"          />
            <StatCard value={filtered.length.toLocaleString()} label="Shown"            />
            <StatCard
              value={(barcodes.length - results.length).toLocaleString()}
              label="Not Found"
              tone={(barcodes.length - results.length) > 0 ? 'danger' : 'navy'}
            />
            <StatCard value={allStatuses.length}  label="Statuses"    />
            <StatCard value={allConds.length}     label="Conditions"  />
          </div>

          {/* Filter chips row */}
          <div className="flex flex-col gap-2">

            {/* Status */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wide text-gray-500">Status</span>
              {['ALL', ...allStatuses].map((v) => {
                const active = statusFilter === v;
                const bs = v !== 'ALL' ? statusStyle(v) : {};
                return (
                  <button
                    key={v}
                    onClick={() => setStatusFilter(v)}
                    className="cursor-pointer whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                    style={{
                      borderWidth: active ? 2 : 1.5,
                      borderStyle: 'solid',
                      borderColor: active ? '#1f295c' : '#d8dde8',
                      background:  active ? (v === 'ALL' ? '#1f295c' : bs.background) : '#fff',
                      color:       active ? (v === 'ALL' ? '#fff'    : bs.color)      : '#7a85a8',
                    }}
                  >{v}{v !== 'ALL' && <span style={{ marginLeft: 4, opacity: .6 }}>{results.filter((r) => r.status === v).length}</span>}</button>
                );
              })}
            </div>

            {/* Condition */}
            {allConds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wide text-gray-500">Condition</span>
                {['ALL', ...allConds].map((v) => {
                  const active = condFilter === v;
                  const bs = v !== 'ALL' ? statusStyle(v) : {};
                  return (
                    <button
                      key={v}
                      onClick={() => setCondFilter(v)}
                      className="cursor-pointer whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                      style={{
                        borderWidth: active ? 2 : 1.5,
                        borderStyle: 'solid',
                        borderColor: active ? '#1f295c' : '#d8dde8',
                        background:  active ? (v === 'ALL' ? '#1f295c' : bs.background) : '#fff',
                        color:       active ? (v === 'ALL' ? '#fff'    : bs.color)      : '#7a85a8',
                      }}
                    >{v}{v !== 'ALL' && <span style={{ marginLeft: 4, opacity: .6 }}>{results.filter((r) => r.condition === v).length}</span>}</button>
                  );
                })}
              </div>
            )}

            {/* Availability */}
            {allAvails.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wide text-gray-500">Availability</span>
                {['ALL', ...allAvails].map((v) => {
                  const active = availFilter === v;
                  const bs = v !== 'ALL' ? statusStyle(v) : {};
                  return (
                    <button
                      key={v}
                      onClick={() => setAvailFilter(v)}
                      className="cursor-pointer whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
                      style={{
                        borderWidth: active ? 2 : 1.5,
                        borderStyle: 'solid',
                        borderColor: active ? '#1f295c' : '#d8dde8',
                        background:  active ? (v === 'ALL' ? '#1f295c' : bs.background) : '#fff',
                        color:       active ? (v === 'ALL' ? '#fff'    : bs.color)      : '#7a85a8',
                      }}
                    >{v}{v !== 'ALL' && <span style={{ marginLeft: 4, opacity: .6 }}>{results.filter((r) => r.availability === v).length}</span>}</button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Results card ── */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <span className="text-sm font-semibold text-gray-700">Location Results</span>
            <span className="font-mono text-xs text-brand-300">
              {progress === 100 ? 'complete' : `${progress}%`}
            </span>
          </CardHeader>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
            <span className="font-mono text-xs text-gray-500">
              <strong className="text-brand-700">{filtered.length.toLocaleString()}</strong>
              {filtered.length !== results.length ? ` of ${results.length.toLocaleString()}` : ''} rows
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search all columns…"
                value={textFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTextFilter(e.target.value)}
                className="w-56 font-mono text-xs"
              />
              {filtered.length > 0 && (
                <Button
                  size="sm"
                  onClick={exportCSV}
                  className="bg-gold-500 text-brand-700 hover:bg-gold-500/90 focus-visible:ring-gold-500"
                >
                  Export ↓
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[520px] overflow-auto">
            <Table>
              <THead>
                <tr>
                  <TH>#</TH>
                  {COLUMNS.map((col) => {
                    const isSorted = sortCol === col.key;
                    return (
                      <TH
                        key={col.key}
                        className="cursor-pointer select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        <span className={cn('ml-1 text-[10px]', isSorted ? 'opacity-100' : 'opacity-30')}>
                          {isSorted ? (sortDir === 'asc' ? '▲' : '▼') : '▲'}
                        </span>
                      </TH>
                    );
                  })}
                </tr>
              </THead>
              <TBody>
                {filtered.length === 0 ? (
                  <tr>
                    <TD colSpan={COLUMNS.length + 1} className="p-8 text-center text-gray-500">
                      No rows match your filters.
                    </TD>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <TR key={row.barcode + i}>
                      <TD className="font-mono text-gray-500">{i + 1}</TD>
                      <TD className="font-mono text-xs text-gray-500">{row.pid || '—'}</TD>
                      <TD className="font-mono font-semibold text-brand-700">{row.barcode || '—'}</TD>

                      {/* Location trail */}
                      <TD>
                        {row.latest_location
                          ? <span className="rounded bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">{row.latest_location}</span>
                          : <span className="text-gray-300">—</span>}
                      </TD>
                      <TD>
                        {row['2nd_latest_location']
                          ? <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-brand-700">{row['2nd_latest_location']}</span>
                          : <span className="text-gray-300">—</span>}
                      </TD>
                      <TD>
                        {row['3rd_latest_location']
                          ? <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{row['3rd_latest_location']}</span>
                          : <span className="text-gray-300">—</span>}
                      </TD>
                      <TD>
                        {row['4th_latest_location']
                          ? <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{row['4th_latest_location']}</span>
                          : <span className="text-gray-300">—</span>}
                      </TD>

                      <TD className="font-mono text-xs text-gray-500">{formatDate(row.updated_at)}</TD>

                      {/* Status badge */}
                      <TD>
                        {row.status
                          ? <span className="inline-block rounded px-2 py-0.5 text-xs font-bold" style={statusStyle(row.status)}>{row.status}</span>
                          : '—'}
                      </TD>

                      {/* Condition badge */}
                      <TD>
                        {row.condition
                          ? <span className="inline-block rounded px-2 py-0.5 text-xs font-bold" style={statusStyle(row.condition)}>{row.condition}</span>
                          : '—'}
                      </TD>

                      {/* Availability badge */}
                      <TD>
                        {row.availability
                          ? <span className="inline-block rounded px-2 py-0.5 text-xs font-bold" style={statusStyle(row.availability)}>{row.availability}</span>
                          : '—'}
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ── Done / empty state ── */}
      {status === 'done' && results.length === 0 && (
        <Card className="flex flex-col items-center gap-2.5 px-6 py-12 text-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#d8dde8" strokeWidth="2"/>
            <path d="M13 20h14" stroke="#d8dde8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="text-sm font-medium text-gray-500">
            No matching barcodes found in <strong className="text-brand-700">barcode_item_history</strong>.
          </div>
        </Card>
      )}

    </div>
  );
}
