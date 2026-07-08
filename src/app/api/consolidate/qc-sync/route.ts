// src/app/api/consolidate/qc-sync/route.ts
//
// Ingests a FULL snapshot of the "CL: Order QC" dump (all pages the client
// paginated) and upserts it into qc_dump_entries. Idempotent by barcode, so no
// entry is ever dropped across cycles. Entries absent from this snapshot are
// flagged in_dump=false (kept), so a package's expected-barcode set is the UNION
// seen across cycles.
//
// Then expected/accounted are refreshed by SET MEMBERSHIP for packages being
// worked, moving them COMPLETE<->CONSOLIDATING and (re)lighting as needed.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';
import { acquirePkgLock, releasePkgLock, computeProgress } from '@/utils/consolidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Per-process single-flight: overlapping cycles (multiple operator tabs polling)
// would otherwise race the in_dump reconcile. The app runs as one Node process.
let syncing = false;

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
  if (syncing) {
    return NextResponse.json({ success: true, skipped: true, reason: 'sync already running' });
  }
  syncing = true;
  try {
    const payload = await req.json();
    const rows: RawRow[] = Array.isArray(payload?.rows) ? payload.rows : [];
    if (!rows.length) {
      return NextResponse.json({ error: 'rows[] required' }, { status: 400 });
    }

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

    const departed = await prismaDispatch.$executeRawUnsafe(
      `UPDATE qc_dump_entries SET in_dump=0 WHERE in_dump=1 AND last_seen_at < ?`,
      cycleStart,
    );

    // Refresh expected/accounted by set membership for active packages, and
    // move status + light in either direction as the dump changes.
    const active = await prismaDispatch.packageConsolidation.findMany({
      where: { status: { in: ['PENDING', 'CONSOLIDATING', 'COMPLETE'] } },
    });
    let reopened = 0;
    let autoCompleted = 0;
    for (const pcSnap of active) {
      const pkg = pcSnap.shippingPackageId;
      const lightAfter = await prismaDispatch.$transaction(
        async (tx): Promise<{ loc: number; color: string } | null> => {
          const lock = await acquirePkgLock(tx, pkg, 5);
          if (!lock.ok) return null; // another op holds it; next cycle reconciles
          try {
            const pc = await tx.packageConsolidation.findUnique({
              where: { shippingPackageId: pkg },
              include: { location: true },
            });
            if (!pc || pc.status === 'RELEASED') return null;
            const prog = await computeProgress(tx, pkg);
            const newStatus = prog.complete ? 'COMPLETE' : 'CONSOLIDATING';
            if (prog.expected === pc.expectedCount && prog.accounted === pc.accountedCount && newStatus === pc.status) {
              return null;
            }
            await tx.packageConsolidation.update({
              where: { id: pc.id },
              data: {
                expectedCount: prog.expected,
                accountedCount: prog.accounted,
                status: newStatus,
                completedAt: prog.complete ? (pc.completedAt ?? new Date()) : null,
              },
            });
            if (pc.location) {
              if (prog.complete && pc.status !== 'COMPLETE') {
                autoCompleted++;
                return { loc: pc.location.locationNumber, color: 'GREEN' };
              }
              if (!prog.complete && pc.status === 'COMPLETE') {
                reopened++;
                return { loc: pc.location.locationNumber, color: pc.operatorColor || 'YELLOW' };
              }
            }
            return null;
          } finally {
            await releasePkgLock(tx, lock.key);
          }
        },
      );
      if (lightAfter) await setLight(lightAfter.loc, lightAfter.color);
    }

    return NextResponse.json({
      success: true,
      received: rows.length,
      upserted: entries.length,
      skipped,
      departed,
      activePackages: active.length,
      reopened,
      autoCompleted,
    });
  } catch (error) {
    console.error('qc-sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    syncing = false;
  }
}
