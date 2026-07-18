import { NextResponse } from 'next/server';
import {
  BIGQUERY_PROJECT_ID,
  runBigQuery,
} from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function utcDateLabel(daysAgo: number): string {
  const now = new Date();
  const date = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo,
  ));
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('_');
}

const QUERY = `
  SELECT
    oi.facility_code,
    oih.order_item_type,
    COUNT(DISTINCT IF(DATE(oi.created_at) = CURRENT_DATE() - INTERVAL 2 DAY,
      oi.shipping_package_id, NULL)) AS D_2,
    COUNT(DISTINCT IF(DATE(oi.created_at) = CURRENT_DATE() - INTERVAL 1 DAY,
      oi.shipping_package_id, NULL)) AS D_1,
    COUNT(DISTINCT IF(DATE(oi.created_at) = CURRENT_DATE()
      AND oih.order_priority = 1, oi.shipping_package_id, NULL)) AS TODAY
  FROM \`lenskart-datahub.wms.order_items\` oi
  JOIN \`lenskart-datahub.wms.order_item_header\` oih
    ON oi.shipping_package_id = oih.shipping_package_id
  WHERE oi.facility_code IN ('NXS1', 'NXS2')
    AND oi.fitting_type IN ('REQD', 'DONE')
    AND DATE(oi.created_at) BETWEEN CURRENT_DATE() - INTERVAL 2 DAY AND CURRENT_DATE()
    AND oih.order_item_type IN ('JIT', 'REGULAR')
  GROUP BY oi.facility_code, oih.order_item_type
`;

export async function GET() {
  try {
    const result = await runBigQuery(QUERY, 1000);
    return NextResponse.json({
      project: BIGQUERY_PROJECT_ID,
      dates: {
        day_minus_3: utcDateLabel(3),
        day_minus_2: utcDateLabel(2),
        day_minus_1: utcDateLabel(1),
      },
      columns: result.columns,
      row_count: result.rows.length,
      rows: result.rows,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[infocorner/numbers] BigQuery route error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
