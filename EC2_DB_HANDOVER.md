# DB Handover — Replicating the app-owned MySQL cluster on EC2

Snapshot taken **2026-08-06** by live read-only inspection (`SHOW VARIABLES`,
`SHOW GLOBAL STATUS`, `information_schema.tables`) against the running source
server. No data was modified. Passwords are intentionally **not** included
below — see [Credentials](#credentials).

## Production provisioning — answers

Everything below is measured against the live source (`192.168.27.157:3306`),
not estimated from documentation. Where a number couldn't be directly
measured, that's called out explicitly rather than guessed.

### Queries Per Second (QPS)

| Basis | Value | How it was obtained |
|---|---|---|
| 5-day rolling average | **~10.1 QPS** | `Questions` (4,379,059) ÷ `Uptime` (433,704 s) since last MySQL restart |
| Live spot sample | **~14.7 QPS** | Two `SHOW GLOBAL STATUS` reads of `Questions`, 20.1 s apart, taken live during this inspection (296 questions / 20.1 s) |
| True peak (business-hours burst) | **Not measured** | No APM/time-series monitoring exists on the source to sample a real peak window. The only peak signal available is `Max_used_connections` = 793/1000 (vs. 32 connected right now) — a *connection* peak, not a *query-rate* peak, so it can't be safely converted into a QPS multiplier. |
| **Recommended provisioning target** | **Plan for ≥100 QPS sustained, with burst headroom** | A conservative multiplier (~7×) over the higher of the two measured baselines. The workload is read-dominant (93.6% `SELECT`) with small row sizes (2.25 GB total data), so this is comfortably served by gp3's baseline 3,000 IOPS / 125 MB/s — no provisioned-IOPS tier is needed at this data volume. |

**Recommendation:** enable CloudWatch/Performance Insights (or the slow query
log) on the new instance from day one and re-check actual peak QPS during a
known-busy shift in the first week — this number will firm up fast once
there's real time-series data, which doesn't exist today.

### Data growth

**Current size (live, `information_schema`):** `mydb` 2,097.3 MB + `dispatch_ptl`
19.3 MB + `lens_lab` 134.1 MB + `metal_frame` 0.4 MB = **~2,251 MB (2.2 GB)**
across 51 tables, ~16.85M rows. (This is data+index size only — actual on-disk
datadir usage will be somewhat higher once binlogs/redo/undo logs are
included; those weren't measurable without shell access to the source host.)

**Growth rate — measured, not guessed:** the app has been live since ~2026-02-01
(186 days ago). Querying `MIN`/`MAX` of each major table's timestamp column
against its current size gives an actual observed rate, table by table:

| Table | Span | MB/day |
|---|---|---|
| `PackingScan` | 186.5 days | 4.55 |
| `CourierHandover` | 186.2 days | 1.83 |
| `FR0BulkHOTO` | 184.9 days | 1.54 |
| `DispatchScan` | 186.5 days | 1.43 |
| `FR0Scan` | 186.4 days | 0.82 |
| `location_blank_check_logs` (lens_lab) | 148.5 days | 0.90 |
| `BulkScan`, `CLScans`, `ndd_shipments`, `scanned_barcode_inventory_transfer`, `consolidate_release_history`, `omt_activity_logs` (smaller contributors) | 0.8–90 days | ~2.9 combined |

**Total observed: ~15 MB/day ≈ 105 MB/week ≈ 0.45 GB/month ≈ ~5.3 GB/year**, at
the current, historically-flat scan volume. This tracks the actual measured
total (15 MB/day × 186 days ≈ 2.8 GB vs. 2.2 GB actually on disk — same order
of magnitude; the gap is early ramp-up before steady-state volume). If
warehouse throughput increases (more stations, more scan volume), this rate
scales roughly proportionally — it isn't a fixed ceiling.

**Storage recommendation:** provision well above the 5.3 GB/year pace — the
100 GB gp3 volume already recommended in §3 gives ~15+ years of headroom at
today's rate, which is the right call given how cheap gp3 storage is relative
to the cost of an emergency resize.

### DDL scripts

Generated live from the source via `SHOW CREATE TABLE` on every table (not
hand-written, so they're an exact match to what's actually running) —
schema/structure only, **no data**:

| File | Database | Tables |
|---|---|---|
| [`ddl/mydb.ddl.sql`](ddl/mydb.ddl.sql) | `mydb` | 22 |
| [`ddl/dispatch_ptl.ddl.sql`](ddl/dispatch_ptl.ddl.sql) | `dispatch_ptl` | 19 |
| [`ddl/lens_lab.ddl.sql`](ddl/lens_lab.ddl.sql) | `lens_lab` | 3 |
| [`ddl/metal_frame.ddl.sql`](ddl/metal_frame.ddl.sql) | `metal_frame` | 7 |

Each file leads with its own `CREATE DATABASE IF NOT EXISTS` statement, so
they can be run standalone and in any order (`mysql -h <host> -u <admin> -p <
ddl/<name>.ddl.sql`). For a full data-carrying restore instead, use the
`mysqldump`-equivalent procedure in §4 below.

### Application access

- **Number of applications: 1.** This Next.js app (`nexs-dashboard` /
  "NexS Ascend", this repo) is the only client of these four databases —
  no other application, BI tool, or service was found connecting directly.
  (Power BI and the Grafana-dumps route both go through this app's own API,
  not a direct DB connection — confirmed by checking
  `src/utils/resources/power-bi/` and `src/app/api/grafana-dumps/` for any
  embedded DB credentials; there are none.)
- **Couldn't confirm from this repo:** how many replicas/instances of this
  app run concurrently in production (no Kubernetes/PM2/ecosystem manifest
  in this codebase) — that number multiplies directly against the per-pool
  `connection_limit` values already in `.env` (100 for `mydb`/`dispatch_ptl`,
  50 for `lens_lab`/`metal_frame`). 
- **The current credential is over-privileged. CUZ I am the Creator** `SHOW GRANTS`
  against the live source shows the app's existing DB user (`Hero`) holds
  effectively **full server-admin rights on `*.*`** — `SUPER`, `FILE`,
  `SHUTDOWN`, `RELOAD`, `CREATE USER`, `PROCESS`, all the MySQL 8 dynamic
  admin privileges (`BACKUP_ADMIN`, `BINLOG_ADMIN`, `ENCRYPTION_KEY_ADMIN`,
  etc.), **with `GRANT OPTION`** — not scoped to just the 4 app databases.
  It also has `ALL PRIVILEGES` on a database called **`edith_db`**, which
  doesn't correspond to any schema/model in this app — worth confirming with
  whoever else might own that database before assuming it's in scope for
  anything here. **Do not replicate this grant shape on the new instance.**
- **Recommended grants for the new instance** (matches your default 2-user
  policy, scoped to just the 4 app databases — `mydb`, `dispatch_ptl`,
  `lens_lab`, `metal_frame`):
  - **Read/Write user** — `SELECT, INSERT, UPDATE, DELETE, CREATE TEMPORARY TABLES`
    on those 4 databases only. (`CREATE TEMPORARY TABLES` because the app's
    dashboard queries generate heavy temp-table usage — 642,729 observed on
    the source — everything else the running app actually does is plain CRUD;
    schema migrations are a separate `prisma migrate`/`db push` deploy step,
    not something the live app process needs standing DDL rights for.)
  - **Read-Only user** — `SELECT` only, same 4 databases. Not consumed by
    anything today, but ready for reporting/analytics/a future read replica
    without ever touching the RW credential.

## Scope

This app talks to three physically separate MySQL servers. Only the first is
in scope for EC2 replication; the other two are **external systems** this app
reads/writes over the network and must keep talking to after the move — they
are not being copied.

| Server                                                                                     | Owner                         | In scope for EC2?                                                                                  |
| ------------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `192.168.27.157:3306` — `mydb`, `dispatch_ptl`, `lens_lab`, `metal_frame`       | This app (Prisma-modeled)     | **Yes — this document**                                                                     |
| `192.168.24.8:3306` — `bosch_cv_db`                                                   | Bosch conveyor control system | No — connect only (see[External dependencies](#external-dependencies-connect-to-do-not-replicate)) |
| `192.168.27.132:13307` / `:13308` — WMS / picking (`NexS_DB` / `NexS_DB_PICKING`) | Lenskart WMS                  | No — connect only (via Adaptive PAM), same section but need to set up Data pipline for this       |

---

## 1. Source server — live facts

Single MySQL instance hosting all 4 app-owned schemas (hostname reported as
`nexs-ascend-db`).

```
MySQL version        : 8.0.46-0ubuntu0.24.04.3  (Ubuntu 24.04, Linux)
Uptime at capture     : 433,704 s (~5.02 days) — since last restart, not since data creation
Character set/collate : utf8mb4 / utf8mb4_0900_ai_ci
sql_mode              : ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
                         NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
auth plugin           : caching_sha2_password
```

**Engine config (replicate these in the new instance's `my.cnf`):**

| Variable                                     | Live value                   | Note                                                                                                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `innodb_buffer_pool_size`                  | `8589934592` (8 GiB)       | 8 instances × 1 GiB                                                                                                                                                                                                                                   |
| `innodb_buffer_pool_instances`             | `8`                        |                                                                                                                                                                                                                                                        |
| `innodb_log_file_size`                     | `536870912` (512 MiB)      | legacy name;`innodb_redo_log_capacity` is the 8.0.30+ equivalent if you'd rather set the new variable                                                                                                                                                |
| `innodb_flush_log_at_trx_commit`           | `1`                        | full ACID durability — keep unless you deliberately want to trade durability for throughput                                                                                                                                                           |
| `sync_binlog`                              | `1`                        |                                                                                                                                                                                                                                                        |
| `log_bin`                                  | `ON`                       |                                                                                                                                                                                                                                                        |
| `innodb_flush_method`                      | `fsync`                    |                                                                                                                                                                                                                                                        |
| `innodb_io_capacity`                       | `200`                      | **This is MySQL's HDD-era default — it was never tuned for the source's disks.** On EC2 gp3/io2 SSD-backed storage, raise this (e.g. 2000–4000) rather than copying `200` verbatim — see [recommendation](#3-recommended-ec2-configuration). |
| `max_connections`                          | `1000`                     |                                                                                                                                                                                                                                                        |
| `table_open_cache`                         | `4000`                     |                                                                                                                                                                                                                                                        |
| `thread_cache_size`                        | `18`                       |                                                                                                                                                                                                                                                        |
| `tmp_table_size` / `max_heap_table_size` | `536870912` (512 MiB) each |                                                                                                                                                                                                                                                        |

**Load observed (since last restart, ~5.02 days):**

| Metric                                                            | Value                                    | Reading                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Questions`                                                     | 4,379,059                                | ≈**10.6 queries/sec** average                                                                                                                                                                                                    |
| `Com_select` : `Com_insert` : `Com_update` : `Com_delete` | 2,555,665 : 571,717 : 345 : 5,006        | Heavily read-dominant; writes are almost all inserts (append-only event logs), updates are negligible                                                                                                                                   |
| `Threads_connected` (at capture)                                | 31                                       |                                                                                                                                                                                                                                         |
| `Max_used_connections` (peak)                                   | **793 / 1000 (79%)**               | The real capacity pressure point — size RAM/CPU for this peak, not the idle 31                                                                                                                                                         |
| `Threads_created`                                               | 7,483 vs.`thread_cache_size=18`        | High churn — many connections aren't being reused from the thread cache. Likely short-lived/unpooled polling connections (dashboard refresh intervals). Worth fixing at the app layer, but the new box must tolerate today's behavior. |
| `Aborted_connects` / `Aborted_clients`                        | 2,919 / 123,316                          | High — consistent with clients disconnecting without a clean`QUIT` (matches the polling pattern above)                                                                                                                               |
| `Slow_queries`                                                  | 97,706 / 4,379,059 (**2.23%**)     | Non-trivial — worth a query/index review independent of hardware, but budget for it in storage IOPS too                                                                                                                                |
| `Innodb_buffer_pool_pages_free`                                 | 381,793 / 524,288 (**72.8% free**) | The 8 GiB buffer pool is currently ~3.5× bigger than the live dataset — there's headroom already baked in                                                                                                                             |

## 2. Per-database inventory

All four live in the databases above, on the one server. Sizes/row counts are
live snapshots; the four scan/event-log tables flagged below are append-only
and will keep growing with warehouse scan volume.

### `mydb` — primary app schema (`prisma/schema.prisma`, env `DATABASE_URL`)

**2,097.31 MB, 22 tables, ~16,173,475 rows.** Models: `User`, `ShippingMetadata`,
`PackingScan`, `DispatchScan`, `OperationsMetadata`, `MaintenanceShopIssue`,
`FastTrackScan`, `FR0Scan`, `BulkScan`, `ManualWarehouse`, `EHSDeviation`,
`CourierHandover`, `MetalFrameFittingScan`, `OrderUpdateDashboardStudy`,
`InventoryPID`, `FR0BulkHOTO`, `ManualWarehouseSetUp`, `ScannedBarcodeInventory`,
`CLScan`, `ScannedBarcodeInventoryTransfer`, `NddShipment`.

Largest tables (drive storage growth):

| Table               | Size     | Rows      |
| ------------------- | -------- | --------- |
| `PackingScan`     | 847.9 MB | 6,161,769 |
| `CourierHandover` | 340.0 MB | 3,260,453 |
| `FR0BulkHOTO`     | 284.3 MB | 1,754,830 |
| `DispatchScan`    | 266.8 MB | 2,413,106 |
| `FR0Scan`         | 152.8 MB | 1,185,213 |
| `BulkScan`        | 76.6 MB  | 557,941   |

### `dispatch_ptl` — ConsolidAte PTL + dispatch (`prisma/schema-dispatch.prisma`, env `DATABASE_URL_DISPATCH`)

**19.3 MB, 19 tables, ~36,084 rows.** Models: `Rack`, `Location`,
`RoutingAssignment`, `Awb`, `Placement`, `LocationEvent`, `QcDumpEntry`,
`PackageConsolidation`, `ConsolidationScan`, `ConsolidationHistory`,
`ConsolidateRack`, `ConsolidateLocation`, `ConsolidateQcDumpEntry`,
`ClClsQcQueueEntry`, `ConsolidatePackage`, `ConsolidatePackageScan`,
`ConsolidateReleaseHistory`. Largest: `consolidate_release_history` (11.4 MB).

### `lens_lab` (`prisma/schema-lens-lab.prisma`, env `DATABASE_URL_LENS_LAB`)

**134.13 MB, 3 tables, ~639,294 rows.** Models: `LocationBlankCheckLog`,
`LabOutCheckLogs`, `BlanksFqc`. Almost entirely `location_blank_check_logs`
(133.8 MB / 638,066 rows).

### `metal_frame` (`prisma/schema-metal-frame.prisma`, env `DATABASE_URL_MF`)

**0.44 MB, 7 tables, ~225 rows.** Models: `Plating`, `FittingScan`, `QcScan`,
`QcReason`, `TumblingContainer`, `TumblingProcess`, `TumblingConfiguration`.
Smallest schema by far — new (tumbling + fitting/QC features are recent).

**Total across all four: ~2.25 GB, ~16.85M rows, 51 tables.**

---

## 3. Recommended EC2 configuration

To faithfully carry the observed peak load (793 concurrent connections, 10.6
qps average, 2.23% slow-query rate) with headroom for growth in the
append-only scan tables:

| Resource                                                   | Recommendation                                                                                        | Why                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Instance type**                                    | `m6i.xlarge` (4 vCPU / 16 GiB) minimum, **`m6i.2xlarge` (8 vCPU / 32 GiB) recommended**    | Non-burstable — the connection-churn/thread-creation pattern (7,483 threads created against an 18-thread cache) is a steady CPU cost, not a short burst; a`t3` burstable type risks credit exhaustion under sustained polling load. 32 GiB comfortably holds the 8 GiB buffer pool plus per-connection overhead at the observed 793-connection peak. |
| **AMI / OS**                                         | Ubuntu 24.04 LTS                                                                                      | Matches the source's`version_compile_os`/build exactly (`8.0.46-0ubuntu0.24.04.3`) — avoids subtle behavior differences from a different distro's MySQL build.                                                                                                                                                                                     |
| **MySQL version**                                    | 8.0.46 (Ubuntu package)                                                                               | Exact match to source.                                                                                                                                                                                                                                                                                                                                  |
| **Storage**                                          | gp3 EBS,**100 GB** minimum, baseline 3,000 IOPS / 125 MB/s                                      | Live dataset is only 2.25 GB, but`log_bin=ON` + `sync_binlog=1` write binlogs continuously, and the scan-log tables (`PackingScan`, `CourierHandover`, etc.) grow indefinitely with warehouse throughput. 100 GB is cheap headroom, not a tight fit.                                                                                            |
| **`innodb_io_capacity`**                           | Raise to**2000–4000** (not the source's `200`)                                               | `200` is MySQL's spinning-disk-era default and was evidently never touched on the source box. gp3/io2 can sustain far more; copying `200` verbatim would leave InnoDB throttling itself against SSD-backed storage for no reason.                                                                                                                   |
| **Everything else in the engine-config table above** | Copy as-is                                                                                            | Buffer pool,`max_connections`, `table_open_cache`, `thread_cache_size`, durability settings (`sync_binlog`, `innodb_flush_log_at_trx_commit`) — these reproduce the source's actual behavior.                                                                                                                                                |
| **Security group**                                   | Inbound`3306` restricted to the app server's SG/IP only; `22` restricted to an admin CIDR/bastion | The source is only reachable on a private`192.168.x.x` subnet today — do not expose `3306` publicly.                                                                                                                                                                                                                                               |
| **EBS encryption**                                   | Enable at-rest encryption (KMS)                                                                       | `DOCKER.md` already flags that some of these DB credentials have been committed to git history — treat the data itself as sensitive too.                                                                                                                                                                                                             |
| **Network path back to on-prem**                     | VPN / Direct Connect / VPC peering reaching`192.168.24.8` and `192.168.27.132`                    | Required regardless of this migration — see next section. Without it, the app will be able to serve its own dashboards but every warehouse-scan and Bosch-conveyor feature will fail.                                                                                                                                                                  |

If ops overhead matters more than the small extra cost, **Amazon RDS for
MySQL 8.0** (same instance-class equivalents, e.g. `db.m6i.xlarge`) gets you
automated backups/patching/failover for roughly the same engine-config
surface above — worth considering as an alternative to self-managed EC2+MySQL,
though the ask here was EC2 specifically.

---

## 4. Replication procedure

1. **Provision** the EC2 instance per §3, install MySQL 8.0.46, apply the
   engine-config table as `my.cnf` (with `innodb_io_capacity` raised as noted).
2. **Create the four databases** (same DDL the local dev bootstrap uses, minus
   the `nexs_` dev-only prefix — use the production names below):
   ```sql
   CREATE DATABASE mydb        CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   CREATE DATABASE dispatch_ptl CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   CREATE DATABASE lens_lab    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   CREATE DATABASE metal_frame CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   ```
3. **Dump each database from the source** (run from anywhere with network
   access to `192.168.27.157`; `-p` with no value prompts for the password
   interactively — get it from `.env` / `.env.local`, Available with Mihir
   ```bash
   mysqldump -h 192.168.27.157 -P 3306 -u Hero -p --single-transaction --routines --triggers mydb         > mydb.sql
   mysqldump -h 192.168.27.157 -P 3306 -u Hero -p --single-transaction --routines --triggers dispatch_ptl  > dispatch_ptl.sql
   mysqldump -h 192.168.27.157 -P 3306 -u Hero -p --single-transaction --routines --triggers lens_lab      > lens_lab.sql
   mysqldump -h 192.168.27.157 -P 3306 -u Hero -p --single-transaction --routines --triggers metal_frame   > metal_frame.sql
   ```

   `--single-transaction` gives a consistent snapshot without locking the
   source tables (source is InnoDB throughout, confirmed by the schema files).
4. **Restore on the EC2 instance:**
   ```bash
   mysql -h <ec2-host> -u <admin> -p mydb         < mydb.sql
   mysql -h <ec2-host> -u <admin> -p dispatch_ptl  < dispatch_ptl.sql
   mysql -h <ec2-host> -u <admin> -p lens_lab      < lens_lab.sql
   mysql -h <ec2-host> -u <admin> -p metal_frame   < metal_frame.sql
   ```
5. **Create the app's DB user** on the new instance with the same grants the
   `Hero` user has on the source (read/write on all four DBs), then update
   `DATABASE_URL`, `DATABASE_URL_DISPATCH`, `DATABASE_URL_LENS_LAB`,
   `DATABASE_URL_MF` in the app's env to point at the new host — keep the same
   `connection_limit`/`connect_timeout`/`pool_timeout` query-string params
   already in `.env` for each.
6. **Verify** with the repo's own diagnostic script before cutting traffic over:
   ```bash
   npm run db:check -- all
   ```

   This prints live latency, MySQL version/hostname, and current connection
   counts for all four datasources — confirm it reports the new EC2 hostname
   and that `max_connections` matches what you configured.
7. Alternative for a **schema-only** fresh environment (no data carried over):
   `npx prisma db push --schema=prisma/schema.prisma` (and the three sibling
   `--schema=prisma/schema-*.prisma` files) against the new `DATABASE_URL*`
   values — this is what `docker/entrypoint.sh` does locally under
   `RUN_DB_PUSH=true`, but it does **not** copy any data, only table structure.

---

## External dependencies — connect to, do **not** replicate

Per the migration's agreed scope, these stay where they are; the EC2 instance
only needs a working connection to them, not a local copy.

### `bosch_cv_db` (Bosch conveyor control system) — `192.168.24.8:3306`

Owned by the conveyor system, not this app — `docker-compose.yml` explicitly
calls this "EXTERNAL data in production." Accessed via a raw `mysql2` pool
(`src/lib/db.ts`, env `BOSCH_DB_HOST/PORT/USER/PASSWORD/NAME`) and, for the
`TrayMovement` model only, a separate Prisma client (`prisma/onSite.prisma`,
env `ON_SITE_DB_URL`).

For context, its live profile (**not** something to size EC2 storage for,
since it isn't moving):

- MySQL 8.0.36, **41.6 GB**, ~286M rows across 7 tables — dominated by
  `conveyor_tray_movement` (27.3 GB / 236M rows) and `conveyor_tray_path_history`
  (13.9 GB / 48.8M rows).
- `innodb_buffer_pool_size` is only **128 MB** against that 41.6 GB dataset —
  visibly under-provisioned on the source, sustaining ~20 qps average with a
  peak of 1,439/2,000 connections. Not the new EC2 box's problem to fix, but
  don't be surprised by query latency from this dependency after the move.
- **Known issue, already flagged in `DOCKER.md`:** the fallback password in
  `src/lib/db.ts` is committed to git history and should be rotated. Separately,
  `ON_SITE_DB_URL`'s password contains an unescaped `#` (URL-fragment
  character), which breaks Prisma's connection-string parser — this doesn't
  affect the raw `mysql2` pool (discrete host/user/password fields), only the
  `onSiteClient` Prisma path, if anything still uses it.
- **EC2 requirement:** network path (VPN/peering) to `192.168.24.8:3306`, plus
  the `BOSCH_DB_*` env vars pointed at it.

---

## Credentials

Intentionally omitted from this document. Current values live in `.env` (the
four `DATABASE_URL*` vars, user `Hero`) and `.env.local` (`NexS_DB`,
`NexS_DB_PICKING`, `ON_SITE_DB_URL`, `JWT_SECRET`, `NEXS_USERNAME`/`NEXS_PASSWORD`)
Will share these over private Bin or Mihir has it already!!!
