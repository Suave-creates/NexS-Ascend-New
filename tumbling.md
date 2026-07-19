You don't actually need me to browse anything here — this is a writing task. You've given me a very detailed spec and asked me to consolidate it into a single, polished final prompt for Claude Code, with two specific edits applied:

1. Make the polished main dashboard the primary navigation/UX requirement.
2. Make `/metal-frame/tumbling` itself the station-card dashboard, and remove the redundant separate `/stations` listing page.

Here is the final prompt, ready to hand to Claude Code.

---

# Final Prompt: Build & Integrate the Tumbling Process Management Plugin

You are a senior full-stack engineer working inside an existing production portal. Build and integrate a complete **Tumbling Process Management** plugin into the existing application. **Do not create a separate standalone application.**

Before making any changes, inspect the current project structure, coding patterns, authentication, styling system, API conventions, database utilities, Prisma setup, reusable components, and existing Metal Frame modules.

## Required Paths

- Frontend pages/components: `src/app/metal-frame/tumbling`
- Backend API routes: `src/app/api/metal-frame/tumbling`
- Prisma models (append only): `prisma/schema-metal-frame.prisma`

There are already existing tables, models, data, APIs, and other plugins using this Prisma schema.

## Database Safety (Highest Priority)

Be extremely cautious. **Do not** rename, remove, reset, recreate, modify, or break any existing Prisma model, relation, enum, migration, table, column, index, API, or existing data. **Only append** the new Tumbling-specific models, enums, relations, indexes, and supporting code.

**Never run:** `prisma migrate reset`, `prisma db push --force-reset`, destructive migrations, table drops, column drops, database recreation, or seed commands that overwrite existing data.

Before changing the schema, read the full existing schema and identify: the database provider, table mapping conventions, snake_case vs camelCase, `@@map` usage, existing enum patterns, existing indexes, migration scripts, and the generated Prisma client location. Reuse the existing database client and conventions.

Create **only additive migrations**. Inspect the generated SQL before applying. It must contain only `CREATE TABLE`, `CREATE INDEX`, `ADD CONSTRAINT`, and safe inserts of missing initial station/configuration records. It must **not** contain `DROP TABLE`, `DROP COLUMN`, `ALTER` on existing unrelated tables, data deletion, table recreation, or schema reset. If the generated migration contains destructive or unrelated changes, stop and correct the Prisma schema before applying.

## Business Overview

The tumbling area contains **22 stations**, each with **2 containers** (Left and Right) — **44 containers total**. Each station has a QR code; scanning it opens that station's Tumbling page. Each station page is split into a Left Container panel and a Right Container panel. Operators add one or more products into either container and start a **12-hour** tumbling process with a live progress bar. After 12 hours the process automatically completes, remains in history, and the container becomes available again.

### Product Fields (all required by default)
- `PID`
- `Sheet Code`
- `Model Number`
- Additional field — labeled **"Additional Reference"** for now, but implement it so its **display label can be changed via configuration** without changing the database schema.

### Core Process Rules
- Each container can have only **one active process** at a time.
- A process may contain one or more products.
- Workflow: open station → select Left/Right → add products → review → start → runs 12h → auto-completes → stays in history → container frees.
- Store the 12-hour duration **on each process** (minutes or seconds) so historical records stay accurate if the default changes. Default: **720 minutes**.
- Container availability must be **derived from active processes** (DRAFT or RUNNING = occupied), not duplicated state.

### Process Statuses
`DRAFT`, `RUNNING`, `COMPLETED`, `COMPLETED_EARLY`, `STOPPED`, `CANCELLED`.

### Automatic Completion (backend is the source of truth)
Do not rely only on a browser timer. Whenever active processes are fetched, detect RUNNING processes past their `expectedCompletionAt`, update them to `COMPLETED`, set `completedAt`, and add an audit event for automatic completion. Make it **idempotent** so repeated requests don't create duplicate completion events. If the project already has a scheduler/cron/worker/queue, integrate with it too. Do not introduce heavy new infrastructure unless necessary.

### Early Completion & Stop (authorized only)
Operators may **Complete Early** or **Stop** a process before 12h only after authorization requiring: authorized user identifier, password, reason, remarks, and confirmation.

