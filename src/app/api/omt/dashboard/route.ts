import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { ensureOmtHealthSchema, refreshOmtTrayHealth, startOmtHealthScheduler } from '@/utils/omtTrayHealth';
import { omtOrderModeLabel, omtPriorityLabel } from '@/utils/omtPriority';
import { orderAge } from '@/utils/resources/nexs/omt';
import {
  databaseErrorCode,
  isDatabaseUnavailableError,
  withDatabaseConnectionRetry,
} from '@/utils/databaseRetry';
import { authMiddleware } from '@/middleware/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SummaryRow = {
  putaway_total: bigint | number | string | null;
  marriage_total: bigint | number | string | null;
  removals_total: bigint | number | string | null;
  rejected_total: bigint | number | string | null;
  active_operators: bigint | number | string | null;
  average_duration_ms: number | string | null;
};

type OperatorRow = {
  operator_id: string;
  putaway_count: bigint | number | string | null;
  marriage_count: bigint | number | string | null;
  removal_count: bigint | number | string | null;
  rejected_count: bigint | number | string | null;
};

type HourRow = {
  hour_bucket: string;
  putaway_count: bigint | number | string | null;
  marriage_count: bigint | number | string | null;
};

type DumpRow = {
  id: string;
  position_barcode: string;
  tray_barcode: string;
  fitting_id: bigint | number | string | null;
  shipment_id: string | null;
  max_qcf_count: number | string | null;
  operator_id: string | null;
  priority: string | null;
  priority_classification: string | null;
  order_type: string | null;
  order_mode: string | null;
  order_date: string | null;
  validation_status: string | null;
  validation_message: string | null;
  validated_at: Date | string | null;
  stack_level: number | string;
  putaway_at: Date | string;
  dwell_minutes: bigint | number | string | null;
};

let tablesPromise: Promise<void> | null = null;
let tablesReady = false;
const IST_OFFSET_MINUTES = 330;

async function createTables() {
  if (tablesReady) return;
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
  tablesReady = true;
}

async function ensureTables() {
  if (tablesReady) return;
  if (!tablesPromise) tablesPromise = withDatabaseConnectionRetry(createTables, 'dispatch');
  const pending = tablesPromise;
  try {
    await pending;
  } finally {
    if (tablesPromise === pending) tablesPromise = null;
  }
}

function utcSqlValue(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function istInputValue(date: Date) {
  return new Date(date.getTime() + IST_OFFSET_MINUTES * 60_000).toISOString().slice(0, 19).replace('T', ' ');
}

function startOfIstDay(date: Date) {
  const ist = new Date(date.getTime() + IST_OFFSET_MINUTES * 60_000);
  return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - IST_OFFSET_MINUTES * 60_000);
}

function dateTimeParameter(value: string | null, fallback: Date) {
  if (!value) {
    return { utc: utcSqlValue(fallback), ist: istInputValue(fallback), epochMs: fallback.getTime() };
  }

  const normalized = value.trim().replace('T', ' ');
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/.exec(normalized);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText = '00'] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const localWallClock = Date.UTC(year, month - 1, day, hour, minute, second);
  const validation = new Date(localWallClock);
  if (
    validation.getUTCFullYear() !== year
    || validation.getUTCMonth() !== month - 1
    || validation.getUTCDate() !== day
    || validation.getUTCHours() !== hour
    || validation.getUTCMinutes() !== minute
    || validation.getUTCSeconds() !== second
  ) return null;

  const instant = new Date(localWallClock - IST_OFFSET_MINUTES * 60_000);
  return {
    utc: utcSqlValue(instant),
    ist: `${yearText}-${monthText}-${dayText} ${hourText}:${minuteText}:${secondText}`,
    epochMs: instant.getTime(),
  };
}

function numberValue(value: bigint | number | string | null | undefined) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function isoValue(value: Date | string | null) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : String(value);
}

