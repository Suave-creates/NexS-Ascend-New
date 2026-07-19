import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Build IST date-range where clause from YYYY-MM-DD string
function buildDateWhere(dateParam: string | null): Record<string, unknown> {
  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return {};
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const localMidnight = new Date(`${dateParam}T00:00:00.000`);
  const start = new Date(localMidnight.getTime() - istOffsetMs);
  const end   = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { createdAt: { gte: start, lte: end } };
}

// ── GET: counts for stats OR CSV export ────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date');
  const doExport  = searchParams.get('export') === 'true';
  const where = buildDateWhere(dateParam);

  // ── Export: stream CSV ─────────────────────────────────────────────
  if (doExport) {
    try {
      const rows = await prisma.nddShipment.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        select: { awb: true, type: true, createdAt: true },
      });
      const lines = ['AWB,Type,Date,Time'];
      for (const r of rows) {
        const d = new Date(r.createdAt);
        const date = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' });
        const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        lines.push(`${r.awb},${r.type},${date},${time}`);
      }
      const filename = `NDD_${dateParam ?? 'all'}.csv`;
      return new NextResponse(lines.join('\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (err) {
      console.error('[NDD-EXPORT]', err);
      return NextResponse.json({ error: 'Export failed.' }, { status: 500 });
    }
  }

  // ── Stats: counts only (no row limit) ────────────────────────────────
  try {
    const groups = await prisma.nddShipment.groupBy({
      by: ['type'],
      where,
      _count: { id: true },
    });
    let normal = 0, rescue = 0;
    for (const g of groups) {
      if (g.type === 'Normal')  normal  = g._count.id;
      if (g.type === 'Rescue')  rescue  = g._count.id;
    }
    return NextResponse.json({ total: normal + rescue, normal, rescue });
  } catch (err) {
    console.error('[NDD-GET]', err);
    return NextResponse.json({ error: 'Failed to fetch counts.' }, { status: 500 });
  }
}

// ── POST: record one or many NDD shipments (with upsert & per-line type) ────
// Supports per-line prefix:  R:AWB123  → Rescue,  N:AWB123  → Normal
// Default type comes from body.type; duplicates (same AWB) are replaced.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const defaultType: 'Normal' | 'Rescue' = body.type === 'Rescue' ? 'Rescue' : 'Normal';

    const rawList: string[] = Array.isArray(body.awbs)
      ? body.awbs
      : [(body.awb ?? '')];

    // Parse each line — optional R: / N: prefix overrides the batch default
    const parsed = rawList
      .map((line: string) => {
        const s = line.trim().toUpperCase();
        if (s.startsWith('R:')) return { awb: s.slice(2).trim(), type: 'Rescue' as const };
        if (s.startsWith('N:')) return { awb: s.slice(2).trim(), type: 'Normal' as const };
        return { awb: s, type: defaultType };
      })
      .filter((item) => item.awb.length > 0 && item.awb.length <= 100);

    if (parsed.length === 0) {
      return NextResponse.json({ error: 'No valid AWBs provided.' }, { status: 400 });
    }

    // Deduplicate within this batch — last line wins for same AWB
    const deduped = new Map<string, { awb: string; type: 'Normal' | 'Rescue' }>();
    for (const item of parsed) deduped.set(item.awb, item);
    const items = Array.from(deduped.values());
    const awbKeys = items.map((i) => i.awb);

    // Remove any existing DB records for these AWBs (upsert = delete + insert)
    const deleted = await prisma.nddShipment.deleteMany({
      where: { awb: { in: awbKeys } },
    });

    // Build createdAt: use provided date at noon IST (to avoid timezone edge cases),
    // or fall back to NOW if no valid date supplied.
    let createdAt: Date | undefined;
    const dateParam: string = body.date ?? '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      // noon IST = 06:30 UTC
      createdAt = new Date(`${dateParam}T06:30:00.000Z`);
    }

    const rowData = items.map((item) => ({...item, ...(createdAt ? { createdAt } : {})}));
    const result = await prisma.nddShipment.createMany({ data: rowData });

    return NextResponse.json({
      success: true,
      count: result.count,
      updated: deleted.count,
    }, { status: 201 });
  } catch (err) {
    console.error('[NDD-POST]', err);
    return NextResponse.json({ error: 'Failed to save records.' }, { status: 500 });
  }
}
