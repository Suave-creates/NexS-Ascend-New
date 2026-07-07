//src/app/api/order-info/tracer-pro/route.ts

import { NextResponse } from "next/server";
import type mysql from "mysql2/promise";
import { nexsPool } from "@/utils/nexsPool";

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
  let conn: mysql.PoolConnection | null = null;

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
    conn = await nexsPool.getConnection();

    /* =====================================================
       1️⃣  WMS – latest order item for this tray
    ====================================================== */
    await conn.changeUser({ database: "wms" });

    const [baseRows]: any = await conn.execute(
      `
      SELECT
        oi.location_id,
        oi.fitting_id,
        oi.shipping_package_id,
        oi.qc_fail_count,
        oih.order_item_type,
        DATEDIFF(CURDATE(), DATE(oi.created_at)) AS created_at_days,
        oi.created_at
      FROM order_items oi
      LEFT JOIN order_item_header oih
        ON oih.shipping_package_id = oi.shipping_package_id
      WHERE oi.location_id = ?
      ORDER BY oi.id DESC
      LIMIT 1
      `,
      [trayId]
    );

    if (!baseRows.length) {
      return NextResponse.json({ error: "Tray not found" }, { status: 404 });
    }

    const current = baseRows[0];

    /* =====================================================
       2️⃣  WMS – all trays sharing the same fitting
            (single bulk query, no loop)
    ====================================================== */
    const [fittingRows]: any = await conn.execute(
      `
      SELECT
        location_id,
        qc_fail_count,
        created_at
      FROM order_items
      WHERE fitting_id = ?
      ORDER BY qc_fail_count ASC, created_at ASC
      `,
      [current.fitting_id]
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
    await conn.changeUser({ database: "orderqc" });

    const [[reasonRows], [countRows]]: any = await Promise.all([
      conn.execute(
        `
        SELECT TRIM(UPPER(reason_name)) AS reason_name
        FROM qc_status_history
        WHERE shipping_package_id = ?
          AND status = 'QCFailed'
        ORDER BY updated_at DESC
        `,
        [current.shipping_package_id]
      ),
      conn.execute(
        `
        SELECT
          COUNT(DISTINCT DATE(updated_at), HOUR(updated_at)) AS qcf_count
        FROM qc_status_history
        WHERE shipping_package_id = ?
          AND status = 'QCFailed'
        `,
        [current.shipping_package_id]
      ),
    ]);

    const qcFailedStatusCount = Number(countRows[0]?.qcf_count ?? 0);

    const reasons = (reasonRows as any[]).map((r) => ({
      text: r.reason_name as string,
      highlight: SKY_BLUE_REASONS.has(r.reason_name) ? "SKY_BLUE" : "NONE",
    }));

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

          created_at_days:       current.created_at_days ?? 0,
          qc_failed_status_count: qcFailedStatusCount,

          qc_failed_highlight: qcFailedStatusCount > 2 ? "RED" : "NONE",
          aged_highlight:      (current.created_at_days ?? 0) > 3 ? "RED" : "NONE",

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
  } finally {
    if (conn) {
      try { conn.release(); } catch { /* ignore */ }
    }
  }
}