/* eslint-disable */
// Direct runner for the mydb optimization migration. Connects ONLY to mydb.
// Reads DATABASE_URL from .env. Usage: node _run.cjs <check|history|indexes|purge>
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// ---- parse DATABASE_URL from .env (password contains '@', so parse manually) ----
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

const ALL_TABLES = [
  'User','ShippingMetadata','OperationsMetadata','InventoryPID','ManualWarehouseSetUp',
  'PackingScan','DispatchScan','BulkScan','FR0Scan','CLScans','ManualWarehouse',
  'FR0BulkHOTO','fasttrackscan','CourierHandover','MetalFrameFittingScan','ndd_shipments',
  'MaintenanceShopIssue','scanned_barcode_inventory','scanned_barcode_inventory_transfer',
  'order_update_dashboard_study','EHSDeviation',
];

// event/log tables eligible for archive+purge: [table, timestampColumn]
const PURGE = [
  ['PackingScan','timestamp'],['DispatchScan','timestamp'],['BulkScan','timestamp'],
  ['FR0Scan','createdAt'],['CLScans','createdAt'],['ManualWarehouse','timestamp'],
  ['FR0BulkHOTO','timestamp'],['fasttrackscan','time'],['CourierHandover','lastScan'],
  ['MetalFrameFittingScan','timestamp'],['ndd_shipments','created_at'],
  ['MaintenanceShopIssue','issuedAt'],['scanned_barcode_inventory_transfer','injested_at'],
];

// indexes to ensure: [table, indexName, [cols]]
const INDEXES = [
  ['PackingScan','idx_PackingScan_scanId',['scanId']],
  ['PackingScan','idx_PackingScan_station_ts',['stationId','timestamp']],
  ['DispatchScan','idx_DispatchScan_scanId',['scanId']],
  ['DispatchScan','idx_DispatchScan_station_ts',['stationId','timestamp']],
  ['BulkScan','idx_BulkScan_scanId',['scanId']],
  ['BulkScan','idx_BulkScan_station_ts',['stationId','timestamp']],
  ['FR0Scan','idx_FR0Scan_scanId',['scanId']],
  ['FR0Scan','idx_FR0Scan_station_created',['stationId','createdAt']],
  ['CLScans','idx_CLScans_scanId',['scanId']],
  ['CLScans','idx_CLScans_station_created',['stationId','createdAt']],
  ['ManualWarehouse','idx_ManualWarehouse_timestamp',['timestamp']],
  ['FR0BulkHOTO','idx_FR0BulkHOTO_scanId_ts',['scanId','timestamp']],
  ['CourierHandover','idx_CourierHandover_partner_awb',['partner','awb']],
  ['OperationsMetadata','idx_OperationsMetadata_location_id',['location_id']],
  ['scanned_barcode_inventory','idx_sbi_location_scanned',['scan_location','scanned_at']],
  ['ndd_shipments','idx_ndd_created_at',['created_at']],
  ['ndd_shipments','idx_ndd_awb',['awb']],
];

const bt = (s) => '`' + s + '`';
const HIST = 'mydb_history';

async function getCutoff(conn) {
  const [r] = await conn.query('SELECT (NOW() - INTERVAL 6 MONTH) AS c, NOW() AS n, VERSION() AS v');
  return r[0];
}

async function indexExists(conn, db, table, name) {
  const [r] = await conn.query(
    'SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND INDEX_NAME=? LIMIT 1',
    [db, table, name]
  );
  return r.length > 0;
}

