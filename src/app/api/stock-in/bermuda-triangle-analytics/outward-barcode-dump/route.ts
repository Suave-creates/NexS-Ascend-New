import { NextResponse } from 'next/server';
import { loadBermudaTriangleAnalyticsQuery } from '@/lib/server/bermudaTriangleAnalyticsQuery';
import { stockInAnalyticsDestinationByKey } from '@/lib/server/stockInAnalyticsDestinations';
import {
  STOCK_IN_ANALYTICS_TIME_ZONE,
  stockInAnalyticsRange,
  stockInAnalyticsRangeElapsedMinutes,
} from '@/lib/server/stockInAnalyticsRange';
import { runBigQuery } from '@/utils/resources/bigquery/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 900;

const DUMP_MAX_ELAPSED_MINUTES = 7 * 24 * 60;
const DUMP_JOB_TIMEOUT_MS = 10 * 60_000;
const CSV_CHUNK_ROWS = 500;

const CSV_HEADERS = [
  'Direction',
  'Movement Date IST',
  'Movement Time IST',
  'Barcode',
  'PID',
  'Source Facility',
  'Source Location',
  'Outward Facility',
  'Outward Location',
  'Location',
  'Item Type / HSN Classification',
];

/** Quote every value per RFC 4180 and make spreadsheet formula prefixes inert. */
function csvCell(value: unknown) {
  let text = String(value ?? '');
  if (/^[\s=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

/** Force identifiers to spreadsheet text so leading zeros and long digits survive import. */
function csvIdentifierCell(value: unknown) {
  const text = String(value ?? '');
  return csvCell(text ? `'${text}` : '');
}

function csvResponse(rows: Record<string, unknown>[], filename: string, rangeHeaders: HeadersInit) {
  const encoder = new TextEncoder();
  let index = 0;
  let headerPending = true;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      const lines: string[] = [];
      if (headerPending) {
        lines.push(`\uFEFF${CSV_HEADERS.map(csvCell).join(',')}`);
        headerPending = false;
      }
      const end = Math.min(index + CSV_CHUNK_ROWS, rows.length);
      while (index < end) {
        const row = rows[index];
        lines.push([
          csvCell('Outward'),
          csvCell(row.movement_date),
          csvCell(row.movement_time_ist),
          csvIdentifierCell(row.barcode),
          csvIdentifierCell(row.pid),
          csvCell(row.source_facility),
          csvCell(row.source_location),
          csvCell(row.destination_facility),
          csvCell(row.destination_location),
          csvCell(row.output_scope),
          csvCell(row.item_type),
        ].join(','));
        index += 1;
      }
      controller.enqueue(encoder.encode(`${lines.join('\r\n')}\r\n`));
      if (index >= rows.length) controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Content-Type-Options': 'nosniff',
      'X-Row-Count': String(rows.length),
      'X-Time-Zone': STOCK_IN_ANALYTICS_TIME_ZONE,
      ...rangeHeaders,
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedRange = stockInAnalyticsRange(url.searchParams);
  if (!parsedRange.ok) {
    return NextResponse.json({ error: parsedRange.error }, { status: 400 });
  }
  const range = parsedRange.range;
  // SQL includes the selected end minute, so an elapsed value of exactly
  // seven days would query seven days plus one minute.
  if (stockInAnalyticsRangeElapsedMinutes(range) >= DUMP_MAX_ELAPSED_MINUTES) {
    return NextResponse.json(
      { error: 'Outward barcode-level dumps are limited to a maximum elapsed window of 7 days.' },
      { status: 400 },
    );
  }

  const destination = stockInAnalyticsDestinationByKey('bermuda-triangle');
  try {
    const query = await loadBermudaTriangleAnalyticsQuery();
    const { rows } = await runBigQuery(query, 20_000, {
      start_date: range.startDate,
      end_date: range.endDate,
      start_time: range.startTime,
      end_time: range.endTime,
      destination_patterns: destination.locationPatterns,
      destination_facility: destination.facility || '',
      movement_direction: 'outward',
      include_barcode_details: 'true',
    }, {
      signal: request.signal,
      jobTimeoutMs: DUMP_JOB_TIMEOUT_MS,
    });

    const filename = [
      'bermuda-triangle-outward-barcode-dump',
      `${range.startDate}-${range.startTime.replace(':', '')}`,
      'to',
      `${range.endDate}-${range.endTime.replace(':', '')}.csv`,
    ].join('_');
    return csvResponse(rows, filename, {
      'X-Window-Start': `${range.startDate}T${range.startTime}:00+05:30`,
      'X-Window-End': `${range.endDate}T${range.endTime}:59+05:30`,
    });
  } catch (error) {
    if (request.signal.aborted) {
      return NextResponse.json({ error: 'Outward barcode dump request was cancelled.' }, { status: 499 });
    }
    console.error('[stock-in/bermuda-triangle-analytics/outward-barcode-dump] BigQuery failed:', error);
    return NextResponse.json(
      { error: 'Unable to generate the Bermuda Triangle outward barcode-level dump.' },
      { status: 502 },
    );
  }
}
