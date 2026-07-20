# syntax=docker/dockerfile:1
###############################################################################
# NexS Ascend — production image (Next.js 15 standalone)
#
# Debian (bookworm) base is used deliberately: this app needs Chromium
# (puppeteer, EHS PDF export), a Python venv (NDD-RCA pipeline) and Prisma
# native query engines — all far simpler/robust on Debian than Alpine/musl.
###############################################################################

########## 1. deps — install node_modules ##########
FROM node:20-bookworm-slim AS deps
WORKDIR /app
# Do NOT let puppeteer download its own Chromium; the runner installs system chromium.
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY docker/lenskart-netskope-root.crt /usr/local/share/ca-certificates/lenskart-netskope-root.crt
RUN update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/lenskart-netskope-root.crt
COPY package.json package-lock.json ./
# The builder needs Prisma, TypeScript, Tailwind, and other dev dependencies.
# Be explicit so host/daemon npm configuration cannot omit them.
RUN npm ci --include=dev

########## 2. builder — generate prisma clients + next build ##########
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/lenskart-netskope-root.crt
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY docker/lenskart-netskope-root.crt /usr/local/share/ca-certificates/lenskart-netskope-root.crt
RUN update-ca-certificates
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Regenerate ALL Prisma clients for Linux — the clients committed in src/generated
# ship Windows query engines (query_engine-windows.dll.node) and are .dockerignore'd.
# Use the Prisma CLI installed by the lockfile. `npx prisma` may fall back to
# the npm registry when resolution fails, which breaks on TLS-inspected networks
# and makes an otherwise reproducible image build depend on external lookup.
RUN ./node_modules/.bin/prisma generate --schema=prisma/schema.prisma \
 && ./node_modules/.bin/prisma generate --schema=prisma/schema-dispatch.prisma \
 && ./node_modules/.bin/prisma generate --schema=prisma/schema-lens-lab.prisma \
 && ./node_modules/.bin/prisma generate --schema=prisma/schema-metal-frame.prisma
# NEXT_PUBLIC_* values are inlined at build time, so they must be build args.
ARG NEXT_PUBLIC_AGENT_URL=""
ENV NEXT_PUBLIC_AGENT_URL=${NEXT_PUBLIC_AGENT_URL}
RUN npm run build

########## 3. runner — lean runtime ##########
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3069 \
    HOSTNAME=0.0.0.0 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_DOWNLOAD=true \
    NDD_RCA_PYTHON=/opt/venv/bin/python \
    NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/lenskart-netskope-root.crt \
    HOME=/home/nextjs

# Runtime system deps:
#  - openssl               : Prisma
#  - chromium + fonts      : puppeteer (EHS PDF export)
#  - python3 + venv        : NDD-RCA pipeline (spawned by the ndd-rca API route)
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates \
      chromium fonts-liberation fonts-noto-color-emoji \
      python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*
COPY docker/lenskart-netskope-root.crt /usr/local/share/ca-certificates/lenskart-netskope-root.crt
RUN update-ca-certificates

# Python venv for the NDD-RCA scripts (pandas, msal, gspread, ...).
COPY requirement.txt ./
RUN python3 -m venv /opt/venv \
 && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
 && /opt/venv/bin/pip install --no-cache-dir -r requirement.txt

# Non-root runtime user. -d pins the home dir so it matches the adaptive_token
# volume mount in docker-compose.yml (see below) rather than relying on
# whatever useradd's system-account default happens to be.
RUN groupadd -r nodejs && useradd -r -g nodejs -m -d /home/nextjs nextjs

# --- Adaptive PAM CLI (warehouse DB access - see src/utils/adaptiveExecPool.ts) ---
# TODO: install the Linux `adaptive` CLI binary here so it ends up on PATH as
# `adaptive` (or set ADAPTIVE_BIN to wherever it lands). Source not yet known -
# ask whoever owns Adaptive at Lenskart for the internal registry image,
# package, or download step other services already use to get this binary
# into a Linux container, then replace this comment with the real RUN/COPY
# step. Until this is filled in, NEXS_DB_ADAPTIVE_ENDPOINT /
# NEXS_DB_PICKING_ADAPTIVE_ENDPOINT will fail at request time with
# "adaptive: command not found" - local dev (NexS_DB/NexS_DB_PICKING pointed
# at the bundled MySQL) is unaffected either way.

# --- Next.js standalone output ---
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# --- Prisma: schemas (entrypoint db push) + generated clients/engines + CLI ---
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# --- NDD-RCA python scripts (spawned with cwd = this dir) ---
COPY --from=builder --chown=nextjs:nodejs /app/src/app/api/packing-dispatch/ndd-rca/NDD-RCA ./src/app/api/packing-dispatch/ndd-rca/NDD-RCA
# Central auth helpers. Secret JSON/cache files are excluded by .dockerignore
# and must be mounted at runtime (see docker-compose.yml).
COPY --from=builder --chown=nextjs:nodejs /app/src/utils/resources ./src/utils/resources

# Writable runtime data dir (flash-rules.json, auto-release-lock.json).
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

COPY --chown=nextjs:nodejs docker/entrypoint.sh ./docker/entrypoint.sh
# Strip any CRLF (Windows checkout) so the shebang works, then make executable.
RUN sed -i 's/\r$//' ./docker/entrypoint.sh \
 && chmod +x ./docker/entrypoint.sh \
 && mkdir -p ./data && chown -R nextjs:nodejs ./data

USER nextjs
EXPOSE 3069
ENTRYPOINT ["./docker/entrypoint.sh"]
CMD ["node", "server.js"]
