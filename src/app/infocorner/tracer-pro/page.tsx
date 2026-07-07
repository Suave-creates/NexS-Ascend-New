'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/cn';
import {
  Button,
  Textarea,
  Badge,
  StatusPill,
  Alert,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */

type Reason = {
  text: string;
  highlight: 'SKY_BLUE' | 'NONE';
};

type Row = {
  parent_tray_id: string;
  child_tray_id: string;
  tray_role: 'PARENT' | 'CHILD';
  location_id: string;
  fitting_id: number;
  shipping_package_id: string;
  order_item_type: string;
  created_at_days: number;
  qc_failed_status_count: number;
  qc_failed_highlight: 'RED' | 'NONE';
  aged_highlight: 'RED' | 'NONE';
  reasons: Reason[];
};

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */

const EXCEL_RED = 'FFFFC7CE';
const EXCEL_ORANGE = 'FFFF5F00';

/* ═══════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════ */

function parseTrayIds(raw: string, limit = 50): string[] {
  return Array.from(
    new Set(
      raw.split(/\r?\n|,|\t/).map((v) => v.trim()).filter(Boolean)
    )
  ).slice(0, limit);
}

function isAlert(r: Row) {
  return r.created_at_days > 3 || r.qc_failed_status_count > 1;
}

/* ═══════════════════════════════════════════════
   EXCEL EXPORT
═══════════════════════════════════════════════ */

function exportStyledExcel(rows: Row[], filename: string) {
  const header = [
    'Parent Tray', 'Child Tray', 'Role', 'Fitting',
    'Shipping', 'Type', 'Days', 'QC Failed', 'Reasons',
  ];

  const wsData: any[][] = [header];

  rows.forEach((r) => {
    wsData.push([
      r.parent_tray_id,
      r.child_tray_id,
      r.tray_role,
      r.fitting_id,
      r.shipping_package_id,
      r.order_item_type,
      r.created_at_days,
      r.qc_failed_status_count,
      r.reasons.map((x) => x.text).join(' | '),
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  rows.forEach((r, idx) => {
    const ri = idx + 1;
    if (isAlert(r)) {
      for (let c = 0; c <= 8; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r: ri, c })];
        if (cell) cell.s = { fill: { fgColor: { rgb: EXCEL_RED } } };
      }
    }
    if (r.reasons.some((x) => x.highlight === 'SKY_BLUE')) {
      const cell = ws[XLSX.utils.encode_cell({ r: ri, c: 8 })];
      if (cell) cell.s = { fill: { fgColor: { rgb: EXCEL_ORANGE } } };
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'QC Trays');
  XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`);
}

/* ═══════════════════════════════════════════════
   JOB SHEET – single tray result card
═══════════════════════════════════════════════ */

function JobSheet({ row, onClear }: { row: Row; onClear: () => void }) {
  const alert = isAlert(row);
  const hasSkyBlue = row.reasons.some((r) => r.highlight === 'SKY_BLUE');
  const showPrint = row.qc_failed_status_count > 1.5 || hasSkyBlue;

  return (
    <div
      className={cn(
        'job-sheet animate-[slideIn_0.25s_ease] overflow-hidden rounded-xl border-2 bg-white',
        alert ? 'border-danger-600/40' : 'border-gray-200',
      )}
      role="region"
      aria-label="Tray Job Sheet"
    >
      {/* ── Header strip ── */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-[18px] py-3.5 text-white',
          alert ? 'bg-danger-600' : 'bg-brand-700',
        )}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded bg-white/[0.18] px-2 py-[3px] font-mono text-[10px] font-semibold tracking-[0.08em] text-gold-500">
            {row.tray_role}
          </span>
          <span className="font-mono text-xl font-semibold tracking-[0.04em]">{row.location_id}</span>
          {alert && (
            <StatusPill tone="gold" aria-label="Alert">
              ⚠ NEEDS ATTENTION
            </StatusPill>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {showPrint && (
            <button
              className="js-print-btn flex-shrink-0 whitespace-nowrap rounded-md border-[1.5px] border-gold-500 bg-gold-500 px-3 py-1.5 font-mono text-xs font-semibold text-[#3a2800] transition-all hover:bg-[#ffd84d]"
              onClick={() => window.print()}
              aria-label="Print job sheet"
            >
              🖨 Print
            </button>
          )}
          <button
            className="js-clear-btn flex-shrink-0 whitespace-nowrap rounded-md border-[1.5px] border-white/40 bg-transparent px-3 py-1.5 font-mono text-xs font-semibold text-white/[0.85] transition-all hover:bg-white/15"
            onClick={onClear}
            aria-label="Clear scan"
          >
            ✕ Clear
          </button>
        </div>
      </div>
      {/* ── Core fields grid ── */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-px border-b border-gray-200 bg-gray-200">
              <Field label="Fitting ID" value={row.fitting_id} />
              <Field label="Shipping Package" value={row.shipping_package_id} />
              <Field label="Order Type" value={row.order_item_type} />
              <Field
                label="Parent Tray"
                value={row.parent_tray_id}
                muted={row.parent_tray_id === row.location_id}
              />
              <Field
                label="Child Tray"
                value={row.child_tray_id}
                muted={row.child_tray_id === row.location_id}
              />
              <Field
                label="Age (days)"
                value={row.created_at_days}
                highlight={row.aged_highlight === 'RED' ? 'red' : undefined}
              />
              <Field
                label="QC Fail Events"
                value={row.qc_failed_status_count}
                highlight={row.qc_failed_highlight === 'RED' ? 'red' : undefined}
              />

              {/* ── ICU Critical Tray — custom grid cell ── */}
              <div className="bg-white px-4 py-3.5">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">ICU Critical Tray</span>
                <span className="break-all font-mono text-[15px] font-semibold text-brand-700">
                  Authorised by
                  <br />
                  <em style={{ fontStyle: 'italic', fontWeight: 400, fontSize: 13 }}>
                    Mayank Gupta
                  </em>
                </span>
              </div>

            </div>

      {/* ── Reasons section ── */}
      <div className="px-[18px] pb-5 pt-4">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
          Failure Reasons
          <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-700">
            {row.reasons.length === 0
              ? 'None recorded'
              : `${row.reasons.length} reason${row.reasons.length > 1 ? 's' : ''}`}
          </span>
        </p>

        {row.reasons.length === 0 ? (
          <p className="text-[13px] italic text-gray-500">No QC failure reasons on record.</p>
        ) : (
          <ul className="flex list-none flex-col gap-1.5">
            {row.reasons.map((r, i) => (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium',
                  r.highlight === 'SKY_BLUE'
                    ? 'bg-notice-50 font-semibold text-notice-600'
                    : 'bg-gray-100 text-gray-900',
                )}
              >
                <span
                  className={cn(
                    'h-[7px] w-[7px] flex-shrink-0 rounded-full',
                    r.highlight === 'SKY_BLUE' ? 'bg-notice-600' : 'bg-gray-500',
                  )}
                />
                {r.text}
              </li>
            ))}
          </ul>
        )}

        {hasSkyBlue && (
          <p className="mt-2.5 text-[11px] font-medium text-notice-600">
            🔶 Grey items indicate MEI Reason(s) for QCF
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string | number;
  highlight?: 'red';
  muted?: boolean;
}) {
  return (
    <div className={cn('bg-white px-4 py-3.5', highlight === 'red' && 'bg-danger-50')}>
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500">{label}</span>
      <span
        className={cn(
          'break-all font-mono text-[15px] font-semibold',
          highlight === 'red' ? 'text-danger-600' : 'text-brand-700',
          muted && 'font-normal text-gray-500',
        )}
      >
        {String(value)}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */

export default function QCTrayPage() {
  const [mode, setMode] = useState<'SINGLE' | 'BULK'>('SINGLE');

  /* Single */
  const [scanValue, setScanValue] = useState('');
  const [singleRow, setSingleRow] = useState<Row | null>(null);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  /* Bulk */
  const [bulkInput, setBulkInput] = useState('');
  const [bulkRows, setBulkRows] = useState<Row[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  /* Auto-focus scan input */
  useEffect(() => {
    if (mode === 'SINGLE') inputRef.current?.focus();
  }, [mode]);

  /* Auto-trigger scan when value looks complete */
  useEffect(() => {
    if (mode !== 'SINGLE') return;
    const trimmed = scanValue.trim();
    if (trimmed.length >= 7) scanTray(trimmed);
  }, [scanValue, mode]);

  /* ── Single scan ── */
  function scanTray(trayId: string) {
    setSingleError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/order-info/tracer-pro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trayId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? 'Scan failed');
        setSingleRow(data.row ?? null);
        setScanValue('');
      } catch (e: any) {
        setSingleError(e.message ?? 'Scan failed');
        setScanValue('');
      }
    });
  }

  /* ── Bulk fetch ── */
  async function fetchBulk(trayIds: string[]) {
    if (!trayIds.length) {
      setBulkError('No tray IDs provided');
      return;
    }
    setBulkError(null);
    setBulkLoading(true);
    try {
      const res = await fetch('/api/order-info/tracer-pro/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trayIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Bulk fetch failed');
      setBulkRows(data.rows ?? []);
    } catch (e: any) {
      setBulkError(e.message ?? 'Bulk fetch failed');
    } finally {
      setBulkLoading(false);
    }
  }

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <>
      {/* ──── Scoped keyframes + print stylesheet ──── */}
      <style>{`
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media print {
          /* Hide everything on the page */
          body * { visibility: hidden !important; }
          /* Then reveal only the job sheet card and its children */
          .job-sheet, .job-sheet * { visibility: visible !important; }
          /* Position the card flush to the top-left of the printed page */
          .job-sheet {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          /* Preserve background colours (header, highlights) */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          /* Hide the action buttons even though they're inside the card */
          .js-clear-btn, .js-print-btn { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[880px] px-4 pb-[60px] pt-6">

        {/* ── Top bar ── */}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-lg bg-brand-700">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] fill-gold-500">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM17.5 14l4 7h-8l4-7z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold uppercase tracking-[0.02em] text-brand-700">OMT QC Tray Scanner</div>
            <div className="mt-px font-mono text-[11px] text-gray-500">QUALITY CONTROL · ORDER MANAGEMENT</div>
          </div>
        </div>

        {/* ── Mode tabs ── */}
        <div className="mb-5 flex w-fit overflow-hidden rounded-[10px] border-[1.5px] border-gray-200 bg-white">
          {(['SINGLE', 'BULK'] as const).map((m) => (
            <button
              key={m}
              className={cn(
                'cursor-pointer border-none px-7 py-[9px] text-[13px] font-semibold uppercase tracking-[0.04em] transition-all',
                mode === m
                  ? 'bg-brand-700 text-white'
                  : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-brand-700',
              )}
              onClick={() => {
                setMode(m);
                setSingleRow(null);
                setScanValue('');
                setSingleError(null);
                setBulkRows([]);
                setBulkError(null);
              }}
            >
              {m === 'SINGLE' ? 'Single Scan' : 'Bulk Lookup'}
            </button>
          ))}
        </div>

        {/* ═══════════════════ SINGLE MODE ═══════════════════ */}
        {mode === 'SINGLE' && (
          <>
            <div className="mb-5 rounded-[10px] border-[1.5px] border-gray-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">Scan or enter tray ID</p>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-3 pr-12 font-mono text-lg font-semibold text-brand-700 outline-none transition-colors placeholder:text-[15px] placeholder:font-normal placeholder:text-gray-500 focus:border-brand-700 focus:bg-white"
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  placeholder="e.g. TRY-100234"
                  autoFocus
                />
                <div
                  className={cn(
                    'absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 animate-[spin_0.7s_linear_infinite] rounded-full border-[2.5px] border-gray-200 border-t-brand-700',
                    isPending ? 'block' : 'hidden',
                  )}
                />
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-gray-500">Auto-submits after CT+5Digits  · Use barcode scanner or keyboard</p>
            </div>

            {singleError && (
              <Alert tone="error" className="mb-4 flex items-center gap-2">
                <span>⚠</span> {singleError}
              </Alert>
            )}

            {singleRow && !isPending && (
              <JobSheet row={singleRow} onClear={() => setSingleRow(null)} />
            )}
          </>
        )}

        {/* ═══════════════════ BULK MODE ═══════════════════ */}
        {mode === 'BULK' && (
          <>
            <div className="mb-5 rounded-[10px] border-[1.5px] border-gray-200 bg-white p-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">Paste up to 50 tray IDs (one per line, comma, or tab-separated)</p>
              <Textarea
                className="mb-2.5 min-h-0 font-mono text-[13px] text-brand-700"
                rows={6}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="TRY-100001&#10;TRY-100002&#10;TRY-100003"
              />
              <div className="flex gap-2.5">
                <Button
                  disabled={bulkLoading}
                  onClick={() => fetchBulk(parseTrayIds(bulkInput))}
                >
                  {bulkLoading ? 'Loading…' : '↓ Fetch Trays'}
                </Button>
                {bulkRows.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => exportStyledExcel(bulkRows, 'QC_TRAYS')}
                    >
                      ↓ Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setBulkRows([]); setBulkInput(''); }}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </div>

            {bulkError && (
              <Alert tone="error" className="mb-4 flex items-center gap-2">
                <span>⚠</span> {bulkError}
              </Alert>
            )}

            {bulkRows.length > 0 && (
              <div className="mb-3.5 overflow-hidden rounded-[10px] border-[1.5px] border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                  <span className="text-[13px] font-semibold text-brand-700">{bulkRows.length} tray{bulkRows.length !== 1 ? 's' : ''} loaded</span>
                  <span className="font-mono text-[11px] text-gray-500">
                    {bulkRows.filter(isAlert).length} alert{bulkRows.filter(isAlert).length !== 1 ? 's' : ''}
                  </span>
                </div>
                <Table className="text-xs">
                  <THead>
                    <tr>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Role</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Tray ID</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Parent</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Child</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Fitting</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Shipping</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Type</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Days</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">QCF</TH>
                      <TH className="px-2.5 py-[9px] text-[10px] tracking-[0.07em]">Reasons</TH>
                    </tr>
                  </THead>
                  <TBody>
                    {bulkRows.map((r, i) => (
                      <TR key={i} tone={isAlert(r) ? 'danger' : undefined}>
                        <TD className="px-2.5 py-2 align-top">
                          <Badge tone={r.tray_role === 'PARENT' ? 'navy' : 'gray'} className="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em]">
                            {r.tray_role}
                          </Badge>
                        </TD>
                        <TD className="px-2.5 py-2 align-top font-mono text-xs text-inherit">{r.location_id}</TD>
                        <TD className="px-2.5 py-2 align-top font-mono text-xs text-inherit">{r.parent_tray_id}</TD>
                        <TD className="px-2.5 py-2 align-top font-mono text-xs text-inherit">{r.child_tray_id}</TD>
                        <TD className="px-2.5 py-2 align-top font-mono text-xs text-inherit">{r.fitting_id}</TD>
                        <TD className="px-2.5 py-2 align-top font-mono text-xs text-inherit">{r.shipping_package_id}</TD>
                        <TD className="px-2.5 py-2 align-top text-xs text-inherit">{r.order_item_type}</TD>
                        <TD className={cn('px-2.5 py-2 align-top font-mono text-xs', r.aged_highlight === 'RED' ? 'font-bold text-danger-600' : 'text-inherit')}>
                          {r.created_at_days}d
                        </TD>
                        <TD className={cn('px-2.5 py-2 align-top font-mono text-xs', r.qc_failed_highlight === 'RED' ? 'font-bold text-danger-600' : 'text-inherit')}>
                          {r.qc_failed_status_count}
                        </TD>
                        <TD className="px-2.5 py-2 align-top text-xs">
                          {r.reasons.length === 0 ? (
                            <span className="text-[11px] text-gray-500">—</span>
                          ) : (
                            r.reasons.map((x, idx) => (
                              <Badge key={idx} tone={x.highlight === 'SKY_BLUE' ? 'notice' : 'gray'} className="my-px mr-0.5 rounded px-1.5 py-0.5 text-[10px]">
                                {x.text}
                              </Badge>
                            ))
                          )}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}