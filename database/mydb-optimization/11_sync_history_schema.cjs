/* eslint-disable */
// Synchronize column layouts needed by the existing monthly archive event.
// No live/history rows are inserted, updated, or deleted by this script.
// Usage:
//   node database/mydb-optimization/11_sync_history_schema.cjs check
//   node database/mydb-optimization/11_sync_history_schema.cjs apply
const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');

const HISTORY = 'mydb_history';
const TRANSFER = 'scanned_barcode_inventory_transfer';
const NDD = 'ndd_shipments';

function loadDbUrl() {
  loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
  let value = process.env.DATABASE_URL;
  if (!value) throw new Error('DATABASE_URL is not configured');
  value = value.trim().replace(/^["']|["']$/g, '');

  const raw = value.replace(/^mysql:\/\//, '');
  const at = raw.lastIndexOf('@');
  if (at < 0) throw new Error('DATABASE_URL is invalid');
  const credentials = raw.slice(0, at);
  const target = raw.slice(at + 1);
  const colon = credentials.indexOf(':');
  const [hostPort, pathAndQuery = ''] = target.split('/', 2);
  const hostColon = hostPort.lastIndexOf(':');

  return {
    host: hostColon > -1 ? hostPort.slice(0, hostColon) : hostPort,
    port: hostColon > -1 ? Number(hostPort.slice(hostColon + 1)) || 3306 : 3306,
    user: decodeURIComponent(credentials.slice(0, colon)),
    password: decodeURIComponent(credentials.slice(colon + 1)),
    database: decodeURIComponent(pathAndQuery.split('?')[0]),
  };
}

const bt = (value) => `\`${String(value).replaceAll('`', '``')}\``;

async function columns(conn, schema, table) {
  const [rows] = await conn.query(`
    SELECT ORDINAL_POSITION, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE,
           COLUMN_DEFAULT, EXTRA, CHARACTER_SET_NAME, COLLATION_NAME
      FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION
  `, [schema, table]);
  return rows;
}

async function exactCount(conn, schema, table) {
  const [rows] = await conn.query(`SELECT COUNT(*) AS count FROM ${bt(schema)}.${bt(table)}`);
  return BigInt(rows[0].count);
}

function signature(row) {
  return [
    row.ORDINAL_POSITION,
    row.COLUMN_NAME,
    row.COLUMN_TYPE,
    row.IS_NULLABLE,
    String(row.COLUMN_DEFAULT),
    row.EXTRA,
    String(row.CHARACTER_SET_NAME),
    String(row.COLLATION_NAME),
  ].join('|');
}

async function compareTable(conn, liveSchema, table) {
  const [live, history] = await Promise.all([
    columns(conn, liveSchema, table),
    columns(conn, HISTORY, table),
  ]);
  const matches = live.length === history.length
    && live.every((column, index) => signature(column) === signature(history[index]));
  console.log(
    `  ${table.padEnd(38)} ${matches ? 'MATCH' : 'MISMATCH'} `
    + `(live=${live.length} columns, history=${history.length})`,
  );
  if (!matches) {
    const historyByName = new Map(history.map((column) => [column.COLUMN_NAME, column]));
    for (const column of live) {
      const archived = historyByName.get(column.COLUMN_NAME);
      if (!archived) console.log(`    missing history column: ${column.COLUMN_NAME} ${column.COLUMN_TYPE}`);
      else if (signature(column) !== signature(archived)) {
        console.log(
          `    differs: ${column.COLUMN_NAME} live=${column.COLUMN_TYPE}/${column.IS_NULLABLE}/${column.COLUMN_DEFAULT} `
          + `history=${archived.COLUMN_TYPE}/${archived.IS_NULLABLE}/${archived.COLUMN_DEFAULT}`,
        );
      }
    }
  }
  return matches;
}

const TRANSFER_COLUMNS = [
  ['nexs_location', 'varchar(255) DEFAULT NULL', 'injested_at'],
  ['tote', 'varchar(12) DEFAULT NULL', 'nexs_location'],
  ['tote_simplified', 'varchar(20) DEFAULT NULL', 'tote'],
  ['tote_number', 'int DEFAULT NULL', 'tote_simplified'],
  ['partition', 'int DEFAULT NULL', 'tote_number'],
  ['handover', "varchar(100) NOT NULL DEFAULT ''", 'partition'],
];

async function applySync(conn, liveSchema) {
  const before = {
    transfer: await exactCount(conn, HISTORY, TRANSFER),
    ndd: await exactCount(conn, HISTORY, NDD),
  };
  console.log(`History row counts before: ${TRANSFER}=${before.transfer}, ${NDD}=${before.ndd}`);

  for (const [name, definition, after] of TRANSFER_COLUMNS) {
    const existing = await columns(conn, HISTORY, TRANSFER);
    if (existing.some((column) => column.COLUMN_NAME === name)) {
      console.log(`  SKIP   ${TRANSFER}.${name} (already exists)`);
      continue;
    }
    await conn.query(
      `ALTER TABLE ${bt(HISTORY)}.${bt(TRANSFER)} `
      + `ADD COLUMN ${bt(name)} ${definition} AFTER ${bt(after)}, ALGORITHM=INSTANT`,
    );
    console.log(`  ADD    ${TRANSFER}.${name}`);
  }

  const nddColumns = await columns(conn, HISTORY, NDD);
  const createdAt = nddColumns.find((column) => column.COLUMN_NAME === 'created_at');
  if (!createdAt) throw new Error(`${HISTORY}.${NDD}.created_at is missing`);
  if (createdAt.COLUMN_TYPE !== 'datetime(3)') {
    if (before.ndd !== 0n) {
      throw new Error(
        `Refusing to convert ${HISTORY}.${NDD}.created_at while it contains ${before.ndd} rows`,
      );
    }
    await conn.query(
      `ALTER TABLE ${bt(HISTORY)}.${bt(NDD)} `
      + 'MODIFY COLUMN `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)',
    );
    console.log(`  MODIFY ${NDD}.created_at -> datetime(3)`);
  } else {
    console.log(`  SKIP   ${NDD}.created_at (already datetime(3))`);
  }

  const after = {
    transfer: await exactCount(conn, HISTORY, TRANSFER),
    ndd: await exactCount(conn, HISTORY, NDD),
  };
  if (before.transfer !== after.transfer || before.ndd !== after.ndd) {
    throw new Error('History row counts changed unexpectedly; stop and investigate');
  }
  console.log(`History row counts after:  ${TRANSFER}=${after.transfer}, ${NDD}=${after.ndd}`);

  const transferMatches = await compareTable(conn, liveSchema, TRANSFER);
  const nddMatches = await compareTable(conn, liveSchema, NDD);
  if (!transferMatches || !nddMatches) throw new Error('History column layouts still differ');
}

async function main() {
  const phase = process.argv[2] || 'check';
  if (!['check', 'apply'].includes(phase)) throw new Error('Use: check | apply');
  const config = loadDbUrl();
  if (config.database !== 'mydb') {
    throw new Error(`Refusing to run against unexpected live schema: ${config.database}`);
  }
  console.log(`Connecting to ${config.host}:${config.port}/${config.database}; credentials hidden`);
  const conn = await mysql.createConnection({
    ...config,
    connectTimeout: 12000,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });
  try {
    if (phase === 'apply') await applySync(conn, config.database);
    else {
      await compareTable(conn, config.database, TRANSFER);
      await compareTable(conn, config.database, NDD);
    }
    console.log(`Phase '${phase}' complete.`);
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error(`FAILED: ${error.code || ''} ${error.message}`.trim());
  process.exitCode = 1;
});
