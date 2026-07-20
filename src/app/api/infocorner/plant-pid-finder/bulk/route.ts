import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export async function POST(req: Request) {
  try {
    const { pids } = await req.json();

    if (!Array.isArray(pids) || pids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'pids must be a non-empty array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate PIDs
    const validPids = pids.filter(
      (p) => typeof p === 'string' && p.trim().length > 0
    );

    if (validPids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid PIDs provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
      GROUP BY pid, location, barcode
      ORDER BY pid, location, barcode
      `,
      10000,
      { pids: validPids },
    );

    /* ===============================
       Build CSV
    ================================ */
    const headers = ['pid', 'location', 'barcode'];
    
    const escape = (v: any) => {
      const s = v === null || v === undefined ? '' : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };

    const csvLines = [
      headers.map(escape).join(','),
      ...rows.map((row: any) =>
        [row.pid, row.location, row.barcode]
          .map(escape)
          .join(',')
      ),
    ].join('\r\n');

    return new Response(csvLines, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="plant-pid-finder-${Date.now()}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Plant PID Finder Bulk Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
