import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { nexsPool } from '@/utils/nexsPool';

// ─────────────────────────────────────────────────────────────────────────────
// Coercion helpers
// ─────────────────────────────────────────────────────────────────────────────
// mysql2 returns DECIMAL columns as strings. Coerce safely:
//   "5.50"      → 5.5
//   "38 mm"     → 38     (some legacy rows have units appended)
//   ""          → null
//   null/undef  → null
//   NaN         → null
function num(v: any): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}
function int(v: any): number | null {
  const n = num(v);
  return n === null ? null : Math.round(n);
}
function str(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

// ─────────────────────────────────────────────────────────────────────────────
// Order code parsing — kept only to populate the frame_index display field.
// The suffix is no longer used for data lookup; that's done via power_id now.
// ─────────────────────────────────────────────────────────────────────────────
function parseOrderCode(code: string): { base: string; frameIdx: number } {
  const trimmed = String(code).trim();
  const m = trimmed.match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return { base: trimmed, frameIdx: 0 };
  return {
    base:     m[1],
    frameIdx: m[2] ? parseInt(m[2], 10) : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────
// HOW THIS WORKS NOW
// ─────────────────
// `order_items` has a `power_id` column that is the actual foreign key into
// `power.id`. Every fitting has multiple `order_items` rows — one per power
// row that belongs to it (typically 3: 1 marker + 2 lens rows for a single
// frame). We resolve a fitting to its prescription by:
//
//   1. Collecting the power_ids from order_items for this fitting_id
//   2. Fetching those exact rows from `power`
//   3. Dropping the marker row, returning only the lens rows
//
// That's it. No timestamp clustering, no marker-walking, no zero-power /
// skeleton / back-to-back-frame heuristics. Those were all workarounds for
// not having this join key — the schema already had it, we were just
// looking up by `order_id` (which groups all frames in the bundle) instead
// of by the per-fitting `power_id` list.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json();
    const { fitting_id } = body;

    if (!fitting_id || typeof fitting_id !== 'string') {
      return NextResponse.json({ error: 'Invalid fitting_id' }, { status: 400 });
    }

    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    // Pull every order_items row for this fitting — each carries one power_id.
    // wms_order_code is the same on every row; we just take it from the first.
    const [orderRows]: any = await conn.query(
      `SELECT power_id, wms_order_code
         FROM order_items
        WHERE fitting_id = ?`,
      [fitting_id],
    );

    if (!orderRows.length) {
      return NextResponse.json(
        { error: 'No order found for this fitting_id' },
        { status: 404 },
      );
    }

    const wms_order_code = String(orderRows[0].wms_order_code ?? '');
    const { frameIdx }   = parseOrderCode(wms_order_code);

    // Some order_items rows can have a null power_id (e.g. accessory items
    // that don't have a prescription). Drop those.
    const powerIds: any[] = orderRows
      .map((r: any) => r.power_id)
      .filter((id: any) => id !== null && id !== undefined && id !== '');

    let power: any[] = [];

    if (powerIds.length > 0) {
      const placeholders = powerIds.map(() => '?').join(',');
      const [powerRowsRaw]: any = await conn.query(
        `
        SELECT
          id, order_id, product_id, right_lens, axis, sph,
          lens_height, lens_width, cyl, ap, package, lens_package_type,
          bottom_distance, edge_distance, effective_dia,
          lens_index, lensname, lenstype, coating
        FROM power
        WHERE id IN (${placeholders})
        ORDER BY id
        `,
        powerIds,
      );

      // Drop marker rows (right_lens empty) — the page wants only the
      // right/left prescription rows.
      const lensRows = powerRowsRaw.filter((r: any) => str(r.right_lens) !== null);

      power = lensRows.map((r: any) => ({
        order_id:        str(r.order_id),
        product_id:      str(r.product_id),
        right_lens:      str(r.right_lens),
        axis:            int(r.axis),
        sph:             num(r.sph),
        cyl:             num(r.cyl),
        ap:              num(r.ap),
        lens_height:     num(r.lens_height),
        lens_width:      num(r.lens_width),
        bottom_distance: num(r.bottom_distance),
        edge_distance:   num(r.edge_distance),
        effective_dia:   num(r.effective_dia),
        lens_index:      str(r.lens_index),
        lensname:        str(r.lensname),
        lenstype:        str(r.lenstype),
        coating:         str(r.coating),
        package:         str(r.package),
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        fitting_id,
        order_id:    wms_order_code,   // full code (with suffix) for display
        frame_index: frameIdx,         // 0-based suffix index, display only
        power,
      },
    });
  } catch (err: any) {
    console.error('data-call ERROR:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 },
    );
  } finally {
    if (conn) conn.release();
  }
}