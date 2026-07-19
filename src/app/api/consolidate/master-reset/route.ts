// src/app/api/consolidate/master-reset/route.ts
//
// Clears ALL consolidation state and turns every slot's on-screen glow off.
// Keeps consolidate_qc_dump_entries and consolidate_release_history. Use to
// recover the board to a clean state. No physical hardware to reset here.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { runExclusive } from '@/utils/consolidatePlatform';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Serialise with scan/release so a reset can't run mid-scan transaction.
    await runExclusive(() => prismaDispatch.$transaction([
      prismaDispatch.consolidatePackageScan.deleteMany({}),
      prismaDispatch.consolidatePackage.deleteMany({}),
      prismaDispatch.consolidateLocation.updateMany({
        data: { lightState: 'OFF', currentPackageId: null },
      }),
    ]));

    return NextResponse.json({ success: true, message: 'All slots cleared' });
  } catch (error) {
    console.error('consolidate/master-reset error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
