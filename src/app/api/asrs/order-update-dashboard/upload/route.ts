// src/app/api/asrs/order-update-dashboard/route.ts

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

/* ---------------------------------------
   CONFIG
--------------------------------------- */
const BATCH_SIZE = 1000;

/* ---------------------------------------
   POST: Upload & Ingest CSV
--------------------------------------- */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'CSV file is required' },
        { status: 400 }
      );
    }

    /* ---------------------------------------
       Clear previous snapshot
    --------------------------------------- */
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE order_update_dashboard_study'
    );

    /* ---------------------------------------
       Stream CSV (NO full buffer in memory)
    --------------------------------------- */
    const stream = Readable.from(
      Buffer.from(await file.arrayBuffer()).toString('utf8')
    );

    const parser = stream.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        relax_quotes: true,
        relax_column_count: true,
      })
    );

    let batch: any[] = [];
    let totalInserted = 0;

    for await (const r of parser) {
      batch.push({
        wave: r.wave || null,
        orderId: r.order_id || null,
        orderStatus: r.order_status || null,

        stationId: r.station_id || null,
        fittingId: r.fitting_id || null,
        updatedFittingId: r.updatedFittingId || null,

        orderSyncTime: r.orderSyncTime
          ? new Date(r.orderSyncTime)
          : null,

        orderItemId: r.order_item_id || null,
        sku: r.sku || null,

        unallocatedReason: r.unallocatedReason || null,
        itemType: r.type || null,

        quantity: r.quantity ? Number(r.quantity) : null,
        priority: r.Priority || null,

        orderItemStatus: r['Order Item Status'] || null,
        waveState: r.WaveState || null,
        category: r.category || null,

        trayId: r.tray_id || null,
        jitFlag:
          r.jit_flag === 'true' ||
          r.jit_flag === '1' ||
          r.jit_flag === 1,

        serialNo: r.serial_no || null,
        responseMessage: r.response_message || null,

        pickingCutoffTime: r.pickingCutoffTime
          ? new Date(r.pickingCutoffTime)
          : null,

        orderAllocationTime: r.orderAllocationTime
          ? new Date(r.orderAllocationTime)
          : null,

        itemPickedTimestamp: r.item_picked_timestamp
          ? new Date(r.item_picked_timestamp)
          : null,
      });

      if (batch.length === BATCH_SIZE) {
        await prisma.orderUpdateDashboardStudy.createMany({
          data: batch,
          skipDuplicates: true,
        });

        totalInserted += batch.length;
        batch = [];
      }
    }

    /* ---------------------------------------
       Insert remaining rows
    --------------------------------------- */
    if (batch.length) {
      await prisma.orderUpdateDashboardStudy.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalInserted += batch.length;
    }

    return NextResponse.json({
      message: 'Upload successful',
      rowsInserted: totalInserted,
    });
  } catch (error: any) {
    console.error('Order Update Upload Error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to upload CSV' },
      { status: 500 }
    );
  }
}
