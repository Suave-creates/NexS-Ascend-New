// src/app/api/consolidate/scan-barcode/route.ts
//
// ConsolidAte (non-PTL) item scan — same put-to-light-STYLE flow as
// ConsolidAte PTL (src/app/api/consolidate-ptl/scan-barcode/route.ts), minus
// any physical light hardware. The operator picks BOTH a rack and a Ranger
// colour before scanning; a brand-new package claims a slot strictly within
// the CHOSEN rack (never spills into another rack — see claimFreeSlotInRack).
//
//   Scan item 1  -> its slot glows on-screen (operator colour); item 1 "pending".
//   Scan item 2  -> item 1 is CONFIRMED PLACED, its glow off; item 2's slot glows.
//   The scan that completes an order places that last item immediately and the
//   slot turns GREEN on-screen (awaiting a single location scan to release).
//
// Same concurrent-operator model as PTL: an operator's scan only ever confirms
// THEIR OWN previous pending scan (scoped by operatorColor), and a slot shared
// by 2 concurrent operators shows both colours instead of collapsing to one.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { computeProgress, claimFreeSlotInRack, runExclusive, pendingColors } from '@/utils/consolidatePlatform';
import type { OperatorColor } from '@/generated/dispatch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLORS = new Set(['YELLOW', 'BLUE', 'GREEN', 'PINK', 'RED']);

