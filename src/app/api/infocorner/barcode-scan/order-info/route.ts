import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let parsed: any;

    try {
      parsed = rawBody ? JSON.parse(rawBody) : {};
    } catch (err) {
      console.error('[order-info] Invalid JSON body');
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { mode, payload } = parsed;

    let query = '';
    let fittingIds: string[] = [];

    if (mode === 'single') {
      const id = String(payload ?? '').trim();
      if (!id) return NextResponse.json({ rows: [] }, { status: 200 });

      query = `
        SELECT 
          FORMAT_TIMESTAMP('%Y/%m/%d %H:%M:%S', TIMESTAMP_ADD(TIMESTAMP(action_time), INTERVAL 330 MINUTE)) AS action_time,
          product_id,
          barcode,
          shipping_package_id,
          status,
          facility_code,
          fitting_id,
          parent_location,
          updated_by,
          item_type,
          qc_fail_count,
          operation,
          hold_reason
        FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items_history\`
        WHERE CAST(fitting_id AS STRING) IN UNNEST(@fitting_ids)
        ORDER BY action_time ASC
      `;
      fittingIds = [id];
    }

    else {
      let ids: string[] = [];

      if (Array.isArray(payload)) {
        ids = payload.map(String);
      } else if (typeof payload === 'string' && payload.length > 0) {
        try {
          const parsedPayload = JSON.parse(payload);
          if (Array.isArray(parsedPayload)) {
            ids = parsedPayload.map(String);
          } else {
            return NextResponse.json({ rows: [] }, { status: 200 });
          }
        } catch (err) {
          console.error('[order-info] Invalid bulk payload');
          return NextResponse.json(
            { error: 'Invalid bulk payload' },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json({ rows: [] }, { status: 200 });
      }

      ids = ids.map((s) => s.trim()).filter(Boolean);
      if (!ids.length) return NextResponse.json({ rows: [] }, { status: 200 });

      const LIMIT = 150_000;
      const CHUNK_SIZE = 350;

      if (ids.length > LIMIT) {
        return NextResponse.json(
          { error: `Too many IDs. Maximum allowed is ${LIMIT}.` },
          { status: 400 }
        );
      }

      const allRows: any[] = [];
      for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
        const chunk = ids.slice(i, i + CHUNK_SIZE);
        const chunkQuery = `
          SELECT 
            FORMAT_TIMESTAMP('%Y/%m/%d %H:%M:%S', TIMESTAMP_ADD(TIMESTAMP(action_time), INTERVAL 330 MINUTE)) AS action_time,
            product_id,
            barcode,
            shipping_package_id,
            status,
            facility_code,
            fitting_id,
            parent_location,
            updated_by,
            item_type,
            qc_fail_count,
            operation,
            hold_reason
          FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items_history\`
          WHERE CAST(fitting_id AS STRING) IN UNNEST(@fitting_ids)
          ORDER BY fitting_id, action_time ASC
        `;
        const { rows: chunkRows } = await runBigQuery(
          chunkQuery,
          10000,
          { fitting_ids: chunk },
        );
        allRows.push(...chunkRows);
      }

      return NextResponse.json({ rows: allRows });
    }

    // unreachable for bulk — kept for single path below
    const { rows } = await runBigQuery(query, 10000, { fitting_ids: fittingIds });

    return NextResponse.json({ rows });
  } catch (err: any) {
    console.error('[order-info] DB / route error:', err?.message ?? err);

    return NextResponse.json(
      { error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
