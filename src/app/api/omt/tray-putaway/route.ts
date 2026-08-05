import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { fetchOmtTrayDetails, OmtNexsError, type OmtTrayDetails } from '@/utils/resources/nexs/omt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RACK_COUNT = 40;
const POSITIONS_PER_RACK = 20;
const TRAYS_PER_POSITION = 5;
const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;
const LOOKUP_TOKEN_TTL_MS = 10 * 60 * 1000;

type PutawayRow = {
  position_barcode: string;
  tray_barcode: string;
  stack_level: number;
};

type PutawayLookupToken = {
  trayBarcode: string;
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

function isMissingTable(error: unknown) {
  const value = error as { code?: string; meta?: { code?: string; message?: string }; message?: string };
  return value?.code === 'P2010'
    && (String(value.meta?.code) === '1146'
      || String(value.meta?.message ?? value.message).toLowerCase().includes("doesn't exist"));
}

async function ensureColumn(columnName: string, definition: string) {
  const rows = await prismaDispatch.$queryRawUnsafe<Array<{ found: number }>>(
    `SELECT 1 AS found
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'omt_tray_putaway' AND column_name = ?
     LIMIT 1`,
    columnName,
  );
  if (!rows[0]) {
    await prismaDispatch.$executeRawUnsafe(`ALTER TABLE omt_tray_putaway ADD COLUMN ${definition}`);
  }
}

async function ensureFittingIndex() {
  const rows = await prismaDispatch.$queryRawUnsafe<Array<{ found: number }>>(
    `SELECT 1 AS found
     FROM information_schema.statistics
     WHERE table_schema = DATABASE() AND table_name = 'omt_tray_putaway' AND index_name = 'uq_omt_fitting'
     LIMIT 1`,
  );
  if (!rows[0]) {
    await prismaDispatch.$executeRawUnsafe(
      'ALTER TABLE omt_tray_putaway ADD UNIQUE KEY uq_omt_fitting (fitting_id)',
    );
  }
}

function normalizeOperatorId(raw: unknown) {
  if (typeof raw !== 'string') return '';
  return raw.trim().toUpperCase().slice(0, 64);
}

async function logActivity(entry: ActivityLog) {
  try {
    await prismaDispatch.$executeRawUnsafe(
      `INSERT INTO omt_activity_logs (
         event_type, operator_id, result, tray_barcode, related_tray_barcode,
         fitting_id, shipment_id, position_barcode, stack_level, max_qcf_count,
         order_type, duration_ms, metadata_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      entry.eventType,
      entry.operatorId || null,
      entry.result,
      entry.trayBarcode || null,
      entry.relatedTrayBarcode || null,
      entry.fittingId || null,
      entry.shipmentId || null,
      entry.positionBarcode || null,
      entry.stackLevel ?? null,
      entry.maxQcfCount ?? null,
      entry.orderType || null,
      entry.durationMs ?? null,
      entry.metadata ? JSON.stringify(entry.metadata) : null,
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

function normalizePosition(raw: unknown) {
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toUpperCase().replaceAll('_', '-').replaceAll(' ', '');
  const current = normalized.match(/^NXS1-OMT-(\d{2})-(\d{3})$/);
  if (current) {
    const rack = Number(current[1]);
    const position = Number(current[2]);
    return rack >= 1 && rack <= RACK_COUNT && position >= 1 && position <= POSITIONS_PER_RACK
      ? `NXS1-OMT-${String(rack).padStart(2, '0')}-${String(position).padStart(3, '0')}`
      : null;
  }

  // Compatibility for the previous chronological OMT position barcode.
  const chronological = normalized.match(/^NXS1-OMT-(\d{3,4})$/);
  if (chronological) {
    const sequence = Number(chronological[1]);
    if (sequence < 1 || sequence > RACK_COUNT * POSITIONS_PER_RACK) return null;
    const rack = Math.floor((sequence - 1) / POSITIONS_PER_RACK) + 1;
    const position = ((sequence - 1) % POSITIONS_PER_RACK) + 1;
    return `NXS1-OMT-${String(rack).padStart(2, '0')}-${String(position).padStart(3, '0')}`;
  }

  // Temporary compatibility for a scanner carrying an old printed barcode.
  // New records are always written using the chronological NXS1 format.
  const legacy = normalized.match(/^OMT-R(\d{1,2})-?P(\d{1,2})$/);
  if (!legacy) return null;
  const rack = Number(legacy[1]);
  const position = Number(legacy[2]);
  if (rack < 1 || rack > RACK_COUNT || position < 1 || position > POSITIONS_PER_RACK) return null;
  return `NXS1-OMT-${String(rack).padStart(2, '0')}-${String(position).padStart(3, '0')}`;
}

function tokenSecret() {
  return process.env.OMT_PUTAWAY_SECRET || process.env.JWT_SECRET || 'omt-putaway-local-secret';
}

function signPutawayLookup(details: OmtTrayDetails) {
  const payload = Buffer.from(JSON.stringify({
    trayBarcode: details.scannedTrayId,
    fittingId: details.fittingId,
    shipmentId: details.shipmentId,
    maxQcfCount: details.maxQcfCount,
    orderType: details.rawOrderType,
    issuedAt: Date.now(),
  } satisfies PutawayLookupToken)).toString('base64url');
  const signature = createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyPutawayLookup(token: unknown, trayBarcode: string): PutawayLookupToken | null {
  if (typeof token !== 'string') return null;
  const [payload, suppliedSignature] = token.split('.');
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as PutawayLookupToken;
    return decoded.trayBarcode === trayBarcode
      && Date.now() - decoded.issuedAt <= LOOKUP_TOKEN_TTL_MS
      && decoded.issuedAt <= Date.now()
      ? decoded
      : null;
  } catch {
    return null;
  }
}

async function readPositions() {
  const rows = await prismaDispatch.$queryRawUnsafe<PutawayRow[]>(
    `SELECT position_barcode, tray_barcode, stack_level
     FROM omt_tray_putaway
     ORDER BY position_barcode, stack_level`,
  );
  const positions = new Map<string, string[]>();
  for (const row of rows) {
    const trays = positions.get(row.position_barcode) ?? [];
    trays.push(row.tray_barcode);
    positions.set(row.position_barcode, trays);
  }
  return [...positions].map(([barcode, trays]) => ({ barcode, trays }));
}

export async function GET() {
  try {
    await ensureTable();
    return NextResponse.json({ positions: await readPositions() });
  } catch (error) {
    console.error('omt/tray-putaway GET error:', error);
    return NextResponse.json({ error: 'Unable to load tray putaway' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let operatorId = '';
  let trayBarcode = '';
  try {
    await ensureTable();
    const body = await request.json();
    operatorId = normalizeOperatorId(body?.operatorId);
    trayBarcode = typeof body?.trayBarcode === 'string' ? body.trayBarcode.trim().toUpperCase() : '';

    if (body?.action === 'LOG_REJECTION') {
      const eventType = body?.eventType === 'REMOVE_TRAY' ? 'REMOVE_TRAY' : 'PUTAWAY';
      await logActivity({
        eventType,
        operatorId,
        result: 'REJECTED',
        trayBarcode: typeof body?.scanValue === 'string' ? body.scanValue.trim().toUpperCase().slice(0, 100) : null,
        durationMs: Date.now() - startedAt,
        metadata: { reason: String(body?.reason || 'Client validation rejected scan').slice(0, 500) },
      });
      return NextResponse.json({ success: true });
    }

    if (!operatorId) {
      await logActivity({ eventType: 'PUTAWAY', result: 'REJECTED', trayBarcode, metadata: { reason: 'OPERATOR_REQUIRED' } });
      return NextResponse.json({ error: 'Operator ID is required', code: 'OPERATOR_REQUIRED' }, { status: 400 });
    }
    if (!TRAY_ID_PATTERN.test(trayBarcode)) {
      await logActivity({
        eventType: 'PUTAWAY', operatorId, result: 'REJECTED', trayBarcode,
        durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_TRAY_FORMAT' },
      });
      return NextResponse.json({
        error: 'Invalid tray ID; use 2 letters followed by 5 digits (example: CT00003)',
        code: 'INVALID_TRAY_FORMAT',
      }, { status: 400 });
    }

    const alreadyStored = await prismaDispatch.$queryRawUnsafe<Array<{
      position_barcode: string;
      fitting_id: bigint | number | null;
      shipment_id: string | null;
      max_qcf_count: number;
    }>>(
      `SELECT position_barcode, fitting_id, shipment_id, max_qcf_count
       FROM omt_tray_putaway WHERE tray_barcode = ? LIMIT 1`,
      trayBarcode,
    );
    if (alreadyStored[0]) {
      await logActivity({
        eventType: 'PUTAWAY', operatorId, result: 'REJECTED', trayBarcode,
        fittingId: alreadyStored[0].fitting_id == null ? null : String(alreadyStored[0].fitting_id),
        shipmentId: alreadyStored[0].shipment_id,
        positionBarcode: alreadyStored[0].position_barcode,
        maxQcfCount: Number(alreadyStored[0].max_qcf_count ?? 0),
        durationMs: Date.now() - startedAt,
        metadata: { reason: 'DUPLICATE_TRAY' },
      });
      return NextResponse.json({
        error: 'Tray already stored',
        code: 'DUPLICATE_TRAY',
        positionBarcode: alreadyStored[0].position_barcode,
      }, { status: 409 });
    }

    const action = String(body?.action ?? 'PUTAWAY').toUpperCase();
    if (action === 'LOOKUP_TRAY') {
      const details = await fetchOmtTrayDetails(request, trayBarcode);
      if (details.trayRole !== 'PARENT') {
        const message = details.trayRole === 'CHILD'
          ? `${trayBarcode} is a child tray. Put away parent tray ${details.parentTrayId} instead.`
          : `${trayBarcode} is not the current parent tray for this fitting.`;
        await logActivity({
          eventType: 'PUTAWAY_LOOKUP', operatorId, result: 'REJECTED', trayBarcode,
          relatedTrayBarcode: details.parentTrayId,
          fittingId: details.fittingId, shipmentId: details.shipmentId,
          maxQcfCount: details.maxQcfCount, orderType: details.rawOrderType,
          durationMs: Date.now() - startedAt,
          metadata: { reason: details.trayRole === 'CHILD' ? 'CHILD_TRAY' : 'TRAY_ROLE_UNKNOWN' },
        });
        return NextResponse.json({
          error: message,
          code: details.trayRole === 'CHILD' ? 'CHILD_TRAY' : 'TRAY_ROLE_UNKNOWN',
          data: details,
        }, { status: 409 });
      }

      const existingFitting = await prismaDispatch.$queryRawUnsafe<Array<{
        tray_barcode: string;
        position_barcode: string;
      }>>(
        `SELECT tray_barcode, position_barcode
         FROM omt_tray_putaway WHERE fitting_id = ? LIMIT 1`,
        details.fittingId,
      );
      if (existingFitting[0]) {
        await logActivity({
          eventType: 'PUTAWAY_LOOKUP', operatorId, result: 'REJECTED', trayBarcode,
          relatedTrayBarcode: existingFitting[0].tray_barcode,
          fittingId: details.fittingId, shipmentId: details.shipmentId,
          positionBarcode: existingFitting[0].position_barcode,
          maxQcfCount: details.maxQcfCount, orderType: details.rawOrderType,
          durationMs: Date.now() - startedAt,
          metadata: { reason: 'FITTING_ALREADY_STORED' },
        });
        return NextResponse.json({
          error: `Fitting ${details.fittingId} is already stored with tray ${existingFitting[0].tray_barcode}`,
          code: 'FITTING_ALREADY_STORED',
          positionBarcode: existingFitting[0].position_barcode,
        }, { status: 409 });
      }

      await logActivity({
        eventType: 'PUTAWAY_LOOKUP', operatorId, result: 'PARENT_VERIFIED', trayBarcode,
        relatedTrayBarcode: details.childTrayId === trayBarcode ? null : details.childTrayId,
        fittingId: details.fittingId, shipmentId: details.shipmentId,
        maxQcfCount: details.maxQcfCount, orderType: details.rawOrderType,
        durationMs: Date.now() - startedAt,
        metadata: { relatedTrayIds: details.relatedTrayIds },
      });
      return NextResponse.json({ data: details, lookupToken: signPutawayLookup(details) });
    }

    if (action !== 'PUTAWAY') {
      return NextResponse.json({ error: 'Invalid putaway action', code: 'INVALID_ACTION' }, { status: 400 });
    }

    const positionBarcode = normalizePosition(body?.positionBarcode);
    if (!positionBarcode) {
      await logActivity({
        eventType: 'PUTAWAY', operatorId, result: 'REJECTED', trayBarcode,
        durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_POSITION' },
      });
      return NextResponse.json({ error: 'Invalid position barcode', code: 'INVALID_POSITION' }, { status: 400 });
    }

    const metadata = verifyPutawayLookup(body?.lookupToken, trayBarcode);
    if (!metadata) {
      await logActivity({
        eventType: 'PUTAWAY', operatorId, result: 'REJECTED', trayBarcode, positionBarcode,
        durationMs: Date.now() - startedAt, metadata: { reason: 'LOOKUP_REQUIRED' },
      });
      return NextResponse.json({
        error: 'Tray verification expired; scan the tray again before scanning its location',
        code: 'LOOKUP_REQUIRED',
      }, { status: 409 });
    }

    const result = await prismaDispatch.$transaction(async (tx) => {
      const lockName = `omt:${positionBarcode}`;
      const lockRows = await tx.$queryRawUnsafe<Array<{ acquired: number }>>(
        'SELECT GET_LOCK(?, 5) AS acquired',
        lockName,
      );
      if (Number(lockRows[0]?.acquired) !== 1) {
        return { error: 'Position is busy; scan again', code: 'POSITION_BUSY', status: 409 } as const;
      }

      try {
        const duplicate = await tx.$queryRawUnsafe<Array<{ position_barcode: string }>>(
          'SELECT position_barcode FROM omt_tray_putaway WHERE tray_barcode = ? LIMIT 1',
          trayBarcode,
        );
        if (duplicate[0]) {
          return {
            error: 'Tray already stored', code: 'DUPLICATE_TRAY', status: 409,
            positionBarcode: duplicate[0].position_barcode,
          } as const;
        }

        const duplicateFitting = await tx.$queryRawUnsafe<Array<{
          tray_barcode: string;
          position_barcode: string;
        }>>(
          'SELECT tray_barcode, position_barcode FROM omt_tray_putaway WHERE fitting_id = ? LIMIT 1',
          metadata.fittingId,
        );
        if (duplicateFitting[0]) {
          return {
            error: `Fitting ${metadata.fittingId} is already stored`,
            code: 'FITTING_ALREADY_STORED',
            status: 409,
            positionBarcode: duplicateFitting[0].position_barcode,
          } as const;
        }

        const countRows = await tx.$queryRawUnsafe<Array<{ tray_count: bigint | number }>>(
          'SELECT COUNT(*) AS tray_count FROM omt_tray_putaway WHERE position_barcode = ?',
          positionBarcode,
        );
        const stackLevel = Number(countRows[0]?.tray_count ?? 0) + 1;
        if (stackLevel > TRAYS_PER_POSITION) {
          return { error: 'Position already has 5 trays', code: 'POSITION_FULL', status: 409 } as const;
        }

        await tx.$executeRawUnsafe(
          `INSERT INTO omt_tray_putaway (
             position_barcode, tray_barcode, fitting_id, shipment_id,
             max_qcf_count, operator_id, stack_level
           ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          positionBarcode,
          trayBarcode,
          metadata.fittingId,
          metadata.shipmentId,
          metadata.maxQcfCount,
          operatorId,
          stackLevel,
        );
        return {
          success: true, positionBarcode, trayBarcode, stackLevel,
          fittingId: metadata.fittingId,
          shipmentId: metadata.shipmentId,
          maxQcfCount: metadata.maxQcfCount,
        } as const;
      } finally {
        await tx.$queryRawUnsafe('SELECT RELEASE_LOCK(?)', lockName);
      }
    });

    if ('error' in result) {
      await logActivity({
        eventType: 'PUTAWAY', operatorId, result: 'REJECTED', trayBarcode,
        fittingId: metadata.fittingId, shipmentId: metadata.shipmentId,
        positionBarcode: result.positionBarcode || positionBarcode,
        maxQcfCount: metadata.maxQcfCount, orderType: metadata.orderType,
        durationMs: Date.now() - startedAt,
        metadata: { reason: result.code, message: result.error },
      });
      return NextResponse.json(result, { status: result.status });
    }
    await logActivity({
      eventType: 'PUTAWAY', operatorId, result: 'SUCCESS', trayBarcode,
      fittingId: metadata.fittingId, shipmentId: metadata.shipmentId,
      positionBarcode, stackLevel: result.stackLevel,
      maxQcfCount: metadata.maxQcfCount, orderType: metadata.orderType,
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('omt/tray-putaway POST error:', error);
    await logActivity({
      eventType: 'PUTAWAY', operatorId, result: 'ERROR', trayBarcode,
      durationMs: Date.now() - startedAt,
      metadata: { message: (error as Error).message },
    });
    const status = error instanceof OmtNexsError ? error.status : 500;
    const code = error instanceof OmtNexsError ? error.code : 'PUTAWAY_FAILED';
    return NextResponse.json({ error: (error as Error).message || 'Unable to store tray', code }, { status });
  }
}

export async function DELETE(request: Request) {
  const startedAt = Date.now();
  let operatorId = '';
  let trayBarcode = '';
  try {
    await ensureTable();
    const body = await request.json();
    operatorId = normalizeOperatorId(body?.operatorId);

    if (!operatorId) {
      await logActivity({
        eventType: body?.action === 'MASTER_RESET' ? 'MASTER_RESET' : 'REMOVE_TRAY',
        result: 'REJECTED', metadata: { reason: 'OPERATOR_REQUIRED' },
      });
      return NextResponse.json({ error: 'Operator ID is required', code: 'OPERATOR_REQUIRED' }, { status: 400 });
    }

    if (body?.action === 'MASTER_RESET') {
      const resetPassword = process.env.OMT_MASTER_RESET_PASSWORD ?? '0000';
      if (String(body?.password ?? '') !== resetPassword) {
        await logActivity({
          eventType: 'MASTER_RESET', operatorId, result: 'REJECTED',
          durationMs: Date.now() - startedAt, metadata: { reason: 'WRONG_PASSWORD' },
        });
        return NextResponse.json({ error: 'Wrong Master Reset password' }, { status: 403 });
      }
      const deleted = await prismaDispatch.$executeRawUnsafe('DELETE FROM omt_tray_putaway');
      await logActivity({
        eventType: 'MASTER_RESET', operatorId, result: 'SUCCESS',
        durationMs: Date.now() - startedAt, metadata: { deleted: Number(deleted) },
      });
      return NextResponse.json({ success: true, deleted: Number(deleted) });
    }

    if (body?.action !== 'REMOVE_TRAY') {
      await logActivity({
        eventType: 'REMOVE_TRAY', operatorId, result: 'REJECTED',
        durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_ACTION' },
      });
      return NextResponse.json({ error: 'Invalid delete action' }, { status: 400 });
    }

    trayBarcode = typeof body?.trayBarcode === 'string' ? body.trayBarcode.trim().toUpperCase() : '';
    if (!TRAY_ID_PATTERN.test(trayBarcode)) {
      await logActivity({
        eventType: 'REMOVE_TRAY', operatorId, result: 'REJECTED', trayBarcode,
        durationMs: Date.now() - startedAt, metadata: { reason: 'INVALID_TRAY_FORMAT' },
      });
      return NextResponse.json({
        error: 'Invalid tray ID; use 2 letters followed by 5 digits (example: CT00003)',
        code: 'INVALID_TRAY_FORMAT',
      }, { status: 400 });
    }

    const stored = await prismaDispatch.$queryRawUnsafe<Array<{
      position_barcode: string;
      stack_level: number;
      fitting_id: bigint | number | null;
      shipment_id: string | null;
      max_qcf_count: number;
    }>>(
      `SELECT position_barcode, stack_level, fitting_id, shipment_id, max_qcf_count
       FROM omt_tray_putaway WHERE tray_barcode = ? LIMIT 1`,
      trayBarcode,
    );
    if (!stored[0]) {
      await logActivity({
        eventType: 'REMOVE_TRAY', operatorId, result: 'REJECTED', trayBarcode,
        durationMs: Date.now() - startedAt, metadata: { reason: 'TRAY_NOT_STORED' },
      });
      return NextResponse.json({ error: 'Tray is not stored in any OMT position' }, { status: 404 });
    }

    const positionBarcode = stored[0].position_barcode;
    const result = await prismaDispatch.$transaction(async (tx) => {
      const lockName = `omt:${positionBarcode}`;
      const lockRows = await tx.$queryRawUnsafe<Array<{ acquired: number }>>(
        'SELECT GET_LOCK(?, 5) AS acquired',
        lockName,
      );
      if (Number(lockRows[0]?.acquired) !== 1) {
        return { error: 'Position is busy; scan again', status: 409 } as const;
      }

      try {
        const current = await tx.$queryRawUnsafe<Array<{ stack_level: number }>>(
          `SELECT stack_level FROM omt_tray_putaway
           WHERE tray_barcode = ? AND position_barcode = ? LIMIT 1`,
          trayBarcode,
          positionBarcode,
        );
        if (!current[0]) return { error: 'Tray is no longer stored in this position', status: 404 } as const;

        const removedLevel = Number(current[0].stack_level);
        await tx.$executeRawUnsafe('DELETE FROM omt_tray_putaway WHERE tray_barcode = ?', trayBarcode);
        await tx.$executeRawUnsafe(
          `UPDATE omt_tray_putaway
           SET stack_level = stack_level - 1
           WHERE position_barcode = ? AND stack_level > ?
           ORDER BY stack_level ASC`,
          positionBarcode,
          removedLevel,
        );
        const remainingRows = await tx.$queryRawUnsafe<Array<{ tray_count: bigint | number }>>(
          'SELECT COUNT(*) AS tray_count FROM omt_tray_putaway WHERE position_barcode = ?',
          positionBarcode,
        );
        return {
          success: true,
          trayBarcode,
          positionBarcode,
          remaining: Number(remainingRows[0]?.tray_count ?? 0),
        } as const;
      } finally {
        await tx.$queryRawUnsafe('SELECT RELEASE_LOCK(?)', lockName);
      }
    });

    if ('error' in result) {
      await logActivity({
        eventType: 'REMOVE_TRAY', operatorId, result: 'REJECTED', trayBarcode,
        fittingId: stored[0].fitting_id == null ? null : String(stored[0].fitting_id),
        shipmentId: stored[0].shipment_id, positionBarcode,
        stackLevel: Number(stored[0].stack_level), maxQcfCount: Number(stored[0].max_qcf_count ?? 0),
        durationMs: Date.now() - startedAt, metadata: { reason: result.error },
      });
      return NextResponse.json(result, { status: result.status });
    }
    await logActivity({
      eventType: 'REMOVE_TRAY', operatorId, result: 'SUCCESS', trayBarcode,
      fittingId: stored[0].fitting_id == null ? null : String(stored[0].fitting_id),
      shipmentId: stored[0].shipment_id, positionBarcode,
      stackLevel: Number(stored[0].stack_level), maxQcfCount: Number(stored[0].max_qcf_count ?? 0),
      durationMs: Date.now() - startedAt, metadata: { remaining: result.remaining },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('omt/tray-putaway DELETE error:', error);
    await logActivity({
      eventType: 'REMOVE_TRAY', operatorId, result: 'ERROR', trayBarcode,
      durationMs: Date.now() - startedAt, metadata: { message: (error as Error).message },
    });
    return NextResponse.json({ error: 'Unable to update tray putaway' }, { status: 500 });
  }
}
