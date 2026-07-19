# `mydb` Database Optimization & History Schema — Analysis Report

**Date:** 2026-06-18
**Scope:** Database `mydb` only (the Prisma datasource wired through `src/utils/prisma.ts`).
**Method:** Static analysis of every query issued against the `mydb` client from the API layer.

---

## 1. Scope & method

This project runs **five** independent Prisma datasources plus a raw MySQL pool. Per the
task, **only `mydb` is in scope**; everything else is explicitly ignored:

| Database | Client module | Import identifier | In scope? |
|---|---|---|---|
| **`mydb`** | `src/utils/prisma.ts` | default `prisma` (`@/generated/mydb`) | ✅ **Yes** |
| `dispatch` | `src/utils/prismaDispatch.ts` | `prismaDispatch` | ❌ Ignored |
| `lens_lab` | `src/utils/prismaLensLab.ts` | `prismaLensLab` | ❌ Ignored |
| `metal_frame` | `src/utils/prismaMetalFrame.ts` | `prismaMetalFrame` | ❌ Ignored |
| `bosch_cv_db` | `src/lib/db.ts` | `pool` (mysql2) | ❌ Ignored |
| `wms`, `nexs_ims` | `src/utils/nexsPool.ts` (raw pool) | `nexsPool` (`changeUser`) | ❌ Ignored |

**How `mydb` usage was isolated:** every file importing `from '@/utils/prisma'` was
located (36 files, *all* under `src/app/api`), then every `prisma.<model>.<op>(...)`
call inside them was catalogued. There are **no `mydb` queries anywhere outside
`src/app/api`** (confirmed across all of `src/**`). The auth middleware
(`src/middleware/auth.ts`) is JWT-only and touches no database.

> Note: `src/app/api/metal-frame/plating/route.ts` calls `…plating.create` on the
> **`metal_frame`** client, not `mydb` (the `Plating` model does not exist in `mydb`).
> It is correctly out of scope.

The literal Prisma model names differ from the physical MySQL table names (via
`@@map`). All SQL deliverables use the **physical** names; this report shows both.

---

## 2. Tables accessed by the API (physical table → routes → operations)

| Physical table (Prisma model) | Routes (under `src/app/api`) | Operations |
|---|---|---|
| `User` (`User`) | `auth`, `auth/ehs-login` | `findUnique{employeeCode}` |
| `ShippingMetadata` (`ShippingMetadata`) | `packing`, `fr0`, `bulk`, `cl-cls`, `fr0bulkhoto`, `manual-warehouse`, `upload` | `findUnique{shippingID}`, `deleteMany`, `createMany` |
| `PackingScan` (`PackingScan`) | `packing`, `packing/stats` | `findFirst{scanId}`, `create`, `count{stationId,timestamp}` |
| `DispatchScan` (`DispatchScan`) | `dispatch`, `dispatch/stats` | `findFirst{scanId}`, `create`, `count{stationId,timestamp}` |
| `BulkScan` (`BulkScan`) | `bulk`, `bulk/stats` | `findFirst{scanId}`, `create`, `count{stationId,timestamp}` |
| `FR0Scan` (`FR0Scan`) | `fr0`, `fr0/stats` | `findFirst{scanId}`, `create`, `findMany{stationId,createdAt} distinct scanId` |
| `CLScans` (`CLScan`) | `cl-cls`, `cl-cls/stats` | `findFirst{scanId}`, `create`, `findMany{stationId,createdAt} distinct scanId` |
| `ManualWarehouse` (`ManualWarehouse`) | `manual-warehouse`, `manual-warehouse/stats` | `create`, `aggregate _count{stationId} where timestamp` |
| `FR0BulkHOTO` (`FR0BulkHOTO`) | `fr0bulkhoto` | `findFirst{scanId} orderBy timestamp desc`, `create` |
| `fasttrackscan` (`FastTrackScan`) | `operations/metadata` | `create` only |
| `CourierHandover` (`CourierHandover`) | `courier/scan`, `courier/stats` | `findFirst{partner,awb}`, `create`, `count{partner}` |
| `OperationsMetadata` (`OperationsMetadata`) | `operations/metadata`, `operations/excel-upload`, `operations/excel-upload/tray-scanner` | `findFirst{locationId}`, `deleteMany`, `createMany`, `count`, `aggregate _max{id}` |
| `MaintenanceShopIssue` (`MaintenanceShopIssue`) | `maintenance/shop-issue` | `create` only |
| `EHSDeviation` (`EHSDeviation`) | `ehs/deviations`, `ehs/deviation/[id]`, `ehs/exportPDF` | `findMany{date range} orderBy date desc`, `findUnique{id}`, `create`, `update{id}`, `delete{id}` |
| `order_update_dashboard_study` (`OrderUpdateDashboardStudy`) | `asrs/order-prod`, `asrs/order-update-dashboard/upload` | `findMany{fittingId}`, `createMany` (batched), `TRUNCATE` (raw) |
| `InventoryPID` (`InventoryPID`) | `asrs/order-prod/check` | `findMany{PID in [...]}` |
| `ManualWarehouseSetUp` (`ManualWarehouseSetUp`) | `manual-warehouse/lookup`, `manual-warehouse/upload` | `findUnique{pid}`, `create` |
| `scanned_barcode_inventory` (`ScannedBarcodeInventory`) | `asrs/pid-hunter`, `asrs/pid-hunter/check`, `asrs/pid-hunted-stock-out`, `asrs/pid-hunter-transfer/{preview,execute}` | `findFirst{barcode,scanLocation}`, `create`, `deleteMany{barcode}`, `findMany{scanLocation} orderBy scannedAt desc`, `count{scanLocation}`, raw INSERT…SELECT / DELETE by `scan_location` |
| `scanned_barcode_inventory_transfer` (`ScannedBarcodeInventoryTransfer`) | `asrs/pid-hunter-transfer/execute` | raw INSERT … ON DUPLICATE KEY UPDATE (uses `uniq_barcode_scan`) |
| `ndd_shipments` (`NddShipment`) | `packing-dispatch/ndd-shipment` | `findMany{created_at range} orderBy created_at`, `groupBy[type]{created_at range}`, `deleteMany{awb in [...]}`, `createMany` |
| `MetalFrameFittingScan` (`MetalFrameFittingScan`) | *(none)* | **Not accessed by any `mydb` API route** |