- **Do not store the password.** Never write passwords into logs, audit records, API responses, database records, console output, or error messages. Never send password data back to the client.
- Use the existing authentication/credential-verification mechanism. Do not implement insecure plain-text comparison. If no safe password-verification method exists, create a clearly isolated server-side authorization service using the existing auth provider/user system.
- Record: process ID, action type, authorized user, initiating operator, reason, remarks, action timestamp, original expected completion time, actual elapsed duration, and products affected.

### Roles & Permissions
Inspect and reuse the existing authorization system; use existing roles where possible. Enforce all permission checks **on the backend**, not just the UI.

- **Operator:** view stations/containers, add/remove products before start, start a process, view running/completed details. Cannot stop or complete early without authorization, edit history, or modify settings.
- **Supervisor / Authorized User:** authorize early completion and stopping, view audit history and all process details.
- **Administrator:** configure station names, activate/deactivate stations, configure the fourth-field label, default duration, near-completion threshold, and view full audit history.

## Database Design

Inspect existing Prisma naming patterns first, then add non-conflicting Tumbling models/enums, adapted to existing conventions. Use nullable user identifiers if the existing user model can't be safely related; do not force a cross-schema Prisma relation that would break generation. Store operator name snapshots where needed for audit reliability.

- **TumblingStation** — `id`, `stationCode` (unique), `stationNumber` (unique), `displayName`, `isActive`, `createdAt`, `updatedAt`. Support stations 1–22; never overwrite existing records.
- **TumblingContainer** — `id`, `stationId`, `side` (enum `LEFT`/`RIGHT`), `displayName`, `isActive`, `createdAt`, `updatedAt`. Unique `(stationId, side)`; one Left and one Right per station.
- **TumblingProcess** — `id`, `processCode`, `stationId`, `containerId`, `status`, `durationMinutes`, `startedAt`, `expectedCompletionAt`, `completedAt`, `stoppedAt`, `startedByUserId`, `completedByUserId`, `authorizedByUserId`, `completionType`, `stopReason`, `remarks`, `createdAt`, `updatedAt`.
- **TumblingProcessProduct** — `id`, `processId`, `pid`, `sheetCode`, `modelNumber`, `additionalReference`, `createdAt`, `updatedAt`. Index PID, Sheet Code, Model Number. Prevent duplicate PID within the same process; do not make PID globally unique.
- **TumblingProcessEvent** (immutable audit log) — `id`, `processId`, `eventType`, `performedByUserId`, `performedByNameSnapshot`, `authorizedByUserId`, `authorizedByNameSnapshot`, `reason`, `remarks`, `metadataJson`, `createdAt`. Event types: `PROCESS_CREATED`, `PRODUCT_ADDED`, `PRODUCT_REMOVED`, `PROCESS_STARTED`, `AUTHORIZATION_REQUESTED`, `PROCESS_COMPLETED_AUTOMATICALLY`, `PROCESS_COMPLETED_EARLY`, `PROCESS_STOPPED`, `PROCESS_CANCELLED`, `PROCESS_ACKNOWLEDGED`, `PROCESS_UPDATED`. Never store sensitive auth data in `metadataJson`.
- **TumblingConfiguration** — `id`, `key`, `value`, `valueType`, `description`, `createdAt`, `updatedAt`. Initial keys: `defaultDurationMinutes = 720`, `additionalFieldLabel = Additional Reference`, `nearCompletionThresholdMinutes = 60`. Use one consistent config strategy; no duplicate settings tables.

### Initial Station Setup
Create an **idempotent** initializer for 22 stations (codes `STATION-01` … `STATION-22`), each with a Left and Right container. Insert only missing stations/containers; never delete, recreate, or duplicate; safe to run repeatedly. Do not insert mock processes or fake product data.

## Frontend Routes (Next.js App Router)

- `/metal-frame/tumbling` — **the main station-card dashboard and primary entry point** (see Critical Main Dashboard Requirement below)
- `/metal-frame/tumbling/stations/[stationId]` — station detail
- `/metal-frame/tumbling/processes`
- `/metal-frame/tumbling/processes/[processId]`
- `/metal-frame/tumbling/qr-codes`
- `/metal-frame/tumbling/settings`

