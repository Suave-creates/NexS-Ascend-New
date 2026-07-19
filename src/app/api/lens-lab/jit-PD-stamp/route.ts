import { nexsPool } from '@/utils/nexsPool';
import mysql from 'mysql2/promise';

const MAX_LOCATIONS = 10000;
const CHUNK_SIZE = 2;

function formatDate(val: any): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val ?? '');

  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh   = String(d.getHours()).padStart(2, '0');
  const min  = String(d.getMinutes()).padStart(2, '0');
  const ss   = String(d.getSeconds()).padStart(2, '0');

  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
}

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const rawText = await req.text();

    if (!rawText || rawText.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Empty input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse TSV: each line = "fitting_id\tcutoff_datetime"
    const pairs: { fittingId: string; cutoff: string }[] = rawText
      .split(/[\r\n]/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => {
        const [fittingId, cutoff] = l.split(/\t/);
        return { fittingId: fittingId?.trim(), cutoff: cutoff?.trim() };
      })
      .filter((p) => p.fittingId && p.cutoff);

    if (pairs.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid rows parsed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pairs.length > MAX_LOCATIONS) {
      return new Response(JSON.stringify({ error: 'Max 100,000 rows allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'nexs_ims' });

    const totalChunks = Math.ceil(pairs.length / CHUNK_SIZE);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode('CSV_START\nfitting_id,max_updated_at,rx_status,lk_status\n')
          );

          for (let i = 0; i < pairs.length; i += CHUNK_SIZE) {
            const chunk = pairs.slice(i, i + CHUNK_SIZE);

            // Build: (fitting_id = ? AND updated_at < ?) OR (fitting_id = ? AND updated_at < ?) ...
            const conditions = chunk
              .map(() => '(fitting_id = ? AND updated_at < ?)')
              .join(' OR ');
            const params = chunk.flatMap((p) => [p.fittingId, p.cutoff]);

            const [rows]: any = await conn!.execute(
              `
              SELECT
                fitting_id,
                DATE_FORMAT(MAX(updated_at), '%d-%m-%Y %H:%i:%s') AS max_updated_at,
                rx_status,
                lk_status
              FROM jitdb.jit_order_status_details_aud
              WHERE (${conditions})
                AND lk_status = 'PRODUCTION_DONE'
              GROUP BY fitting_id
              `,
              params
            );

            for (const r of rows) {
              const csv = [
                r.fitting_id,
                r.max_updated_at,  // already formatted by MySQL
                r.rx_status,
                r.lk_status,
              ]
                .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
                .join(',');

              controller.enqueue(encoder.encode(csv + '\n'));
            }

            const chunkIndex = Math.floor(i / CHUNK_SIZE) + 1;
            const percent = Math.round((chunkIndex / totalChunks) * 100);
            controller.enqueue(
              encoder.encode(`PROGRESS:${percent}:${chunkIndex}:${totalChunks}\n`)
            );
          }

          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        } finally {
          if (conn) conn.release();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('Bulk location error:', err);
    if (conn) conn.release();
    return new Response(
      JSON.stringify({ error: 'Processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}