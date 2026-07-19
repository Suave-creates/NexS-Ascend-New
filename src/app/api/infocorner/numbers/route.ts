import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────
   Config
───────────────────────────────────────── */
// Project the BigQuery job runs / bills in. The OAuth account needs
// bigquery.jobs.create here, plus read access to lenskart-datahub.wms.
const BQ_PROJECT_ID = process.env.BQ_PROJECT_ID || "lenskart-datahub";

const TOKEN_PATH = path.join(
  process.cwd(),
  "src",
  "app",
  "infocorner",
  "numbers",
  "token.json"
);

interface TokenFile {
  refresh_token: string;
  token_uri: string;
  client_id: string;
  client_secret: string;
}

/* ─────────────────────────────────────────
   Date helpers — match BigQuery CURRENT_DATE() (UTC)
───────────────────────────────────────── */
function utcDateLabel(daysAgo: number): string {
  const now = new Date();
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo)
  );
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}_${m}_${day}`;
}

/* ─────────────────────────────────────────
   OAuth: exchange refresh_token for a fresh access_token
───────────────────────────────────────── */
async function getAccessToken(tok: TokenFile): Promise<string> {
  const res = await fetch(tok.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tok.refresh_token,
      client_id: tok.client_id,
      client_secret: tok.client_secret,
    }),
  });

  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(
      `OAuth token refresh failed: ${data.error || res.status} ${data.error_description || ""}`.trim()
    );
  }
  return data.access_token;
}

/* ─────────────────────────────────────────
   Build the query (single statement — dates become column headers)
───────────────────────────────────────── */
function buildQuery(d1: string, d2: string, d3: string): string {
  // Aliases are date strings (digits + underscores only) — safe to inline.
  return `
SELECT
    oi.facility_code,
    oih.order_item_type,

    COUNT(DISTINCT CASE
        WHEN DATE(oi.created_at) = CURRENT_DATE() - INTERVAL 2 DAY
        THEN oi.shipping_package_id
    END) AS D_2,

    COUNT(DISTINCT CASE
        WHEN DATE(oi.created_at) = CURRENT_DATE() - INTERVAL 1 DAY
        THEN oi.shipping_package_id
    END) AS D_1,

    COUNT(DISTINCT CASE
        WHEN DATE(oi.created_at) = CURRENT_DATE()
         AND oih.order_priority = 1
        THEN oi.shipping_package_id
    END) AS TODAY

FROM lenskart-datahub.wms.order_items oi
JOIN lenskart-datahub.wms.order_item_header oih
    ON oi.shipping_package_id = oih.shipping_package_id

WHERE oi.facility_code IN ('NXS1','NXS2')
  AND oi.fitting_type IN ('REQD','DONE')
  AND DATE(oi.created_at) BETWEEN CURRENT_DATE() - INTERVAL 2 DAY
                              AND CURRENT_DATE()
  AND oih.order_item_type IN ('JIT','REGULAR')

GROUP BY
    oi.facility_code,
    oih.order_item_type;
`;
}

/* ─────────────────────────────────────────
   BigQuery REST response types
───────────────────────────────────────── */
interface BQField {
  name: string;
  type: string;
}
interface BQCell {
  v: string | null;
}
interface BQRow {
  f: BQCell[];
}
interface BQQueryResponse {
  jobComplete?: boolean;
  jobReference?: { jobId: string; location?: string };
  schema?: { fields: BQField[] };
  rows?: BQRow[];
  totalRows?: string;
  errors?: { message: string }[];
  error?: { message: string };
}

const NUMERIC_TYPES = new Set([
  "INTEGER",
  "INT64",
  "FLOAT",
  "FLOAT64",
  "NUMERIC",
  "BIGNUMERIC",
]);

function coerce(value: string | null, type: string): string | number | null {
  if (value === null) return null;
  if (NUMERIC_TYPES.has(type)) {
    const n = Number(value);
    return Number.isNaN(n) ? value : n;
  }
  return value;
}

function shapeRows(resp: BQQueryResponse): {
  columns: string[];
  rows: Record<string, string | number | null>[];
} {
  const fields = resp.schema?.fields ?? [];
  const columns = fields.map((f) => f.name);
  const rows = (resp.rows ?? []).map((row) => {
    const obj: Record<string, string | number | null> = {};
    fields.forEach((field, i) => {
      obj[field.name] = coerce(row.f?.[i]?.v ?? null, field.type);
    });
    return obj;
  });
  return { columns, rows };
}

/* ─────────────────────────────────────────
   Handler
───────────────────────────────────────── */
export async function GET() {
  try {
    /* ── Load token ── */
    let tok: TokenFile;
    try {
      tok = JSON.parse(await readFile(TOKEN_PATH, "utf-8")) as TokenFile;
    } catch {
      return NextResponse.json(
        { error: "Could not read token.json. Run oauth_setup.py first." },
        { status: 500 }
      );
    }
    if (!tok.refresh_token) {
      return NextResponse.json(
        { error: "token.json has no refresh_token. Re-run oauth_setup.py." },
        { status: 500 }
      );
    }

    /* ── Auth ── */
    const accessToken = await getAccessToken(tok);

    /* ── Dates + query ── */
    const d1 = utcDateLabel(3);
    const d2 = utcDateLabel(2);
    const d3 = utcDateLabel(1);
    const query = buildQuery(d1, d2, d3);

    /* ── Run query (synchronous jobs.query endpoint) ── */
    const queryUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${BQ_PROJECT_ID}/queries`;
    let resp = await fetch(queryUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        useLegacySql: false,
        timeoutMs: 30000,
        maxResults: 1000,
      }),
    }).then((r) => r.json() as Promise<BQQueryResponse>);

    if (resp.error) {
      return NextResponse.json(
        { error: `BigQuery error: ${resp.error.message}` },
        { status: 502 }
      );
    }

    /* ── Poll if the job didn't finish within timeoutMs ── */
    if (resp.jobComplete === false && resp.jobReference?.jobId) {
      const { jobId, location } = resp.jobReference;
      for (let attempt = 0; attempt < 10 && resp.jobComplete === false; attempt++) {
        const params = new URLSearchParams({ timeoutMs: "30000", maxResults: "1000" });
        if (location) params.set("location", location);
        resp = await fetch(
          `https://bigquery.googleapis.com/bigquery/v2/projects/${BQ_PROJECT_ID}/queries/${jobId}?${params}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ).then((r) => r.json() as Promise<BQQueryResponse>);
        if (resp.error) {
          return NextResponse.json(
            { error: `BigQuery error: ${resp.error.message}` },
            { status: 502 }
          );
        }
      }
    }

    if (resp.errors?.length) {
      return NextResponse.json(
        { error: `BigQuery query error: ${resp.errors[0].message}` },
        { status: 502 }
      );
    }

    const { columns, rows } = shapeRows(resp);

    return NextResponse.json({
      project: BQ_PROJECT_ID,
      dates: { day_minus_3: d1, day_minus_2: d2, day_minus_1: d3 },
      columns,
      row_count: rows.length,
      rows,
      generated_at: new Date().toISOString(),
      raw: resp, // full JSON output stored in the response, as requested
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[infocorner/numbers] BigQuery route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
