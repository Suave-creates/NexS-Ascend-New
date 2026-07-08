import { NextResponse } from 'next/server';
import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';

// Barcode format: 3 alphabets + 9 digits  e.g.  ABC123456789
const BARCODE_REGEX = /^[A-Z]{3}\d{9}$/;

// A re-scan within this window is treated as an accidental duplicate.
// A re-scan after this window is treated as a possible rework.
const REWORK_THRESHOLD_MIN = 30;

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

type Persons = {
  nosePad: string;
  tipFitting: string;
  lensFitting: string;
  tipBending: string;
  frontAlign: string;
  frameAlign: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const barcode: string = (body.barcode ?? '').trim().toUpperCase();
    const lineNumber: string = (body.lineNumber ?? '').trim();
    const persons: Persons = body.persons ?? {};
    // intent: 'auto' (default) | 'rework' (force rework) | 'normal' (force normal despite duplicate)
    const intent: 'auto' | 'rework' | 'normal' = body.intent ?? 'auto';

    // 1) Barcode format
    if (!BARCODE_REGEX.test(barcode)) {
      return NextResponse.json(
        { error: 'Invalid barcode format (must be 3 letters + 9 digits).' },
        { status: 400 },
      );
    }

    // 2) Line number + all six operation person IDs must be set
    if (!lineNumber) {
      return NextResponse.json({ error: 'Line Number is not set.' }, { status: 400 });
    }
    const required: [keyof Persons, string][] = [
      ['nosePad', 'Nose Pad'],
      ['tipFitting', 'Tip Fitting'],
      ['lensFitting', 'Lens Fitting'],
      ['tipBending', 'Tip Bending'],
      ['frontAlign', 'Front Alignment'],
      ['frameAlign', 'Frame Alignment'],
    ];
    for (const [key, label] of required) {
      if (!persons[key]?.trim()) {
        return NextResponse.json({ error: `${label} person ID is not set.` }, { status: 400 });
      }
    }

    const now = Date.now();
    const istNow = new Date(now + IST_OFFSET);

    // 3) Most recent prior scan of this barcode
    const prev = await prisma.fittingScan.findFirst({
      where: { barcode },
      orderBy: { timestamp: 'desc' },
    });

    const minutesSince = prev
      ? Math.floor((istNow.getTime() - prev.timestamp.getTime()) / 60000)
      : null;

    // 4) Decide whether to record based on intent + history
    if (intent === 'auto' && prev) {
      if ((minutesSince ?? 0) < REWORK_THRESHOLD_MIN) {
        // Accidental duplicate — do not record; let the operator decide.
        return NextResponse.json({
          status: 'duplicate',
          minutesSince,
          lastReworkFlagged: prev.isRework,
        });
      }
      // Old enough to likely be a rework — confirm with the operator.
      return NextResponse.json({
        status: 'possible_rework',
        minutesSince,
      });
    }

    // 5) Record the scan
    const isRework = intent === 'rework';
    await prisma.fittingScan.create({
      data: {
        barcode,
        lineNumber,
        nosePadPid: persons.nosePad.trim(),
        tipFittingPid: persons.tipFitting.trim(),
        lensFittingPid: persons.lensFitting.trim(),
        tipBendingPid: persons.tipBending.trim(),
        frontAlignPid: persons.frontAlign.trim(),
        frameAlignPid: persons.frameAlign.trim(),
        isRework,
        timestamp: istNow,
      },
    });

    return NextResponse.json({
      status: 'recorded',
      isRework,
      wasRepeat: !!prev,
      minutesSince,
    });
  } catch (err: any) {
    console.error('Fitting API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
