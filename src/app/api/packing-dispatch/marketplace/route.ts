import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { isMarketplaceScanId, normalizeMarketplaceScanId } from '@/lib/marketplaceScan';

const STATION_REGEX = /^PS(?:0[1-9]|[12]\d|30)$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scanId = normalizeMarketplaceScanId(body.scanId);
    const stationId = typeof body.stationId === 'string' ? body.stationId.trim().toUpperCase() : '';
    const nexsId = typeof body.nexsId === 'string' ? body.nexsId.trim() : '';

    if (!isMarketplaceScanId(scanId)) {
      return NextResponse.json(
        { error: 'Invalid marketplace Scan ID format.' },
        { status: 400 }
      );
    }

    if (!STATION_REGEX.test(stationId)) {
      return NextResponse.json({ error: 'Invalid Packing Station ID.' }, { status: 400 });
    }

    if (!nexsId) {
      return NextResponse.json({ error: 'NexS ID cannot be empty.' }, { status: 400 });
    }

    const existing = await prisma.marketplaceScan.findFirst({ where: { scanId } });
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    await prisma.marketplaceScan.create({
      data: { scanId, stationId, nexsId, timestamp: istNow },
    });

    const meta = await prisma.shippingMetadata.findUnique({
      where: { shippingID: scanId },
    });

    return NextResponse.json({
      success: true,
      isDuplicate: !!existing,
      previousStation: existing?.stationId ?? null,
      city: meta?.city?.toUpperCase() ?? null,
    });
  } catch (error: unknown) {
    console.error('Marketplace API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

