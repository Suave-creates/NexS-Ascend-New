import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/mydb';
import { getNexsToken, invalidateNexsToken } from '@/utils/resources/nexs/auth';
import prisma from '@/utils/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NEXS_HISTORY_URL = 'https://app.nexs.lenskart.com/nexs/api/ims/getHistory';
const TOTE_PATTERN = /^TL\d{10}$/;
const PARTITIONS = [1, 2, 3, 4] as const;
const COMPACTION_BATCH_SIZE = 500;

type Bucket = 'GOOD' | 'BAD' | 'SYNC_ISSUE' | 'LOST';
type Mode = 'SCAN' | 'PLACEMENT';
type NexsRecord = {
  pid?: string | number | null;
  barcode?: string | null;
  status?: string | null;
  condition?: string | null;
  availability?: string | null;
  location?: string | null;
  operation?: string | null;
  actionId?: string | number | null;
  updatedAt?: string | null;
};

type LatestScan = {
  id: bigint;
  pid: string;
  barcode: string;
  status: string | null;
  condition: string | null;
  availability: string | null;
  nexsLocation: string | null;
  currentLocation: string;
  toteId: string | null;
  toteNumber: number | null;
  partition: number | null;
  bucket: string;
  scannedAt: Date;
};

function jsonError(error: string, status: number, code?: string) {
  return NextResponse.json({ error, code }, { status });
}

function text(value: unknown) {
  return value == null ? '' : String(value).trim();
}

function classify(condition: string, status: string): { bucket: Bucket; binName: string | null } {
  const c = condition.toUpperCase();
  const s = status.toUpperCase();
  if (c === 'BAD') return { bucket: 'BAD', binName: 'BAD BIN' };
  if (s === 'DISPATCHED') return { bucket: 'BAD', binName: 'DISPATCHED BIN' };
  if (s === 'RELEASED' || s === 'QC_HOLD') return { bucket: 'BAD', binName: 'RELEASED BIN' };
  if (['MANIFEST_CREATED', 'PACKAGING', 'INVOICED', 'IN_GATE_PASS'].includes(s)) {
    return { bucket: 'BAD', binName: 'DISPATCHED BIN' };
  }
  if (['LIQUIDATED', 'DISCARDED', 'RETURNED', 'SUSPENDED'].includes(s)) {
    return { bucket: 'BAD', binName: 'BAD BIN' };
  }
  if (['PUTAWAY_PENDING', 'GRN_DONE', 'UNICOM_PIPELINE'].includes(s)) {
    return { bucket: 'SYNC_ISSUE', binName: 'SYNC ISSUE BIN' };
  }
  if (['IN_TRAY', 'PICKED', 'PENDING_CUSTOMIZATION', 'CUSTOMIZATION_COMPLETE', 'EDGING', 'ORDER_QC'].includes(s)) {
    return { bucket: 'LOST', binName: 'LOST BIN' };
  }
  return { bucket: 'GOOD', binName: null };
}

function locationString(toteId: string, toteNumber: number, partition: number) {
  return `${toteId}|${toteNumber}-${partition}`;
}

function passwordMatches(candidate: unknown) {
  const expected = process.env.PID_HUNTER_COMPACTION_PASSWORD || 'Lens@kart';
  const actual = text(candidate);
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function fetchCurrent(req: Request, barcode: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'date-time': new Date().toISOString().slice(0, 19).replace('T', ' '),
    'facility-code': process.env.NEXS_FACILITY || 'NXS1',
    'workstation-id': process.env.NEXS_WORKSTATION || '',
    'source-domain': 'https://app.nexs.lenskart.com',
  };
  for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
    const value = req.headers.get(name);
    if (value) headers[name] = value;
  }

  const browserCookie = req.headers.get('cookie');
  const usingBrowserCookie = !!browserCookie?.includes('jwt-token');
  const imsApp = process.env.NEXS_IMS_APP_ID?.trim() || null;
  const callNexs = (cookie: string | null) => fetch(NEXS_HISTORY_URL, {
    method: 'POST',
    headers: cookie ? { ...headers, Cookie: cookie } : headers,
    body: JSON.stringify({
      type: 'barcode',
      pageRequest: { sortKey: 'updatedAt', sortOrder: 'DESC' },
      barcode,
    }),
    cache: 'no-store',
  });

  let response = await callNexs(usingBrowserCookie ? browserCookie : null);
  if (response.status === 401 && !usingBrowserCookie && imsApp) {
    const token = await getNexsToken(imsApp);
    if (token) response = await callNexs(`jwt-token=${token}`);
    if (response.status === 401) {
      invalidateNexsToken(imsApp);
      const freshToken = await getNexsToken(imsApp, true);
      if (freshToken) response = await callNexs(`jwt-token=${freshToken}`);
    }
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`NexS returned HTTP ${response.status}`);
  const current = payload?.data?.currentStatusSearchResultResponse as NexsRecord | undefined;
  if (!current) return null;
  const history = Array.isArray(payload?.data?.historySearchResultResponse)
    ? payload.data.historySearchResultResponse
    : [];
  return { current, totalOperations: history.length };
}