**Do not create a separate `/metal-frame/tumbling/stations` listing page.** `/metal-frame/tumbling` itself is the station dashboard; a redundant second stations-listing page must not be created. Adapt route names only if the portal has a clear established pattern.

---

## ⭐ Critical Main Dashboard Requirement (Primary Navigation & UX)

The Tumbling module must have **one polished, professional, visually impressive main page** at **`/metal-frame/tumbling`**. This is the primary entry point for the entire plugin. It must **not** be a basic table or plain admin page. Build a **modern industrial operations dashboard** showing all 22 stations as interactive station cards. This is the top navigation/UX priority of the plugin.

The dashboard must fit naturally inside the existing portal layout and reuse the portal's sidebar, header, typography, accent color, cards, buttons, icons, spacing, and dark-mode behavior.

### Main Page Layout
Tumbling page title; short operational summary; current date and last refresh time; search; status filters; summary KPI cards; responsive station card grid; auto-refresh/polling indicator.

### Dashboard Summary Section (values from backend, reflecting current state)
Total Stations · Running Containers · Available Containers · Completing Soon · Completed Today · Stopped or Interrupted Today.

### Station Card Grid
All 22 stations in a responsive grid: large desktop 4/row, standard desktop 3/row, tablet 2/row, mobile 1/row. **The full card is clickable** (not just a small button) and navigates to `/metal-frame/tumbling/stations/[stationId]`, where Left and Right containers are shown.

### Station Card Content
Each card prominently displays: station number, display name, active/inactive status, overall station status, last updated time. Inside each card, show **two clearly separated sections — Left Container and Right Container** — each showing: side, current status (Available / Draft / Running / Completed / Stopped / Inactive), active process code, product count, start time, expected completion time, remaining time, progress percentage, and a live progress bar.

Example card structure:

```
┌────────────────────────────────────────────┐
│ Station 08                    Running        │
│ Metal Frame Tumbling                         │
│                                              │
│ LEFT CONTAINER                               │
│ Running · 6 Products                         │
│ ███████████████░░░░░ 72%                     │
│ 3h 21m remaining · Completes at 9:30 PM      │
│                                              │
│ RIGHT CONTAINER                              │
│ Available                                    │
│ Ready for a new tumbling process             │
│                                              │
│ Last updated: 11:42 AM                    →  │
└────────────────────────────────────────────┘
```

### Card Status Logic
Derive overall station status from its two containers with priority: Stopped/error → Running → Completing Soon → Draft → Completed → Available → Inactive. If either container is stopped, show attention required; if either is running, show the station as running; if both available, show available; if mixed, clearly show both individual states. **Never hide the independent state of either container.**

### Progress Bar Behavior on Main Page
Running containers show a live progress bar on the dashboard card. It must use backend timestamps, update visually without a full-page refresh, show percentage/remaining time/expected completion, reach 100% after 12h, remain correct after refresh, reflect early completion/stopping, and never depend only on a browser timer. Use a lightweight local timer for smooth updates and periodically refresh backend data — **do not make one API request per second.**

### Visual Quality
Professional industrial dashboard: strong typography hierarchy, spacious cards, clear progress visualization, subtle elevation/borders, professional icons, consistent status badges, clear Left/Right distinction, accessible contrast, smooth hover/focus states, loading skeletons, empty and error states. Production-ready — not a generated CRUD interface. Don't overcrowd cards; without opening a station the user should see which containers are running, their progress, product count, remaining time, and which containers are available.

### Search & Filters
Search by station number, station name, PID, Sheet Code, Model Number, Process Code. Filters: All Stations, Running, Completing Soon, Available, Draft, Completed, Stopped, Inactive. Filtering must use backend-supported data or an optimized dashboard response.

### Station Card Interaction
On hover (desktop): slightly elevate/highlight with a clear clickable indication in the portal style. On click anywhere on the card: navigate to the station detail page, preserve dashboard filter state where practical, and show a loading transition/skeleton. Ensure inner buttons/links with separate actions don't accidentally trigger card navigation. Support keyboard navigation: cards are focusable, Enter/Space opens the station, use accessible labels.

