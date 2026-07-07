import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

const FR0_REGEX = /^SNXS\d{16}$/;

export async function POST(req: Request) {
  try {
    const { scanId, stationId, nexsId } = await req.json();

    // 1) Required field validation
    if (!scanId || !stationId || !nexsId) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // 2) Scan format validation
    if (!FR0_REGEX.test(scanId)) {
      return NextResponse.json(
        { error: 'Invalid FR0 Scan ID format (SNXS + 16 digits).' },
        { status: 400 }
      );
    }

    // 3) Duplicate check
    const existing = await prisma.fR0BulkHOTO.findFirst({
      where: { scanId },
      orderBy: { timestamp: 'desc' },
    });

    const isDuplicate = Boolean(existing);
    const previousStation = existing?.stationId ?? null;

    // 4) IST timestamp override (+5h 30m)
    const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    // 5) Insert scan with IST timestamp
    await prisma.fR0BulkHOTO.create({
      data: {
        scanId,
        stationId,
        nexsId,
        timestamp: istNow,
      },
    });

    // 6) Optional city lookup (unchanged)
    let city: string | null = null;
    try {
      const meta = await prisma.shippingMetadata.findUnique({
        where: { shippingID: scanId },
      });
      city = meta?.city?.toUpperCase() ?? null;
    } catch {}

    // 7) Response
    return NextResponse.json({
      success: true,
      isDuplicate,
      previousStation,
      city,
    });
  } catch (err: any) {
    console.error('FR0 API error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
