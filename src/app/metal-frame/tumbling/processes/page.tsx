'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Alert, Badge, Input, Select, Field, Button, Table, THead, TBody, TR, TH, TD } from '@/components/ui';
import type { PaginatedResult, ProcessHistoryRowDto, TumblingProcessStatus } from '@/services/metal-frame/tumbling/types';
import { formatClockTime, formatDuration, formatFullDateTime } from '../_lib/format';
import { containerStatusStyle } from '../_lib/statusStyles';
import { ProcessDetailModal } from '../_components/ProcessDetailModal';

const STATUS_OPTIONS: TumblingProcessStatus[] = ['DRAFT', 'RUNNING', 'COMPLETED', 'COMPLETED_EARLY', 'STOPPED', 'CANCELLED'];
const PAGE_SIZE = 25;

function statusBadge(status: TumblingProcessStatus) {
  const mapped = status === 'COMPLETED_EARLY' ? 'COMPLETED' : status === 'CANCELLED' ? 'AVAILABLE' : status;
  const style = containerStatusStyle(mapped as 'AVAILABLE' | 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'STOPPED' | 'INACTIVE');
  return (
    <Badge tone={style.tone}>
      {status === 'COMPLETED_EARLY' ? 'Completed Early' : status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

export default function ProcessHistoryPage() {
  const [result, setResult] = useState<PaginatedResult<ProcessHistoryRowDto> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [operator, setOperator] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [containerId, setContainerId] = useState<string | null>(null);
  const [openProcessId, setOpenProcessId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setContainerId(params.get('containerId'));
  }, []);

  const fetchPage = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      if (search.trim()) params.set('search', search.trim());
      if (status) params.set('status', status);
      if (operator.trim()) params.set('operator', operator.trim());
      if (dateFrom) params.set('dateFrom', new Date(dateFrom).toISOString());
      if (dateTo) params.set('dateTo', new Date(dateTo).toISOString());
      if (containerId) params.set('containerId', containerId);

      const res = await fetch(`/api/metal-frame/tumbling/processes?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load process history.');
      setResult(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load process history.');
    }
  }, [page, search, status, operator, dateFrom, dateTo, containerId]);

  useEffect(() => {
    // Debounced; also re-runs (and cancels any pending timer) whenever containerId
    // hydrates from the URL on mount, so the very first fetch is never missing it.
    const t = setTimeout(fetchPage, 300);
    return () => clearTimeout(t);
  }, [fetchPage]);

  useEffect(() => {
    setPage(1);
  }, [search, status, operator, dateFrom, dateTo, containerId]);

  const rows = useMemo(() => result?.items ?? [], [result]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-700">Tumbling — Process History</h1>
          <p className="mt-1 text-sm text-gray-500">Every draft, run, and outcome across all 22 stations.</p>
        </div>
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}

      {containerId && (
        <div className="mb-3">
          <button
            onClick={() => setContainerId(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            Filtered by container #{containerId} <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Search">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Process, PID, sheet code..." />
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Operator">
          <Input value={operator} onChange={(e) => setOperator(e.target.value)} placeholder="Started or authorized by" />
        </Field>
        <Field label="From">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </Field>
        <Field label="To">
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </Field>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Process Code</TH>
            <TH>Station</TH>
            <TH>Container</TH>
            <TH>Products</TH>
            <TH>Start Time</TH>
            <TH>Expected Completion</TH>
            <TH>Actual Completion</TH>
            <TH>Duration</TH>
            <TH>Status</TH>
            <TH>Started By</TH>
            <TH>Authorized By</TH>
            <TH>Reason</TH>
          </TR>
        </THead>
        <TBody>
          {!result ? (
            <TR>
              <TD colSpan={12} className="py-8 text-center text-gray-400">
                Loading…
              </TD>
            </TR>
          ) : rows.length === 0 ? (
            <TR>
              <TD colSpan={12} className="py-8 text-center text-gray-400">
                No processes match these filters.
              </TD>
            </TR>
          ) : (
            rows.map((row) => (
              <TR key={row.id}>
                <TD>
                  <button onClick={() => setOpenProcessId(row.id)} className="font-medium text-brand-700 hover:underline">
                    {row.processCode}
                  </button>
                </TD>
                <TD>Station {String(row.stationNumber).padStart(2, '0')}</TD>
                <TD>{row.containerSide === 'LEFT' ? 'Left' : 'Right'}</TD>
                <TD>{row.productCount}</TD>
                <TD>{row.startedAt ? formatFullDateTime(row.startedAt) : '—'}</TD>
                <TD>{row.expectedCompletionAt ? formatClockTime(row.expectedCompletionAt) : '—'}</TD>
                <TD>{row.actualCompletionAt ? formatFullDateTime(row.actualCompletionAt) : '—'}</TD>
                <TD>{row.totalDurationMs != null ? formatDuration(row.totalDurationMs) : '—'}</TD>
                <TD>{statusBadge(row.status)}</TD>
                <TD>{row.startedByName ?? '—'}</TD>
                <TD>{row.authorizedByName ?? '—'}</TD>
                <TD className="max-w-[160px] truncate">{row.reason ?? '—'}</TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>

      {result && result.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {result.page} of {result.totalPages} · {result.totalItems} processes
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= result.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ProcessDetailModal processId={openProcessId} onClose={() => setOpenProcessId(null)} />
    </div>
  );
}
