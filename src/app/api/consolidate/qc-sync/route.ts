// src/app/api/consolidate/qc-sync/route.ts
//
// Ingests a FULL snapshot of the "CL: Order QC" dump (all pages the client
// paginated) and upserts it into qc_dump_entries. Idempotent by barcode, so no
// entry is ever dropped across cycles. Entries not present in this snapshot are
// flagged in_dump=false (they left the dump) but retained, so a package's
// expected-barcode set is the UNION seen across cycles.
//
// After ingesting, expected counts are refreshed for packages currently being
// consolidated; a COMPLETE package that gains a new expected barcode reverts to
// CONSOLIDATING and its light is re-lit.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RawRow = Record<string, unknown>;

const str = (v: unknown): string | null =>
  v === null || v === undefined || v === '' ? null : String(v);
const toDate = (v: unknown): Date | null => {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const CHUNK = 200;

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const rows: RawRow[] = Array.isArray(payload?.rows) ? payload.rows : [];
    if (!rows.length) {
      return NextResponse.json({ error: 'rows[] required' }, { status: 400 });
    }

    // Normalise + dedupe by barcode (last occurrence wins).
    const byBarcode = new Map<string, {
      barcode: string; pkg: string; inc: string | null; itemType: string | null;
      trayNo: string | null; status: string | null; createdAt: Date | null; updatedAt: Date | null;
    }>();
    let skipped = 0;
    for (const r of rows) {
      const barcode = str(r['Barcode']);
      const pkg = str(r['Shipping Package ID']);
      if (!barcode || !pkg) { skipped++; continue; }
      byBarcode.set(barcode, {
        barcode, pkg,
        inc: str(r['Increment ID']),
        itemType: str(r['Item Type']),
        trayNo: str(r['Tray No']),
        status: str(r['Current Status']),
        createdAt: toDate(r['Created At']),
        updatedAt: toDate(r['Last Updated At']),
      });
    }

    const cycleStart = new Date();
    const entries = [...byBarcode.values()];

    // Bulk upsert in chunks (one query per chunk) to keep the polled endpoint light.
    for (let i = 0; i < entries.length; i += CHUNK) {
      const chunk = entries.slice(i, i + CHUNK);
      const placeholders = chunk.map(() => '(?,?,?,?,?,?,?,?,?,?,1)').join(',');
      const params: unknown[] = [];
      for (const e of chunk) {
        params.push(
          e.barcode, e.pkg, e.inc, e.itemType, e.trayNo, e.status,
          e.createdAt, e.updatedAt, cycleStart, cycleStart,
        );
      }
      const sql =
        `INSERT INTO qc_dump_entries
           (barcode, shipping_package_id, increment_id, item_type, tray_no, current_status,
            order_created_at, order_updated_at, first_seen_at, last_seen_at, in_dump)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE
           shipping_package_id=VALUES(shipping_package_id),
           increment_id=VALUES(increment_id),
           item_type=VALUES(item_type),
           tray_no=VALUES(tray_no),
           current_status=VALUES(current_status),
           order_created_at=VALUES(order_created_at),
           order_updated_at=VALUES(order_updated_at),
           last_seen_at=VALUES(last_seen_at),
           in_dump=1`;
      await prismaDispatch.$executeRawUnsafe(sql, ...params);
    }

    // Anything not touched this cycle has left the live dump (kept, flagged).
    const departed = await prismaDispatch.$executeRawUnsafe(
      `UPDATE qc_dump_entries SET in_dump=0 WHERE in_dump=1 AND last_seen_at < ?`,
      cycleStart,
    );

    // Refresh expected counts for packages currently being worked.
    const active = await prismaDispatch.packageConsolidation.findMany({
      where: { status: { in: ['PENDING', 'CONSOLIDATING', 'COMPLETE'] } },
      include: { location: true },
    });
    let reverted = 0;
    for (const pc of active) {
      const expected = await prismaDispatch.qcDumpEntry.count({
        where: { shippingPackageId: pc.shippingPackageId },
      });
      const data: Record<string, unknown> = { expectedCount: expected };
      // A completed package that gained a new expected barcode must reopen.
      if (pc.status === 'COMPLETE' && expected > pc.accountedCount) {
        data.status = 'CONSOLIDATING';
        data.completedAt = null;
        reverted++;
        if (pc.location) {
          await setLight(pc.location.locationNumber, pc.operatorColor || 'YELLOW');
        }
      }
      if (expected !== pc.expectedCount || data.status) {
        await prismaDispatch.packageConsolidation.update({ where: { id: pc.id }, data });
      }
    }

    return NextResponse.json({
      success: true,
      received: rows.length,
      upserted: entries.length,
      skipped,
      departed,
      activePackages: active.length,
      reopened: reverted,
    });
  } catch (error) {
    console.error('qc-sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
