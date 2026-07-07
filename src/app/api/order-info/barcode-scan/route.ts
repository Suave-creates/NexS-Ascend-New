import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid scan input' },
        { status: 400 }
      );
    }

    // Extract barcode → RIGHT(text, 12)
    const barcode = input.slice(-12);

    /* =====================================================
       Acquire pooled connection + explicit DB selection
    ====================================================== */
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'nexs_ims' });

    const [rows]: any = await conn.execute(
      `
      SELECT
        barcode,
        pid,
        location,
        TRIM(UPPER(\`condition\`)) AS \`condition\`,
        TRIM(UPPER(status))       AS status,
        TRIM(UPPER(availability)) AS availability
      FROM barcode_item
      WHERE barcode = ?
      LIMIT 1
      `,
      [barcode]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Barcode not found' },
        { status: 404 }
      );
    }

    const record = rows[0];

    // ✅ ONLY ONE GREEN PATH
    const isGood =
      record.condition === 'GOOD' &&
      record.status === 'AVAILABLE' &&
      record.availability === 'AVAILABLE';

    return NextResponse.json(
      {
        row: {
          barcode: record.barcode,
          pid: record.pid,
          location: record.location,
          condition: record.condition,
          status: record.status,
          availability: record.availability,
          status_color: isGood ? 'GREEN' : 'RED',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Barcode Scan API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
