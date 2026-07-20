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

    /* =====================================================
       1 - WMS: latest order item per tray
    ====================================================== */
    const { rows: orderRows } = await runBigQuery(
      `SELECT
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
       WHERE CAST(oi.location_id AS STRING) IN UNNEST(@tray_ids)
       QUALIFY ROW_NUMBER() OVER (PARTITION BY oi.location_id ORDER BY oi.id DESC) = 1`,
      10000,
      { tray_ids: trayIds },
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

    const { rows: allFittingRows } = await runBigQuery(
      `SELECT location_id, fitting_id, qc_fail_count, created_at
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\`
       WHERE CAST(fitting_id AS STRING) IN UNNEST(@fitting_ids)
       ORDER BY fitting_id ASC, qc_fail_count ASC, created_at ASC`,
      10000,
      { fitting_ids: fittingIds },
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
    const shippingIds = Array.from(new Set(
      orderRows.map((r: any) => String(r.shipping_package_id)),
    ));

    const [{ rows: qcReasonRows }, { rows: qcCountRows }] = await Promise.all([
      runBigQuery(
        `SELECT shipping_package_id, TRIM(UPPER(reason_name)) AS reason_name
         FROM \`${BIGQUERY_DATA_PROJECT_ID}.orderqc.qc_status_history\`
         WHERE CAST(shipping_package_id AS STRING) IN UNNEST(@shipping_ids)
           AND  status = 'QCFailed'
         ORDER BY updated_at DESC`,
        10000,
        { shipping_ids: shippingIds },
      ),
      runBigQuery(
        `SELECT shipping_package_id,
                COUNT(DISTINCT TIMESTAMP_TRUNC(updated_at, HOUR)) AS qcf_count
         FROM \`${BIGQUERY_DATA_PROJECT_ID}.orderqc.qc_status_history\`
         WHERE CAST(shipping_package_id AS STRING) IN UNNEST(@shipping_ids)
           AND  status = 'QCFailed'
         GROUP BY shipping_package_id`,
        10000,
        { shipping_ids: shippingIds },
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
      const createdAtDays = Number(r.created_at_days ?? 0);

      return {
        parent_tray_id: trayMeta?.parent_tray_id ?? locationId,
        child_tray_id:  trayMeta?.child_tray_id  ?? locationId,
        tray_role:      trayMeta?.tray_role       ?? "PARENT",

        location_id:         locationId,
        fitting_id:          r.fitting_id,
        shipping_package_id: r.shipping_package_id,
        order_item_type:     r.order_item_type ?? "N/A",

        created_at_days:        createdAtDays,
        qc_failed_status_count: qcFailedStatusCount,

        qc_failed_highlight: qcFailedStatusCount > 2 ? "RED" : "NONE",
        aged_highlight:      createdAtDays > 3 ? "RED" : "NONE",

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
  }
}
