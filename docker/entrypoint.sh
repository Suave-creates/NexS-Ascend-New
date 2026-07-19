#!/bin/sh
set -e

# Prisma CLI is invoked directly (no npx network lookup).
PRISMA="node node_modules/prisma/build/index.js"

# Optional self-contained DB provisioning for local runs. Push each Prisma
# schema into its database. Turn OFF in production where schemas already exist
# (set RUN_DB_PUSH=false). Needs the DATABASE_URL* env vars to be reachable.
if [ "${RUN_DB_PUSH:-false}" = "true" ]; then
  echo "[entrypoint] RUN_DB_PUSH=true — pushing Prisma schemas..."
  for s in schema schema-dispatch schema-lens-lab schema-metal-frame; do
    echo "[entrypoint]   prisma db push (prisma/$s.prisma)"
    $PRISMA db push --schema="prisma/$s.prisma" --skip-generate --accept-data-loss \
      || echo "[entrypoint]   WARN: db push failed for $s (continuing)"
  done
fi

echo "[entrypoint] starting: $*"
exec "$@"
