import { NextResponse } from 'next/server';
import { getNexsToken, invalidateNexsToken } from '@/utils/nexsAuth';
import prisma from '@/utils/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NEXS_HISTORY_URL = 'https://app.nexs.lenskart.com/nexs/api/ims/getHistory';

type NexsCurrentRecord = {
  pid?: string | number | null;
  barcode?: string | null;
  status?: string | null;
  condition?: string | null;
  availability?: string | null;
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let barcode: string;
  let scanLocation: string;

  try {
    const body = await req.json();
    barcode = body?.barcode?.toString().trim();
    scanLocation = body?.scan_location?.toString().trim();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  if (!barcode) return jsonError('barcode required', 400);
  if (!scanLocation) return jsonError('scan_location required', 400);

  // Link barcodes can contain a prefix; NexS stores the rightmost 12 chars.
  barcode = barcode.slice(-12);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'date-time': new Date().toISOString().slice(0, 19).replace('T', ' '),
      'facility-code': process.env.NEXS_FACILITY || 'NXS1',
      'workstation-id': process.env.NEXS_WORKSTATION || '',
      'source-domain': 'https://app.nexs.lenskart.com',
    };

    for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
      const value = req.headers.get(name);
      if (value) headers[name] = value;
    }

    // Match location-blank-check: prefer a browser NexS session when present,
    // otherwise mint a service-specific token and retry once after a 401.
    const browserCookie = req.headers.get('cookie');
    const usingBrowserCookie = !!browserCookie?.includes('jwt-token');
    const imsApp = process.env.NEXS_IMS_APP_ID || 'nexs_ims';
    let cookie: string | null = usingBrowserCookie ? browserCookie : null;
    if (!cookie) {
      const token = await getNexsToken(imsApp);
      if (token) cookie = `jwt-token=${token}`;
    }

    const callNexs = (authCookie: string | null) => {
      const requestHeaders = { ...headers };
      if (authCookie) requestHeaders.Cookie = authCookie;
      return fetch(NEXS_HISTORY_URL, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          type: 'barcode',
          pageRequest: { sortKey: 'updatedAt', sortOrder: 'DESC' },
          barcode,
        }),
        cache: 'no-store',
      });
    };

    let nexsResponse: Response;
    try {
      nexsResponse = await callNexs(cookie);
      if (nexsResponse.status === 401 && !usingBrowserCookie) {
        invalidateNexsToken(imsApp);
        const freshToken = await getNexsToken(imsApp, true);
        if (freshToken) nexsResponse = await callNexs(`jwt-token=${freshToken}`);
      }
    } catch (error) {
      return jsonError(`NexS network error: ${(error as Error).message}`, 502);
    }

    const payload = await nexsResponse.json().catch(() => null);
    if (!nexsResponse.ok) {
      console.error('[pid-hunter] NexS returned', nexsResponse.status);
      return jsonError(`NexS returned HTTP ${nexsResponse.status}`, 502);
    }

    const current = payload?.data?.currentStatusSearchResultResponse as NexsCurrentRecord | undefined;
    if (!current) return jsonError('Barcode not found', 404);

    const resolvedBarcode = String(current.barcode || barcode);
    const pid = current.pid == null ? '' : String(current.pid);
    if (!pid) return jsonError('NexS response did not include a PID', 502);

    const existing = await prisma.scannedBarcodeInventory.findFirst({
      where: { barcode: resolvedBarcode, scanLocation },
    });

    if (existing) {
      return jsonError('Duplicate: Barcode already scanned at this location', 409);
    }

    await prisma.scannedBarcodeInventory.create({
      data: {
        pid,
        barcode: resolvedBarcode,
        status: current.status ?? '',
        condition: current.condition ?? '',
        availability: current.availability ?? '',
        scanLocation,
      },
    });

    return NextResponse.json({
      pid,
      barcode: resolvedBarcode,
      status: current.status ?? '',
      condition: current.condition ?? '',
      availability: current.availability ?? '',
      scan_location: scanLocation,
    });
  } catch (error) {
    console.error('[pid-hunter] Processing failed:', error);
    return jsonError('Processing failed', 500);
  }
}