async function phaseCheck(conn, db) {
  const meta = await getCutoff(conn);
  console.log(`\nServer: MySQL ${meta.v} | now=${meta.n} | cutoff(6mo)=${meta.c}`);
  console.log(`Connected DB: ${db}\n`);

  console.log('=== Rows older than cutoff per eligible event table ===');
  let grand = 0;
  for (const [t, col] of PURGE) {
    try {
      const [tot] = await conn.query(`SELECT COUNT(*) c FROM ${bt(db)}.${bt(t)}`);
      const [old] = await conn.query(
        `SELECT COUNT(*) c FROM ${bt(db)}.${bt(t)} WHERE ${bt(col)} < ?`, [meta.c]
      );
      grand += Number(old[0].c);
      console.log(`  ${t.padEnd(38)} total=${String(tot[0].c).padStart(9)}  toPurge=${String(old[0].c).padStart(9)}  (${col})`);
    } catch (e) {
      console.log(`  ${t.padEnd(38)} ERROR ${e.code || e.message}`);
    }
  }
  console.log(`  ${'TOTAL TO PURGE'.padEnd(38)} ${String(grand).padStart(20)}\n`);

  console.log('=== Index status (missing ones will be created) ===');
  for (const [t, name, cols] of INDEXES) {
    const ex = await indexExists(conn, db, t, name);
    console.log(`  [${ex ? 'EXISTS ' : 'MISSING'}] ${t}.${name} (${cols.join(', ')})`);
  }

  const [h] = await conn.query(
    'SELECT COUNT(*) c FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=?', [HIST]
  );
  console.log(`\nHistory schema ${HIST}: ${h[0].c ? 'EXISTS' : 'absent'}`);
}

async function phaseInspect(conn, db) {
  const [tabs] = await conn.query(
    'SELECT TABLE_NAME, TABLE_ROWS, ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=? ORDER BY TABLE_NAME',
    [HIST]
  );
  console.log(`\n=== Tables currently in ${HIST} (${tabs.length}) ===`);
  if (tabs.length === 0) console.log('  (none)');
  for (const t of tabs) console.log(`  ${String(t.TABLE_NAME).padEnd(38)} ~rows=${String(t.TABLE_ROWS).padStart(10)}  ${t.ENGINE}`);

  console.log(`\n=== Column-layout compatibility (purge tables): ${db} vs ${HIST} ===`);
  for (const [t] of PURGE) {
    const [cMain] = await conn.query(
      'SELECT ORDINAL_POSITION p, COLUMN_NAME n, COLUMN_TYPE ct FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? ORDER BY ORDINAL_POSITION',
      [db, t]
    );
    const [cHist] = await conn.query(
      'SELECT ORDINAL_POSITION p, COLUMN_NAME n, COLUMN_TYPE ct FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? ORDER BY ORDINAL_POSITION',
      [HIST, t]
    );
    if (cHist.length === 0) { console.log(`  ${t.padEnd(38)} history table ABSENT (will be created by LIKE)`); continue; }
    const sig = (cols) => cols.map((c) => `${c.p}:${c.n}:${c.ct}`).join('|');
    const match = sig(cMain) === sig(cHist);
    let extra = '';
    if (!match) {
      const mn = cMain.map((c) => c.n).join(','); const hn = cHist.map((c) => c.n).join(',');
      extra = `\n      main(${cMain.length}): ${mn}\n      hist(${cHist.length}): ${hn}`;
    }
    const [rc] = await conn.query(`SELECT COUNT(*) c FROM ${bt(HIST)}.${bt(t)}`);
    console.log(`  ${t.padEnd(38)} ${match ? 'MATCH  ' : 'MISMATCH'}  histRows=${String(rc[0].c).padStart(9)}${extra}`);
  }
}

async function phaseExplain(conn, db) {
  const Q = [
    ['PackingScan dedup (scanId)', `SELECT \`id\` FROM ${bt(db)}.\`PackingScan\` WHERE \`scanId\`='SNXS0000000000000001'`],
    ['PackingScan stats (stationId+timestamp)', `SELECT COUNT(*) FROM ${bt(db)}.\`PackingScan\` WHERE \`stationId\`='ST1' AND \`timestamp\` >= '2026-06-18 04:00:00'`],
    ['FR0 stats (stationId+createdAt)', `SELECT \`scanId\` FROM ${bt(db)}.\`FR0Scan\` WHERE \`stationId\`='ST1' AND \`createdAt\` >= '2026-06-18 04:00:00'`],
    ['Courier dedup (partner+awb)', `SELECT \`id\` FROM ${bt(db)}.\`CourierHandover\` WHERE \`partner\`='Delcart' AND \`awb\`='AWB123'`],
    ['Courier stats (partner)', `SELECT COUNT(*) FROM ${bt(db)}.\`CourierHandover\` WHERE \`partner\`='Delcart'`],
    ['NDD upsert delete (awb)', `SELECT \`id\` FROM ${bt(db)}.\`ndd_shipments\` WHERE \`awb\` IN ('A1','A2')`],
    ['NDD stats (created_at range)', `SELECT \`type\` FROM ${bt(db)}.\`ndd_shipments\` WHERE \`created_at\` >= '2026-06-01' AND \`created_at\` < '2026-06-19'`],
    ['Inventory preview (scan_location)', `SELECT * FROM ${bt(db)}.\`scanned_barcode_inventory\` WHERE \`scan_location\`='L1' ORDER BY \`scanned_at\` DESC`],
    ['Operations lookup (location_id)', `SELECT * FROM ${bt(db)}.\`OperationsMetadata\` WHERE \`location_id\`='L1'`],
    ['EHS list (date range, existing idx)', `SELECT * FROM ${bt(db)}.\`EHSDeviation\` WHERE \`date\` >= '2026-01-01' AND \`date\` <= '2026-06-18' ORDER BY \`date\` DESC`],
  ];
  console.log('\n=== EXPLAIN: index actually chosen by the optimizer ===');
  for (const [label, sql] of Q) {
    const [rows] = await conn.query('EXPLAIN ' + sql);
    const r = rows[0] || {};
    console.log(`  ${label}`);
    console.log(`      type=${r.type}  key=${r.key || '(none)'}  rows=${r.rows}  Extra=${r.Extra || ''}`);
  }
}

