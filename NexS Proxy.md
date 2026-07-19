# NexS Proxy — how to call NexS APIs from this app

A playbook for wiring any new feature to a live NexS endpoint (`app.nexs.lenskart.com`).
Follow this and you won't re-discover the auth quirks the hard way.

> **One-line summary:** the browser can't call NexS directly (CORS), so a Next.js
> **server route** forwards the request server-to-server. Auth is a NexS
> `jwt-token`, and that token is **minted per app** — the tricky part everyone
> trips on. See [Auth model](#auth-model).

---

## When to use this

Any time a feature needs data from NexS that isn't already in one of our DBs:
tray contents, fitting details, order QC dumps, releasing trays, etc.

Two shapes exist — pick one:

| Pattern | Use when | Example in repo |
|---|---|---|
| **A. Thin pass-through proxy** | The browser just needs the raw NexS JSON; all logic/paging lives client-side | `src/app/api/packing-dispatch/nexs-proxy/fetch-trays/route.ts` |
| **B. Server route that fetches + processes** | You must transform the response, apply rules, and/or log to our DB before returning | `src/app/api/lens-lab/location-blank-check/route.ts` |

Both use the **same auth block**. The only difference is whether the route
processes the response or streams it back untouched.

---

## Auth model

**This is the part that bites.** Three facts, learned the hard way:

### 1. Not every NexS endpoint needs a token

| NexS path | Auth required? |
|---|---|
| `/nexs-consolidation/addverb/...` (e.g. `fetchTrays`) | **None** — served on internal/IP trust |
| `/nexs/analytics/monitoring/...` (order-qc dump) | Token for app **`nexs-analytics`** |
| `/nexs/wms/...` (e.g. `fittingDetails`) | Token for app **`nexs_wms`** |

If your endpoint is under `addverb`, you may not need auth at all — test first
(see [Discover the endpoint](#discover-a-new-endpoint-first)).

### 2. Tokens are minted **per `x-lenskart-app-id`**

`POST /v1/user/login` returns a JWT scoped to whatever `x-lenskart-app-id`
header you sent. **A downstream service only accepts a token minted for its own
app.** Using the wrong app-id gives a 401 that *looks* like the token is broken:

| 401 body | Meaning |
|---|---|
| `"Token expired for user !!!"` | No token sent at all |
| `"Unable to get Expiration time from Json Web Token"` | Token sent, but **minted for the wrong app** |

Known app-ids: `nexs-analytics`, `nexs_wms`, `nexs_packing`, `nexs_search`.
(Note the mixed `-`/`_`. `nexs-wms` with a dash is **invalid** → login 403.)

### 3. Browser cookies only flow on a lenskart origin

The `jwt-token` cookie is scoped to `.lenskart.com`. The browser sends it to our
route **only if the dashboard is served from a `*.lenskart.com` host**. On an
**IP origin (`10.9.96.189`) or `localhost`, the cookie is never sent** — so you
cannot rely on cookie pass-through in dev. Use the server-login fallback.

---

## The canonical auth block

Drop this into any server route that calls a token-protected NexS endpoint.
It needs **no pasting** and works on every origin.

```ts
import { getNexsToken } from '@/utils/nexsAuth';

// 1) prefer the browser's cookie (prod, lenskart origin)
// 2) else server-login for the RIGHT app-id (dev / IP origin / any origin)
const browserCookie = req.headers.get('cookie');
let cookie: string | null =
  browserCookie && browserCookie.includes('jwt-token') ? browserCookie : null;
if (!cookie) {
  const token = await getNexsToken(process.env.NEXS_WMS_APP_ID || 'nexs_wms'); // ← app-id for YOUR endpoint
  if (token) cookie = `jwt-token=${token}`;
}

const fwd: Record<string, string> = {
  Accept: 'application/json, text/plain, */*',
  'source-domain': 'https://app.nexs.lenskart.com',
};
if (cookie) fwd['Cookie'] = cookie;
```

- `getNexsToken(appId?)` logs in, **caches per app-id, and auto-refreshes** a
  minute before expiry. Default arg is `NEXS_APP_ID` (`nexs-analytics`). Pass an
  explicit app-id for other services.
- Lives in `src/utils/nexsAuth.ts`. Never write your own login loop.

### Required env (`.env.local`)

```
NEXS_AUTH_URL=https://app.nexs.lenskart.com/v1/user/login
NEXS_USERNAME=<emp code>
NEXS_PASSWORD=<password>
NEXS_APP_ID=nexs-analytics        # default app
NEXS_WMS_APP_ID=nexs_wms          # add one per app your features need
NEXS_FACILITY=NXS1
NEXS_WORKSTATION=QC01
```

> Env changes require a **dev-server restart** — Next.js only reads env at boot.

---

## Pattern A — thin pass-through proxy

Server route forwards the request and streams the response back untouched.
Client does the rest (paging, dedup, retries).

```ts
// src/app/api/<area>/nexs-proxy/<name>/route.ts
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET = 'https://app.nexs.lenskart.com/<path>';

export async function POST(req: Request) {
  const body = await req.text();

  const fwd: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
  };
  for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
    const v = req.headers.get(name);
    if (v) fwd[name] = v;
  }
  // …insert the canonical auth block here if the endpoint needs a token…
  const cookie = req.headers.get('cookie');
  if (cookie) fwd['Cookie'] = cookie;

  let res: Response;
  try {
    res = await fetch(TARGET, { method: 'POST', headers: fwd, body });
  } catch (err) {
    return NextResponse.json({ error: `Proxy network error: ${(err as Error).message}` }, { status: 502 });
  }
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
  });
}
```

Client side (see `src/app/packing-dispatch/tray-releaser/nexsApi.ts` for a full
example with pagination + dedup): call `/api/.../nexs-proxy/<name>` **same-origin**
— cookies attach automatically, no `credentials` needed.

---

## Pattern B — server route that fetches + processes

Route calls NexS, transforms the result, optionally logs to our DB, returns a
clean shape. The frontend contract stays whatever your page already expects.

```ts
import { NextResponse } from 'next/server';
import { getNexsToken } from '@/utils/nexsAuth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NEXS_BASE = 'https://app.nexs.lenskart.com/nexs/wms/api/v1/fittingDetails';

export async function POST(req: Request) {
  const { locationId } = await req.json();

  // …canonical auth block → builds `fwd` with Cookie…

  const nexsRes = await fetch(`${NEXS_BASE}/${encodeURIComponent(locationId)}`, {
    method: 'GET', headers: fwd,
  });
  const payload = await nexsRes.json().catch(() => null);
  if (!nexsRes.ok) {
    return NextResponse.json({ success: false, error: `NexS HTTP ${nexsRes.status}` }, { status: 502 });
  }

  // …transform payload.data, apply business rules, log to Prisma, return…
  return NextResponse.json({ success: true, /* processed data */ });
}
```

Real, complete example: `src/app/api/lens-lab/location-blank-check/route.ts`
(replaced a WMS-DB query with a `fittingDetails` call, kept all downstream logic).

---

## Discover a new endpoint first

Before writing the route, **probe the endpoint from a terminal** to learn (a)
whether it needs a token and (b) which app-id it wants. This is exactly how the
`nexs_wms` requirement was found.

**Does it need auth?** (curl, no token)
```bash
curl -s -w "\n[HTTP %{http_code}]\n" 'https://app.nexs.lenskart.com/<path>' \
  -H 'Accept: application/json'
# 200 → no token needed. 401 → read the message (see auth table above).
```

**Find the app-id that works** (Node — global fetch):
```js
async function login(appId){
  const r = await fetch("https://app.nexs.lenskart.com/v1/user/login",{
    method:"POST",
    headers:{"Content-Type":"application/json","Accept":"application/json","x-lenskart-app-id":appId,"source-domain":"https://app.nexs.lenskart.com"},
    body:JSON.stringify({userName:"<emp>",password:"<pw>"})});
  return JSON.parse(await r.text()).content;           // the JWT
}
for (const appId of ["nexs_wms","nexs-analytics","nexs_packing"]) {
  const tok = await login(appId);
  const r = await fetch("<endpoint>", { headers:{ Cookie:`jwt-token=${tok}` }});
  console.log(appId, r.status);                        // pick the one that 200s
}
```

The successful `appId` is what you pass to `getNexsToken(appId)`.

---

## Gotchas

- **XML vs JSON.** Some NexS endpoints (e.g. `fittingDetails`) content-negotiate
  and return **XML** unless `Accept` prioritizes `application/json`. Always send
  `Accept: 'application/json, text/plain, */*'`. If you ever get an empty/"not
  found" result on data you know exists, check you didn't get XML.
- **`runtime = 'nodejs'` + `dynamic = 'force-dynamic'`** on the route — it reads
  request cookies and makes live calls; it must never be cached.
- **Same-origin client fetch** — the browser attaches cookies automatically to
  `/api/...`; do **not** set `credentials: 'include'` (that's for cross-origin).
- **Transient login 500s** happen occasionally on the auth service. `getNexsToken`
  caches (~24h) and single-flights, so one blip 401s a single request and the
  next retry recovers. Don't add your own retry storm.
- **Debug line.** Log which auth path resolved, e.g.
  `console.log('[my-route]', id, '| auth:', authVia)` → `browser-cookie` in prod,
  `server-login` on IP/localhost. Invaluable when a 401 shows up.

---

## Reference files

- `src/utils/nexsAuth.ts` — `getNexsToken(appId?)`, per-app cache + refresh.
- `src/app/api/packing-dispatch/nexs-proxy/fetch-trays/route.ts` — Pattern A (no token).
- `src/app/api/packing-dispatch/nexs-proxy/order-qc/route.ts` — Pattern A + auth (`nexs-analytics`).
- `src/app/api/lens-lab/location-blank-check/route.ts` — Pattern B + auth (`nexs_wms`).
- `src/app/packing-dispatch/tray-releaser/nexsApi.ts` — client-side paging/dedup over a proxy.
