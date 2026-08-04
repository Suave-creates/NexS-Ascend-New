import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { getNexsToken, invalidateNexsToken } from '@/utils/resources/nexs/auth';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;
const RACK_COUNT = 40;
const POSITIONS_PER_RACK = 20;

type StorageRow = {
  position_barcode: string;
  tray_barcode: string;
  stack_level: number;
  fitting_id: bigint | number | null;
};

let tableReady = false;

function isMissingTable(error: unknown) {
  const value = error as { code?: string; meta?: { code?: string; message?: string }; message?: string };
  return value?.code === 'P2010'
    && (String(value.meta?.code) === '1146'
      || String(value.meta?.message ?? value.message).toLowerCase().includes("doesn't exist"));
}

async function ensureColumn(columnName: string, definition: string) {
  const rows = await prismaDispatch.$queryRawUnsafe<Array<{ found: number }>>(
    `SELECT 1 AS found FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'omt_tray_putaway' AND column_name = ? LIMIT 1`,
    columnName,
  );
  if (!rows[0]) await prismaDispatch.$executeRawUnsafe(`ALTER TABLE omt_tray_putaway ADD COLUMN ${definition}`);
}

async function ensureFittingIndex() {
  const rows = await prismaDispatch.$queryRawUnsafe<Array<{ found: number }>>(
    `SELECT 1 AS found FROM information_schema.statistics
     WHERE table_schema = DATABASE() AND table_name = 'omt_tray_putaway' AND index_name = 'uq_omt_fitting' LIMIT 1`,
  );
  if (!rows[0]) {
    await prismaDispatch.$executeRawUnsafe('ALTER TABLE omt_tray_putaway ADD UNIQUE KEY uq_omt_fitting (fitting_id)');
  }
}

