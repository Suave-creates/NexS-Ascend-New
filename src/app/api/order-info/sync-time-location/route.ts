// src/app/api/order-info/sync-time-location/route.ts

import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPickingPool } from '@/utils/nexsPickingPool';

/* =====================================================
   CONFIG
===================================================== */
const CHUNK_SIZE = 20;

/* =====================================================
   HELPERS
===================================================== */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

/* =====================================================
   API
===================================================== */
export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    const { shipment_ids } = body;

    if (!Array.isArray(shipment_ids) || shipment_ids.length === 0) {
      return NextResponse.json(
        { error: 'shipment_ids must be a non-empty array' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire connection from pool
    ====================================================== */
    conn = await nexsPickingPool.getConnection();

    await conn.changeUser({ database: 'picking' });

    /* =====================================================
       Chunking
    ====================================================== */
    const chunks = chunkArray(shipment_ids, CHUNK_SIZE);

    let finalResults: any[] = [];

    /* =====================================================
       Sequential Execution (Safe Default)
    ====================================================== */
    for (const chunk of chunks) {
      const placeholders = chunk.map(() => '?').join(',');

      const [rows]: any = await conn.query(
        `
        SELECT 
          increment_id,
          product_id, 
          shipment_id, 
          scm_order_created_at, 
          updated_at,
          location_barcode, 
          asrs_location_barcode, 
          item_type, 
          location_type, 
          fullfill_type, 
          facility, 
          order_state,
          jit_order,
          repick_status, 
          repick_count
        FROM picklist_order_item
        WHERE shipment_id IN (${placeholders})
        `,
        chunk
      );

      finalResults = finalResults.concat(rows);
    }

    /* =====================================================
       Response
    ====================================================== */
    return NextResponse.json({
      total: finalResults.length,
      data: finalResults,
    });

  } catch (err: any) {
    console.error('Chunked MySQL Query Error:', err);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  } finally {
    if (conn) conn.release(); // VERY IMPORTANT
  }
}