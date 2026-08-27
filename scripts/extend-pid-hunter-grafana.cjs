const fs = require('fs');
const path = require('path');

const input = process.argv[2];
const output = process.argv[3] || path.join('grafana', 'pid-hunter-dashboard.json');

if (!input) {
  console.error('Usage: node scripts/extend-pid-hunter-grafana.cjs <source.json> [output.json]');
  process.exit(1);
}

const dashboard = JSON.parse(fs.readFileSync(input, 'utf8'));
const datasource = dashboard.panels.find((panel) => panel.datasource)?.datasource || {
  type: 'mysql',
  uid: 'felu8k07so6psd',
};

const generatedPanelTitles = new Set([
  'Placement Analytics',
  'Placement Scans',
  'Unique Barcodes Placed',
  'GOOD Placements',
  'Exception Placements',
  'Placement Throughput by Bucket',
  'Placement History',
  'Compaction Analytics',
  'Barcodes Moved',
  'Unique Barcodes Compacted',
  'Compaction Moves',
  'Next Available Tote Number',
  'Compaction Throughput',
  'Compaction Movement History',
  'Current Tote and Partition Occupancy',
  'PID Stock-out and Handover',
  'Stocked Out Records',
  'Unique Barcodes Stocked Out',
  'Handover References',
  'Totes Stocked Out',
  'Stock-out Throughput by Handover',
  'Stock-out Handover Archive',
  'Daywise Handover Summary',
]);

dashboard.panels = dashboard.panels.filter((panel) => !generatedPanelTitles.has(panel.title));
let nextId = Math.max(0, ...dashboard.panels.map((panel) => panel.id || 0)) + 1;

const exportPanel = dashboard.panels.find((panel) => panel.title === 'Table for export');
if (exportPanel?.targets?.[0]) {
  exportPanel.title = 'Current Barcode Inventory for Export';
  exportPanel.targets[0].dataset = 'mydb';
  exportPanel.targets[0].rawSql =
    'SELECT pid, barcode, status, `condition`, availability, scan_location,\n' +
    '  tote, tote_simplified, tote_number, `partition`, scanned_at, nexs_location\n' +
    'FROM mydb.scanned_barcode_inventory\n' +
    'ORDER BY scanned_at DESC';
}

const changePanel = dashboard.panels.find((panel) => panel.title === 'Barcode Change over Logs');
if (changePanel?.targets?.[0]) {
  changePanel.title = 'Barcode Placement Change History';
  changePanel.targets[0].dataset = 'mydb';
  changePanel.targets[0].rawSql =
    'SELECT barcode, MAX(pid) AS pid, COUNT(*) AS history_records,\n' +
    '  MAX(CASE WHEN rn = 1 THEN current_location END) AS latest_location,\n' +
    '  MAX(CASE WHEN rn = 1 THEN tote_id END) AS latest_tote,\n' +
    '  MAX(CASE WHEN rn = 1 THEN CONCAT(tote_number, \'-\', `partition`) END) AS latest_tote_simplified,\n' +
    '  MAX(CASE WHEN rn = 1 THEN tote_number END) AS latest_tote_number,\n' +
    '  MAX(CASE WHEN rn = 2 THEN current_location END) AS previous_location,\n' +
    '  MAX(CASE WHEN rn = 1 THEN scanned_at END) AS latest_scan_at,\n' +
    '  MAX(CASE WHEN rn = 2 THEN scanned_at END) AS previous_scan_at\n' +
    'FROM (\n' +
    '  SELECT s.*, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS rn\n' +
    '  FROM mydb.pid_hunter_scans s\n' +
    ') ordered\n' +
    'GROUP BY barcode\n' +
    'HAVING COUNT(*) > 1\n' +
    'ORDER BY latest_scan_at DESC';
}

const pidPanel = dashboard.panels.find((panel) => panel.title === 'PID and Unique Barcode Count available');
if (pidPanel?.targets?.[0]) {
  pidPanel.targets[0].dataset = 'mydb';
  pidPanel.targets[0].rawSql =
    'SELECT pid, COUNT(DISTINCT barcode) AS barcode_count,\n' +
    '  COUNT(DISTINCT tote) AS tote_count\n' +
    'FROM mydb.scanned_barcode_inventory\n' +
    'GROUP BY pid\n' +
    'ORDER BY barcode_count DESC';
}

