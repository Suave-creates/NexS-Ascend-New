// src/app/api/courier/scan/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { authMiddleware } from '@/middleware/auth';
import type { AuthenticatedRequest } from '@/middleware/auth';

export const POST = authMiddleware(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const partner = String(body?.partner ?? '');
    const personId = req.user.employeeCode;
    const awbTrim = String(body?.awb ?? '').trim().toUpperCase();

    const mismatch = Boolean(body?.mismatch ?? false);
    const detectedPartner = body?.detectedPartner ?? null;

    if (!partner || !awbTrim) {
      return NextResponse.json(
        { ok: false, error: 'PARTNER_AND_AWB_REQUIRED' },
        { status: 400 }
      );
    }

    // Check if duplicate exists
    const existing = await prisma.courierHandover.findFirst({
      where: { partner, awb: awbTrim },
    });
    const duplicateFlag = existing ? true : false;

    // Always insert a new row
    const data: any = {
      partner,
      awb: awbTrim,
      mismatch,
      detectedPartner,
      duplicate: duplicateFlag,
      personId,
    };
    const row = await prisma.courierHandover.create({
      data,
    });

    return NextResponse.json(
      { ok: true, data: row, duplicate: duplicateFlag },
      { status: 200 }
    );
  } catch (err) {
    console.error('courier/scan error:', err);
    return NextResponse.json(
      { ok: false, error: 'SCAN_FAILED' },
      { status: 500 }
    );
  }
});