export const GET = authMiddleware(async (request: Request) => {
  try {
    await ensureTables();
    startOmtHealthScheduler();
    const url = new URL(request.url);
    const now = new Date();
    const defaultFrom = startOfIstDay(now);
    const from = dateTimeParameter(url.searchParams.get('from'), defaultFrom);
    const to = dateTimeParameter(url.searchParams.get('to'), now);
    if (!from || !to || from.epochMs > to.epochMs) {
      return NextResponse.json({ error: 'Choose a valid date/time range' }, { status: 400 });
    }

    const validationMode = url.searchParams.get('validate');
    const healthRefresh = validationMode === 'due' || validationMode === 'force'
      ? await refreshOmtTrayHealth(request, validationMode === 'force')
      : null;

    const [summaryRows, operatorRows, hourlyRows, dumpRows] = await Promise.all([
      prismaDispatch.$queryRawUnsafe<SummaryRow[]>(
        `SELECT
           SUM(event_type = 'PUTAWAY' AND result = 'SUCCESS') AS putaway_total,
           SUM(event_type = 'MARRY_TRAY' AND result = 'SUCCESS') AS marriage_total,
           SUM(event_type = 'REMOVE_TRAY' AND result = 'SUCCESS') AS removals_total,
           SUM(event_type IN ('PUTAWAY', 'MARRY_TRAY') AND result IN ('REJECTED', 'ERROR')) AS rejected_total,
           COUNT(DISTINCT CASE WHEN result = 'SUCCESS' THEN operator_id END) AS active_operators,
           AVG(CASE WHEN result = 'SUCCESS' AND event_type IN ('PUTAWAY', 'MARRY_TRAY') THEN duration_ms END) AS average_duration_ms
         FROM omt_activity_logs
         WHERE created_at >= ? AND created_at <= ?`,
        from.utc,
        to.utc,
      ),
      prismaDispatch.$queryRawUnsafe<OperatorRow[]>(
        `SELECT COALESCE(NULLIF(operator_id, ''), 'UNASSIGNED') AS operator_id,
           SUM(event_type = 'PUTAWAY' AND result = 'SUCCESS') AS putaway_count,
           SUM(event_type = 'MARRY_TRAY' AND result = 'SUCCESS') AS marriage_count,
           SUM(event_type = 'REMOVE_TRAY' AND result = 'SUCCESS') AS removal_count,
           SUM(event_type IN ('PUTAWAY', 'MARRY_TRAY') AND result IN ('REJECTED', 'ERROR')) AS rejected_count
         FROM omt_activity_logs
         WHERE created_at >= ? AND created_at <= ?
           AND event_type IN ('PUTAWAY', 'MARRY_TRAY', 'REMOVE_TRAY')
         GROUP BY COALESCE(NULLIF(operator_id, ''), 'UNASSIGNED')
         ORDER BY putaway_count DESC, marriage_count DESC, operator_id`,
        from.utc,
        to.utc,
      ),
      prismaDispatch.$queryRawUnsafe<HourRow[]>(
        `SELECT DATE_FORMAT(DATE_ADD(created_at, INTERVAL 330 MINUTE), '%Y-%m-%d %H:00') AS hour_bucket,
           SUM(event_type = 'PUTAWAY' AND result = 'SUCCESS') AS putaway_count,
           SUM(event_type = 'MARRY_TRAY' AND result = 'SUCCESS') AS marriage_count
         FROM omt_activity_logs
         WHERE created_at >= ? AND created_at <= ?
           AND event_type IN ('PUTAWAY', 'MARRY_TRAY')
         GROUP BY DATE_FORMAT(DATE_ADD(created_at, INTERVAL 330 MINUTE), '%Y-%m-%d %H:00')
         ORDER BY hour_bucket`,
        from.utc,
        to.utc,
      ),
      prismaDispatch.$queryRawUnsafe<DumpRow[]>(
        `SELECT CAST(id AS CHAR) AS id, position_barcode, tray_barcode, fitting_id,
           shipment_id, max_qcf_count, operator_id, priority, priority_classification,
           order_type, order_mode, order_date, validation_status, validation_message,
           validated_at, stack_level, putaway_at,
           TIMESTAMPDIFF(MINUTE, putaway_at, NOW()) AS dwell_minutes
         FROM omt_tray_putaway
         ORDER BY position_barcode, stack_level`,
      ),
    ]);

    const summary = summaryRows[0];
    const dump = dumpRows.map((row) => ({
      id: row.id,
      positionBarcode: row.position_barcode,
      trayBarcode: row.tray_barcode,
      fittingId: row.fitting_id == null ? null : String(row.fitting_id),
      shipmentId: row.shipment_id,
      maxQcfCount: numberValue(row.max_qcf_count),
      operatorId: row.operator_id,
      priority: omtPriorityLabel(row.priority, row.order_mode, row.priority_classification),
      priorityClassification: row.priority_classification,
      orderType: row.order_type,
      orderMode: omtOrderModeLabel(row.priority, row.order_mode, row.priority_classification),
      orderAge: row.order_date ? orderAge(row.order_date).label : 'Unknown',
      orderAgeDays: row.order_date ? orderAge(row.order_date).days : null,
      liveStatus: row.validation_status || 'PENDING',
      statusMessage: row.validation_message,
      validatedAt: isoValue(row.validated_at),
      stackLevel: numberValue(row.stack_level),
      putawayAt: isoValue(row.putaway_at),
      dwellMinutes: numberValue(row.dwell_minutes),
    }));
    const occupiedPositions = new Set(dump.map((row) => row.positionBarcode));
    const counts = new Map<string, number>();
    for (const row of dump) counts.set(row.positionBarcode, (counts.get(row.positionBarcode) ?? 0) + 1);

    return NextResponse.json({
      range: { from: from.ist, to: to.ist, timezone: 'Asia/Kolkata', offsetMinutes: IST_OFFSET_MINUTES },
      summary: {
        putawayTotal: numberValue(summary?.putaway_total),
        marriageTotal: numberValue(summary?.marriage_total),
        removalsTotal: numberValue(summary?.removals_total),
        rejectedTotal: numberValue(summary?.rejected_total),
        activeOperators: numberValue(summary?.active_operators),
        averageDurationMs: numberValue(summary?.average_duration_ms),
        traysCurrentlyStored: dump.length,
        occupiedPositions: occupiedPositions.size,
        fullPositions: [...counts.values()].filter((count) => count >= 5).length,
        attentionTrays: dump.filter((row) => row.liveStatus !== 'VALID').length,
        nddTrays: dump.filter((row) => (
          row.priority === '1'
          || row.priority === 'NDD'
          || row.orderMode === 'NDD'
          || row.priorityClassification?.toUpperCase().startsWith('NDD') === true
        )).length,
      },
      operators: operatorRows.map((row) => ({
        operatorId: row.operator_id,
        putawayCount: numberValue(row.putaway_count),
        marriageCount: numberValue(row.marriage_count),
        removalCount: numberValue(row.removal_count),
        rejectedCount: numberValue(row.rejected_count),
      })),
      hourly: hourlyRows.map((row) => ({
        hour: row.hour_bucket,
        putawayCount: numberValue(row.putaway_count),
        marriageCount: numberValue(row.marriage_count),
      })),
      dump,
      healthRefresh,
      generatedAt: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.error('[omt/dashboard] database unavailable', { code: databaseErrorCode(error) });
      return NextResponse.json(
        { error: 'Database temporarily unavailable. Please retry in a few seconds.' },
        { status: 503, headers: { 'Retry-After': '3', 'Cache-Control': 'no-store' } },
      );
    }
    console.error('[omt/dashboard] failed:', error);
    return NextResponse.json({ error: 'Unable to load the OMT dashboard' }, { status: 500 });
  }
});