async function latestGoodScans(
  tx: Prisma.TransactionClient | typeof prisma = prisma,
  toteNumber?: number,
): Promise<LatestScan[]> {
  return tx.$queryRaw<LatestScan[]>(Prisma.sql`
    SELECT id, pid, barcode, status, \`condition\`, availability,
      nexs_location AS nexsLocation, current_location AS currentLocation,
      tote_id AS toteId, tote_number AS toteNumber, \`partition\`, bucket,
      scanned_at AS scannedAt
    FROM (
      SELECT s.*, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
      FROM pid_hunter_scans s
    ) latest
    WHERE row_num = 1 AND bucket = 'GOOD'
      ${toteNumber == null ? Prisma.empty : Prisma.sql`AND tote_number = ${toteNumber}`}
  `);
}

async function resolveTote(toteId: string) {
  if (!TOTE_PATTERN.test(toteId)) throw new Error('Tote ID must match TL followed by 10 digits');
  return prisma.$transaction(async (tx) => {
    const existing = await tx.pidHunterTote.findUnique({ where: { toteId } });
    if (existing) return existing;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60_000);
    await tx.pidHunterToteReservation.deleteMany({ where: { expiresAt: { lte: now } } });
    const existingReservation = await tx.pidHunterToteReservation.findUnique({ where: { toteId } });
    if (existingReservation) {
      return tx.pidHunterToteReservation.update({
        where: { toteId },
        data: { expiresAt },
      });
    }

    // Empty totes do not remain in the active registry. Their historical ID is
    // retained on scan rows, while the lowest missing number is immediately
    // available to a previously unseen physical tote.
    const occupiedRows = await tx.$queryRaw<Array<{ toteNumber: number }>>(Prisma.sql`
      SELECT DISTINCT tote_number AS toteNumber
      FROM (
        SELECT tote_number, bucket,
          ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
        FROM pid_hunter_scans
      ) latest
      WHERE row_num = 1 AND bucket = 'GOOD' AND tote_number IS NOT NULL
    `);
    const occupiedNumbers = occupiedRows.map((row) => row.toteNumber);
    await tx.pidHunterTote.deleteMany({
      where: occupiedNumbers.length ? { toteNumber: { notIn: occupiedNumbers } } : {},
    });

    const [activeTotes, reservations] = await Promise.all([
      tx.pidHunterTote.findMany({ select: { toteNumber: true } }),
      tx.pidHunterToteReservation.findMany({ select: { toteNumber: true } }),
    ]);
    const unavailableNumbers = [...activeTotes, ...reservations]
      .map((row) => row.toteNumber)
      .sort((a, b) => a - b);
    let toteNumber = 1;
    for (const unavailable of unavailableNumbers) {
      if (unavailable === toteNumber) toteNumber += 1;
      else if (unavailable > toteNumber) break;
    }
    return tx.pidHunterToteReservation.create({
      data: { toteId, toteNumber, expiresAt },
    });
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 30_000,
    timeout: 30_000,
  });
}

