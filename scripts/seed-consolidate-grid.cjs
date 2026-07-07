// ConsolidAte — re-seed the PTL grid into the dispatch_ptl DB.
//
//   node scripts/seed-consolidate-grid.cjs --confirm [--racks=4]
//
// Creates R racks x 25 slots (5 rows x 5 cols) with GLOBAL location numbering
//   locationNumber = (rack-1)*25 + (row-1)*5 + col      (slot 1 = rack1 top-left)
// and a per-slot barcode NXS-PTL-<nnn>.
//
// DESTRUCTIVE: clears existing racks/locations and all assignment history in the
// dispatch_ptl DB (legacy AWB flow + any consolidation state). Intended for the
// one-time rewire to the new 5x5 grid. Requires --confirm. NOT run automatically.

const fs = require('fs');
const path = require('path');

// --- load DATABASE_URL_DISPATCH from the project's env files ---
function loadEnv(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
['.env', '.env.local', '.env.global'].forEach((f) => loadEnv(path.join(process.cwd(), f)));

const args = process.argv.slice(2);
const arg = (name) => {
  const hit = args.find((a) => a.startsWith(name + '='));
  return hit ? hit.split('=')[1] : undefined;
};
const RACKS = Math.max(1, parseInt(arg('--racks') || '4', 10));
const ROWS = 5, COLS = 5, PER_RACK = ROWS * COLS;

if (!args.includes('--confirm')) {
  console.error(
    `\nRefusing to run without --confirm.\n` +
    `This will DELETE all racks/locations + assignment history in dispatch_ptl\n` +
    `and reseed ${RACKS} rack(s) x ${PER_RACK} slots.\n\n` +
    `  node scripts/seed-consolidate-grid.cjs --confirm --racks=${RACKS}\n`
  );
  process.exit(1);
}

const { PrismaClient } = require(path.join(process.cwd(), 'src', 'generated', 'dispatch'));
const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$transaction(async (tx) => {
      // Clear dependents first (FK order), then the grid.
      await tx.consolidationScan.deleteMany({});
      await tx.packageConsolidation.deleteMany({});
      await tx.placement.deleteMany({});
      await tx.awb.deleteMany({});
      await tx.routingAssignment.deleteMany({});
      await tx.locationEvent.deleteMany({});
      await tx.location.deleteMany({});
      await tx.rack.deleteMany({});

      for (let r = 1; r <= RACKS; r++) {
        const rack = await tx.rack.create({
          data: { rackNumber: r, totalLevels: ROWS, totalPositions: COLS, createdAt: new Date() },
        });
        for (let row = 1; row <= ROWS; row++) {
          for (let col = 1; col <= COLS; col++) {
            const locationNumber = (r - 1) * PER_RACK + (row - 1) * COLS + col;
            await tx.location.create({
              data: {
                rackId: rack.id,
                level: row,
                position: col,
                locationNumber,
                barcode: `NXS-PTL-${String(locationNumber).padStart(3, '0')}`,
                lightState: 'OFF',
                isActive: true,
                createdAt: new Date(),
              },
            });
          }
        }
      }
    });
    const n = RACKS * PER_RACK;
    console.log(`✔ Seeded ${RACKS} rack(s), ${n} slots (locationNumber 1..${n}).`);
  } catch (e) {
    console.error('Seed failed:', e.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
