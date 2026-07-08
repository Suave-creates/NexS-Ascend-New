// src/app/api/consolidate/scan-barcode/route.ts
//
// ConsolidAte step 1: operator scans an item barcode.
//   barcode -> Shipping Package ID (from the QC dump) -> that package's PTL slot
//   -> slot light GLOWS (operator colour). All barcodes of one package share a slot.
//
// Concurrency-safe: a per-package advisory lock serialises same-package scans
// (no duplicate slot / duplicate PackageConsolidation), and the free slot is
// claimed with FOR UPDATE SKIP LOCKED so two packages never grab the same slot.

import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { setLight } from '@/utils/rackController';
import { acquirePkgLock, releasePkgLock, computeProgress, claimFreeSlot } from '@/utils/consolidate';

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
      return NextResponse.json(
        { error: 'Barcode not found in the Order QC dump yet' },
        { status: 404 },
      );
    }
    const pkg = entry.shippingPackageId;

    const result = await prismaDispatch.$transaction(async (tx) => {
      const lock = await acquirePkgLock(tx, pkg);
      if (!lock.ok) throw new Error('LOCK_TIMEOUT');
      try {
        let pc = await tx.packageConsolidation.findUnique({ where: { shippingPackageId: pkg } });

        // A previously shipped package re-scanned starts a fresh consolidation.
        const reactivating = !!pc && pc.status === 'RELEASED';
        if (reactivating) {
          await tx.consolidationScan.deleteMany({ where: { shippingPackageId: pkg } });
        }

        // Determine the slot: reuse the active one, else claim a fresh free slot.
        let locationId =
          pc && !reactivating && pc.locationId ? pc.locationId : null;

        if (!locationId) {
          const free = await claimFreeSlot(tx);
          if (!free) throw new Error('NO_SLOTS');
          locationId = free.id;
          await tx.location.update({
            where: { id: free.id },
            data: { currentPackageId: pkg, lightState: 'ON', assignmentTimestamp: new Date() },
          });
        } else {
          await tx.location.update({ where: { id: locationId }, data: { lightState: 'ON' } });
        }

        // Scan rows FK to PackageConsolidation, so the parent must exist before
        // we insert one. On a package's first scan there is none yet — create a
        // minimal row (progress/status are finalised in the upsert below). This
        // is race-safe: the per-package advisory lock serialises same-package scans.
        if (!pc) {
          pc = await tx.packageConsolidation.create({
            data: {
              shippingPackageId: pkg,
              locationId,
              operatorColor: color as never,
              status: 'CONSOLIDATING',
              expectedCount: 0,
              accountedCount: 0,
            },
          });
        }

        // Record the scan (idempotent on re-scan).
        const existing = await tx.consolidationScan.findUnique({
          where: { shippingPackageId_barcode: { shippingPackageId: pkg, barcode } },
        });
        if (!existing) {
          await tx.consolidationScan.create({ data: { shippingPackageId: pkg, barcode, locationId } });
        }

        const prog = await computeProgress(tx, pkg);

        pc = await tx.packageConsolidation.upsert({
          where: { shippingPackageId: pkg },
          create: {
            shippingPackageId: pkg,
            locationId,
            operatorColor: color as never,
            status: prog.complete ? 'COMPLETE' : 'CONSOLIDATING',
            expectedCount: prog.expected,
            accountedCount: prog.accounted,
            completedAt: prog.complete ? new Date() : null,
          },
          update: {
            locationId,
            operatorColor: color as never,
            status: prog.complete ? 'COMPLETE' : 'CONSOLIDATING',
            expectedCount: prog.expected,
            accountedCount: prog.accounted,
            releasedAt: null,
            completedAt: prog.complete ? new Date() : null,
          },
        });

        const location = await tx.location.findUnique({
          where: { id: locationId },
          include: { rack: true },
        });
        // Glow the operator colour while consolidating; green once complete.
        const light = location
          ? { loc: location.locationNumber, color: prog.complete ? 'GREEN' : color }
          : null;

        return { location, prog, alreadyScanned: !!existing, light };
      } finally {
        await releasePkgLock(tx, lock.key);
      }
    });

    // Fire-and-forget: the light is an add-on. Don't make the operator wait on
    // an unreachable/slow ESP32 — they scan the location barcode regardless.
    if (result.light) void setLight(result.light.loc, result.light.color);

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
      placed: result.prog.accounted,
      complete: result.prog.complete,
      alreadyScanned: result.alreadyScanned,
      color,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'NO_SLOTS') {
      return NextResponse.json({ error: 'No free PTL slots available' }, { status: 409 });
    }
    if (msg === 'LOCK_TIMEOUT') {
      return NextResponse.json({ error: 'Busy, try again' }, { status: 503 });
    }
    console.error('scan-barcode error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
