// src/app/api/infocorner/sync-time-location/route.ts

import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

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
       Chunking
    ====================================================== */
    const chunks = chunkArray(increment_ids, CHUNK_SIZE);

    let finalResults: any[] = [];

    /* =====================================================
       Execute Query (Chunked)
    ====================================================== */
    for (const chunk of chunks) {
      const { rows } = await runBigQuery(
        `
        SELECT 
          increment_id,
          order_created_at
        FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.orders\`
        WHERE CAST(increment_id AS STRING) IN UNNEST(@increment_ids)
        `,
        CHUNK_SIZE,
        { increment_ids: chunk.map(String) },
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

  }
}
