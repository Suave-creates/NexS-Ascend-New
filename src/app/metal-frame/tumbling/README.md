# Tumbling Process Management

Metal Frame plugin for tracking the 12-hour tumbling process across 22 stations, each with a Left and Right container. Built as an add-on — it does not modify any other module.

## Where things live

```
prisma/schema-metal-frame.prisma        Tumbling models (appended, 3 tables total)
prisma/migrations/20260714090000_tumbling_consolidated/   Hand-authored, idempotent migration SQL

src/services/metal-frame/tumbling/      All business logic (API routes stay thin)
  types.ts                 Shared DTOs/types (server + client)
  progress.service.ts      Pure progress % / remaining-time math (one source of truth)
  config.service.ts        Single-row configuration (duration, near-completion threshold)
  container.service.ts     44 containers: idempotent init, station/container queries
  process.service.ts       Draft/start/cancel/complete-early/stop, auto-completion sweep
  authorization.service.ts Verifies employeeCode+password for Complete Early/Stop/Settings
  adminAccess.ts           Single shared-token gate for the Users admin page (TUMBLING_ADMIN_TOKEN)
  userAdmin.service.ts     Create/list/reset-password against the portal's User table
  audit.ts                 Pure helper that appends one entry to a process's event timeline
  history.service.ts       Paginated, filterable process history
  qr.service.ts            Per-station QR code generation
  validators.ts            Hand-rolled input validation + STOP/EARLY-completion reason lists

src/app/api/metal-frame/tumbling/       Thin route handlers only
src/app/metal-frame/tumbling/           Frontend
  page.tsx                 Dashboard (22 station cards) — the primary entry point
  _components/             StationModal, ProcessDetailModal, ContainerPanel, format.ts, statusStyles.ts, etc.
                            (no separate _lib folder — shared helpers live alongside the components that use them)
  processes/page.tsx        Process history (server-side paginated/filterable)
  qr-codes/page.tsx         Printable QR codes, one per station
  settings/page.tsx         Container display names/active state + process defaults
  admin-users/page.tsx      Token-gated: create portal login accounts / reset passwords
```

## Data model — 3 tables

- **`TumblingContainer`** — 44 static rows (22 stations × Left/Right). A "station" is just a `stationNumber` shared by two container rows; there is no separate Station table.
- **`TumblingProcess`** — the whole transactional record. `products` and `events` (the immutable audit timeline) are JSON columns on this row, not child tables — they're always read/written together with their process and never queried independently at this scale.
- **`TumblingConfiguration`** — a single settings row (`id = 1`): `defaultDurationMinutes`, `nearCompletionThresholdMinutes` (it also still has an unused `additionalFieldLabel` column from an earlier design — left in place rather than migrated away, see note in **Configuration** below).

One active (`DRAFT`/`RUNNING`) process per container is enforced by a real DB unique constraint (`activeSlotContainerId`), not just application logic.

## Key business rules

- **One product per process.** A container's process is created with exactly one product (PID, Sheet Code, Model Number, Quantity). There is no add/remove-product flow — to change the product, cancel the draft and create a new one.
- **12-hour default duration**, stored per-process (not read from config at completion time), so changing the default later never alters history.
- **Automatic completion is backend-driven.** Every read path (`dashboard`, `stations/[n]`, `processes`, `processes/[id]`) calls `autoCompleteDueProcesses()` first, which flips any `RUNNING` process past its `expectedCompletionAt` to `COMPLETED`. No cron/scheduler — the repo has none, so this "sweep on read" pattern is the source of truth instead of relying on a browser timer.
- **Complete Early / Stop require authorization** (employee code + password + a reason from a fixed list + optional remarks). See **Authorization** below — this is the one thing that needs a manual step before those actions will work.

## Authorization — read this before testing Complete Early / Stop / Settings

There is no role/permission system in this portal. Complete Early, Stop, and Settings changes verify the submitted `employeeCode` + `password` against the **existing** `User` table (`prisma/schema.prisma`, bcrypt-hashed), the same store the portal's own login screen uses. Any account that can log in to the portal can authorize these actions — there are no separate admin/supervisor tiers.

The portal itself has no signup endpoint, so this plugin adds one narrowly-scoped admin page to manage those accounts:

### `/metal-frame/tumbling/admin-users` — create/reset login accounts

Gated by a single shared secret, **not** an employeeCode/password — set `TUMBLING_ADMIN_TOKEN` in your `.env` before this page will work (it fails closed: unset token = page unreachable, `503`). Whoever holds that token can:

- Create a new `User` row (employeeCode + password) — this account can then authorize Complete Early / Stop / Settings anywhere in Tumbling.
- Reset the password on an existing account.

The token is sent as an `x-tumbling-admin-token` header, checked server-side with a timing-safe comparison; the browser only keeps it in `sessionStorage` (cleared when the tab closes), not `localStorage`. There's a small "Manage login accounts →" link on the Settings page, but it's intentionally not in the sidebar nav.

**This creates/edits rows in the portal-wide `User` table**, which other modules (EHS, login) also read — resetting an existing account's password changes that person's real portal login, not just Tumbling access.

## Dashboard

Header has direct links to History / QR Codes / Settings (no need to go through the sidebar). Filter tabs are `All / Running / Available / Draft / Completed / Stopped` — "Completing Soon" and "Inactive" were dropped as filter tabs (too narrow to be worth a dedicated tab), though both concepts still exist: "Completing Soon" still drives the KPI tile and the station card's progress-bar color (see below), and "Inactive" still shows on a container's own status badge.

Each running container's progress bar changes color as it advances — blue for the first half, green past the halfway point, then amber once it's within the configured near-completion threshold — instead of a single flat color for the full 12 hours.

## Configuration

Editable from `/metal-frame/tumbling/settings` (each save re-verifies credentials):

| Key | Default | Notes |
|---|---|---|
| `defaultDurationMinutes` | 720 | Applied to new processes only |
| `nearCompletionThresholdMinutes` | 60 | Drives the dashboard's "Completing Soon" state |

The product form's 4th field was originally a configurable-label "Additional Reference" field; it's now a fixed **Quantity** (positive whole number) field, no longer configurable. The `additionalFieldLabel` column still exists on `TumblingConfiguration` (unused) — left in place rather than migrated away, since it's harmless and this repo's migrations are hand-run by the user rather than via `prisma migrate`.

## QR codes

`/metal-frame/tumbling/qr-codes` generates one QR per station pointing at `/metal-frame/tumbling?station=N` — scanning it opens the dashboard with that station's modal already open. Uses the `qrcode` npm package (the one new dependency this plugin adds; nothing existing covered QR generation).