async function phaseHistory(conn, db) {
  await conn.query(`CREATE DATABASE IF NOT EXISTS ${bt(HIST)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`ensured database ${HIST}`);
  for (const t of ALL_TABLES) {
    await conn.query(`CREATE TABLE IF NOT EXISTS ${bt(HIST)}.${bt(t)} LIKE ${bt(db)}.${bt(t)}`);
    console.log(`  cloned structure: ${HIST}.${t}`);
  }
  const [r] = await conn.query('SELECT COUNT(*) c FROM information_schema.TABLES WHERE TABLE_SCHEMA=?', [HIST]);
  console.log(`History schema now has ${r[0].c} tables.`);
}

async function phaseIndexes(conn, db) {
  for (const [t, name, cols] of INDEXES) {
    if (await indexExists(conn, db, t, name)) {
      console.log(`  SKIP   ${t}.${name} (already exists)`);
      continue;
    }
    const colSql = cols.map(bt).join(', ');
    const ddl = `CREATE INDEX ${bt(name)} ON ${bt(db)}.${bt(t)} (${colSql}) ALGORITHM=INPLACE LOCK=NONE`;
    const t0 = Date.now();
    await conn.query(ddl);
    console.log(`  CREATE ${t}.${name} (${cols.join(', ')})  ${Date.now() - t0}ms`);
  }
}

async function phasePurge(conn, db, batch = 5000, sleepMs = 100) {
  const meta = await getCutoff(conn);
  const cutoff = meta.c;
  console.log(`Purging rows older than ${cutoff} | batch=${batch} sleep=${sleepMs}ms (archive -> ${HIST}, then batched delete)\n`);
  for (const [t, col] of PURGE) {
    // verify history target exists before writing
    const [h] = await conn.query(
      'SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=? LIMIT 1', [HIST, t]
    );
    if (h.length === 0) { console.log(`  ${t.padEnd(38)} SKIP (no ${HIST}.${t} -- run 'history' first)`); continue; }

    let archived = 0, purged = 0, rounds = 0; const t0 = Date.now();
    for (;;) {
      const [ids] = await conn.query(
        `SELECT \`id\` FROM ${bt(db)}.${bt(t)} WHERE ${bt(col)} < ? ORDER BY \`id\` LIMIT ${batch}`,
        [cutoff]
      );
      if (ids.length === 0) break;
      const idList = ids.map((row) => row.id);
      const [ins] = await conn.query(
        `INSERT IGNORE INTO ${bt(HIST)}.${bt(t)} SELECT m.* FROM ${bt(db)}.${bt(t)} m WHERE m.\`id\` IN (?)`,
        [idList]
      );
      archived += ins.affectedRows || 0;
      const [del] = await conn.query(
        `DELETE FROM ${bt(db)}.${bt(t)} WHERE \`id\` IN (?)`, [idList]
      );
      purged += del.affectedRows || 0;
      rounds++;
      if (rounds % 25 === 0) console.log(`    ${t} ... purged ${purged} so far (${rounds} batches, ${Math.round((Date.now()-t0)/1000)}s)`);
      if (sleepMs > 0) await new Promise((r) => setTimeout(r, sleepMs));
    }
    console.log(`  ${t.padEnd(38)} archived=${String(archived).padStart(9)}  purged=${String(purged).padStart(9)}  (${rounds} batches, ${Math.round((Date.now()-t0)/1000)}s)`);
  }
}

