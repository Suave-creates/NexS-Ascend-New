import { NextResponse } from 'next/server';
import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';

// Barcode format: 3 alphabets + 9 digits  e.g.  ABC123456789
const BARCODE_REGEX = /^[A-Z]{3}\d{9}$/;

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

// GET /api/qc?barcode=ABC123456789 -> last QC verdict for that barcode (for a "previously QC'd" note)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const barcode = (url.searchParams.get('barcode') ?? '').trim().toUpperCase();
  if (!BARCODE_REGEX.test(barcode)) {
    return NextResponse.json({ error: 'Invalid barcode format.' }, { status: 400 });
  }

  const prev = await prisma.qcScan.findFirst({
    where: { barcode },
    orderBy: { timestamp: 'desc' },
  });

  if (!prev) return NextResponse.json({ previous: null });

  const istNow = new Date(Date.now() + IST_OFFSET);
  const minutesSince = Math.floor((istNow.getTime() - prev.timestamp.getTime()) / 60000);

  return NextResponse.json({
    previous: {
      status: prev.status,
      reason: prev.reason,
      qcPerson: prev.qcPerson,
      minutesSince,
    },
  });
}

// POST /api/qc -> record a QC verdict
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const barcode: string = (body.barcode ?? '').trim().toUpperCase();
    const qcPerson: string = (body.qcPerson ?? '').trim();
    const qcStation: string = (body.qcStation ?? '').trim();
    const status: string = (body.status ?? '').trim().toUpperCase(); // PASS | FAIL
    const reason: string | null = body.reason ? String(body.reason).trim() : null;

    if (!BARCODE_REGEX.test(barcode)) {
      return NextResponse.json(
        { error: 'Invalid barcode format (must be 3 letters + 9 digits).' },
        { status: 400 },
      );
    }
    if (!qcPerson) {
      return NextResponse.json({ error: 'QC Person is not set.' }, { status: 400 });
    }
    if (!qcStation) {
      return NextResponse.json({ error: 'QC Station / Line is not set.' }, { status: 400 });
    }
    if (status !== 'PASS' && status !== 'FAIL') {
      return NextResponse.json({ error: 'Status must be PASS or FAIL.' }, { status: 400 });
    }
    if (status === 'FAIL' && !reason) {
      return NextResponse.json({ error: 'A fail reason is required.' }, { status: 400 });
    }

    const istNow = new Date(Date.now() + IST_OFFSET);

    await prisma.qcScan.create({
      data: {
        barcode,
        qcPerson,
        qcStation,
        status,
        reason: status === 'FAIL' ? reason : null,
        timestamp: istNow,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('QC API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
