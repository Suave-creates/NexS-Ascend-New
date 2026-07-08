// src/utils/consolidate.ts
//
// Shared helpers for the ConsolidAte pipeline: per-package serialization and
// SET-MEMBERSHIP progress (completion is decided by "every expected barcode has
// a placed scan", never by raw counts — so barcode reassignment across packages
// and stale scans can't falsely complete a package).

import type { Prisma } from '@/generated/dispatch';

type Tx = Prisma.TransactionClient;

/** Named-lock key for a shipping package (MySQL GET_LOCK max 64 chars). */
export function pkgLockKey(pkg: string): string {
  return `csl:${pkg}`.slice(0, 60);
}

/** Acquire a per-package advisory lock on the transaction's connection. */
export async function acquirePkgLock(tx: Tx, pkg: string, timeoutSec = 10) {
  const key = pkgLockKey(pkg);
  const r = await tx.$queryRawUnsafe<Array<{ l: number | null }>>(
    'SELECT GET_LOCK(?, ?) AS l',
    key,
    timeoutSec,
  );
  return { key, ok: Number(r?.[0]?.l ?? 0) === 1 };
}

export async function releasePkgLock(tx: Tx, key: string) {
  await tx.$queryRawUnsafe('SELECT RELEASE_LOCK(?) AS r', key);
}

// ── In-process serialization for the scan/release flow ───────────────────────
// A scan does a cross-package "place the previous pending" hand-off, so scans
// (and releases) must not interleave. A MySQL advisory lock held INSIDE a Prisma
// interactive transaction is unsafe: it is released in `finally` BEFORE COMMIT
// (a waiter can read uncommitted state), it leaks if the tx is aborted (the
// RELEASE runs on a dead tx), and its wait counts against the tx timeout. This
// app runs as ONE process (cf. qc-sync's single-flight guard), so a simple
// in-process async mutex serialises every mutation cleanly — each op runs,
// COMMITS, then the next starts. (If this is ever scaled to multiple processes,
// replace this with a lock held on a dedicated connection across the commit.)
let opChain: Promise<unknown> = Promise.resolve();
export function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const result = opChain.then(fn, fn); // run after the previous op settles (ok or fail)
  opChain = result.then(() => undefined, () => undefined); // keep the chain alive
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
  const expected = await tx.qcDumpEntry.count({ where: { shippingPackageId: pkg } });
  const rows = await tx.$queryRawUnsafe<Array<{ missing: bigint | number }>>(
    `SELECT COUNT(*) AS missing
       FROM qc_dump_entries q
      WHERE q.shipping_package_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM consolidation_scans s
           WHERE s.shipping_package_id = q.shipping_package_id
             AND s.barcode = q.barcode
             AND s.placed = 1)`,
    pkg,
  );
  const missing = Number(rows?.[0]?.missing ?? 0);
  const accounted = Math.max(0, expected - missing);
  return { expected, missing, accounted, complete: expected > 0 && missing === 0 };
}

/** Claim the lowest-numbered free slot atomically (row-locked, skip contended). */
export async function claimFreeSlot(tx: Tx): Promise<{ id: number; locationNumber: number } | null> {
  const rows = await tx.$queryRawUnsafe<Array<{ id: number; location_number: number }>>(
    `SELECT id, location_number
       FROM locations
      WHERE current_package_id IS NULL AND is_active = 1
      ORDER BY location_number ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED`,
  );
  const row = rows?.[0];
  return row ? { id: Number(row.id), locationNumber: Number(row.location_number) } : null;
}
