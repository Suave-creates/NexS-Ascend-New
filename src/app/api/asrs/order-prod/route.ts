//src/app/api/asrs/order-prod/route.ts

import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';
import prisma from '@/utils/prisma';

/* ===============================
   Helper: extract barcode
================================ */
function normalizeSerial(value: string): string {
  try {
    if (value.includes('barcode=')) {
      const url = new URL(value);
      return url.searchParams.get('barcode') || value;
    }
    return value;
  } catch {
    return value;
  }
}

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { trayId } = await req.json();

    if (!trayId || typeof trayId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing trayId' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire pooled connection + explicit DB selection
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    /* =====================================================
       1️⃣ Resolve tray → fitting_id
    ====================================================== */
    const [fitRows]: any = await conn.execute(
      `
      SELECT
        location_id AS tray_id,
        fitting_id
      FROM order_items
      WHERE location_id = ?
      ORDER BY qc_fail_count DESC
      LIMIT 1
      `,
      [trayId]
    );

    if (!fitRows.length) {
      return NextResponse.json(
        { error: 'No fitting found for tray' },
        { status: 404 }
      );
    }

    const { tray_id, fitting_id } = fitRows[0];

    /* =====================================================
       2️⃣ Fetch latest PIDs
    ====================================================== */
    const [pidRows]: any = await conn.execute(
      `
      SELECT
        MAX(CASE WHEN item_type = 'LEFTLENS'  THEN product_id END) AS leftlens_pid,
        MAX(CASE WHEN item_type = 'RIGHTLENS' THEN product_id END) AS rightlens_pid,
        MAX(CASE WHEN item_type = 'FRAME'     THEN product_id END) AS frame_pid
      FROM order_items_history oih
      WHERE fitting_id = ?
        AND updated_at = (
          SELECT MAX(i.updated_at)
          FROM order_items_history i
          WHERE i.fitting_id = oih.fitting_id
            AND i.item_type  = oih.item_type
        )
      `,
      [fitting_id]
    );

    const pidData = pidRows[0] || {};

    /* =====================================================
       3️⃣ Fetch order dashboard data (Prisma)
    ====================================================== */
    const orderRows = await prisma.orderUpdateDashboardStudy.findMany({
      where: { fittingId: String(fitting_id) },
      select: {
        updatedFittingId: true,
        orderStatus: true,
        category: true,
        orderItemStatus: true,
        serialNo: true,
      },
    });

    /* =====================================================
       4️⃣ Collapse + Serial override
    ====================================================== */
    const orderMap: Record<string, string | null> = {};
    let updatedFittingId: string | null = null;
    let orderStatus: string | null = null;

    for (const r of orderRows) {
      updatedFittingId = r.updatedFittingId;
      orderStatus = r.orderStatus;

      if (!r.category) continue;

      orderMap[r.category] = r.serialNo
        ? normalizeSerial(String(r.serialNo))
        : r.orderItemStatus;
    }

    /* =====================================================
       5️⃣ Final response
    ====================================================== */
    return NextResponse.json(
      {
        row: {
          tray_id,
          fitting_id,
          updated_fitting_id: updatedFittingId,
          order_status: orderStatus,

          leftlens_pid: pidData.leftlens_pid || null,
          rightlens_pid: pidData.rightlens_pid || null,
          frame_pid: pidData.frame_pid || null,

          leftlens_order_item_status: orderMap.LEFTLENS || null,
          rightlens_order_item_status: orderMap.RIGHTLENS || null,
          frame_order_item_status: orderMap.FRAME || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('ASRS order prod:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
