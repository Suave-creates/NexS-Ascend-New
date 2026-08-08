import { prismaDispatch } from '@/utils/prismaDispatch';
import { fetchOmtTrayDetails, OmtNexsError } from '@/utils/resources/nexs/omt';

export const OMT_HEALTH_INTERVAL_MS = 60 * 60 * 1000;

export type OmtTrayHealthStatus = 'VALID' | 'INVALID' | 'ERROR' | 'PENDING';

type StoredTray = {
  tray_barcode: string;
  fitting_id: bigint | number | null;
  shipment_id: string | null;
};

export type OmtHealthRefreshResult = {
  checked: number;
  valid: number;
  invalid: number;
  errors: number;
  checkedAt: string;
};

let schemaReady = false;
let schemaPromise: Promise<void> | null = null;
let refreshPromise: Promise<OmtHealthRefreshResult> | null = null;

async function ensureColumn(columnName: string, definition: string) {
  const rows = await prismaDispatch.$queryRawUnsafe<Array<{ found: number }>>(
    `SELECT 1 AS found
     FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'omt_tray_putaway'
       AND column_name = ?
     LIMIT 1`,
    columnName,
  );
  if (!rows[0]) {
    await prismaDispatch.$executeRawUnsafe(`ALTER TABLE omt_tray_putaway ADD COLUMN ${definition}`);
  }
}

async function prepareHealthSchema() {
  if (schemaReady) return;
  await ensureColumn('priority', 'priority VARCHAR(40) NULL AFTER operator_id');
  await ensureColumn('priority_classification', 'priority_classification VARCHAR(100) NULL AFTER priority');
  await ensureColumn('order_type', 'order_type VARCHAR(100) NULL AFTER priority_classification');
  await ensureColumn('order_mode', 'order_mode VARCHAR(16) NULL AFTER order_type');
  await ensureColumn('order_date', 'order_date VARCHAR(64) NULL AFTER order_mode');
  await ensureColumn(
    'validation_status',
    "validation_status VARCHAR(16) NOT NULL DEFAULT 'PENDING' AFTER order_date",
  );
  await ensureColumn('validation_message', 'validation_message VARCHAR(500) NULL AFTER validation_status');
  await ensureColumn('validated_at', 'validated_at DATETIME(3) NULL AFTER validation_message');
  schemaReady = true;
}

export async function ensureOmtHealthSchema() {
  if (!schemaPromise) schemaPromise = prepareHealthSchema();
  const pending = schemaPromise;
  try {
    await pending;
  } finally {
    if (schemaPromise === pending) schemaPromise = null;
  }
}

function validationFailure(
  tray: StoredTray,
  details: Awaited<ReturnType<typeof fetchOmtTrayDetails>>,
) {
  if (details.trayRole !== 'PARENT') {
    return `Tray is no longer the parent; current parent is ${details.parentTrayId}`;
  }
  if (tray.fitting_id != null && String(tray.fitting_id) !== details.fittingId) {
    return `Fitting changed from ${String(tray.fitting_id)} to ${details.fittingId}`;
  }
  if (tray.shipment_id && tray.shipment_id !== details.shipmentId) {
    return `Shipment changed from ${tray.shipment_id} to ${details.shipmentId}`;
  }
  return null;
}

async function checkTray(request: Request, tray: StoredTray) {
  try {
    const details = await fetchOmtTrayDetails(request, tray.tray_barcode);
    const failure = validationFailure(tray, details);
    const status: OmtTrayHealthStatus = failure ? 'INVALID' : 'VALID';
    await prismaDispatch.$executeRawUnsafe(
      `UPDATE omt_tray_putaway
       SET validation_status = ?, validation_message = ?, validated_at = NOW(3),
           priority = ?, priority_classification = ?, order_type = ?, order_mode = ?, order_date = ?
       WHERE tray_barcode = ?`,
      status,
      failure,
      details.priority,
      details.priorityClassification,
      details.rawOrderType,
      details.orderMode,
      details.orderDate,
      tray.tray_barcode,
    );
    return status;
  } catch (error) {
    const status: OmtTrayHealthStatus = error instanceof OmtNexsError
      && !['NEXS_UNAVAILABLE', 'NEXS_LOOKUP_FAILED'].includes(error.code)
      ? 'INVALID'
      : 'ERROR';
    const message = error instanceof Error ? error.message.slice(0, 500) : 'Tray validation failed';
    await prismaDispatch.$executeRawUnsafe(
      `UPDATE omt_tray_putaway
       SET validation_status = ?, validation_message = ?, validated_at = NOW(3)
       WHERE tray_barcode = ?`,
      status,
      message,
      tray.tray_barcode,
    );
    return status;
  }
}

async function performRefresh(request: Request, force: boolean): Promise<OmtHealthRefreshResult> {
  await ensureOmtHealthSchema();
  const rows = await prismaDispatch.$queryRawUnsafe<StoredTray[]>(
    `SELECT tray_barcode, fitting_id, shipment_id
     FROM omt_tray_putaway
     ${force ? '' : "WHERE validated_at IS NULL OR validated_at <= DATE_SUB(NOW(3), INTERVAL 1 HOUR)"}
     ORDER BY validated_at IS NULL DESC, validated_at ASC`,
  );

  const statuses: OmtTrayHealthStatus[] = [];
  const queue = [...rows];
  const workerCount = Math.min(6, queue.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (queue.length) {
      const tray = queue.shift();
      if (tray) statuses.push(await checkTray(request, tray));
    }
  }));

  return {
    checked: statuses.length,
    valid: statuses.filter((status) => status === 'VALID').length,
    invalid: statuses.filter((status) => status === 'INVALID').length,
    errors: statuses.filter((status) => status === 'ERROR').length,
    checkedAt: new Date().toISOString(),
  };
}

export async function refreshOmtTrayHealth(request: Request, force = false) {
  if (!refreshPromise) refreshPromise = performRefresh(request, force);
  const pending = refreshPromise;
  try {
    return await pending;
  } finally {
    if (refreshPromise === pending) refreshPromise = null;
  }
}

export async function refreshOmtPositionHealth(request: Request, positionBarcode: string) {
  await ensureOmtHealthSchema();
  const rows = await prismaDispatch.$queryRawUnsafe<StoredTray[]>(
    `SELECT tray_barcode, fitting_id, shipment_id
     FROM omt_tray_putaway
     WHERE position_barcode = ?
     ORDER BY stack_level`,
    positionBarcode,
  );
  const statuses = await Promise.all(rows.map((tray) => checkTray(request, tray)));
  return {
    checked: statuses.length,
    valid: statuses.filter((status) => status === 'VALID').length,
    invalid: statuses.filter((status) => status === 'INVALID').length,
    errors: statuses.filter((status) => status === 'ERROR').length,
    checkedAt: new Date().toISOString(),
  } satisfies OmtHealthRefreshResult;
}

type SchedulerGlobal = typeof globalThis & {
  __omtHealthScheduler?: ReturnType<typeof setInterval>;
};

export function startOmtHealthScheduler() {
  const schedulerGlobal = globalThis as SchedulerGlobal;
  if (schedulerGlobal.__omtHealthScheduler) return;
  const timer = setInterval(() => {
    const scheduledRequest = new Request('http://localhost/api/omt/tray-putaway?validate=due');
    void refreshOmtTrayHealth(scheduledRequest).catch((error) => {
      console.error('[OMT tray health] scheduled validation failed:', error);
    });
  }, OMT_HEALTH_INTERVAL_MS);
  timer.unref?.();
  schedulerGlobal.__omtHealthScheduler = timer;
}