### Dashboard API Response (optimized)
Create an optimized dashboard endpoint returning only what's needed to render the main page: station details, left/right container summaries, active process summary, product counts, progress timestamps, current status, last updated timestamp, dashboard aggregate counts, and current server time. **Avoid** returning full product lists, event timelines, or full process histories — fetch those only after opening station/process detail.

### Main Dashboard Acceptance Criteria
Complete only when: all 22 station cards are visible; every card shows both containers; running containers show correct live progress; available containers are clearly identified; product count, remaining time, and expected completion time are visible; clicking anywhere on a card opens that station; the dashboard is responsive and matches the portal design; it refreshes current process states; automatic completion is reflected without manual DB changes; and loading/empty/error/inactive/conflict states are handled — without loading unnecessary full history data.

---

## Other Frontend Pages

### Station Detail Page (`/stations/[stationId]`) — primary operator page
Display station number/name, current status, back-to-dashboard navigation, current server-synchronized time, last refresh time. Split into two large panels (Left/Right): side by side on desktop/tablet, stacked on mobile. The visual identity and status colors must match the main dashboard. Each panel shows: container name, available/occupied status, process code, status, progress bar, percentage, elapsed time, remaining time, start time, expected completion, product count, product list, and actions:
- **Available:** Add Products, View History
- **Draft:** Add Product, Remove Product, Review, Start Process, Cancel Draft
- **Running:** View Details, Complete Early, Stop Process
- **Completed:** View Summary, Start New Process, View History

### Add Products Flow (modal/drawer/panel per portal convention)
Multiple product rows, each with PID, Sheet Code, Model Number, configurable Additional Reference, and a Remove action. Include Add Another Product, Scan PID (where scanner input is supported), Save Draft, Start Process, Cancel. Validation: all required fields, trim whitespace, prevent empty rows, detect duplicate PID in the same process, inline validation, disable submit while a request is running, prevent double submission, and confirm station+container before starting with a real calculated confirmation, e.g. *"You are starting a 12-hour tumbling process for 6 products in Station 08 — Left Container. Expected completion: 14 July 2026, 9:30 PM."*

### Active Process View
Large progress bar, percentage, elapsed/remaining time, start time, expected completion, operator, product list, process timeline. Progress updates live client-side but all calculations use backend timestamps: `progress = elapsed / configured duration`, clamped 0–100, using server time or a server-provided offset to reduce clock-drift errors.

### Authorization Modal (Complete Early / Stop Process)
Secure modal with action title, authorized user ID/username, password, reason, remarks, confirmation checkbox.
- **Stop reasons:** Quality Issue, Machine Issue, Incorrect Product Loaded, Emergency Stop, Production Priority Change, Operator Error, Other.
- **Early completion reasons:** Process Verified Manually, Supervisor Approval, Product-Specific Reduced Duration, Testing or Trial Batch, Other.
- Buttons clearly labeled "Authorize and Complete Early" / "Authorize and Stop Process". Stopping requires an additional confirmation (destructive). Clear password fields immediately after submission or on close.

### Process History Page
Searchable, filterable, **server-side paginated** history. Columns: Process Code, Station, Container, Product Count, Start Time, Expected Completion, Actual Completion, Total Duration, Status, Started By, Authorized By, Reason. Filters: date range, station, container, status, operator, PID, Sheet Code, Model Number. Do not load full history into the browser.

### Process Detail Page
Process code, station, container, status, duration, start/expected/actual times, started by, completed/stopped by, authorized by, reason, remarks, product table, and an immutable event timeline.

### QR Code Management
One QR per station opening `/metal-frame/tumbling/stations/{stationId}` (prefer a stable station code / public-safe identifier over internal DB IDs). Show all 22 QR cards: station number, name, QR code, target URL, Print, Download. Also support Print All, printer-friendly layout, and search by station. "Download all as PDF" only if the project already has a safe PDF utility — do not add a large PDF library just for this.

### Settings Page (admins)
Configure station display names, station/container active state, default duration, additional-field label, near-completion threshold. Validate values. Default duration initially 720 minutes. Settings changes must not alter historical process durations.