async function ensureTables() {
  if (tableReady) {
    try {
      await prismaDispatch.$queryRawUnsafe('SELECT 1 FROM omt_tray_putaway LIMIT 0');
      await prismaDispatch.$queryRawUnsafe('SELECT 1 FROM omt_activity_logs LIMIT 0');
      return;
    } catch (error) {
      if (!isMissingTable(error)) throw error;
      tableReady = false;
    }
  }

  await prismaDispatch.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS omt_tray_putaway (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      position_barcode VARCHAR(24) NOT NULL,
      tray_barcode VARCHAR(100) NOT NULL,
      fitting_id BIGINT UNSIGNED NULL,
      shipment_id VARCHAR(64) NULL,
      max_qcf_count INT UNSIGNED NOT NULL DEFAULT 0,
      operator_id VARCHAR(64) NULL,
      stack_level TINYINT UNSIGNED NOT NULL,
      putaway_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY uq_omt_tray (tray_barcode),
      UNIQUE KEY uq_omt_fitting (fitting_id),
      UNIQUE KEY uq_omt_position_level (position_barcode, stack_level),
      KEY idx_omt_position (position_barcode)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await ensureColumn('fitting_id', 'fitting_id BIGINT UNSIGNED NULL AFTER tray_barcode');
  await ensureColumn('shipment_id', 'shipment_id VARCHAR(64) NULL AFTER fitting_id');
  await ensureColumn('max_qcf_count', 'max_qcf_count INT UNSIGNED NOT NULL DEFAULT 0 AFTER shipment_id');
  await ensureColumn('operator_id', 'operator_id VARCHAR(64) NULL AFTER max_qcf_count');
  await ensureFittingIndex();

  await prismaDispatch.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS omt_activity_logs (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      event_type VARCHAR(40) NOT NULL,
      operator_id VARCHAR(64) NULL,
      result VARCHAR(32) NOT NULL,
      tray_barcode VARCHAR(100) NULL,
      related_tray_barcode VARCHAR(100) NULL,
      fitting_id BIGINT UNSIGNED NULL,
      shipment_id VARCHAR(64) NULL,
      position_barcode VARCHAR(24) NULL,
      stack_level TINYINT UNSIGNED NULL,
      max_qcf_count INT UNSIGNED NULL,
      order_type VARCHAR(40) NULL,
      duration_ms INT UNSIGNED NULL,
      metadata_json JSON NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      KEY idx_omt_logs_created (created_at),
      KEY idx_omt_logs_operator (operator_id, created_at),
      KEY idx_omt_logs_fitting (fitting_id, created_at),
      KEY idx_omt_logs_event (event_type, result, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await prismaDispatch.$executeRawUnsafe(`
    UPDATE omt_tray_putaway
    SET position_barcode = CONCAT(
      'NXS1-OMT-', LPAD(CAST(SUBSTRING(position_barcode, 6, 2) AS UNSIGNED), 2, '0'), '-',
      LPAD(CAST(SUBSTRING(position_barcode, 10, 2) AS UNSIGNED), 3, '0')
    )
    WHERE position_barcode REGEXP '^OMT-R[0-9]{2}-P[0-9]{2}$'
  `);
  await prismaDispatch.$executeRawUnsafe(`
    UPDATE omt_tray_putaway
    SET position_barcode = CONCAT(
      'NXS1-OMT-',
      LPAD(FLOOR((CAST(SUBSTRING(position_barcode, 10) AS UNSIGNED) - 1) / ${POSITIONS_PER_RACK}) + 1, 2, '0'),
      '-',
      LPAD(MOD(CAST(SUBSTRING(position_barcode, 10) AS UNSIGNED) - 1, ${POSITIONS_PER_RACK}) + 1, 3, '0')
    )
    WHERE position_barcode REGEXP '^NXS1-OMT-[0-9]{3,4}$'
  `);
  tableReady = true;
}

function normalizeOperatorId(value: unknown) {
  return typeof value === 'string' ? value.trim().toUpperCase().slice(0, 64) : '';
}

function normalizeTrayId(value: unknown) {
  const trayId = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return TRAY_ID_PATTERN.test(trayId) ? trayId : null;
}

function decodePosition(positionBarcode: string) {
  const match = positionBarcode.match(/^NXS1-OMT-(\d{2})-(\d{3})$/);
  if (!match) return null;
  const rackNumber = Number(match[1]);
  const positionNumber = Number(match[2]);
  if (rackNumber < 1 || rackNumber > RACK_COUNT || positionNumber < 1 || positionNumber > POSITIONS_PER_RACK) return null;
  return { rackNumber, positionNumber };
}

async function logScan(entry: {
  operatorId?: string;
  result: string;
  trayId?: string;
  masterTrayId?: string;
  fittingId?: string;
  shipmentId?: string;
  positionBarcode?: string | null;
  stackLevel?: number | null;
  maxQcfCount?: number;
  orderType?: string;
  durationMs: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prismaDispatch.$executeRawUnsafe(
      `INSERT INTO omt_activity_logs (
         event_type, operator_id, result, tray_barcode, related_tray_barcode,
         fitting_id, shipment_id, position_barcode, stack_level, max_qcf_count,
         order_type, duration_ms, metadata_json
       ) VALUES ('MASTER_SEGREGATOR_SCAN', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      entry.operatorId || null,
      entry.result,
      entry.trayId || null,
      entry.masterTrayId || null,
      entry.fittingId || null,
      entry.shipmentId || null,
      entry.positionBarcode || null,
      entry.stackLevel ?? null,
      entry.maxQcfCount ?? null,
      entry.orderType || null,
      entry.durationMs,
      entry.metadata ? JSON.stringify(entry.metadata) : null,
    );
  } catch (error) {
    console.error('[Master Segregator] log write failed:', error);
  }
}

async function nexsGet(request: Request, url: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json, text/plain, */*',
    Origin: 'https://app.nexs.lenskart.com',
    Referer: 'https://app.nexs.lenskart.com/',
    'source-domain': 'https://app.nexs.lenskart.com',
  };
  for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  }

  const browserCookie = request.headers.get('cookie');
  const usingBrowserCookie = Boolean(browserCookie?.includes('jwt-token'));
  const wmsApp = process.env.NEXS_WMS_APP_ID || 'nexs_wms';
  let cookie: string | null = usingBrowserCookie ? browserCookie : null;
  if (!cookie) {
    const token = await getNexsToken(wmsApp);
    if (token) cookie = `jwt-token=${token}`;
  }

  const call = (authCookie: string | null) => {
    const requestHeaders = { ...headers };
    if (authCookie) requestHeaders.Cookie = authCookie;
    return fetch(url, { method: 'GET', headers: requestHeaders, cache: 'no-store' });
  };

  let response = await call(cookie);
  if (response.status === 401 && !usingBrowserCookie) {
    invalidateNexsToken(wmsApp);
    const freshToken = await getNexsToken(wmsApp, true);
    if (freshToken) response = await call(`jwt-token=${freshToken}`);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = String(payload?.meta?.displayMessage || payload?.message || `NexS returned HTTP ${response.status}`);
    throw new Error(message);
  }
  return payload;
}

function orderAge(orderDate: string) {
  const parsed = Date.parse(`${orderDate.trim().replace(' ', 'T')}+05:30`);
  if (!Number.isFinite(parsed)) return { label: 'Unknown', days: null };
  const elapsedMs = Math.max(0, Date.now() - parsed);
  const days = Math.floor(elapsedMs / 86_400_000);
  const hours = Math.floor((elapsedMs % 86_400_000) / 3_600_000);
  return { label: `${days} day${days === 1 ? '' : 's'} ${hours} hour${hours === 1 ? '' : 's'}`, days };
}

async function traceFitting(fittingId: string, shipmentId: string) {
  return runBigQuery(
    `WITH fitting_rows AS (
       SELECT
         CAST(oi.location_id AS STRING) AS tray_id,
         COALESCE(oi.qc_fail_count, 0) AS qc_fail_count,
         oi.created_at,
         oi.id,
         CAST(oi.shipping_package_id AS STRING) AS shipment_id
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\` oi
       WHERE CAST(oi.fitting_id AS STRING) = @fitting_id
     ),
     master AS (
       SELECT tray_id AS master_tray_id
       FROM fitting_rows
       WHERE tray_id IS NOT NULL AND tray_id != ''
       QUALIFY ROW_NUMBER() OVER (ORDER BY qc_fail_count ASC, created_at ASC, id ASC) = 1
     ),
     fitting_shipments AS (
       SELECT DISTINCT shipment_id FROM fitting_rows WHERE shipment_id IS NOT NULL AND shipment_id != ''
     ),
     qcf_by_shipment AS (
       SELECT
         fs.shipment_id,
         COUNT(DISTINCT TIMESTAMP_TRUNC(q.updated_at, HOUR)) AS qcf_count
       FROM fitting_shipments fs
       LEFT JOIN \`${BIGQUERY_DATA_PROJECT_ID}.orderqc.qc_status_history\` q
         ON CAST(q.shipping_package_id AS STRING) = fs.shipment_id
        AND q.status = 'QCFailed'
       GROUP BY fs.shipment_id
     ),
     current_order AS (
       SELECT COALESCE(CAST(oih.order_item_type AS STRING), '') AS order_type
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_item_header\` oih
       WHERE CAST(oih.shipping_package_id AS STRING) = @shipment_id
       LIMIT 1
     )
     SELECT
       m.master_tray_id,
       COALESCE((SELECT MAX(qcf_count) FROM qcf_by_shipment), 0) AS max_qcf_count,
       COALESCE((SELECT order_type FROM current_order), 'N/A') AS order_type
     FROM master m`,
    1,
    { fitting_id: fittingId, shipment_id: shipmentId },
  );
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let operatorId = '';
  let scannedTrayId = '';

  try {
    await ensureTables();
    const body = await request.json();
    operatorId = normalizeOperatorId(body?.operatorId);
    scannedTrayId = typeof body?.trayId === 'string' ? body.trayId.trim().toUpperCase() : '';
    const trayId = normalizeTrayId(body?.trayId);

    if (!operatorId) {
      await logScan({ result: 'REJECTED', trayId: scannedTrayId, durationMs: Date.now() - startedAt, metadata: { reason: 'OPERATOR_REQUIRED' } });
      return NextResponse.json({ error: 'Operator ID is required', code: 'OPERATOR_REQUIRED' }, { status: 400 });
    }
    if (!trayId) {
      await logScan({ operatorId, result: 'REJECTED', trayId: scannedTrayId, durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_TRAY_ID' } });
      return NextResponse.json({
        error: 'Invalid tray ID; use 2 letters followed by 5 digits (example: CT11042)',
        code: 'INVALID_TRAY_ID',
      }, { status: 400 });
    }

    const fittingPayload = await nexsGet(
      request,
      `https://app.nexs.lenskart.com/nexs/wms/api/v1/fittingDetails/${encodeURIComponent(trayId)}`,
    );
    const fittingId = String(fittingPayload?.data?.fitting_id ?? '').trim();
    const shipmentId = String(fittingPayload?.data?.shipment_id ?? '').trim();
    if (!/^\d+$/.test(fittingId) || !shipmentId) {
      await logScan({
        operatorId, result: 'REJECTED', trayId, fittingId, shipmentId,
        durationMs: Date.now() - startedAt, metadata: { reason: 'INCOMPLETE_FITTING_DETAILS' },
      });
      return NextResponse.json({ error: 'Fitting ID or shipment ID is missing in NexS WMS', code: 'INCOMPLETE_FITTING_DETAILS' }, { status: 422 });
    }

    const [headerPayload, trace, storageRows] = await Promise.all([
      nexsGet(
        request,
        `https://app.nexs.lenskart.com/nexs/wms/api/v1/order/details/header?id=${encodeURIComponent(shipmentId)}`,
      ),
      traceFitting(fittingId, shipmentId),
      prismaDispatch.$queryRawUnsafe<StorageRow[]>(
        `SELECT position_barcode, tray_barcode, stack_level, fitting_id
         FROM omt_tray_putaway ORDER BY position_barcode, stack_level`,
      ),
    ]);

    if (!trace.rows[0]?.master_tray_id) {
      await logScan({
        operatorId, result: 'REJECTED', trayId, fittingId, shipmentId,
        durationMs: Date.now() - startedAt, metadata: { reason: 'MASTER_NOT_FOUND' },
      });
      return NextResponse.json({ error: 'Master tray could not be identified for this fitting', code: 'MASTER_NOT_FOUND' }, { status: 404 });
    }

    const traceRow = trace.rows[0];
    const masterTrayId = String(traceRow.master_tray_id).trim().toUpperCase();
    const maxQcfCount = Number(traceRow.max_qcf_count ?? 0);
    const rawOrderType = String(traceRow.order_type ?? '').trim() || 'N/A';
    const orderMode = rawOrderType.toUpperCase().includes('JIT') ? 'JIT' : 'REGULAR';
    const masterStorage = storageRows.find((row) => row.tray_barcode.toUpperCase() === masterTrayId);
    const fittingStorage = storageRows.find((row) => row.fitting_id != null && String(row.fitting_id) === fittingId);
    const decodedPosition = masterStorage ? decodePosition(masterStorage.position_barcode) : null;
    const header = headerPayload?.data ?? {};
    const orderDate = String(header.orderDate ?? '').trim();
    const age = orderAge(orderDate);
    const masterInOmt = Boolean(masterStorage);
    const result = masterInOmt ? 'FOUND_IN_OMT' : 'RESORTER_REQUIRED';

    await logScan({
      operatorId,
      result,
      trayId,
      masterTrayId,
      fittingId,
      shipmentId,
      positionBarcode: masterStorage?.position_barcode ?? null,
      stackLevel: masterStorage ? Number(masterStorage.stack_level) : null,
      maxQcfCount,
      orderType: rawOrderType,
      durationMs: Date.now() - startedAt,
      metadata: {
        priority: String(header.priority ?? 'N/A'),
        orderDate,
        orderAge: age.label,
        storedTrayForFitting: fittingStorage?.tray_barcode ?? null,
      },
    });

    return NextResponse.json({
      data: {
        scannedTrayId: trayId,
        fittingId,
        shipmentId,
        priority: String(header.priority ?? 'N/A'),
        orderDate: orderDate || 'N/A',
        orderAge: age.label,
        orderAgeDays: age.days,
        orderMode,
        rawOrderType,
        maxQcfCount,
        masterTrayId,
        masterInOmt,
        positionBarcode: masterStorage?.position_barcode ?? null,
        rackNumber: decodedPosition?.rackNumber ?? null,
        positionNumber: decodedPosition?.positionNumber ?? null,
        stackLevel: masterStorage ? Number(masterStorage.stack_level) : null,
        storedTrayForFitting: fittingStorage?.tray_barcode ?? null,
        decision: masterInOmt ? 'OMT_READY' : 'RESORTER_REQUIRED',
        decisionMessage: masterInOmt
          ? `Master is available at ${masterStorage?.position_barcode}`
          : 'Send to Resorter — do not put away. Resorter number will be added after DB access.',
        lookupMs: Date.now() - startedAt,
      },
    });
  } catch (error) {
    console.error('[Master Segregator] scan failed:', error);
    await logScan({
      operatorId,
      result: 'ERROR',
      trayId: scannedTrayId,
      durationMs: Date.now() - startedAt,
      metadata: { message: (error as Error).message },
    });
    return NextResponse.json({ error: (error as Error).message || 'Unable to segregate tray' }, { status: 502 });
  }
}
