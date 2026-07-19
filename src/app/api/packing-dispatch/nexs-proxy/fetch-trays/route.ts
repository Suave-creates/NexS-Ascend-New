// src/app/api/packing-dispatch/nexs-proxy/fetch-trays/route.ts
//
// Server-side proxy for the NexS fetchTrays endpoint.
// The browser cannot call app.nexs.lenskart.com directly (CORS). This route
// forwards the request server-to-server, which is not subject to CORS, and
// re-forwards the incoming Cookie header so the NexS session is preserved.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET =
  'https://app.nexs.lenskart.com/nexs-consolidation/addverb/api/v1/fetchTrays';

export async function POST(req: Request) {
  const body = await req.text();

  const fwd: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  };

  // Forward the NexS-specific headers the browser originally built.
  for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
    const v = req.headers.get(name);
    if (v) fwd[name] = v;
  }

  // Forward cookies — if the NexS session cookie is scoped to .lenskart.com
  // (common for internal SSO), the browser will have sent it here too.
  const cookie = req.headers.get('cookie');
  if (cookie) fwd['Cookie'] = cookie;

  let nexsRes: Response;
  try {
    nexsRes = await fetch(TARGET, { method: 'POST', headers: fwd, body });
  } catch (err) {
    return NextResponse.json(
      { error: `Proxy network error: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  const text = await nexsRes.text();
  return new NextResponse(text, {
    status: nexsRes.status,
    headers: {
      'Content-Type':
        nexsRes.headers.get('content-type') || 'application/json',
    },
  });
}
