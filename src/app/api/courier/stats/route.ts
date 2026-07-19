// src/app/api/courier/stats/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// GET /api/courier/stats?partner=Delcart
export async function GET(req: Request) {
  const url = new URL(req.url);
  const partner = url.searchParams.get('partner');
  if (!partner) {
    return NextResponse.json({ error: 'partner required' }, { status: 400 });
  }

  // Keep lightweight: total count per partner (not used by frontend session counters)
  const total = await prisma.courierHandover.count({ where: { partner } });

  return NextResponse.json({
    total,
    valid: total,
    invalid: 0,
  });
}
