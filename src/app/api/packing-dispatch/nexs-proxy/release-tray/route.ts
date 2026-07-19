// src/app/api/packing-dispatch/nexs-proxy/release-tray/route.ts
//
// Server-side proxy for the NexS releaseTray endpoint.
// Same rationale as the fetch-trays proxy: bypasses browser CORS while
// re-forwarding the incoming Cookie header for NexS session auth.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET =
  'https://app.nexs.lenskart.com/nexs-consolidation/addverb/api/v1/releaseTray';

export async function PUT(req: Request) {
  const body = await req.text();

  const fwd: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  };

  for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
    const v = req.headers.get(name);
    if (v) fwd[name] = v;
  }

  const cookie = req.headers.get('cookie');
  if (cookie) fwd['Cookie'] = cookie;

  let nexsRes: Response;
  try {
    nexsRes = await fetch(TARGET, { method: 'PUT', headers: fwd, body });
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
