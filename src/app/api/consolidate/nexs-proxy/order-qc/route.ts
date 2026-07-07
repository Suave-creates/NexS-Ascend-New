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
  };

  for (const name of ['facility-code', 'workstation-id', 'source-domain', 'date-time']) {
    const v = req.headers.get(name);
    if (v) fwd[name] = v;
  }

  // On a lenskart-origin deployment the browser auto-forwards the httpOnly NexS
  // session cookie. On a non-lenskart origin (e.g. a Docker IP) it can't reach us,
  // so fall back to a server-provided NEXS_COOKIE (paste from DevTools "Copy as
  // cURL" → the `cookie:` header). Kept in env only (.env* is gitignored & not baked
  // into the image); rotate when the NexS session expires.
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
