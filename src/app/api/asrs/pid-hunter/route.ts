//src/app/api/order-info/pid-hunter/route.ts

import { nexsPool } from '@/utils/nexsPool';
import prisma from '@/utils/prisma';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    const { barcode, scan_location } = body;

    if (!barcode) {
      return new Response(JSON.stringify({ error: 'barcode required' }), { status: 400 });
    }

    if (!scan_location) {
      return new Response(JSON.stringify({ error: 'scan_location required' }), { status: 400 });
    }

    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'nexs_ims' });

    // ===== READ =====
    const [rows]: any = await conn.execute(
      `
      SELECT 
        pid,
        barcode,
        status,
        \`condition\`,
        availability
      FROM barcode_item
      WHERE barcode = ?
      LIMIT 1
      `,
      [barcode]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Barcode not found' }), { status: 404 });
    }

    const r = rows[0];

    // ===== CHECK FOR DUPLICATE =====
    const existing = await prisma.scannedBarcodeInventory.findFirst({
      where: {
        barcode: r.barcode,
        scanLocation: scan_location,
      },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Duplicate: Barcode already scanned at this location' }),
        { status: 409 }
      );
    }

    // ===== WRITE =====
    await prisma.scannedBarcodeInventory.create({
      data: {
        pid: String(r.pid),
        barcode: r.barcode,
        status: r.status,
        condition: r.condition,
        availability: r.availability,
        scanLocation: scan_location,
      },
    });

    // ===== RESPONSE =====
    return new Response(
      JSON.stringify({
        pid: r.pid,
        barcode: r.barcode,
        status: r.status,
        condition: r.condition,
        availability: r.availability,
        scan_location,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Processing failed' }), { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}