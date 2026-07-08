/* eslint-disable */
// -----------------------------------------------------------------------------
// 10_triage_dashboard_indexes.cjs
// Emergency remediation for the runaway BI/dashboard analytics queries piling up
// on mydb.PackingScan / mydb.DispatchScan (user 'Hero' @ 192.168.27.132).
//
// Root cause: those queries filter on `timestamp BETWEEN ...` (and GROUP BY
// scanId/stationId). The existing indexes are (scanId) and (stationId, timestamp)
// -- neither can seek on `timestamp` alone, so every query is a FULL TABLE SCAN.
// With ~600 of them concurrent, the server saturates and they stack.
//
// Fix order (matches the operator decision: kill + one covering index per table):
//   1. SET GLOBAL max_execution_time = 60s  -> no SELECT can run away again /
//      pile up during the index-build window.
//   2. KILL QUERY the piled-up dashboard statements -> frees I/O immediately
//      (connections survive; the BI tool just re-fires on next refresh).
//   3. CREATE the covering indexes (timestamp, scanId, stationId), online,
//      idempotent -> re-fired queries become range-seek + covering scans.
//   4. EXPLAIN proof that the optimizer now picks the new index.
//
// Usage (from repo root, where .env lives):
//   node database/mydb-optimization/10_triage_dashboard_indexes.cjs check     # dry-run: show backlog + index status, change nothing
//   node database/mydb-optimization/10_triage_dashboard_indexes.cjs remediate # do steps 1-4
//   node database/mydb-optimization/10_triage_dashboard_indexes.cjs explain   # just the EXPLAIN proof
// -----------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// ---- parse DATABASE_URL from .env (password may contain '@', so parse manually) ----
function loadDbUrl() {
  const envPath = path.join(process.cwd(), '.env');
  const txt = fs.readFileSync(envPath, 'utf8');
  const line = txt.split(/\r?\n/).find((l) => l.startsWith('DATABASE_URL='));
  if (!line) throw new Error('DATABASE_URL not found in .env');
  let v = line.slice('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
  const raw = v.replace(/^mysql:\/\//, '');
  const at = raw.lastIndexOf('@');
  const cred = raw.slice(0, at);
  const hostpart = raw.slice(at + 1);
  const ci = cred.indexOf(':');
  const user = cred.slice(0, ci);
  const password = cred.slice(ci + 1);
  const [hostport, rest = ''] = hostpart.split('/');
  const [host, port] = hostport.split(':');
  const database = rest.split('?')[0];
  return { host, port: Number(port) || 3306, user, password, database };
}

const bt = (s) => '`' + s + '`';

// The covering indexes that actually serve the dashboard queries.
const NEW_INDEXES = [
  ['PackingScan',  'idx_PackingScan_ts_scan_station',  ['timestamp', 'scanId', 'stationId']],
  ['DispatchScan', 'idx_DispatchScan_ts_scan_station', ['timestamp', 'scanId', 'stationId']],
];

// Signatures that identify the runaway dashboard statements.
const PATTERNS = [
  'CasesWithMultipleStations',
  'DuplicateScannedIDsInTimeRange',
  'TotalScannedInTimeRange',
  'DuplicateScanCount',
  'TotalDuplicateEntries',
  'TotalScannedIDs',
  'AS Throughput',
];

async function indexExists(conn, db, table, name) {
  const [r] = await conn.query(
    'SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND INDEX_NAME=? LIMIT 1',
    [db, table, name]
  );
  return r.length > 0;
}

// Backlog = long-ish running Query threads whose SQL matches the dashboard patterns,
// excluding our own connection. Returns rows {ID, TIME, HOST, snippet}.
async function findBacklog(conn) {
  const like = PATTERNS.map(() => 'INFO LIKE ?').join(' OR ');
  const sql =
    `SELECT ID, TIME, HOST, LEFT(REPLACE(REPLACE(INFO,'\\n',' '),'  ',' '), 70) AS snippet
       FROM information_schema.PROCESSLIST
      WHERE COMMAND = 'Query'
        AND ID <> CONNECTION_ID()
        AND (${like})
      ORDER BY TIME DESC`;
  const [rows] = await conn.query(sql, PATTERNS.map((p) => `%${p}%`));
  return rows;
}

async function phaseCheck(conn, db) {
  console.log('\n=== Covering-index status ===');
  for (const [t, name, cols] of NEW_INDEXES) {
    const ex = await indexExists(conn, db, t, name);
    console.log(`  [${ex ? 'EXISTS ' : 'MISSING'}] ${t}.${name} (${cols.join(', ')})`);
  }
  const [mx] = await conn.query("SELECT @@global.max_execution_time AS m");
  console.log(`\nglobal max_execution_time = ${mx[0].m} ms ${Number(mx[0].m) === 0 ? '(0 = unlimited!)' : ''}`);

  const backlog = await findBacklog(conn);
  console.log(`\n=== Runaway dashboard backlog: ${backlog.length} statement(s) ===`);
  const show = backlog.slice(0, 15);
  for (const r of show) console.log(`  id=${String(r.ID).padStart(6)}  ${String(r.TIME).padStart(5)}s  ${r.HOST.padEnd(24)} ${r.snippet}`);
  if (backlog.length > show.length) console.log(`  ... and ${backlog.length - show.length} more`);
  if (backlog.length) {
    const max = backlog[0].TIME, sum = backlog.reduce((a, r) => a + Number(r.TIME), 0);
    console.log(`  oldest=${max}s   total thread-seconds=${sum}`);
  }
  return backlog;
}

async function phaseRemediate(conn, db, guardMs = 60000) {
  // ---- step 1: runaway guard so nothing can pile up past `guardMs` again ----
  try {
    await conn.query(`SET GLOBAL max_execution_time = ${guardMs}`);
    console.log(`STEP 1  global max_execution_time set to ${guardMs} ms (read-only SELECT cap)`);
  } catch (e) {
    console.log(`STEP 1  could NOT set max_execution_time (${e.code || e.message}) -- needs SUPER/SYSTEM_VARIABLES_ADMIN. Continuing.`);
  }

  // ---- step 2: kill the existing backlog (KILL QUERY: aborts the statement, keeps the connection) ----
  const backlog = await findBacklog(conn);
  console.log(`\nSTEP 2  killing ${backlog.length} runaway statement(s) (KILL QUERY) ...`);
  let killed = 0, gone = 0;
  for (const r of backlog) {
    try { await conn.query(`KILL QUERY ${r.ID}`); killed++; }
    catch (e) { gone++; /* thread already finished/disconnected */ }
  }
  console.log(`STEP 2  killed=${killed}  alreadyGone=${gone}`);

  // ---- step 3: create the covering indexes, online + idempotent ----
  console.log(`\nSTEP 3  creating covering indexes (ALGORITHM=INPLACE LOCK=NONE) ...`);
  for (const [t, name, cols] of NEW_INDEXES) {
    if (await indexExists(conn, db, t, name)) { console.log(`  SKIP   ${t}.${name} (already exists)`); continue; }
    const ddl = `CREATE INDEX ${bt(name)} ON ${bt(db)}.${bt(t)} (${cols.map(bt).join(', ')}) ALGORITHM=INPLACE LOCK=NONE`;
    const t0 = Date.now();
    await conn.query(ddl);
    console.log(`  CREATE ${t}.${name} (${cols.join(', ')})  ${Date.now() - t0}ms`);
  }

  // ---- step 4: prove the optimizer now uses them ----
  await phaseExplain(conn, db);
}

async function phaseExplain(conn, db) {
  console.log('\nSTEP 4  EXPLAIN proof (key should be the new idx_*_ts_scan_station) ===');
  const lo = "(NOW() - INTERVAL 1 DAY)", hi = "NOW()";
  const queries = [
    ['PackingScan total',      `SELECT COUNT(scanId) FROM ${bt(db)}.\`PackingScan\` WHERE \`timestamp\` BETWEEN ${lo} AND ${hi}`],
    ['PackingScan duplicates', `SELECT COUNT(*) FROM (SELECT \`scanId\` FROM ${bt(db)}.\`PackingScan\` WHERE \`timestamp\` BETWEEN ${lo} AND ${hi} GROUP BY \`scanId\` HAVING COUNT(*)>1) x`],
    ['PackingScan multi-stn',  `SELECT COUNT(*) FROM (SELECT \`scanId\` FROM ${bt(db)}.\`PackingScan\` WHERE \`timestamp\` BETWEEN ${lo} AND ${hi} GROUP BY \`scanId\` HAVING COUNT(DISTINCT \`stationId\`)>1) x`],
    ['PackingScan throughput', `SELECT \`stationId\`, COUNT(*) FROM ${bt(db)}.\`PackingScan\` WHERE \`timestamp\` BETWEEN ${lo} AND ${hi} GROUP BY \`stationId\``],
    ['DispatchScan total',     `SELECT COUNT(scanId) FROM ${bt(db)}.\`DispatchScan\` WHERE \`timestamp\` BETWEEN ${lo} AND ${hi}`],
  ];
  for (const [label, sql] of queries) {
    try {
      const [rows] = await conn.query('EXPLAIN ' + sql);
      const r = rows[0] || {};
      console.log(`  ${label.padEnd(24)} type=${r.type}  key=${r.key || '(none)'}  rows=${r.rows}  Extra=${r.Extra || ''}`);
    } catch (e) {
      console.log(`  ${label.padEnd(24)} EXPLAIN error: ${e.code || e.message}`);
    }
  }
}

(async () => {
  const phase = process.argv[2] || 'check';
  const cfg = loadDbUrl();
  console.log(`Connecting to ${cfg.database} at ${cfg.host}:${cfg.port} as ${cfg.user} ...`);
  const conn = await mysql.createConnection({
    ...cfg, multipleStatements: false, connectTimeout: 12000,
    supportBigNumbers: true, bigNumberStrings: true,
  });
  try {
    if (phase === 'check') await phaseCheck(conn, cfg.database);
    else if (phase === 'remediate') await phaseRemediate(conn, cfg.database);
    else if (phase === 'explain') await phaseExplain(conn, cfg.database);
    else throw new Error(`unknown phase: ${phase} (use check | remediate | explain)`);
    console.log(`\nPhase '${phase}' complete.`);
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
