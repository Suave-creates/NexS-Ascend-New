"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/cn";
import {
  PageHeader,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Alert,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from "@/components/ui";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface ShippingRow {
  shipping_id: string;
  fitting_id: string | null;
  leftlens_status: string | null;
  rightlens_status: string | null;
  frame_status: string | null;
  leftlens_pid: string | null;
  rightlens_pid: string | null;
  frame_pid: string | null;
}

type FilterType = "all" | "complete" | "partial" | "missing";

interface ProgressState {
  done: number;
  total: number;
  currentId: string | null;
}

interface StatsState {
  total: number;
  complete: number;
  partial: number;
  missing: number;
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function parseIds(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function classifyRow(row: ShippingRow): "complete" | "partial" | "missing" {
  const statuses = [row.leftlens_status, row.rightlens_status, row.frame_status];
  const filled = statuses.filter(Boolean).length;
  if (filled === 3) return "complete";
  if (filled > 0) return "partial";
  return "missing";
}

function statusPillClass(status: string | null): string {
  if (!status) return "bg-gray-100 text-gray-500";
  const upper = status.toUpperCase();
  if (["SHIPPED", "DISPATCHED", "DELIVERED"].includes(upper)) return "bg-good-50 text-good-600";
  if (["PENDING", "PROCESSING", "IN_TRANSIT"].includes(upper)) return "bg-gold-100 text-gold-700";
  if (["CANCELLED", "RETURNED", "FAILED"].includes(upper)) return "bg-danger-50 text-danger-600";
  return "bg-blue-50 text-blue-800";
}

/* ─────────────────────────────────────────
   Export utilities
───────────────────────────────────────── */
function rowsToFilteredArray(rows: ShippingRow[], filter: FilterType): ShippingRow[] {
  if (filter === "all") return rows;
  return rows.filter((r) => classifyRow(r) === filter);
}

function exportCSV(rows: ShippingRow[], filter: FilterType) {
  const data = rowsToFilteredArray(rows, filter);
  const headers = [
    "Shipping ID", "Fitting ID",
    "Left Lens Status", "Right Lens Status", "Frame Status",
    "Left Lens PID", "Right Lens PID", "Frame PID", "Record Status",
  ];
  const escape = (v: string | null | undefined) => {
    const s = v === null || v === undefined ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csvRows = [
    headers.map(escape).join(","),
    ...data.map((r) =>
      [
        r.shipping_id, r.fitting_id,
        r.leftlens_status, r.rightlens_status, r.frame_status,
        r.leftlens_pid, r.rightlens_pid, r.frame_pid,
        classifyRow(r).toUpperCase(),
      ].map(escape).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shipment-rtd-${filter}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(rows: ShippingRow[], filter: FilterType) {
  const data = rowsToFilteredArray(rows, filter);
  const headers = [
    "Shipping ID", "Fitting ID",
    "Left Lens Status", "Right Lens Status", "Frame Status",
    "Left Lens PID", "Right Lens PID", "Frame PID", "Record Status",
  ];

  const esc = (v: string | null | undefined) =>
    String(v === null || v === undefined ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const headerRow = headers
    .map((h) => `<Cell ss:StyleID="header"><Data ss:Type="String">${esc(h)}</Data></Cell>`)
    .join("");

  const dataRows = data.map((r) => {
    const status = classifyRow(r);
    const styleId = status === "missing" ? "bad" : status === "partial" ? "warn" : "";
    const cells = [
      r.shipping_id, r.fitting_id,
      r.leftlens_status, r.rightlens_status, r.frame_status,
      r.leftlens_pid, r.rightlens_pid, r.frame_pid,
      status.toUpperCase(),
    ].map((v) => {
      const attr = styleId ? ` ss:StyleID="${styleId}"` : "";
      return `<Cell${attr}><Data ss:Type="String">${esc(v)}</Data></Cell>`;
    }).join("");
    return `<Row>${cells}</Row>`;
  }).join("\n");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1F295C" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="bad">
   <Interior ss:Color="#FFF0EE" ss:Pattern="Solid"/>
   <Font ss:Color="#C0392B"/>
  </Style>
  <Style ss:ID="warn">
   <Interior ss:Color="#FFFBEA" ss:Pattern="Solid"/>
   <Font ss:Color="#B45309"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Shipment RTD">
  <Table>
   <Row>${headerRow}</Row>
${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shipment-rtd-${filter}-${Date.now()}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────
   Tag Input
───────────────────────────────────────── */
function TagInput({
  ids,
  onAdd,
  onRemove,
  onPaste,
  disabled,
}: {
  ids: string[];
  onAdd: (id: string) => void;
  onRemove: (i: number) => void;
  onPaste: (ids: string[]) => void;
  disabled: boolean;
}) {
  const [ghost, setGhost] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const v = ghost.replace(/,/g, "").trim();
    if (v) onAdd(v);
    setGhost("");
  };

  return (
    <div
      className={cn(
        "flex min-h-[80px] w-full flex-wrap content-start gap-1.5 rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30",
        disabled && "pointer-events-none opacity-60",
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {ids.map((id, i) => (
        <span
          key={id + i}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 font-mono text-xs font-medium text-brand-700"
        >
          {id}
          <span
            className="cursor-pointer pl-0.5 text-sm leading-none text-gray-400 transition-colors hover:text-gray-600"
            onClick={(e) => { e.stopPropagation(); onRemove(i); }}
          >
            ×
          </span>
        </span>
      ))}
      <input
        ref={inputRef}
        value={ghost}
        onChange={(e) => setGhost(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === ",") && ghost.trim()) {
            e.preventDefault();
            commit();
          }
          if (e.key === "Backspace" && !ghost && ids.length) {
            onRemove(ids.length - 1);
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text");
          const parts = parseIds(text);
          if (parts.length) onPaste(parts);
          setGhost("");
        }}
        onBlur={commit}
        placeholder={ids.length === 0 ? "Type or paste IDs, press Enter or comma…" : ""}
        className="min-w-[160px] flex-1 border-none bg-transparent font-mono text-xs text-gray-900 outline-none"
        disabled={disabled}
        spellCheck={false}
        autoCorrect="off"
        autoComplete="off"
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Progress Bar
───────────────────────────────────────── */
function ProgressBar({ done, total, currentId }: ProgressState) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = done >= total;
  return (
    <Card>
      <CardBody className="py-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-xs text-gray-500">{complete ? "✓ Complete" : "Processing…"}</span>
          <span className="font-mono text-xs font-medium text-brand-700">{done} / {total}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn("h-full rounded-full transition-all duration-300", complete ? "bg-good-600" : "bg-gold-500")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 font-mono text-xs text-gray-500">{currentId ? `▶  ${currentId}` : "\u00a0"}</p>
      </CardBody>
    </Card>
  );
}

/* ─────────────────────────────────────────
   Result Table
───────────────────────────────────────── */
function ResultTable({
  rows,
  filter,
  onFilterChange,
}: {
  rows: ShippingRow[];
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
}) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "complete", label: "Complete" },
    { key: "partial", label: "Partial" },
    { key: "missing", label: "Missing" },
  ];

  const displayed = filter === "all" ? rows : rows.filter((r) => classifyRow(r) === filter);
  const countFor = (k: FilterType) =>
    k === "all" ? rows.length : rows.filter((r) => classifyRow(r) === k).length;

  return (
    <Card>
      {/* Top bar */}
      <CardHeader>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Results</span>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <Button
                key={f.key}
                variant={filter === f.key ? "primary" : "outline"}
                size="sm"
                onClick={() => onFilterChange(f.key)}
              >
                {f.label}
                <Badge tone={filter === f.key ? "gold" : "gray"} className="ml-1.5">
                  {countFor(f.key)}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(rows, filter)} title="Export as CSV">
            ↓ CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportExcel(rows, filter)}
            title="Export as Excel"
          >
            ↓ Excel
          </Button>
        </div>
      </CardHeader>

      {/* Scrollable table */}
      <div className="p-4">
        <Table>
          <THead>
            <TR>
              {["Shipping ID", "Fitting ID", "Left Lens", "Right Lens", "Frame", "LL PID", "RL PID", "Frame PID", "Status"].map((c) => (
                <TH key={c}>{c}</TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {displayed.length === 0 ? (
              <TR>
                <TD colSpan={9} className="py-12 text-center text-gray-500">No rows match this filter.</TD>
              </TR>
            ) : (
              displayed.map((row, i) => {
                const cls = classifyRow(row);
                const rowTone =
                  cls === "missing" ? "danger" as const :
                  cls === "partial" ? "notice" as const :
                  undefined;

                return (
                  <TR key={`${row.shipping_id}-${i}`} tone={rowTone}>
                    <TD>
                      <span className="font-mono text-xs font-medium text-brand-700">{row.shipping_id}</span>
                    </TD>
                    <TD className="font-mono text-xs">{row.fitting_id ?? "—"}</TD>
                    <TD>
                      {row.leftlens_status
                        ? <span className={cn("inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider", statusPillClass(row.leftlens_status))}>{row.leftlens_status}</span>
                        : <span className="text-gray-300">—</span>}
                    </TD>
                    <TD>
                      {row.rightlens_status
                        ? <span className={cn("inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider", statusPillClass(row.rightlens_status))}>{row.rightlens_status}</span>
                        : <span className="text-gray-300">—</span>}
                    </TD>
                    <TD>
                      {row.frame_status
                        ? <span className={cn("inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider", statusPillClass(row.frame_status))}>{row.frame_status}</span>
                        : <span className="text-gray-300">—</span>}
                    </TD>
                    <TD className="font-mono text-[11px]">{row.leftlens_pid ?? <span className="text-gray-300">—</span>}</TD>
                    <TD className="font-mono text-[11px]">{row.rightlens_pid ?? <span className="text-gray-300">—</span>}</TD>
                    <TD className="font-mono text-[11px]">{row.frame_pid ?? <span className="text-gray-300">—</span>}</TD>
                    <TD>
                      {cls === "complete" && <Badge tone="good">✓ Complete</Badge>}
                      {cls === "partial" && <Badge tone="gold">◑ Partial</Badge>}
                      {cls === "missing" && <Badge tone="danger">⚑ Missing</Badge>}
                    </TD>
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function ShipmentRTDPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [rows, setRows] = useState<ShippingRow[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [stats, setStats] = useState<StatsState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const addId = (id: string) => {
    if (!ids.includes(id) && ids.length < 500) setIds((prev) => [...prev, id]);
  };
  const removeId = (i: number) => setIds((prev) => prev.filter((_, idx) => idx !== i));
  const pasteIds = (newIds: string[]) => {
    setIds((prev) => {
      const combined = [...prev];
      for (const id of newIds) {
        if (!combined.includes(id) && combined.length < 500) combined.push(id);
      }
      return combined;
    });
  };

  const runQuery = useCallback(async () => {
    if (!ids.length) return;
    abortRef.current = false;
    setLoading(true);
    setRows([]);
    setStats(null);
    setError(null);
    setFilter("all");

    // Single batch call (API accepts up to 500)
    setProgress({ done: 0, total: ids.length, currentId: ids[0] });

    try {
      const res = await fetch("/api/infocorner/shippment-rtd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping_ids: ids }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      // Response is CSV
      const csvText = await res.text();
      const lines = csvText.trim().split("\n");
      const parsed: ShippingRow[] = lines.slice(1).map((line) => {
        // CSV parse — handles quoted fields
        const cols: string[] = [];
        let cur = "";
        let inQ = false;
        for (const c of line) {
          if (c === '"') { inQ = !inQ; }
          else if (c === "," && !inQ) { cols.push(cur); cur = ""; }
          else cur += c;
        }
        cols.push(cur);
        const clean = cols.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"') || null);
        return {
          shipping_id: clean[0] ?? "",
          fitting_id: clean[1],
          leftlens_status: clean[2],
          rightlens_status: clean[3],
          frame_status: clean[4],
          leftlens_pid: clean[5],
          rightlens_pid: clean[6],
          frame_pid: clean[7],
        };
      });

      setRows(parsed);
      setProgress({ done: ids.length, total: ids.length, currentId: null });

      const complete = parsed.filter((r) => classifyRow(r) === "complete").length;
      const partial = parsed.filter((r) => classifyRow(r) === "partial").length;
      const missing = parsed.filter((r) => classifyRow(r) === "missing").length;
      setStats({ total: parsed.length, complete, partial, missing });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setError(msg);
      setProgress(null);
    }

    setLoading(false);
  }, [ids]);

  const handleStop = () => { abortRef.current = true; };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Page heading ── */}
        <PageHeader
          title="SHIPMENT RTD DETAILS"
          subtitle="NXS · WMS · order-info / shippment-rtd"
          actions={
            stats ? (
              <Badge tone="good">{stats.total} row{stats.total !== 1 ? "s" : ""} returned</Badge>
            ) : undefined
          }
        />

        {/* ── Input card ── */}
        <Card>
          <CardBody className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">Shipping IDs</label>
            <span
              className={cn(
                "rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-500",
                ids.length >= 500 && "border-gold-300 bg-gold-100 text-gold-700",
              )}
            >
              {ids.length} / 500
            </span>
          </div>

          <TagInput
            ids={ids}
            onAdd={addId}
            onRemove={removeId}
            onPaste={pasteIds}
            disabled={loading}
          />

          <p className="font-mono text-xs text-gray-500">
            Paste comma-separated or newline-separated IDs — they&apos;ll auto-split
          </p>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-gray-500">
              {ids.length} ID{ids.length !== 1 ? "s" : ""} entered
            </span>
            <div className="flex gap-2">
              {loading && (
                <Button variant="outline" onClick={handleStop} className="border-danger-200 bg-danger-50 text-danger-600 hover:bg-danger-50">■ Stop</Button>
              )}
              <Button
                onClick={runQuery}
                disabled={loading || ids.length === 0}
                loading={loading}
              >
                {loading ? "Processing…" : "▶  Run Lookup"}
              </Button>
            </div>
          </div>
          </CardBody>
        </Card>

        {/* ── Error ── */}
        {error && (
          <Alert tone="error">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {/* ── Progress ── */}
        {progress && (
          <ProgressBar done={progress.done} total={progress.total} currentId={progress.currentId} />
        )}

        {/* ── Stats ── */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Returned" value={stats.total} tone="navy" />
            <StatCard label="Complete" value={stats.complete} tone="good" />
            <StatCard label="Partial" value={stats.partial} tone="notice" />
            <StatCard label="Missing" value={stats.missing} tone="danger" />
          </div>
        )}

        {/* ── Results table ── */}
        {rows.length > 0 && (
          <ResultTable rows={rows} filter={filter} onFilterChange={setFilter} />
        )}
    </div>
  );
}

