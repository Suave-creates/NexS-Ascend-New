import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { pid, pids, download } = body;

    /* ================= NORMALIZE INPUT ================= */

    if (pid && typeof pid === 'string') {
      pids = [pid];
    }

    if (!Array.isArray(pids) || pids.length === 0) {
      return NextResponse.json(
        { error: 'Provide pid or pids[]' },
        { status: 400 }
      );
    }

    if (pids.length > 50) {
      return NextResponse.json(
        { error: 'Max 50 PIDs allowed' },
        { status: 400 }
      );
    }

    const { rows } = await runBigQuery(
      `
      SELECT 
        pid,
        location,
        barcode
      FROM \`${BIGQUERY_DATA_PROJECT_ID}.nexs_ims.barcode_item\`
      WHERE CAST(pid AS STRING) IN UNNEST(@pids)
        AND facility = 'NXS1'
        AND \`condition\` = 'GOOD'
        AND status = 'AVAILABLE'
        AND availability = 'AVAILABLE'
        AND location_type <> 'RESERVED'
      ORDER BY pid, location
      `,
      10000,
      { pids: pids.map(String) },
    );

    /* ================= CSV MODE ================= */

    if (download) {
      let csv = 'pid,location,barcode\n';

      for (const r of rows) {
        csv += [r.pid, r.location, r.barcode]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(',') + '\n';
      }

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="inventory.csv"',
        },
      });
    }

    /* ================= JSON ================= */

    return NextResponse.json({
      rows,
      totalRows: rows.length,
    });

  } catch (error) {
    console.error('Inventory API Error:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
