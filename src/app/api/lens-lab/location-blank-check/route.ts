// src/app/api/lens-lab/location-blank-check/route.ts

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

// ─── helpers ────────────────────────────────────────────────
async function getConnectionWithRetry(
  retries = 3,
  delayMs = 300
): Promise<mysql.PoolConnection> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await nexsPool.getConnection();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  }
  throw new Error('Unreachable');
}

// ─── route ──────────────────────────────────────────────────
export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  // ── 0. Parse + validate input ──────────────────────────────
  let locationId: string;
  let operatorId: string;

  try {
    const body = await req.json();
    locationId = body?.locationId?.toString().trim();
    operatorId = body?.operatorId?.toString().trim().toUpperCase();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (!locationId) {
    return NextResponse.json(
      { success: false, error: 'locationId required' },
      { status: 400 }
    );
  }
  if (!operatorId) {
    return NextResponse.json(
      { success: false, error: 'operatorId required' },
      { status: 400 }
    );
  }

  try {
    // ── 1. Read from WMS DB ─────────────────────────────────
    conn = await getConnectionWithRetry();
    await conn.changeUser({ database: 'wms' });

    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      `SELECT
         location_id,
         fitting_id,
         product_id,
         barcode,
         status,
         updated_at
       FROM order_items
       WHERE location_id = ?
       ORDER BY updated_at DESC
       LIMIT 2`,
      [locationId]
    );

    const rawData = rows as OrderItemRow[];

    // ── 2. Process rows ─────────────────────────────────────
    const fittingId = rawData[0]?.fitting_id
      ? String(rawData[0].fitting_id)
      : null;

    const nowIST = new Date(Date.now());

    const processed: ResultRow[] = rawData.map((row) => {
      const updatedIST = new Date(
        new Date(row.updated_at).getTime() + 5.5 * 60 * 60 * 1000
      );

      const diffMs    = nowIST.getTime() - updatedIST.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const isValid =
        row.status === 'BLANK_IN_TRAY' && diffHours <= 2;

      return {
        location_id:    row.location_id,
        product_id:     String(row.product_id),
        barcode:        row.barcode,
        updated_at_ist: updatedIST.toLocaleString('en-IN'),
        is_valid:       isValid,
      };
    });

    const allGreen =
      processed.length === 2 && processed.every((r) => r.is_valid);

    // ── 3. ALWAYS write the log (fire-and-forget) ───────────
    prismaLensLab.locationBlankCheckLog
      .create({
        data: {
          operatorId,
          fittingId,
          locationId,

          product1Id:        processed[0]?.product_id      ?? null,
          product1Barcode:   processed[0]?.barcode         ?? null,
          product1UpdatedAt: rawData[0]
            ? new Date(rawData[0].updated_at)
            : null,
          product1IsValid:   processed[0]?.is_valid        ?? null,

          product2Id:        processed[1]?.product_id      ?? null,
          product2Barcode:   processed[1]?.barcode         ?? null,
          product2UpdatedAt: rawData[1]
            ? new Date(rawData[1].updated_at)
            : null,
          product2IsValid:   processed[1]?.is_valid        ?? null,

          allGreen,
        },
      })
      .catch((e) =>
        console.error('[LocationBlankCheck] DB log failed:', e)
      );

    // ── 4. Return ───────────────────────────────────────────
    if (!rawData.length) {
      return NextResponse.json(
        {
          success:  false,
          allGreen: false,
          error:    'No order items found for this location',
          data:     [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, allGreen, data: processed },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[LocationBlankCheck] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    conn?.release();
  }
}