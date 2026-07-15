import { NextResponse } from 'next/server';
import { getProcessDetail, withProgress } from '@/services/metal-frame/tumbling/process.service';
import { getTumblingConfig } from '@/services/metal-frame/tumbling/config.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/processes/[processId] -> full detail incl. products + immutable event timeline
export async function GET(_req: Request, { params }: { params: Promise<{ processId: string }> }) {
  try {
    const processId = Number((await params).processId);
    if (!Number.isInteger(processId)) throw new TumblingError(400, 'Invalid process id.');

    const process = await getProcessDetail(processId);
    const config = await getTumblingConfig();
    const now = new Date();

    return NextResponse.json({
      serverTime: now.toISOString(),
      process: withProgress(process, now, config.nearCompletionThresholdMinutes),
    });
  } catch (err) {
    return handleRouteError('Tumbling process detail', err);
  }
}
