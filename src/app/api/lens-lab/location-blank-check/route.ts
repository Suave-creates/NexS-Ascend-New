// src/app/api/lens-lab/location-blank-check/route.ts
//
// Data source changed: the blank-in-tray check no longer reads the WMS DB
// (order_items). It now calls the NexS WMS fittingDetails API. Unlike the Tray
// Releaser's fetchTrays endpoint (which serves without a token), the /nexs/wms
// endpoint REQUIRES a NexS jwt-token minted for the `nexs_wms` app. Auth is
// resolved with NO paste, on any origin:
//   1. the browser's jwt-token cookie, if it reached us (prod lenskart origin)
//   2. else a server-side login (getNexsToken) for the wms app-id
// EVERYTHING downstream (validity rule, allGreen, IST handling, DB logging,
// response shape) is unchanged.

import { NextResponse } from 'next/server';
import { getNexsToken } from '@/utils/nexsAuth';
import { prismaLensLab } from '@/utils/prismaLensLab';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// NexS WMS fitting-details endpoint. Keyed by the tray/location id (e.g.
// CT61308); returns every item of the fitting, including the lens blanks that
// are physically sitting in the tray.
const NEXS_BASE = 'https://app.nexs.lenskart.com/nexs/wms/api/v1/fittingDetails';

// A single entry from the API's data.item_details[].
type ItemDetail = {
  type: string;
  status: string;
  barcode: string | null;
  updated_at: string;
  parentLocation: string | null;
  item_id: number;
  product_id: number;
  tray_id: string | null;
};

// The shape the downstream processing expects — mirrors the old WMS
// order_items row so the processing block below is untouched.
type OrderItemRow = {
  location_id: string;
  fitting_id: number | null;
  product_id: number;
  barcode: string | null;
  status: string;
  updated_at: string;
};

type ResultRow = {
  location_id: string;
  product_id: string;
  barcode: string | null;
  updated_at_ist: string;
  is_valid: boolean;
};

// ─── route ──────────────────────────────────────────────────
export async function POST(req: Request) {
  // ── 0. Parse + validate input ──────────────────────────────
  let locationId: string;
  let operatorId: string;

  try {
    const body = await req.json();
    locationId = body?.locationId?.toString().trim();
    operatorId = body?.operatorId?.toString().trim().toUpperCase();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (!locationId) {
    return NextResponse.json(
      { success: false, error: 'locationId required' },
      { status: 400 }
    );
  }
  if (!operatorId) {
    return NextResponse.json(
      { success: false, error: 'operatorId required' },
      { status: 400 }
    );
  }

  try {
    // ── 1. Read from NexS WMS API (replaces the WMS DB query) ─
    const fwd: Record<string, string> = {
      Accept: 'application/json, text/plain, */*',
      'source-domain': 'https://app.nexs.lenskart.com',
    };
    for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
      const v = req.headers.get(name);
      if (v) fwd[name] = v;
    }

    // Resolve auth with NO paste: the browser's jwt-token cookie if it reached
    // us (prod lenskart origin), else a server-side login. The wms endpoint
    // rejects the default nexs-analytics token, so mint one for the wms app.
    const browserCookie = req.headers.get('cookie');
    let cookie: string | null =
      browserCookie && browserCookie.includes('jwt-token') ? browserCookie : null;
    let authVia = cookie ? 'browser-cookie' : '';
    if (!cookie) {
      const token = await getNexsToken(process.env.NEXS_WMS_APP_ID || 'nexs_wms');
      if (token) {
        cookie = `jwt-token=${token}`;
        authVia = 'server-login';
      }
    }
    if (cookie) fwd['Cookie'] = cookie;
    console.log('[location-blank-check]', locationId, '| auth:', authVia || 'NONE');

    let nexsRes: Response;
    try {
      nexsRes = await fetch(`${NEXS_BASE}/${encodeURIComponent(locationId)}`, {
        method: 'GET',
        headers: fwd,
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: `NexS network error: ${(err as Error).message}` },
        { status: 502 }
      );
    }

    const payload = await nexsRes.json().catch(() => null);
    if (!nexsRes.ok) {
      console.error('[LocationBlankCheck] NexS returned', nexsRes.status);
      return NextResponse.json(
        { success: false, error: `NexS returned HTTP ${nexsRes.status}` },
        { status: 502 }
      );
    }

    const details = payload?.data ?? {};
    const items: ItemDetail[] = Array.isArray(details.item_details)
      ? details.item_details
      : [];
    const fittingId =
      details.fitting_id != null ? String(details.fitting_id) : null;

    // Equivalent of `WHERE location_id = ? ORDER BY updated_at DESC LIMIT 2`:
    // keep only the items physically in THIS tray (tray_id === locationId — the
    // FRAME has tray_id null, so it drops out just like in the DB), newest
    // first, top 2.
    const rawData: OrderItemRow[] = items
      .filter(
        (it) =>
          it.tray_id != null &&
          String(it.tray_id).trim().toUpperCase() === locationId.toUpperCase()
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 2)
      .map((it) => ({
        location_id: String(it.tray_id ?? locationId),
        fitting_id: details.fitting_id ?? null,
        product_id: it.product_id,
        barcode: it.barcode,
        status: it.status,
        updated_at: it.updated_at,
      }));

    // ── 2. Process rows ─────────────────────────────────────
    const nowIST = new Date(Date.now());

    const processed: ResultRow[] = rawData.map((row) => {
      const updatedIST = new Date(
        new Date(row.updated_at).getTime() + 5.5 * 60 * 60 * 1000
      );

      const diffMs    = nowIST.getTime() - updatedIST.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const isValid =
        row.status === 'BLANK_IN_TRAY' && diffHours <= 2;

      return {
        location_id:    row.location_id,
        product_id:     String(row.product_id),
        barcode:        row.barcode,
        updated_at_ist: updatedIST.toLocaleString('en-IN'),
        is_valid:       isValid,
      };
    });

    const allGreen =
      processed.length === 2 && processed.every((r) => r.is_valid);

    // ── 3. ALWAYS write the log (fire-and-forget) ───────────
    prismaLensLab.locationBlankCheckLog
      .create({
        data: {
          operatorId,
          fittingId,
          locationId,

          product1Id:        processed[0]?.product_id      ?? null,
          product1Barcode:   processed[0]?.barcode         ?? null,
          product1UpdatedAt: rawData[0]
            ? new Date(rawData[0].updated_at)
            : null,
          product1IsValid:   processed[0]?.is_valid        ?? null,

          product2Id:        processed[1]?.product_id      ?? null,
          product2Barcode:   processed[1]?.barcode         ?? null,
          product2UpdatedAt: rawData[1]
            ? new Date(rawData[1].updated_at)
            : null,
          product2IsValid:   processed[1]?.is_valid        ?? null,

          allGreen,
        },
      })
      .catch((e) =>
        console.error('[LocationBlankCheck] DB log failed:', e)
      );

    // ── 4. Return ───────────────────────────────────────────
    if (!rawData.length) {
      return NextResponse.json(
        {
          success:  false,
          allGreen: false,
          error:    'No order items found for this location',
          data:     [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, allGreen, data: processed },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[LocationBlankCheck] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}
