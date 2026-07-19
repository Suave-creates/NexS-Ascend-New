import { NextResponse } from 'next/server';
import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

// GET /api/metal-frame/qc/stats?qcPerson=XYZ
//  -> last-hour pass/fail counts for this person
export async function GET(req: Request) {
  const url = new URL(req.url);
  const qcPerson = url.searchParams.get('qcPerson');
  if (!qcPerson) {
    return NextResponse.json({ error: 'qcPerson is required' }, { status: 400 });
  }

  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60 + IST_OFFSET);

  const [pass, fail] = await Promise.all([
    prisma.qcScan.count({
      where: { qcPerson, status: 'PASS', timestamp: { gte: oneHourAgo } },
    }),
    prisma.qcScan.count({
      where: { qcPerson, status: 'FAIL', timestamp: { gte: oneHourAgo } },
    }),
  ]);

  return NextResponse.json({ pass, fail });
}