---

## 3. Query-pattern summary

* **WHERE columns:** `scanId` (5 scan tables), `stationId`+`timestamp`/`createdAt`
  (stats), `shippingID`, `employeeCode`, `partner`+`awb`, `locationId`, `pid`,
  `PID IN (...)`, `fittingId`, `barcode`+`scanLocation`, `scanLocation`, `date`
  range, `created_at` range, `awb IN (...)`, `id` (PK).
* **ORDER BY:** `date desc` (EHS), `scannedAt desc` (inventory preview),
  `createdAt asc` (NDD export), `timestamp desc` (FR0BulkHOTO dedup).
* **GROUP BY / aggregates:** `groupBy(type)` (NDD stats), `aggregate _count`
  (manual-warehouse stats), `aggregate _max(id)` (operations upload), `count`.
* **DISTINCT:** `distinct: ['scanId']` (FR0 & CL stats).

### JOIN & foreign-key findings

* **`mydb` defines no foreign keys and no Prisma relations.** No `@relation` exists
  on any model, so there are no referential constraints and no ORM-level JOINs.
* The only SQL JOINs in the codebase target **other** databases (`order_items`,
  `order_items_history`, `barcode_item` in `wms`/`nexs_ims`) via the raw `nexsPool`
  — **out of scope**.
* The recurring `scanId → ShippingMetadata.shippingID` lookup is a *logical* join
  executed as two separate queries, not a SQL JOIN. The `shippingID` side is already
  uniquely indexed, so it is optimal as-is.

**Implication:** indexing is driven purely by single-table WHERE/ORDER/GROUP usage,
and history-schema creation needs no FK replication.

---

## 4. Recommended indexes (justified by §2–§3)

> Created by `02_create_indexes.sql` (idempotent, online `ALGORITHM=INPLACE, LOCK=NONE`).
> Type is **BTREE** (InnoDB default) in every case.

