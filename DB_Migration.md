
Task: Route the NexS_DB / NexS_DB_PICKING warehouse DB connections through Adaptive CLI
instead of a static connection string.

Repo: NexS-Ascend (Next.js app). Scope is narrow — touch ONLY the two variables below,
nothing else (leave Prisma datasources, BOSCH_DB_*, etc. untouched).

Current state:

- src/utils/nexsPool.ts and src/utils/nexsPickingPool.ts each call
  mysql.createPool({ uri: process.env.NexS_DB! / NexS_DB_PICKING! }) (mysql2/promise).
- .env.docker.example documents them under "Raw mysql2 pools (WAREHOUSE data — external
  in production)" — local dev points at the bundled docker MySQL, but in production these
  resolve to raw external warehouse IPs (observed: 192.168.27.132:13307 and :13308),
  i.e. static host/user/password baked into a connection URI with no PAM in front of it.
- docker-compose.yml (line ~8) has a comment: "raw-SQL warehouse queries (NexS_DB,
  NexS_DB_PICKING, bosch) hit EXTERNAL data in production — point those at the real
  databases in .env.docker."

Goal: production connections for NexS_DB and NexS_DB_PICKING should go through Adaptive
(Lenskart's PAM tool) instead of a hardcoded prod credential/IP.

What we know about Adaptive CLI: running `adaptive connect <endpoint-name>` (e.g.
`adaptive connect mysql_ro_nexs-slave02.prod.internal` this replaces 13307) authenticates and drops into an
interactive `mysql>` shell directly — it prints a live-session URL
(https://adaptive.lenskart.com/endpoints/<id></id>) and brokers ephemeral access. That's
confirmed for interactive human use. It is NOT yet confirmed whether Adaptive also
exposes a non-interactive local-port-forward / daemon mode suitable for a Node connection
pool (i.e. `adaptive connect --port <local> <endpoint>` opening a TCP tunnel that mysql2
can dial as `mysql://user:pass@localhost:<port>/db`).

First step — do NOT guess: run `adaptive --help` and `adaptive connect --help` (or check
internal Adaptive docs) to find the correct non-interactive/tunnel mode. If none exists,
stop and ask the user how app processes are meant to consume Adaptive-issued DB sessions
(sidecar tunnel started before `next start`? a wrapper script? something else?) before
writing any code.

Once the mechanism is confirmed:

1. Update nexsPool.ts / nexsPickingPool.ts to point at the Adaptive-tunneled
   host/port (likely localhost + a forwarded port) instead of consuming a full prod URI
   from NexS_DB / NexS_DB_PICKING directly — or keep the same env vars but have them
   populated by whatever launches the Adaptive tunnel, if that's cleaner.
2. Add/update whatever startup step establishes the Adaptive session before the app
   accepts traffic in production (a shell wrapper, a Dockerfile CMD change, or similar) —
   don't touch local dev's docker-compose MySQL path.
3. Update the comments in .env.docker.example and docker-compose.yml around NexS_DB /
   NexS_DB_PICKING to reflect the new Adaptive-based flow.
4. Update DOCKER.md if it documents these vars.

Verify: confirm the app can actually acquire a working pool connection through the new
path (or clearly state what couldn't be tested and why).
