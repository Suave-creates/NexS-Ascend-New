// src/utils/consolidatePlatform.ts
//
// Shared helpers for the ConsolidAte (non-PTL) platform at /consolidate — same
// set-membership progress and per-package serialization as ConsolidAte PTL's
// consolidate.ts (now at /consolidate-ptl), pointed at this platform's own
// consolidate_* tables so the two platforms never interact. Table-agnostic
// helpers (locking, colour dedup) are reused directly from consolidate.ts.

import type { Prisma } from '@/generated/dispatch';
import { pkgLockKey, acquirePkgLock, releasePkgLock, dedupeActiveColors } from './consolidate';
export { pkgLockKey, acquirePkgLock, releasePkgLock, dedupeActiveColors };

type Tx = Prisma.TransactionClient;

// Independent in-process mutex — deliberately NOT shared with ConsolidAte
// PTL's opChain in consolidate.ts, or the two platforms would serialize
// against each other's scans for no reason.
let opChain: Promise<unknown> = Promise.resolve();
export function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const result = opChain.then(fn, fn);
  opChain = result.then(() => undefined, () => undefined);
  return result;
}

export interface Progress {
  expected: number;
  missing: number;
  accounted: number;
  complete: boolean;
}

/**
 * Progress for a package by CURRENT-dump set membership:
 *   expected  = # barcodes currently in the dump for the package (union kept)
 *   missing   = # of those expected barcodes with no placed scan
 *   accounted = expected - missing
 *   complete  = expected > 0 AND missing == 0
 */
export async function computeProgress(tx: Tx, pkg: string): Promise<Progress> {
  const expected = await tx.consolidateQcDumpEntry.count({ where: { shippingPackageId: pkg } });
  const rows = await tx.$queryRawUnsafe<Array<{ missing: bigint | number }>>(
    `SELECT COUNT(*) AS missing
       FROM consolidate_qc_dump_entries q
      WHERE q.shipping_package_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM consolidate_package_scans s
           WHERE s.shipping_package_id = q.shipping_package_id
             AND s.barcode = q.barcode
             AND s.placed = 1)`,
    pkg,
  );
  const missing = Number(rows?.[0]?.missing ?? 0);
  const accounted = Math.max(0, expected - missing);
  return { expected, missing, accounted, complete: expected > 0 && missing === 0 };
}

/**
 * Distinct operator colours with a currently-PENDING (unplaced) scan on this
 * package, most-recently-scanned first — same dual-operator-per-slot model
 * as ConsolidAte PTL, reusing the shared dedupeActiveColors reduction.
 */
export async function pendingColors(tx: Tx, pkg: string): Promise<string[]> {
  const rows = await tx.consolidatePackageScan.findMany({
    where: { shippingPackageId: pkg, placed: false },
    orderBy: { scannedAt: 'desc' },
    select: { operatorColor: true },
  });
  return dedupeActiveColors(rows);
}

/**
 * Claim the lowest-numbered free slot IN A SPECIFIC RACK. Strictly scoped —
 * never spills into another rack even if this one is full (the operator
 * picks their rack up front; a full rack is the operator's problem to
 * switch racks for, not something to silently paper over).
 */
export async function claimFreeSlotInRack(tx: Tx, rackId: number): Promise<{ id: number; locationNumber: number } | null> {
  const rows = await tx.$queryRawUnsafe<Array<{ id: number; location_number: number }>>(
    `SELECT id, location_number
       FROM consolidate_locations
      WHERE current_package_id IS NULL AND is_active = 1 AND rack_id = ?
      ORDER BY location_number ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED`,
    rackId,
  );
  const row = rows?.[0];
  return row ? { id: Number(row.id), locationNumber: Number(row.location_number) } : null;
}
