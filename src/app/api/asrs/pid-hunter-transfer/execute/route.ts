// src/app/api/location-transfer/execute/route.ts
import prisma from '@/utils/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scan_location } = body;

    if (!scan_location || typeof scan_location !== 'string' || !scan_location.trim()) {
      return new Response(JSON.stringify({ error: 'scan_location required' }), { status: 400 });
    }

    const loc = scan_location.trim();

    // Atomic move: INSERT ... SELECT ... ON DUPLICATE KEY UPDATE, then DELETE.
    // ON DUPLICATE KEY UPDATE handles the (barcode, scan_location) unique key
    // safely if the same scan_location is transferred a second time later.
    const count = await prisma.$transaction(async (tx) => {
      const beforeCount = await tx.scannedBarcodeInventory.count({
        where: { scanLocation: loc },
      });

      if (beforeCount === 0) return 0;

      await tx.$executeRaw`
        INSERT INTO scanned_barcode_inventory_transfer
          (pid, barcode, status, \`condition\`, availability, scan_location, nexs_location, scanned_at)
        SELECT pid, barcode, status, \`condition\`, availability, scan_location, nexs_location, scanned_at
        FROM scanned_barcode_inventory
        WHERE scan_location = ${loc}
        ON DUPLICATE KEY UPDATE
          pid          = VALUES(pid),
          status       = VALUES(status),
          \`condition\`  = VALUES(\`condition\`),
          availability = VALUES(availability),
          nexs_location = VALUES(nexs_location),
          scanned_at   = VALUES(scanned_at)
      `;

      await tx.$executeRaw`
        DELETE FROM scanned_barcode_inventory WHERE scan_location = ${loc}
      `;

      return beforeCount;
    });

    return new Response(
      JSON.stringify({ scan_location: loc, count }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[location-transfer/execute]', err);
    return new Response(JSON.stringify({ error: 'Transfer failed' }), { status: 500 });
  }
}
