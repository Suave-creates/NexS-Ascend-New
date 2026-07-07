import { NextResponse } from 'next/server';
import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';
import { DEFAULT_REASONS, SUPERVISOR_CODE, type QcReason } from '@/lib/qcReasons';

// Shape returned to the client — matches the QcReason type in lib/qcReasons.
type Row = { id: number; label: string; hotkey: string; featured: boolean; sortOrder: number };

function toClient(rows: Row[]): QcReason[] {
  return rows.map((r) => ({
    id: String(r.id),
    label: r.label,
    key: r.hotkey,
    featured: r.featured,
    order: r.sortOrder,
  }));
}

async function readActive(): Promise<Row[]> {
  return prisma.qcReason.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, label: true, hotkey: true, featured: true, sortOrder: true },
  });
}

// GET /api/qc/reasons -> the active reason layout, ordered.
// Auto-seeds the default layout the first time the table is empty.
export async function GET() {
  try {
    let rows = await readActive();
    if (rows.length === 0) {
      await prisma.qcReason.createMany({
        data: DEFAULT_REASONS.map((r) => ({
          label: r.label,
          hotkey: r.key,
          featured: r.featured,
          sortOrder: r.order,
          active: true,
        })),
      });
      rows = await readActive();
    }
    return NextResponse.json({ reasons: toClient(rows) });
  } catch (err: any) {
    console.error('QC reasons GET error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/qc/reasons -> replace the whole layout (supervisor save).
// body: { code: string, reasons: { label, key, featured }[] } in display order.
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (SUPERVISOR_CODE && String(body.code ?? '') !== SUPERVISOR_CODE) {
      return NextResponse.json({ error: 'Invalid supervisor code.' }, { status: 403 });
    }

    const incoming = Array.isArray(body.reasons) ? body.reasons : null;
    if (!incoming) {
      return NextResponse.json({ error: 'reasons must be an array.' }, { status: 400 });
    }

    const cleaned = incoming
      .map((r: any, i: number) => ({
        label: String(r.label ?? '').trim(),
        hotkey: String(r.key ?? '').trim().toUpperCase().slice(0, 1),
        featured: !!r.featured,
        sortOrder: i,
        active: true,
      }))
      .filter((r: { label: string }) => r.label.length > 0);

    if (cleaned.length === 0) {
      return NextResponse.json({ error: 'At least one reason is required.' }, { status: 400 });
    }

    // Full replace so a removed reason really disappears everywhere.
    await prisma.$transaction([
      prisma.qcReason.deleteMany({}),
      prisma.qcReason.createMany({ data: cleaned }),
    ]);

    const rows = await readActive();
    return NextResponse.json({ reasons: toClient(rows) });
  } catch (err: any) {
    console.error('QC reasons PUT error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
