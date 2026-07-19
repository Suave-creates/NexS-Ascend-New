'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  ChangeEvent,
} from 'react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Badge,
  Alert,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedPair {
  fittingId: string;
  cutoff: string;
}

interface ResultRow {
  fitting_id: string;
  max_updated_at: string;
  rx_status: string;
  lk_status: string;
}

type RunStatus = 'idle' | 'running' | 'done' | 'error';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_ROWS = 10_000;

const STATUS_CONFIG: Record<RunStatus, { label: string; dot: string }> = {
  idle:    { label: 'Idle',       dot: 'bg-gray-400' },
  running: { label: 'Processing', dot: 'bg-gold-500' },
  done:    { label: 'Complete',   dot: 'bg-good-600' },
  error:   { label: 'Error',      dot: 'bg-danger-600' },
};

const STATUS_TONE: Record<RunStatus, 'gray' | 'gold' | 'good' | 'danger'> = {
  idle:    'gray',
  running: 'gold',
  done:    'good',
  error:   'danger',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTSV(raw: string): ParsedPair[] {
  return raw
    .split(/[\r\n]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => {
      const [fittingId, cutoff] = l.split(/\t/);
      return { fittingId: fittingId?.trim() ?? '', cutoff: cutoff?.trim() ?? '' };
    })
    .filter((p) => p.fittingId && p.cutoff);
}

function rowsToCSV(rows: ResultRow[]): string {
  const header = 'fitting_id,max_updated_at,rx_status,lk_status\n';
  const body = rows
    .map((r) =>
      [r.fitting_id, r.max_updated_at, r.rx_status, r.lk_status]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');
  return header + body;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatusPillProps { status: RunStatus }
function StatusPill({ status }: StatusPillProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          cfg.dot,
          status === 'running' && 'animate-pulse',
        )}
      />
      <Badge tone={STATUS_TONE[status]} className="font-mono">{cfg.label}</Badge>
    </div>
  );
}

interface ProgressBarProps { percent: number; chunkInfo: string }
function ProgressBar({ percent, chunkInfo }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-gold-500 transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between font-mono text-xs text-gray-500">
        <span>{chunkInfo}</span>
        <span className="font-semibold text-brand-700">{percent}%</span>
      </div>
    </div>
  );
}

