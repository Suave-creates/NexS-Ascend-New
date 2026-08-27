import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

const STATION_REGEX = /^PS(?:0[1-9]|[12]\d|30)$/;

export async function GET(req: Request) {
  const stationId = new URL(req.url).searchParams.get('stationId')?.trim().toUpperCase();

  if (!stationId || !STATION_REGEX.test(stationId)) {
    return NextResponse.json({ error: 'Valid stationId is required.' }, { status: 400 });
  }

  const istOffset = 5.5 * 60 * 60 * 1000;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000 + istOffset);
  const count = await prisma.marketplaceScan.count({
    where: {
      stationId,
      timestamp: { gte: oneHourAgo },
    },
  });

  return NextResponse.json({ count });
}

