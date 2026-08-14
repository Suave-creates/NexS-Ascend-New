import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import type { AuthenticatedRequest } from '@/middleware/auth';
import { startProcess } from '@/services/metal-frame/tumbling/process.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

// POST /api/metal-frame/tumbling/processes/[processId]/start
export const POST = authMiddleware<{ processId: string }>(async (req: AuthenticatedRequest, { params }: { params: { processId: string } }) => {
  try {
    const processId = Number(params.processId);
    if (!Number.isInteger(processId)) throw new TumblingError(400, 'Invalid process id.');

    const operatorName = req.user.employeeCode;

    const process = await startProcess(processId, { name: operatorName });
    return NextResponse.json({ process });
  } catch (err) {
    return handleRouteError('Tumbling process start', err);
  }
});
