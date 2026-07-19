'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FiSearch, FiDownloadCloud } from 'react-icons/fi';
import {
  Card,
  CardBody,
  PageHeader,
  Field,
  Input,
  Textarea,
  Button,
  Alert,
  Badge,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

export default function OrderInformationCornerPage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [singleInput, setSingleInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [singleResult, setSingleResult] = useState<Record<string, any>[] | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const CHUNK_SIZE = 350;
  const LIMIT = 150_000;

  const parseBulkIds = (text: string): string[] =>
    text.split('\n').map((v) => v.trim()).filter((v) => v.length > 0);

  const bulkIds = parseBulkIds(bulkInput);

  const exportToXlsx = (rows: any[], filename: string) => {
    const SHEET_CHUNK = 10_000;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows.slice(0, SHEET_CHUNK));
    for (let i = SHEET_CHUNK; i < rows.length; i += SHEET_CHUNK) {
      XLSX.utils.sheet_add_json(ws, rows.slice(i, i + SHEET_CHUNK), {
        skipHeader: true,
        origin: -1,
      });
    }
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, filename);
  };

  const handleSingle = async () => {
    setError(null);
    setSingleResult(null);
    const id = singleInput.trim();
    if (!id) { setError('Please enter a valid Fitting ID.'); return; }

    setIsPending(true);
    try {
      const res = await fetch('/api/infocorner/barcode-scan/order-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'single', payload: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      const rows = Array.isArray(data.rows) ? data.rows : [];
      if (rows.length === 0) throw new Error('No data found for this Fitting ID.');
      setSingleResult(rows);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order information.');
    } finally {
      setIsPending(false);
    }
  };

  const handleBulk = async () => {
    setError(null);
    setProgress(null);
    if (bulkIds.length === 0) { setError('No valid Fitting IDs found. Enter one ID per line.'); return; }
    if (bulkIds.length > LIMIT) { setError(`Too many IDs. Maximum allowed is ${LIMIT.toLocaleString()}.`); return; }

    setIsPending(true);
    try {
      const chunks: string[][] = [];
      for (let i = 0; i < bulkIds.length; i += CHUNK_SIZE) {
        chunks.push(bulkIds.slice(i, i + CHUNK_SIZE));
      }

      const allRows: any[] = [];
      for (let i = 0; i < chunks.length; i++) {
        setProgress({ current: i + 1, total: chunks.length });
        const res = await fetch('/api/infocorner/barcode-scan/order-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'bulk', payload: chunks[i] }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        if (Array.isArray(data.rows)) {
          for (const row of data.rows) allRows.push(row);
        }
      }

      setProgress(null);
      if (allRows.length === 0) throw new Error('No data returned for the given IDs.');
      exportToXlsx(allRows, `orders-bulk-${Date.now()}.xlsx`);
    } catch (err: any) {
      setProgress(null);
      setError(err.message || 'Failed to fetch order information.');
    } finally {
      setIsPending(false);
    }
  };

  const columns = singleResult && singleResult.length > 0 ? Object.keys(singleResult[0]) : [];
  const latestStatus = singleResult && singleResult.length > 0
    ? (singleResult[singleResult.length - 1]?.status ?? '—')
    : '—';

  return (
    <div className="space-y-6">
      <PageHeader title="Order Information Corner" subtitle="Operations" />

      {/* Layout: left control panel + right results */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* ── Left panel ── */}
        <div className="w-full shrink-0 space-y-4 lg:w-72">

          {/* Input card */}
          <Card className="overflow-hidden">
            {/* Tab switcher */}
            <div className="bg-brand-700 p-2">
              <div className="flex gap-1">
                {(['single', 'bulk'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); setSingleResult(null); }}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                      mode === m
                        ? 'bg-white text-brand-700'
                        : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                    }`}
                  >
                    {m === 'single' ? 'Single' : 'Bulk'}
                  </button>
                ))}
              </div>
            </div>

            <CardBody className="space-y-3">
              {mode === 'single' ? (
                <>
                  <Field label="Fitting ID">
                    <Input
                      type="text"
                      placeholder="e.g. 882730722"
                      value={singleInput}
                      onChange={(e) => setSingleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSingle()}
                      className="font-mono placeholder:font-sans"
                    />
                  </Field>
                  <Button
                    onClick={handleSingle}
                    disabled={!singleInput.trim() || isPending}
                    loading={isPending}
                    className="w-full"
                  >
                    {isPending ? 'Fetching…' : (<><FiSearch className="h-4 w-4" /> Fetch Journey</>)}
                  </Button>
                </>
              ) : (
                <>
                  <Field
                    label={
                      <span className="flex items-center justify-between gap-2">
                        <span>Fitting IDs</span>
                        {bulkIds.length > 0 && <Badge tone="navy">{bulkIds.length}</Badge>}
                      </span>
                    }
                  >
                    <Textarea
                      placeholder={'882730722\n883590938\n884421656'}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      rows={7}
                      className="resize-none font-mono leading-relaxed placeholder:font-sans"
                    />
                  </Field>
                  <Button
                    onClick={handleBulk}
                    disabled={bulkIds.length === 0 || isPending}
                    loading={isPending}
                    className="w-full"
                  >
                    {isPending
                      ? (progress ? `Chunk ${progress.current} / ${progress.total}…` : 'Preparing…')
                      : (<><FiDownloadCloud className="h-4 w-4" /> Export All</>)}
                  </Button>

                  {isPending && progress && (
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-brand-700 transition-all duration-300"
                          style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-brand-700/60">
                          {Math.round((progress.current / progress.total) * 100)}% complete
                        </span>
                        <span className="font-mono text-[10px] text-brand-700/50">
                          {Math.min(progress.current * CHUNK_SIZE, bulkIds.length).toLocaleString()} / {bulkIds.length.toLocaleString()} IDs
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {error && <Alert tone="error">{error}</Alert>}
            </CardBody>
          </Card>

          {/* Summary — appears after single fetch */}
          {singleResult && singleResult.length > 0 && (
            <div className="space-y-3">
              <StatCard
                label="Journey Events"
                value={singleResult.length}
                sub={`Latest status: ${latestStatus}`}
                tone="navy"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => exportToXlsx(singleResult!, `order-journey-${singleInput.trim()}.xlsx`)}
              >
                <FiDownloadCloud className="h-4 w-4" /> Export as Excel
              </Button>
            </div>
          )}
        </div>

        {/* ── Right: Results panel ── */}
        <div className="min-w-0 flex-1">
          {!singleResult ? (
            /* Empty state */
            <Card
              className="flex flex-col items-center justify-center border-dashed p-16 text-center"
              style={{ minHeight: 420 }}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <FiSearch className="h-5 w-5 text-brand-700/40" />
              </div>
              <p className="text-sm font-semibold text-brand-700/50">No results yet</p>
              <p className="mt-1 text-xs text-gray-400">Enter a Fitting ID and hit Fetch Journey</p>
            </Card>
          ) : (
            /* Results table */
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-700">
                    Order Journey
                  </span>
                  <span className="font-mono text-xs text-brand-700/50">
                    {singleInput.trim()}
                  </span>
                </div>
                <Badge tone="gray" className="tabular-nums">
                  <span className="font-semibold text-brand-700">{singleResult.length}</span>&nbsp;events
                </Badge>
              </div>

              <Table>
                <THead>
                  <TR>
                    <TH className="w-10">#</TH>
                    {columns.map((col) => (
                      <TH key={col}>{col.replace(/_/g, ' ')}</TH>
                    ))}
                  </TR>
                </THead>
                <TBody>
                  {singleResult.map((row, i) => (
                    <TR key={i}>
                      <TD className="font-mono text-xs text-gray-400">{i + 1}</TD>
                      {columns.map((col, j) => (
                        <TD key={j} className="whitespace-nowrap font-mono text-xs text-gray-600">
                          {col === 'status' ? (
                            <Badge tone="navy">{row[col]?.toString() ?? '—'}</Badge>
                          ) : (
                            row[col]?.toString() ?? '—'
                          )}
                        </TD>
                      ))}
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
