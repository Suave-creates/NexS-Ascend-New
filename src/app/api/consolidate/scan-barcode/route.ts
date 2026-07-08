// src/app/api/consolidate/scan-barcode/route.ts
//
// ConsolidAte item scan (new put-to-light flow — NO per-item location scan).
//
//   Scan item 1  -> its slot glows (operator colour); item 1 is "pending".
//   Scan item 2  -> item 1 is CONFIRMED PLACED (placedAt = now, the item-2 scan),
//                   its light goes off; item 2's slot glows. And so on.
//   The scan that completes an order places that last item IMMEDIATELY and the
//   slot turns GREEN (awaiting a single location scan to release — see
//   complete-location). Interleaving is fine: only ONE amber (the active item)
//   is ever lit; an unfinished order goes dark and re-glows on its next item.
//
// DB is unchanged — same tables/writes; only WHEN `placed`/`placedAt` is set
// moves to the next scan (and the completing scan). Scans are serialised with an
// in-process mutex (runExclusive) because one scan may confirm a pending item of
// ANOTHER package; the mutex commits each scan before the next begins (no DB
// advisory lock held across a transaction — that pattern leaks / races).

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';
import { computeProgress, claimFreeSlot, runExclusive } from '@/utils/consolidate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLORS = new Set(['YELLOW', 'BLUE', 'GREEN', 'PINK', 'RED']);

