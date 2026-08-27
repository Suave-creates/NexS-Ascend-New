import { NextResponse } from 'next/server';
import { stockInAnalyticsDestination } from '@/lib/server/stockInAnalyticsDestinations';
import { loadStockInAnalyticsQuery } from '@/lib/server/stockInAnalyticsQuery';
import {
  STOCK_IN_ANALYTICS_TIME_ZONE,
  stockInAnalyticsRange,
} from '@/lib/server/stockInAnalyticsRange';
import { runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 900;

function parseCount(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const destination = stockInAnalyticsDestination(url.pathname);
  const parsedRange = stockInAnalyticsRange(url.searchParams);
  if (!parsedRange.ok) {
    return NextResponse.json({ error: parsedRange.error }, { status: 400 });
  }
  const { startDate, startTime, endDate, endTime } = parsedRange.range;

  try {
    const query = await loadStockInAnalyticsQuery();
    const { rows } = await runBigQuery(query, 20_000, {
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      destination_patterns: destination.locationPatterns,
      destination_facility: destination.facility || '',
      include_input_location: 'false',
      include_barcode_details: 'false',
    });

    const data = rows.map((row) => ({
      date: String(row.movement_date || ''),
      itemType: String(row.item_type || 'Unclassified'),
      inputScope: String(row.input_scope || 'Other'),
      inbound: parseCount(row.new_inbound_to_destination),
      fromEglPl: parseCount(row.count_ever_in_egl_pl),
      direct: parseCount(row.count_never_in_egl_pl),
    }));
    const inputScopes = [...new Set(data.map((row) => row.inputScope))]
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

    return NextResponse.json({
      range: { startDate, startTime, endDate, endTime },
      timeZone: STOCK_IN_ANALYTICS_TIME_ZONE,
      destination: {
        key: destination.key,
        label: destination.label,
        facility: destination.facility || null,
      },
      inputScopes,
      data,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[stock-in/${destination.routeSegment}] BigQuery failed:`, error);
    return NextResponse.json(
      { error: 'Unable to load decanting analytics from BigQuery.' },
      { status: 502 },
    );
  }
}
