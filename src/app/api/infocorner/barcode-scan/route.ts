import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid scan input' },
        { status: 400 }
      );
    }

    // Extract barcode → RIGHT(text, 12)
    const barcode = input.slice(-12);

    const { rows } = await runBigQuery(
      `
      SELECT
        barcode,
        pid,
        location,
        TRIM(UPPER(\`condition\`)) AS \`condition\`,
        TRIM(UPPER(status))       AS status,
        TRIM(UPPER(availability)) AS availability
      FROM \`${BIGQUERY_DATA_PROJECT_ID}.nexs_ims.barcode_item\`
      WHERE barcode = @barcode
      LIMIT 1
      `,
      1,
      { barcode },
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Barcode not found' },
        { status: 404 }
      );
    }

    const record = rows[0] as Record<string, any>;

    // ✅ ONLY ONE GREEN PATH
    const isGood =
      record.condition === 'GOOD' &&
      record.status === 'AVAILABLE' &&
      record.availability === 'AVAILABLE';

    return NextResponse.json(
      {
        row: {
          barcode: record.barcode,
          pid: record.pid,
          location: record.location,
          condition: record.condition,
          status: record.status,
          availability: record.availability,
          status_color: isGood ? 'GREEN' : 'RED',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Barcode Scan API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
