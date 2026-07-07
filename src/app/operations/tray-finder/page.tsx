'use client';

import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Card, PageHeader, Input, Button, Alert, Table, THead, TBody, TR, TH, TD } from '@/components/ui';
import { cn } from '@/lib/cn';

type HistoryItem = {
  location: number;
  locationName: string;
  timestamp: string;
};

type BulkResult = Record<string, HistoryItem[]>;

const TRAY_REGEX = /^[A-Za-z]{2}\d{5}$/; // you already used this

export default function TrayFinderPage() {
  // ====== Shared (branding/layout) ======
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader title="TRAY FINDER" className="justify-center text-center" />

      <Card className="max-w-4xl mx-auto p-4">
        {/* Mode toggle */}
        <div className="flex gap-2 justify-center mb-4">
          <button
            className={cn(
              'px-4 py-2 rounded-lg border transition-colors',
              mode === 'single'
                ? 'bg-brand-700 text-white border-brand-700'
                : 'bg-white text-brand-700 border-gray-300',
            )}
            onClick={() => setMode('single')}
          >
            Single Tray
          </button>
          <button
            className={cn(
              'px-4 py-2 rounded-lg border transition-colors',
              mode === 'bulk'
                ? 'bg-brand-700 text-white border-brand-700'
                : 'bg-white text-brand-700 border-gray-300',
            )}
            onClick={() => setMode('bulk')}
          >
            Bulk (Excel/CSV)
          </button>
        </div>

        {mode === 'single' ? <SingleTray /> : <BulkTray />}
      </Card>
    </div>
  );
}

/* ===========================
 * Single Tray (your original flow, unchanged behavior)
 * =========================== */
