// src/app/api/location-transfer/preview/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { authMiddleware } from '@/middleware/auth';

export const POST = authMiddleware(async (req: Request) => {
  try {
    const body = await req.json();
    const { scan_location } = body;

    if (!scan_location || typeof scan_location !== 'string' || !scan_location.trim()) {
      return NextResponse.json({ error: 'scan_location required' }, { status: 400 });
    }

    const loc = scan_location.trim();

    const rows = await prisma.scannedBarcodeInventory.findMany({
      where: { scanLocation: loc },
      orderBy: { scannedAt: 'desc' },
    });

    return NextResponse.json(
      {
        scan_location: loc,
        count: rows.length,
        records: rows.map((r) => ({
          id: Number(r.id),
          pid: r.pid,
          barcode: r.barcode,
          status: r.status,
          condition: r.condition,
          availability: r.availability,
          scan_location: r.scanLocation,
          nexs_location: r.nexsLocation,
          scanned_at: r.scannedAt,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[location-transfer/preview]', err);
    return NextResponse.json({ error: 'Failed to load records' }, { status: 500 });
  }
});
