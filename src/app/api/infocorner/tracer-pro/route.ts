//src/app/api/infocorner/tracer-pro/route.ts

import { NextResponse } from "next/server";
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from "@/utils/resources/bigquery/client";

/* =====================================================
   Constants
===================================================== */
const SKY_BLUE_REASONS = new Set<string>([
  "SMALL SIZE CUT BY MACHINE",
  "LENS CHIPPED OFF WHILE FITTING PROCESS",
  "LENS SMALL SIZE DONE BY FITTER",
  "POP OUT",
  "LENS CHIPPED OFF WHILE MACHINING PROCESS",
  "LOOSE FITTING ISSUE",
  "WRONG SHAPE CUT BY MACHINE",
  "WRONG SHAPE DONE BY FITTER",
  "WRONG DRILLING ISSUE",
  "LENS BIG SIZE ISSUE",
  "LENS SLIP BY MACHINE",
  "LENS BROKEN IN MACHINE",
]);

type TrayRole = "PARENT" | "CHILD" | "UNKNOWN";

/* =====================================================
   Helpers
===================================================== */

/** Sanitise a single tray ID from the request body */
function sanitiseTrayId(raw: unknown): string | null {
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const s = String(raw).trim();
  return s.length > 0 && s.length <= 64 ? s : null;
}

/* =====================================================
   API Handler
===================================================== */
export async function POST(req: Request) {
  try {
    /* ─── Parse & validate body ─── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const trayId = sanitiseTrayId((body as any)?.trayId);
    if (!trayId) {
      return NextResponse.json(
        { error: "Invalid or missing trayId" },
        { status: 400 }
      );
    }

    /* ─── Acquire connection ─── */
    /* =====================================================
       1️⃣  WMS – latest order item for this tray
    ====================================================== */
    const { rows: baseRows } = await runBigQuery(
      `
      SELECT
        oi.location_id,
        oi.fitting_id,
        oi.shipping_package_id,
        oi.qc_fail_count,
        oih.order_item_type,
        DATE_DIFF(CURRENT_DATE(), DATE(oi.created_at), DAY) AS created_at_days,
        oi.created_at
      FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\` oi
      LEFT JOIN \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_item_header\` oih
        ON oih.shipping_package_id = oi.shipping_package_id
      WHERE CAST(oi.location_id AS STRING) = @tray_id
      ORDER BY oi.id DESC
      LIMIT 1
      `,
      10,
      { tray_id: trayId },
    );

    if (!baseRows.length) {
      return NextResponse.json({ error: "Tray not found" }, { status: 404 });
    }

    const current = baseRows[0];

    /* =====================================================
       2️⃣  WMS – all trays sharing the same fitting
            (single bulk query, no loop)
    ====================================================== */
    const { rows: fittingRows } = await runBigQuery(
      `
      SELECT
        location_id,
        qc_fail_count,
        created_at
      FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\`
      WHERE CAST(fitting_id AS STRING) = @fitting_id
      ORDER BY qc_fail_count ASC, created_at ASC
      `,
      10000,
      { fitting_id: String(current.fitting_id) },
    );

    let parent_tray_id: string = trayId;
    let child_tray_id: string  = trayId;
    let tray_role: TrayRole    = "PARENT";

    if (fittingRows.length > 1) {
      // Already sorted by (qc_fail_count ASC, created_at ASC) in SQL
      parent_tray_id = String(fittingRows[0].location_id);
      child_tray_id  = String(fittingRows[fittingRows.length - 1].location_id);

      if (trayId === parent_tray_id)      tray_role = "PARENT";
      else if (trayId === child_tray_id)  tray_role = "CHILD";
      else                                tray_role = "UNKNOWN";
    }

    /* =====================================================
       3️⃣  ORDERQC – reasons + fail-event count
            (two queries; no loop)
    ====================================================== */
    const [{ rows: reasonRows }, { rows: countRows }] = await Promise.all([
      runBigQuery(
        `
        SELECT TRIM(UPPER(reason_name)) AS reason_name
        FROM \`${BIGQUERY_DATA_PROJECT_ID}.orderqc.qc_status_history\`
        WHERE CAST(shipping_package_id AS STRING) = @shipping_package_id
          AND status = 'QCFailed'
        ORDER BY updated_at DESC
        `,
        10000,
        { shipping_package_id: String(current.shipping_package_id) },
      ),
      runBigQuery(
        `
        SELECT
          COUNT(DISTINCT TIMESTAMP_TRUNC(updated_at, HOUR)) AS qcf_count
        FROM \`${BIGQUERY_DATA_PROJECT_ID}.orderqc.qc_status_history\`
        WHERE CAST(shipping_package_id AS STRING) = @shipping_package_id
          AND status = 'QCFailed'
        `,
        1,
        { shipping_package_id: String(current.shipping_package_id) },
      ),
    ]);

    const qcFailedStatusCount = Number(countRows[0]?.qcf_count ?? 0);

    const reasons = (reasonRows as any[]).map((r) => ({
      text: r.reason_name as string,
      highlight: SKY_BLUE_REASONS.has(r.reason_name) ? "SKY_BLUE" : "NONE",
    }));
    const createdAtDays = Number(current.created_at_days ?? 0);

    /* =====================================================
       4️⃣  Assemble response
    ====================================================== */
    return NextResponse.json(
      {
        row: {
          parent_tray_id,
          child_tray_id,
          tray_role,

          location_id:         String(current.location_id),
          fitting_id:          current.fitting_id,
          shipping_package_id: current.shipping_package_id,
          order_item_type:     current.order_item_type ?? "N/A",

          created_at_days:       createdAtDays,
          qc_failed_status_count: qcFailedStatusCount,

          qc_failed_highlight: qcFailedStatusCount > 2 ? "RED" : "NONE",
          aged_highlight:      createdAtDays > 3 ? "RED" : "NONE",

          reasons,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[QC Tray Single] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
