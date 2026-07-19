import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { location } = await req.json();

    if (!location || typeof location !== 'string') {
      return NextResponse.json(
        { error: 'Invalid location input' },
        { status: 400 }
      );
    }

    // ⛔ Reject incomplete locations
    if (location.includes('%') || location.endsWith('-')) {
      return NextResponse.json(
        { error: 'Incomplete location not allowed' },
        { status: 400 }
      );
    }

    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'nexs_ims' });

    const [rows]: any = await conn.execute(
      `
      SELECT
        pid,
        barcode,
        location
      FROM barcode_item
      WHERE location = ?
      `,
      [location]
    );

    /* ===============================
       Group by PID (visibility map)
    ================================ */
    const pidMap: Record<
      string,
      { barcode: string; location: string }[]
    > = {};

    for (const row of rows) {
      if (!pidMap[row.pid]) pidMap[row.pid] = [];

      pidMap[row.pid].push({
        barcode: row.barcode,
        location: row.location,
      });
    }

    return NextResponse.json(
      {
        location,
        pidVisibility: pidMap,
        rawCount: rows.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Location Scan Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
