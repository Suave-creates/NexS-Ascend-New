import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { fetchOmtTrayDetails, OmtNexsError } from '@/utils/resources/nexs/omt';
import { authMiddleware } from '@/middleware/auth';
import type { AuthenticatedRequest } from '@/middleware/auth';

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
      priority VARCHAR(40) NULL,
      priority_classification VARCHAR(100) NULL,
      order_type VARCHAR(100) NULL,
      order_mode VARCHAR(16) NULL,
      order_date VARCHAR(64) NULL,
      validation_status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
      validation_message VARCHAR(500) NULL,
      validated_at DATETIME(3) NULL,
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

export const POST = authMiddleware(async (request: AuthenticatedRequest) => {
  const startedAt = Date.now();
  let operatorId = '';
  let scannedTrayId = '';

  try {
    await ensureTables();
    const body = await request.json();
    operatorId = request.user.employeeCode;
    scannedTrayId = typeof body?.trayId === 'string' ? body.trayId.trim().toUpperCase() : '';
    const trayId = normalizeTrayId(body?.trayId);

    if (!trayId) {
      await logScan({ operatorId, result: 'REJECTED', trayId: scannedTrayId, durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_TRAY_ID' } });
      return NextResponse.json({
        error: 'Invalid tray ID; use 2 letters followed by 5 digits (example: CT11042)',
        code: 'INVALID_TRAY_ID',
      }, { status: 400 });
    }

    const [details, storageRows] = await Promise.all([
      fetchOmtTrayDetails(request, trayId),
      prismaDispatch.$queryRawUnsafe<StorageRow[]>(
        `SELECT position_barcode, tray_barcode, stack_level, fitting_id
         FROM omt_tray_putaway ORDER BY position_barcode, stack_level`,
      ),
    ]);
    const { fittingId, shipmentId, maxQcfCount, rawOrderType } = details;
    // The "master" tray is whichever tray for this fitting already went
    // through Tray Putaway — not a rank computed from live NexS data.
    const masterStorage = storageRows.find((row) => row.fitting_id != null && String(row.fitting_id) === fittingId);
    const masterTrayId = masterStorage?.tray_barcode ?? null;
    const decodedPosition = masterStorage ? decodePosition(masterStorage.position_barcode) : null;
    const masterInOmt = Boolean(masterStorage);
    const result = masterInOmt ? 'FOUND_IN_OMT' : 'RESORTER_REQUIRED';

    await logScan({
      operatorId,
      result,
      trayId,
      masterTrayId: masterTrayId ?? undefined,
      fittingId,
      shipmentId,
      positionBarcode: masterStorage?.position_barcode ?? null,
      stackLevel: masterStorage ? Number(masterStorage.stack_level) : null,
      maxQcfCount,
      orderType: rawOrderType,
      durationMs: Date.now() - startedAt,
      metadata: {
        priority: details.priority,
        orderDate: details.orderDate,
        orderAge: details.orderAge,
        storedTrayForFitting: masterTrayId,
      },
    });

    return NextResponse.json({
      data: {
        scannedTrayId: trayId,
        fittingId,
        shipmentId,
        priority: details.priority,
        orderDate: details.orderDate,
        orderAge: details.orderAge,
        orderAgeDays: details.orderAgeDays,
        orderMode: details.orderMode,
        rawOrderType,
        maxQcfCount,
        masterTrayId,
        masterInOmt,
        positionBarcode: masterStorage?.position_barcode ?? null,
        rackNumber: decodedPosition?.rackNumber ?? null,
        positionNumber: decodedPosition?.positionNumber ?? null,
        stackLevel: masterStorage ? Number(masterStorage.stack_level) : null,
        storedTrayForFitting: masterTrayId,
        decision: masterInOmt ? 'OMT_READY' : 'RESORTER_REQUIRED',
        decisionMessage: masterInOmt
          ? `Master is available at ${masterStorage?.position_barcode}`
          : 'Send to Resorter — do not put away. Resorter number will be added after DB access.',
        lookupMs: details.lookupMs,
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
    const status = error instanceof OmtNexsError ? error.status : 502;
    const code = error instanceof OmtNexsError ? error.code : 'SEGREGATION_FAILED';
    return NextResponse.json({ error: (error as Error).message || 'Unable to segregate tray', code }, { status });
  }
});
