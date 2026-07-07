// src/app/api/consolidate/scan-barcode/route.ts
//
// ConsolidAte step 1: operator scans an item barcode.
//   barcode -> Shipping Package ID (from the QC dump) -> that package's PTL slot
//   -> slot light GLOWS (operator colour) to guide placement.
// All barcodes of one Shipping Package ID route to the SAME slot.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLORS = new Set(['YELLOW', 'BLUE', 'GREEN', 'PINK', 'RED']);

export async function POST(req: Request) {
  try {
    const { barcode, operatorColor } = await req.json();
    if (!barcode) {
      return NextResponse.json({ error: 'barcode required' }, { status: 400 });
    }
    const color = COLORS.has(String(operatorColor).toUpperCase())
      ? String(operatorColor).toUpperCase()
      : 'YELLOW';

    // Resolve the package straight from the dump (no WMS join needed).
    const entry = await prismaDispatch.qcDumpEntry.findUnique({ where: { barcode } });
    if (!entry) {
      return NextResponse.json(
        { error: 'Barcode not found in the Order QC dump yet' },
        { status: 404 },
      );
    }
    const pkg = entry.shippingPackageId;

    const result = await prismaDispatch.$transaction(async (tx) => {
      const expected = await tx.qcDumpEntry.count({ where: { shippingPackageId: pkg } });

      let pc = await tx.packageConsolidation.findUnique({ where: { shippingPackageId: pkg } });

      // Reactivate a previously released package as a fresh consolidation.
      if (pc && pc.status === 'RELEASED') {
        await tx.consolidationScan.deleteMany({ where: { shippingPackageId: pkg } });
        pc = null;
      }

      let locationId = pc?.locationId ?? null;

      if (!locationId) {
        const free = await tx.location.findFirst({
          where: { currentPackageId: null, isActive: true },
          orderBy: { locationNumber: 'asc' },
        });
        if (!free) throw new Error('NO_SLOTS');
        locationId = free.id;
        await tx.location.update({
          where: { id: free.id },
          data: { currentPackageId: pkg, lightState: 'ON', assignmentTimestamp: new Date() },
        });
      } else {
        await tx.location.update({ where: { id: locationId }, data: { lightState: 'ON' } });
      }

      if (pc) {
        await tx.packageConsolidation.update({
          where: { id: pc.id },
          data: {
            locationId,
            operatorColor: color as never,
            status: 'CONSOLIDATING',
            expectedCount: expected,
            releasedAt: null,
            completedAt: null,
          },
        });
      } else {
        pc = await tx.packageConsolidation.create({
          data: {
            shippingPackageId: pkg,
            locationId,
            operatorColor: color as never,
            status: 'CONSOLIDATING',
            expectedCount: expected,
            accountedCount: 0,
          },
        });
      }

      // Record the scan (idempotent on re-scan).
      const existingScan = await tx.consolidationScan.findUnique({
        where: { shippingPackageId_barcode: { shippingPackageId: pkg, barcode } },
      });
      if (!existingScan) {
        await tx.consolidationScan.create({
          data: { shippingPackageId: pkg, barcode, locationId },
        });
      }

      const location = await tx.location.findUnique({
        where: { id: locationId },
        include: { rack: true },
      });
      const scannedCount = await tx.consolidationScan.count({ where: { shippingPackageId: pkg } });
      const placedCount = await tx.consolidationScan.count({
        where: { shippingPackageId: pkg, placed: true },
      });

      return {
        location, expected, scannedCount, placedCount,
        alreadyScanned: !!existingScan,
      };
    });

    // Hardware after commit.
    if (result.location) await setLight(result.location.locationNumber, color);

    return NextResponse.json({
      success: true,
      shippingPackageId: pkg,
      itemType: entry.itemType,
      location: result.location && {
        id: result.location.id,
        locationNumber: result.location.locationNumber,
        barcode: result.location.barcode,
        rackNumber: result.location.rack?.rackNumber,
        level: result.location.level,
        position: result.location.position,
      },
      expected: result.expected,
      placed: result.placedCount,
      scanned: result.scannedCount,
      alreadyScanned: result.alreadyScanned,
      color,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'NO_SLOTS') {
      return NextResponse.json({ error: 'No free PTL slots available' }, { status: 409 });
    }
    console.error('scan-barcode error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
