const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tokenFile = process.env.BQ_TOKEN_PATH || path.join(
  root, 'src', 'utils', 'resources', 'bigquery', 'token.json',
);
const project = process.env.BQ_DATA_PROJECT_ID || 'lenskart-datahub';

async function accessToken() {
  const token = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
  const response = await fetch(token.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: token.client_id,
      client_secret: token.client_secret,
    }),
  });
  const body = await response.json();
  if (!body.access_token) throw new Error(body.error_description || body.error || 'OAuth failed');
  return body.access_token;
}

async function query(token, sql) {
  const response = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${project}/queries`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql, useLegacySql: false, timeoutMs: 120000, maxResults: 1000 }),
  });
  const body = await response.json();
  if (body.error || body.errors?.length) throw new Error(body.error?.message || body.errors[0].message);
  return (body.rows || []).map((row) => row.f.map((cell) => cell.v));
}

async function getJson(token, url) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json();
  if (!response.ok || body.error) {
    throw new Error(body.error?.message || `HTTP ${response.status}`);
  }
  return body;
}

async function findTables(token, wantedNames) {
  const found = [];
  let pageToken;
  do {
    const params = new URLSearchParams({ all: 'true', maxResults: '1000' });
    if (pageToken) params.set('pageToken', pageToken);
    const datasetsPage = await getJson(
      token,
      `https://bigquery.googleapis.com/bigquery/v2/projects/${project}/datasets?${params}`,
    );
    for (const dataset of datasetsPage.datasets || []) {
      const datasetId = dataset.datasetReference.datasetId;
      let tablePageToken;
      do {
        const tableParams = new URLSearchParams({ maxResults: '1000' });
        if (tablePageToken) tableParams.set('pageToken', tablePageToken);
        try {
          const tablesPage = await getJson(
            token,
            `https://bigquery.googleapis.com/bigquery/v2/projects/${project}/datasets/${datasetId}/tables?${tableParams}`,
          );
          for (const table of tablesPage.tables || []) {
            const tableId = table.tableReference.tableId;
            if (wantedNames.has(String(tableId).toLowerCase())) found.push(`${datasetId}.${tableId}`);
          }
          tablePageToken = tablesPage.nextPageToken;
        } catch {
          tablePageToken = undefined;
        }
      } while (tablePageToken);
    }
    pageToken = datasetsPage.nextPageToken;
  } while (pageToken);
  return found;
}

(async () => {
  const token = await accessToken();
  const datasets = [
    'wms', 'nexs_ims', 'nexs', 'nexs_cid', 'orderqc', 'picking', 'optimadb',
    'qcf', 'nexs_picking', 'nexs_courier',
  ];
  const wanted = /order|barcode|qc_status|purchase|picklist|shipment_item/i;
  for (const dataset of datasets) {
    try {
      const rows = await query(token,
        `SELECT table_name FROM \`${project}.${dataset}.INFORMATION_SCHEMA.TABLES\` ORDER BY table_name`);
      const matches = rows.flat().filter((name) => wanted.test(String(name)));
      console.log(`${dataset}: accessible; ${matches.length} relevant table(s)`);
      for (const name of matches) console.log(`  ${name}`);
    } catch (error) {
      console.log(`${dataset}: unavailable (${error.message})`);
    }
  }
  const mirrored = await findTables(token, new Set([
    'qc_status_history',
    'picklist_order_item',
    'shipment_item_score_details',
  ]));
  console.log(`mirrored target tables: ${mirrored.length ? mirrored.join(', ') : 'none visible'}`);
  const relatedColumns = await query(token, `
    SELECT table_name, column_name
    FROM \`${project}.wms.INFORMATION_SCHEMA.COLUMNS\`
    WHERE REGEXP_CONTAINS(LOWER(column_name), r'(qc|reason|picklist|score)')
    ORDER BY table_name, ordinal_position
  `);
  console.log('wms QC/picking/score-related columns:');
  for (const [tableName, columnName] of relatedColumns) {
    console.log(`  ${tableName}.${columnName}`);
  }
  const sourceColumns = await query(token, `
    SELECT table_name, column_name
    FROM \`${project}.wms.INFORMATION_SCHEMA.COLUMNS\`
    WHERE table_name IN ('order_items', 'order_item_header')
    ORDER BY table_name, ordinal_position
  `);
  console.log('wms source columns:');
  for (const [tableName, columnName] of sourceColumns) {
    console.log(`  ${tableName}.${columnName}`);
  }
  for (const [dataset, table] of [
    ['orderqc', 'qc_status_history'],
    ['picking', 'picklist_order_item'],
    ['optimadb', 'shipment_item_score_details'],
  ]) {
    const columns = await query(token, `
      SELECT column_name, data_type
      FROM \`${project}.${dataset}.INFORMATION_SCHEMA.COLUMNS\`
      WHERE table_name = '${table}'
      ORDER BY ordinal_position
    `);
    console.log(`${dataset}.${table} columns:`);
    for (const [columnName, dataType] of columns) {
      console.log(`  ${columnName}: ${dataType}`);
    }
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
