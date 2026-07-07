// src/app/api/consolidate/complete-location/route.ts
//
// ConsolidAte step 3: operator scans the LOCATION barcode of a green (COMPLETE)
// slot to release it — light OFF, slot freed, package marked ready-to-ship.
// Refuses to release a slot that is not 100% consolidated.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { locationBarcode } = await req.json();
    if (!locationBarcode) {
      return NextResponse.json({ error: 'locationBarcode required' }, { status: 400 });
    }

    const outcome = await prismaDispatch.$transaction(async (tx) => {
      const location = await tx.location.findUnique({ where: { barcode: locationBarcode } });
      if (!location) throw new Error('LOCATION_NOT_FOUND');
      if (!location.currentPackageId) throw new Error('SLOT_EMPTY');

      const pkg = location.currentPackageId;
      const pc = await tx.packageConsolidation.findUnique({ where: { shippingPackageId: pkg } });
      if (!pc) throw new Error('SLOT_EMPTY');

      if (pc.status !== 'COMPLETE') {
        const err = new Error('NOT_COMPLETE');
        (err as unknown as { info: unknown }).info = {
          expected: pc.expectedCount, accounted: pc.accountedCount,
        };
        throw err;
      }

      await tx.packageConsolidation.update({
        where: { id: pc.id },
        data: { status: 'RELEASED', releasedAt: new Date() },
      });
      await tx.location.update({
        where: { id: location.id },
        data: { lightState: 'OFF', currentPackageId: null, currentRoutingCode: null },
      });
      await tx.qcDumpEntry.updateMany({
        where: { shippingPackageId: pkg },
        data: { scanned: true, scannedAt: new Date() },
      });

      return { locationNumber: location.locationNumber, pkg };
    });

    await setLight(outcome.locationNumber, 'OFF');

    return NextResponse.json({
      success: true,
      message: 'Slot released — package ready to ship',
      shippingPackageId: outcome.pkg,
      locationNumber: outcome.locationNumber,
    });
  } catch (error: unknown) {
    const map: Record<string, number> = {
      LOCATION_NOT_FOUND: 404,
      SLOT_EMPTY: 409,
      NOT_COMPLETE: 409,
    };
    if (error instanceof Error && map[error.message]) {
      const info = (error as unknown as { info?: unknown }).info;
      return NextResponse.json(
        { error: error.message, ...(info ? { progress: info } : {}) },
        { status: map[error.message] },
      );
    }
    console.error('complete-location error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
