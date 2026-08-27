/* eslint-disable */
// Low-overhead, read-only MySQL I/O diagnostic.
// Uses the same .env.local -> .env precedence as the Next.js application and
// never prints credentials. Usage: node scripts/diagnose-database-io.cjs [seconds]
const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');

function databaseConfig() {
  loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error('DATABASE_URL is not configured');

  const raw = value.trim().replace(/^["']|["']$/g, '').replace(/^mysql:\/\//, '');
  const at = raw.lastIndexOf('@');
  if (at < 0) throw new Error('DATABASE_URL is invalid');
  const credentials = raw.slice(0, at);
  const target = raw.slice(at + 1);
  const colon = credentials.indexOf(':');
  const [hostPort, pathAndQuery = ''] = target.split('/', 2);
  const hostColon = hostPort.lastIndexOf(':');
  const host = hostColon > -1 ? hostPort.slice(0, hostColon) : hostPort;
  const port = hostColon > -1 ? Number(hostPort.slice(hostColon + 1)) : 3306;

  return {
    host,
    port: port || 3306,
    user: decodeURIComponent(credentials.slice(0, colon)),
    password: decodeURIComponent(credentials.slice(colon + 1)),
    database: decodeURIComponent(pathAndQuery.split('?')[0]),
  };
}

const STATUS_NAMES = [
  'Queries',
  'Threads_connected',
  'Threads_running',
  'Max_used_connections',
  'Aborted_connects',
  'Slow_queries',
  'Created_tmp_tables',
  'Created_tmp_disk_tables',
  'Select_scan',
  'Select_range',
  'Handler_read_rnd_next',
  'Innodb_buffer_pool_read_requests',
  'Innodb_buffer_pool_reads',
  'Innodb_buffer_pool_pages_total',
  'Innodb_buffer_pool_pages_free',
  'Innodb_buffer_pool_pages_dirty',
  'Innodb_data_reads',
  'Innodb_data_writes',
  'Innodb_data_read',
  'Innodb_data_written',
  'Innodb_log_waits',
  'Innodb_row_lock_current_waits',
  'Innodb_row_lock_waits',
  'Innodb_row_lock_time',
];

const VARIABLE_NAMES = [
  'max_connections',
  'max_execution_time',
  'innodb_buffer_pool_size',
  'innodb_io_capacity',
  'innodb_io_capacity_max',
  'slow_query_log',
  'long_query_time',
  'performance_schema',
];

function asMap(rows) {
  return Object.fromEntries(rows.map((row) => [row.Variable_name, row.Value]));
}

function number(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function delta(before, after, key) {
  return number(after[key]) - number(before[key]);
}

function bytes(value) {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let amount = Math.max(0, number(value));
  let unit = 0;
  while (amount >= 1024 && unit < units.length - 1) {
    amount /= 1024;
    unit += 1;
  }
  return `${amount.toFixed(unit ? 1 : 0)} ${units[unit]}`;
}

function rate(value, seconds, suffix = '/s') {
  return `${(number(value) / seconds).toFixed(1)}${suffix}`;
}

async function status(conn) {
  const placeholders = STATUS_NAMES.map(() => '?').join(',');
  const [rows] = await conn.query(
    `SHOW GLOBAL STATUS WHERE Variable_name IN (${placeholders})`,
    STATUS_NAMES,
  );
  return asMap(rows);
}

async function variables(conn) {
  const placeholders = VARIABLE_NAMES.map(() => '?').join(',');
  const [rows] = await conn.query(
    `SHOW GLOBAL VARIABLES WHERE Variable_name IN (${placeholders})`,
    VARIABLE_NAMES,
  );
  return asMap(rows);
}

async function printConnectionSummary(conn) {
  const [rows] = await conn.query(`
    SELECT USER,
           SUBSTRING_INDEX(HOST, ':', 1) AS host,
           COUNT(*) AS connections,
           SUM(COMMAND = 'Query') AS active,
           MAX(TIME) AS oldest_seconds
      FROM information_schema.PROCESSLIST
     WHERE ID <> CONNECTION_ID()
     GROUP BY USER, SUBSTRING_INDEX(HOST, ':', 1)
     ORDER BY active DESC, connections DESC
     LIMIT 12
  `);
  console.log('\nConnections by client:');
  for (const row of rows) {
    console.log(
      `  ${String(row.USER).padEnd(18)} ${String(row.host).padEnd(18)} `
      + `connections=${String(row.connections).padStart(4)} `
      + `active=${String(row.active).padStart(4)} oldest=${row.oldest_seconds}s`,
    );
  }
}

async function printActiveQueries(conn) {
  const [rows] = await conn.query(`
    SELECT ID, USER, SUBSTRING_INDEX(HOST, ':', 1) AS host, DB, TIME, STATE,
           LEFT(REPLACE(REPLACE(INFO, '\\n', ' '), '  ', ' '), 160) AS sql_text
      FROM information_schema.PROCESSLIST
     WHERE COMMAND = 'Query' AND ID <> CONNECTION_ID()
     ORDER BY TIME DESC
     LIMIT 12
  `);
  console.log(`\nActive queries (${rows.length} shown):`);
  if (!rows.length) console.log('  none');
  for (const row of rows) {
    console.log(
      `  id=${row.ID} age=${row.TIME}s ${row.USER}@${row.host} db=${row.DB || '-'} `
      + `state=${row.STATE || '-'} sql=${row.sql_text || '-'}`,
    );
  }
}

async function printTopDigests(conn, database) {
  try {
    const [rows] = await conn.query(`
      SELECT LEFT(DIGEST_TEXT, 150) AS digest_text,
             COUNT_STAR AS executions,
             ROUND(SUM_TIMER_WAIT / 1000000000000, 1) AS total_seconds,
             ROUND(AVG_TIMER_WAIT / 1000000000, 1) AS average_ms,
             SUM_ROWS_EXAMINED AS rows_examined,
             SUM_ROWS_SENT AS rows_sent,
             LAST_SEEN AS last_seen
        FROM performance_schema.events_statements_summary_by_digest
       WHERE SCHEMA_NAME = ? AND DIGEST_TEXT IS NOT NULL
       ORDER BY SUM_TIMER_WAIT DESC
       LIMIT 8
    `, [database]);
    console.log('\nHighest cumulative statement cost (performance_schema):');
    for (const row of rows) {
      console.log(
        `  total=${row.total_seconds}s avg=${row.average_ms}ms runs=${row.executions} `
        + `examined=${row.rows_examined} sent=${row.rows_sent} last=${row.last_seen}\n`
        + `    ${row.digest_text}`,
      );
    }
  } catch (error) {
    console.log(`\nStatement digest summary unavailable: ${error.code || error.message}`);
  }
}

async function digestSnapshot(conn, database) {
  try {
    const [rows] = await conn.query(`
      SELECT DIGEST, LEFT(DIGEST_TEXT, 150) AS digest_text,
             COUNT_STAR AS executions, SUM_TIMER_WAIT AS total_wait,
             SUM_ROWS_EXAMINED AS rows_examined, SUM_ROWS_SENT AS rows_sent
        FROM performance_schema.events_statements_summary_by_digest
       WHERE SCHEMA_NAME = ? AND DIGEST IS NOT NULL
    `, [database]);
    return new Map(rows.map((row) => [row.DIGEST, row]));
  } catch {
    return null;
  }
}

function bigint(value) {
  try { return BigInt(value || 0); } catch { return 0n; }
}

function printDigestDelta(before, after) {
  if (!before || !after) return;
  const deltas = [];
  for (const [digest, row] of after) {
    const previous = before.get(digest) || {};
    const executions = bigint(row.executions) - bigint(previous.executions);
    if (executions <= 0n) continue;
    deltas.push({
      text: row.digest_text,
      executions,
      wait: bigint(row.total_wait) - bigint(previous.total_wait),
      examined: bigint(row.rows_examined) - bigint(previous.rows_examined),
      sent: bigint(row.rows_sent) - bigint(previous.rows_sent),
    });
  }
  deltas.sort((a, b) => Number(b.wait - a.wait));
  console.log('\nHighest cost during this sample:');
  if (!deltas.length) console.log('  no application statements captured');
  for (const row of deltas.slice(0, 8)) {
    const runs = Number(row.executions);
    const totalSeconds = Number(row.wait) / 1e12;
    const averageMs = Number(row.wait) / runs / 1e9;
    console.log(
      `  total=${totalSeconds.toFixed(3)}s avg=${averageMs.toFixed(1)}ms runs=${runs} `
      + `examined=${row.examined} sent=${row.sent}\n    ${row.text}`,
    );
  }
}

async function main() {
  const requested = Number(process.argv[2] || 5);
  const seconds = Number.isFinite(requested) ? Math.min(30, Math.max(2, requested)) : 5;
  const config = databaseConfig();
  console.log(`Read-only I/O diagnostic: ${config.host}:${config.port}/${config.database}`);

  const conn = await mysql.createConnection({
    ...config,
    connectTimeout: 12000,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });

  try {
    const vars = await variables(conn);
    const before = await status(conn);
    const digestsBefore = await digestSnapshot(conn, config.database);
    await printConnectionSummary(conn);
    await printActiveQueries(conn);
    await printTopDigests(conn, config.database);

    console.log(`\nSampling global counters for ${seconds}s ...`);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    const after = await status(conn);
    const digestsAfter = await digestSnapshot(conn, config.database);

    const requests = delta(before, after, 'Innodb_buffer_pool_read_requests');
    const physicalReads = delta(before, after, 'Innodb_buffer_pool_reads');
    const hitRate = requests > 0 ? 100 * (1 - physicalReads / requests) : 100;
    const tempTables = delta(before, after, 'Created_tmp_tables');
    const diskTempTables = delta(before, after, 'Created_tmp_disk_tables');

    console.log('\nCurrent safeguards and capacity:');
    console.log(`  max connections: ${vars.max_connections}; peak used: ${after.Max_used_connections}`);
    console.log(`  max SELECT runtime: ${vars.max_execution_time}ms`);
    console.log(`  InnoDB buffer pool: ${bytes(vars.innodb_buffer_pool_size)}`);
    console.log(`  InnoDB I/O capacity: ${vars.innodb_io_capacity}; max: ${vars.innodb_io_capacity_max}`);
    console.log(`  slow query log: ${vars.slow_query_log}; threshold: ${vars.long_query_time}s`);

    console.log('\nSampled workload:');
    console.log(`  queries: ${rate(delta(before, after, 'Queries'), seconds)}`);
    console.log(`  physical reads: ${rate(delta(before, after, 'Innodb_data_reads'), seconds)}`);
    console.log(`  physical writes: ${rate(delta(before, after, 'Innodb_data_writes'), seconds)}`);
    console.log(`  bytes read: ${bytes(delta(before, after, 'Innodb_data_read') / seconds)}/s`);
    console.log(`  bytes written: ${bytes(delta(before, after, 'Innodb_data_written') / seconds)}/s`);
    console.log(`  full table scans started: ${rate(delta(before, after, 'Select_scan'), seconds)}`);
    console.log(`  range scans started: ${rate(delta(before, after, 'Select_range'), seconds)}`);
    console.log(`  buffer-pool hit rate: ${hitRate.toFixed(3)}%`);
    console.log(`  temporary tables: ${tempTables}; on disk: ${diskTempTables}`);
    console.log(`  InnoDB log waits: ${delta(before, after, 'Innodb_log_waits')}`);
    console.log(`  row-lock waits: ${delta(before, after, 'Innodb_row_lock_waits')}`);
    console.log(`  connected/running now: ${after.Threads_connected}/${after.Threads_running}`);
    printDigestDelta(digestsBefore, digestsAfter);
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error(`Diagnostic failed: ${error.code || 'DATABASE_DIAGNOSTIC_FAILED'} ${error.message}`);
  process.exitCode = 1;
});