## API Requirements

Create route handlers under `src/app/api/metal-frame/tumbling`, adapted to existing conventions (or server actions if the portal uses them — don't duplicate architecture). Suggested endpoints:

- **Dashboard:** `GET /dashboard` (optimized, per above)
- **Stations:** `GET /stations`, `GET /stations/[stationId]`, `PATCH /stations/[stationId]`
- **Containers:** `GET /containers/[containerId]`, `GET /containers/[containerId]/history`
- **Processes:** `GET /processes`, `POST /processes`, `GET /processes/[processId]`, `PATCH /processes/[processId]`, `POST /processes/[processId]/products`, `DELETE /processes/[processId]/products/[productId]`, `POST /processes/[processId]/start`, `POST /processes/[processId]/complete-early`, `POST /processes/[processId]/stop`, `POST /processes/[processId]/cancel`
- **Configuration:** `GET /configuration`, `PATCH /configuration`
- **QR Codes:** `GET /qr-codes`

### Validation & State Transitions
Use the existing validation library (reuse Zod if present). Validate IDs, required strings, status transitions, product arrays, duplicate PIDs, duration, authorization input, reason, remarks length, pagination, date filters, and sort fields. **Never trust client-sent status values.** Enforce legal transitions on the backend: `DRAFT→RUNNING`, `DRAFT→CANCELLED`, `RUNNING→COMPLETED`, `RUNNING→COMPLETED_EARLY`, `RUNNING→STOPPED`. Disallow: `COMPLETED→RUNNING`, `STOPPED→RUNNING`, product changes after start, starting with zero products, a second active process in one container, completing an already-completed process, and stopping an already-stopped process.

Return meaningful HTTP codes: 200, 201, 400, 401, 403, 404, 409 (conflicts), 500. Use a response structure consistent with the existing portal.

### Concurrency & Transaction Safety
Use DB transactions for critical operations. **Starting** atomically: confirm DRAFT, confirm ≥1 product, confirm no other active process in the container, set start time and expected completion, set RUNNING, add `PROCESS_STARTED` event. **Stopping/completing early** atomically: confirm RUNNING, verify authorization, update process, set timestamps, add audit event. Prevent two operators from starting separate processes in the same container using DB constraints where possible plus transaction-level checks. Return 409 for conflicts.

## Date/Time & Progress

Store all timestamps in **UTC**; display using the portal's timezone utilities (else user's local timezone, keeping UTC in DB). Never compute completion from local browser time alone. `expectedCompletionAt = startedAt + durationMinutes`.

Create **one shared progress utility**. Inputs: `startedAt`, `expectedCompletionAt`, `completedAt`, `status`, current server time. Outputs: elapsed ms, remaining ms, progress %, `isNearCompletion`, `isOverdue`. Completed/early/stopped processes must not keep increasing visually: auto-completion shows 100%; early completion shows actual elapsed % with a clear "Completed Early" status; stopped freezes at the stop timestamp.

## UI, Real-Time, Edge Cases, Audit, Security, Performance

- **UI/Styling:** Reuse the portal's layout, sidebar, header, breadcrumbs, cards, buttons, forms, tables, dialogs, toasts, icons, typography, theme, accent, dark mode, and skeletons. No second design system. Large touch targets; tablet/mobile-friendly; clear Left/Right identity; high contrast; don't rely on color alone (use icons + text); reserve red for stopped/errors/destructive; show loading/empty/error/disabled/offline states; confirm destructive actions.
- **Real-time:** Use the lightest compatible method — existing WebSocket/server-events, existing query polling, or periodic polling every 15–30s, plus a local 1-second display timer from server timestamps. Refresh backend data periodically to detect auto-completion, other-operator updates, station status changes, and container conflicts. **Never one request per second.**
- **Edge cases:** page refresh/browser close during active process; process completes while unviewed; two operators on the same station; two operators starting the same container; duplicate PID; large product lists; invalid QR; inactive station/container; failed authorization; expired session; network failure/retry; clock differences; process modified by another operator; missing configuration; partially initialized data; double-click multi-submit. For stale updates show: *"This container was updated by another operator. The latest information has been loaded."*
- **Audit:** Every important action (draft created, product added/removed, started, auto-completed, completed early, stopped, cancelled, config changed, station/container activated/deactivated) creates an append-only event recording who acted, who authorized (where applicable), timestamp, reason, remarks, and safe structured metadata.
- **Security:** Reuse existing auth middleware; protect every route; check permissions server-side; validate every request. Never expose password hashes, log passwords, or store plain text. Don't expose internal stack traces. Sanitize text fields, apply length limits, use the project's CSRF protection, avoid dynamic raw SQL (parameterize if unavoidable), and don't expose sensitive internal user fields.
- **Performance:** Index process status, container ID, station ID, started time, expected completion, PID, Sheet Code, Model Number, event process ID, and event creation time. Paginate history/audit/product-heavy searches. Avoid N+1 queries. Keep dashboard responses optimized (no full histories).

