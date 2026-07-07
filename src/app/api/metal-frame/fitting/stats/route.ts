import { NextResponse } from 'next/server';
import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lineNumber = url.searchParams.get('lineNumber');
  if (!lineNumber) {
    return NextResponse.json({ error: 'lineNumber is required' }, { status: 400 });
  }

  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60 + IST_OFFSET);

  const [count, reworkCount] = await Promise.all([
    prisma.fittingScan.count({
      where: { lineNumber, timestamp: { gte: oneHourAgo } },
    }),
    prisma.fittingScan.count({
      where: { lineNumber, isRework: true, timestamp: { gte: oneHourAgo } },
    }),
  ]);

  return NextResponse.json({ count, reworkCount });
}
