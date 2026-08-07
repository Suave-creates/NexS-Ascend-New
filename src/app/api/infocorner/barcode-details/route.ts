import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

const MAX_LOCATIONS = 100000;
const CHUNK_SIZE = 1000;

export async function POST(req: Request) {
  try {
    const rawText = await req.text();

    if (!rawText || rawText.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Empty input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const barcodes = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (barcodes.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid barcodes found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (barcodes.length > MAX_LOCATIONS) {
      return new Response(JSON.stringify({ error: 'Max 10000 barcodes allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const totalChunks = Math.ceil(barcodes.length / CHUNK_SIZE);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              'CSV_START\npid,barcode,locA,locB,locC,locD,updated_at,status,condition,availability\n'
            )
          );

          for (let i = 0; i < barcodes.length; i += CHUNK_SIZE) {
            const chunk = barcodes.slice(i, i + CHUNK_SIZE);
            const { rows } = await runBigQuery(
              `
              WITH ranked AS (
                SELECT
                  bi.*,
                  ROW_NUMBER() OVER (
                    PARTITION BY bi.barcode
                    ORDER BY bi.updated_at DESC
                  ) AS rn
                FROM \`${BIGQUERY_DATA_PROJECT_ID}.nexs_ims.barcode_item_history\` bi
                WHERE bi.barcode IN UNNEST(@barcodes)
              )
              SELECT 
                  t.pid,
                  t.barcode,

                  MAX(CASE WHEN t.rn = 1 THEN t.location END) AS Latest_Location,
                  MAX(CASE WHEN t.rn = 2 THEN t.location END) AS Second_Latest_Location,
                  MAX(CASE WHEN t.rn = 3 THEN t.location END) AS Third_Latest_Location,
                  MAX(CASE WHEN t.rn = 4 THEN t.location END) AS Fourth_Latest_Location,

                  MAX(CASE WHEN t.rn = 1 THEN t.updated_at END) AS updated_at_latest,
                  MAX(CASE WHEN t.rn = 1 THEN t.status END) AS status,
                  MAX(CASE WHEN t.rn = 1 THEN t.condition END) AS condition,
                  MAX(CASE WHEN t.rn = 1 THEN t.availability END) AS availability

              FROM ranked t
              WHERE t.rn <= 4
              GROUP BY t.pid, t.barcode
              ORDER BY t.barcode
              `,
              10000,
              { barcodes: chunk },
            );

            for (const r of rows) {
              const csv = [
                r.pid,
                r.barcode,
                r.Latest_Location,
                r.Second_Latest_Location,
                r.Third_Latest_Location,
                r.Fourth_Latest_Location,
                r.updated_at_latest,
                r.status,
                r.condition,
                r.availability,
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
    console.error('Bulk query error:', err);
    return new Response(
      JSON.stringify({ error: 'Processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
