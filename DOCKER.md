# Running NexS Ascend with Docker

Production image: **Next.js 15 standalone** on `node:22-bookworm-slim`, with
Chromium (puppeteer/PDF), a Python venv (NDD-RCA), and all 4 Prisma clients
regenerated for Linux.

## Quick start (local end-to-end)

```bash
cp .env.docker.example .env.docker      # edit secrets + external DB URLs
docker compose up --build
```

App: <http://localhost:3069>  ·  MySQL: `localhost:3306` (root / `nexs_root_pw`).

The bundled MySQL is created with the databases in `docker/mysql-init.sql`, and
with `RUN_DB_PUSH=true` the app pushes each Prisma schema on startup — so the
Prisma-modeled features (fitting, QC, packing/dispatch scans, EHS, shop-issue)
work out of the box.

## Build the image only

```bash
# NEXT_PUBLIC_* is inlined at build time — pass it as a build arg if you use it.
docker build -t nexs-ascend --build-arg NEXT_PUBLIC_AGENT_URL="" .
docker run -p 3069:3069 --env-file .env.docker nexs-ascend
```

## Environment variables

All runtime config lives in `.env.docker` (see `.env.docker.example`). Groups:

| Group | Vars |
|---|---|
| Prisma datasources | `DATABASE_URL`, `DATABASE_URL_DISPATCH`, `DATABASE_URL_LENS_LAB`, `DATABASE_URL_MF` |
| Raw mysql2 pools | `NexS_DB`, `NexS_DB_PICKING` (local dev), or `NEXS_DB_ADAPTIVE_ENDPOINT` / `NEXS_DB_PICKING_ADAPTIVE_ENDPOINT` (production, see below) |
| bosch_cv_db (`src/lib/db.ts`) | `BOSCH_DB_HOST/PORT/USER/PASSWORD/NAME` |
| MEI JobViewer End Cut | `ENDCUT_DB_HOST/PORT/NAME/USER/PASSWORD`, `ENDCUT_DB_ENCRYPT`, `ENDCUT_DB_TRUST_SERVER_CERTIFICATE`, `ENDCUT_DB_CONNECT_TIMEOUT_MS`, `ENDCUT_QUERY_TIMEOUT_MS`, `ENDCUT_QUERY_RETRIES` |
| App | `JWT_SECRET`, `AUTH_COOKIE_SECURE`, `BQ_PROJECT_ID`, `NDD_RCA_PYTHON`, `RUN_DB_PUSH` |
| Build-time only | `NEXT_PUBLIC_AGENT_URL` (compose build arg) |

**Production:** set `RUN_DB_PUSH=false` and point every DB var at the real
databases. **This is not optional.** `db push --accept-data-loss` (used so the
schema push never blocks on a confirmation prompt) makes the database match
the Prisma schema file exactly, which means it *drops* any table that exists
in the database but has no corresponding model — e.g. the OMT module's
raw-SQL-created `omt_tray_putaway` / `omt_activity_logs` tables
(`src/app/api/omt/*/route.ts`). Leaving `RUN_DB_PUSH=true` while
`DATABASE_URL*` point at a real database means **every container
restart/redeploy wipes those tables** — this already happened once against
production `dispatch_ptl`. `docker/entrypoint.sh` now refuses to start rather
than run db push when `RUN_DB_PUSH=true` but a `DATABASE_URL*` doesn't point
at the compose-internal `db` host, but treat that as a backstop, not a
substitute for setting the flag correctly.

The raw-SQL warehouse queries read pre-existing external data — a
local MySQL only satisfies the Prisma schemas, not those warehouse tables.
`bosch` still takes a static host/user/password. `NexS_DB` / `NexS_DB_PICKING`
instead route through Adaptive — see the next section.

## MEI JobViewer End Cut export

Grafana Dumps includes an authenticated `End Cut Events` CSV backed by the MEI
JobViewer SQL Server. The server, database, and read-only SQL login are supplied
only through the `ENDCUT_*` runtime variables in `.env.docker`; they are never
sent to the browser or baked into the image. The production implementation is
native Node/Tedious, not the supplied PowerShell script.

The endpoint has no caller-controlled dates: it always reads the rolling last
48 hours in `Asia/Kolkata`, using half-open bounds and calendar-day query chunks.
It preserves `READ UNCOMMITTED`, a five-second lock timeout, `MAXDOP 1`, a
single SQL connection/query, and bounded retries to protect the production
server. Docker must be able to reach the private SQL host on TCP 1433. Use a
dedicated SELECT-only account and enable certificate-validated encryption; any
temporary legacy `Encrypt=false` exception should be removed after the server
certificate is fixed.

