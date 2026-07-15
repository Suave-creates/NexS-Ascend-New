import { NextResponse } from 'next/server';
import { cancelDraftProcess } from '@/services/metal-frame/tumbling/process.service';
import { validateOperatorName } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

// POST /api/metal-frame/tumbling/processes/[processId]/cancel -> cancel a DRAFT before it starts
export async function POST(req: Request, { params }: { params: Promise<{ processId: string }> }) {
  try {
    const processId = Number((await params).processId);
    if (!Number.isInteger(processId)) throw new TumblingError(400, 'Invalid process id.');

    const body = await req.json();
    const operatorName = validateOperatorName(body.operatorName);

    const process = await cancelDraftProcess(processId, { name: operatorName });
    return NextResponse.json({ process });
  } catch (err) {
    return handleRouteError('Tumbling process cancel', err);
  }
}
