// src/app/api/consolidate/nexs-proxy/order-qc/route.ts
//
// Server-side proxy for the NexS "CL: Order QC" dump, mirroring the Tray Releaser
// proxy. The browser cannot call app.nexs.lenskart.com directly (CORS); this route
// forwards server-to-server and re-forwards the incoming Cookie + NexS headers so
// the user's existing NexS session is used (no token is stored or relayed by us).

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET =
  'https://app.nexs.lenskart.com/nexs/analytics/monitoring/v3/details?version=v3';

export async function POST(req: Request) {
  const body = await req.text();

  const fwd: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    // The monitoring gateway validates these browser-set headers (Origin/Referer
    // for CSRF; a browser UA). They are NOT visible to page JS, so a naive header
    // copy misses them — and a server-to-server fetch omits them entirely, which
    // makes /details return 401 even with a valid session cookie.
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

  // Auth is the httpOnly `jwt-token` cookie (a ~24h JWT). On a lenskart-origin
  // deployment the browser forwards it here automatically. On a non-lenskart
  // origin (e.g. a Docker IP) it cannot — so fall back to a server-provided
  // NEXS_COOKIE (the DevTools request "cookie:" value, or just "jwt-token=…").
  // Env-only (.env* gitignored, not baked into the image); the JWT expires ~24h.
  const cookie = req.headers.get('cookie') || process.env.NEXS_COOKIE;
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
  return new NextResponse(text, {
    status: nexsRes.status,
    headers: {
      'Content-Type': nexsRes.headers.get('content-type') || 'application/json',
    },
  });
}
