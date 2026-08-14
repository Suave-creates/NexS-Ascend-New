import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getContainerDetail, updateContainer } from '@/services/metal-frame/tumbling/container.service';
import { verifyAuthorization } from '@/services/metal-frame/tumbling/authorization.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/containers/[containerId]
export const GET = authMiddleware<{ containerId: string }>(async (_req: Request, { params }: { params: { containerId: string } }) => {
  try {
    const containerId = Number(params.containerId);
    if (!Number.isInteger(containerId)) throw new TumblingError(400, 'Invalid container id.');
    const detail = await getContainerDetail(containerId);
    return NextResponse.json(detail);
  } catch (err) {
    return handleRouteError('Tumbling container detail', err);
  }
});

// PATCH /api/metal-frame/tumbling/containers/[containerId] -> authorized: rename / activate / deactivate a container
export const PATCH = authMiddleware<{ containerId: string }>(async (req: Request, { params }: { params: { containerId: string } }) => {
  try {
    const containerId = Number(params.containerId);
    if (!Number.isInteger(containerId)) throw new TumblingError(400, 'Invalid container id.');

    const body = await req.json();
    await verifyAuthorization({ employeeCode: body.employeeCode, password: body.password });

    const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : undefined;
    if (displayName !== undefined && !displayName) {
      throw new TumblingError(400, 'Display name cannot be empty.');
    }
    const isActive = typeof body.isActive === 'boolean' ? body.isActive : undefined;

    const container = await updateContainer(containerId, { displayName, isActive });
    return NextResponse.json({ container });
  } catch (err) {
    return handleRouteError('Tumbling container update', err);
  }
});