## Warehouse DB access via Adaptive (`NexS_DB` / `NexS_DB_PICKING`)

Production credentials for these two pools are not a static URI — they go
through Lenskart's Adaptive PAM CLI (`src/utils/adaptiveExecPool.ts`). There is
no TCP tunnel available for these endpoints (`adaptive connect` requires a
real interactive terminal and fails on piped/non-tty input, confirmed), so
each query is one non-interactive `adaptive exec <endpoint> -c "<sql>"` call
(~4s per call — the Adaptive broker auth handshake, paid on every invocation).
`getConnection()`/`changeUser()`/`.execute()`/`.query()`/`.release()` are all
shimmed to match the existing mysql2 API, so none of the ~30 call sites needed
to change.

**Setup, once the image has the `adaptive` binary on PATH** (see the TODO in
the Dockerfile — the Linux CLI's install source isn't wired up yet):

1. Set `NEXS_DB_ADAPTIVE_ENDPOINT=mysql_ro_nexs-slave02.prod.internal` and
   `NEXS_DB_PICKING_ADAPTIVE_ENDPOINT=mysql_ro_nexs-picking-mysql-slavedb` in
   `.env.docker`. When set, these take priority over `NexS_DB`/`NexS_DB_PICKING`.
2. Log in once, interactively, inside the running container:
   `docker compose exec app adaptive login -u https://adaptive.lenskart.com`
   — follow the printed link to authenticate in a browser. Login is one-time;
   the resulting token is written to `/home/nextjs/.adaptive`, which is a
   named volume (`adaptive_token`) so it survives container restarts/redeploys.
3. If the token ever expires, queries start failing and the app logs
   `Ask ARYA to reauthenticate the Adaptive token` — rerun step 2.

**Known limitations of this design** (accepted trade-off for zero new
dependencies — see conversation history / `DB_Migration.md` for the fuller
rationale):

- Latency is roughly `~4s × number of sequential queries` in one
  `getConnection()`/`release()` span, since each call is an independent
  `adaptive exec` invocation and a later query's parameters can depend on an
  earlier query's result (so they can't be pre-batched into one call). Most
  routes do 1–4 queries per request (~4–16s). A pending `changeUser()` is
  folded into the next query's call for free (no extra round trip).
- Three routes are **not** viable under this design and were left as-is:
  `infocorner/sync-time-inventory` (up to 200 checkout/release cycles in one
  request), `lens-lab/jit-PD-stamp` and `infocorner/barcode-details` (up to
  5,000 / 100 sequential queries held on one connection across a streamed
  response). These would need either a persistent-session driver (e.g.
  `node-pty` driving `adaptive connect` as a real pty-backed REPL) or a
  rewrite of the query pattern itself — both out of scope here.
- Row values come back as strings (or `null` for SQL `NULL`) parsed from the
  CLI's ASCII table output, not typed values from the MySQL wire protocol.
  Existing call sites already coerce with `String()`/`Number()` where it
  matters, but this is a real behavioral difference from a normal mysql2 pool.
- The "needs reauth" detection is a best-effort keyword match — a real
  expired-token error message from `adaptive exec` was never observed while
  building this (only successful logins), so the pattern may need refining
  once a real expiry happens in production.

## Python-backed analytics (optional features)

The `ndd-rca`, Order Cancellation, Lens Decanting, and Frame Decanting routes
use small Python adapters for Power BI and Google APIs. Both Decanting modules
keep inventory and product queries in the native TypeScript BigQuery client;
their colored XLSX downloads use the shared openpyxl writer. To enable these
features in the container:

1. Pre-mint the delegated tokens **on a machine with a browser** (the container
   is headless, so first-run OAuth consent cannot happen inside it): run the
   auth flows so `gsheet_token.json` has both Sheets **and** Drive scopes and
   `pbi_token_cache.json` holds a live refresh token. Access tokens then renew
   silently and the refreshed caches are saved automatically.
2. Keep those files in the resource directories mounted by
   `docker-compose.yml`. The Power BI and Google directories must be
   **read-write** because renewals use atomic replacement and every worker must
   see the same cache. On a Linux host, if either mount is not writable by the
   non-root app user, run
   `docker compose exec -u root app chown -R nextjs:nodejs /app/src/utils/resources/power-bi /app/src/utils/resources/google`
   once after the container starts.
3. Set `LENS_DECANTING_GRN_SHEET_ID` (or the legacy `DRIVE_SHEET_GRN`) to the
   spreadsheet containing the PID-level GRN data, and set
   `LENS_DECANTING_GRN_RANGE=EyeFrame!R:U`. The supplied workbook's `Lens`
   tab is invoice-level; the required `IQC Status / PID / PID QTY / GRN QTY`
   fields are on `EyeFrame`. Set `LENS_DECANTING_SKIP_GOOGLE=1` only when the
   dashboard should run without GRN enrichment.
