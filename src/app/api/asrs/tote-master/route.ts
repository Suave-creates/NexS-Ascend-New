import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

const FACILITY_PREFIX = 'NXS1-ASRS-';

function normalizeScan(input: string) {
  const base = input.split('-')[0];
  const toteId = base.slice(0, 12);
  const locationPrefix = `${FACILITY_PREFIX}${toteId}%`;

  return { toteId, locationPrefix };
}

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

    const { toteId, locationPrefix } = normalizeScan(input);

    /* =====================================================
       Acquire pooled connection + SAFE DB selection
    ====================================================== */
    conn = await nexsPool.getConnection();

    // ✅ SAFE replacement for `USE nexs_ims`
    await conn.changeUser({ database: 'nexs_ims' });

    const [rows]: any = await conn.execute(
      `
      SELECT
        pid,
        barcode,
        location
      FROM barcode_item
      WHERE location LIKE ?
      `,
      [locationPrefix]
    );

    /* =====================================================
       Parse partitions
    ====================================================== */
    const partitionMap: Record<
      string,
      { pid: number; barcode: string }[]
    > = {};

    for (const row of rows) {
      const match = row.location.match(/_PR(\d+)/);
      if (!match) continue;

      const partition = `PR${match[1]}`;

      if (!partitionMap[partition]) {
        partitionMap[partition] = [];
      }

      partitionMap[partition].push({
        pid: row.pid,
        barcode: row.barcode,
      });
    }

    return NextResponse.json(
      {
        toteId,
        partitions: partitionMap,
        rawCount: rows.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Tote Scan Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
