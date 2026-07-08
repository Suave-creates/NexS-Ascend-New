// src/utils/nexsAuth.ts
//
// Server-side NexS authentication: logs in to the NexS auth API with stored
// credentials, obtains a `jwt-token`, caches it, and auto-refreshes before it
// expires. Lets the Order QC dump proxy authenticate on ANY origin with NO
// pasted cookie and NO browser extension.
//
// Configure via env (no secrets in source):
//   NEXS_AUTH_URL       full login endpoint (POST) that returns/sets the jwt-token
//   NEXS_USERNAME       NexS login username / email / emp-code (emp-code, e.g. 197531)
//   NEXS_PASSWORD       NexS login password
//   NEXS_APP_ID         value of the `x-lenskart-app-id` header (app identifier the
//                       frontend hardcodes) — REQUIRED, else login → 400 "Invalid app"
//   NEXS_FACILITY       optional facility-code header (default NXS1)
//   NEXS_WORKSTATION    optional workstation-id header (default QC01)
//   NEXS_AUTH_BODY      optional JSON body template; default {"userName":"..","password":".."}
//                       placeholders {USERNAME}/{PASSWORD} are substituted.
//
// Confirmed via live probes: body must be exactly {"userName","password"} (strict
// schema — extra keys → "Invalid request json body"); the app identifier is the
// HEADER `x-lenskart-app-id` (not a body field); the JWT is returned in the JSON
// response body (field `content`) and/or as a Set-Cookie jwt-token=…

type Cached = { token: string; expMs: number };
// Per-app-id caches. The auth-service mints a DIFFERENT token per
// x-lenskart-app-id, and each downstream service only accepts its own app's
// token (e.g. /nexs/wms rejects an nexs-analytics token). Key by app-id.
const cache = new Map<string, Cached>();
const inFlight = new Map<string, Promise<string | null>>();

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
  return JSON.stringify({ userName: user, password: pass });
}

async function login(appId: string): Promise<string | null> {
  const url = process.env.NEXS_AUTH_URL;
  const user = process.env.NEXS_USERNAME;
  const pass = process.env.NEXS_PASSWORD;
  if (!url || !user || !pass) return null; // not configured

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
    'source-domain': 'https://app.nexs.lenskart.com',
    'facility-code': process.env.NEXS_FACILITY || 'NXS1',
    'workstation-id': process.env.NEXS_WORKSTATION || 'QC01',
  };
  // App identifier header (frontend hardcodes this). Without a valid value the
  // auth-service replies 400 "Invalid app". The token is scoped to this app —
  // only that app's downstream service will accept it.
  if (appId) headers['x-lenskart-app-id'] = appId;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: buildLoginBody(user, pass),
  });

  // The token comes back in the JSON body (field `content`) and/or as a
  // Set-Cookie jwt-token=… — accept whichever is present.
  const setCookie = res.headers.get('set-cookie') || '';
  const fromCookie = setCookie.match(/jwt-token=([^;]+)/)?.[1];
  let token: string | null = fromCookie || null;
  if (!token) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      // Prefer the documented `content` field, then a recursive hunt.
      const content = json?.content;
      token =
        (typeof content === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(content) ? content : null) ||
        findJwt(content) ||
        findJwt(json);
    } catch { token = null; }
  }
  if (!res.ok || !token) {
    console.error('[nexsAuth] login failed', res.status, `(app ${appId})`);
    return null;
  }

  const expMs = jwtExpMs(token) ?? Date.now() + 30 * 60_000; // fallback 30m
  cache.set(appId, { token, expMs });
  return token;
}

/**
 * Get a valid NexS jwt-token for the given app, logging in / refreshing as
 * needed. `appId` defaults to NEXS_APP_ID; pass an explicit app-id (e.g.
 * 'nexs_wms') when the target service only accepts its own app's token.
 */
export async function getNexsToken(appId?: string): Promise<string | null> {
  const key = appId || process.env.NEXS_APP_ID || '';
  const hit = cache.get(key);
  if (hit && hit.expMs - SKEW_MS > Date.now()) return hit.token;
  const pending = inFlight.get(key);
  if (pending) return pending;                // single-flight per app-id
  const p = login(key).finally(() => { inFlight.delete(key); });
  inFlight.set(key, p);
  return p;
}

export function nexsAuthConfigured(): boolean {
  return !!(process.env.NEXS_AUTH_URL && process.env.NEXS_USERNAME && process.env.NEXS_PASSWORD);
}
