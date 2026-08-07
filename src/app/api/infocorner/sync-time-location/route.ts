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
===================================================== */
export async function POST(req: Request) {
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
       Chunking
    ====================================================== */
    const chunks = chunkArray(shipment_ids, CHUNK_SIZE);

    let finalResults: any[] = [];

    /* =====================================================
       Sequential Execution (Safe Default)
    ====================================================== */
    for (const chunk of chunks) {
      const { rows } = await runBigQuery(
        `
        SELECT 
          increment_id,
          product_id, 
          shipment_id, 
          FORMAT_DATETIME('%F %T', scm_order_created_at) AS scm_order_created_at,
          FORMAT_TIMESTAMP('%F %T', updated_at) AS updated_at,
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
        FROM \`${BIGQUERY_DATA_PROJECT_ID}.picking.picklist_order_item\`
        WHERE CAST(shipment_id AS STRING) IN UNNEST(@shipment_ids)
        `,
        10000,
        { shipment_ids: chunk.map(String) },
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
    console.error('Chunked BigQuery Error:', err);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  }
}
