// src/app/api/consolidate/locations/route.ts
//
// Grid + live consolidation state for the ConsolidAte board.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const locations = await prismaDispatch.location.findMany({
      include: { rack: true },
      orderBy: [{ rackId: 'asc' }, { level: 'asc' }, { position: 'asc' }],
    });

    const consolidations = await prismaDispatch.packageConsolidation.findMany({
      where: { status: { in: ['CONSOLIDATING', 'COMPLETE'] } },
    });
    const byLocation = new Map(
      consolidations.filter((c) => c.locationId != null).map((c) => [c.locationId as number, c]),
    );

    const formatted = locations.map((loc) => {
      const pc = byLocation.get(loc.id);
      return {
        id: loc.id,
        rackNumber: loc.rack.rackNumber,
        level: loc.level,
        position: loc.position,
        locationNumber: loc.locationNumber,
        barcode: loc.barcode,
        lightState: loc.lightState,
        shippingPackageId: pc?.shippingPackageId ?? null,
        operatorColor: pc?.operatorColor ?? null,
        status: pc?.status ?? 'FREE',
        expected: pc?.expectedCount ?? 0,
        accounted: pc?.accountedCount ?? 0,
      };
    });

    return NextResponse.json({
      locations: formatted,
      stats: {
        totalSlots: locations.length,
        activeLights: locations.filter((l) => l.lightState === 'ON').length,
        consolidating: consolidations.filter((c) => c.status === 'CONSOLIDATING').length,
        complete: consolidations.filter((c) => c.status === 'COMPLETE').length,
        freeSlots: formatted.filter((l) => l.status === 'FREE').length,
      },
    });
  } catch (error) {
    console.error('consolidate/locations error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
