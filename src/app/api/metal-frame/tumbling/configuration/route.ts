import { NextResponse } from 'next/server';
import { getTumblingConfig, updateTumblingConfig, TumblingConfigValues } from '@/services/metal-frame/tumbling/config.service';
import { verifyAuthorization } from '@/services/metal-frame/tumbling/authorization.service';
import { validateDurationMinutes } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/configuration
export async function GET() {
  try {
    const config = await getTumblingConfig();
    return NextResponse.json({ config });
  } catch (err) {
    return handleRouteError('Tumbling configuration get', err);
  }
}

// PATCH /api/metal-frame/tumbling/configuration -> authorized users only
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    await verifyAuthorization({ employeeCode: body.employeeCode, password: body.password });

    const patch: Partial<TumblingConfigValues> = {};
    if (body.defaultDurationMinutes !== undefined) {
      patch.defaultDurationMinutes = validateDurationMinutes(body.defaultDurationMinutes);
    }
    if (body.nearCompletionThresholdMinutes !== undefined) {
      patch.nearCompletionThresholdMinutes = validateDurationMinutes(body.nearCompletionThresholdMinutes);
    }
    if (body.additionalFieldLabel !== undefined) {
      const label = String(body.additionalFieldLabel).trim();
      if (!label) throw new TumblingError(400, 'Additional field label cannot be empty.');
      patch.additionalFieldLabel = label.slice(0, 100);
    }

    const config = await updateTumblingConfig(patch);
    return NextResponse.json({ config });
  } catch (err) {
    return handleRouteError('Tumbling configuration update', err);
  }
}
