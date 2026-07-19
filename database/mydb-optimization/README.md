# `mydb` Optimization & History Schema — Operations Guide

Production-safe migration set for the **`mydb`** database only. It (1) builds a
structural history schema, (2) adds indexes justified by real `src/app/api` query
patterns, and (3) archives + purges data older than 6 months in batches.

Full reasoning is in **`00_analysis_report.md`**. This file is the run checklist.

---

## Prerequisites

- **MySQL 8.0+ (InnoDB).** Also works on 5.7. The scripts use stored procedures,
  so run them with a client that honours `DELIMITER`:
  - `mysql` CLI: `mysql -h <host> -u <user> -p < 01_create_history_schema.sql`
  - MySQL Workbench / DBeaver: open the file and "Execute script".
- A login with: `CREATE`/`ALTER`/`INDEX` on `mydb`, `CREATE` for a new database,
  and `INSERT`/`DELETE` on both schemas.
- **The target database is assumed to be named `mydb`.** If your live DB has a
  different name (check `DATABASE_URL`), find-and-replace `mydb` → `<your_db>` in
  every `.sql` file first. Keep `mydb_history` consistent.

---

## Run order

```
01_create_history_schema.sql        # create mydb_history + clone all 21 tables
02_create_indexes.sql               # add the 17 justified indexes (online)
04_review_redundant_indexes.sql     # OPTIONAL: review, then drop duplicates
03_archive_and_purge.sql            # archive >6-month rows -> history, batched delete
05_schedule_retention_event.sql     # OPTIONAL: make retention recurring (monthly EVENT)
```

Run `04` **before** `03` if you want the leaner index set in place first; it is
optional either way. `01` must precede `03` (history tables must exist).

Rollback at any time with **`99_rollback.sql`** (section A restores purged rows,
section B drops the new indexes, section C optionally tears down the history DB).

---

## Strongly recommended: rehearse on staging

1. Restore a recent backup into a staging server.
2. Run `01` → `02` → `03`; check the per-table `archived_rows` / `purged_rows`
   output and the verification queries at the foot of each script.
3. Smoke-test the affected endpoints (scan dedup, `/stats`, NDD export,
   pid-hunter, EHS list).
4. Time the purge against production-sized data to size your maintenance window.

Take a fresh backup of `mydb` immediately before running `03` in production.

---

## Safety properties (how each requirement is met)

| Requirement | How |
|---|---|
| Online DDL | `ALGORITHM=INPLACE, LOCK=NONE` on every `CREATE/DROP INDEX`. |
| No long locks | Retention deletes run in ~2000-row batches with a short `SLEEP` between them. |
| Batched deletes | `DELETE … JOIN _purge_ids` loop keyed on PK `id`. |
| Referential integrity | `mydb` has no FKs; each batch is archived **before** it is deleted. |
| Idempotent | `IF [NOT] EXISTS` on DB/table/index; `INSERT IGNORE` on archive & restore. |
| Verify index existence | Every create/drop checks `information_schema.STATISTICS`. |
| Rollback | `99_rollback.sql`. |
| No app-logic changes | All out-of-band SQL. Only optional change is `@@index` sync below. |

---

## ⚠️ Prisma drift — do this after applying indexes

Indexes added by raw SQL are invisible to Prisma. The next `prisma migrate dev`
will try to **drop** them (and recreate anything you dropped). To prevent that,
mirror the final index set in `prisma/schema.prisma` using the exact `@@index`
lines in **`00_analysis_report.md` §7**, then reconcile without re-applying:

```bash
# confirm schema.prisma now matches the live DB (expect: no difference / empty migration)
npx prisma migrate diff \
  --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

If that diff is empty, Prisma and the database agree and no migration will touch
your indexes. (`prisma db pull` is the alternative: introspect the live DB back
into `schema.prisma`.)

---

## What is intentionally NOT purged

`03` only purges append-only **event/log** tables. `User`, reference/master-data
tables, **live `scanned_barcode_inventory`**, the `order_update_dashboard_study`
snapshot, and **`EHSDeviation`** (compliance) are excluded on purpose — see
`00_analysis_report.md` §8 for the rationale and how to opt one in later.

---

## File index

| File | What it does |
|---|---|
| `00_analysis_report.md` | Analysis: tables, query patterns, index justification, retention plan. |
| `01_create_history_schema.sql` | `CREATE DATABASE mydb_history` + `CREATE TABLE … LIKE` ×21. |
| `02_create_indexes.sql` | 17 indexes via guarded, online stored proc. |
| `03_archive_and_purge.sql` | Archive→history then batched purge for 13 event tables. |
| `04_review_redundant_indexes.sql` | Inspect + guarded-drop duplicate/unused indexes. |
| `05_schedule_retention_event.sql` | Recurring monthly retention via a server-side MySQL EVENT. |
| `99_rollback.sql` | Restore purged rows / drop new indexes / (optional) drop history DB. |
