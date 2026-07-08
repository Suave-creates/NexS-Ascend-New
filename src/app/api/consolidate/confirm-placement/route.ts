// src/app/api/consolidate/confirm-placement/route.ts
//
// ConsolidAte step 2: operator confirms an item was physically placed into its
// lit slot. Completion is by SET MEMBERSHIP — the slot turns GREEN (COMPLETE)
// only when EVERY expected barcode currently in the dump for the package has a
// placed scan (missing == 0), never by raw counts.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';
import { acquirePkgLock, releasePkgLock, computeProgress } from '@/utils/consolidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { barcode, locationBarcode } = await req.json();
    if (!barcode) return NextResponse.json({ error: 'barcode required' }, { status: 400 });

    const outcome = await prismaDispatch.$transaction(async (tx) => {
      // Resolve the package from the barcode's most recent scan.
      const scan = await tx.consolidationScan.findFirst({
        where: { barcode },
        orderBy: { scannedAt: 'desc' },
      });
      if (!scan) throw new Error('NOT_SCANNED');
      const pkg = scan.shippingPackageId;

      const lock = await acquirePkgLock(tx, pkg);
      if (!lock.ok) throw new Error('LOCK_TIMEOUT');
      try {
        // Defensive: verify the operator scanned the item's assigned slot.
        if (locationBarcode) {
          const loc = await tx.location.findUnique({ where: { id: scan.locationId } });
          if (!loc || loc.barcode !== locationBarcode) throw new Error('LOCATION_MISMATCH');
        }

        if (!scan.placed) {
          await tx.consolidationScan.update({
            where: { id: scan.id },
            data: { placed: true, placedAt: new Date() },
          });
        }

        // Put-to-light: the item is now placed, so the directing light goes OFF.
        // Keeping it on would leave multiple slots lit and make two concurrent
        // orders impossible to segregate. (Completion is signalled on-screen.)
        if (scan.locationId != null) {
          await tx.location.update({ where: { id: scan.locationId }, data: { lightState: 'OFF' } });
        }

        const prog = await computeProgress(tx, pkg);

        const pc = await tx.packageConsolidation.update({
          where: { shippingPackageId: pkg },
          data: {
            expectedCount: prog.expected,
            accountedCount: prog.accounted,
            status: prog.complete ? 'COMPLETE' : 'CONSOLIDATING',
            completedAt: prog.complete ? new Date() : null,
          },
          include: { location: true },
        });

        const offLoc = pc.location?.locationNumber ?? null;

        return { pkg, prog, location: pc.location, offLoc };
      } finally {
        await releasePkgLock(tx, lock.key);
      }
    });

    // Put-to-light: turn the slot's light OFF now the item is placed, so only the
    // NEXT pick's target is ever lit. Fire-and-forget (light is an optional add-on).
    if (outcome.offLoc != null) void setLight(outcome.offLoc, 'OFF');

    return NextResponse.json({
      success: true,
      shippingPackageId: outcome.pkg,
      expected: outcome.prog.expected,
      placed: outcome.prog.accounted,
      complete: outcome.prog.complete,
      location: outcome.location && {
        locationNumber: outcome.location.locationNumber,
        barcode: outcome.location.barcode,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'NOT_SCANNED') {
      return NextResponse.json({ error: 'Barcode was not scanned into a slot first' }, { status: 404 });
    }
    if (msg === 'LOCATION_MISMATCH') {
      return NextResponse.json({ error: 'Wrong location for this item' }, { status: 409 });
    }
    if (msg === 'LOCK_TIMEOUT') {
      return NextResponse.json({ error: 'Busy, try again' }, { status: 503 });
    }
    console.error('confirm-placement error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
