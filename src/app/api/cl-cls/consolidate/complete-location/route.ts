// src/app/api/consolidate/complete-location/route.ts
//
// ConsolidAte (non-PTL) step 3: operator scans the LOCATION barcode of a
// COMPLETE (on-screen green) slot to release it — glow off, slot freed,
// package marked ready-to-ship. Same re-verify-at-release semantics as
// ConsolidAte PTL, no physical light call.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { computeProgress, runExclusive } from '@/utils/consolidatePlatform';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { locationBarcode } = await req.json();
    if (!locationBarcode) {
      return NextResponse.json({ error: 'locationBarcode required' }, { status: 400 });
    }

    const outcome = await runExclusive(() => prismaDispatch.$transaction(async (tx) => {
      const location = await tx.consolidateLocation.findUnique({ where: { barcode: locationBarcode }, include: { rack: true } });
      if (!location) throw new Error('LOCATION_NOT_FOUND');
      if (!location.currentPackageId) throw new Error('SLOT_EMPTY');
      const pkg = location.currentPackageId;

      const pc = await tx.consolidatePackage.findUnique({ where: { shippingPackageId: pkg } });
      if (!pc) throw new Error('SLOT_EMPTY');

      // Re-verify against the live dump — do NOT trust a stale COMPLETE flag.
      const prog = await computeProgress(tx, pkg);
      if (!prog.complete) {
        const err = new Error('NOT_COMPLETE') as Error & { info?: unknown };
        err.info = { expected: prog.expected, accounted: prog.accounted };
        throw err;
      }

      const releasedAt = new Date();
      const scans = await tx.consolidatePackageScan.findMany({
        where: { shippingPackageId: pkg },
        select: { barcode: true, placed: true, operatorColor: true, scannedAt: true, placedAt: true },
        orderBy: { scannedAt: 'asc' },
      });

      await tx.consolidatePackage.update({
        where: { id: pc.id },
        data: {
          status: 'RELEASED',
          releasedAt,
          expectedCount: prog.expected,
          accountedCount: prog.accounted,
        },
      });
      await tx.consolidateLocation.update({
        where: { id: location.id },
        data: { lightState: 'OFF', currentPackageId: null },
      });
      await tx.consolidateQcDumpEntry.updateMany({
        where: { shippingPackageId: pkg },
        data: { scanned: true, scannedAt: new Date() },
      });
      // Append-only — survives this platform's own master-reset.
      await tx.consolidateReleaseHistory.create({
        data: {
          shippingPackageId: pkg,
          locationNumber: location.locationNumber,
          rackNumber: location.rack.rackNumber,
          operatorColor: pc.operatorColor,
          expectedCount: prog.expected,
          accountedCount: prog.accounted,
          barcodes: JSON.stringify(scans),
          completedAt: pc.completedAt,
          releasedAt,
        },
      });

      return { locationNumber: location.locationNumber, pkg };
    }));

    return NextResponse.json({
      success: true,
      message: 'Slot released — package ready to ship',
      shippingPackageId: outcome.pkg,
      locationNumber: outcome.locationNumber,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'NOT_COMPLETE') {
      const info = (error as Error & { info?: { expected: number; accounted: number } }).info;
      return NextResponse.json(
        { error: 'NOT_COMPLETE', progress: { expected: info?.expected, accounted: info?.accounted } },
        { status: 409 },
      );
    }
    const map: Record<string, number> = { LOCATION_NOT_FOUND: 404, SLOT_EMPTY: 409 };
    if (map[msg]) return NextResponse.json({ error: msg }, { status: map[msg] });
    console.error('consolidate complete-location error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
