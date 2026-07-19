import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    let { pid, pids, download } = body;

    /* ================= NORMALIZE INPUT ================= */

    if (pid && typeof pid === 'string') {
      pids = [pid];
    }

    if (!Array.isArray(pids) || pids.length === 0) {
      return NextResponse.json(
        { error: 'Provide pid or pids[]' },
        { status: 400 }
      );
    }

    if (pids.length > 50) {
      return NextResponse.json(
        { error: 'Max 50 PIDs allowed' },
        { status: 400 }
      );
    }

    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'nexs_ims' });

    const placeholders = pids.map(() => '?').join(',');

    const [rows]: any = await conn.execute(
      `
      SELECT 
        pid,
        location,
        barcode
      FROM barcode_item
      WHERE pid IN (${placeholders})
        AND facility = 'NXS1'
        AND \`condition\` = 'GOOD'
        AND status = 'AVAILABLE'
        AND availability = 'AVAILABLE'
        AND location_type <> 'RESERVED'
      ORDER BY pid, location
      `,
      pids
    );

    /* ================= CSV MODE ================= */

    if (download) {
      let csv = 'pid,location,barcode\n';

      for (const r of rows) {
        csv += [r.pid, r.location, r.barcode]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(',') + '\n';
      }

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="inventory.csv"',
        },
      });
    }

    /* ================= JSON ================= */

    return NextResponse.json({
      rows,
      totalRows: rows.length,
    });

  } catch (error) {
    console.error('Inventory API Error:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}