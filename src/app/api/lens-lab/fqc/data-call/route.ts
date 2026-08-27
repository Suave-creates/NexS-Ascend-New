import { NextResponse } from 'next/server';

import {
  fetchLensLabFqcSource,
  normalizeLensLabFittingId,
} from '@/lib/server/lensLabFqcBigQuery';
import { authMiddleware } from '@/middleware/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function frameIndex(orderCode: string): number {
  const match = orderCode.trim().match(/^\d+(?:-(\d+))?$/);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
}

async function handlePost(request: Request) {
  try {
    const body = await request.json();
    const fittingId = normalizeLensLabFittingId(body?.fitting_id);
    if (!fittingId) {
      return NextResponse.json({ error: 'Invalid fitting_id' }, { status: 400 });
    }

    const source = await fetchLensLabFqcSource(fittingId, request.signal);
    if (!source) {
      return NextResponse.json(
        { error: 'No order found for this fitting_id' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      source: 'bigquery',
      data: {
        fitting_id: source.fittingId,
        order_id: source.wmsOrderCode,
        frame_index: frameIndex(source.wmsOrderCode),
        power: source.power,
      },
    });
  } catch (error) {
    console.error('[lens-lab/fqc/data-call] BigQuery lookup failed:', error);
    return NextResponse.json(
      { error: 'Unable to load the FQC prescription from BigQuery.' },
      { status: 502 },
    );
  }
}

export const POST = authMiddleware<{}>(async (request) => handlePost(request));
