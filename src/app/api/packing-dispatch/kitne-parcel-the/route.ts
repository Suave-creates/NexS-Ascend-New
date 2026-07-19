// src/api/packing-dispatch/kitne-parcel-the/route.ts
import { nexsPool } from '@/utils/nexsPool';
import mysql from 'mysql2/promise';

const MAX_PARCELS = 100000;
const CHUNK_SIZE = 1000;

type ShipmentRow = Record<string, unknown>;

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const rawText = await req.text();

    if (!rawText || rawText.trim().length === 0) {
      return json(
        {
          error: 'Arre O Sambha! Input toh khaali hai.',
          detail: 'Empty input',
        },
        400,
      );
    }

    // de-dup + clean
    const awbs = Array.from(
      new Set(
        rawText
          .split(/\r?\n|,/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
      ),
    );

    if (awbs.length === 0) {
      return json(
        { error: 'Itna sannata kyun hai bhai? No valid AWBs found.' },
        400,
      );
    }

    if (awbs.length > MAX_PARCELS) {
      return json(
        {
          error: `Bahut zyada hai Sardar! Max ${MAX_PARCELS} allowed, aapne bheje ${awbs.length}.`,
        },
        400,
      );
    }

    conn = await nexsPool.getConnection();
    // The query targets wms.courier_shipment_details directly via fully-qualified name,
    // so no changeUser() is needed here.

    const allRows: ShipmentRow[] = [];

    for (let i = 0; i < awbs.length; i += CHUNK_SIZE) {
      const chunk = awbs.slice(i, i + CHUNK_SIZE);
      const placeholders = chunk.map(() => '?').join(',');
      const sql = `SELECT * FROM wms.courier_shipment_details WHERE master_awb IN (${placeholders})`;
      const [rows] = await conn.query(sql, chunk);
      allRows.push(...(rows as ShipmentRow[]));
    }

    const foundAwbs = new Set(allRows.map((r) => String((r as any).master_awb)));
    const notFound = awbs.filter((a) => !foundAwbs.has(a));

    return json(
      {
        success: true,
        dialogue: pickDialogue(awbs.length, foundAwbs.size, allRows.length),
        summary: {
          requested: awbs.length,
          unique_awbs_found: foundAwbs.size,
          rows_returned: allRows.length,
          not_found: notFound.length,
        },
        rows: allRows,
        not_found: notFound,
      },
      200,
    );
  } catch (err: any) {
    console.error('[kitne-parcel-the] error:', err);
    return json(
      {
        error: 'Tera kya hoga Kalia? Database ne dhoka de diya.',
        detail: err?.message ?? String(err),
      },
      500,
    );
  } finally {
    if (conn) conn.release();
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function pickDialogue(requested: number, uniqueFound: number, rows: number) {
  if (uniqueFound === 0) {
    return 'Itna sannata kyun hai bhai? Ek bhi parcel system mein nahi mila!';
  }
  if (uniqueFound === requested) {
    return `Poore ke poore ${uniqueFound} parcel hazir hain Sardar!`;
  }
  const missing = requested - uniqueFound;
  return `Sardar, ${uniqueFound} parcel mile — ${missing} abhi bhi gaayab hai. (${rows} rows total)`;
}