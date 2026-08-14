import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { ensureOmtHealthSchema, refreshOmtPositionHealth } from '@/utils/omtTrayHealth';
import { omtOrderModeLabel, omtPriorityLabel } from '@/utils/omtPriority';
import {
  databaseErrorCode,
  isDatabaseUnavailableError,
  withDatabaseConnectionRetry,
} from '@/utils/databaseRetry';
import { authMiddleware } from '@/middleware/auth';
import type { AuthenticatedRequest } from '@/middleware/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RACK_COUNT = 40;
const POSITIONS_PER_RACK = 20;

type TrayRow = {
  tray_barcode: string;
  stack_level: number;
  fitting_id: bigint | number | null;
  shipment_id: string | null;
  max_qcf_count: number;
  operator_id: string | null;
  priority: string | null;
  priority_classification: string | null;
  order_type: string | null;
  order_mode: string | null;
  order_date: string | null;
  validation_status: string;
  validation_message: string | null;
  validated_at: Date | string | null;
  putaway_at: Date | string;
};

let tableReady = false;
let tablePromise: Promise<void> | null = null;

async function createTables() {
  if (tableReady) return;
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
  await ensureOmtHealthSchema();
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
  tableReady = true;
}

async function ensureTables() {
  if (tableReady) return;
  if (!tablePromise) tablePromise = withDatabaseConnectionRetry(createTables, 'dispatch');
  const pending = tablePromise;
  try {
    await pending;
  } finally {
    if (tablePromise === pending) tablePromise = null;
  }
}

function normalizePosition(raw: unknown) {
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toUpperCase().replaceAll('_', '-').replaceAll(' ', '');
  const current = normalized.match(/^NXS1-OMT-(\d{2})-(\d{3})$/);
  if (current) {
    const rack = Number(current[1]);
    const position = Number(current[2]);
    if (rack >= 1 && rack <= RACK_COUNT && position >= 1 && position <= POSITIONS_PER_RACK) {
      return { barcode: `NXS1-OMT-${String(rack).padStart(2, '0')}-${String(position).padStart(3, '0')}`, rack, position };
    }
  }
  const chronological = normalized.match(/^NXS1-OMT-(\d{3,4})$/);
  if (chronological) {
    const sequence = Number(chronological[1]);
    if (sequence >= 1 && sequence <= RACK_COUNT * POSITIONS_PER_RACK) {
      const rack = Math.floor((sequence - 1) / POSITIONS_PER_RACK) + 1;
      const position = ((sequence - 1) % POSITIONS_PER_RACK) + 1;
      return { barcode: `NXS1-OMT-${String(rack).padStart(2, '0')}-${String(position).padStart(3, '0')}`, rack, position };
    }
  }
  const legacy = normalized.match(/^OMT-R(\d{1,2})-?P(\d{1,2})$/);
  if (!legacy) return null;
  const rack = Number(legacy[1]);
  const position = Number(legacy[2]);
  return rack >= 1 && rack <= RACK_COUNT && position >= 1 && position <= POSITIONS_PER_RACK
    ? { barcode: `NXS1-OMT-${String(rack).padStart(2, '0')}-${String(position).padStart(3, '0')}`, rack, position }
    : null;
}

function isoValue(value: Date | string | null) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : String(value);
}

async function readPosition(positionBarcode: string) {
  const rows = await prismaDispatch.$queryRawUnsafe<TrayRow[]>(
    `SELECT tray_barcode, stack_level, fitting_id, shipment_id, max_qcf_count,
            operator_id, priority, priority_classification, order_type, order_mode,
            order_date, validation_status, validation_message, validated_at, putaway_at
     FROM omt_tray_putaway
     WHERE position_barcode = ?
     ORDER BY stack_level`,
    positionBarcode,
  );
  return rows.map((row) => ({
    trayBarcode: row.tray_barcode,
    stackLevel: Number(row.stack_level),
    fittingId: row.fitting_id == null ? null : String(row.fitting_id),
    shipmentId: row.shipment_id,
    maxQcfCount: Number(row.max_qcf_count ?? 0),
    operatorId: row.operator_id,
    priority: omtPriorityLabel(row.priority, row.order_mode, row.priority_classification),
    priorityClassification: row.priority_classification,
    orderType: row.order_type,
    orderMode: omtOrderModeLabel(row.priority, row.order_mode, row.priority_classification),
    orderDate: row.order_date,
    liveStatus: row.validation_status || 'PENDING',
    statusMessage: row.validation_message,
    validatedAt: isoValue(row.validated_at),
    putawayAt: isoValue(row.putaway_at),
  }));
}

export const POST = authMiddleware(async (request: AuthenticatedRequest) => {
  const startedAt = Date.now();
  try {
    await ensureTables();
    const body = await request.json();
    const operatorId = request.user.employeeCode;
    const position = normalizePosition(body?.positionBarcode);
    if (!position) {
      return NextResponse.json({ error: 'Scan a valid OMT location', code: 'INVALID_POSITION' }, { status: 400 });
    }

    const health = await refreshOmtPositionHealth(request, position.barcode);
    const trays = await readPosition(position.barcode);
    const problemTrays = trays.filter((tray) => tray.liveStatus !== 'VALID').map((tray) => tray.trayBarcode);
    await prismaDispatch.$executeRawUnsafe(
      `INSERT INTO omt_activity_logs (
         event_type, operator_id, result, position_barcode, duration_ms, metadata_json
       ) VALUES ('CYCLE_COUNT', ?, ?, ?, ?, ?)`,
      operatorId,
      problemTrays.length ? 'ATTENTION' : trays.length ? 'SUCCESS' : 'EMPTY',
      position.barcode,
      Date.now() - startedAt,
      JSON.stringify({ trayCount: trays.length, problemTrays }),
    );

    return NextResponse.json({ position, trays, health });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.error('[omt/cycle-count] database unavailable', { code: databaseErrorCode(error) });
      return NextResponse.json(
        { error: 'Database temporarily unavailable. Please retry in a few seconds.' },
        { status: 503, headers: { 'Retry-After': '3', 'Cache-Control': 'no-store' } },
      );
    }
    console.error('[omt/cycle-count] failed:', error);
    return NextResponse.json({ error: (error as Error).message || 'Unable to count this position' }, { status: 500 });
  }
});