export async function POST(req: Request) {
  try {
    const { barcode, operatorColor } = await req.json();
    if (!barcode) return NextResponse.json({ error: 'barcode required' }, { status: 400 });
    const color = COLORS.has(String(operatorColor).toUpperCase())
      ? String(operatorColor).toUpperCase()
      : 'YELLOW';

    const entry = await prismaDispatch.qcDumpEntry.findUnique({ where: { barcode } });
    if (!entry) {
      return NextResponse.json({ error: 'Barcode not found in the Order QC dump yet' }, { status: 404 });
    }
    const pkg = entry.shippingPackageId;

    // Serialise the whole scan in-process — one scan may place a pending item of
    // another package, and each scan must COMMIT before the next starts.
    const result = await runExclusive(() => prismaDispatch.$transaction(async (tx) => {
      const now = new Date();
      const offLocs: number[] = [];
      const greenLocs: number[] = [];

      // ── 1) Confirm the PREVIOUS pending item(s) as placed (timestamp = now).
      // Scanning the next barcode is what places the previous one. Exclude only
      // THIS package's THIS barcode (step 3 handles it) — NOT the same barcode
      // value in another package, so a reassigned barcode's stale pending is
      // still confirmed. Normally exactly one row is pending (one amber light).
      const pendings = await tx.consolidationScan.findMany({
        where: { placed: false, NOT: { shippingPackageId: pkg, barcode } },
      });
      const otherPkgs = new Set<string>();
      for (const q of pendings) {
        await tx.consolidationScan.update({ where: { id: q.id }, data: { placed: true, placedAt: now } });
        if (q.shippingPackageId !== pkg) otherPkgs.add(q.shippingPackageId);
      }

      // ── 2) Resolve / claim this package's slot.
      let pc = await tx.packageConsolidation.findUnique({ where: { shippingPackageId: pkg } });
      const reactivating = !!pc && pc.status === 'RELEASED';
      if (reactivating) await tx.consolidationScan.deleteMany({ where: { shippingPackageId: pkg } });

      let locationId = pc && !reactivating && pc.locationId ? pc.locationId : null;
      if (!locationId) {
        const free = await claimFreeSlot(tx);
        if (!free) throw new Error('NO_SLOTS');
        locationId = free.id;
        await tx.location.update({
          where: { id: free.id },
          data: { currentPackageId: pkg, assignmentTimestamp: now },
        });
      }
      if (!pc || reactivating) {
        pc = await tx.packageConsolidation.upsert({
          where: { shippingPackageId: pkg },
          create: {
            shippingPackageId: pkg, locationId, operatorColor: color as never,
            status: 'CONSOLIDATING', expectedCount: 0, accountedCount: 0,
          },
          update: {
            locationId, operatorColor: color as never,
            status: 'CONSOLIDATING', releasedAt: null, completedAt: null,
          },
        });
      }

      // ── 3) Handle THIS barcode. Ensure its scan row exists.
      let bScan = await tx.consolidationScan.findUnique({
        where: { shippingPackageId_barcode: { shippingPackageId: pkg, barcode } },
      });
      const wasPlaced = !!bScan?.placed;
      if (!bScan) {
        bScan = await tx.consolidationScan.create({
          data: { shippingPackageId: pkg, barcode, locationId, placed: false },
        });
      }

      // Does placing THIS barcode complete the order? Tentatively place & test.
      let complete: boolean;
      if (wasPlaced) {
        complete = (await computeProgress(tx, pkg)).complete; // redundant re-scan; don't toggle
      } else {
        await tx.consolidationScan.update({ where: { id: bScan.id }, data: { placed: true, placedAt: now } });
        complete = (await computeProgress(tx, pkg)).complete;
        if (!complete) {
          // Not the last item → keep it PENDING (placed later, on the next scan).
          await tx.consolidationScan.update({ where: { id: bScan.id }, data: { placed: false, placedAt: null } });
        }
      }

      const prog = await computeProgress(tx, pkg);

      // Light for this slot: GREEN if complete, else AMBER while it's the active
      // pending. A redundant re-scan of an already-placed, still-incomplete item
      // does not re-light (avoids a stray second amber).
      const lightThisOn = complete || !wasPlaced;
      if (lightThisOn) {
        await tx.location.update({ where: { id: locationId }, data: { lightState: 'ON' } });
      }
      pc = await tx.packageConsolidation.update({
        where: { shippingPackageId: pkg },
        data: {
          locationId, operatorColor: color as never,
          status: complete ? 'COMPLETE' : 'CONSOLIDATING',
          expectedCount: prog.expected, accountedCount: prog.accounted,
          releasedAt: null, completedAt: complete ? now : null,
        },
      });

      // ── 4) Resolve lights for the just-placed pendings of OTHER packages.
      // (By construction the completing item is always THIS barcode, so these
      //  never complete — but we handle it defensively.)
      for (const p of otherPkgs) {
        const pp = await tx.packageConsolidation.findUnique({
          where: { shippingPackageId: p }, include: { location: true },
        });
        if (!pp?.location) continue;
        const pprog = await computeProgress(tx, p);
        if (pprog.complete) {
          await tx.packageConsolidation.update({
            where: { shippingPackageId: p },
            data: { status: 'COMPLETE', expectedCount: pprog.expected, accountedCount: pprog.accounted, completedAt: now },
          });
          await tx.location.update({ where: { id: pp.location.id }, data: { lightState: 'ON' } });
          greenLocs.push(pp.location.locationNumber);
        } else {
          await tx.packageConsolidation.update({
            where: { shippingPackageId: p },
            data: { status: 'CONSOLIDATING', expectedCount: pprog.expected, accountedCount: pprog.accounted },
          });
          await tx.location.update({ where: { id: pp.location.id }, data: { lightState: 'OFF' } });
          offLocs.push(pp.location.locationNumber);
        }
      }

      // Progress shown to the operator = items SCANNED (placed + the current
      // pending), so the 1st scan of an N-item order reads 1/N (not 0/N).
      const scannedCount = await tx.consolidationScan.count({ where: { shippingPackageId: pkg } });

      const location = await tx.location.findUnique({ where: { id: locationId }, include: { rack: true } });
      return { location, prog, scannedCount, complete, wasPlaced, offLocs, greenLocs };
    }));

    // Fire-and-forget lights (optional add-on — never block the scan).
    if (result.location && (result.complete || !result.wasPlaced)) {
      void setLight(result.location.locationNumber, result.complete ? 'GREEN' : color);
    }
    for (const n of result.greenLocs) void setLight(n, 'GREEN');
    for (const n of result.offLocs) void setLight(n, 'OFF');

    return NextResponse.json({
      success: true,
      shippingPackageId: pkg,
      itemType: entry.itemType,
      location: result.location && {
        id: result.location.id,
        locationNumber: result.location.locationNumber,
        barcode: result.location.barcode,
        rackNumber: result.location.rack?.rackNumber,
        level: result.location.level,
        position: result.location.position,
      },
      expected: result.prog.expected,
      placed: result.scannedCount, // scanned-so-far (incl. current pending) → 1/N on first scan
      complete: result.complete,
      alreadyScanned: result.wasPlaced,
      color,
      dimmed: result.offLocs,   // locationNumbers whose light went dark (still assigned)
      greened: result.greenLocs, // locationNumbers that turned green
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'NO_SLOTS') return NextResponse.json({ error: 'No free PTL slots available' }, { status: 409 });
    console.error('scan-barcode error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