## Testing, Logging, Code Quality

- **Testing:** Use the existing framework (don't add a new one). Backend: create draft, add products, duplicate PID validation, start process, prevent zero-product start, prevent two active processes per container, progress calculation, automatic completion, early-completion auth, stop auth, invalid password, illegal transitions, audit event creation, config changes, pagination/filters. Frontend (where supported): station cards, Left/Right rendering, product form validation, progress display, authorization modal, disabled actions, conflict error handling.
- **Logging:** Use the existing logger for process-creation failures, state conflicts, auto-completion failures, authorization failures (never passwords), DB errors, and initialization errors. Return user-friendly errors, e.g. "This container already has an active process." / "At least one product is required before starting." / "This process has already been completed." / "Authorization failed." / "The station is currently inactive." / "The process was updated by another operator."
- **Code quality:** TypeScript; follow existing naming; reuse shared types; modular components; separate server logic from client UI; no duplicated business logic; comments only where non-obvious; no placeholders, fake responses, seed/mock process data, unnecessary file replacement, broad refactors, or version bumps; don't add dependencies an existing one can cover; **don't suppress TypeScript errors** with unnecessary `any`, `@ts-ignore`, or disabled lint rules.

## Implementation Sequence

1. **Inspection** — document framework, Metal Frame module structure, Prisma setup, auth, authorization, styling, validation, API conventions, logging, tests, and any existing QR/printing utilities.
2. **Plan** — before editing, give a concise plan: files to create/modify, Prisma models to add, API routes, frontend routes, reused components, migration safety approach. Do not ask for approval unless a genuinely blocking ambiguity exists — otherwise make the safest reasonable decision and continue.
3. **Prisma schema** — append only Tumbling models/enums; format and validate; generate migration SQL; inspect for destructive changes; do not apply anything destructive.
4. **Backend** — shared services, validation schemas, authorization helpers, progress utility, transactions, API routes, audit logging, automatic completion checks, station initialization. Keep business logic out of route handlers where practical.
5. **Frontend** — main dashboard (top priority), station detail, Left/Right panels, product entry flow, progress bar, history, process detail, authorization modal, QR page, settings.
6. **Verify** — type-check, lint, Prisma validation, existing tests, new tests, and a production build if practical. Fix all errors introduced by this plugin.

## Final Constraints
Don't build a separate app, break existing plugins, alter unrelated features, reset the DB, delete data, or modify existing tables unless absolutely required and proven safe. Prefer isolated Tumbling tables and backward-compatible operations. Ensure: all mutations are authorized and audited; the timer survives refreshes and browser closes; backend timestamps are the source of truth; each container has only one active process; multiple products per process; Left/Right work independently; all 22 stations initialize safely; QR scanning opens the correct station page; early completion and stopping require secure authorization; and the plugin looks and behaves like a native part of the portal.

## Required Final Output
After implementation, provide: summary of completed functionality; full list of files created; full list of files modified; Prisma models/enums added; migration name and SQL summary; confirmation that no existing models or data were removed; API routes created; frontend routes created; permission model used; automatic-completion implementation; tests added; commands run; build/lint/type-check/test results; assumptions made; and any remaining risks or manual deployment steps.

**Begin by inspecting the repository and existing Metal Frame modules, then present the implementation plan and proceed with the complete implementation.**