async function placementForPid(pid: string) {
  const suggestions = await prisma.$queryRaw<Array<{
    toteId: string; toteNumber: number; partition: number; currentLocation: string; itemCount: bigint;
  }>>(Prisma.sql`
    SELECT tote_id AS toteId, tote_number AS toteNumber, \`partition\`,
      current_location AS currentLocation, COUNT(*) AS itemCount
    FROM (
      SELECT s.*, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
      FROM pid_hunter_scans s
    ) latest
    WHERE row_num = 1 AND bucket = 'GOOD' AND pid = ${pid}
      AND tote_id IS NOT NULL AND tote_number IS NOT NULL AND \`partition\` IS NOT NULL
    GROUP BY tote_id, tote_number, \`partition\`, current_location
    ORDER BY itemCount DESC, current_location ASC
    LIMIT 1
  `);
  if (suggestions[0]) return suggestions[0];

  const occupiedRows = await prisma.$queryRaw<Array<{ toteNumber: number; partition: number }>>(Prisma.sql`
    SELECT DISTINCT tote_number AS toteNumber, \`partition\`
    FROM (
      SELECT s.*, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
      FROM pid_hunter_scans s
    ) latest
    WHERE row_num = 1 AND bucket = 'GOOD'
      AND tote_number IS NOT NULL AND \`partition\` IS NOT NULL
  `);
  const occupied = new Set(occupiedRows.map((row) => `${row.toteNumber}-${row.partition}`));
  const totes = await prisma.pidHunterTote.findMany({ where: { isFree: false }, orderBy: { toteNumber: 'asc' } });
  for (const tote of totes) {
    for (const partition of PARTITIONS) {
      if (!occupied.has(`${tote.toteNumber}-${partition}`)) {
        return {
          toteId: tote.toteId,
          toteNumber: tote.toteNumber,
          partition,
          currentLocation: locationString(tote.toteId, tote.toteNumber, partition),
        };
      }
    }
  }
  return null;
}

function serializeScan(row: {
  pid: string; barcode: string; status: string | null; condition: string | null;
  availability: string | null; nexsLocation: string | null; currentLocation: string;
  toteId: string | null; toteNumber: number | null; partition: number | null;
  bucket: string; binName: string | null; mode: string; scannedAt: Date;
}) {
  return {
    pid: row.pid,
    barcode: row.barcode,
    status: row.status || '',
    condition: row.condition || '',
    availability: row.availability || '',
    nexs_location: row.nexsLocation,
    current_location: row.currentLocation,
    tote_id: row.toteId,
    tote_number: row.toteNumber,
    partition: row.partition,
    bucket: row.bucket,
    bin_name: row.binName,
    mode: row.mode,
    scanned_at: row.scannedAt,
  };
}