interface ResultsTableProps { rows: ResultRow[] }
function ResultsTable({ rows }: ResultsTableProps) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter.trim()) return rows;
    const q = filter.toLowerCase();
    return rows.filter(
      (r) =>
        r.fitting_id.toLowerCase().includes(q) ||
        r.rx_status.toLowerCase().includes(q) ||
        r.lk_status.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-3">
        <span className="font-mono text-xs text-gray-500">
          <strong className="text-brand-700">{filtered.length}</strong>
          {filtered.length !== rows.length ? ` / ${rows.length}` : ''} results
        </span>
        <Input
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          placeholder="Filter results…"
          className="w-56 font-mono"
        />
      </div>

      {/* Table (vertical-scroll region) */}
      <div className="max-h-80 overflow-auto p-4">
        <Table>
          <THead>
            <TR>
              {['Fitting ID', 'Max Updated At', 'Rx Status', 'Lk Status'].map((h) => (
                <TH key={h}>{h}</TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {filtered.length === 0 ? (
              <TR>
                <TD colSpan={4} className="py-6 text-center text-gray-500">
                  No results match your filter.
                </TD>
              </TR>
            ) : (
              filtered.map((row, i) => (
                <TR key={i}>
                  <TD className="font-mono font-semibold text-brand-700">{row.fitting_id}</TD>
                  <TD className="font-mono">{row.max_updated_at}</TD>
                  <TD>
                    <Badge tone="notice">{row.rx_status}</Badge>
                  </TD>
                  <TD>
                    <Badge tone="good">{row.lk_status}</Badge>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BulkFittingLookup() {
  const [tsvInput,    setTsvInput]    = useState('');
  const [status,      setStatus]      = useState<RunStatus>('idle');
  const [progress,    setProgress]    = useState(0);
  const [chunkInfo,   setChunkInfo]   = useState('');
  const [results,     setResults]     = useState<ResultRow[]>([]);
  const [errorMsg,    setErrorMsg]    = useState('');
  const abortRef = useRef<AbortController | null>(null);

  // Derived
  const parsedPairs  = useMemo(() => parseTSV(tsvInput), [tsvInput]);
  const rowCount     = parsedPairs.length;
  const isRunning    = status === 'running';

  // ── Run ──────────────────────────────────────────────────────────────────

  const runLookup = useCallback(async () => {
    setErrorMsg('');

    if (rowCount === 0) {
      setErrorMsg('No valid rows found. Paste fitting_id [TAB] cutoff_datetime, one per line.');
      return;
    }
    if (rowCount > MAX_ROWS) {
      setErrorMsg(`Too many rows (${rowCount.toLocaleString()}). Max is ${MAX_ROWS.toLocaleString()}.`);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setStatus('running');
    setProgress(0);
    setChunkInfo('');
    setResults([]);

    try {
      const body   = parsedPairs.map((p) => `${p.fittingId}\t${p.cutoff}`).join('\n');
      const res    = await fetch('/api/lens-lab/jit-PD-stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';
      let   csvStarted = false;
      const collected: ResultRow[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed === 'CSV_START') { csvStarted = true; continue; }

          if (trimmed.startsWith('PROGRESS:')) {
            const [, pct, chunk, total] = trimmed.split(':');
            setProgress(Number(pct));
            setChunkInfo(`Chunk ${chunk} / ${total}`);
            continue;
          }

          if (csvStarted && trimmed.startsWith('"')) {
            // Skip header row
            if (trimmed.startsWith('"fitting_id"')) continue;

            const cols = trimmed.match(/"(?:[^"]|"")*"/g) ?? [];
            const clean = (s: string | undefined) => s ? s.slice(1, -1).replace(/""/g, '"') : '';

            if (cols.length >= 4) {
              collected.push({
                fitting_id:    clean(cols[0]),
                max_updated_at: clean(cols[1]),
                rx_status:     clean(cols[2]),
                lk_status:     clean(cols[3]),
              });
              // Progressive render every 50 rows
              if (collected.length % 50 === 0) setResults([...collected]);
            }
          }
        }
      }

      setResults([...collected]);
      setProgress(100);
      setStatus('done');
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        setStatus('idle');
      } else {
        setErrorMsg((err as Error).message ?? 'Unknown error');
        setStatus('error');
      }
    }
  }, [parsedPairs, rowCount]);

  // ── Cancel ───────────────────────────────────────────────────────────────

  const cancelLookup = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
    setProgress(0);
    setChunkInfo('');
  }, []);

  // ── Clear ────────────────────────────────────────────────────────────────

  const clearAll = useCallback(() => {
    abortRef.current?.abort();
    setTsvInput('');
    setResults([]);
    setProgress(0);
    setChunkInfo('');
    setStatus('idle');
    setErrorMsg('');
  }, []);

  // ── Export ───────────────────────────────────────────────────────────────

  const exportCSV = useCallback(() => {
    if (results.length === 0) return;
    downloadBlob(rowsToCSV(results), 'fitting_results.csv', 'text/csv;charset=utf-8;');
  }, [results]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Fitting Lookup"
        subtitle="jitdb · jit_order_status_details_aud · PRODUCTION_DONE"
        actions={<Badge tone="navy" className="font-mono tracking-wide">SONI-G</Badge>}
      />

      {/* ── Input Card ── */}
      <Card>
        <CardHeader>
          <span className="text-sm font-semibold text-brand-700">
            Input — Fitting IDs &amp; Cutoff Datetimes
          </span>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">TSV Paste Input</div>
            <Textarea
              value={tsvInput}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTsvInput(e.target.value)}
              placeholder={`FITID-001\t2024-06-01 10:00:00\nFITID-002\t2024-06-02 09:30:00`}
              className="h-32 resize-y font-mono text-[12.5px] leading-relaxed"
              spellCheck={false}
            />
            <div className="mt-1.5 font-mono text-xs text-gray-500">
              Format: <span className="font-semibold text-gold-700">fitting_id</span>
              {' [TAB] '}
              <span className="font-semibold text-gold-700">cutoff_datetime</span>
              {' · one row per line · max 10,000 rows'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard value={rowCount.toLocaleString()} label="Rows Parsed" tone="navy" />
            <StatCard value={results.length > 0 ? results.length.toLocaleString() : '—'} label="Matches Found" tone="good" />
            <StatCard value={isRunning ? `${progress}%` : status === 'done' ? '100%' : '—'} label="Progress" tone="gold" />
          </div>

          {/* Progress bar */}
          {isRunning && (
            <ProgressBar percent={progress} chunkInfo={chunkInfo} />
          )}

          {/* Error */}
          {errorMsg && (
            <Alert tone="error">
              <strong>Error:</strong> {errorMsg}
            </Alert>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex gap-2.5">
              {!isRunning ? (
                <Button onClick={runLookup} disabled={rowCount === 0}>
                  Run Lookup
                </Button>
              ) : (
                <Button variant="danger" onClick={cancelLookup}>
                  Cancel
                </Button>
              )}
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
              {results.length > 0 && (
                <Button variant="secondary" onClick={exportCSV}>
                  Export CSV ↓
                </Button>
              )}
            </div>
            <StatusPill status={status} />
          </div>

        </CardBody>
      </Card>

      {/* ── Results Card ── */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <span className="text-sm font-semibold text-brand-700">Results</span>
          </CardHeader>
          <ResultsTable rows={results} />
        </Card>
      )}
    </div>
  );
}
