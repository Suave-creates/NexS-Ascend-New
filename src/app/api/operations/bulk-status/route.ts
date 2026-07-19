import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export const runtime = 'nodejs';

type OrderItemRow = {
  product_id: string;
  barcode: string | null;
  status: string;
};

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    const { locationId, shippingPackageId: directSpid } = body;

    if (!locationId && !directSpid) {
      return NextResponse.json(
        { success: false, error: 'locationId or shippingPackageId required' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire pooled connection + explicit DB selection
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    /**
     * STEP 1: Resolve shipping_package_id
     */
    let shippingPackageId = directSpid;

    if (!shippingPackageId) {
      const [pkgRows]: any = await conn.execute(
        `
        SELECT shipping_package_id
        FROM order_items
        WHERE location_id = ?
        LIMIT 1
        `,
        [locationId]
      );

      if (!pkgRows.length) {
        return NextResponse.json(
          { success: false, error: 'No shipping package found for tray' },
          { status: 404 }
        );
      }

      shippingPackageId = pkgRows[0].shipping_package_id;
    }

    /**
     * STEP 2:
     * - Take ALL rows where status = 'Created'
     * - For each product_id, fetch latest barcode + status
     */
    const [rows]: any = await conn.execute(
      `
      SELECT
        c.product_id,
        latest.barcode,
        latest.status
      FROM (
        SELECT DISTINCT product_id
        FROM order_items_history
        WHERE shipping_package_id = ?
          AND status = 'Created'
      ) c
      LEFT JOIN (
        SELECT h1.product_id,
               h1.barcode,
               h1.status
        FROM order_items_history h1
        INNER JOIN (
          SELECT product_id, MAX(updated_at) AS max_updated_at
          FROM order_items_history
          WHERE shipping_package_id = ?
          GROUP BY product_id
        ) h2
          ON h1.product_id = h2.product_id
         AND h1.updated_at = h2.max_updated_at
        WHERE h1.shipping_package_id = ?
      ) latest
        ON c.product_id = latest.product_id
      ORDER BY c.product_id
      `,
      [shippingPackageId, shippingPackageId, shippingPackageId]
    );

    return NextResponse.json(
      {
        success: true,
        shippingPackageId,
        createdCount: rows.length,
        data: rows as OrderItemRow[],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Bulk Status API Error:', error);

    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
