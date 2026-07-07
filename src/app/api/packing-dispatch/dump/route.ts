// src/app/api/packing-dispatch/dump/route.ts
//
// Server-side replacement for the extension's slow dump-api endpoint.
// Runs the unassigned-orders query DIRECTLY against NexS_DB (wms) and returns
// the rows already normalised into the shape the matcher expects.
//
//   GET /api/packing-dispatch/dump?facility=NXS1&days=7
//
// Original query (from the extension README):
//   SELECT * FROM wms.store_order_consolidation
//   WHERE shipment_status = 'INVOICED'
//     AND box_status = 'UNASSIGNED'
//     AND facility = '<facility>'
//     AND updated_at >= NOW() - INTERVAL 7 DAY;
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { nexsPool } from '@/utils/nexsPool';

// This route hits a live DB and must never be statically cached / pre-rendered.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Dump column names in wms.store_order_consolidation. NOTE: `order_priroity` is
// misspelled in the source schema and is matched as-is (per the extension config).
const F = {
  storeCode: 'store_code',
  softCourier: 'soft_courier',
  channel: 'channel',
  priority: 'order_priroity',
  createdAt: 'order_created_at',
  updatedAt: 'updated_at',
  shipmentId: 'shipment_id',
  incrementId: 'increment_id',
} as const;

const FACILITY_FALLBACK = 'NXS1';
const DEFAULT_DAYS = 7;
const MAX_DAYS = 90;

type DumpOrder = {
  storeCode: string;
  softCourier: string;
  channel: string;
  priority: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  shipmentId: string;
  incrementId: string;
};

function str(v: unknown): string {
  return v == null ? '' : String(v).trim();
}

function normalize(raw: Record<string, unknown>): DumpOrder {
  const rawPriority = raw[F.priority];
  const priority =
    rawPriority === '' || rawPriority == null ? null : Number(rawPriority);
  return {
    storeCode: str(raw[F.storeCode]),
    softCourier: str(raw[F.softCourier]),
    channel: str(raw[F.channel]),
    priority: Number.isFinite(priority as number) ? (priority as number) : null,
    createdAt: raw[F.createdAt] == null ? null : String(raw[F.createdAt]),
    updatedAt: raw[F.updatedAt] == null ? null : String(raw[F.updatedAt]),
    shipmentId: str(raw[F.shipmentId]),
    incrementId: str(raw[F.incrementId]),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const facility = (searchParams.get('facility') || FACILITY_FALLBACK).trim();

  let days = Number(searchParams.get('days') ?? DEFAULT_DAYS);
  if (!Number.isFinite(days) || days <= 0) days = DEFAULT_DAYS;
  days = Math.min(Math.floor(days), MAX_DAYS);

  const t0 = Date.now();

  try {
    // `facility` is parameterised; `days` is coerced to a bounded integer above
    // and inlined because MySQL won't accept a placeholder for the INTERVAL unit.
    const [rows] = await nexsPool.query<RowDataPacket[]>(
      `
        SELECT *
        FROM wms.store_order_consolidation
        WHERE shipment_status = 'INVOICED'
          AND box_status = 'UNASSIGNED'
          AND facility = ?
          AND updated_at >= NOW() - INTERVAL ${days} DAY
      `,
      [facility]
    );

    const orders = (rows as Record<string, unknown>[])
      .map(normalize)
      .filter((o) => o.storeCode || o.shipmentId);

    return NextResponse.json({
      orders,
      count: orders.length,
      facility,
      days,
      elapsedMs: Date.now() - t0,
    });
  } catch (error) {
    console.error('DB error (GET /packing-dispatch/dump):', error);
    return NextResponse.json(
      {
        error: 'Failed to load the unassigned-orders dump from NexS_DB.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}