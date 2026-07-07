'use client';

import { useState, useTransition, useEffect } from 'react';
import { cn } from '@/lib/cn';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Input,
  Alert,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

type HighlightComment = {
  pid: string;
  comment?: string | null;
};

type TrayRow = {
  tray_id: string;
  fitting_id: string;
  updated_fitting_id: string | null;
  order_status?: string | null;

  leftlens_pid: string | null;
  leftlens_order_item_status: string | null;

  rightlens_pid: string | null;
  rightlens_order_item_status: string | null;

  frame_pid: string | null;
  frame_order_item_status: string | null;

  is_highlighted?: boolean;
  highlight_comments?: HighlightComment[];
};

export default function TrayScannerPage() {
  const [scanValue, setScanValue] = useState('');
  const [rows, setRows] = useState<TrayRow[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     Auto-trigger scan
  ================================ */
  useEffect(() => {
    if (scanValue.trim().length >= 7) {
      triggerScan(scanValue.trim());
    }
  }, [scanValue]);

  const triggerScan = (trayId: string) => {
    setError(null);

    startTransition(async () => {
      try {
        /* 1️⃣ Fetch tray data */
        const res = await fetch('/api/asrs/order-prod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trayId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const row = data.row as TrayRow;

        /* 2️⃣ Collect PIDs for highlight check */
        const pids = [
          row.leftlens_pid,
          row.rightlens_pid,
          row.frame_pid,
        ].filter(Boolean);

        let highlightResult = {
          is_highlighted: false,
          comments: [] as HighlightComment[],
        };

        /* 3️⃣ Highlight check */
        if (pids.length > 0) {
          const checkRes = await fetch('/api/asrs/order-prod/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pids }),
          });

          if (checkRes.ok) {
            highlightResult = await checkRes.json();
          }
        }

        /* 4️⃣ Merge row */
        setRows((prev) =>
          [
            {
              ...row,
              is_highlighted: highlightResult.is_highlighted,
              highlight_comments: highlightResult.comments,
            },
            ...prev,
          ].slice(0, 20)
        );

        setScanValue('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tray data.');
      }
    });
  };

  /* ===============================
     Helpers
  ================================ */
  const cell = (val: string | null) => val || '-';

  const isPidFlagged = (
    pid: string | number | null,
    comments?: HighlightComment[]
  ): boolean => {
    if (!pid || !comments) return false;
    const normalizedPid = String(pid).trim();
    return comments.some(
      (c) => String(c.pid).trim() === normalizedPid
    );
  };

  const pidClass = (flagged: boolean) =>
    flagged ? 'text-danger-600 font-semibold' : 'text-gray-700';

  return (
    <div className="space-y-8 p-6">
      <PageHeader title="ORDER MASTER TRACER v1" className="justify-center text-center" />

      {/* Scanner input */}
      <Card variant="floating" className="mx-auto max-w-4xl p-6">
        <Input
          type="text"
          autoFocus
          placeholder="Scan Tray ID"
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
        />

        {isPending && (
          <p className="mt-2 text-sm text-gray-500">Processing scan…</p>
        )}

        {error && (
          <Alert tone="error" className="mt-4">
            {error}
          </Alert>
        )}
      </Card>

      {/* Results table */}
      {rows.length > 0 && (
        <Card className="mx-auto max-w-7xl">
          <CardHeader>
            <h2 className="text-xl font-semibold text-brand-700">
              Last {rows.length} Tray Scans
            </h2>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <tr>
                  <TH>Tray</TH>
                  <TH>Fitting</TH>
                  <TH>Updated Fitting</TH>
                  <TH>Order Status</TH>

                  <TH>LL PID</TH>
                  <TH>LL Order</TH>

                  <TH>RL PID</TH>
                  <TH>RL Order</TH>

                  <TH>Frame PID</TH>
                  <TH>Frame Order</TH>
                </tr>
              </THead>

              <TBody>
                {rows.map((r, i) => {
                  const llFlag = isPidFlagged(r.leftlens_pid, r.highlight_comments);
                  const rlFlag = isPidFlagged(r.rightlens_pid, r.highlight_comments);
                  const frFlag = isPidFlagged(r.frame_pid, r.highlight_comments);

                  return (
                    <TR key={i} tone={r.is_highlighted ? 'danger' : undefined}>
                      <TD className="font-medium">
                        {r.tray_id}
                      </TD>

                      <TD>{r.fitting_id}</TD>
                      <TD>
                        {r.updated_fitting_id || '-'}
                      </TD>
                      <TD>
                        {cell(r.order_status || null)}
                      </TD>

                      <TD className={cn('font-mono', pidClass(llFlag))}>
                        {cell(r.leftlens_pid)}
                      </TD>
                      <TD>
                        {cell(r.leftlens_order_item_status)}
                      </TD>

                      <TD className={cn('font-mono', pidClass(rlFlag))}>
                        {cell(r.rightlens_pid)}
                      </TD>
                      <TD>
                        {cell(r.rightlens_order_item_status)}
                      </TD>

                      <TD className={cn('font-mono', pidClass(frFlag))}>
                        {cell(r.frame_pid)}
                      </TD>
                      <TD>
                        {cell(r.frame_order_item_status)}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}