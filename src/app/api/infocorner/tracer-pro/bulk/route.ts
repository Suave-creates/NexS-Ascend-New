//src/app/api/infocorner/tracer-pro/route.ts

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

const MAX_TRAYS = 50;

type TrayRole = "PARENT" | "CHILD";

type TrayMeta = {
  parent_tray_id: string;
  child_tray_id:  string;
  tray_role:      TrayRole;
};

/* =====================================================
   Helpers
===================================================== */

function sanitiseTrayIds(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const ids: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string" && typeof item !== "number") continue;
    const s = String(item).trim();
    if (s.length > 0 && s.length <= 64) ids.push(s);
  }
  const unique = Array.from(new Set(ids));
  return unique.length === 0 ? null : unique;
}

/**
 * Build a comma-separated list of ? placeholders.
 * Use instead of passing an array to IN (?) which causes
 * ER_NOT_SUPPORTED_YET on older MySQL versions.
 *
 * Usage:
 *   WHERE col IN (${ph(arr)})
 *   params: [...arr]
 */
function ph(arr: string[]): string {
  return arr.map(() => "?").join(", ");
}

function resolveFittingGroup(trayRows: any[], out: Map<string, TrayMeta>): void {
  if (trayRows.length === 0) return;

  if (trayRows.length === 1) {
    const id = String(trayRows[0].location_id);
    out.set(id, { parent_tray_id: id, child_tray_id: id, tray_role: "PARENT" });
    return;
  }

  const parent_tray_id = String(trayRows[0].location_id);
  const child_tray_id  = String(trayRows[trayRows.length - 1].location_id);

  for (const tray of trayRows) {
    const id = String(tray.location_id);
    out.set(id, {
      parent_tray_id,
      child_tray_id,
      tray_role: id === parent_tray_id ? "PARENT" : "CHILD",
    });
  }
}

/* =====================================================
   API Handler
===================================================== */
export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const trayIds = sanitiseTrayIds((body as any)?.trayIds);

    if (!trayIds) {
      return NextResponse.json(
        { error: "trayIds must be a non-empty array of strings" },
        { status: 400 }
      );
    }

    if (trayIds.length > MAX_TRAYS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_TRAYS} trays allowed per request` },
        { status: 400 }
      );
    }

    conn = await nexsPool.getConnection();

    /* =====================================================
       1 - WMS: latest order item per tray
    ====================================================== */
    await conn.changeUser({ database: "wms" });

    const [orderRows]: any = await conn.execute(
      `SELECT
         oi.location_id,
         oi.fitting_id,
         oi.shipping_package_id,
         oi.qc_fail_count,
         oih.order_item_type,
         DATEDIFF(CURDATE(), DATE(oi.created_at)) AS created_at_days,
         oi.created_at
       FROM order_items oi
       INNER JOIN (
         SELECT location_id, MAX(id) AS latest_id
         FROM   order_items
         WHERE  location_id IN (${ph(trayIds)})
         GROUP BY location_id
       ) latest ON latest.latest_id = oi.id
       LEFT JOIN order_item_header oih
         ON oih.shipping_package_id = oi.shipping_package_id`,
      [...trayIds]
    );

    if (!orderRows.length) {
      return NextResponse.json({ rows: [] }, { status: 200 });
    }

    /* =====================================================
       2 - WMS: all fitting siblings (one bulk query)
    ====================================================== */
    const fittingIds: string[] = Array.from(
      new Set(orderRows.map((r: any) => String(r.fitting_id)))
    );

    const [allFittingRows]: any = await conn.execute(
      `SELECT location_id, fitting_id, qc_fail_count, created_at
       FROM   order_items
       WHERE  fitting_id IN (${ph(fittingIds)})
       ORDER BY fitting_id ASC, qc_fail_count ASC, created_at ASC`,
      [...fittingIds]
    );

    const fittingGroupMap = new Map<string, any[]>();
    for (const row of allFittingRows) {
      const key = String(row.fitting_id);
      if (!fittingGroupMap.has(key)) fittingGroupMap.set(key, []);
      fittingGroupMap.get(key)!.push(row);
    }

    const trayMetaMap = new Map<string, TrayMeta>();
    for (const [, group] of fittingGroupMap) {
      resolveFittingGroup(group, trayMetaMap);
    }

    /* =====================================================
       3 - ORDERQC: reasons + fail-event counts (parallel)
    ====================================================== */
    const shippingIds: string[] = orderRows.map((r: any) => r.shipping_package_id);

    await conn.changeUser({ database: "orderqc" });

    const [[qcReasonRows], [qcCountRows]]: any = await Promise.all([
      conn.execute(
        `SELECT shipping_package_id, TRIM(UPPER(reason_name)) AS reason_name
         FROM   qc_status_history
         WHERE  shipping_package_id IN (${ph(shippingIds)})
           AND  status = 'QCFailed'
         ORDER BY updated_at DESC`,
        [...shippingIds]
      ),
      conn.execute(
        `SELECT shipping_package_id,
                COUNT(DISTINCT DATE(updated_at), HOUR(updated_at)) AS qcf_count
         FROM   qc_status_history
         WHERE  shipping_package_id IN (${ph(shippingIds)})
           AND  status = 'QCFailed'
         GROUP BY shipping_package_id`,
        [...shippingIds]
      ),
    ]);

    const qcReasonMap = new Map<string, string[]>();
    for (const row of qcReasonRows as any[]) {
      const key = row.shipping_package_id;
      if (!qcReasonMap.has(key)) qcReasonMap.set(key, []);
      qcReasonMap.get(key)!.push(row.reason_name as string);
    }

    const qcCountMap = new Map<string, number>();
    for (const row of qcCountRows as any[]) {
      qcCountMap.set(row.shipping_package_id, Number(row.qcf_count));
    }

    /* =====================================================
       4 - Assemble response (pure JS, zero DB calls)
    ====================================================== */
    const rows = orderRows.map((r: any) => {
      const locationId          = String(r.location_id);
      const trayMeta            = trayMetaMap.get(locationId);
      const reasons             = qcReasonMap.get(r.shipping_package_id) ?? [];
      const qcFailedStatusCount = qcCountMap.get(r.shipping_package_id) ?? 0;

      return {
        parent_tray_id: trayMeta?.parent_tray_id ?? locationId,
        child_tray_id:  trayMeta?.child_tray_id  ?? locationId,
        tray_role:      trayMeta?.tray_role       ?? "PARENT",

        location_id:         locationId,
        fitting_id:          r.fitting_id,
        shipping_package_id: r.shipping_package_id,
        order_item_type:     r.order_item_type ?? "N/A",

        created_at_days:        r.created_at_days ?? 0,
        qc_failed_status_count: qcFailedStatusCount,

        qc_failed_highlight: qcFailedStatusCount > 2 ? "RED" : "NONE",
        aged_highlight:      (r.created_at_days ?? 0) > 3 ? "RED" : "NONE",

        reasons: reasons.map((reason) => ({
          text:      reason,
          highlight: SKY_BLUE_REASONS.has(reason) ? "SKY_BLUE" : "NONE",
        })),
      };
    });

    return NextResponse.json({ rows }, { status: 200 });
  } catch (err: unknown) {
    console.error("[QC Tray Bulk] Unhandled error:", err);
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