| # | Table | Index name | Column(s) | Reason (route evidence) |
|---|---|---|---|---|
| 1 | `PackingScan` | `idx_PackingScan_scanId` | `scanId` | Duplicate check `findFirst{scanId}` on every `POST /api/packing`. |
| 2 | `PackingScan` | `idx_PackingScan_station_ts` | `stationId, timestamp` | `count{stationId, timestamp>=}` — `GET /api/packing/stats`. Equality + range. |
| 3 | `DispatchScan` | `idx_DispatchScan_scanId` | `scanId` | Dedup on `POST /api/dispatch`. |
| 4 | `DispatchScan` | `idx_DispatchScan_station_ts` | `stationId, timestamp` | `GET /api/dispatch/stats`. |
| 5 | `BulkScan` | `idx_BulkScan_scanId` | `scanId` | Dedup on `POST /api/bulk`. |
| 6 | `BulkScan` | `idx_BulkScan_station_ts` | `stationId, timestamp` | `GET /api/bulk/stats`. |
| 7 | `FR0Scan` | `idx_FR0Scan_scanId` | `scanId` | Dedup on `POST /api/fr0`. |
| 8 | `FR0Scan` | `idx_FR0Scan_station_created` | `stationId, createdAt` | `findMany{stationId, createdAt>=} distinct scanId` — `GET /api/fr0/stats`. |
| 9 | `CLScans` | `idx_CLScans_scanId` | `scanId` | Dedup on `POST /api/cl-cls`. |
| 10 | `CLScans` | `idx_CLScans_station_created` | `stationId, createdAt` | `GET /api/cl-cls/stats`. |
| 11 | `ManualWarehouse` | `idx_ManualWarehouse_timestamp` | `timestamp` | `aggregate _count where timestamp>=` — `GET /api/manual-warehouse/stats` (no `scanId` dedup on this table). |
| 12 | `FR0BulkHOTO` | `idx_FR0BulkHOTO_scanId_ts` | `scanId, timestamp` | `findFirst{scanId} orderBy timestamp desc` — equality + ordered "latest" without filesort. Supersedes the existing single-column `scanId` index. |
| 13 | `CourierHandover` | `idx_CourierHandover_partner_awb` | `partner, awb` | `findFirst{partner, awb}` dedup **and** `count{partner}` stats (leftmost prefix). One composite serves both. |
| 14 | `OperationsMetadata` | `idx_OperationsMetadata_location_id` | `location_id` | `findFirst{locationId}` on metadata + tray-scanner lookups. |
| 15 | `scanned_barcode_inventory` | `idx_sbi_location_scanned` | `scan_location, scanned_at` | `findMany{scanLocation} orderBy scannedAt desc` (preview) + `count{scanLocation}` + raw INSERT…SELECT / DELETE by `scan_location` (execute). Filter + sort. |
| 16 | `ndd_shipments` | `idx_ndd_created_at` | `created_at` | `findMany`/`groupBy` over `created_at` range + `orderBy created_at` (stats & CSV export). |
| 17 | `ndd_shipments` | `idx_ndd_awb` | `awb` | `deleteMany{awb in [...]}` runs on **every** `POST` (upsert pattern). |

### Why these and not others (anti-over-indexing)

* **`type` (NDD enum, 2 values), `categorization`, `complianceStatus`** — low
  cardinality; not indexed alone. The `created_at` index already narrows the NDD
  `groupBy(type)` scan.
* **`MaintenanceShopIssue`, `fasttrackscan`** — write-only via the API (no reads).
  Indexing them would only tax inserts. **No index added.**
* **Composite column order** is filter-equality-first then range/sort
  (`stationId` before `timestamp`, `partner` before `awb`, `scan_location` before
  `scanned_at`) so MySQL can seek then range-scan.

---

## 5. Indexes already adequate — no change

| Table | Existing index | Serves |
|---|---|---|
| `User` | `User_employeeCode_key` (UNIQUE) | `findUnique{employeeCode}` (login). |
| `ShippingMetadata` | `ShippingMetadata_shippingID_key` (UNIQUE) | Hot `findUnique{shippingID}` city lookup. |
| `EHSDeviation` | `EHSDeviation_date_idx` | `findMany{date range} orderBy date desc` — same column for filter **and** sort. Optimal. |
| `order_update_dashboard_study` | `..._fittingId_idx` | `findMany{fittingId}` (order-prod). |
| `InventoryPID` | PK (`PID`) | `findMany{PID in [...]}`. |
| `ManualWarehouseSetUp` | `ManualWarehouseSetUp_pid_key` (UNIQUE) | `findUnique{pid}` lookup. |
| `scanned_barcode_inventory` | `uniq_barcode_scan` UNIQUE(`barcode,scan_location`) | `findFirst{barcode,scanLocation}` dedup **and** `deleteMany{barcode}` (leftmost prefix). |
| `scanned_barcode_inventory_transfer` | `uniq_barcode_scan` UNIQUE(`barcode,scan_location`) | raw INSERT … ON DUPLICATE KEY UPDATE. |

