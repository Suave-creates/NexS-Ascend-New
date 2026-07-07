import { NextResponse } from "next/server";
import type mysql from "mysql2/promise";
import { nexsPool } from "@/utils/nexsPool";

interface PkgRow {
  shipment_id: string;
  shipping_package_id: string;
  shipment_creation_date: string;
}

interface ScoreRow {
  shipment_id: string;
  product_id: string;
  inventory_count: number;
  facility?: string;
}

interface ResultRow {
  shipping_package_id: string;
  shipment_creation_date: string | null;
  shipment_id: string | null;
  product_id: string | null;
  inventory_count: number | null;
  facility: string | null;
  status: "ok" | "messed_up";
  error?: string;
}

function sanitizeId(id: unknown): string | null {
  if (typeof id !== "string") return null;
  const trimmed = id.trim();
  if (trimmed.length === 0 || trimmed.length > 64) return null;
  if (!/^[A-Za-z0-9_\-]+$/.test(trimmed)) return null;
  return trimmed;
}

export async function POST(req: Request) {
  /* ───────── Parse & validate body ───────── */
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawIds: unknown =
    (body as Record<string, unknown>)?.shipping_package_ids;

  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return NextResponse.json(
      { error: "shipping_package_ids must be a non-empty array" },
      { status: 400 }
    );
  }

  if (rawIds.length > 200) {
    return NextResponse.json(
      { error: "Maximum 200 IDs per request" },
      { status: 400 }
    );
  }

  const packageIds: string[] = [];
  const invalidIds: string[] = [];

  for (const raw of rawIds) {
    const clean = sanitizeId(raw);
    if (clean) {
      packageIds.push(clean);
    } else {
      invalidIds.push(String(raw).slice(0, 80));
    }
  }

  if (packageIds.length === 0) {
    return NextResponse.json(
      { error: "No valid shipping_package_ids provided", invalidIds },
      { status: 400 }
    );
  }

  /* ───────── Process each ID independently ───────── */
  const results: ResultRow[] = [];

  const MESSED_UP: ResultRow["status"] = "messed_up";
  const OK: ResultRow["status"] = "ok";

  for (const pkgId of packageIds) {
    let conn: mysql.PoolConnection | null = null;

    try {
      conn = await nexsPool.getConnection();

      /* ── Step 1: WMS lookup ── */
      await conn.changeUser({ database: "wms" });

      const [pkgRows] = await conn.execute<mysql.RowDataPacket[]>(
        `
        SELECT
            o.wms_order_code        AS shipment_id,
            o.shipping_package_id,
            MIN(o.created_at)       AS shipment_creation_date
        FROM order_items o
        WHERE o.shipping_package_id = ?
        GROUP BY o.wms_order_code, o.shipping_package_id
        LIMIT 1
        `,
        [pkgId]
      );

      if (!pkgRows.length) {
        results.push({
          shipping_package_id: pkgId,
          shipment_creation_date: null,
          shipment_id: null,
          product_id: null,
          inventory_count: null,
          facility: null,
          status: MESSED_UP,
          error: "No WMS record found",
        });
        continue;
      }

      const pkg = pkgRows[0] as PkgRow;
      const shipmentId = pkg.shipment_id;

      /* ── Step 2: Score lookup from both NXS1 and NXS2 ── */
      await conn.changeUser({ database: "optimadb" });

      const [nxs1Rows] = await conn.execute<mysql.RowDataPacket[]>(
        `
        SELECT
            shipment_id,
            product_id,
            inventory_count
        FROM shipment_item_score_details
        WHERE facility = 'NXS1'
          AND shipment_id = ?
        `,
        [shipmentId]
      );

      const [nxs2Rows] = await conn.execute<mysql.RowDataPacket[]>(
        `
        SELECT
            shipment_id,
            product_id,
            inventory_count
        FROM shipment_item_score_details
        WHERE facility = 'NXS2'
          AND shipment_id = ?
        `,
        [shipmentId]
      );

      const allScoreRows: (ScoreRow & { facility: string })[] = [
        ...(nxs1Rows as ScoreRow[]).map(row => ({ ...row, facility: 'NXS1' })),
        ...(nxs2Rows as ScoreRow[]).map(row => ({ ...row, facility: 'NXS2' }))
      ];

      if (!allScoreRows.length) {
        results.push({
          shipping_package_id: pkg.shipping_package_id,
          shipment_creation_date: pkg.shipment_creation_date,
          shipment_id: shipmentId,
          product_id: null,
          inventory_count: null,
          facility: null,
          status: MESSED_UP,
          error: "No score record found in optimadb (NXS1 or NXS2)",
        });
        continue;
      }

      /* ── Step 3: Merge ── */
      for (const score of allScoreRows as (ScoreRow & { facility: string })[]) {
        results.push({
          shipping_package_id: pkg.shipping_package_id,
          shipment_creation_date: pkg.shipment_creation_date,
          shipment_id: score.shipment_id,
          product_id: score.product_id,
          inventory_count: score.inventory_count,
          facility: score.facility,
          status: OK,
        });
      }
    } catch (err) {
      console.error(`Shipment Score API error for ID [${pkgId}]:`, err);
      results.push({
        shipping_package_id: pkgId,
        shipment_creation_date: null,
        shipment_id: null,
        product_id: null,
        inventory_count: null,
        facility: null,
        status: MESSED_UP,
        error: "DB query failed",
      });
    } finally {
      if (conn) {
        try {
          conn.release();
        } catch {
          /* ignore release errors */
        }
      }
    }
  }

  const okCount = results.filter((r) => r.status === "ok").length;
  const messedCount = results.filter((r) => r.status === "messed_up").length;

  return NextResponse.json(
    {
      count: results.length,
      ok_count: okCount,
      messed_up_count: messedCount,
      invalid_ids: invalidIds,
      rows: results,
    },
    { status: 200 }
  );
}