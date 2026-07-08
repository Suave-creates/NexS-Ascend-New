import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export const runtime = 'nodejs';

type PurchaseOrderItemRow = {
  po_num: string;
  product_id: string;
  version: string;
  quantity: number;
  pending_quantity: number;
  vendor_unit_cost_price: number;
  created_at: string;
  updated_at: string;
};

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    const { po_nums } = body;

    if (!Array.isArray(po_nums) || po_nums.length === 0) {
      return NextResponse.json(
        { success: false, error: 'po_nums array required' },
        { status: 400 }
      );
    }

    if (po_nums.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 PO numbers allowed' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire pooled connection
    ====================================================== */
    conn = await nexsPool.getConnection();

    /** ✅ Expand placeholders safely */
    const placeholders = po_nums.map(() => '?').join(',');

    const sql = `
      SELECT
        po_num,
        product_id,
        version,
        quantity,
        pending_quantity,
        vendor_unit_cost_price,
        created_at,
        updated_at
      FROM nexs.purchase_order_item
      WHERE po_num IN (${placeholders})
      ORDER BY po_num, product_id
    `;

    const [rows] = await conn.execute(
      sql,
      po_nums
    ) as [PurchaseOrderItemRow[], any];

    /* =====================================================
       Build CSV
    ====================================================== */
    let csv =
      'po_num,product_id,version,quantity,pending_quantity,vendor_unit_cost_price,created_at,updated_at\n';

    for (const row of rows) {
      csv +=
        [
          row.po_num,
          row.product_id,
          row.version,
          row.quantity,
          row.pending_quantity,
          row.vendor_unit_cost_price,
          row.created_at,
          row.updated_at,
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
          'attachment; filename="purchase_order_items.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('PO Details CSV API Error:', error);

    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
