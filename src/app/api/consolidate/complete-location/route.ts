// src/app/api/consolidate/complete-location/route.ts
//
// ConsolidAte step 3: operator scans the LOCATION barcode of a green (COMPLETE)
// slot to release it — light OFF, slot freed, package marked ready-to-ship.
//
// Completeness is RE-VERIFIED against the current dump at release time (never
// trusts the stored status flag): if the package gained an expected barcode
// after it went green, release is refused (NOT_COMPLETE) and the slot is re-lit
// its operator colour so the operator can pick the missing item(s).

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';
import { acquirePkgLock, releasePkgLock, computeProgress } from '@/utils/consolidate';

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

      const lock = await acquirePkgLock(tx, pkg);
      if (!lock.ok) throw new Error('LOCK_TIMEOUT');
      try {
        const pc = await tx.packageConsolidation.findUnique({ where: { shippingPackageId: pkg } });
        if (!pc) throw new Error('SLOT_EMPTY');

        // Re-verify against the live dump — do NOT trust a stale COMPLETE flag.
        const prog = await computeProgress(tx, pkg);
        if (!prog.complete) {
          await tx.packageConsolidation.update({
            where: { id: pc.id },
            data: {
              expectedCount: prog.expected,
              accountedCount: prog.accounted,
              status: 'CONSOLIDATING',
              completedAt: null,
            },
          });
          const err = new Error('NOT_COMPLETE') as Error & { info?: unknown };
          err.info = {
            expected: prog.expected,
            accounted: prog.accounted,
            relight: { loc: location.locationNumber, color: pc.operatorColor || 'YELLOW' },
          };
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
      } finally {
        await releasePkgLock(tx, lock.key);
      }
    });

    await setLight(outcome.locationNumber, 'OFF');

    return NextResponse.json({
      success: true,
      message: 'Slot released — package ready to ship',
      shippingPackageId: outcome.pkg,
      locationNumber: outcome.locationNumber,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'NOT_COMPLETE') {
      const info = (error as Error & { info?: { expected: number; accounted: number; relight?: { loc: number; color: string } } }).info;
      if (info?.relight) await setLight(info.relight.loc, info.relight.color).catch(() => {});
      return NextResponse.json(
        { error: 'NOT_COMPLETE', progress: { expected: info?.expected, accounted: info?.accounted } },
        { status: 409 },
      );
    }
    const map: Record<string, number> = { LOCATION_NOT_FOUND: 404, SLOT_EMPTY: 409, LOCK_TIMEOUT: 503 };
    if (map[msg]) return NextResponse.json({ error: msg }, { status: map[msg] });
    console.error('complete-location error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
