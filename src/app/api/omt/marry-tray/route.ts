import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;
const TOKEN_TTL_MS = 10 * 60 * 1000;
const TRACE_CACHE_MS = 30_000;
const RACK_COUNT = 40;
const POSITIONS_PER_RACK = 20;

type StorageRow = {
  position_barcode: string;
  tray_barcode: string;
  stack_level: number;
};

type LookupToken = {
  childTrayId: string;
  parentTrayId: string;
  fittingId: string;
  shipmentId: string;
  maxQcfCount: number;
  orderType: string;
  issuedAt: number;
};

type ActivityLog = {
  eventType: string;
  operatorId?: string | null;
  result: string;
  trayBarcode?: string | null;
  relatedTrayBarcode?: string | null;
  fittingId?: string | null;
  shipmentId?: string | null;
  positionBarcode?: string | null;
  stackLevel?: number | null;
  maxQcfCount?: number | null;
  orderType?: string | null;
  durationMs?: number | null;
  metadata?: Record<string, unknown> | null;
};

let tableReady = false;
const traceCache = new Map<string, {
  expiresAt: number;
  result: Awaited<ReturnType<typeof runBigQuery>>;
}>();

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

function normalizeOperatorId(raw: unknown) {
  return typeof raw === 'string' ? raw.trim().toUpperCase().slice(0, 64) : '';
}

