import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';

export const runtime = 'nodejs';
const str = (v: unknown) => v == null || v === '' ? null : String(v);
let syncing = false;

export async function POST(req: Request) {
  if (syncing) return NextResponse.json({ error: 'A dump sync is already being stored' }, { status: 409 });
  syncing = true;
  try {
    const rows = (await req.json())?.rows;
    if (!Array.isArray(rows) || !rows.length) return NextResponse.json({ error: 'Complete rows[] dump required' }, { status: 400 });
    const unique = new Map<string, { barcode: string; fitting: string | null; pkg: string }>();
    for (const row of rows) {
      const barcode = str(row['Barcode']); const pkg = str(row['Shipping Package ID']);
      if (barcode && pkg) unique.set(barcode, { barcode, pkg, fitting: str(row['Fitting ID']) });
    }
    const stamp = new Date(); const entries = [...unique.values()];

    for (let i = 0; i < entries.length; i += 200) {
      const chunk = entries.slice(i, i + 200);
      const values = chunk.map(() => '(?,?,?,?)').join(',');
      await prismaDispatch.$executeRawUnsafe(
        `INSERT INTO cl_cls_qc_queue_entries (barcode, fitting_id, shipping_package_id, last_seen_at) VALUES ${values}
         ON DUPLICATE KEY UPDATE fitting_id=VALUES(fitting_id), shipping_package_id=VALUES(shipping_package_id), last_seen_at=VALUES(last_seen_at)`,
        ...chunk.flatMap(e => [e.barcode, e.fitting, e.pkg, stamp]),
      );
    }
    const removed = await prismaDispatch.clClsQcQueueEntry.deleteMany({
      where: { lastSeenAt: { lt: stamp }, state: { not: 'RUNNING' } },
    });
    return NextResponse.json({ success: true, received: rows.length, stored: entries.length, removed: removed.count });
  } finally {
    syncing = false;
  }
}
