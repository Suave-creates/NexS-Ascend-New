import { getNexsToken, invalidateNexsToken } from '@/utils/resources/nexs/auth';
import { isOmtNddOrder } from '@/utils/omtPriority';

const NEXS_WMS_BASE = 'https://app.nexs.lenskart.com/nexs/wms/api/v1';
const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;

type WmsOrderItem = {
  id?: number | string | null;
  createdAt?: string | null;
  fittingId?: number | string | null;
  locationId?: string | null;
  qcFailCount?: number | string | null;
  itemType?: string | null;
};

export type OmtTrayDetails = {
  scannedTrayId: string;
  fittingId: string;
  shipmentId: string;
  priority: string;
  priorityClassification: string;
  orderDate: string;
  orderAge: string;
  orderAgeDays: number | null;
  orderMode: 'NDD' | 'JIT' | 'REGULAR';
  rawOrderType: string;
  maxQcfCount: number;
  trayLensCode: string | null;
  relatedTrayIds: string[];
  lookupMs: number;
};

export class OmtNexsError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'OmtNexsError';
  }
}

function payloadMessage(payload: any, fallback: string) {
  return String(
    payload?.meta?.displayMessage
      ?? payload?.data?.displayMessage
      ?? payload?.data?.headerMessage
      ?? payload?.message
      ?? fallback,
  );
}

