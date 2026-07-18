import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { nexsPool } from '@/utils/nexsPool';
import {
  BIGQUERY_DATA_PROJECT_ID,
  runBigQuery,
} from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 1500;

const pidRanges = [
  'pid > 10000 AND pid < 10000000',
  'pid > 1000001 AND pid < 800000000',
  'pid > 80000001 AND pid < 1000000000',
  'pid > 100000001 AND pid < 10000000000',
];

const table = (dataset: string, name: string) =>
  `\`${BIGQUERY_DATA_PROJECT_ID}.${dataset}.${name}\``;

function blockedInventory(): string {
  return pidRanges.map((range) => `
    SELECT pid, quantity
    FROM ${table('nexs_cid', 'warehouse_blocked_inventory')}
    WHERE facility = 'NXS1' AND legal_owner = 'LKIN'
      AND ${range} AND quantity <> 0`).join('\nUNION ALL\n');
}

function availableInventory(facility: string, owner: string): string {
  return pidRanges.map((range) => `
    SELECT wi.pid, wi.facility,
      wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
    FROM ${table('nexs_cid', 'warehouse_inventory')} wi
    LEFT JOIN ${table('nexs_cid', 'warehouse_blocked_inventory')} wbi
      ON wi.pid = wbi.pid
      AND wi.facility = wbi.facility
      AND wi.legal_owner = wbi.legal_owner
    WHERE wi.facility = '${facility}'
      AND wi.legal_owner = '${owner}'
      AND wi.condition = 'GOOD'
      AND wi.availability = 'AVAILABLE'
      AND wi.status = 'AVAILABLE'
      AND wi.location_type = 'DEFAULT'
      AND ${range}
      AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0`).join('\nUNION ALL\n');
}

type QuerySource = 'adaptive' | 'bigquery';
type DumpQuery = { name: string; sql: string };

// The only dumps authorized to use BigQuery. Everything else is Adaptive.
// Keep backend selection in this single allowlist so a query definition can
// never accidentally opt itself into BigQuery.
const BIGQUERY_DUMP_IDS = new Set([
  'asrs-tote',
  'egl-manual',
  'reserve-inventory',
]);