export async function POST(req: Request) {
  try {
    const { barcode, operatorColor, rackNumber } = await req.json();
    if (!barcode) return NextResponse.json({ error: 'barcode required' }, { status: 400 });
    const rackNum = Number(rackNumber);
    if (!Number.isInteger(rackNum) || rackNum < 1) {
      return NextResponse.json({ error: 'rackNumber required' }, { status: 400 });
    }
    const color = COLORS.has(String(operatorColor).toUpperCase())
      ? String(operatorColor).toUpperCase()
      : 'YELLOW';
    const opColor = color as OperatorColor;

    const entry = await prismaDispatch.consolidateQcDumpEntry.findUnique({ where: { barcode } });
    if (!entry) {
      return NextResponse.json({ error: 'Barcode not found in the Order QC dump yet' }, { status: 404 });
    }
    const pkg = entry.shippingPackageId;

    // Serialise the whole scan in-process — one scan may place a pending item
    // of another package, and each scan must COMMIT before the next starts.
    const result = await runExclusive(() => prismaDispatch.$transaction(async (tx) => {
      const now = new Date();
      const offLocs: number[] = [];
      const greenLocs: number[] = [];
      const dualLocs: { locationNumber: number; colors: string[] }[] = [];

      const rack = await tx.consolidateRack.findUnique({ where: { rackNumber: rackNum } });
      if (!rack) throw new Error('INVALID_RACK');

      // ── 1) Confirm the PREVIOUS pending item(s) as placed — ONLY for THIS
      // SAME OPERATOR's own previous pending scan (concurrent operators, any
      // rack, are fully independent — see ConsolidAte PTL's identical logic).
      const pendings = await tx.consolidatePackageScan.findMany({
        where: { placed: false, operatorColor: opColor, NOT: { shippingPackageId: pkg, barcode } },
      });
      const otherPkgs = new Set<string>();
      for (const q of pendings) {
        await tx.consolidatePackageScan.update({ where: { id: q.id }, data: { placed: true, placedAt: now } });
        if (q.shippingPackageId !== pkg) otherPkgs.add(q.shippingPackageId);
      }

      // ── 2) Resolve / claim this package's slot — strictly within rackNum
      // for a BRAND-NEW claim only; an already-assigned package keeps its
      // existing slot regardless of which rack the operator has selected now.
      let pc = await tx.consolidatePackage.findUnique({ where: { shippingPackageId: pkg } });
      const reactivating = !!pc && pc.status === 'RELEASED';
      if (reactivating) await tx.consolidatePackageScan.deleteMany({ where: { shippingPackageId: pkg } });

      let locationId = pc && !reactivating && pc.locationId ? pc.locationId : null;
      if (!locationId) {
        const free = await claimFreeSlotInRack(tx, rack.id);
        if (!free) throw new Error('RACK_FULL');
        locationId = free.id;
        await tx.consolidateLocation.update({
          where: { id: free.id },
          data: { currentPackageId: pkg, assignmentTimestamp: now },
        });
      }
      if (!pc || reactivating) {
        pc = await tx.consolidatePackage.upsert({
          where: { shippingPackageId: pkg },
          create: {
            shippingPackageId: pkg, locationId, operatorColor: opColor,
            status: 'CONSOLIDATING', expectedCount: 0, accountedCount: 0,
          },
          update: {
            locationId, operatorColor: opColor,
            status: 'CONSOLIDATING', releasedAt: null, completedAt: null,
          },
        });
      }

      // ── 3) Handle THIS barcode. Ensure its scan row exists.
      // operatorColor is set ONLY at creation (first-write-wins) — never
      // overwritten by a later re-scan under a different colour.
      let bScan = await tx.consolidatePackageScan.findUnique({
        where: { shippingPackageId_barcode: { shippingPackageId: pkg, barcode } },
      });
      const wasPlaced = !!bScan?.placed;
      if (!bScan) {
        bScan = await tx.consolidatePackageScan.create({
          data: { shippingPackageId: pkg, barcode, locationId, placed: false, operatorColor: opColor },
        });
      }

      let complete: boolean;
      if (wasPlaced) {
        complete = (await computeProgress(tx, pkg)).complete; // redundant re-scan; don't toggle
      } else {
        await tx.consolidatePackageScan.update({ where: { id: bScan.id }, data: { placed: true, placedAt: now } });
        complete = (await computeProgress(tx, pkg)).complete;
        if (!complete) {
          // Not the last item -> keep it PENDING (placed later, on the next scan).
          await tx.consolidatePackageScan.update({ where: { id: bScan.id }, data: { placed: false, placedAt: null } });
        }
      }

      const prog = await computeProgress(tx, pkg);

      // On-screen glow flag (no physical light — this just drives the grid's
      // CSS animation). A redundant re-scan of an already-placed, still-
      // incomplete item does not re-light (avoids a stray second glow).
      const lightThisOn = complete || !wasPlaced;
      if (lightThisOn) {
        await tx.consolidateLocation.update({ where: { id: locationId }, data: { lightState: 'ON' } });
      }
      pc = await tx.consolidatePackage.update({
        where: { shippingPackageId: pkg },
        data: {
          locationId, operatorColor: opColor,
          status: complete ? 'COMPLETE' : 'CONSOLIDATING',
          expectedCount: prog.expected, accountedCount: prog.accounted,
          releasedAt: null, completedAt: complete ? now : null,
        },
      });

      // Colours to show on THIS slot: green if complete, else every operator
      // currently holding a pending item here (1 or 2).
      const activeColors = complete ? [] : await pendingColors(tx, pkg);

      // ── 4) Resolve the on-screen state for the just-placed pendings of
      // OTHER packages (by construction these never complete here).
      for (const p of otherPkgs) {
        const pp = await tx.consolidatePackage.findUnique({
          where: { shippingPackageId: p }, include: { location: true },
        });
        if (!pp?.location) continue;
        const pprog = await computeProgress(tx, p);
        if (pprog.complete) {
          await tx.consolidatePackage.update({
            where: { shippingPackageId: p },
            data: { status: 'COMPLETE', expectedCount: pprog.expected, accountedCount: pprog.accounted, completedAt: now },
          });
          await tx.consolidateLocation.update({ where: { id: pp.location.id }, data: { lightState: 'ON' } });
          greenLocs.push(pp.location.locationNumber);
        } else {
          await tx.consolidatePackage.update({
            where: { shippingPackageId: p },
            data: { status: 'CONSOLIDATING', expectedCount: pprog.expected, accountedCount: pprog.accounted },
          });
          // A DIFFERENT operator may still have their own live pending scan on
          // this same package (shared slot) — don't clear their glow.
          const stillActive = await pendingColors(tx, p);
          if (stillActive.length > 0) {
            await tx.consolidateLocation.update({ where: { id: pp.location.id }, data: { lightState: 'ON' } });
            dualLocs.push({ locationNumber: pp.location.locationNumber, colors: stillActive });
          } else {
            await tx.consolidateLocation.update({ where: { id: pp.location.id }, data: { lightState: 'OFF' } });
            offLocs.push(pp.location.locationNumber);
          }
        }
      }

      const scannedCount = await tx.consolidatePackageScan.count({ where: { shippingPackageId: pkg } });
      const location = await tx.consolidateLocation.findUnique({ where: { id: locationId }, include: { rack: true } });
      return { location, prog, scannedCount, complete, wasPlaced, offLocs, greenLocs, dualLocs, activeColors };
    }));

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
      activeColors: result.activeColors,
      dimmed: result.offLocs,
      greened: result.greenLocs,
      dual: result.dualLocs,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'INVALID_RACK') return NextResponse.json({ error: 'INVALID_RACK' }, { status: 400 });
    if (msg === 'RACK_FULL') return NextResponse.json({ error: 'RACK_FULL' }, { status: 409 });
    console.error('consolidate scan-barcode error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