function target(rawSql, format = 'table') {
  return [{
    datasource,
    dataset: 'mydb',
    editorMode: 'code',
    format,
    rawQuery: true,
    rawSql,
    refId: 'A',
  }];
}

function stat(title, x, y, rawSql, color = 'green') {
  return {
    id: nextId++,
    title,
    type: 'stat',
    datasource,
    gridPos: { h: 5, w: 6, x, y },
    fieldConfig: {
      defaults: {
        color: { mode: 'thresholds' },
        mappings: [],
        thresholds: { mode: 'absolute', steps: [{ color }] },
      },
      overrides: [],
    },
    options: {
      colorMode: 'value',
      graphMode: 'area',
      justifyMode: 'auto',
      orientation: 'auto',
      reduceOptions: { calcs: ['lastNotNull'], fields: '', values: false },
      showPercentChange: false,
      textMode: 'auto',
      wideLayout: true,
    },
    pluginVersion: '12.0.0',
    targets: target(rawSql),
  };
}

function table(title, x, y, width, height, rawSql) {
  return {
    id: nextId++,
    title,
    type: 'table',
    datasource,
    gridPos: { h: height, w: width, x, y },
    fieldConfig: {
      defaults: {
        custom: { align: 'auto', cellOptions: { type: 'auto' }, filterable: true, inspect: false },
        mappings: [],
        thresholds: { mode: 'absolute', steps: [{ color: 'green' }] },
      },
      overrides: [],
    },
    options: {
      cellHeight: 'sm',
      footer: { countRows: false, fields: '', reducer: ['sum'], show: false },
      showHeader: true,
    },
    pluginVersion: '12.0.0',
    targets: target(rawSql),
  };
}

function timeseries(title, x, y, width, height, rawSql) {
  return {
    id: nextId++,
    title,
    type: 'timeseries',
    datasource,
    gridPos: { h: height, w: width, x, y },
    fieldConfig: {
      defaults: {
        color: { mode: 'palette-classic' },
        custom: {
          axisBorderShow: false,
          axisCenteredZero: false,
          axisColorMode: 'text',
          axisPlacement: 'auto',
          drawStyle: 'line',
          fillOpacity: 12,
          gradientMode: 'none',
          lineInterpolation: 'linear',
          lineWidth: 2,
          pointSize: 4,
          showPoints: 'auto',
          spanNulls: false,
          stacking: { group: 'A', mode: 'none' },
        },
        mappings: [],
        thresholds: { mode: 'absolute', steps: [{ color: 'green' }] },
      },
      overrides: [],
    },
    options: {
      legend: { calcs: [], displayMode: 'list', placement: 'bottom', showLegend: true },
      tooltip: { hideZeros: false, mode: 'multi', sort: 'desc' },
    },
    pluginVersion: '12.0.0',
    targets: target(rawSql, 'time_series'),
  };
}

function row(title, y) {
  return {
    id: nextId++,
    title,
    type: 'row',
    collapsed: false,
    gridPos: { h: 1, w: 24, x: 0, y },
    panels: [],
  };
}

const placementFilter = "mode = 'PLACEMENT' AND $__timeFilter(scanned_at)";
const compactionFilter = "mode = 'COMPACTION' AND compacted = TRUE AND $__timeFilter(scanned_at)";

