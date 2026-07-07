"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/cn";
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Button,
  Input,
  Textarea,
  Label,
  Badge,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from "@/components/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderRow {
  increment_id: string;
  order_created_at: string;
}

interface ApiResponse {
  total: number;
  data: OrderRow[];
  error?: string;
}

type QueryStatus = "idle" | "loading" | "success" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseIds(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function chunkCount(ids: string[], size: number): number {
  return Math.ceil(ids.length / size);
}

function fmtDatetime(val: string | null | undefined): string {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);

  // Add 5 hours 30 minutes (in milliseconds)
  const IST_OFFSET = (5 * 60 + 30) * 60 * 1000;
  const istDate = new Date(d.getTime() + IST_OFFSET);

  const p = (n: number) => String(n).padStart(2, "0");

  return (
    `${istDate.getFullYear()}-${p(istDate.getMonth() + 1)}-${p(istDate.getDate())} ` +
    `${p(istDate.getHours())}:${p(istDate.getMinutes())}:${p(istDate.getSeconds())}`
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

const COLUMNS: Array<{ key: keyof OrderRow; label: string }> = [
  { key: "increment_id",     label: "Increment ID" },
  { key: "order_created_at", label: "Order Created At" },
];

function rowFlat(row: OrderRow): Record<string, string> {
  return {
    "Increment ID":     row.increment_id ?? "",
    "Order Created At": fmtDatetime(row.order_created_at),
  };
}

function exportCsv(rows: OrderRow[]) {
  const headers = COLUMNS.map((c) => c.label);
  const esc = (v: string) =>
    v.includes(",") || v.includes('"') || v.includes("\n")
      ? `"${v.replace(/"/g, '""')}"`
      : v;
  const lines = [
    headers.map(esc).join(","),
    ...rows.map((r) => {
      const f = rowFlat(r);
      return headers.map((h) => esc(f[h] ?? "")).join(",");
    }),
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `order_sync_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportXlsx(rows: OrderRow[]) {
  const XLSX = await import ("xlsx");
  const headers = COLUMNS.map((c) => c.label);
  const data = [
    headers,
    ...rows.map((r) => {
      const f = rowFlat(r);
      return headers.map((h) => f[h] ?? "");
    }),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 24 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Order Sync");
  XLSX.writeFile(wb, `order_sync_${Date.now()}.xlsx`);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChunkVisualizer({ total, done }: { total: number; done: number }) {
  if (total === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors",
            i < done
              ? "border-good-600/30 bg-good-50 text-good-600"
              : i === done
              ? "border-notice-600/30 bg-notice-50 text-notice-600"
              : "border-gray-200 bg-gray-50 text-gray-400",
          )}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const CHUNK_SIZE = 20;

export default function OrderSyncTimePage() {
  const [idsRaw, setIdsRaw]       = useState("");
  const [filter, setFilter]       = useState("");
  const [status, setStatus]       = useState<QueryStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("Idle — enter increment IDs to begin");
  const [results, setResults]     = useState<OrderRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [chunksTotal, setCT]      = useState(0);
  const [chunksDone, setCD]       = useState(0);
  const [progress, setProgress]   = useState(0);
  const [xlsxBusy, setXlsxBusy]  = useState(false);

  const parsedIds = useMemo(() => parseIds(idsRaw), [idsRaw]);
  const numChunks = useMemo(() => chunkCount(parsedIds, CHUNK_SIZE), [parsedIds]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return results;
    const q = filter.toLowerCase();
    return results.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [results, filter]);

  async function runQuery() {
    const ids = parseIds(idsRaw);
    if (!ids.length) { setStatusMsg("⚠  Please enter at least one increment ID"); return; }

    setStatus("loading");
    setResults([]); setTotalRows(0); setCD(0); setProgress(0);
    const n = chunkCount(ids, CHUNK_SIZE);
    setCT(n);
    setStatusMsg(`Sending ${ids.length} ID${ids.length !== 1 ? "s" : ""} across ${n} chunk${n !== 1 ? "s" : ""}…`);

    let tick = 0;
    const iv = setInterval(() => {
      tick = Math.min(tick + 1, n - 1);
      setCD(tick);
      setProgress(Math.round((tick / n) * 90));
    }, 320);

    try {
      const res  = await fetch("/api/order-info/order-created-when", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment_ids: ids }),
      });
      const data: ApiResponse = await res.json();
      clearInterval(iv);

      if (!res.ok || data.error) {
        setStatus("error");
        setStatusMsg(`Error: ${data.error ?? res.statusText}`);
        setCD(0); setProgress(0);
        return;
      }

      setCD(n); setProgress(100);
      setResults(data.data ?? []);
      setTotalRows(data.total ?? 0);
      setStatus("success");
      setStatusMsg(`✓  ${data.total} row${data.total !== 1 ? "s" : ""} returned from ${n} chunk${n !== 1 ? "s" : ""}`);
    } catch (err: unknown) {
      clearInterval(iv);
      setStatus("error");
      setStatusMsg(`Network error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function loadSample() {
    setIdsRaw([
      "100041001","100041002","100041003","100041004","100041005",
      "100041006","100041007","100041008","100041009","100041010",
      "100042001","100042002","100042003","100042004","100042005",
      "100043001","100043002","100043003",
    ].join("\n"));
  }

  function clearAll() {
    setIdsRaw(""); setResults([]); setTotalRows(0);
    setStatus("idle"); setStatusMsg("Idle — enter increment IDs to begin");
    setProgress(0); setCD(0); setCT(0); setFilter("");
  }

  async function handleExcel() {
    setXlsxBusy(true);
    try { await exportXlsx(filtered); } finally { setXlsxBusy(false); }
  }

  const dotClass =
    status === "loading" ? "bg-notice-600"
    : status === "success" ? "bg-good-600"
    : status === "error"   ? "bg-danger-600"
    : "bg-gray-300";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ── Header ── */}
      <PageHeader
        title="Order Sync — Time & Location"
        subtitle="POST /api/order-info/sync-time-location — wms.orders"
        actions={<Badge tone="navy" className="font-mono">CHUNK_SIZE = {CHUNK_SIZE}</Badge>}
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Increment IDs"  value={parsedIds.length} sub="in request payload" tone="navy" />
        <StatCard label="Chunks"         value={parsedIds.length ? numChunks : 0} sub="sequential SQL queries" tone="gold" />
        <StatCard label="Rows Returned"  value={totalRows} sub="from wms.orders" tone={totalRows > 0 ? "good" : "navy"} />
      </div>

      {/* ── Config Panel ── */}
      <Card>
        <CardHeader>
          <span className="text-sm font-semibold text-brand-700">Request Configuration</span>
        </CardHeader>
        <CardBody className="space-y-3">
          <Label htmlFor="increment-ids">
            increment_ids — comma-separated or one per line
          </Label>
          <Textarea
            id="increment-ids"
            rows={4}
            className="font-mono text-xs"
            placeholder={"100041001, 100041002, 100041003\nor paste one per line…"}
            value={idsRaw}
            onChange={(e) => setIdsRaw(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={runQuery} loading={status === "loading"} disabled={status === "loading"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Run Query
            </Button>
            <Button variant="outline" onClick={loadSample}>Load Sample IDs</Button>
            <Button variant="outline" onClick={clearAll}>Clear</Button>
          </div>

          {status === "loading" && (
            <div className="pt-1">
              <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                <span>Processing chunks…</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-brand-700 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ChunkVisualizer total={chunksTotal} done={chunksDone} />
            </div>
          )}

          <div className="flex items-center gap-2.5 border-t border-gray-100 pt-3">
            <span className={cn("h-2 w-2 shrink-0 rounded-full transition-colors", dotClass)} />
            <span className="text-xs text-gray-500">{statusMsg}</span>
          </div>
        </CardBody>
      </Card>

      {/* ── Results ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
            Results
            <Badge tone="navy" className="font-mono">{filtered.length} rows</Badge>
          </div>
          <div className="flex items-center gap-2">
            {results.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => exportCsv(filtered)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExcel} loading={xlsxBusy} disabled={xlsxBusy}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M3 15h18M9 3v18"/>
                  </svg>
                  {xlsxBusy ? "Exporting…" : "Excel"}
                </Button>
              </>
            )}
            <Input
              className="w-44"
              placeholder="Filter results…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </CardHeader>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" className="mb-2.5 text-gray-300">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p className="text-sm text-gray-500">
              No results yet — run a query to see order sync data
            </p>
          </div>
        ) : (
          <div className="p-4">
            <Table>
              <THead>
                <TR>
                  <TH className="w-12">#</TH>
                  <TH>Increment ID</TH>
                  <TH>Order Created At</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((row, i) => (
                  <TR key={i}>
                    <TD className="text-gray-400">{i + 1}</TD>
                    <TD className="font-mono text-gray-900">{row.increment_id}</TD>
                    <TD className="font-mono text-gray-500">{fmtDatetime(row.order_created_at)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
