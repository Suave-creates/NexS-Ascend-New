// src/app/api/consolidate/complete-location/route.ts
//
// ConsolidAte step 3: operator scans the LOCATION barcode of a green (COMPLETE)
// slot to release it — light OFF, slot freed, package marked ready-to-ship.
//
// Completeness is RE-VERIFIED against the current dump at release time (never
// trusts the stored status flag): if the package gained an expected barcode
// after it went green, release is refused (NOT_COMPLETE) and the operator picks
// the missing item(s). Serialised with the same in-process mutex as scan-barcode.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';
import { computeProgress, runExclusive } from '@/utils/consolidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { locationBarcode } = await req.json();
    if (!locationBarcode) {
      return NextResponse.json({ error: 'locationBarcode required' }, { status: 400 });
    }

    const outcome = await runExclusive(() => prismaDispatch.$transaction(async (tx) => {
      const location = await tx.location.findUnique({ where: { barcode: locationBarcode } });
      if (!location) throw new Error('LOCATION_NOT_FOUND');
      if (!location.currentPackageId) throw new Error('SLOT_EMPTY');
      const pkg = location.currentPackageId;

      const pc = await tx.packageConsolidation.findUnique({ where: { shippingPackageId: pkg } });
      if (!pc) throw new Error('SLOT_EMPTY');

      // Re-verify against the live dump — do NOT trust a stale COMPLETE flag.
      const prog = await computeProgress(tx, pkg);
      if (!prog.complete) {
        // Refuse release; leave the slot as it was (still green/awaiting). The
        // operator scans the missing item(s), which re-completes it. (No status
        // write here — it would only be rolled back by the throw.)
        const err = new Error('NOT_COMPLETE') as Error & { info?: unknown };
        err.info = { expected: prog.expected, accounted: prog.accounted };
        throw err;
      }

      await tx.packageConsolidation.update({
        where: { id: pc.id },
        data: {
          status: 'RELEASED',
          releasedAt: new Date(),
          expectedCount: prog.expected,
          accountedCount: prog.accounted,
        },
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
    }));

    void setLight(outcome.locationNumber, 'OFF'); // fire-and-forget add-on

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
    console.error('complete-location error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
