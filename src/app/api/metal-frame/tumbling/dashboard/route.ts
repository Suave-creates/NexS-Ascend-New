import { NextResponse } from 'next/server';
import { getDashboard } from '@/services/metal-frame/tumbling/dashboard.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/dashboard -> optimized station-card dashboard payload
export async function GET() {
  try {
    const dashboard = await getDashboard();
    return NextResponse.json(dashboard);
  } catch (err) {
    return handleRouteError('Tumbling dashboard', err);
  }
}
