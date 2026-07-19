// src/app/api/consolidate-ptl/master-reset/route.ts
//
// Clears ALL consolidation state and turns every slot light off. Keeps the
// qc_dump_entries history. Use to recover the board to a clean state.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { resetAll } from '@/utils/rackController';
import { runExclusive } from '@/utils/consolidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Serialise with scan/release so a reset can't run mid-scan transaction.
    await runExclusive(() => prismaDispatch.$transaction([
      prismaDispatch.consolidationScan.deleteMany({}),
      prismaDispatch.packageConsolidation.deleteMany({}),
      prismaDispatch.location.updateMany({
        data: { lightState: 'OFF', currentPackageId: null, currentRoutingCode: null },
      }),
    ]));

    void resetAll(); // fire-and-forget: don't block on the ESP32 (optional add-on)

    return NextResponse.json({ success: true, message: 'All slots cleared and lights reset' });
  } catch (error) {
    console.error('consolidate-ptl/master-reset error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
