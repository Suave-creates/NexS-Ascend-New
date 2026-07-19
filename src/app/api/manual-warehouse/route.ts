import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

const PACKING_REGEX = /^CT\d{5}$/;

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { scanId, nexsId } = await req.json();

    if (!PACKING_REGEX.test(scanId)) {
      return NextResponse.json(
        { error: 'Invalid Tray Scan ID format.' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire pooled connection + explicit DB selection
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    /* =====================================================
       Fetch fitting_id
    ====================================================== */
    const [rows]: any = await conn.execute(
      `
      SELECT fitting_id
      FROM order_items
      WHERE location_id = ?
      LIMIT 1
      `,
      [scanId]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Fitting ID not found for tray.' },
        { status: 404 }
      );
    }

    const fittingId = String(rows[0].fitting_id);

    /* =====================================================
       IST timestamp
    ====================================================== */
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    /* =====================================================
       IMPORTANT: fittingId stored in stationId column
    ====================================================== */
    await prisma.manualWarehouse.create({
      data: {
        scanId,
        stationId: fittingId, // intentional reuse
        nexsId,
        timestamp: istNow,
      },
    });

    const meta = await prisma.shippingMetadata.findUnique({
      where: { shippingID: scanId },
    });

    return NextResponse.json({
      success: true,
      city: meta?.city?.toUpperCase() ?? null,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