// ---- recurring retention: server-side stored procs + monthly EVENT ----
async function phaseSchedule(conn) {
  // 1) privileges + scheduler status
  const [grants] = await conn.query('SHOW GRANTS FOR CURRENT_USER()');
  console.log('Current grants:');
  grants.forEach((g) => console.log('  ' + Object.values(g)[0]));
  const [es] = await conn.query('SELECT @@event_scheduler AS es');
  console.log(`\nevent_scheduler = ${es[0].es}\n`);

  // 2) generic helper proc: archive+batched-delete one table older than 6 months
  const helper = `CREATE PROCEDURE mydb.sp_archive_purge_table(IN p_table VARCHAR(64), IN p_ts_col VARCHAR(64), IN p_batch INT)
BEGIN
  DECLARE v_rows INT DEFAULT 1;
  CREATE TEMPORARY TABLE IF NOT EXISTS _rp_ids (id BIGINT PRIMARY KEY);
  DELETE FROM _rp_ids;
  WHILE v_rows > 0 DO
    DELETE FROM _rp_ids;
    SET @pick = CONCAT('INSERT INTO _rp_ids (id) SELECT \`id\` FROM \`mydb\`.\`', p_table, '\` WHERE \`', p_ts_col, '\` < (NOW() - INTERVAL 6 MONTH) ORDER BY \`id\` LIMIT ', p_batch);
    PREPARE s FROM @pick; EXECUTE s; DEALLOCATE PREPARE s;
    -- Count the staging table directly: ROW_COUNT() is reset by DEALLOCATE PREPARE.
    SELECT COUNT(*) INTO v_rows FROM _rp_ids;
    IF v_rows > 0 THEN
      SET @arch = CONCAT('INSERT IGNORE INTO \`mydb_history\`.\`', p_table, '\` SELECT m.* FROM \`mydb\`.\`', p_table, '\` m JOIN _rp_ids p ON m.\`id\` = p.id');
      PREPARE s FROM @arch; EXECUTE s; DEALLOCATE PREPARE s;
      SET @del = CONCAT('DELETE m FROM \`mydb\`.\`', p_table, '\` m JOIN _rp_ids p ON m.\`id\` = p.id');
      PREPARE s FROM @del; EXECUTE s; DEALLOCATE PREPARE s;
      DO SLEEP(0.1);
    END IF;
  END WHILE;
  DROP TEMPORARY TABLE IF EXISTS _rp_ids;
END`;

  // 3) orchestrator proc: call helper for every eligible event table
  const calls = PURGE.map(([t, c]) => `  CALL mydb.sp_archive_purge_table('${t}', '${c}', 5000);`).join('\n');
  const orchestrator = `CREATE PROCEDURE mydb.sp_retention_purge()\nBEGIN\n${calls}\nEND`;

  // 4) monthly event: 1st of next month at 02:00 (server is IST), then every month
  const event = `CREATE EVENT IF NOT EXISTS mydb.ev_retention_purge_monthly
ON SCHEDULE EVERY 1 MONTH
STARTS (DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') + INTERVAL 1 MONTH + INTERVAL 2 HOUR)
ON COMPLETION PRESERVE
COMMENT 'Archive rows >6 months into mydb_history, then batched delete'
DO CALL mydb.sp_retention_purge()`;

  try {
    await conn.query('DROP PROCEDURE IF EXISTS mydb.sp_archive_purge_table');
    await conn.query(helper);
    await conn.query('DROP PROCEDURE IF EXISTS mydb.sp_retention_purge');
    await conn.query(orchestrator);
    console.log('created stored procedures: sp_archive_purge_table, sp_retention_purge');
  } catch (e) { console.log('PROC create failed:', e.code || e.message); return; }

  try {
    await conn.query('DROP EVENT IF EXISTS mydb.ev_retention_purge_monthly');
    await conn.query(event);
    console.log('created event: ev_retention_purge_monthly (EVERY 1 MONTH)');
  } catch (e) { console.log('EVENT create failed:', e.code || e.message, '- needs EVENT privilege'); }

  try {
    await conn.query('SET GLOBAL event_scheduler = ON');
    console.log('event_scheduler turned ON');
  } catch (e) {
    console.log(`could NOT enable event_scheduler (${e.code || e.message}). Ask a DBA to: SET GLOBAL event_scheduler = ON;`);
  }

  const [evs] = await conn.query(
    "SELECT EVENT_NAME, STATUS, CONCAT(INTERVAL_VALUE,' ',INTERVAL_FIELD) AS recurrence, STARTS, LAST_EXECUTED FROM information_schema.EVENTS WHERE EVENT_SCHEMA='mydb'"
  );
  console.log('\nScheduled events in mydb:');
  console.log(evs);
}

