import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';

type ShippingRow = {
  shipping_id: string;
  fitting_id: string;
  leftlens_status: string | null;
  rightlens_status: string | null;
  frame_status: string | null;
  leftlens_pid: string | null;
  rightlens_pid: string | null;
  frame_pid: string | null;
};

/* ================= HELPER FUNCTIONS ================= */

function* chunkArray<T>(arr: T[], size: number): Generator<T[]> {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shipping_ids } = body;

    /* ================= VALIDATION ================= */

    if (!Array.isArray(shipping_ids) || shipping_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'shipping_ids array required' },
        { status: 400 }
      );
    }

    if (shipping_ids.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Maximum 500 shipping IDs allowed' },
        { status: 400 }
      );
    }

    const allRows: ShippingRow[] = [];
    const CHUNK_SIZE = 20;

    for (const chunk of chunkArray(shipping_ids, CHUNK_SIZE)) {
      const sql = `
        WITH latest AS (
          SELECT * EXCEPT(row_num)
          FROM (
            SELECT oih.*,
              ROW_NUMBER() OVER (
                PARTITION BY oih.shipping_package_id, oih.item_type
                ORDER BY oih.updated_at DESC
              ) AS row_num
            FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items_history\` oih
            WHERE CAST(oih.shipping_package_id AS STRING) IN UNNEST(@shipping_ids)
          )
          WHERE row_num = 1
        )
        SELECT
            oih.shipping_package_id AS shipping_id,
            MAX(oih.fitting_id) AS fitting_id,

            MAX(CASE WHEN oih.item_type = 'LEFTLENS' THEN oih.status END) AS leftlens_status,
            MAX(CASE WHEN oih.item_type = 'RIGHTLENS' THEN oih.status END) AS rightlens_status,
            MAX(CASE WHEN oih.item_type = 'FRAME' THEN oih.status END) AS frame_status,

            MAX(CASE WHEN oih.item_type = 'LEFTLENS' THEN oih.product_id END) AS leftlens_pid,
            MAX(CASE WHEN oih.item_type = 'RIGHTLENS' THEN oih.product_id END) AS rightlens_pid,
            MAX(CASE WHEN oih.item_type = 'FRAME' THEN oih.product_id END) AS frame_pid

        FROM latest oih
        GROUP BY oih.shipping_package_id
        ORDER BY oih.shipping_package_id
      `;

      const { rows: rawRows } = await runBigQuery(
        sql,
        10000,
        { shipping_ids: chunk.map(String) },
      );
      const rows = rawRows as ShippingRow[];

      allRows.push(...rows);
    }

    const rows = allRows;

    /* ================= CSV BUILD ================= */

    let csv =
      'shipping_id,fitting_id,leftlens_status,rightlens_status,frame_status,leftlens_pid,rightlens_pid,frame_pid\n';

    for (const row of rows) {
      csv += [
        row.shipping_id,
        row.fitting_id,
        row.leftlens_status,
        row.rightlens_status,
        row.frame_status,
        row.leftlens_pid,
        row.rightlens_pid,
        row.frame_pid
      ]
        .map((v) =>
          v === null || v === undefined
            ? ''
            : `"${String(v).replace(/"/g, '""')}"`
        )
        .join(',') + '\n';
    }

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition':
          'attachment; filename="shipping_details.csv"',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error: any) {
    console.error('Shipping CSV API Error:', error);

    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
