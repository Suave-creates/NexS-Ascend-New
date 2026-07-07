// src/app/api/consolidate/confirm-placement/route.ts
//
// ConsolidAte step 2: operator confirms an item was physically placed into its
// lit slot. When EVERY expected barcode for the Shipping Package ID has been
// placed (accounted >= expected, expected > 0), the slot turns GREEN and the
// package is COMPLETE (awaiting the location scan to be released).

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { barcode } = await req.json();
    if (!barcode) {
      return NextResponse.json({ error: 'barcode required' }, { status: 400 });
    }

    const outcome = await prismaDispatch.$transaction(async (tx) => {
      const scan = await tx.consolidationScan.findFirst({ where: { barcode } });
      if (!scan) throw new Error('NOT_SCANNED');

      const pkg = scan.shippingPackageId;

      if (!scan.placed) {
        await tx.consolidationScan.update({
          where: { id: scan.id },
          data: { placed: true, placedAt: new Date() },
        });
      }

      const expected = await tx.qcDumpEntry.count({ where: { shippingPackageId: pkg } });
      const placed = await tx.consolidationScan.count({
        where: { shippingPackageId: pkg, placed: true },
      });
      const complete = expected > 0 && placed >= expected;

      const pc = await tx.packageConsolidation.update({
        where: { shippingPackageId: pkg },
        data: {
          expectedCount: expected,
          accountedCount: placed,
          status: complete ? 'COMPLETE' : 'CONSOLIDATING',
          completedAt: complete ? new Date() : null,
        },
        include: { location: true },
      });

      return { pkg, expected, placed, complete, location: pc.location, color: pc.operatorColor };
    });

    // Hardware after commit: green when the package is fully consolidated.
    if (outcome.complete && outcome.location) {
      await setLight(outcome.location.locationNumber, 'GREEN');
    }

    return NextResponse.json({
      success: true,
      shippingPackageId: outcome.pkg,
      expected: outcome.expected,
      placed: outcome.placed,
      complete: outcome.complete,
      location: outcome.location && {
        locationNumber: outcome.location.locationNumber,
        barcode: outcome.location.barcode,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'NOT_SCANNED') {
      return NextResponse.json(
        { error: 'Barcode was not scanned into a slot first' },
        { status: 404 },
      );
    }
    console.error('confirm-placement error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
