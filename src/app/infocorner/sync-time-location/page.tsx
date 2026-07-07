"use client";

import { useState, useMemo } from "react";
import { FiPlay, FiDownload, FiGrid } from "react-icons/fi";
import { cn } from "@/lib/cn";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Alert,
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

interface PicklistRow {
  increment_id: string;
  product_id: string;
  shipment_id: string;
  scm_order_created_at: string;
  updated_at: string;
  location_barcode: string;
  asrs_location_barcode: string;
  item_type: string;
  location_type: string;
  fullfill_type: string;
  facility: string;
  order_state: string;
  jit_order: number | boolean;
  repick_status: string;
  repick_count: number;
}

interface ApiResponse {
  total: number;
  data: PicklistRow[];
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

/** Normalise any date value → "yyyy-mm-dd hh:mm:ss" */
function fmtDatetime(val: string | null | undefined): string {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

const COLUMNS: Array<{ key: keyof PicklistRow; label: string }> = [
  { key: "increment_id",          label: "Increment ID" },
  { key: "product_id",            label: "Product ID" },
  { key: "shipment_id",           label: "Shipment ID" },
  { key: "scm_order_created_at",  label: "SCM Order Created At" },
  { key: "updated_at",            label: "Updated At" },
  { key: "location_barcode",      label: "Location Barcode" },
  { key: "asrs_location_barcode", label: "ASRS Location Barcode" },
  { key: "item_type",             label: "Item Type" },
  { key: "location_type",         label: "Location Type" },
  { key: "fullfill_type",         label: "Fulfill Type" },
  { key: "facility",              label: "Facility" },
  { key: "order_state",           label: "Order State" },
  { key: "jit_order",             label: "JIT Order" },
  { key: "repick_status",         label: "Repick Status" },
  { key: "repick_count",          label: "Repick Count" },
];

const DATE_KEYS = new Set<keyof PicklistRow>(["scm_order_created_at", "updated_at"]);

function rowFlat(row: PicklistRow): Record<string, string> {
  const out: Record<string, string> = {};
  for (const col of COLUMNS) {
    const v = row[col.key];
    if (DATE_KEYS.has(col.key)) {
      out[col.label] = fmtDatetime(v as string);
    } else if (col.key === "jit_order") {
      out[col.label] = v ? "Yes" : "No";
    } else {
      out[col.label] = v == null ? "" : String(v);
    }
  }
  return out;
}

function exportCsv(rows: PicklistRow[]) {
  const headers = COLUMNS.map((c) => c.label);
  const esc = (v: string) =>
    v.includes(",") || v.includes('"') || v.includes("\n")
      ? `"${v.replace(/"/g, '""')}"`
      : v;
  const lines = [
    headers.map(esc).join(","),
    ...rows.map((r) => {
      const flat = rowFlat(r);
      return headers.map((h) => esc(flat[h] ?? "")).join(",");
    }),
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `picklist_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportXlsx(rows: PicklistRow[]) {
  const XLSX = await import("xlsx");
  const headers = COLUMNS.map((c) => c.label);
  const data = [
    headers,
    ...rows.map((r) => {
      const flat = rowFlat(r);
      return headers.map((h) => flat[h] ?? "");
    }),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = headers.map(() => ({ wch: 24 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Picklist");
  XLSX.writeFile(wb, `picklist_${Date.now()}.xlsx`);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ children, variant }: { children: React.ReactNode; variant: string }) {
  const MAP: Record<string, string> = {
    jit:       "bg-brand-50 text-brand-700",
    regular:   "bg-gray-100 text-gray-500",
    asrs:      "bg-gold-100 text-gold-700",
    floor:     "bg-good-50 text-good-600",
    bulk:      "bg-gray-100 text-gray-500",
    reserve:   "bg-gray-100 text-gray-500",
    pending:   "bg-notice-50 text-notice-600",
    packed:    "bg-good-50 text-good-600",
    shipped:   "bg-good-50 text-good-600",
    cancelled: "bg-danger-50 text-danger-600",
    picking:   "bg-gold-100 text-gold-700",
    done:      "bg-good-50 text-good-600",
    error:     "bg-danger-50 text-danger-600",
    none:      "bg-gray-100 text-gray-500",
    requested: "bg-notice-50 text-notice-600",
  };
  const cls = MAP[variant] ?? MAP.regular;
  return <span className={cn("inline-block rounded px-1.5 py-0.5 text-[10px] font-medium", cls)}>{children}</span>;
}

function ChunkVisualizer({ total, done }: { total: number; done: number }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors",
            i < done
              ? "border-good-600/40 bg-good-50 text-good-600"
              : i === done
              ? "border-gold-500/50 bg-gold-100 text-gold-700"
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

export default function PicklistChunked() {
  const [idsRaw, setIdsRaw]         = useState("");
  const [filter, setFilter]         = useState("");
  const [status, setStatus]         = useState<QueryStatus>("idle");
  const [statusMsg, setStatusMsg]   = useState("Idle — enter shipment IDs to begin");
  const [results, setResults]       = useState<PicklistRow[]>([]);
  const [totalRows, setTotalRows]   = useState(0);
  const [chunksTotal, setCT]        = useState(0);
  const [chunksDone, setCD]         = useState(0);
  const [progress, setProgress]     = useState(0);
  const [xlsxBusy, setXlsxBusy]    = useState(false);

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
    if (!ids.length) { setStatusMsg("⚠  Please enter at least one shipment ID"); return; }
    setStatus("loading");
    setResults([]); setTotalRows(0); setCD(0); setProgress(0);
    const n = chunkCount(ids, CHUNK_SIZE);
    setCT(n);
    setStatusMsg(`Sending ${ids.length} IDs across ${n} chunk${n !== 1 ? "s" : ""}…`);

    let tick = 0;
    const iv = setInterval(() => {
      tick = Math.min(tick + 1, n - 1);
      setCD(tick);
      setProgress(Math.round((tick / n) * 90));
    }, 320);

    try {
      const res  = await fetch("/api/order-info/sync-time-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_ids: ids }),
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
      setStatusMsg(`✓  ${data.total} rows returned from ${n} chunk${n !== 1 ? "s" : ""}`);
    } catch (err: unknown) {
      clearInterval(iv);
      setStatus("error");
      setStatusMsg(`Network error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function loadSample() {
    setIdsRaw([
      "SHP-10041","SHP-10042","SHP-10043","SHP-10044","SHP-10045",
      "SHP-10046","SHP-10047","SHP-10048","SHP-10049","SHP-10050",
      "SHP-20001","SHP-20002","SHP-20003","SHP-20004","SHP-20005",
      "SHP-20006","SHP-20007","SHP-20008","SHP-20009","SHP-20010",
      "SHP-30001","SHP-30002","SHP-30003",
    ].join("\n"));
  }

  function clearAll() {
    setIdsRaw(""); setResults([]); setTotalRows(0);
    setStatus("idle"); setStatusMsg("Idle — enter shipment IDs to begin");
    setProgress(0); setCD(0); setCT(0); setFilter("");
  }

  async function handleExcel() {
    setXlsxBusy(true);
    try { await exportXlsx(filtered); } finally { setXlsxBusy(false); }
  }

  const statusTone =
    status === "success" ? "success"
    : status === "error"   ? "error"
    : status === "loading" ? "notice"
    : "info";

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}
      <PageHeader
        title="Picklist Chunked Query"
        subtitle="POST /api/order-info/sync-time-location — picking.picklist_order_item"
        actions={<Badge tone="navy" className="font-mono">CHUNK_SIZE = {CHUNK_SIZE}</Badge>}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Shipment IDs"  value={parsedIds.length} sub="in request payload" tone="navy" />
        <StatCard label="Chunks"        value={parsedIds.length ? numChunks : 0} sub="sequential SQL queries" tone="gold" />
        <StatCard label="Rows Returned" value={totalRows} sub="from DB" tone={totalRows > 0 ? "good" : "navy"} />
      </div>

      {/* Config */}
      <Card>
        <CardHeader>
          <span className="text-sm font-semibold text-brand-700">Request Configuration</span>
        </CardHeader>
        <CardBody className="space-y-3">
          <label className="block text-xs font-medium text-gray-500">shipment_ids — comma-separated or one per line</label>
          <Textarea
            rows={4}
            className="font-mono text-xs"
            placeholder={"SHP-001, SHP-002, SHP-003\nor paste one per line…"}
            value={idsRaw}
            onChange={(e) => setIdsRaw(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={runQuery} loading={status === "loading"} disabled={status === "loading"}>
              <FiPlay className="h-3.5 w-3.5" />
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

          <Alert tone={statusTone}>{statusMsg}</Alert>
        </CardBody>
      </Card>

      {/* Results */}
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
                  <FiDownload className="h-3 w-3" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExcel}
                  loading={xlsxBusy}
                  disabled={xlsxBusy}
                >
                  <FiGrid className="h-3 w-3" />
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
            <FiGrid className="mb-2.5 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">
              No results yet — run a query to see picklist data
            </p>
          </div>
        ) : (
          <CardBody>
            <Table>
              <THead>
                <TR>
                  {[
                    "#", "Increment ID", "Product ID", "Shipment ID",
                    "SCM Created At", "Updated At",
                    "Location Barcode", "ASRS Location",
                    "Item Type", "Loc Type", "Fulfill Type",
                    "Facility", "Order State", "JIT", "Repick Status", "Repick #",
                  ].map((h) => <TH key={h}>{h}</TH>)}
                </TR>
              </THead>
              <TBody>
                {filtered.map((row, i) => (
                  <TR key={i}>
                    <TD className="text-gray-400">{i + 1}</TD>
                    <TD className="font-mono text-xs">{row.increment_id}</TD>
                    <TD className="font-mono text-xs">{row.product_id}</TD>
                    <TD className="font-mono text-xs">{row.shipment_id}</TD>
                    <TD className="font-mono text-xs text-gray-500">{fmtDatetime(row.scm_order_created_at)}</TD>
                    <TD className="font-mono text-xs text-gray-500">{fmtDatetime(row.updated_at)}</TD>
                    <TD className="font-mono text-xs">{row.location_barcode}</TD>
                    <TD className="font-mono text-xs">{row.asrs_location_barcode || "—"}</TD>
                    <TD className="font-mono text-xs">{row.item_type}</TD>
                    <TD className="font-mono text-xs">
                      <Tag variant={row.location_type?.toLowerCase()}>{row.location_type}</Tag>
                    </TD>
                    <TD className="font-mono text-xs">{row.fullfill_type}</TD>
                    <TD className="font-mono text-xs">{row.facility}</TD>
                    <TD className="font-mono text-xs">
                      <Tag variant={row.order_state?.toLowerCase()}>{row.order_state}</Tag>
                    </TD>
                    <TD className="font-mono text-xs">
                      <Tag variant={row.jit_order ? "jit" : "regular"}>
                        {row.jit_order ? "JIT" : "No"}
                      </Tag>
                    </TD>
                    <TD className="font-mono text-xs">
                      <Tag variant={row.repick_status?.toLowerCase()}>{row.repick_status}</Tag>
                    </TD>
                    <TD className="text-center font-mono text-xs">{row.repick_count}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        )}
      </Card>
    </div>
  );
}