const QUERIES: Record<string, DumpQuery> = {
  'asrs-tote': {
    name: 'ASRS_Tote_Dump',
    sql: `SELECT pid, location, COUNT(*) AS barcode_count,
            MAX(updated_at) AS last_updated_at
          FROM ${table('nexs_ims', 'barcode_item')}
          WHERE facility = 'NXS1'
            AND location LIKE 'NXS1-ASRS%'
            AND \`condition\` = 'GOOD'
            AND availability = 'AVAILABLE'
            AND status = 'AVAILABLE'
          GROUP BY pid, location`,
  },
  'blocked-inventory': { name: 'Blocked_Inventory', sql: blockedInventory() },
  'dubai-inventory': { name: 'Dubai_Inventory', sql: availableInventory('DXB1', 'LKAE') },
  'egl-manual': {
    name: 'EGL_Manual',
    sql: `SELECT pid, location, COUNT(*) AS barcode_count,
            MAX(updated_at) AS last_updated_at
          FROM ${table('nexs_ims', 'barcode_item')}
          WHERE facility = 'NXS1'
            AND location LIKE 'NXS1-EGL_Manual%'
            AND \`condition\` = 'GOOD'
            AND availability = 'AVAILABLE'
            AND status = 'AVAILABLE'
          GROUP BY pid, location`,
  },
  'manual-stock-progressive': {
    name: 'Manual_Location_Stock_Progressive',
    sql: `SELECT pid, location, COUNT(*) AS barcode_count
          FROM ${table('nexs_ims', 'barcode_item')}
          WHERE facility = 'NXS1'
            AND (location LIKE 'NXS1-156%'
              OR location LIKE 'NXS1-160%'
              OR location LIKE 'NXS1-PL_Manual-02%'
              OR location LIKE 'NXS1-PL_Manual-01%')
            AND \`condition\` = 'GOOD'
            AND availability = 'AVAILABLE'
            AND status = 'AVAILABLE'
          GROUP BY pid, location`,
  },
  'manual-warehouse-replenishment': {
    name: 'Manual_Warehouse_Replenishment',
    sql: `SELECT pid, location, COUNT(*) AS barcode_count
          FROM ${table('nexs_ims', 'barcode_item')}
          WHERE facility = 'NXS1'
            AND \`condition\` = 'GOOD'
            AND availability = 'AVAILABLE'
            AND status = 'AVAILABLE'
            AND (${[
              'NXS1-156%', 'NXS1-160%', 'NXS1-EGL_Fastzone%',
              'NXS1-PL_Tinted_HIGH%', 'NXS1-PL_Tinted_LOW%', 'NXS1-PL_TOKAI%',
              'NXS1-PL_Photochromatic%', 'NXS1-PL_Other%', 'NXS1-PL_Nightdrive%',
              'NXS1-Progressive_MR8%', 'NXS1-PL_Rodenstock%',
              'NXS1-Progressive_Acrylic%', 'NXS1-PL_167_160Bluecut%',
              'NXS1-PL_174Bluecut%', 'NXS1-PL_ARC%', 'NXS1-PL_MR8_IR%',
              'NXS1-156_Bluecut%', 'NXS1-EGL_Eye%', 'NXS1-EGL_Sun%',
              'NXS1-Bhiwadi_Manual-EGL_Eye%',
              'NXS1-Bhiwadi_Manual-EGL_Fastzone%',
              'NXS1-Bhiwadi_Manual-EGL_Sun%',
            ].map((p) => `location LIKE '${p}'`).join(' OR ')})
          GROUP BY pid, location`,
  },
  'nxs1-inventory': { name: 'NXS1_Inventory', sql: availableInventory('NXS1', 'LKIN') },
  'nxs2-inventory': { name: 'NXS2_Inventory', sql: availableInventory('NXS2', 'LKIN') },
  'reserve-inventory': {
    name: 'Reserve_Inventory',
    sql: `SELECT pid, SUM(quantity) AS quantity
          FROM ${table('nexs_cid', 'warehouse_inventory')}
          WHERE facility = 'NXS1' AND location_type = 'RESERVED'
          GROUP BY pid`,
  },
  'singapore-inventory': { name: 'Singapore_Inventory', sql: availableInventory('SGNXS1', 'LKSG') },
  'thailand-inventory': { name: 'Thailand_Inventory', sql: availableInventory('TH01', 'LKTH') },
  'br01-inventory': {
    name: 'BR01_Inventory_Dump',
    sql: `SELECT pid, location, COUNT(*) AS barcode_count,
            MAX(updated_at) AS last_updated_at
          FROM ${table('nexs_ims', 'barcode_item')}
          WHERE facility = 'BR01'
            AND location LIKE 'BR01-BRCL%'
            AND \`condition\` = 'GOOD'
            AND availability = 'AVAILABLE'
            AND status = 'AVAILABLE'
          GROUP BY pid, location`,
  },
  'br01-putaway-pending': {
    name: 'BR01_Putaway_Pending',
    sql: `SELECT pid, location, barcode, updated_at
          FROM ${table('nexs_ims', 'barcode_item')}
          WHERE (pid, location) IN (
            SELECT pid, location
            FROM ${table('nexs_ims', 'barcode_item')}
            WHERE facility = 'BR01'
              AND location LIKE 'BR01.GOOD%'
              AND \`condition\` = 'GOOD'
              AND availability = 'AVAILABLE'
              AND status = 'PUTAWAY_PENDING'
            GROUP BY pid, location
          )
            AND availability = 'AVAILABLE'
            AND \`condition\` = 'GOOD'
            AND status = 'PUTAWAY_PENDING'`,
  },
};

// Query definitions use BigQuery's fully-qualified table form. Adaptive/MySQL
// accepts the same SQL after reducing `project.dataset.table` to dataset.table.
function mysqlSql(sql: string): string {
  return sql.replace(/`[^`]+\.([^.]+)\.([^`]+)`/g, '$1.$2');
}

function csvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id') || '';
  const dump = QUERIES[id];
  if (!dump) return NextResponse.json({ error: 'Unknown dump' }, { status: 400 });

  try {
    const source: QuerySource = BIGQUERY_DUMP_IDS.has(id) ? 'bigquery' : 'adaptive';
    console.info(`[grafana-dumps:${id}] source=${source}`);
    let records: Record<string, unknown>[];
    let headers: string[];

    if (source === 'bigquery') {
      const result = await runBigQuery(dump.sql);
      records = result.rows;
      headers = result.columns;
    } else {
      const [rows] = await nexsPool.query<RowDataPacket[]>(mysqlSql(dump.sql));
      records = rows as Record<string, unknown>[];
      headers = records.length ? Object.keys(records[0]) : [];
    }
    const csv = [
      headers.map(csvCell).join(','),
      ...records.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
    ].join('\r\n');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${dump.name}_${stamp}.csv"`,
        'Cache-Control': 'no-store',
        'X-Row-Count': String(records.length),
        'X-Query-Source': source,
      },
    });
  } catch (error) {
    console.error(`[grafana-dumps:${id}]`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Dump failed' },
      { status: 500 },
    );
  }
}
