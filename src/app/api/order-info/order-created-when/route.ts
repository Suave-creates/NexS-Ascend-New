// src/app/api/order-info/sync-time-location/route.ts

import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

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
   Body: { increment_ids: string[] }
===================================================== */
export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    const { increment_ids } = body;

    if (!Array.isArray(increment_ids) || increment_ids.length === 0) {
      return NextResponse.json(
        { error: 'increment_ids must be a non-empty array' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire pooled connection
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    /* =====================================================
       Chunking
    ====================================================== */
    const chunks = chunkArray(increment_ids, CHUNK_SIZE);

    let finalResults: any[] = [];

    /* =====================================================
       Execute Query (Chunked)
    ====================================================== */
    for (const chunk of chunks) {
      const placeholders = chunk.map(() => '?').join(',');

      const [rows]: any = await conn.query(
        `
        SELECT 
          increment_id,
          order_created_at
        FROM orders
        WHERE increment_id IN (${placeholders})
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
    console.error('Orders Chunked Query Error:', err);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  } finally {
    if (conn) conn.release(); // critical for pool health
  }
}