# MySQL dashboard I/O incident — 2026-08-16

## Outcome

The shop-floor slowdown was caused by analytical queries doing repeated logical
full-table scans, not by an exhausted InnoDB buffer pool or a current disk stall.
Seven timestamp-leading indexes are live, the optimizer uses them, and a real
dashboard refresh completed its panels in 0.8–20 ms after remediation.

No live or archived business row was deleted, updated, purged, or truncated.
No query needed to be cancelled during the change.

## Evidence before remediation

- MySQL had previously reached 1,001 used connections against a limit of 1,000.
- Performance Schema showed the Packing dashboard's two worst statements averaging
  about 214–219 seconds over roughly 66k–68k executions.
- Other Packing statements had cumulatively examined hundreds of billions of rows.
- Courier dashboard bursts averaged about 20 seconds and examined roughly 3.3M
  rows per statement.
- `EXPLAIN` showed full scans on the time-range paths. Representative estimates:

| Table | Before | After |
|---|---:|---:|
| PackingScan | ~6.50M | ~68k |
| DispatchScan | ~2.43M | ~33k |
| CourierHandover | ~3.49M | ~47k |
| FR0Scan | ~1.24M | ~9.4k |
| FR0BulkHOTO | ~2.04M | ~33k |
| CLScans | ~383k | ~12k |
| BulkScan | ~594k | ~8.6k |

The after values are one-day range estimates and every plan uses the intended
timestamp-leading range index.

## Changes applied

- Added online (`ALGORITHM=INPLACE, LOCK=NONE`) indexes:
  - `PackingScan(timestamp, scanId, stationId)`
  - `DispatchScan(timestamp, scanId, stationId)`
  - `CourierHandover(lastScan, awb)`
  - `FR0Scan(createdAt, scanId, stationId)`
  - `FR0BulkHOTO(timestamp, scanId, stationId)`
  - `CLScans(createdAt, scanId, stationId)`
  - `BulkScan(timestamp, scanId, stationId)`
- Set and persisted `max_execution_time=60000` to cap read-only SELECTs at 60s.
- Declared the indexes in `prisma/schema.prisma` so schema reconciliation preserves
  them.
- Updated the guarded rollback SQL for every new index and the SELECT guard.
- Fixed the existing archive schema drift on two empty history tables:
  - added six missing transfer columns;
  - aligned `ndd_shipments.created_at` to `datetime(3)`.
  Row counts were checked before and after and remained zero on both tables.

## Post-change validation

A 30-second sample showed:

- 49 connected / 2 running threads;
- no active query queue;
- no InnoDB log or row-lock waits;
- 99.539% buffer-pool hit rate;
- about 209 KiB/s physical reads and 334 KiB/s writes;
- the captured dashboard queries completing in roughly 8–20 ms.

A separate 45-second observation recorded no new connection-limit errors, no
pending InnoDB I/O, and no slow-query accumulation.

## Safe operator commands

```powershell
node database/mydb-optimization/10_triage_dashboard_indexes.cjs check
node database/mydb-optimization/10_triage_dashboard_indexes.cjs explain
node scripts/diagnose-database-io.cjs 30
node database/mydb-optimization/11_sync_history_schema.cjs check
```

Do not run the purge or broad `COUNT(*)` diagnostics during an I/O incident.
Rollback definitions are in `99_rollback.sql`; review the optional guard rollback
before using it because unlimited analytical queries caused this incident.

## Remaining operational work

- Configure and restore-test an encrypted off-host backup that includes
  `mydb_history`, routines, triggers, and events. Same-host history is not a
  disaster-recovery backup.
- Add a time bound or materialized aggregate for the CL/CLS all-time multi-station
  panel; an index cannot narrow a query with no time predicate.
- Replace PID Hunter's repeated full-history “latest row per barcode” windows with
  a transactionally maintained current-state projection before that event table
  grows large.
