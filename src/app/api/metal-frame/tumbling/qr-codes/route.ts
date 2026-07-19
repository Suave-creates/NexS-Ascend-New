import { NextResponse } from 'next/server';
import { buildStationQrCodes } from '@/services/metal-frame/tumbling/qr.service';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/qr-codes -> one QR code per station, targeting its public stationCode route
export async function GET(req: Request) {
  try {
    const origin = new URL(req.url).origin;
    const qrCodes = await buildStationQrCodes(origin);
    return NextResponse.json({ qrCodes });
  } catch (err) {
    return handleRouteError('Tumbling QR codes', err);
  }
}
