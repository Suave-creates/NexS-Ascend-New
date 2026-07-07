"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/cn";
import {
  PageHeader,
  Card,
  CardBody,
  CardHeader,
  Button,
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

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface ResultRow {
  shipping_package_id: string;
  shipment_id: string | null;
  product_id: string | null;
  inventory_count: number | null;
  shipment_creation_date: string | null;
  facility: string | null;
  status: "ok" | "messed_up";
  error?: string;
}

type FilterType = "all" | "ok" | "messed_up";

interface ProgressState {
  done: number;
  total: number;
  currentId: string | null;
  currentChunk: number;
  totalChunks: number;
}

interface StatsState {
  total: number;
  ok: number;
  bad: number;
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function parseIds(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function fmtDate(d: string | null): string {
  if (!d) return "—";

  // If already in MySQL format, return as-is
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2} /.test(d)) {
    return d;
  }

  try {
    const date = new Date(d);

    // Add 5 hours 30 minutes (IST offset)
    date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000));

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  } catch {
    return d;
  }
}

/* ─────────────────────────────────────────
   Export utilities
───────────────────────────────────────── */
function rowsToFilteredArray(rows: ResultRow[], filter: FilterType): ResultRow[] {
  return filter === "all" ? rows : rows.filter((r) => r.status === filter);
}

