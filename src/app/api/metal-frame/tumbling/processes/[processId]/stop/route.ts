import { NextResponse } from 'next/server';
import { stopProcess } from '@/services/metal-frame/tumbling/process.service';
import { validateOperatorName, validateReason, validateRemarks, STOP_REASONS } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

// POST /api/metal-frame/tumbling/processes/[processId]/stop -> authorized stop
export async function POST(req: Request, { params }: { params: Promise<{ processId: string }> }) {
  try {
    const processId = Number((await params).processId);
    if (!Number.isInteger(processId)) throw new TumblingError(400, 'Invalid process id.');

    const body = await req.json();
    const operatorName = validateOperatorName(body.operatorName);
    const reason = validateReason(body.reason, STOP_REASONS);
    const remarks = validateRemarks(body.remarks);

    if (!body.employeeCode || !body.password) {
      throw new TumblingError(400, 'Authorized user ID and password are required.');
    }

    const process = await stopProcess({
      processId,
      auth: { employeeCode: body.employeeCode, password: body.password },
      reason,
      remarks,
      operator: { name: operatorName },
    });
    return NextResponse.json({ process });
  } catch (err) {
    return handleRouteError('Tumbling process stop', err);
  }
}
