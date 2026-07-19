import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET() {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000 + IST_OFFSET);

  // Count unique fitting_ids (stored in stationId)
  const result = await prisma.manualWarehouse.aggregate({
    _count: {
      stationId: true,
    },
    where: {
      timestamp: {
        gte: oneHourAgo,
      },
    },
  });

  return NextResponse.json({
    count: result._count.stationId,
  });
}
