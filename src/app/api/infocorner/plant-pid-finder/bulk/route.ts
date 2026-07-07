import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

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

    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'nexs_ims' });

    // Build placeholder string: (?, ?, ?)
    const placeholders = validPids.map(() => '?').join(',');

    const [rows]: any = await conn.execute(
      `
      SELECT 
        pid,
        location,
        barcode
      FROM barcode_item
      WHERE pid IN (${placeholders})
        AND facility = 'NXS1'
        AND \`condition\` = 'GOOD'
        AND status = 'AVAILABLE'
        AND availability = 'AVAILABLE'
        AND location_type <> 'RESERVED'
      GROUP BY pid, location, barcode
      ORDER BY pid, location, barcode
      `,
      validPids
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
  } finally {
    if (conn) conn.release();
  }
}
