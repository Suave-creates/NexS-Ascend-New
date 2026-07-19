// src/app/api/location-transfer/preview/route.ts
import prisma from '@/utils/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scan_location } = body;

    if (!scan_location || typeof scan_location !== 'string' || !scan_location.trim()) {
      return new Response(JSON.stringify({ error: 'scan_location required' }), { status: 400 });
    }

    const loc = scan_location.trim();

    const rows = await prisma.scannedBarcodeInventory.findMany({
      where: { scanLocation: loc },
      orderBy: { scannedAt: 'desc' },
    });

    return new Response(
      JSON.stringify({
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
          scanned_at: r.scannedAt,
        })),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[location-transfer/preview]', err);
    return new Response(JSON.stringify({ error: 'Failed to load records' }), { status: 500 });
  }
}