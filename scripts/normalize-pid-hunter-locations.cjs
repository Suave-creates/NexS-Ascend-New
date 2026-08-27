const path = require('path');
if (!process.env.DATABASE_URL) process.loadEnvFile(path.join(process.cwd(), '.env'));
const { PrismaClient } = require('../src/generated/mydb');

const prisma = new PrismaClient();

const LIVE_COLUMNS = [
  'id', 'pid', 'barcode', 'status', '`condition`', 'availability', 'scan_location',
  'nexs_location', 'tote', 'tote_simplified', 'tote_number', '`partition`', 'scanned_at',
].join(', ');

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`
      INSERT IGNORE INTO scanned_barcode_inventory_location_backup_20260815 (${LIVE_COLUMNS})
      SELECT ${LIVE_COLUMNS} FROM scanned_barcode_inventory
    `);

    await tx.$executeRawUnsafe(`
      INSERT INTO pid_hunter_location_stage_20260815
        (barcode, pid, status, \`condition\`, availability, nexs_location, tote,
         tote_simplified, tote_number, \`partition\`, scan_location, scanned_at)
      SELECT barcode, pid, status, \`condition\`, availability, nexs_location,
        tote_id,
        CONCAT(tote_number, '-', \`partition\`),
        tote_number,
        \`partition\`,
        CONCAT(tote_id, '|', tote_number, '-', \`partition\`, '|', tote_number),
        scanned_at
      FROM (
        SELECT s.*,
          ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
        FROM pid_hunter_scans s
        WHERE mode = 'IMPORT'
      ) latest
      WHERE row_num = 1
      ON DUPLICATE KEY UPDATE
        pid = VALUES(pid),
        status = VALUES(status),
        \`condition\` = VALUES(\`condition\`),
        availability = VALUES(availability),
        nexs_location = VALUES(nexs_location),
        tote = VALUES(tote),
        tote_simplified = VALUES(tote_simplified),
        tote_number = VALUES(tote_number),
        \`partition\` = VALUES(\`partition\`),
        scan_location = VALUES(scan_location),
        scanned_at = VALUES(scanned_at)
    `);

    await tx.$executeRawUnsafe(`
      INSERT IGNORE INTO scanned_barcode_inventory_location_archive_20260815 (${LIVE_COLUMNS})
      SELECT ${LIVE_COLUMNS}
      FROM (
        SELECT s.*,
          ROW_NUMBER() OVER (PARTITION BY s.barcode ORDER BY s.scanned_at DESC, s.id DESC) AS row_num
        FROM scanned_barcode_inventory s
        INNER JOIN pid_hunter_location_stage_20260815 stage
          ON stage.barcode = s.barcode
      ) ranked
      WHERE row_num > 1
    `);

    await tx.$executeRawUnsafe(`
      DELETE live
      FROM scanned_barcode_inventory live
      INNER JOIN (
        SELECT id
        FROM (
          SELECT s.id,
            ROW_NUMBER() OVER (PARTITION BY s.barcode ORDER BY s.scanned_at DESC, s.id DESC) AS row_num
          FROM scanned_barcode_inventory s
          INNER JOIN pid_hunter_location_stage_20260815 stage
            ON stage.barcode = s.barcode
        ) ranked
        WHERE row_num > 1
      ) redundant ON redundant.id = live.id
    `);

    await tx.$executeRawUnsafe(`
      UPDATE scanned_barcode_inventory live
      INNER JOIN pid_hunter_location_stage_20260815 stage
        ON stage.barcode = live.barcode
      SET live.scan_location = stage.scan_location,
          live.tote = stage.tote,
          live.tote_simplified = stage.tote_simplified,
          live.tote_number = stage.tote_number,
          live.\`partition\` = stage.\`partition\`
    `);

    await tx.$executeRawUnsafe(`
      INSERT INTO scanned_barcode_inventory
        (pid, barcode, status, \`condition\`, availability, scan_location, nexs_location,
         tote, tote_simplified, tote_number, \`partition\`, scanned_at)
      SELECT stage.pid, stage.barcode, stage.status, stage.\`condition\`, stage.availability,
        stage.scan_location, stage.nexs_location, stage.tote, stage.tote_simplified,
        stage.tote_number, stage.\`partition\`, stage.scanned_at
      FROM pid_hunter_location_stage_20260815 stage
      LEFT JOIN scanned_barcode_inventory live ON live.barcode = stage.barcode
      WHERE live.id IS NULL
    `);
  }, { maxWait: 30_000, timeout: 120_000 });

  const [counts] = await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*) FROM scanned_barcode_inventory) AS liveRows,
      (SELECT COUNT(*) FROM scanned_barcode_inventory_location_backup_20260815) AS backupRows,
      (SELECT COUNT(*) FROM scanned_barcode_inventory_location_archive_20260815) AS archivedRows,
      (SELECT COUNT(*) FROM scanned_barcode_inventory
        WHERE scan_location = CONCAT(tote, '|', tote_simplified, '|', tote_number)) AS normalizedRows,
      (SELECT COUNT(*) FROM pid_hunter_location_stage_20260815 stage
        INNER JOIN scanned_barcode_inventory live USING (barcode)) AS coveredBarcodes
  `);
  console.log(JSON.stringify({
    liveRows: Number(counts.liveRows),
    backupRows: Number(counts.backupRows),
    archivedSupersededRows: Number(counts.archivedRows),
    normalizedRows: Number(counts.normalizedRows),
    workbookBarcodesInLiveTable: Number(counts.coveredBarcodes),
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
