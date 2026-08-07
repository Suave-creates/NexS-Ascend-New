import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FACILITY_PREFIX = 'NXS1-ASRS-';

function normalizeScan(input: string) {
  const base = input.split('-')[0];
  const toteId = base.slice(0, 12);
  return { toteId, locationPrefix: `${FACILITY_PREFIX}${toteId}%` };
}

export async function POST(req: Request) {
  try {
    const { input } = await req.json();
    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Invalid scan input' }, { status: 400 });
    }

    const { toteId, locationPrefix } = normalizeScan(input);
    const { rows } = await runBigQuery(
      `SELECT pid, barcode, location
       FROM \`${BIGQUERY_DATA_PROJECT_ID}.nexs_ims.barcode_item\`
       WHERE location LIKE @location_prefix`,
      100_000,
      { location_prefix: locationPrefix },
    );

    const partitions: Record<string, { pid: number; barcode: string }[]> = {};
    for (const row of rows) {
      const match = String(row.location || '').match(/_PR(\d+)/);
      if (!match) continue;
      const partition = `PR${match[1]}`;
      partitions[partition] ||= [];
      partitions[partition].push({
        pid: Number(row.pid),
        barcode: String(row.barcode || ''),
      });
    }

    return NextResponse.json({ toteId, partitions, rawCount: rows.length });
  } catch (error) {
    console.error('Tote Scan BigQuery Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