4. Frame Decanting inherits the Lens GRN ID/range by default. Its ROS model
   defaults to `PBI_FRAME_ROS_DATASET_ID=e30504e3-a2a6-4cd2-9ba6-b2b2a6456d15`;
   the Increff and Transfer model defaults are listed in `.env.docker.example`.
   The versioned `src/lib/plc flag.csv` and `src/lib/pid excusion.csv`
   snapshots are included in standalone and Docker builds and are the default
   Frame PLC/exclusion sources. To update them independently of an image
   rebuild, mount authoritative replacements read-only and set
   `FRAME_DECANTING_PLC_FILE` and `FRAME_DECANTING_PID_EXCLUSION_FILE` to their
   in-container paths. A missing or unreadable override produces a dashboard
   warning rather than silently using a different snapshot.
5. Reserve Inventory materializes one exact rolling 62-day BigQuery snapshot
   and persists it under `/app/data/cache/reserve-inventory.json` in the
   `app_data` volume. Normal date/filter visits slice that snapshot immediately;
   the refresh control is the explicit source rebuild. Override the writable
   path with `RESERVE_INVENTORY_CACHE_PATH` only when required.

For Power BI app-only authentication with no delegated cache, set
`POWER_BI_TENANT_ID`, `POWER_BI_CLIENT_ID`, and `POWER_BI_CLIENT_SECRET` in
`.env.docker`. The Entra service principal must be enabled for Power BI APIs
and granted access to the workspace/model. Power BI Execute Queries does not
support service-principal access for models using RLS or SSO; those models must
continue using the delegated read-write cache. App-only mode creates its own
short-lived access-token cache in the mounted Power BI directory when needed.

If Entra Conditional Access permits renewal from the Windows host but blocks
it inside Docker, install the host-side fallback while signed in as the Docker
Desktop user:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/install-power-bi-token-refresh.ps1
```

It verifies a non-interactive renewal first, then refreshes the shared cache
every 45 minutes while that user is logged on. Remove it with the same command
plus `-Uninstall`. A service principal remains the preferred server deployment.

The credential and token-cache files described above are gitignored and
`.dockerignore`d — they are never committed or baked into the image. The two
non-secret Frame mapping snapshots are intentionally versioned and bundled.

## ⚠️ Security — must address (pre-existing, not auto-changed)

These ship secrets in **source/git history** and were only flagged (changing
them alters live behavior — do it deliberately + rotate the credentials):

- **`src/lib/db.ts`** — hardcoded on-prem DB password as an env fallback. It is
  compiled into the image regardless of `.env.docker`. Set `BOSCH_DB_*`, remove
  the literal fallback, and **rotate** the password (already in git history).
- **`src/app/api/packing-dispatch/ndd-rca/NDD-RCA/Push.py`** — hardcoded
  warehouse + WMS DB credentials (baked into the image via the `COPY`). Move
  them to env vars (the route forwards `process.env` to the script) and rotate.
- **`src/app/api/ehs/exportPDF/route.ts`** — DB fields are interpolated into the
  PDF HTML unescaped and rendered by Chromium with network enabled → stored-XSS
  / SSRF risk. Escape all interpolated values and block non-`data:` requests.
- Set a strong **`JWT_SECRET`** and **`MYSQL_ROOT_PASSWORD`** in `.env.docker`
  (the example values are placeholders). MySQL is bound to `127.0.0.1` only.
- Keep **`AUTH_COOKIE_SECURE=true`** behind HTTPS. Set it to `false` only when
  users access a production-mode server directly over plain HTTP.
- Already handled: the shared BigQuery OAuth files
  (`src/utils/resources/bigquery/credentials.json` and `token.json`) and the
  NDD-RCA token files are untracked + excluded — provide them at runtime. Lens
  Lab FQC uses the same token, which must include BigQuery access.

## Notes / things to verify on first real build

Docker was not available in the authoring environment, so the following were
built to well-known patterns but should be smoke-tested on your first build:

- **Prisma engines in standalone** — clients are regenerated for Linux in the
  builder and copied into the runner; `outputFileTracingIncludes` also forces
  `src/generated/**` into the trace. If you hit a "query engine not found"
  error, confirm `src/generated/*/` inside the container has a
  `libquery_engine-debian-openssl-3.0.x.so.node`.
- **puppeteer** uses system Chromium via `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`
  (launch already passes `--no-sandbox`).
- **Python analytics** run from `/opt/venv` (`requirement.txt` installed); the
  NDD-RCA, Order Cancellation, and Lens/Frame Decanting adapters are copied into the
  standalone image.
