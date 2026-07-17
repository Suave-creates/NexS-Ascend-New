# Running NexS Ascend with Docker

Production image: **Next.js 15 standalone** on `node:20-bookworm-slim`, with
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
| App | `JWT_SECRET`, `BQ_PROJECT_ID`, `NDD_RCA_PYTHON`, `RUN_DB_PUSH` |
| Build-time only | `NEXT_PUBLIC_AGENT_URL` (compose build arg) |

**Production:** set `RUN_DB_PUSH=false` and point every DB var at the real
databases. The raw-SQL warehouse queries read pre-existing external data — a
local MySQL only satisfies the Prisma schemas, not those warehouse tables.
`bosch` still takes a static host/user/password. `NexS_DB` / `NexS_DB_PICKING`
instead route through Adaptive — see the next section.

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

## NDD-RCA pipeline (optional feature)

The `ndd-rca` route shells out to the Python scripts in
`src/app/api/packing-dispatch/ndd-rca/NDD-RCA/`. To enable it in the container:

1. Pre-mint the tokens **on a machine with a browser** (the container is
   headless — first-run OAuth consent cannot happen inside it): run the auth
   flow so `gsheet_token.json` has both Sheets **and** Drive scopes and
   `pbi_token_cache.json` holds a live refresh token.
2. Put `gcreds.json`, `gsheet_token.json`, `pbi_token_cache.json` in `./secrets/`
   and uncomment the three bind mounts in `docker-compose.yml` (the two token
   caches must be **read-write** — the scripts refresh them in place; `gcreds.json`
   may be `:ro`).

These files are gitignored and `.dockerignore`d — they are never committed or
baked into the image.

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
- Already handled: the BigQuery OAuth files (`infocorner/numbers/credentials.json`,
  `token.json`) and the NDD-RCA token files are untracked + excluded — provide
  them at runtime.

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
- **NDD-RCA** runs Python from `/opt/venv` (`requirement.txt` installed);
  scripts live at `src/app/api/packing-dispatch/ndd-rca/NDD-RCA`.
