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
| Raw mysql2 pools | `NexS_DB`, `NexS_DB_PICKING` |
| bosch_cv_db (`src/lib/db.ts`) | `BOSCH_DB_HOST/PORT/USER/PASSWORD/NAME` |
| App | `JWT_SECRET`, `BQ_PROJECT_ID`, `NDD_RCA_PYTHON`, `RUN_DB_PUSH` |
| Build-time only | `NEXT_PUBLIC_AGENT_URL` (compose build arg) |

**Production:** set `RUN_DB_PUSH=false` and point every DB var at the real
databases. The raw-SQL warehouse queries (`NexS_DB`, `NexS_DB_PICKING`, bosch)
read pre-existing external data — a local MySQL only satisfies the Prisma
schemas, not those warehouse tables.

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
