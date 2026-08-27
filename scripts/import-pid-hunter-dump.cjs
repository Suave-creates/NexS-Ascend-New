const { createHash } = require('crypto');
const path = require('path');
const XLSX = require('xlsx');
if (!process.env.DATABASE_URL) process.loadEnvFile(path.join(process.cwd(), '.env'));
const { PrismaClient } = require('../src/generated/mydb');

const prisma = new PrismaClient();
const file = process.argv[2];

if (!file) {
  console.error('Usage: node scripts/import-pid-hunter-dump.cjs <workbook.xlsx>');
  process.exit(1);
}

function value(input) {
  return input == null ? '' : String(input).trim();
}

function classify(condition, status) {
  const c = value(condition).toUpperCase();
  const s = value(status).toUpperCase();
  if (c === 'BAD') return ['BAD', 'BAD BIN'];
  if (s === 'DISPATCHED') return ['BAD', 'DISPATCHED BIN'];
  if (s === 'RELEASED' || s === 'QC_HOLD') return ['BAD', 'RELEASED BIN'];
  if (['MANIFEST_CREATED', 'PACKAGING', 'INVOICED', 'IN_GATE_PASS'].includes(s)) return ['BAD', 'DISPATCHED BIN'];
  if (['LIQUIDATED', 'DISCARDED', 'RETURNED', 'SUSPENDED'].includes(s)) return ['BAD', 'BAD BIN'];
  if (['PUTAWAY_PENDING', 'GRN_DONE', 'UNICOM_PIPELINE'].includes(s)) return ['SYNC_ISSUE', 'SYNC ISSUE BIN'];
  if (['IN_TRAY', 'PICKED', 'PENDING_CUSTOMIZATION', 'CUSTOMIZATION_COMPLETE', 'EDGING', 'ORDER_QC'].includes(s)) return ['LOST', 'LOST BIN'];
  return ['GOOD', null];
}

function parseDate(input) {
  if (input instanceof Date && !Number.isNaN(input.valueOf())) return input;
  const raw = value(input);
  const match = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/);
  if (!match) throw new Error(`Unsupported scanned_at value: ${raw}`);
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]), Number(match[6]));
}

function sourceKey(row) {
  const canonical = [row.barcode, row.pid, row.scanned_at, row.scan_location, row.tote, row.tote_simplified].map(value).join('|');
  return `xlsx:${createHash('sha256').update(canonical).digest('hex')}`;
}

async function main() {
  const workbook = XLSX.readFile(file, { cellDates: true });
  const sheet = workbook.Sheets['Scan Data'];
  if (!sheet) throw new Error('Workbook must contain a "Scan Data" sheet');
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true });
  const required = ['pid', 'barcode', 'scan_location', 'tote', 'tote_simplified', 'tote_number', 'scanned_at'];
  if (rows.length && required.some((column) => !(column in rows[0]))) throw new Error('Workbook headers do not match the PID Hunter dump format');

  const toteMap = new Map();
  for (const row of rows) {
    const toteId = value(row.tote).toUpperCase();
    const toteNumber = Number(row.tote_number);
    if (!/^TL\d{10}$/.test(toteId) || !Number.isInteger(toteNumber)) throw new Error(`Invalid tote mapping for barcode ${value(row.barcode)}`);
    const previous = toteMap.get(toteNumber);
    if (previous && previous !== toteId) throw new Error(`Tote number ${toteNumber} maps to multiple tote IDs`);
    toteMap.set(toteNumber, toteId);
  }

  for (const [toteNumber, toteId] of toteMap) {
    await prisma.pidHunterTote.upsert({
      where: { toteNumber },
      update: { toteId, isFree: false },
      create: { toteNumber, toteId, isFree: false },
    });
  }

  let inserted = 0;
  const occurrences = new Map();
  for (let offset = 0; offset < rows.length; offset += 1000) {
    const data = rows.slice(offset, offset + 1000).map((row) => {
      const toteId = value(row.tote).toUpperCase();
      const toteNumber = Number(row.tote_number);
      const simplified = value(row.tote_simplified);
      const partition = Number(simplified.split('-').pop());
      if (![1, 2, 3, 4].includes(partition)) throw new Error(`Invalid partition for barcode ${value(row.barcode)}`);
      const [bucket, binName] = classify(row.condition, row.status);
      const baseSourceKey = sourceKey(row);
      const occurrence = (occurrences.get(baseSourceKey) || 0) + 1;
      occurrences.set(baseSourceKey, occurrence);
      return {
        pid: value(row.pid),
        barcode: value(row.barcode).slice(-12),
        status: value(row.status) || null,
        condition: value(row.condition) || null,
        availability: value(row.availability) || null,
        nexsLocation: value(row.nexs_location) || null,
        currentLocation: `${toteId}|${toteNumber}-${partition}`,
        rawLocation: value(row.scan_location) || null,
        toteId,
        toteNumber,
        partition,
        bucket,
        binName,
        mode: 'IMPORT',
        sourceKey: `${baseSourceKey}:${occurrence}`,
        scannedAt: parseDate(row.scanned_at),
      };
    });
    const result = await prisma.pidHunterScan.createMany({ data, skipDuplicates: true });
    inserted += result.count;
    console.log(`Processed ${Math.min(offset + data.length, rows.length)}/${rows.length}; inserted ${inserted}`);
  }
  console.log(JSON.stringify({ rows: rows.length, inserted, skipped: rows.length - inserted, totes: toteMap.size }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