async function handleScan(req: Request, body: Record<string, unknown>) {
  const rawScan = text(body.barcode);
  if (!rawScan) return jsonError('Barcode required', 400);
  const barcode = rawScan.slice(-12);
  const mode: Mode = text(body.mode).toUpperCase() === 'PLACEMENT' ? 'PLACEMENT' : 'SCAN';

  let result: Awaited<ReturnType<typeof fetchCurrent>>;
  try {
    result = await fetchCurrent(req, barcode);
  } catch (error) {
    return jsonError(`NexS network error: ${(error as Error).message}`, 502);
  }
  if (!result) return jsonError('Barcode not found', 404);

  const current = result.current;
  const resolvedBarcode = text(current.barcode || barcode);
  const pid = text(current.pid);
  if (!pid) return jsonError('NexS response did not include a PID', 502);
  const status = text(current.status);
  const condition = text(current.condition);
  const availability = text(current.availability);
  const classification = classify(condition, status);

  let toteId: string | null = null;
  let toteNumber: number | null = null;
  let partition: number | null = null;
  let currentLocation = classification.binName || '';

  if (classification.bucket === 'GOOD') {
    if (mode === 'PLACEMENT') {
      const placement = await placementForPid(pid);
      if (!placement) return jsonError('No tote partition is available', 409, 'NO_PLACEMENT_AVAILABLE');
      toteId = placement.toteId;
      toteNumber = placement.toteNumber;
      partition = placement.partition;
      currentLocation = placement.currentLocation;
    } else {
      toteId = text(body.toteId);
      toteNumber = Number(body.toteNumber);
      partition = Number(body.partition);
      if (!TOTE_PATTERN.test(toteId) || !Number.isInteger(toteNumber) || !PARTITIONS.includes(partition as 1 | 2 | 3 | 4)) {
        return jsonError('Lock a valid tote and partition before scanning GOOD inventory', 400);
      }
      const [activeTote, reservation] = await Promise.all([
        prisma.pidHunterTote.findUnique({ where: { toteNumber } }),
        prisma.pidHunterToteReservation.findUnique({ where: { toteId } }),
      ]);
      const activeMatches = activeTote?.toteId === toteId && !activeTote.isFree;
      const reservationMatches = reservation?.toteNumber === toteNumber && reservation.expiresAt > new Date();
      if (!activeMatches && !reservationMatches) return jsonError('Tote reservation expired; lock it again', 409);
      currentLocation = locationString(toteId, toteNumber, partition);
    }
  }

  const duplicate = mode === 'PLACEMENT'
    ? await prisma.pidHunterScan.findFirst({ where: { barcode: resolvedBarcode }, select: { currentLocation: true } })
    : await prisma.pidHunterScan.findFirst({ where: { barcode: resolvedBarcode, currentLocation }, select: { currentLocation: true } });
  if (duplicate) return jsonError(`Duplicate: barcode already scanned${mode === 'PLACEMENT' ? '' : ' at this location'}`, 409);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const raceDuplicate = mode === 'PLACEMENT'
        ? await tx.pidHunterScan.findFirst({ where: { barcode: resolvedBarcode } })
        : await tx.pidHunterScan.findFirst({ where: { barcode: resolvedBarcode, currentLocation } });
      if (raceDuplicate) throw new Error('DUPLICATE');

      if (mode === 'SCAN' && classification.bucket === 'GOOD' && toteId && toteNumber) {
        const activeTote = await tx.pidHunterTote.findUnique({ where: { toteNumber } });
        if (activeTote && activeTote.toteId !== toteId) throw new Error('TOTE_RESERVATION_EXPIRED');
        if (!activeTote) {
          const reservation = await tx.pidHunterToteReservation.findUnique({ where: { toteId } });
          if (!reservation || reservation.toteNumber !== toteNumber || reservation.expiresAt <= new Date()) {
            throw new Error('TOTE_RESERVATION_EXPIRED');
          }
          await tx.pidHunterTote.create({ data: { toteId, toteNumber } });
          await tx.pidHunterToteReservation.delete({ where: { toteId } });
        }
      }

      const scan = await tx.pidHunterScan.create({
        data: {
          pid,
          barcode: resolvedBarcode,
          status,
          condition,
          availability,
          nexsLocation: text(current.location) || null,
          currentLocation,
          toteId,
          toteNumber,
          partition,
          bucket: classification.bucket,
          binName: classification.binName,
          mode,
          operation: text(current.operation) || null,
          actionId: text(current.actionId) || null,
          updatedAtNexs: text(current.updatedAt) || null,
          totalOperations: result.totalOperations,
          rawScan,
        },
      });
      const legacy = await tx.scannedBarcodeInventory.findFirst({ where: { barcode: resolvedBarcode, scanLocation: currentLocation } });
      if (!legacy) {
        await tx.scannedBarcodeInventory.create({
          data: {
            pid,
            barcode: resolvedBarcode,
            status,
            condition,
            availability,
            scanLocation: currentLocation,
            nexsLocation: text(current.location) || null,
            toteId,
            toteSimplified: toteNumber && partition ? `${toteNumber}-${partition}` : null,
            toteNumber,
            partition,
          },
        });
      }
      return scan;
    });
    return NextResponse.json({ item: serializeScan(created) });
  } catch (error) {
    if ((error as Error).message === 'DUPLICATE') return jsonError('Duplicate barcode', 409);
    if ((error as Error).message === 'TOTE_RESERVATION_EXPIRED') return jsonError('Tote reservation expired; lock it again', 409);
    throw error;
  }
}

