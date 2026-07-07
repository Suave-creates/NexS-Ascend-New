'use client';

import { useState, useTransition, useMemo, ChangeEvent, KeyboardEvent } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Input,
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface QcRow {
  shipping_package_id: string;
  barcode:             string;
  qc_fail_count:       number;
  reason_name:         string;
  status:              string;
  updated_by:          string;
  updated_at:          string; // ISO string from MySQL
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(raw: string | null | undefined): string {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh   = String(d.getHours()).padStart(2, '0');
  const min  = String(d.getMinutes()).padStart(2, '0');
  const ss   = String(d.getSeconds()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
}

/** Distinct updated_at timestamps where status = QCFailed */
function computeQcFailCount(rows: QcRow[]): number {
  const seen = new Set<string>();
  for (const r of rows) {
    if (r.status === 'QCFailed' && r.updated_at) seen.add(r.updated_at);
  }
  return seen.size;
}

function getAllStatuses(rows: QcRow[]): string[] {
  return Array.from(new Set(rows.map((r) => r.status).filter(Boolean))).sort();
}

type StatusTone = 'danger' | 'good' | 'notice' | 'gray' | 'navy';

function statusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (s.includes('fail') || s.includes('reject'))               return 'danger';
  if (s.includes('pass') || s.includes('done') || s.includes('complete')) return 'good';
  if (s.includes('pending') || s.includes('wait'))              return 'notice';
  if (s.includes('cancel'))                                     return 'gray';
  return 'navy';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OrderInformationCornerPage() {
  const [inputValue,   setInputValue]   = useState('');
  const [rows,         setRows]         = useState<QcRow[]>([]);
  const [isPending,    startTransition] = useTransition();
  const [error,        setError]        = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [textFilter,   setTextFilter]   = useState('');
  const [fetched,      setFetched]      = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────

  const allStatuses = useMemo(() => getAllStatuses(rows),     [rows]);
  const qcFailCount = useMemo(() => computeQcFailCount(rows), [rows]);
  const dbQcFailMax = useMemo(
    () => Math.max(0, ...rows.map((r) => Number(r.qc_fail_count ?? 0))),
    [rows]
  );

  const filtered = useMemo(() => {
    let r = rows;
    if (statusFilter !== 'ALL') r = r.filter((row) => row.status === statusFilter);
    if (textFilter.trim()) {
      const q = textFilter.toLowerCase();
      r = r.filter((row) =>
        Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q))
      );
    }
    return r;
  }, [rows, statusFilter, textFilter]);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const handleFetch = () => {
    setError(null);
    if (!inputValue.trim()) { setError('Please enter a valid Shipping Package ID.'); return; }

    startTransition(async () => {
      try {
        const res = await fetch('/api/operations/qcf-order-info', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ shippingPackageId: inputValue.trim() }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Request failed');

        // data.rows is the array from NextResponse.json({ rows })
        const fetched: QcRow[] = Array.isArray(data.rows) ? data.rows : [];
        setRows(fetched);
        setStatusFilter('ALL');
        setTextFilter('');
        setFetched(true);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order information.');
        setFetched(false);
      }
    });
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleFetch(); };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-7 py-6">

        {/* ── Header ── */}
        <PageHeader
          title="QCF Information Corner"
          subtitle="orderqc · qc_status_history · order journey"
          actions={<Badge tone="navy" className="font-mono">NexS Ascend</Badge>}
        />

        {/* ── Search card ── */}
        <Card>
          <CardHeader>
            <span className="text-sm font-semibold text-gray-700">Lookup — Shipping Package ID</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-3.5">
            <div className="flex flex-wrap gap-2.5">
              <Input
                type="text"
                placeholder="e.g. SP-20240601-00123"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
                className="min-w-[260px] flex-1"
              />
              <Button
                onClick={handleFetch}
                disabled={!inputValue.trim() || isPending}
                loading={isPending}
              >
                {isPending ? 'Fetching…' : 'Fetch Order Details'}
              </Button>
            </div>
            {error && <Alert tone="error"><strong>Error:</strong> {error}</Alert>}
          </CardBody>
        </Card>

        {/* ── Stats + Status chips ── */}
        {fetched && rows.length > 0 && (
          <div className="flex flex-wrap items-start gap-4">

            <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-5">
              <StatCard value={rows.length}        label="Total Events"     tone="gold" />
              <StatCard value={filtered.length}    label="Shown"                   />
              <StatCard value={dbQcFailMax}         label="QC Fail Count"   tone={dbQcFailMax > 0 ? 'danger' : 'navy'}  />
              <StatCard value={qcFailCount}         label="Fail Occurrences" tone={qcFailCount > 0 ? 'danger' : 'navy'} />
              <StatCard value={allStatuses.length}  label="Unique Statuses"         />
            </div>

            {/* Status chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {['ALL', ...allStatuses].map((st) => {
                const active = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className="rounded-full"
                  >
                    {st === 'ALL' ? (
                      <Badge
                        tone={active ? 'navy' : 'gray'}
                        className={active ? 'bg-brand-700 text-white' : ''}
                      >
                        {st}
                      </Badge>
                    ) : (
                      <Badge tone={active ? statusTone(st) : 'gray'}>
                        {st}
                        <span className="ml-1 opacity-65">
                          {rows.filter((r) => r.status === st).length}
                        </span>
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Results table ── */}
        {fetched && rows.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader>
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                Order Journey — {rows[0]?.shipping_package_id}
              </span>
              {qcFailCount > 0 && (
                <Badge tone="danger" className="font-mono font-bold">
                  {qcFailCount} QC fail{qcFailCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardHeader>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
              <span className="font-mono text-xs text-gray-500">
                <strong className="text-brand-700">{filtered.length}</strong>
                {filtered.length !== rows.length ? ` of ${rows.length}` : ''} events
              </span>
              <Input
                type="text"
                placeholder="Search…"
                value={textFilter}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTextFilter(e.target.value)}
                className="w-[200px] font-mono"
              />
            </div>

            {/* Table */}
            <div className="overflow-auto" style={{ maxHeight: 480 }}>
              <Table>
                <THead>
                  <tr>
                    {['#','Shipping Package ID','Barcode','QC Fail Count','Reason','Status','Updated By','Updated At'].map((h) => (
                      <TH key={h}>{h}</TH>
                    ))}
                  </tr>
                </THead>
                <TBody>
                  {filtered.length === 0 ? (
                    <TR>
                      <TD colSpan={8} className="py-7 text-center text-gray-500">
                        No rows match your filter.
                      </TD>
                    </TR>
                  ) : filtered.map((row, i) => {
                    const isQcFail = row.status === 'QCFailed';
                    return (
                      <TR
                        key={i}
                        tone={isQcFail ? 'danger' : undefined}
                      >
                        <TD className="font-mono text-gray-500">{i + 1}</TD>
                        <TD className="font-mono font-semibold text-brand-700">
                          {row.shipping_package_id ?? '—'}
                        </TD>
                        <TD className="font-mono">{row.barcode ?? '—'}</TD>
                        <TD className="text-center font-mono">
                          {Number(row.qc_fail_count) > 0
                            ? <Badge tone="danger" className="font-bold">
                                {row.qc_fail_count}
                              </Badge>
                            : <span className="text-gray-500">0</span>
                          }
                        </TD>
                        <TD className="font-mono">{row.reason_name ?? '—'}</TD>
                        <TD className="font-mono">
                          {row.status
                            ? <Badge tone={statusTone(row.status)} className="font-bold">{row.status}</Badge>
                            : '—'}
                        </TD>
                        <TD className="font-mono">{row.updated_by ?? '—'}</TD>
                        <TD className="font-mono text-gray-500">{formatDate(row.updated_at)}</TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          </Card>
        )}

        {/* ── Empty state ── */}
        {fetched && rows.length === 0 && !isPending && (
          <Card className="flex flex-col items-center gap-2.5 px-6 py-12 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#d8dde8" strokeWidth="2"/>
              <path d="M13 20h14" stroke="#d8dde8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="text-sm font-medium text-gray-500">
              No QC events found for{' '}
              <strong className="text-brand-700">{inputValue}</strong>.
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
