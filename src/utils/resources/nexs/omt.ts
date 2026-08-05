import { getNexsToken, invalidateNexsToken } from '@/utils/resources/nexs/auth';

const NEXS_WMS_BASE = 'https://app.nexs.lenskart.com/nexs/wms/api/v1';
const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;

export type OmtTrayRole = 'PARENT' | 'CHILD' | 'UNKNOWN';

type WmsOrderItem = {
  id?: number | string | null;
  createdAt?: string | null;
  fittingId?: number | string | null;
  locationId?: string | null;
  qcFailCount?: number | string | null;
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
  orderMode: 'JIT' | 'REGULAR';
  rawOrderType: string;
  maxQcfCount: number;
  parentTrayId: string;
  childTrayId: string;
  trayRole: OmtTrayRole;
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

function timestamp(value: unknown) {
  const parsed = Date.parse(String(value ?? '').trim().replace(' ', 'T') + '+05:30');
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

function orderAge(orderDate: string) {
  const parsed = Date.parse(`${orderDate.trim().replace(' ', 'T')}+05:30`);
  if (!Number.isFinite(parsed)) return { label: 'Unknown', days: null };
  const elapsedMs = Math.max(0, Date.now() - parsed);
  const days = Math.floor(elapsedMs / 86_400_000);
  const hours = Math.floor((elapsedMs % 86_400_000) / 3_600_000);
  return { label: `${days} day${days === 1 ? '' : 's'} ${hours} hour${hours === 1 ? '' : 's'}`, days };
}

function displayPriority(value: unknown, classification: string) {
  const raw = String(value ?? '').trim();
  if (raw === '0') return 'Normal';
  return raw || classification || 'N/A';
}

/**
 * Resolve an OMT tray entirely from the live NexS WMS APIs.
 *
 * Parent selection intentionally mirrors the old OMT BigQuery rule: the tray
 * containing the lowest-QCF item wins, with created time and item id used as
 * deterministic tie breakers. Every other tray in the fitting is a child.
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
  const rankedItems = fittingItems
    .filter((item) => TRAY_ID_PATTERN.test(String(item.locationId ?? '').trim().toUpperCase()))
    .sort((left, right) => (
      toQcfCount(left.qcFailCount) - toQcfCount(right.qcFailCount)
      || timestamp(left.createdAt) - timestamp(right.createdAt)
      || Number(left.id ?? 0) - Number(right.id ?? 0)
    ));

  const relatedTrayIds = Array.from(new Set(
    rankedItems.map((item) => String(item.locationId).trim().toUpperCase()),
  ));
  if (!relatedTrayIds.length) {
    throw new OmtNexsError(
      'No tray locations were returned for this fitting',
      'TRAY_RELATIONSHIP_NOT_FOUND',
      422,
    );
  }

  const parentTrayId = relatedTrayIds[0];
  const childTrayId = [...relatedTrayIds].reverse().find((trayId) => trayId !== parentTrayId) ?? parentTrayId;
  const trayRole: OmtTrayRole = scannedTrayId === parentTrayId
    ? 'PARENT'
    : relatedTrayIds.includes(scannedTrayId) ? 'CHILD' : 'UNKNOWN';
  const maxQcfCount = fittingItems.reduce(
    (maximum, item) => Math.max(maximum, toQcfCount(item.qcFailCount)),
    0,
  );
  const rawOrderType = String(orderItemHeader.orderItemType ?? orderDetails.orderType ?? '').trim() || 'N/A';
  const priorityClassification = String(
    orderItemHeader.customFields?.customFields?.PRIORITY_CLASSIFICATION_TYPE ?? '',
  ).trim();
  const orderDate = String(orderDetails.orderCreatedAt ?? orderDetails.orderDate ?? '').trim();
  const age = orderAge(orderDate);

  return {
    scannedTrayId,
    fittingId,
    shipmentId,
    priority: displayPriority(orderDetails.priority, priorityClassification),
    priorityClassification: priorityClassification || 'N/A',
    orderDate: orderDate || 'N/A',
    orderAge: age.label,
    orderAgeDays: age.days,
    orderMode: rawOrderType.toUpperCase().includes('JIT') ? 'JIT' : 'REGULAR',
    rawOrderType,
    maxQcfCount,
    parentTrayId,
    childTrayId,
    trayRole,
    relatedTrayIds,
    lookupMs: Date.now() - startedAt,
  };
}
