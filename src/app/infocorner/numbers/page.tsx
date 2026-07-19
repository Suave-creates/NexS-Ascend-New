"use client";

import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  PageHeader,
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

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Cell = string | number | null;

interface ApiResponse {
  project: string;
  dates: { day_minus_3: string; day_minus_2: string; day_minus_1: string };
  columns: string[];
  row_count: number;
  rows: Record<string, Cell>[];
  generated_at: string;
  raw: unknown;
  error?: string;
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function FittingVolumePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/infocorner/numbers", { cache: "no-store" });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || json.error) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    run();
  }, [run]);

  const columns = data?.columns ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Fitting Shipment Volume"
        subtitle="lenskart-datahub · wms · NXS1 / NXS2 · last 3 days"
        actions={
          <Button onClick={run} loading={loading}>
            {!loading && <FiRefreshCw className="h-4 w-4" />}
            {loading ? "Querying…" : "Refresh"}
          </Button>
        }
      />

      {/* ── Meta ── */}
      {data && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Project" value={data.project} tone="navy" />
          <StatCard label="Rows" value={data.row_count} tone="good" />
          <StatCard
            label="Generated"
            value={new Date(data.generated_at).toLocaleTimeString()}
            sub={new Date(data.generated_at).toLocaleDateString()}
            tone="gold"
          />
        </div>
      )}

      {/* ── Error ── */}
      {error && <Alert tone="error">{error}</Alert>}

      {/* ── Table ── */}
      {data && !error && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-brand-700">
              Distinct Shipping Packages
            </h2>
            <Badge tone="navy">{data.row_count} rows</Badge>
          </CardHeader>
          <Table>
            <THead>
              <TR>
                {columns.map((c) => (
                  <TH key={c}>{c}</TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {data.rows.length === 0 ? (
                <TR>
                  <TD
                    colSpan={Math.max(columns.length, 1)}
                    className="py-10 text-center text-gray-500"
                  >
                    No rows returned.
                  </TD>
                </TR>
              ) : (
                data.rows.map((row, i) => (
                  <TR key={i}>
                    {columns.map((c) => (
                      <TD key={c} className="whitespace-nowrap font-mono">
                        {row[c] ?? "—"}
                      </TD>
                    ))}
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </Card>
      )}

      {/* ── Raw JSON ── */}
      {data && (
        <Card>
          <CardBody className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRaw((v) => !v)}
            >
              {showRaw ? "▾ Hide JSON output" : "▸ Show JSON output"}
            </Button>
            {showRaw && (
              <pre className="max-h-[420px] overflow-x-auto rounded-lg bg-brand-900 p-4 font-mono text-xs leading-relaxed text-brand-50">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
