'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Card,
  PageHeader,
  Input,
  Textarea,
  Button,
  Alert,
  Badge,
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
      const res = await fetch('/api/operations/order-info', {
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
        const res = await fetch('/api/operations/order-info', {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Page heading */}
      <PageHeader title="Order Information Corner" subtitle="Operations" />

      {/* Layout: left control panel + right results */}
      <div className="flex gap-6 items-start">

        {/* ── Left panel ── */}
        <div className="w-64 shrink-0 space-y-4">

          {/* Input card */}
          <Card className="overflow-hidden">

            {/* Tab switcher */}
            <div className="bg-brand-700 p-2">
              <div className="flex gap-1">
                {(['single', 'bulk'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); setSingleResult(null); }}
                    className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all ${
                      mode === m
                        ? 'bg-white text-brand-700'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {m === 'single' ? 'Single' : 'Bulk'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-3">
              {mode === 'single' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-brand-700/40 mb-1.5">
                      Fitting ID
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 882730722"
                      value={singleInput}
                      onChange={(e) => setSingleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSingle()}
                      className="font-mono placeholder:font-sans"
                    />
                  </div>
                  <Button
                    onClick={handleSingle}
                    disabled={!singleInput.trim() || isPending}
                    loading={isPending}
                    className="w-full"
                  >
                    {isPending ? (
                      'Fetching…'
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.5" />
                          <path d="M9.5 9.5L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Fetch Journey
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold tracking-[0.14em] uppercase text-brand-700/40">
                        Fitting IDs
                      </label>
                      {bulkIds.length > 0 && (
                        <Badge tone="navy">
                          {bulkIds.length}
                        </Badge>
                      )}
                    </div>
                    <Textarea
                      placeholder={'882730722\n883590938\n884421656'}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      rows={7}
                      className="font-mono leading-relaxed resize-none placeholder:font-sans"
                    />
                  </div>
                  <Button
                    onClick={handleBulk}
                    disabled={bulkIds.length === 0 || isPending}
                    loading={isPending}
                    className="w-full"
                  >
                    {isPending ? (
                      progress
                        ? `Chunk ${progress.current} / ${progress.total}…`
                        : 'Preparing…'
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1v8M4 6l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 11h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Export All
                      </>
                    )}
                  </Button>

                  {isPending && progress && (
                    <div className="space-y-1.5">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-700 rounded-full transition-all duration-300"
                          style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-brand-700/50">
                          {Math.round((progress.current / progress.total) * 100)}% complete
                        </span>
                        <span className="text-[10px] font-mono text-brand-700/40">
                          {Math.min(progress.current * CHUNK_SIZE, bulkIds.length).toLocaleString()} / {bulkIds.length.toLocaleString()} IDs
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {error && (
                <Alert tone="error">
                  {error}
                </Alert>
              )}
            </div>
          </Card>

          {/* Summary card — appears after single fetch */}
          {singleResult && singleResult.length > 0 && (
            <div className="bg-brand-700 rounded-2xl p-4 text-white space-y-3">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">
                Journey Summary
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Events</p>
                  <p className="text-3xl font-bold leading-none">{singleResult.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Latest Status</p>
                  <span className="text-[11px] font-semibold bg-white/15 px-2 py-1 rounded-md">
                    {singleResult[singleResult.length - 1]?.status ?? '—'}
                  </span>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wide mb-0.5">Fitting ID</p>
                <p className="text-[12px] font-mono font-semibold truncate">{singleInput.trim()}</p>
              </div>
              <button
                onClick={() => exportToXlsx(singleResult!, `order-journey-${singleInput.trim()}.xlsx`)}
                className="w-full h-8 text-[11px] font-bold border border-white/20 text-white rounded-lg hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M4 6l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 11h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Export as Excel
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Results panel ── */}
        <div className="flex-1 min-w-0">
          {!singleResult ? (
            /* Empty state */
            <Card className="border-dashed flex flex-col items-center justify-center text-center p-16" style={{ minHeight: 420 }}>
              <div className="w-10 h-10 rounded-xl bg-brand-700/5 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="16" height="16" rx="3" stroke="#1f295c" strokeWidth="1.4" strokeOpacity="0.25" />
                  <path d="M6 7h8M6 10h8M6 13h4" stroke="#1f295c" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.25" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-brand-700/30">No results yet</p>
              <p className="text-[12px] text-gray-400 mt-1">Enter a Fitting ID and hit Fetch Journey</p>
            </Card>
          ) : (
            /* Results table — fixed header, scrollable body */
            <Card className="overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>

              {/* Table toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-700 shrink-0" />
                  <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand-700">
                    Order Journey
                  </span>
                  <span className="text-[11px] font-mono text-brand-700/40">
                    {singleInput.trim()}
                  </span>
                </div>
                <Badge tone="gray" className="tabular-nums">
                  <span className="font-semibold text-brand-700">{singleResult.length}</span>&nbsp;events
                </Badge>
              </div>

              {/* Scrollable table wrapper */}
              <div className="overflow-auto flex-1">
                <table className="min-w-full text-sm border-collapse">
                  {/* Sticky header */}
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <TH className="w-10">
                        #
                      </TH>
                      {columns.map((col) => (
                        <TH key={col}>
                          {col.replace(/_/g, ' ')}
                        </TH>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {singleResult.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-50 hover:bg-brand-700/[0.02] transition-colors ${
                          i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                        }`}
                      >
                        <TD className="text-[11px] font-mono text-gray-300">
                          {i + 1}
                        </TD>
                        {columns.map((col, j) => (
                          <TD key={j} className="text-[12px] text-gray-600 whitespace-nowrap font-mono">
                            {col === 'status' ? (
                              <Badge tone="navy" className="font-bold">
                                {row[col]?.toString() ?? '—'}
                              </Badge>
                            ) : (
                              row[col]?.toString() ?? '—'
                            )}
                          </TD>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
