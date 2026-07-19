import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const { pid: input } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'PID is required.' },
        { status: 400 }
      );
    }

    // Normalize input
    let pid = input.trim().toUpperCase();

    /* =====================================
       Barcode → PID resolution
       (only if length > 9)
    ====================================== */
    if (pid.length > 9) {
      conn = await nexsPool.getConnection();

      // ✅ SAFE DB selection
      await conn.changeUser({ database: 'nexs_ims' });

      const [rows]: any = await conn.execute(
        `
        SELECT pid
        FROM barcode_item
        WHERE barcode = ?
        LIMIT 1
        `,
        [pid]
      );

      if (!rows || rows.length === 0 || rows[0].pid == null) {
        return NextResponse.json(
          { error: 'PID not found for barcode.' },
          { status: 404 }
        );
      }

      // 🔧 Force PID to string
      pid = String(rows[0].pid);
    }

    /* =====================================
       Manual Warehouse lookup (Prisma)
    ====================================== */
    const record = await prisma.manualWarehouseSetUp.findUnique({
      where: { pid },
      select: {
        pid: true,
        location: true,
        package: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'PID not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error('PID lookup error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
