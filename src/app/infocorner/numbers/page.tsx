"use client";

import { useCallback, useEffect, useState } from "react";

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
   Spinner
───────────────────────────────────────── */
function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 13,
        height: 13,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "nxs-spin 0.7s linear infinite",
        marginRight: 6,
        verticalAlign: "middle",
      }}
    />
  );
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
    <>
      <style>{`@keyframes nxs-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={s.page}>
        {/* ── Header ── */}
        <div style={s.pageHeader}>
          <div>
            <h3 style={s.pageTitle}>FITTING SHIPMENT VOLUME</h3>
            <p style={s.pageSubtitle}>
              lenskart-datahub · wms · NXS1 / NXS2 · last 3 days
            </p>
          </div>
          <button
            onClick={run}
            disabled={loading}
            style={{
              ...s.runBtn,
              opacity: loading ? 0.55 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Querying…
              </>
            ) : (
              "↻  Refresh"
            )}
          </button>
        </div>

        {/* ── Meta ── */}
        {data && (
          <div style={s.metaRow}>
            <span style={s.metaPill}>Project: {data.project}</span>
            <span style={s.metaPill}>{data.row_count} rows</span>
            <span style={s.metaPill}>
              Generated {new Date(data.generated_at).toLocaleString()}
            </span>
          </div>
        )}

        {/* ── Error ── */}
        {error && <div style={s.errorBox}>⚠ {error}</div>}

        {/* ── Table ── */}
        {data && !error && (
          <div style={s.tableCard}>
            <div style={s.tableTopBar}>
              <span style={s.tableTitle}>Distinct Shipping Packages</span>
            </div>
            <div style={s.tableScrollWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c} style={s.th}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={Math.max(columns.length, 1)}
                        style={s.emptyCell}
                      >
                        No rows returned.
                      </td>
                    </tr>
                  ) : (
                    data.rows.map((row, i) => (
                      <tr key={i}>
                        {columns.map((c) => (
                          <td key={c} style={s.td}>
                            {row[c] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Raw JSON ── */}
        {data && (
          <div style={s.rawCard}>
            <button
              onClick={() => setShowRaw((v) => !v)}
              style={s.rawToggle}
            >
              {showRaw ? "▾ Hide JSON output" : "▸ Show JSON output"}
            </button>
            {showRaw && (
              <pre style={s.rawPre}>{JSON.stringify(data, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    padding: "28px 32px",
    maxWidth: 1100,
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a2040",
    boxSizing: "border-box",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1f295c",
    letterSpacing: "-0.3px",
    margin: 0,
    fontFamily: "'Syne', sans-serif",
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#7a85a8",
    fontFamily: "'IBM Plex Mono', monospace",
    marginTop: 4,
    marginBottom: 0,
  },
  runBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#1f295c",
    color: "#ffffff",
    border: "none",
    borderRadius: 9,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  },
  metaRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  metaPill: {
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    background: "#f0f2f7",
    border: "1px solid #d8dde8",
    borderRadius: 6,
    padding: "4px 10px",
    color: "#1f295c",
  },
  errorBox: {
    background: "#fff0ee",
    border: "1px solid #f5c0b3",
    color: "#c0392b",
    borderRadius: 10,
    padding: "14px 18px",
    fontSize: 13,
    marginBottom: 16,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  tableCard: {
    background: "#ffffff",
    border: "1px solid #d8dde8",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  },
  tableTopBar: {
    background: "#1f295c",
    padding: "14px 22px",
  },
  tableTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
  },
  tableScrollWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#ffffff",
    borderBottom: "2px solid #2f3d7e",
    background: "#1f295c",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 16px",
    borderBottom: "1px solid #d8dde8",
    color: "#1a2040",
    fontSize: 13,
    fontFamily: "'IBM Plex Mono', monospace",
    whiteSpace: "nowrap",
  },
  emptyCell: {
    padding: "40px 24px",
    textAlign: "center",
    color: "#7a85a8",
    fontSize: 13,
  },
  rawCard: {
    background: "#ffffff",
    border: "1px solid #d8dde8",
    borderRadius: 12,
    padding: "14px 18px",
  },
  rawToggle: {
    background: "transparent",
    border: "none",
    color: "#1f295c",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
  },
  rawPre: {
    marginTop: 12,
    background: "#0f1530",
    color: "#c7d2fe",
    borderRadius: 8,
    padding: "14px 16px",
    fontSize: 11.5,
    fontFamily: "'IBM Plex Mono', monospace",
    overflowX: "auto",
    maxHeight: 420,
    lineHeight: 1.5,
  },
};
