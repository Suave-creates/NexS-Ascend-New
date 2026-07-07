'use client';

import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Alert,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';

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
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Tray Finder"
        subtitle="Look up recent tray locations, one tray or in bulk"
      />

      <Card>
        <CardBody className="space-y-4">
          {/* Mode toggle */}
          <div className="flex justify-center gap-2">
            <Button
              variant={mode === 'single' ? 'primary' : 'outline'}
              onClick={() => setMode('single')}
            >
              Single Tray
            </Button>
            <Button
              variant={mode === 'bulk' ? 'primary' : 'outline'}
              onClick={() => setMode('bulk')}
            >
              Bulk (Excel/CSV)
            </Button>
          </div>

          {mode === 'single' ? <SingleTray /> : <BulkTray />}
        </CardBody>
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
    <div className="mx-auto max-w-xl space-y-6">
      <Input
        type="text"
        placeholder="Scan or enter Tray ID (CT00000)..."
        value={trayId}
        onChange={(e) => setTrayId(e.target.value.toUpperCase())}
        autoFocus
      />

      {error && <Alert tone="error">{error}</Alert>}

      {!error && history.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-brand-700">
              Last 5 Locations
            </h2>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <TR>
                  <TH>#</TH>
                  <TH>Location</TH>
                  <TH>Timestamp</TH>
                </TR>
              </THead>
              <TBody>
                {history.map((item, idx) => (
                  <TR key={idx}>
                    <TD>{idx + 1}</TD>
                    <TD>
                      {item.locationName} ({item.location})
                    </TD>
                    <TD>{new Date(item.timestamp).toLocaleString()}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
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
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={parseFile} disabled={!file}>
            Parse File
          </Button>
          <Button
            onClick={fetchAll}
            loading={busy}
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
          <div>
            <strong>File:</strong> {file.name}
          </div>
          <div>
            <strong>Parsed Tray IDs:</strong>{' '}
            {trayIds.length > 0 ? trayIds.length : 0}
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
          <ul className="list-inside list-disc">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Trays with data"
              value={Object.keys(results).length}
              tone="navy"
            />
            <StatCard label="Total rows" value={totalRows} tone="good" />
          </div>

          <div className="space-y-3">
            {Object.entries(results)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([id, rows]) => (
                <div
                  key={id}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  {/* outer clickable area acts as a button */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={!!expanded[id]}
                    className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-left"
                    onClick={() => toggleExpand(id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(id);
                      }
                    }}
                  >
                    <span className="font-semibold text-brand-700">
                      {id}{' '}
                      <span className="font-normal text-gray-600">
                        ({rows.length})
                      </span>
                    </span>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportTray(id);
                        }}
                      >
                        <FiDownload className="mr-1.5" aria-hidden />
                        Export CSV
                      </Button>
                      <span className="text-gray-500" aria-hidden>
                        {expanded[id] ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    </div>
                  </div>

                  {expanded[id] && (
                    <div className="p-4">
                      {rows.length === 0 ? (
                        <div className="italic text-gray-600">
                          No locations found.
                        </div>
                      ) : (
                        <Table>
                          <THead>
                            <TR>
                              <TH>#</TH>
                              <TH>Location</TH>
                              <TH>Station</TH>
                              <TH>Timestamp</TH>
                            </TR>
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
