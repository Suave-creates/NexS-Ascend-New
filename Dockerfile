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
COPY package.json package-lock.json ./
RUN npm ci

########## 2. builder — generate prisma clients + next build ##########
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Regenerate ALL Prisma clients for Linux — the clients committed in src/generated
# ship Windows query engines (query_engine-windows.dll.node) and are .dockerignore'd.
RUN npx prisma generate --schema=prisma/schema.prisma \
 && npx prisma generate --schema=prisma/schema-dispatch.prisma \
 && npx prisma generate --schema=prisma/schema-lens-lab.prisma \
 && npx prisma generate --schema=prisma/schema-metal-frame.prisma
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
    NDD_RCA_PYTHON=/opt/venv/bin/python

# Runtime system deps:
#  - openssl               : Prisma
#  - chromium + fonts      : puppeteer (EHS PDF export)
#  - python3 + venv        : NDD-RCA pipeline (spawned by the ndd-rca API route)
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates \
      chromium fonts-liberation fonts-noto-color-emoji \
      python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Python venv for the NDD-RCA scripts (pandas, msal, gspread, ...).
COPY requirement.txt ./
RUN python3 -m venv /opt/venv \
 && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
 && /opt/venv/bin/pip install --no-cache-dir -r requirement.txt

# Non-root runtime user.
RUN groupadd -r nodejs && useradd -r -g nodejs -m nextjs

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