function SingleTray() {
  const [trayId, setTrayId] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (TRAY_REGEX.test(trayId)) {
      fetchHistory(trayId);
    } else {
      setHistory([]);
      setError('');
    }
  }, [trayId]);

  const fetchHistory = async (id: string) => {
    setError('');
    setHistory([]);
    try {
      const res = await fetch(
        `/api/operations/tray-finder?trayId=${encodeURIComponent(id)}`,
      );
      if (!res.ok) {
        if (res.status === 400) setError('Please provide a tray ID.');
        else if (res.status === 404) setError('Tray not found.');
        else setError('Failed to fetch tray history.');
        return;
      }
      const json = await res.json();
      // Keep your display as "Last 5" (unchanged). Slice defensively.
      const list: HistoryItem[] = (json.history || []).slice(0, 5);
      setHistory(list);
    } catch {
      setError('Network error.');
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto">
        <Input
          type="text"
          placeholder="Scan or enter Tray ID (CT00000)..."
          value={trayId}
          onChange={(e) => setTrayId(e.target.value.toUpperCase())}
        />
      </div>

      {error && (
        <Alert tone="error" className="max-w-xl mx-auto mt-6">
          {error}
        </Alert>
      )}

      {!error && history.length > 0 && (
        <Card variant="floating" className="max-w-xl mx-auto mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Last 5 Locations</h2>
          <ul className="list-disc list-inside text-gray-900 space-y-2">
            {history.map((item, idx) => (
              <li key={idx}>
                <strong>Location:</strong> {item.locationName} ({item.location}) &nbsp;|&nbsp;
                <strong>At:</strong>{' '}
                {new Date(item.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

/* ===========================
 * Bulk Tray (new)
 * - Accept xlsx/xls/csv
 * - Parse Tray IDs
 * - For each Tray ID, call your existing API and take last 20
 * - Show collapsible panels
 * - Export CSV (per-tray + all)
 * =========================== */
function BulkTray() {
  const [file, setFile] = useState<File | null>(null);
  const [trayIds, setTrayIds] = useState<string[]>([]);
  const [results, setResults] = useState<BulkResult>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const totalRows = useMemo(
    () => Object.values(results).reduce((sum, rows) => sum + rows.length, 0),
    [results],
  );

  const onFileChange = (f: File | null) => {
    setFile(f);
    setTrayIds([]);
    setResults({});
    setErrors([]);
    setExpanded({});
  };

  const parseFile = async () => {
    if (!file) return;
    setErrors([]);
    try {
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: 'array' });

      // Take the first sheet
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, {
        defval: '',
      });

      // Accept header variants
      const headerCandidates = ['TrayID', 'tray_id', 'trayid', 'TRAYID', 'TRAY_ID'];
      const ids = new Set<string>();

      for (const row of json) {
        const key =
          Object.keys(row).find((k) =>
            headerCandidates.includes(String(k).trim()),
          ) ?? Object.keys(row)[0]; // fallback: first column

        const raw = String(row[key] ?? '').trim();
        if (!raw) continue;

        const norm = raw.toUpperCase();
        // If IDs are strictly like CT00000 use regex; else relax if needed.
        if (TRAY_REGEX.test(norm)) ids.add(norm);
        else ids.add(norm); // keep non-matching too, but you can comment this line to enforce regex strictly
      }

      const list = Array.from(ids);
      if (list.length === 0) {
        setErrors((e) => [...e, 'No Tray IDs found in the file.']);
      }
      setTrayIds(list);
    } catch (e) {
      setErrors((er) => [...er, 'Failed to read the file. Ensure it is a valid Excel/CSV.']);
    }
  };

  const fetchAll = async () => {
    if (trayIds.length === 0) {
      setErrors((e) => [...e, 'No Tray IDs to fetch. Parse a file first.']);
      return;
    }
    setBusy(true);
    setResults({});
    setErrors([]);
    try {
      // Reuse existing single-tray endpoint to avoid backend changes.
      const settled = await Promise.allSettled(
        trayIds.map(async (id) => {
          const res = await fetch(
            `/api/operations/tray-finder?trayId=${encodeURIComponent(id)}`,
          );
          if (!res.ok) {
            // normalize errors
            throw new Error(`${id}: ${res.status === 404 ? 'Not found' : 'Fetch failed'}`);
          }
          const json = await res.json();
          const arr: HistoryItem[] = Array.isArray(json?.history)
            ? json.history.slice(0, 20) // <= last 20
            : [];
          return { id, arr };
        }),
      );

      const next: BulkResult = {};
      const errs: string[] = [];

      for (const s of settled) {
        if (s.status === 'fulfilled') {
          next[s.value.id] = s.value.arr;
        } else {
          errs.push(s.reason?.message ?? 'Unknown error');
        }
      }
      setResults(next);
      if (errs.length) setErrors(errs);
    } finally {
      setBusy(false);
    }
  };

  const toggleExpand = (id: string) =>
    setExpanded((m) => ({ ...m, [id]: !m[id] }));

  // ========= CSV Export helpers =========
  const toCsv = (rows: HistoryItem[], trayId: string) => {
    const header = 'trayId,location,locationName,timestamp';
    const body = rows
      .map(
        (r) =>
          [
            safeCsv(trayId),
            safeCsv(String(r.location)),
            safeCsv(r.locationName),
            safeCsv(new Date(r.timestamp).toISOString()),
          ].join(','),
      )
      .join('\n');
    return `${header}\n${body}`;
  };

  const download = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportTray = (trayId: string) => {
    const rows = results[trayId] ?? [];
    download(`${trayId}_last20.csv`, toCsv(rows, trayId));
  };

  const exportAll = () => {
    const header = 'trayId,location,locationName,timestamp';
    const lines: string[] = [header];
    for (const [trayId, rows] of Object.entries(results)) {
      for (const r of rows) {
        lines.push(
          [
            safeCsv(trayId),
            safeCsv(String(r.location)),
            safeCsv(r.locationName),
            safeCsv(new Date(r.timestamp).toISOString()),
          ].join(','),
        );
      }
    }
    download(`bulk_tray_locations.csv`, lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Uploader */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm file:mr-3 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-brand-700"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={parseFile}
            disabled={!file}
          >
            Parse File
          </Button>
          <Button
            onClick={fetchAll}
            disabled={busy || trayIds.length === 0}
          >
            {busy ? 'Fetching…' : `Fetch last 20 per tray (${trayIds.length})`}
          </Button>
          <Button
            variant="ghost"
            onClick={exportAll}
            disabled={Object.keys(results).length === 0}
          >
            Export All CSV
          </Button>
        </div>
      </div>

      {/* Parsing summary */}
      {file && (
        <div className="text-sm text-gray-600">
          <div><strong>File:</strong> {file.name}</div>
          <div>
            <strong>Parsed Tray IDs:</strong> {trayIds.length > 0 ? trayIds.length : 0}
            {trayIds.length > 0 && (
              <span className="ml-2 text-gray-500">
                (showing first 10): {trayIds.slice(0, 10).join(', ')}
                {trayIds.length > 10 ? '…' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Alert tone="error">
          <ul className="list-disc list-inside">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-700">
            <strong>Trays with data:</strong> {Object.keys(results).length} &nbsp;|&nbsp;
            <strong>Total rows:</strong> {totalRows}
          </div>

          <div className="space-y-3">
            {Object.entries(results)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([id, rows]) => (
                <div key={id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* outer clickable area changed from <button> to a div acting as a button */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={!!expanded[id]}
                    className="w-full text-left bg-gray-100 px-4 py-3 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(id);
                      }
                    }}
                  >
                    <span className="font-semibold text-brand-700">
                      {id} <span className="text-gray-600 font-normal">({rows.length})</span>
                    </span>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); exportTray(id); }}
                      >
                        Export CSV
                      </Button>
                      <span className="text-gray-500">{expanded[id] ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expanded[id] && (
                    <div className="p-4 overflow-x-auto">
                      {rows.length === 0 ? (
                        <div className="text-gray-600 italic">No locations found.</div>
                      ) : (
                        <Table>
                          <THead>
                            <tr>
                              <TH>#</TH>
                              <TH>Location</TH>
                              <TH>Station</TH>
                              <TH>Timestamp</TH>
                            </tr>
                          </THead>
                          <TBody>
                            {rows.map((r, i) => (
                              <TR key={i}>
                                <TD>{i + 1}</TD>
                                <TD>
                                  {r.locationName} ({r.location})
                                </TD>
                                <TD>
                                  {/* if your API has 'station' separately, show it; else keep empty */}
                                  {/* @ts-ignore */}
                                  {r.station ?? ''}
                                </TD>
                                <TD>
                                  {new Date(r.timestamp).toLocaleString()}
                                </TD>
                              </TR>
                            ))}
                          </TBody>
                        </Table>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== utils ==========
function safeCsv(s: string) {
  const needQuotes = /[",\n]/.test(s);
  const esc = s.replace(/"/g, '""');
  return needQuotes ? `"${esc}"` : esc;
}