async function nexsGet(request: Request, url: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json, text/plain, */*',
    Origin: 'https://app.nexs.lenskart.com',
    Referer: 'https://app.nexs.lenskart.com/',
    'source-domain': 'https://app.nexs.lenskart.com',
  };
  for (const name of ['facility-code', 'workstation-id', 'source-domain']) {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  }

  const browserCookie = request.headers.get('cookie');
  const usingBrowserCookie = Boolean(browserCookie?.includes('jwt-token'));
  const wmsApp = process.env.NEXS_WMS_APP_ID || 'nexs_wms';
  let cookie: string | null = usingBrowserCookie ? browserCookie : null;
  if (!cookie) {
    const token = await getNexsToken(wmsApp);
    if (token) cookie = `jwt-token=${token}`;
  }

  const call = (authCookie: string | null) => {
    const requestHeaders = { ...headers };
    if (authCookie) requestHeaders.Cookie = authCookie;
    return fetch(url, { method: 'GET', headers: requestHeaders, cache: 'no-store' });
  };

  let response: Response;
  try {
    response = await call(cookie);
    if (response.status === 401 && !usingBrowserCookie) {
      invalidateNexsToken(wmsApp);
      const freshToken = await getNexsToken(wmsApp, true);
      if (freshToken) response = await call(`jwt-token=${freshToken}`);
    }
  } catch (error) {
    throw new OmtNexsError(`NexS network error: ${(error as Error).message}`, 'NEXS_UNAVAILABLE', 502);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new OmtNexsError(
      payloadMessage(payload, `NexS returned HTTP ${response.status}`),
      response.status === 404 ? 'TRAY_NOT_FOUND' : 'NEXS_LOOKUP_FAILED',
      response.status === 404 ? 404 : response.status >= 500 ? 502 : response.status,
    );
  }
  return payload;
}

function toQcfCount(value: unknown) {
  const count = Number(value ?? 0);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

export function orderAge(orderDate: string) {
  const parsed = Date.parse(`${orderDate.trim().replace(' ', 'T')}+05:30`);
  if (!Number.isFinite(parsed)) return { label: 'Unknown', days: null };
  const elapsedMs = Math.max(0, Date.now() - parsed);
  const days = Math.floor(elapsedMs / 86_400_000);
  const hours = Math.floor((elapsedMs % 86_400_000) / 3_600_000);
  return { label: `${days} day${days === 1 ? '' : 's'} ${hours} hour${hours === 1 ? '' : 's'}`, days };
}

function displayPriority(value: unknown, classification: string) {
  const raw = String(value ?? '').trim();
  if (isOmtNddOrder(raw, undefined, classification)) return '1';
  if (raw === '0') return 'Normal';
  return raw || classification || 'N/A';
}

/**
 * Resolve an OMT tray entirely from the live NexS WMS APIs.
 *
 * Parent vs. child is NOT derived here — NexS has no notion of which tray is
 * "the parent." It's purely a fact of which tray physically went through
 * Tray Putaway first; callers with DB access decide that by checking which
 * of relatedTrayIds is already stored in omt_tray_putaway.
 */
export async function fetchOmtTrayDetails(request: Request, rawTrayId: string): Promise<OmtTrayDetails> {
  const startedAt = Date.now();
  const scannedTrayId = rawTrayId.trim().toUpperCase();
  if (!TRAY_ID_PATTERN.test(scannedTrayId)) {
    throw new OmtNexsError('Invalid tray ID', 'INVALID_TRAY_ID', 400);
  }

  const fittingPayload = await nexsGet(
    request,
    `${NEXS_WMS_BASE}/fittingDetails/${encodeURIComponent(scannedTrayId)}`,
  );
  const fittingId = String(fittingPayload?.data?.fitting_id ?? '').trim();
  const shipmentId = String(fittingPayload?.data?.shipment_id ?? '').trim();
  if (!/^\d+$/.test(fittingId) || !shipmentId) {
    throw new OmtNexsError(
      'Tray fitting details are incomplete in NexS WMS',
      'INCOMPLETE_FITTING',
      422,
    );
  }

  const orderPayload = await nexsGet(
    request,
    `${NEXS_WMS_BASE}/order/details/id/${encodeURIComponent(shipmentId)}`,
  );
  const orderDetails = orderPayload?.data ?? {};
  const orderItemHeader = orderDetails.orderItemHeaderResponse ?? {};
  const allItems = Array.isArray(orderItemHeader.orderItemResponses)
    ? orderItemHeader.orderItemResponses as WmsOrderItem[]
    : [];
  const fittingItems = allItems.filter((item) => String(item.fittingId ?? '') === fittingId);
  const relatedTrayIds = Array.from(new Set(
    fittingItems
      .map((item) => String(item.locationId ?? '').trim().toUpperCase())
      .filter((locationId) => TRAY_ID_PATTERN.test(locationId)),
  ));
  if (!relatedTrayIds.length) {
    throw new OmtNexsError(
      'No tray locations were returned for this fitting',
      'TRAY_RELATIONSHIP_NOT_FOUND',
      422,
    );
  }

  const maxQcfCount = fittingItems.reduce(
    (maximum, item) => Math.max(maximum, toQcfCount(item.qcFailCount)),
    0,
  );
  // Which lens item(s) physically sit in the scanned tray — not which lens
  // failed QC. A tray can hold either lens, both, or neither (a frame tray).
  const trayLensTypes = new Set(
    fittingItems
      .filter((item) => String(item.locationId ?? '').trim().toUpperCase() === scannedTrayId)
      .map((item) => String(item.itemType ?? '').trim().toUpperCase()),
  );
  const hasLeftLens = trayLensTypes.has('LEFTLENS');
  const hasRightLens = trayLensTypes.has('RIGHTLENS');
  const trayLensCode = hasLeftLens && hasRightLens
    ? 'Both'
    : hasLeftLens ? 'LL' : hasRightLens ? 'RL' : null;
  const rawOrderType = String(orderItemHeader.orderItemType ?? orderDetails.orderType ?? '').trim() || 'N/A';
  const priorityClassification = String(
    orderItemHeader.customFields?.customFields?.PRIORITY_CLASSIFICATION_TYPE ?? '',
  ).trim();
  const rawPriority = orderItemHeader.orderPriority ?? orderDetails.orderPriority ?? orderDetails.priority;
  const nddOrder = isOmtNddOrder(rawPriority, undefined, priorityClassification);
  const orderDate = String(orderDetails.orderCreatedAt ?? orderDetails.orderDate ?? '').trim();
  const age = orderAge(orderDate);

  return {
    scannedTrayId,
    fittingId,
    shipmentId,
    priority: displayPriority(rawPriority, priorityClassification),
    priorityClassification: priorityClassification || 'N/A',
    orderDate: orderDate || 'N/A',
    orderAge: age.label,
    orderAgeDays: age.days,
    orderMode: nddOrder ? 'NDD' : rawOrderType.toUpperCase().includes('JIT') ? 'JIT' : 'REGULAR',
    rawOrderType,
    maxQcfCount,
    trayLensCode,
    relatedTrayIds,
    lookupMs: Date.now() - startedAt,
  };
}