async function overview() {
  const [occupancy, totes] = await Promise.all([
    prisma.$queryRaw<Array<{ toteNumber: number; partition: number; itemCount: bigint }>>(Prisma.sql`
      SELECT tote_number AS toteNumber, \`partition\`, COUNT(*) AS itemCount
      FROM (
        SELECT s.*, ROW_NUMBER() OVER (PARTITION BY barcode ORDER BY scanned_at DESC, id DESC) AS row_num
        FROM pid_hunter_scans s
      ) latest
      WHERE row_num = 1 AND bucket = 'GOOD'
        AND tote_number IS NOT NULL AND \`partition\` IS NOT NULL
      GROUP BY tote_number, \`partition\`
    `),
    prisma.pidHunterTote.findMany({ where: { isFree: false }, orderBy: { toteNumber: 'asc' } }),
  ]);
  const counts = new Map<string, number>();
  for (const row of occupancy) {
    counts.set(`${row.toteNumber}-${row.partition}`, Number(row.itemCount));
  }
  return totes.map((tote) => {
    const partitions = PARTITIONS.map((p) => counts.get(`${tote.toteNumber}-${p}`) || 0);
    return { toteNumber: tote.toteNumber, toteId: tote.toteId, partitions, total: partitions.reduce((a, b) => a + b, 0) };
  });
}

async function moveCompactedInventory(
  tx: Prisma.TransactionClient,
  sourceItems: LatestScan[],
  destination: {
    location: string;
    toteId: string;
    toteNumber: number;
    partition: number;
  },
) {
  const toteSimplified = `${destination.toteNumber}-${destination.partition}`;

  for (let offset = 0; offset < sourceItems.length; offset += COMPACTION_BATCH_SIZE) {
    const batch = sourceItems.slice(offset, offset + COMPACTION_BATCH_SIZE);
    const barcodes = batch.map((row) => row.barcode);
    const values = batch.map((row) => Prisma.sql`(
      ${row.pid}, ${row.barcode}, ${row.status}, ${row.condition}, ${row.availability},
      ${destination.location}, ${row.nexsLocation}, ${destination.toteId},
      ${toteSimplified}, ${destination.toteNumber}, ${destination.partition}, NOW()
    )`);

    // scanned_barcode_inventory is the active inventory table. Upsert every
    // moved barcode at the destination, then remove every stale location for
    // those barcodes. The surrounding transaction keeps this in lockstep with
    // the append-only PID Hunter compaction history.
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO scanned_barcode_inventory
        (pid, barcode, status, \`condition\`, availability, scan_location,
         nexs_location, tote, tote_simplified, tote_number, \`partition\`, scanned_at)
      VALUES ${Prisma.join(values)}
      ON DUPLICATE KEY UPDATE
        pid = VALUES(pid),
        status = VALUES(status),
        \`condition\` = VALUES(\`condition\`),
        availability = VALUES(availability),
        nexs_location = VALUES(nexs_location),
        tote = VALUES(tote),
        tote_simplified = VALUES(tote_simplified),
        tote_number = VALUES(tote_number),
        \`partition\` = VALUES(\`partition\`),
        scanned_at = VALUES(scanned_at)
    `);

    await tx.scannedBarcodeInventory.deleteMany({
      where: {
        barcode: { in: barcodes },
        scanLocation: { not: destination.location },
      },
    });

    const [destinationCount, staleCount] = await Promise.all([
      tx.scannedBarcodeInventory.count({
        where: { barcode: { in: barcodes }, scanLocation: destination.location },
      }),
      tx.scannedBarcodeInventory.count({
        where: {
          barcode: { in: barcodes },
          scanLocation: { not: destination.location },
        },
      }),
    ]);
    if (destinationCount !== batch.length || staleCount !== 0) {
      throw new Error('INVENTORY_MOVE_MISMATCH');
    }
  }

  return sourceItems.length;
}