function exportCSV(rows: ResultRow[], filter: FilterType) {
  const data = rowsToFilteredArray(rows, filter);
  const headers = [
    "Package ID",
    "Shipment ID",
    "Product ID",
    "Inventory Count",
    "Facility",
    "Created At",
    "Status",
    "Note",
  ];
  const escape = (v: string | number | null) => {
    const s = v === null || v === undefined ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csvRows = [
    headers.map(escape).join(","),
    ...data.map((r) =>
      [
        r.shipping_package_id,
        r.shipment_id,
        r.product_id,
        r.inventory_count,
        r.facility,
        fmtDate(r.shipment_creation_date),
        r.status === "ok" ? "OK" : "MESSED UP",
        r.status === "messed_up"
          ? "Messed Up Order - Check or Reassignment and CANC"
          : "",
      ]
        .map(escape)
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shipment-sync-${filter}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(rows: ResultRow[], filter: FilterType) {
  // Pure-JS XLSX export using an XML-based .xls that Excel opens natively
  const data = rowsToFilteredArray(rows, filter);

  const headers = [
    "Package ID",
    "Shipment ID",
    "Product ID",
    "Inventory Count",
    "Facility",
    "Created At",
    "Status",
    "Note",
  ];

  const esc = (v: string | number | null) =>
    String(v === null || v === undefined ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const headerRow = headers
    .map(
      (h) =>
        `<Cell ss:StyleID="header"><Data ss:Type="String">${esc(h)}</Data></Cell>`
    )
    .join("");

  const dataRows = data
    .map((r) => {
      const cells = [
        r.shipping_package_id,
        r.shipment_id,
        r.product_id,
        r.inventory_count,
        r.facility,
        fmtDate(r.shipment_creation_date),
        r.status === "ok" ? "OK" : "MESSED UP",
        r.status === "messed_up"
          ? "Messed Up Order - Check or Reassignment and CANC"
          : "",
      ]
        .map((v) => {
          const isNum = typeof v === "number";
          const style =
            r.status === "messed_up" ? ' ss:StyleID="bad"' : "";
          return `<Cell${style}><Data ss:Type="${isNum ? "Number" : "String"}">${esc(v)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("\n");

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
 </Styles>
 <Worksheet ss:Name="Shipment Sync">
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
  a.download = `shipment-sync-${filter}-${Date.now()}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────
   Progress Bar
───────────────────────────────────────── */
function ProgressBar({ done, total, currentId, currentChunk, totalChunks }: ProgressState) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = done >= total;
  return (
    <Card>
      <CardBody className="py-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-xs text-gray-500">
            {complete ? "✓ Complete" : "Processing…"}
          </span>
          <span className="font-mono text-xs font-medium text-brand-700">
            {done} / {total}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              complete ? "bg-good-600" : "bg-gold-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 font-mono text-xs text-gray-500">
          {currentChunk && totalChunks ? (
            <>
              ▶  Chunk {currentChunk} of {totalChunks}
              {currentId && <> • {currentId}</>}
            </>
          ) : (
            currentId ? `▶  ${currentId}` : " "
          )}
        </p>
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
  rows: ResultRow[];
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
}) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "ok", label: "OK" },
    { key: "messed_up", label: "Messed Up" },
  ];

  const displayed =
    filter === "all" ? rows : rows.filter((r) => r.status === filter);

  const countFor = (k: FilterType) =>
    k === "all" ? rows.length : rows.filter((r) => r.status === k).length;

  const cols = [
    "Package ID",
    "Shipment ID",
    "Product ID",
    "Inv. Count",
    "Facility",
    "Created At",
    "Status",
  ];

  return (
    <Card>
      {/* ── Top bar: filters left, export right ── */}
      <CardHeader className="flex-wrap">
        <div className="flex flex-wrap items-center gap-4">
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

        {/* Export buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(rows, filter)}
            title="Export current view as CSV"
          >
            ↓ CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportExcel(rows, filter)}
            title="Export current view as Excel"
          >
            ↓ Excel
          </Button>
        </div>
      </CardHeader>

      {/* ── Table ── */}
      <CardBody>
        <Table>
          <THead>
            <TR>
              {cols.map((c) => (
                <TH key={c}>{c}</TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {displayed.length === 0 ? (
              <TR>
                <TD colSpan={7} className="py-12 text-center text-gray-500">
                  No rows match this filter.
                </TD>
              </TR>
            ) : (
              displayed.map((row, i) => {
                const isBad = row.status === "messed_up";
                return (
                  <TR
                    key={`${row.shipping_package_id}-${i}`}
                    tone={isBad ? "danger" : undefined}
                  >
                    <TD>
                      <span className="block font-mono text-xs font-medium text-brand-700">
                        {row.shipping_package_id}
                      </span>
                      {isBad && (
                        <span className="mt-0.5 block text-[10px] font-medium text-danger-600">
                          Messed Up Order — Check or Reassignment and CANC
                        </span>
                      )}
                    </TD>
                    <TD className="font-mono text-xs">
                      {row.shipment_id ?? "—"}
                    </TD>
                    <TD className="font-mono text-xs">
                      {row.product_id ?? "—"}
                    </TD>
                    <TD>
                      {row.inventory_count !== null ? (
                        <span
                          className={cn(
                            "inline-block rounded border px-2 py-0.5 font-mono text-xs font-medium",
                            row.inventory_count === 0
                              ? "border-notice-600 bg-notice-50 text-notice-600"
                              : "border-gray-200 bg-gray-50 text-brand-700",
                          )}
                        >
                          {row.inventory_count}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TD>
                    <TD className="font-mono text-xs">
                      {row.facility ?? "—"}
                    </TD>
                    <TD className="font-mono text-[11px]">
                      {fmtDate(row.shipment_creation_date)}
                    </TD>
                    <TD>
                      {isBad ? (
                        <Badge tone="danger">⚑ MESSED UP</Badge>
                      ) : (
                        <Badge tone="good">✓ OK</Badge>
                      )}
                    </TD>
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>
      </CardBody>
    </Card>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function ShipmentSyncPage() {
  const [inputText, setInputText] = useState<string>("");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [stats, setStats] = useState<StatsState | null>(null);
  const abortRef = useRef<boolean>(false);

  const ids = parseIds(inputText);

  const runQuery = useCallback(async () => {
    const idList = parseIds(inputText);
    if (!idList.length) return;

    abortRef.current = false;
    setLoading(true);
    setRows([]);
    setStats(null);
    setFilter("all");

    const CHUNK_SIZE = 20;
    const chunks = chunkArray(idList, CHUNK_SIZE);

    setProgress({
      done: 0,
      total: idList.length,
      currentId: idList[0],
      currentChunk: 1,
      totalChunks: chunks.length,
    });

    const collected: ResultRow[] = [];
    let okCount = 0;
    let badCount = 0;
    let processedCount = 0;

    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      if (abortRef.current) break;

      const chunk = chunks[chunkIdx];
      const firstIdInChunk = chunk[0];

      setProgress({
        done: processedCount,
        total: idList.length,
        currentId: firstIdInChunk,
        currentChunk: chunkIdx + 1,
        totalChunks: chunks.length,
      });

      try {
        const res = await fetch("/api/order-info/sync-time-inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shipping_package_ids: chunk }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as { rows?: ResultRow[] };

        if (data.rows && data.rows.length > 0) {
          for (const r of data.rows) {
            collected.push(r);
            if (r.status === "ok") okCount++;
            else badCount++;
          }
        } else {
          // If no rows returned for any ID in chunk, mark them as messed up
          for (const id of chunk) {
            collected.push({
              shipping_package_id: id,
              shipment_id: null,
              product_id: null,
              inventory_count: null,
              shipment_creation_date: null,
              facility: null,
              status: "messed_up",
              error: "No data returned",
            });
            badCount++;
          }
        }
      } catch {
        // Mark all IDs in chunk as messed up on error
        for (const id of chunk) {
          collected.push({
            shipping_package_id: id,
            shipment_id: null,
            product_id: null,
            inventory_count: null,
            shipment_creation_date: null,
            facility: null,
            status: "messed_up",
            error: "Request failed",
          });
          badCount++;
        }
      }

      processedCount += chunk.length;
      setRows([...collected]);
    }

    setProgress({
      done: idList.length,
      total: idList.length,
      currentId: null,
      currentChunk: chunks.length,
      totalChunks: chunks.length,
    });
    setStats({ total: collected.length, ok: okCount, bad: badCount });
    setLoading(false);
  }, [inputText]);

  const handleStop = () => {
    abortRef.current = true;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ── Page heading ── */}
      <PageHeader
        title="Shipment Sync Time Inventory"
        subtitle="NXS1 · optimadb · sync-time-inventory"
        actions={
          stats ? (
            <Badge tone="good">{stats.total} rows processed</Badge>
          ) : undefined
        }
      />

      {/* ── Input card ── */}
      <Card>
        <CardBody className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Shipment / Package IDs
          </Label>
          <Textarea
            className="min-h-[130px] font-mono text-xs"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              "SNXS1260000052206840\nSNXS1260000052206841\nSNXS1260000052206842\n…one per line"
            }
            disabled={loading}
            spellCheck={false}
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-gray-500">
              {ids.length} ID{ids.length !== 1 ? "s" : ""} entered
            </span>
            <div className="flex gap-2">
              {loading && (
                <Button variant="danger" onClick={handleStop}>
                  ■ Stop
                </Button>
              )}
              <Button
                onClick={runQuery}
                disabled={loading || ids.length === 0}
                loading={loading}
              >
                {loading ? "Processing…" : "▶  Run Query"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Progress ── */}
      {progress && (
        <ProgressBar
          done={progress.done}
          total={progress.total}
          currentId={progress.currentId}
          currentChunk={progress.currentChunk}
          totalChunks={progress.totalChunks}
        />
      )}

      {/* ── Stat cards ── */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Processed" value={stats.total} tone="navy" />
          <StatCard label="Resolved OK" value={stats.ok} tone="good" />
          <StatCard label="Messed Up" value={stats.bad} tone="danger" />
        </div>
      )}

      {/* ── Results table ── */}
      {rows.length > 0 && (
        <ResultTable
          rows={rows}
          filter={filter}
          onFilterChange={setFilter}
        />
      )}
    </div>
  );
}
