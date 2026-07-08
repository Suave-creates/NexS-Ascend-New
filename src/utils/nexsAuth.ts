// src/utils/nexsAuth.ts
//
// Server-side NexS authentication: logs in to the NexS auth API with stored
// credentials, obtains a `jwt-token`, caches it, and auto-refreshes before it
// expires. Lets the Order QC dump proxy authenticate on ANY origin with NO
// pasted cookie and NO browser extension.
//
// Configure via env (no secrets in source):
//   NEXS_AUTH_URL       full login endpoint (POST) that returns/sets the jwt-token
//   NEXS_USERNAME       NexS login username / email / emp-code
//   NEXS_PASSWORD       NexS login password
//   NEXS_FACILITY       optional facility-code header (default NXS1)
//   NEXS_WORKSTATION    optional workstation-id header (default QC01)
//   NEXS_AUTH_BODY      optional JSON body template; {"username":"..","password":".."}
//                       placeholders {USERNAME}/{PASSWORD} are substituted.
//
// The exact request shape is confirmed from a captured login request; adjust
// buildLoginBody()/extraction below to match once we have it.

type Cached = { token: string; expMs: number };
let cache: Cached | null = null;
let inFlight: Promise<string | null> | null = null;

const SKEW_MS = 60_000; // refresh a minute before expiry

function jwtExpMs(token: string): number | null {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** Recursively hunt a JWT-looking string (a.b.c of base64url) in a JSON value. */
function findJwt(v: unknown): string | null {
  if (typeof v === 'string') {
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(v) ? v : null;
  }
  if (v && typeof v === 'object') {
    for (const val of Object.values(v as Record<string, unknown>)) {
      const hit = findJwt(val);
      if (hit) return hit;
    }
  }
  return null;
}

function buildLoginBody(user: string, pass: string): string {
  const tpl = process.env.NEXS_AUTH_BODY;
  if (tpl) return tpl.replace('{USERNAME}', user).replace('{PASSWORD}', pass);
  return JSON.stringify({ username: user, password: pass });
}

async function login(): Promise<string | null> {
  const url = process.env.NEXS_AUTH_URL;
  const user = process.env.NEXS_USERNAME;
  const pass = process.env.NEXS_PASSWORD;
  if (!url || !user || !pass) return null; // not configured

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'source-domain': 'https://app.nexs.lenskart.com',
      'facility-code': process.env.NEXS_FACILITY || 'NXS1',
      'workstation-id': process.env.NEXS_WORKSTATION || 'QC01',
    },
    body: buildLoginBody(user, pass),
  });

  // The token may come back as a Set-Cookie (jwt-token=…) or in the JSON body.
  const setCookie = res.headers.get('set-cookie') || '';
  const fromCookie = setCookie.match(/jwt-token=([^;]+)/)?.[1];
  let token: string | null = fromCookie || null;
  if (!token) {
    const text = await res.text();
    try { token = findJwt(JSON.parse(text)); } catch { token = null; }
  }
  if (!res.ok || !token) {
    console.error('[nexsAuth] login failed', res.status);
    return null;
  }

  const expMs = jwtExpMs(token) ?? Date.now() + 30 * 60_000; // fallback 30m
  cache = { token, expMs };
  return token;
}

/** Get a valid NexS jwt-token, logging in / refreshing as needed. */
export async function getNexsToken(): Promise<string | null> {
  if (cache && cache.expMs - SKEW_MS > Date.now()) return cache.token;
  if (inFlight) return inFlight;              // single-flight: one login at a time
  inFlight = login().finally(() => { inFlight = null; });
  return inFlight;
}

export function nexsAuthConfigured(): boolean {
  return !!(process.env.NEXS_AUTH_URL && process.env.NEXS_USERNAME && process.env.NEXS_PASSWORD);
}
