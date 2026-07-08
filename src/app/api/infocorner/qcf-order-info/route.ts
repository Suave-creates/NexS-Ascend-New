import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { shippingPackageId } = await req.json();

    if (!shippingPackageId || typeof shippingPackageId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing shippingPackageId' },
        { status: 400 }
      );
    }

    /* =====================================================
       Acquire pooled connection + explicit DB selection
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'orderqc' });

    const [rows]: any = await conn.execute(
      `
      SELECT 
        shipping_package_id,
        barcode,
        qc_fail_count,
        reason_name,
        status,
        updated_by,
        updated_at
      FROM qc_status_history
      WHERE shipping_package_id = ?
      ORDER BY updated_at DESC
      `,
      [shippingPackageId]
    );

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error: any) {
    console.error('QC History API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
