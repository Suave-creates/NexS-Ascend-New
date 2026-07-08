// src/app/api/packing-dispatch/nexs-proxy/order-qc/route.ts
//
// ConsolidAte Order QC dump proxy. The monitoring endpoint requires the NexS
// `jwt-token`. Auth precedence:
//   1. browser cookie that already carries jwt-token (lenskart-origin deploy)
//   2. server-side login token (getNexsToken) — no paste, no extension, any origin
//   3. a stored cookie (NEXS_COOKIE / data file) as a last resort
// Colocated with fetch-trays under /api/packing-dispatch/nexs-proxy/.

import { NextResponse } from 'next/server';
import { getNexsToken } from '@/utils/nexsAuth';
import { getNexsCookie } from '@/utils/nexsSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET =
  'https://app.nexs.lenskart.com/nexs/analytics/monitoring/v3/details?version=v3';

export async function POST(req: Request) {
  const body = await req.text();

  const fwd: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    Origin: 'https://app.nexs.lenskart.com',
    Referer: 'https://app.nexs.lenskart.com/monitor',
  };
  for (const name of [
    'facility-code', 'workstation-id', 'source-domain', 'date-time',
    'user-agent', 'accept-language',
  ]) {
    const v = req.headers.get(name);
    if (v) fwd[name] = v;
  }

  // Resolve the auth cookie.
  const browserCookie = req.headers.get('cookie');
  let cookie: string | null =
    browserCookie && browserCookie.includes('jwt-token') ? browserCookie : null;
  if (!cookie) {
    const token = await getNexsToken();          // server logs in + caches
    if (token) cookie = `jwt-token=${token}`;
  }
  if (!cookie) cookie = await getNexsCookie();    // last-resort stored cookie
  if (cookie) fwd['Cookie'] = cookie;

  let nexsRes: Response;
  try {
    nexsRes = await fetch(TARGET, { method: 'POST', headers: fwd, body });
  } catch (err) {
    return NextResponse.json(
      { error: `Proxy network error: ${(err as Error).message}` },
      { status: 502 },
    );
  }

  const text = await nexsRes.text();
  if (!nexsRes.ok) console.error('[consolidate/order-qc] NexS', nexsRes.status, text.slice(0, 200));

  return new NextResponse(text, {
    status: nexsRes.status,
    headers: {
      'Content-Type': nexsRes.headers.get('content-type') || 'application/json',
    },
  });
}