dashboard.panels.push(
  row('Placement Analytics', 20),
  stat('Placement Scans', 0, 21, `SELECT COUNT(*) AS value FROM mydb.pid_hunter_scans WHERE ${placementFilter}`),
  stat('Unique Barcodes Placed', 6, 21, `SELECT COUNT(DISTINCT barcode) AS value FROM mydb.pid_hunter_scans WHERE ${placementFilter}`, 'blue'),
  stat('GOOD Placements', 12, 21, `SELECT COUNT(*) AS value FROM mydb.pid_hunter_scans WHERE ${placementFilter} AND bucket = 'GOOD'`, 'green'),
  stat('Exception Placements', 18, 21, `SELECT COUNT(*) AS value FROM mydb.pid_hunter_scans WHERE ${placementFilter} AND bucket <> 'GOOD'`, 'orange'),
  timeseries(
    'Placement Throughput by Bucket', 0, 26, 12, 9,
    "SELECT $__timeGroupAlias(scanned_at, '15m'), bucket AS metric, COUNT(*) AS value\n" +
      "FROM mydb.pid_hunter_scans\n" +
      `WHERE ${placementFilter}\n` +
      'GROUP BY 1, 2\nORDER BY 1',
  ),
  table(
    'Placement History', 12, 26, 12, 9,
    'SELECT scanned_at, barcode, pid, bucket, status, `condition`, availability, tote_number, `partition`, current_location, nexs_location\n' +
      'FROM mydb.pid_hunter_scans\n' +
      `WHERE ${placementFilter}\n` +
      'ORDER BY scanned_at DESC',
  ),
  row('Compaction Analytics', 35),
  stat('Barcodes Moved', 0, 36, `SELECT COUNT(*) AS value FROM mydb.pid_hunter_scans WHERE ${compactionFilter}`),
  stat('Unique Barcodes Compacted', 6, 36, `SELECT COUNT(DISTINCT barcode) AS value FROM mydb.pid_hunter_scans WHERE ${compactionFilter}`, 'blue'),
  stat(
    'Compaction Moves', 12, 36,
    "SELECT COUNT(*) AS value FROM (\n" +
      '  SELECT scanned_at, compacted_from, current_location\n' +
      '  FROM mydb.pid_hunter_scans\n' +
      `  WHERE ${compactionFilter}\n` +
      '  GROUP BY scanned_at, compacted_from, current_location\n' +
      ') moves',
    'purple',
  ),
  stat(
    'Next Available Tote Number', 18, 36,
    'WITH latest AS (\n' +
      '  SELECT tote_number, bucket, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num\n' +
      '  FROM mydb.pid_hunter_scans\n' +
      '), occupied AS (\n' +
      "  SELECT DISTINCT tote_number FROM latest WHERE row_num = 1 AND bucket = 'GOOD' AND tote_number IS NOT NULL\n" +
      '  UNION\n' +
      '  SELECT tote_number FROM mydb.pid_hunter_tote_reservations WHERE expires_at > CURRENT_TIMESTAMP(3)\n' +
      ')\n' +
      'SELECT CASE\n' +
      '  WHEN NOT EXISTS (SELECT 1 FROM occupied WHERE tote_number = 1) THEN 1\n' +
      '  ELSE MIN(o.tote_number + 1)\n' +
      'END AS value\n' +
      'FROM occupied o\n' +
      'LEFT JOIN occupied next_tote ON next_tote.tote_number = o.tote_number + 1\n' +
      'WHERE next_tote.tote_number IS NULL',
    'orange',
  ),
  timeseries(
    'Compaction Throughput', 0, 41, 12, 9,
    "SELECT $__timeGroupAlias(scanned_at, '15m'), COUNT(*) AS value\n" +
      'FROM mydb.pid_hunter_scans\n' +
      `WHERE ${compactionFilter}\n` +
      'GROUP BY 1\nORDER BY 1',
  ),
  table(
    'Compaction Movement History', 12, 41, 12, 9,
    'SELECT scanned_at, compacted_from AS source_location, current_location AS destination_location,\n' +
      '  tote_number AS destination_tote, `partition` AS destination_partition, COUNT(*) AS barcodes_moved\n' +
      'FROM mydb.pid_hunter_scans\n' +
      `WHERE ${compactionFilter}\n` +
      'GROUP BY scanned_at, compacted_from, current_location, tote_number, `partition`\n' +
      'ORDER BY scanned_at DESC',
  ),
  table(
    'Current Tote and Partition Occupancy', 0, 50, 24, 12,
    'WITH latest AS (\n' +
      '  SELECT s.*, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num\n' +
      '  FROM mydb.pid_hunter_scans s\n' +
      ')\n' +
      'SELECT t.tote_number, t.tote_id,\n' +
      '  SUM(CASE WHEN l.`partition` = 1 THEN 1 ELSE 0 END) AS partition_1,\n' +
      '  SUM(CASE WHEN l.`partition` = 2 THEN 1 ELSE 0 END) AS partition_2,\n' +
      '  SUM(CASE WHEN l.`partition` = 3 THEN 1 ELSE 0 END) AS partition_3,\n' +
      '  SUM(CASE WHEN l.`partition` = 4 THEN 1 ELSE 0 END) AS partition_4,\n' +
      '  COUNT(l.barcode) AS total_units\n' +
      'FROM mydb.pid_hunter_totes t\n' +
      "INNER JOIN latest l ON l.tote_number = t.tote_number AND l.row_num = 1 AND l.bucket = 'GOOD'\n" +
      'WHERE t.is_free = FALSE\n' +
      'GROUP BY t.tote_number, t.tote_id\n' +
      'ORDER BY t.tote_number',
  ),
  row('PID Stock-out and Handover', 62),
  stat(
    'Stocked Out Records', 0, 63,
    'SELECT COUNT(*) AS value FROM mydb.scanned_barcode_inventory_transfer WHERE $__timeFilter(injested_at)',
    'red',
  ),
  stat(
    'Unique Barcodes Stocked Out', 6, 63,
    'SELECT COUNT(DISTINCT barcode) AS value FROM mydb.scanned_barcode_inventory_transfer WHERE $__timeFilter(injested_at)',
    'blue',
  ),
  stat(
    'Handover References', 12, 63,
    "SELECT COUNT(DISTINCT NULLIF(handover, '')) AS value FROM mydb.scanned_barcode_inventory_transfer WHERE $__timeFilter(injested_at)",
    'purple',
  ),
  stat(
    'Totes Stocked Out', 18, 63,
    'SELECT COUNT(DISTINCT tote_number) AS value FROM mydb.scanned_barcode_inventory_transfer WHERE $__timeFilter(injested_at)',
    'orange',
  ),
  timeseries(
    'Stock-out Throughput by Handover', 0, 68, 12, 9,
    "SELECT $__timeGroupAlias(injested_at, '15m'), handover AS metric, COUNT(*) AS value\n" +
      'FROM mydb.scanned_barcode_inventory_transfer\n' +
      "WHERE $__timeFilter(injested_at) AND handover <> ''\n" +
      'GROUP BY 1, 2\nORDER BY 1',
  ),
  table(
    'Stock-out Handover Archive', 12, 68, 12, 9,
    'SELECT injested_at AS stocked_out_at, handover, barcode, pid, tote, tote_simplified, tote_number, `partition`,\n' +
      '  scan_location, nexs_location, status, `condition`, availability, scanned_at AS original_scan_at\n' +
      'FROM mydb.scanned_barcode_inventory_transfer\n' +
      'WHERE $__timeFilter(injested_at)\n' +
      'ORDER BY injested_at DESC',
  ),
  table(
    'Daywise Handover Summary', 0, 77, 24, 9,
    'SELECT DATE(injested_at) AS stock_out_date, handover, COUNT(DISTINCT barcode) AS barcodes,\n' +
      '  COUNT(DISTINCT pid) AS pids, COUNT(DISTINCT tote_number) AS totes,\n' +
      '  MIN(injested_at) AS first_stock_out, MAX(injested_at) AS last_stock_out\n' +
      'FROM mydb.scanned_barcode_inventory_transfer\n' +
      "WHERE $__timeFilter(injested_at) AND handover <> ''\n" +
      'GROUP BY DATE(injested_at), handover\n' +
      'ORDER BY stock_out_date DESC, handover',
  ),
);

dashboard.time = { from: 'now-30d', to: 'now' };
dashboard.version = (dashboard.version || 0) + 1;
dashboard.refresh = '5m';

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(dashboard, null, 2)}\n`);
console.log(`Wrote ${output} with ${dashboard.panels.length} panels.`);
