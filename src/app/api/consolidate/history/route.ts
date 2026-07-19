// src/app/api/consolidate/history/route.ts
//
// Read-only view of the append-only ConsolidateReleaseHistory table — the
// durable record of released consolidations that survives this platform's
// own master-reset.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const page = Math.max(0, Number(searchParams.get('page') ?? 0) || 0);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(searchParams.get('limit') ?? DEFAULT_LIMIT) || DEFAULT_LIMIT));

    const where = q ? { shippingPackageId: { contains: q } } : {};

    const [rows, total] = await Promise.all([
      prismaDispatch.consolidateReleaseHistory.findMany({
        where,
        orderBy: { releasedAt: 'desc' },
        skip: page * limit,
        take: limit,
      }),
      prismaDispatch.consolidateReleaseHistory.count({ where }),
    ]);

    return NextResponse.json({
      rows: rows.map((r) => ({
        id: r.id,
        shippingPackageId: r.shippingPackageId,
        locationNumber: r.locationNumber,
        rackNumber: r.rackNumber,
        operatorColor: r.operatorColor,
        expectedCount: r.expectedCount,
        accountedCount: r.accountedCount,
        barcodes: JSON.parse(r.barcodes) as { barcode: string; placed: boolean; scannedAt: string; placedAt: string | null }[],
        completedAt: r.completedAt,
        releasedAt: r.releasedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('consolidate/history error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
