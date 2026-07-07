// src/app/api/order-info/tracer-pro/route.ts

import { NextResponse } from "next/server";
import type mysql from "mysql2/promise";
import { nexsPool } from "@/utils/nexsPool";

const MAX_TRAYS = 50;

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

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

function ph(arr: string[]): string {
  return arr.map(() => "?").join(", ");
}

function formatHHMM(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

    await conn.changeUser({ database: "wms" });

    const [orderRows]: any = await conn.execute(
      `
      SELECT
        location_id,
        fitting_id,
        status,
        shipping_package_id,
        MAX(updated_at) AS latest_updated_at
      FROM order_items
      WHERE location_id IN (${ph(trayIds)})
      GROUP BY location_id, fitting_id, status, shipping_package_id
      `,
      [...trayIds]
    );

    if (!orderRows.length) {
      return NextResponse.json({ rows: [] }, { status: 200 });
    }

    const nowIST = Date.now();

    const rows = orderRows.map((r: any) => {
      const updatedAtIST = new Date(r.latest_updated_at).getTime() + IST_OFFSET_MS;

      const agingMs = nowIST - updatedAtIST;

      return {
        location_id: r.location_id,
        fitting_id: r.fitting_id,
        shipping_package_id: r.shipping_package_id,
        status: r.status,
        latest_updated_at: new Date(updatedAtIST).toISOString(),
        aging: formatHHMM(agingMs),

        aged_highlight: agingMs > 3 * 60 * 60 * 1000 ? "RED" : "NONE",
      };
    });

    return NextResponse.json({ rows }, { status: 200 });
  } catch (err: unknown) {
    console.error("[Tracer Pro] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (conn) {
      try { conn.release(); } catch {}
    }
  }
}