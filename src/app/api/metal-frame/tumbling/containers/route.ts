import { NextResponse } from 'next/server';
import { listContainers } from '@/services/metal-frame/tumbling/container.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/containers -> all 44 containers (used by Settings / QR pages)
export async function GET() {
  try {
    const containers = await listContainers();
    return NextResponse.json({ containers });
  } catch (err) {
    return handleRouteError('Tumbling containers list', err);
  }
}
