import 'server-only';

import {
  BIGQUERY_DATA_PROJECT_ID,
  runBigQuery,
} from '@/utils/resources/bigquery/client';

const LOOKUP_TIMEOUT_MS = 45_000;
const CACHE_TTL_MS = 10 * 60_000;
const MAX_CACHE_ENTRIES = 2_000;

const ORDER_ITEMS_QUERY = `
SELECT
  CAST(id AS STRING) AS order_item_id,
  CAST(wms_order_code AS STRING) AS wms_order_code,
  CAST(power_id AS STRING) AS power_id
FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.order_items\`
WHERE
  fitting_id = SAFE_CAST(@fitting_id AS INT64)
ORDER BY id
`;

const POWER_QUERY = `
SELECT
  CAST(id AS STRING) AS power_row_id,
  CAST(order_id AS STRING) AS order_id,
  CAST(product_id AS STRING) AS product_id,
  CAST(right_lens AS STRING) AS right_lens,
  axis,
  sph,
  lens_height,
  lens_width,
  cyl,
  ap,
  bottom_distance,
  edge_distance,
  effective_dia,
  CAST(lens_index AS STRING) AS lens_index,
  CAST(lensname AS STRING) AS lensname,
  CAST(lenstype AS STRING) AS lenstype,
  CAST(coating AS STRING) AS coating,
  CAST(package AS STRING) AS package
FROM \`${BIGQUERY_DATA_PROJECT_ID}.wms.power\`
WHERE
  id BETWEEN SAFE_CAST(@min_power_id AS INT64) AND SAFE_CAST(@max_power_id AS INT64)
  AND CAST(id AS STRING) IN UNNEST(@power_ids)
ORDER BY id
`;

export type LensLabFqcPowerRow = {
  order_id: string | null;
  product_id: string | null;
  right_lens: string | null;
  axis: number | null;
  sph: number | null;
  lens_height: number | null;
  lens_width: number | null;
  cyl: number | null;
  ap: number | null;
  bottom_distance: number | null;
  edge_distance: number | null;
  effective_dia: number | null;
  lens_index: string | null;
  lensname: string | null;
  lenstype: string | null;
  coating: string | null;
  package: string | null;
};

export type LensLabFqcSource = {
  fittingId: string;
  wmsOrderCode: string;
  orderId: string;
  power: LensLabFqcPowerRow[];
};

type CacheEntry = { expiresAt: number; source: LensLabFqcSource };
type FqcGlobal = typeof globalThis & {
  __lensLabFqcBigQueryCache?: Map<string, CacheEntry>;
};

const fqcGlobal = globalThis as FqcGlobal;
const sourceCache = fqcGlobal.__lensLabFqcBigQueryCache ??= new Map<string, CacheEntry>();

function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const result = String(value).trim();
  return result || null;
}

function number(value: unknown): number | null {
  const result = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(result) ? result : null;
}

function integer(value: unknown): number | null {
  const result = number(value);
  return result === null ? null : Math.round(result);
}

function remember(fittingId: string, source: LensLabFqcSource) {
  sourceCache.delete(fittingId);
  sourceCache.set(fittingId, { source, expiresAt: Date.now() + CACHE_TTL_MS });
  while (sourceCache.size > MAX_CACHE_ENTRIES) {
    const oldest = sourceCache.keys().next().value as string | undefined;
    if (!oldest) break;
    sourceCache.delete(oldest);
  }
}

export function normalizeLensLabFittingId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const fittingId = value.trim();
  return /^\d{1,9}$/.test(fittingId) ? fittingId : null;
}

async function querySource(
  fittingId: string,
  signal: AbortSignal,
): Promise<LensLabFqcSource | null> {
  const orderResult = await runBigQuery(
    ORDER_ITEMS_QUERY,
    100,
    { fitting_id: fittingId },
    { signal, jobTimeoutMs: LOOKUP_TIMEOUT_MS },
  );
  if (!orderResult.rows.length) return null;

  const orderCodes = [...new Set(
    orderResult.rows
      .map((row) => text(row.wms_order_code))
      .filter((value): value is string => Boolean(value)),
  )];
  if (orderCodes.length !== 1) {
    throw new Error(`BigQuery fitting resolved to ${orderCodes.length} order codes`);
  }
  const [wmsOrderCode] = orderCodes;

  const powerIds = [...new Set(
    orderResult.rows.map((row) => text(row.power_id)).filter((value): value is string => Boolean(value)),
  )].sort((left, right) => {
    const leftId = BigInt(left);
    const rightId = BigInt(right);
    return leftId < rightId ? -1 : leftId > rightId ? 1 : 0;
  });

  let power: LensLabFqcPowerRow[] = [];
  if (powerIds.length) {
    const powerResult = await runBigQuery(
      POWER_QUERY,
      100,
      {
        power_ids: powerIds,
        min_power_id: powerIds[0],
        max_power_id: powerIds[powerIds.length - 1],
      },
      { signal, jobTimeoutMs: LOOKUP_TIMEOUT_MS },
    );
    power = powerResult.rows
      .filter((row) => text(row.right_lens) !== null)
      .map((row): LensLabFqcPowerRow => ({
        order_id: text(row.order_id),
        product_id: text(row.product_id),
        right_lens: text(row.right_lens),
        axis: integer(row.axis),
        sph: number(row.sph),
        lens_height: number(row.lens_height),
        lens_width: number(row.lens_width),
        cyl: number(row.cyl),
        ap: number(row.ap),
        bottom_distance: number(row.bottom_distance),
        edge_distance: number(row.edge_distance),
        effective_dia: number(row.effective_dia),
        lens_index: text(row.lens_index),
        lensname: text(row.lensname),
        lenstype: text(row.lenstype),
        coating: text(row.coating),
        package: text(row.package),
      }));
  }

  const powerOrderIds = [...new Set(
    power.map((row) => row.order_id).filter((value): value is string => Boolean(value)),
  )];
  if (powerOrderIds.length > 1) {
    throw new Error(`BigQuery power rows resolved to ${powerOrderIds.length} order IDs`);
  }

  return {
    fittingId,
    wmsOrderCode,
    orderId: powerOrderIds[0] ?? wmsOrderCode,
    power,
  };
}

export async function fetchLensLabFqcSource(
  fittingId: string,
  requestSignal?: AbortSignal,
): Promise<LensLabFqcSource | null> {
  const cached = sourceCache.get(fittingId);
  if (cached && cached.expiresAt > Date.now()) return cached.source;
  if (cached) sourceCache.delete(fittingId);

  const controller = new AbortController();
  const abortFromRequest = () => controller.abort(requestSignal?.reason);
  if (requestSignal?.aborted) abortFromRequest();
  else requestSignal?.addEventListener('abort', abortFromRequest, { once: true });
  const timeout = setTimeout(
    () => controller.abort(new Error('BigQuery lookup timed out')),
    LOOKUP_TIMEOUT_MS,
  );

  try {
    const source = await querySource(fittingId, controller.signal);
    if (source) remember(fittingId, source);
    return source;
  } finally {
    clearTimeout(timeout);
    requestSignal?.removeEventListener('abort', abortFromRequest);
  }
}
