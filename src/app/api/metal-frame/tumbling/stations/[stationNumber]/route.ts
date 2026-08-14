import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { getStationDetail } from '@/services/metal-frame/tumbling/container.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/stations/[stationNumber] -> both containers for one station (feeds the station modal)
export const GET = authMiddleware<{ stationNumber: string }>(async (_req: Request, { params }: { params: { stationNumber: string } }) => {
  try {
    const stationNumber = Number(params.stationNumber);
    if (!Number.isInteger(stationNumber) || stationNumber < 1 || stationNumber > 22) {
      throw new TumblingError(400, 'Invalid station number.');
    }
    const detail = await getStationDetail(stationNumber);
    return NextResponse.json(detail);
  } catch (err) {
    return handleRouteError('Tumbling station detail', err);
  }
});
