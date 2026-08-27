import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/mydb';
import prisma from '@/utils/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON request body' },
        { status: 400 },
      );
    }
    const mode = body?.mode === 'location' ? 'location' : 'barcode';
    const handover = body?.handover?.toString().trim().slice(0, 100);
    const value = mode === 'location'
      ? body?.scan_location?.toString().trim()
      : body?.barcode?.toString().trim().slice(-12);

    if (!handover) {
      return NextResponse.json(
        { success: false, message: 'Handover is required' },
        { status: 400 },
      );
    }

    if (!value) {
      return NextResponse.json(
        { success: false, message: mode === 'location' ? 'Scan location is required' : 'Barcode is required' },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const where = mode === 'location' ? { scanLocation: value } : { barcode: value };
      const rows = await tx.scannedBarcodeInventory.findMany({ where });
      if (!rows.length) return { count: 0, releasedToteNumbers: [] as number[] };

      const sqlFilter = mode === 'location'
        ? Prisma.sql`scan_location = ${value}`
        : Prisma.sql`barcode = ${value}`;
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO scanned_barcode_inventory_transfer
          (pid, barcode, status, \`condition\`, availability, scan_location, nexs_location,
           tote, tote_simplified, tote_number, \`partition\`, handover, scanned_at, injested_at)
        SELECT pid, barcode, status, \`condition\`, availability, scan_location, nexs_location,
          tote, tote_simplified, tote_number, \`partition\`, ${handover}, scanned_at, CURRENT_TIMESTAMP(3)
        FROM scanned_barcode_inventory
        WHERE ${sqlFilter}
        ON DUPLICATE KEY UPDATE
          pid = VALUES(pid),
          status = VALUES(status),
          \`condition\` = VALUES(\`condition\`),
          availability = VALUES(availability),
          nexs_location = VALUES(nexs_location),
          tote = VALUES(tote),
          tote_simplified = VALUES(tote_simplified),
          tote_number = VALUES(tote_number),
          \`partition\` = VALUES(\`partition\`),
          handover = VALUES(handover),
          scanned_at = VALUES(scanned_at),
          injested_at = CURRENT_TIMESTAMP(3)
      `);

      await tx.pidHunterScan.createMany({
        data: rows.map((row) => ({
          pid: row.pid,
          barcode: row.barcode,
          status: row.status,
          condition: row.condition,
          availability: row.availability,
          nexsLocation: row.nexsLocation,
          currentLocation: row.scanLocation,
          toteId: row.toteId,
          toteNumber: row.toteNumber,
          partition: row.partition,
          bucket: 'STOCK_OUT',
          binName: 'STOCK OUT',
          mode: 'STOCK_OUT',
          rawScan: value,
        })),
      });

      await tx.scannedBarcodeInventory.deleteMany({ where });

      const affectedToteNumbers = [...new Set(rows
        .map((row) => row.toteNumber)
        .filter((number): number is number => number != null))];
      let releasedToteNumbers: number[] = [];
      if (affectedToteNumbers.length) {
        const occupied = await tx.$queryRaw<Array<{ toteNumber: number }>>(Prisma.sql`
          SELECT DISTINCT tote_number AS toteNumber
          FROM (
            SELECT tote_number, bucket,
              ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
            FROM pid_hunter_scans
          ) latest
          WHERE row_num = 1 AND bucket = 'GOOD'
            AND tote_number IN (${Prisma.join(affectedToteNumbers)})
        `);
        const occupiedNumbers = new Set(occupied.map((row) => row.toteNumber));
        releasedToteNumbers = affectedToteNumbers.filter((number) => !occupiedNumbers.has(number));
        if (releasedToteNumbers.length) {
          await tx.pidHunterTote.deleteMany({ where: { toteNumber: { in: releasedToteNumbers } } });
        }
      }

      return { count: rows.length, releasedToteNumbers };
    }, { maxWait: 30_000, timeout: 60_000 });

    return NextResponse.json({
      success: true,
      message: 'Stock-out completed and archived for handover',
      deletedCount: result.count,
      archivedCount: result.count,
      releasedToteNumbers: result.releasedToteNumbers,
      mode,
      value,
      handover,
    });
  } catch (error) {
    console.error('Stock-out error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
