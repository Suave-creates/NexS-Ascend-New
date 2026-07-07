'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Card,
  CardHeader,
  PageHeader,
  Input,
  Button,
  Alert,
  Badge,
  Spinner,
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
type Row = {
  location_id: string;
  fitting_id: number;
  shipping_package_id: string;
  latest_updated_at: string;
  aging: string;
  aged_highlight: 'RED' | 'NONE';
  status?: string;
};

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */

const EXCEL_RED = 'FFFFC7CE';

/* ═══════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════ */

function isAlert(r: Row) {
  return r.aged_highlight === 'RED';
}

/* ═══════════════════════════════════════════════
   EXCEL EXPORT
═══════════════════════════════════════════════ */

function exportStyledExcel(rows: Row[], filename: string) {
  const header = ['Tray ID', 'Fitting', 'Shipping', 'Last Updated (IST)', 'Aging'];
  const wsData: any[][] = [header];

  rows.forEach((r) => {
    wsData.push([
      r.location_id,
      r.fitting_id,
      r.shipping_package_id,
      r.latest_updated_at,
      r.aging,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  rows.forEach((r, idx) => {
    const ri = idx + 1;
    if (isAlert(r)) {
      for (let c = 0; c <= 4; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r: ri, c })];
        if (cell) cell.s = { fill: { fgColor: { rgb: EXCEL_RED } } };
      }
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'QC Trays');
  XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`);
}

/* ═══════════════════════════════════════════════
   TRAY TABLE
═══════════════════════════════════════════════ */

function TrayTable({ rows, onExcel, onClear }: { rows: Row[]; onExcel: () => void; onClear: () => void }) {
  return (
    <Card className="mb-3.5 overflow-hidden">
      <CardHeader>
        <span className="flex items-center gap-2.5 text-sm font-semibold text-brand-700">
          {rows.length} tray{rows.length !== 1 ? 's' : ''} loaded
          <span className="font-mono text-xs font-medium text-gray-500">
            {rows.filter(isAlert).length} alert{rows.filter(isAlert).length !== 1 ? 's' : ''}
          </span>
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExcel}>↓ Excel</Button>
          <Button variant="outline" size="sm" onClick={onClear}>✕ Clear</Button>
        </div>
      </CardHeader>
      <Table>
        <THead>
          <tr>
            <TH>Tray ID</TH>
            <TH>Fitting</TH>
            <TH>Shipping</TH>
            <TH>Status</TH>
            <TH>Last Updated (IST)</TH>
            <TH>Aging</TH>
          </tr>
        </THead>
        <TBody>
          {rows.map((r, i) => (
            <TR key={i} tone={isAlert(r) ? 'danger' : undefined}>
              <TD className="font-mono">{r.location_id}</TD>
              <TD className="font-mono">{r.fitting_id}</TD>
              <TD className="font-mono">{r.shipping_package_id}</TD>
              <TD className="font-mono">{r.status}</TD>
              <TD className="font-mono">{new Date(r.latest_updated_at).toLocaleString('en-IN', { hour12: false })}</TD>
              <TD className="font-mono">
                {r.aged_highlight === 'RED' ? (
                  <Badge tone="danger" className="font-bold">{r.aging}</Badge>
                ) : (
                  r.aging
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */

export default function QCTrayPage() {
  const [scanValue, setScanValue] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = scanValue.trim();
    if (trimmed.length >= 7) scanTray(trimmed);
  }, [scanValue]);

  function scanTray(trayId: string) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/operations/tray-pro-mei', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trayIds: [trayId] }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? 'Scan failed');
        const newRow: Row | undefined = data.rows?.[0];
        if (newRow) {
          setRows((prev) => {
            const exists = prev.some((r) => r.location_id === newRow.location_id);
            return exists ? prev : [newRow, ...prev];
          });
          // Play alert sound when red
          if (isAlert(newRow) && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.error('Audio play failed:', err));
          }
        }
        setScanValue('');
      } catch (e: any) {
        setError(e.message ?? 'Scan failed');
        setScanValue('');
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <audio ref={audioRef} src="/soundtrack/FAAHH.mp3" />

      <div className="mx-auto max-w-[780px] px-4 pb-[60px] pt-6">
        <PageHeader
          title="Tray PRO MEI"
          subtitle="Floor CONTROL · ORDER MANAGEMENT kar Atharva"
        />

        <Card className="mb-5 p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Scan or enter tray ID</p>
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              className="py-3 pr-12 font-mono text-lg font-semibold"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="e.g. TRY-100234"
              autoFocus
            />
            {isPending && (
              <Spinner className="absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-brand-700" />
            )}
          </div>
          <p className="mt-1.5 font-mono text-xs text-gray-500">Auto-submits after 7+ characters · Use barcode scanner or keyboard</p>
        </Card>

        {error && (
          <Alert tone="error" className="mb-4 flex items-center gap-2">
            <span>⚠</span> {error}
          </Alert>
        )}

        {rows.length > 0 && !isPending && (
          <TrayTable
            rows={rows}
            onExcel={() => exportStyledExcel(rows, 'QC_TRAYS')}
            onClear={() => setRows([])}
          />
        )}
      </div>
    </div>
  );
}