---

## 6. Redundant / unused indexes (review → optional drop)

> Handled by `04_review_redundant_indexes.sql` (guarded, online).

| Table | Index | Verdict | Reason |
|---|---|---|---|
| `ManualWarehouseSetUp` | `ManualWarehouseSetUp_pid_idx` | **Duplicate — drop** | `pid` is already UNIQUE; this is a pure duplicate. |
| `scanned_barcode_inventory` | `scanned_barcode_inventory_barcode_idx` | **Duplicate — drop** | Covered by `UNIQUE(barcode, scan_location)` (barcode is leftmost). |
| `scanned_barcode_inventory_transfer` | `scanned_barcode_inventory_transfer_barcode_idx` | **Duplicate — drop** | Same; covered by the unique key. |
| `FR0BulkHOTO` | `FR0BulkHOTO_scanId_idx` | **Drop after 02** | Superseded by composite `(scanId, timestamp)` (index #12). |
| `order_update_dashboard_study` | `_orderId_idx`, `_updatedFittingId_idx`, `_stationId_idx`, `_sku_idx` | **Review** | Unused by `src/app/api` (only `fittingId` is read). Slow every TRUNCATE+bulk-load. May back an external BI/dashboard consumer — confirm before dropping. |
| `ManualWarehouseSetUp` | `ManualWarehouseSetUp_location_idx` | **Review** | `location` is never filtered by `src/app/api`. |

---

## 7. Keeping Prisma in sync (important)

Indexes applied via raw SQL are invisible to Prisma. On the next
`prisma migrate dev`, Prisma will detect "drift" and try to **drop** the new indexes
(and **recreate** any you dropped). To prevent that, mirror the final state in
`prisma/schema.prisma`, then reconcile with `npx prisma migrate diff` /
`prisma db pull` so no migration actually alters the DB.

**Add these `@@index` lines** (next to each model):

```prisma
model PackingScan  { /* … */ @@index([scanId])              @@index([stationId, timestamp]) }
model DispatchScan { /* … */ @@index([scanId])              @@index([stationId, timestamp]) }
model BulkScan     { /* … */ @@index([scanId])              @@index([stationId, timestamp]) }
model FR0Scan      { /* … */ @@index([scanId])              @@index([stationId, createdAt]) }
model CLScan       { /* … */ @@index([scanId])              @@index([stationId, createdAt]) }   // table CLScans
model ManualWarehouse { /* … */ @@index([timestamp]) }
model FR0BulkHOTO  { /* … */ @@index([scanId, timestamp]) }   // replaces @@index([scanId])
model CourierHandover { /* … */ @@index([partner, awb]) }
model OperationsMetadata { /* … */ @@index([locationId]) }
model ScannedBarcodeInventory { /* … */ @@index([scanLocation, scannedAt]) }   // table scanned_barcode_inventory
model NddShipment  { /* … */ @@index([createdAt]) @@index([awb]) }   // table ndd_shipments
```

**Remove** the redundant lines you drop in step 6: `@@index([pid])` and (if you
drop it) `@@index([location])` on `ManualWarehouseSetUp`, and `@@index([barcode])`
on both `ScannedBarcodeInventory` and `ScannedBarcodeInventoryTransfer`, and the
old single `@@index([scanId])` on `FR0BulkHOTO`.

---

## 8. Data-retention plan (6-month cutoff)

**Cutoff:** `NOW() - INTERVAL 6 MONTH` (for a run on 2026-06-18 → rows strictly
older than **2025-12-18**). Computed once per run so all tables share one boundary.

**Approach (per `03_archive_and_purge.sql`):** for each eligible table, archive
old rows into the matching `mydb_history` table (`INSERT IGNORE`, idempotent), then
delete them from `mydb` in batches of ~2000 with a short pause — keeping locks
tiny and referential state intact (no FKs exist, so no cascade concerns).

### Eligible — append-only event/log tables (archived then purged)

| Table | Timestamp column |
|---|---|
| `PackingScan` | `timestamp` |
| `DispatchScan` | `timestamp` |
| `BulkScan` | `timestamp` |
| `FR0Scan` | `createdAt` |
| `CLScans` | `createdAt` |
| `ManualWarehouse` | `timestamp` |
| `FR0BulkHOTO` | `timestamp` |
| `fasttrackscan` | `time` |
| `CourierHandover` | `lastScan` |
| `MetalFrameFittingScan` | `timestamp` |
| `ndd_shipments` | `created_at` |
| `MaintenanceShopIssue` | `issuedAt` |
| `scanned_barcode_inventory_transfer` | `injested_at` |

### Excluded — purging would corrupt live/required data

| Table | Why excluded |
|---|---|
| `User` | Auth accounts; deleting by age would lock users out. |
| `ShippingMetadata` | Reference data, no timestamp; app does full-refresh on upload. |
| `OperationsMetadata` | Reference data, no timestamp; full-refresh on upload. |
| `ManualWarehouseSetUp` | Master data (PID→location); `createdAt` is creation, not expiry. |
| `InventoryPID` | Reference data, no timestamp. |
| `scanned_barcode_inventory` | **Live stock state** — rows represent currently scanned-in inventory (removed on stock-out/transfer). Age-based deletion would silently drop real inventory. |
| `order_update_dashboard_study` | Snapshot table — `TRUNCATE`d and fully reloaded on each upload; not an accumulating history. |
| `EHSDeviation` | Safety/compliance records, typically retained for years. Excluded from the 6-month default; opt in only per your compliance policy. |

> All eligible tables have an integer/bigint surrogate `id` PK, so the batched
> delete keys on `id` generically. To opt an excluded table in later, add a `CALL`
> in `03` with its timestamp column **after** confirming the policy.

---

## 9. History schema (`mydb_history`)

In MySQL a "schema" **is** a database, so `mydb_history` is created as a sibling
database. `01_create_history_schema.sql` issues one
`CREATE TABLE IF NOT EXISTS mydb_history.<t> LIKE mydb.<t>` per table, which copies
**columns, primary keys, unique constraints and secondary indexes** exactly, with
**no data** and no foreign keys (there are none). All **21** `mydb` tables are
cloned (not only the purge-eligible ones) so the history schema is a complete
structural mirror, as required.

Archival (`03`) populates only the eligible event tables. Re-inserting old rows
preserves their original `id` values, keeping main↔history correlation intact.

---

## 10. Deliverables & run order

| File | Purpose |
|---|---|
| `00_analysis_report.md` | This report. |
| `01_create_history_schema.sql` | Create `mydb_history` + clone all 21 tables (structure only). |
| `02_create_indexes.sql` | Create the 17 justified indexes (idempotent, online). |
| `03_archive_and_purge.sql` | Archive >6-month rows to history, then batched delete. |
| `04_review_redundant_indexes.sql` | Inspect & optionally drop duplicate/unused indexes. |
| `99_rollback.sql` | Restore purged rows, drop new indexes, (optional) drop history schema. |
| `README.md` | Prerequisites, run order, safety, Prisma reconciliation. |

**Recommended order:** `01` → `02` → (`04` after review) → `03`. Validate on a
staging copy first. See `README.md` for the full operational checklist.

---

## 11. Safety properties (per task §C)

- ✅ **Online DDL** — `ALGORITHM=INPLACE, LOCK=NONE` on all index create/drop.
- ✅ **No long locks** — retention deletes are batched (~2000) with inter-batch sleep.
- ✅ **Batched deletes** — looped `DELETE … LIMIT` keyed on PK.
- ✅ **Referential integrity** — `mydb` has no FKs; archive-before-delete prevents loss.
- ✅ **Idempotent** — `IF [NOT] EXISTS` guards on DB/table/index; `INSERT IGNORE` on archive/restore.
- ✅ **Index existence verified** — every create/drop checks `information_schema.STATISTICS`.
- ✅ **No application logic changed** — all changes are out-of-band SQL; the only
  recommended code touch is optional `@@index` sync in `schema.prisma` (§7).
- ✅ **Rollback provided** — `99_rollback.sql` for indexes and purged data.
