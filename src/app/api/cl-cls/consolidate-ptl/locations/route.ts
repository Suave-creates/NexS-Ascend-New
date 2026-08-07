// src/app/api/consolidate-ptl/locations/route.ts
//
// Grid + live consolidation state for the ConsolidAte board.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { dedupeActiveColors } from '@/utils/consolidate';

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

    // Batch-fetch pending (unplaced) scans for every CONSOLIDATING package so
    // a slot with 2 concurrent operators shows both colours on the dashboard
    // — mirrors the physical 2-LED behaviour, not just the single mutable
    // PackageConsolidation.operatorColor column (whoever scanned last).
    const consolidatingPkgs = consolidations
      .filter((c) => c.status === 'CONSOLIDATING')
      .map((c) => c.shippingPackageId);
    const pendingScans = consolidatingPkgs.length
      ? await prismaDispatch.consolidationScan.findMany({
          where: { shippingPackageId: { in: consolidatingPkgs }, placed: false },
          orderBy: { scannedAt: 'desc' },
          select: { shippingPackageId: true, operatorColor: true },
        })
      : [];
    // Group by package (preserving the scannedAt-desc order from the query
    // above), then reduce each group with the SAME rule scan-barcode's
    // pendingColors() uses — one shared definition of "active colours" for
    // both the live scan flow and this dashboard mirror.
    const rowsByPkg = new Map<string, { operatorColor: string | null }[]>();
    for (const s of pendingScans) {
      const arr = rowsByPkg.get(s.shippingPackageId) ?? [];
      arr.push({ operatorColor: s.operatorColor });
      rowsByPkg.set(s.shippingPackageId, arr);
    }
    const colorsByPkg = new Map<string, string[]>();
    for (const [pkgId, rows] of rowsByPkg) colorsByPkg.set(pkgId, dedupeActiveColors(rows));

    const formatted = locations.map((loc) => {
      const pc = byLocation.get(loc.id);
      const operatorColors = !pc
        ? []
        : pc.status === 'CONSOLIDATING'
        ? colorsByPkg.get(pc.shippingPackageId) ?? (pc.operatorColor ? [pc.operatorColor] : [])
        : pc.operatorColor ? [pc.operatorColor] : [];
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
        operatorColors,
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
    console.error('consolidate-ptl/locations error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