async function logActivity(entry: ActivityLog) {
  try {
    await prismaDispatch.$executeRawUnsafe(
      `INSERT INTO omt_activity_logs (
         event_type, operator_id, result, tray_barcode, related_tray_barcode,
         fitting_id, shipment_id, position_barcode, stack_level, max_qcf_count,
         order_type, duration_ms, metadata_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      entry.eventType, entry.operatorId || null, entry.result,
      entry.trayBarcode || null, entry.relatedTrayBarcode || null,
      entry.fittingId || null, entry.shipmentId || null, entry.positionBarcode || null,
      entry.stackLevel ?? null, entry.maxQcfCount ?? null, entry.orderType || null,
      entry.durationMs ?? null, entry.metadata ? JSON.stringify(entry.metadata) : null,
    );
  } catch (error) {
    console.error('[OMT activity log] write failed:', error);
  }
}

async function ensureTable() {
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
      'NXS1-OMT-',
      LPAD(CAST(SUBSTRING(position_barcode, 6, 2) AS UNSIGNED), 2, '0'),
      '-',
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

function decodePositionBarcode(positionBarcode: string) {
  const current = positionBarcode.match(/^NXS1-OMT-(\d{2})-(\d{3})$/);
  if (current) {
    const rackNumber = Number(current[1]);
    const positionNumber = Number(current[2]);
    if (rackNumber >= 1 && rackNumber <= RACK_COUNT && positionNumber >= 1 && positionNumber <= POSITIONS_PER_RACK) {
      return {
        barcode: `NXS1-OMT-${String(rackNumber).padStart(2, '0')}-${String(positionNumber).padStart(3, '0')}`,
        rackNumber,
        positionNumber,
      };
    }
  }

  const chronological = positionBarcode.match(/^NXS1-OMT-(\d{3,4})$/);
  if (chronological) {
    const sequence = Number(chronological[1]);
    if (sequence >= 1 && sequence <= RACK_COUNT * POSITIONS_PER_RACK) {
      const rackNumber = Math.floor((sequence - 1) / POSITIONS_PER_RACK) + 1;
      const positionNumber = ((sequence - 1) % POSITIONS_PER_RACK) + 1;
      return {
        barcode: `NXS1-OMT-${String(rackNumber).padStart(2, '0')}-${String(positionNumber).padStart(3, '0')}`,
        rackNumber,
        positionNumber,
      };
    }
  }

  const legacy = positionBarcode.match(/^OMT-R(\d{2})-P(\d{2})$/);
  if (!legacy) return null;
  const rackNumber = Number(legacy[1]);
  const positionNumber = Number(legacy[2]);
  if (rackNumber < 1 || rackNumber > RACK_COUNT || positionNumber < 1 || positionNumber > POSITIONS_PER_RACK) return null;
  return {
    barcode: `NXS1-OMT-${String(rackNumber).padStart(2, '0')}-${String(positionNumber).padStart(3, '0')}`,
    rackNumber,
    positionNumber,
  };
}

function normalizeTrayId(value: unknown) {
  const trayId = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return TRAY_ID_PATTERN.test(trayId) ? trayId : null;
}

function tokenSecret() {
  return process.env.OMT_MARRY_SECRET || process.env.JWT_SECRET || 'omt-marry-local-secret';
}

function signLookup(
  childTrayId: string,
  parentTrayId: string,
  fittingId: string,
  shipmentId: string,
  maxQcfCount: number,
  orderType: string,
) {
  const payload = Buffer.from(JSON.stringify({
    childTrayId, parentTrayId, fittingId, shipmentId, maxQcfCount, orderType, issuedAt: Date.now(),
  })).toString('base64url');
  const signature = createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyLookup(token: unknown, childTrayId: string, parentTrayId: string): LookupToken | null {
  if (typeof token !== 'string') return null;
  const [payload, suppliedSignature] = token.split('.');
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as LookupToken;
    return decoded.childTrayId === childTrayId
      && decoded.parentTrayId === parentTrayId
      && Date.now() - decoded.issuedAt <= TOKEN_TTL_MS
      && decoded.issuedAt <= Date.now()
      ? decoded
      : null;
  } catch {
    return null;
  }
}

async function traceChild(childTrayId: string) {
  const cached = traceCache.get(childTrayId);
  if (cached && cached.expiresAt > Date.now()) return cached.result;

  const result = await runBigQuery(
    `WITH scanned AS (
       SELECT
         CAST(oi.location_id AS STRING) AS child_tray_id,
         CAST(oi.fitting_id AS STRING) AS fitting_id,
         CAST(oi.shipping_package_id AS STRING) AS shipping_package_id,
         COALESCE(CAST(oih.order_item_type AS STRING), '') AS order_item_type
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\` oi
       LEFT JOIN \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_item_header\` oih
         ON oih.shipping_package_id = oi.shipping_package_id
       WHERE CAST(oi.location_id AS STRING) = @child_tray_id
       QUALIFY ROW_NUMBER() OVER (ORDER BY oi.id DESC) = 1
     ),
     parent_tray AS (
       SELECT CAST(oi.location_id AS STRING) AS parent_tray_id
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\` oi
       JOIN scanned s ON CAST(oi.fitting_id AS STRING) = s.fitting_id
       QUALIFY ROW_NUMBER() OVER (
         PARTITION BY s.fitting_id
         ORDER BY oi.qc_fail_count ASC, oi.created_at ASC
       ) = 1
     ),
     fitting_shipments AS (
       SELECT DISTINCT CAST(oi.shipping_package_id AS STRING) AS shipment_id
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\` oi
       JOIN scanned s ON CAST(oi.fitting_id AS STRING) = s.fitting_id
       WHERE oi.shipping_package_id IS NOT NULL
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
     qcf AS (
       SELECT COALESCE(MAX(qcf_count), 0) AS qcf_count
       FROM qcf_by_shipment
     )
     SELECT
       s.child_tray_id,
       s.fitting_id,
       s.shipping_package_id,
       s.order_item_type,
       p.parent_tray_id,
       q.qcf_count
     FROM scanned s
     CROSS JOIN parent_tray p
     CROSS JOIN qcf q`,
    1,
    { child_tray_id: childTrayId },
  );
  traceCache.set(childTrayId, { result, expiresAt: Date.now() + TRACE_CACHE_MS });
  return result;
}

async function lookupChild(childTrayId: string) {
  const startedAt = Date.now();

  // Rack state is loaded while BigQuery resolves the relationship. This keeps
  // the critical scan path to one remote query plus one parallel local query.
  const [trace, storageRows] = await Promise.all([
    traceChild(childTrayId),
    prismaDispatch.$queryRawUnsafe<StorageRow[]>(
      `SELECT position_barcode, tray_barcode, stack_level
       FROM omt_tray_putaway
       ORDER BY position_barcode, stack_level`,
    ),
  ]);

  if (!trace.rows.length) {
    return { error: 'Child tray not found in WMS', code: 'CHILD_NOT_FOUND', status: 404 } as const;
  }

  const row = trace.rows[0];
  const parentTrayId = String(row.parent_tray_id ?? '').toUpperCase();
  if (!parentTrayId || parentTrayId === childTrayId) {
    return { error: `${childTrayId} is not a child tray`, code: 'NOT_CHILD_TRAY', status: 409 } as const;
  }

  const parentStorage = storageRows.find((item) => item.tray_barcode === parentTrayId);
  const stack = parentStorage
    ? storageRows
        .filter((item) => item.position_barcode === parentStorage.position_barcode)
        .map((item) => ({ trayId: item.tray_barcode, stackLevel: Number(item.stack_level) }))
    : [];
  const position = parentStorage ? decodePositionBarcode(parentStorage.position_barcode) : null;
  const rawOrderType = String(row.order_item_type ?? '').trim();

  return {
    data: {
      childTrayId,
      parentTrayId,
      fittingId: String(row.fitting_id ?? ''),
      shipmentId: String(row.shipping_package_id ?? ''),
      orderMode: rawOrderType.toUpperCase().includes('JIT') ? 'JIT' : 'REGULAR',
      rawOrderType: rawOrderType || 'N/A',
      qcfCount: Number(row.qcf_count ?? 0),
      available: Boolean(parentStorage),
      positionBarcode: position?.barcode ?? parentStorage?.position_barcode ?? null,
      rackNumber: position?.rackNumber ?? null,
      positionNumber: position?.positionNumber ?? null,
      parentStackLevel: parentStorage ? Number(parentStorage.stack_level) : null,
      stack,
      lookupToken: parentStorage ? signLookup(
        childTrayId,
        parentTrayId,
        String(row.fitting_id ?? ''),
        String(row.shipping_package_id ?? ''),
        Number(row.qcf_count ?? 0),
        rawOrderType || 'N/A',
      ) : null,
      lookupMs: Date.now() - startedAt,
    },
  } as const;
}

async function marryTray(childTrayId: string, parentTrayId: string, lookupToken: unknown) {
  const verifiedLookup = verifyLookup(lookupToken, childTrayId, parentTrayId);
  if (!verifiedLookup) {
    return { error: 'Lookup expired; scan the child tray again', code: 'LOOKUP_EXPIRED', status: 409 } as const;
  }

  const stored = await prismaDispatch.$queryRawUnsafe<Array<{ position_barcode: string }>>(
    'SELECT position_barcode FROM omt_tray_putaway WHERE tray_barcode = ? LIMIT 1',
    parentTrayId,
  );
  if (!stored[0]) {
    return { error: 'Parent tray is no longer in the rack', code: 'PARENT_NOT_STORED', status: 404 } as const;
  }

  const positionBarcode = stored[0].position_barcode;
  return prismaDispatch.$transaction(async (tx) => {
    const lockName = `omt:${positionBarcode}`;
    const locks = await tx.$queryRawUnsafe<Array<{ acquired: number }>>('SELECT GET_LOCK(?, 5) AS acquired', lockName);
    if (Number(locks[0]?.acquired) !== 1) {
      return { error: 'Position is busy; scan again', code: 'POSITION_BUSY', status: 409 } as const;
    }

    try {
      const parent = await tx.$queryRawUnsafe<Array<{ stack_level: number }>>(
        `SELECT stack_level FROM omt_tray_putaway
         WHERE tray_barcode = ? AND position_barcode = ? LIMIT 1`,
        parentTrayId,
        positionBarcode,
      );
      if (!parent[0]) {
        return { error: 'Parent tray is no longer in the suggested position', code: 'PARENT_MOVED', status: 409 } as const;
      }

      const removedLevel = Number(parent[0].stack_level);
      await tx.$executeRawUnsafe('DELETE FROM omt_tray_putaway WHERE tray_barcode = ?', parentTrayId);
      await tx.$executeRawUnsafe(
        `UPDATE omt_tray_putaway
         SET stack_level = stack_level - 1
         WHERE position_barcode = ? AND stack_level > ?
         ORDER BY stack_level ASC`,
        positionBarcode,
        removedLevel,
      );
      const remaining = await tx.$queryRawUnsafe<Array<{ tray_barcode: string; stack_level: number }>>(
        `SELECT tray_barcode, stack_level FROM omt_tray_putaway
         WHERE position_barcode = ? ORDER BY stack_level`,
        positionBarcode,
      );

      return {
        success: true,
        childTrayId,
        parentTrayId,
        positionBarcode,
        removedStackLevel: removedLevel,
        fittingId: verifiedLookup.fittingId,
        shipmentId: verifiedLookup.shipmentId,
        maxQcfCount: verifiedLookup.maxQcfCount,
        orderType: verifiedLookup.orderType,
        remainingTrays: remaining.map((item) => ({ trayId: item.tray_barcode, stackLevel: Number(item.stack_level) })),
      } as const;
    } finally {
      await tx.$queryRawUnsafe('SELECT RELEASE_LOCK(?)', lockName);
    }
  });
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let operatorId = '';
  let scannedChild = '';
  try {
    await ensureTable();
    const body = await request.json();
    const action = String(body?.action ?? 'LOOKUP').toUpperCase();
    operatorId = normalizeOperatorId(body?.operatorId);
    scannedChild = typeof body?.childTrayId === 'string' ? body.childTrayId.trim().toUpperCase() : '';

    if (action === 'LOG_REJECTION') {
      await logActivity({
        eventType: 'MARRY_LOOKUP', operatorId, result: 'REJECTED', trayBarcode: scannedChild,
        durationMs: Date.now() - startedAt,
        metadata: { reason: String(body?.reason || 'Client validation rejected scan').slice(0, 500) },
      });
      return NextResponse.json({ success: true });
    }

    if (!operatorId) {
      await logActivity({
        eventType: action === 'MARRY' ? 'MARRY_TRAY' : 'MARRY_LOOKUP',
        result: 'REJECTED', trayBarcode: scannedChild, metadata: { reason: 'OPERATOR_REQUIRED' },
      });
      return NextResponse.json({ error: 'Operator ID is required', code: 'OPERATOR_REQUIRED' }, { status: 400 });
    }

    const childTrayId = normalizeTrayId(body?.childTrayId);
    if (!childTrayId) {
      await logActivity({
        eventType: action === 'MARRY' ? 'MARRY_TRAY' : 'MARRY_LOOKUP',
        operatorId, result: 'REJECTED', trayBarcode: scannedChild,
        durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_CHILD_ID' },
      });
      return NextResponse.json({
        error: 'Invalid child tray ID; use 2 letters followed by 5 digits (example: CT00003)',
        code: 'INVALID_CHILD_ID',
      }, { status: 400 });
    }

    if (action === 'LOOKUP') {
      const result = await lookupChild(childTrayId);
      if ('error' in result) {
        await logActivity({
          eventType: 'MARRY_LOOKUP', operatorId, result: 'REJECTED', trayBarcode: childTrayId,
          durationMs: Date.now() - startedAt, metadata: { reason: result.code, message: result.error },
        });
        return NextResponse.json(result, { status: result.status });
      }
      await logActivity({
        eventType: 'MARRY_LOOKUP', operatorId,
        result: result.data.available ? 'FOUND_IN_OMT' : 'NOT_IN_OMT',
        trayBarcode: childTrayId, relatedTrayBarcode: result.data.parentTrayId,
        fittingId: result.data.fittingId, shipmentId: result.data.shipmentId,
        positionBarcode: result.data.positionBarcode,
        stackLevel: result.data.parentStackLevel, maxQcfCount: result.data.qcfCount,
        orderType: result.data.rawOrderType, durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(result);
    }

    if (action === 'MARRY') {
      const parentTrayId = normalizeTrayId(body?.parentTrayId);
      if (!parentTrayId) {
        await logActivity({
          eventType: 'MARRY_TRAY', operatorId, result: 'REJECTED', trayBarcode: childTrayId,
          durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_PARENT_ID' },
        });
        return NextResponse.json({ error: 'Invalid parent tray ID', code: 'INVALID_PARENT_ID' }, { status: 400 });
      }
      const result = await marryTray(childTrayId, parentTrayId, body?.lookupToken);
      if ('error' in result) {
        await logActivity({
          eventType: 'MARRY_TRAY', operatorId, result: 'REJECTED',
          trayBarcode: childTrayId, relatedTrayBarcode: parentTrayId,
          durationMs: Date.now() - startedAt, metadata: { reason: result.code, message: result.error },
        });
        return NextResponse.json(result, { status: result.status });
      }
      await logActivity({
        eventType: 'MARRY_TRAY', operatorId, result: 'SUCCESS',
        trayBarcode: childTrayId, relatedTrayBarcode: parentTrayId,
        fittingId: result.fittingId, shipmentId: result.shipmentId,
        positionBarcode: result.positionBarcode, stackLevel: result.removedStackLevel,
        maxQcfCount: result.maxQcfCount, orderType: result.orderType,
        durationMs: Date.now() - startedAt,
        metadata: { remainingTrays: result.remainingTrays },
      });
      return NextResponse.json(result);
    }

    await logActivity({
      eventType: 'MARRY_LOOKUP', operatorId, result: 'REJECTED', trayBarcode: childTrayId,
      durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_ACTION', action },
    });
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('omt/marry-tray error:', error);
    await logActivity({
      eventType: 'MARRY_LOOKUP', operatorId, result: 'ERROR', trayBarcode: scannedChild,
      durationMs: Date.now() - startedAt, metadata: { message: (error as Error).message },
    });
    return NextResponse.json({ error: 'Unable to process tray marriage' }, { status: 500 });
  }
}