async function compact(body: Record<string, unknown>) {
  const sourceToteNumber = Number(body.sourceToteNumber);
  const sourcePartition = Number(body.sourcePartition);
  const destinationToteNumber = Number(body.destinationToteNumber);
  const destinationPartition = Number(body.destinationPartition);
  if (![sourceToteNumber, destinationToteNumber].every(Number.isInteger) ||
      !PARTITIONS.includes(sourcePartition as 1 | 2 | 3 | 4) ||
      !PARTITIONS.includes(destinationPartition as 1 | 2 | 3 | 4)) {
    return jsonError('Enter valid tote numbers and partitions 1-4', 400);
  }
  if (sourceToteNumber === destinationToteNumber && sourcePartition === destinationPartition) {
    return jsonError('Source and destination must be different', 400);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const [sourceTote, destinationTote, latest] = await Promise.all([
        tx.pidHunterTote.findUnique({ where: { toteNumber: sourceToteNumber } }),
        tx.pidHunterTote.findUnique({ where: { toteNumber: destinationToteNumber } }),
        latestGoodScans(tx, sourceToteNumber),
      ]);
      if (!sourceTote || sourceTote.isFree) throw new Error('SOURCE_NOT_FOUND');
      if (!destinationTote || destinationTote.isFree) throw new Error('DESTINATION_NOT_FOUND');
      const sourceItems = latest.filter((row) => row.toteNumber === sourceToteNumber && row.partition === sourcePartition);
      if (!sourceItems.length) throw new Error('SOURCE_EMPTY');
      const destination = locationString(destinationTote.toteId, destinationToteNumber, destinationPartition);
      await tx.pidHunterScan.createMany({
        data: sourceItems.map((row) => ({
          pid: row.pid,
          barcode: row.barcode,
          status: row.status,
          condition: row.condition,
          availability: row.availability,
          nexsLocation: row.nexsLocation,
          currentLocation: destination,
          toteId: destinationTote.toteId,
          toteNumber: destinationToteNumber,
          partition: destinationPartition,
          bucket: 'GOOD',
          mode: 'COMPACTION',
          compacted: true,
          compactedFrom: row.currentLocation,
        })),
      });
      const inventoryMoved = await moveCompactedInventory(tx, sourceItems, {
        location: destination,
        toteId: destinationTote.toteId,
        toteNumber: destinationToteNumber,
        partition: destinationPartition,
      });
      const sourceHasOtherItems = latest.some((row) => row.partition !== sourcePartition);
      if (!sourceHasOtherItems) {
        await tx.pidHunterTote.delete({ where: { toteNumber: sourceToteNumber } });
      }
      return { moved: sourceItems.length, inventoryMoved };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 30_000, timeout: 30_000 });
    return NextResponse.json(result);
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'SOURCE_NOT_FOUND') return jsonError('Source tote is not active', 404);
    if (message === 'DESTINATION_NOT_FOUND') return jsonError('Destination tote is not active', 404);
    if (message === 'SOURCE_EMPTY') return jsonError('Source partition is empty', 409);
    if (message === 'INVENTORY_MOVE_MISMATCH') {
      return jsonError('Inventory database move could not be verified; no changes were committed', 500);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }
  const action = text(body.action).toLowerCase();

  try {
    if (action === 'resolve-tote') {
      const tote = await resolveTote(text(body.toteId).toUpperCase());
      return NextResponse.json({ tote: { toteId: tote.toteId, toteNumber: tote.toteNumber } });
    }
    if (action === 'scan') return handleScan(req, body);
    if (action === 'recent') {
      const mode = text(body.mode).toUpperCase();
      const rows = await prisma.pidHunterScan.findMany({
        where: mode ? { mode } : undefined,
        orderBy: [{ scannedAt: 'desc' }, { id: 'desc' }],
        take: 200,
      });
      return NextResponse.json({ items: rows.map(serializeScan) });
    }
    if (['unlock', 'overview', 'compact'].includes(action)) {
      if (!passwordMatches(body.password)) return jsonError('Incorrect compaction password', 401);
      if (action === 'unlock') return NextResponse.json({ ok: true });
      if (action === 'overview') return NextResponse.json({ totes: await overview() });
      return compact(body);
    }
    return jsonError('Unknown action', 400);
  } catch (error) {
    console.error('[pid-hunter] action failed:', action, error);
    return jsonError('PID Hunter operation failed', 500);
  }
}
