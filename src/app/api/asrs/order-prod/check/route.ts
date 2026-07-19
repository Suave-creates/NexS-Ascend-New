//src/app/api/asrs/order-prod/check/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(req: Request) {
  try {
    const { pids } = await req.json();

    if (!Array.isArray(pids) || pids.length === 0) {
      return NextResponse.json(
        { error: 'pids must be a non-empty array' },
        { status: 400 }
      );
    }

    /* ===============================
       Normalize PIDs → string
    ================================ */
    const normalizedPids = pids
      .filter((p: unknown) => p !== null && p !== undefined)
      .map((p: unknown) => String(p).trim());

    if (normalizedPids.length === 0) {
      return NextResponse.json({
        is_highlighted: false,
        matched_pids: [],
        comments: [],
      });
    }

    const matches = await prisma.inventoryPID.findMany({
      where: {
        PID: { in: normalizedPids },
      },
      select: {
        PID: true,
        Comment: true,
      },
    });

    return NextResponse.json({
      is_highlighted: matches.length > 0,
      matched_pids: matches.map((m) => m.PID),
      comments: matches.map((m) => ({
        pid: m.PID,
        comment: m.Comment,
      })),
    });
  } catch (error) {
    console.error('InventoryPID Check Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
