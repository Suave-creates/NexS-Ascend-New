// src/app/api/lens-lab/lab-out-check/route.ts

import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';
import { prismaLensLab } from '@/utils/prismaLensLab';

export const runtime = 'nodejs';

type OrderItemRow = {
  location_id: string;
  fitting_id: number | null;
  product_id: number;
  barcode: string | null;
  status: string;
  updated_at: string;
};

type ResultRow = {
  location_id: string;
  product_id: string;
  barcode: string | null;
  updated_at_ist: string;
  is_valid: boolean;
};

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { locationId, operatorId } = await req.json();

    if (!locationId || typeof locationId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'locationId required' },
        { status: 400 }
      );
    }

    if (!operatorId || typeof operatorId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'operatorId required' },
        { status: 400 }
      );
    }

    /* =====================================================
       1️⃣ Read from nexsPool (wms DB) — READ ONLY
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    const [rows]: any = await conn.execute(
      `
      SELECT
        location_id,
        fitting_id,
        product_id,
        barcode,
        status,
        updated_at
      FROM order_items
      WHERE location_id = ?
      ORDER BY updated_at DESC
      `,
      [locationId]
    );

    const rawData = rows as OrderItemRow[];

    if (!rawData.length) {
      return NextResponse.json(
        { success: false, error: 'No data found for this location' },
        { status: 404 }
      );
    }

    const latestTwo = rawData.slice(0, 2);

    /* =====================================================
       2️⃣ Stringify IDs (MySQL returns Int, Prisma expects String)
    ====================================================== */
    const fittingId = latestTwo[0]?.fitting_id
      ? String(latestTwo[0].fitting_id)
      : null;

    /* =====================================================
       3️⃣ Process rows — validity check
    ====================================================== */
    const nowIST = new Date(Date.now());

    const processed: ResultRow[] = latestTwo.map((row) => {
      const updatedIST = new Date(
        new Date(row.updated_at).getTime() + 5.5 * 60 * 60 * 1000
      );

      const diffMs = nowIST.getTime() - updatedIST.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const isValid =
        row.status === 'IN_TRAY' && diffHours <= 4;

      return {
        location_id: row.location_id,
        product_id:  String(row.product_id), // stringify
        barcode:     row.barcode,
        updated_at_ist: updatedIST.toLocaleString('en-IN'),
        is_valid: isValid,
      };
    });

    const allGreen =
      processed.length === 2 && processed.every((r) => r.is_valid);

    /* =====================================================
       4️⃣ Log ALL scans to lens_lab DB (write only)
    ====================================================== */
    await prismaLensLab.labOutCheckLogs.create({
      data: {
        operatorId:        operatorId.trim().toUpperCase(),
        fittingId,
        locationId,

        product1Id:        processed[0]?.product_id        ?? null,
        product1Barcode:   processed[0]?.barcode           ?? null,
        product1UpdatedAt: latestTwo[0]
          ? new Date(latestTwo[0].updated_at)
          : null,
        product1IsValid:   processed[0]?.is_valid          ?? null,

        product2Id:        processed[1]?.product_id        ?? null,
        product2Barcode:   processed[1]?.barcode           ?? null,
        product2UpdatedAt: latestTwo[1]
          ? new Date(latestTwo[1].updated_at)
          : null,
        product2IsValid:   processed[1]?.is_valid          ?? null,

        allGreen,
      },
    });

    /* =====================================================
       5️⃣ Return response
    ====================================================== */
    return NextResponse.json(
      {
        success: true,
        allGreen,
        data: processed,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Lab Out Check API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}