// ---- rollback helpers (mirror 99_rollback.sql, runnable without a mysql client) ----
async function phaseRestore(conn, db) {
  console.log(`Restoring purged rows from ${HIST} back into ${db} (INSERT IGNORE)...\n`);
  for (const [t] of PURGE) {
    const [r] = await conn.query(
      `INSERT IGNORE INTO ${bt(db)}.${bt(t)} SELECT * FROM ${bt(HIST)}.${bt(t)}`
    );
    console.log(`  ${t.padEnd(38)} reinserted=${String(r.affectedRows || 0).padStart(9)}`);
  }
}
async function phaseDropIndexes(conn, db) {
  console.log('Dropping the indexes created by the indexes phase...\n');
  for (const [t, name] of INDEXES) {
    if (!(await indexExists(conn, db, t, name))) { console.log(`  SKIP ${t}.${name} (absent)`); continue; }
    await conn.query(`DROP INDEX ${bt(name)} ON ${bt(db)}.${bt(t)} ALGORITHM=INPLACE LOCK=NONE`);
    console.log(`  DROP ${t}.${name}`);
  }
}

(async () => {
  const phase = process.argv[2] || 'check';
  const cfg = loadDbUrl();
  console.log(`Connecting to mydb at ${cfg.host}:${cfg.port} as ${cfg.user} ...`);
  const conn = await mysql.createConnection({
    ...cfg, multipleStatements: false, connectTimeout: 12000,
    supportBigNumbers: true, bigNumberStrings: true,
  });
  try {
    if (phase === 'check') await phaseCheck(conn, cfg.database);
    else if (phase === 'inspect') await phaseInspect(conn, cfg.database);
    else if (phase === 'explain') await phaseExplain(conn, cfg.database);
    else if (phase === 'history') await phaseHistory(conn, cfg.database);
    else if (phase === 'indexes') await phaseIndexes(conn, cfg.database);
    else if (phase === 'purge') await phasePurge(conn, cfg.database);
    else if (phase === 'schedule') await phaseSchedule(conn);
    else if (phase === 'prooftest') {
      const N = (r) => Number(r[0].c);
      const over = `SELECT COUNT(*) c FROM mydb.PackingScan WHERE \`timestamp\` < (NOW() - INTERVAL 6 MONTH)`;
      const [h1] = await conn.query('SELECT COUNT(*) c FROM mydb_history.PackingScan');
      const [p1] = await conn.query(over);
      console.log(`before: mydb.PackingScan over-cutoff=${N(p1)}  mydb_history.PackingScan=${N(h1)}`);
      await conn.query('CALL mydb.sp_retention_purge()');
      const [h2] = await conn.query('SELECT COUNT(*) c FROM mydb_history.PackingScan');
      const [p2] = await conn.query(over);
      console.log(`after : mydb.PackingScan over-cutoff=${N(p2)}  mydb_history.PackingScan=${N(h2)}`);
      console.log(`=> proc archived ${N(h2) - N(h1)} PackingScan rows into history (delete confirmed if > 0)`);
    }
    else if (phase === 'runproc') {
      console.log('Calling mydb.sp_retention_purge() ...');
      const t0 = Date.now();
      await conn.query('CALL mydb.sp_retention_purge()');
      console.log(`sp_retention_purge finished in ${Math.round((Date.now() - t0) / 1000)}s`);
    }
    else if (phase === 'restore') await phaseRestore(conn, cfg.database);
    else if (phase === 'drop-indexes') await phaseDropIndexes(conn, cfg.database);
    else throw new Error(`unknown phase: ${phase}`);
    console.log(`\nPhase '${phase}' complete.`);
  } finally {
    await conn.end();
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
