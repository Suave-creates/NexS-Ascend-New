#!/bin/sh
set -e

# Prisma CLI is invoked directly (no npx network lookup).
PRISMA="node node_modules/prisma/build/index.js"

# Optional self-contained DB provisioning for local runs. Push each Prisma
# schema into its database. Turn OFF in production where schemas already exist
# (set RUN_DB_PUSH=false). Needs the DATABASE_URL* env vars to be reachable.
if [ "${RUN_DB_PUSH:-false}" = "true" ]; then
  # Safety guard: `db push --accept-data-loss` silently DROPS any table that
  # isn't declared as a Prisma model — e.g. the OMT module's raw-SQL-created
  # omt_tray_putaway / omt_activity_logs tables — to force the database to
  # match the schema file. That's harmless against the throwaway bundled
  # MySQL (compose hostname "db"), catastrophic against a real database
  # (this already happened once against production dispatch_ptl). Refuse to
  # run unless every configured DATABASE_URL* points at that "db" host.
  for var in DATABASE_URL DATABASE_URL_DISPATCH DATABASE_URL_LENS_LAB DATABASE_URL_MF; do
    eval "url=\$$var"
    [ -z "$url" ] && continue
    host=$(echo "$url" | sed -E 's#.*@##; s#[:/].*##')
    if [ "$host" != "db" ]; then
      echo "[entrypoint] REFUSING to start: RUN_DB_PUSH=true but $var points at" >&2
      echo "[entrypoint]   host '$host', not the compose-internal 'db' service." >&2
      echo "[entrypoint]   'prisma db push --accept-data-loss' drops any table" >&2
      echo "[entrypoint]   not modeled in the Prisma schema (e.g. OMT's raw-SQL" >&2
      echo "[entrypoint]   tables) on every run — this looks like a real/remote" >&2
      echo "[entrypoint]   database. Set RUN_DB_PUSH=false, or fix $var." >&2
      exit 1
    fi
  done

  echo "[entrypoint] RUN_DB_PUSH=true — pushing Prisma schemas..."
  for s in schema schema-dispatch schema-lens-lab schema-metal-frame; do
    echo "[entrypoint]   prisma db push (prisma/$s.prisma)"
    $PRISMA db push --schema="prisma/$s.prisma" --skip-generate --accept-data-loss \
      || echo "[entrypoint]   WARN: db push failed for $s (continuing)"
  done
fi

echo "[entrypoint] starting: $*"
exec "$@"
