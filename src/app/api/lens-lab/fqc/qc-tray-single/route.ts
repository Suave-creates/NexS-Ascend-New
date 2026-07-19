// src/app/api/lens-lab/fqc/qc-tray-single/route.ts
//
// SOURCE OF TRUTH for blanks-fqc writes.
// The page only needs to send: fitting_id, both eyes' measurements,
// operator info, and the operator's QC decision. Everything else
// (wms_order_code, order_id, expected powers per eye, lens metadata)
// is looked up here.
//
// Auto-checks SPH / CYL / AXIS / AP against tolerance and returns the
// computed status to the caller (so the UI can show pass/fail per eye).
//
import { NextResponse } from 'next/server';
import type mysql from 'mysql2/promise';
import { prismaLensLab } from '@/utils/prismaLensLab';
import { nexsPool } from '@/utils/nexsPool';

// ── Tolerances ──────────────────────────────────────────────────────
const TOL_SPH  = 0.25;
const TOL_CYL  = 0.25;
const TOL_AXIS = 5;
const TOL_AP   = 0.25;

// ── Types ───────────────────────────────────────────────────────────
type QcStatus = 'PASS' | 'HOLD' | 'FAIL' | 'UNHOLD';
type FailSide = 'LEFT' | 'RIGHT' | 'BOTH';
type EyeKey   = 'right' | 'left';

interface Measurement { sph: number; cyl: number; axis: number; ap: number | null }

interface EyePayload {
  measurements: Measurement;
}

interface SubmitPayload {
  fitting_id:     string;
  operator_id:    string;
  operator_grade: number;             // 1 or 2

  right?:  EyePayload | null;
  left?:   EyePayload | null;

  qc_status:  QcStatus;
  qcf_dept?:  string | null;
  qcf_reason?: string | null;
  fail_side?: FailSide | null;
  remarks?:   string | null;
}

// ── DB shapes ───────────────────────────────────────────────────────
interface OrderRow  { wms_order_code: string; order_id?: string | null }
interface PowerRow  {
  right_lens: string | null;
  sph: any; cyl: any; axis: any; ap: any;
  product_id: string | null;
  lens_index: string | null;
  lensname:   string | null;
  lenstype:   string | null;
  coating:    string | null;
}

// ── Helpers ─────────────────────────────────────────────────────────
function num(v: any): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}
// Coerce to string. mysql2 returns INT/DECIMAL columns as numbers,
// but several blanks-fqc columns (product_id, lens_index, …) are VARCHAR.
// Without this, Prisma rejects the insert with "Expected String, provided Int".
function str(v: any): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}
function within(measured: number, expected: number, tol: number) {
  return Math.abs(measured - expected) <= tol;
}

interface Expected { sph: number | null; cyl: number | null; axis: number | null; ap: number | null }

interface EyeQc {
  status:   'PASS' | 'FAIL';
  failed:   string[];
  expected: Expected;
  measured: Measurement;
}

function evaluateEye(measured: Measurement, expected: Expected): EyeQc {
  const failed: string[] = [];

  if (expected.sph !== null && !within(measured.sph, expected.sph, TOL_SPH))  failed.push('SPH');
  if (expected.cyl !== null && !within(measured.cyl, expected.cyl, TOL_CYL))  failed.push('CYL');

  // Axis only matters when there's actual cyl on either side
  const cylSmall = (Math.abs(expected.cyl ?? 0) < 0.25) && (Math.abs(measured.cyl) < 0.25);
  if (expected.axis !== null && !cylSmall && !within(measured.axis, expected.axis, TOL_AXIS)) failed.push('AXIS');

  // AP — check only when there's a prescribed AP > 0 and the lensmeter sent one
  if (expected.ap !== null && expected.ap > 0 && measured.ap !== null && !within(measured.ap, expected.ap, TOL_AP)) {
    failed.push('AP');
  }

  return {
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    failed,
    expected,
    measured,
  };
}

function eyeMatches(rightLens: string | null, eye: EyeKey): boolean {
  if (!rightLens) return false;
  const v = rightLens.toLowerCase();
  return eye === 'right'
    ? (v === 'r' || v === '1' || v === 'right')
    : (v === 'l' || v === '0' || v === 'left');
}

// ── Order lookup ────────────────────────────────────────────────────
// Tries to fetch both wms_order_code and order_id from order_items.
// If `order_id` column doesn't exist on this DB, falls back to using
// wms_order_code for both (some installs use a single column).
async function fetchOrder(conn: mysql.PoolConnection, fitting_id: string): Promise<OrderRow | null> {
  try {
    const [rows]: any = await conn.query(
      `SELECT wms_order_code, order_id FROM order_items WHERE fitting_id = ? LIMIT 1`,
      [fitting_id],
    );
    if (!rows.length) return null;
    const wms = str(rows[0].wms_order_code);
    const oid = str(rows[0].order_id) ?? wms;
    if (!wms) return null;
    return { wms_order_code: wms, order_id: oid ?? wms };
  } catch {
    const [rows]: any = await conn.query(
      `SELECT wms_order_code FROM order_items WHERE fitting_id = ? LIMIT 1`,
      [fitting_id],
    );
    if (!rows.length) return null;
    const wms = str(rows[0].wms_order_code);
    if (!wms) return null;
    return { wms_order_code: wms, order_id: wms };
  }
}

// ── Validation ──────────────────────────────────────────────────────
function validEye(eye: any): eye is EyePayload {
  if (!eye || typeof eye !== 'object') return false;
  const m = eye.measurements;
  if (!m) return false;
  if (typeof m.sph !== 'number' || typeof m.cyl !== 'number' || typeof m.axis !== 'number') return false;
  if (m.ap !== null && m.ap !== undefined && typeof m.ap !== 'number') return false;
  return true;
}

// ────────────────────────────────────────────────────────────────────
// POST
// ────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;

  try {
    const body = await req.json() as SubmitPayload;

    const {
      fitting_id, operator_id, operator_grade,
      right, left,
      qc_status, qcf_dept, qcf_reason, fail_side, remarks,
    } = body;

    // ── Validate ──────────────────────────────────────────────────
    if (!fitting_id || typeof fitting_id !== 'string') {
      return NextResponse.json({ error: 'fitting_id is required' }, { status: 400 });
    }
    if (!operator_id || (operator_grade !== 1 && operator_grade !== 2)) {
      return NextResponse.json({ error: 'operator_id and operator_grade (1 or 2) are required' }, { status: 400 });
    }
    if (!qc_status || !['PASS', 'HOLD', 'FAIL', 'UNHOLD'].includes(qc_status)) {
      return NextResponse.json({ error: 'qc_status must be PASS, HOLD, FAIL or UNHOLD' }, { status: 400 });
    }
    if ((qc_status === 'HOLD' || qc_status === 'FAIL') && (!qcf_dept || !qcf_reason)) {
      return NextResponse.json({ error: 'qcf_dept and qcf_reason are required when qc_status is HOLD or FAIL' }, { status: 400 });
    }
    if (!right && !left) {
      return NextResponse.json({ error: 'At least one of `right` or `left` must be provided' }, { status: 400 });
    }
    if (right && !validEye(right)) {
      return NextResponse.json({ error: '`right` payload is malformed' }, { status: 400 });
    }
    if (left  && !validEye(left)) {
      return NextResponse.json({ error: '`left` payload is malformed' }, { status: 400 });
    }
    if (fail_side && !['LEFT', 'RIGHT', 'BOTH'].includes(fail_side)) {
      return NextResponse.json({ error: 'fail_side must be LEFT, RIGHT or BOTH' }, { status: 400 });
    }

    // ── DB lookups (everything qc-tray-single needs) ──────────────
    conn = await nexsPool.getConnection();
    await conn.changeUser({ database: 'wms' });

    const order = await fetchOrder(conn, fitting_id);
    if (!order) {
      return NextResponse.json({ error: `No order found for fitting_id ${fitting_id}` }, { status: 404 });
    }

    const [powerRowsRaw]: any = await conn.query(
      `
      SELECT right_lens, sph, cyl, axis, ap,
             product_id, lens_index, lensname, lenstype, coating
      FROM power
      WHERE order_id = ?
      `,
      [order.wms_order_code],
    );
    const powerRows: PowerRow[] = powerRowsRaw;
    if (!powerRows.length) {
      return NextResponse.json({ error: `No power data for order ${order.wms_order_code}` }, { status: 404 });
    }

    const powerRight = powerRows.find(p => eyeMatches(p.right_lens, 'right')) ?? null;
    const powerLeft  = powerRows.find(p => eyeMatches(p.right_lens, 'left'))  ?? null;

    if (right && !powerRight) {
      return NextResponse.json({ error: `No right-eye power for order ${order.wms_order_code}` }, { status: 404 });
    }
    if (left  && !powerLeft) {
      return NextResponse.json({ error: `No left-eye power for order ${order.wms_order_code}` }, { status: 404 });
    }

    const expectedR: Expected | null = powerRight ? { sph: num(powerRight.sph), cyl: num(powerRight.cyl), axis: num(powerRight.axis), ap: num(powerRight.ap) } : null;
    const expectedL: Expected | null = powerLeft  ? { sph: num(powerLeft.sph),  cyl: num(powerLeft.cyl),  axis: num(powerLeft.axis),  ap: num(powerLeft.ap)  } : null;

    // Lens metadata (use whichever eye row has it).
    // ALL these columns are VARCHAR in `blanks-fqc`, but in your `power`
    // table some are numeric — coerce to string so Prisma accepts them.
    const meta = powerRight ?? powerLeft!;
    const product_id = str(meta.product_id);
    const lens_index = str(meta.lens_index);
    const lens_name  = str(meta.lensname);
    const lens_type  = str(meta.lenstype);
    const coating    = str(meta.coating);

    // ── Auto-evaluate ─────────────────────────────────────────────
    const rqc = (right && expectedR) ? evaluateEye(right.measurements, expectedR) : null;
    const lqc = (left  && expectedL) ? evaluateEye(left.measurements,  expectedL) : null;

    // Compute fail_side from auto-check if operator didn't specify
    let computedFailSide: FailSide | null = fail_side ?? null;
    if (!computedFailSide && (rqc?.status === 'FAIL' || lqc?.status === 'FAIL')) {
      const rFail = rqc?.status === 'FAIL';
      const lFail = lqc?.status === 'FAIL';
      computedFailSide = rFail && lFail ? 'BOTH' : rFail ? 'RIGHT' : lFail ? 'LEFT' : null;
    }

    // ── Persist ───────────────────────────────────────────────────
    const created = await  prismaLensLab.blanksFqc.create({
      data: {
        fitting_id,
        wms_order_code: order.wms_order_code,
        order_id:       order.order_id ?? order.wms_order_code,
        product_id,
        operator_id,
        operator_grade,

        right_sph:  expectedR?.sph  ?? null,
        right_cyl:  expectedR?.cyl  ?? null,
        right_axis: expectedR?.axis ?? null,
        right_ap:   expectedR?.ap   ?? null,
        right_pd:   null,                        // not present in `power`; wire up if you have it
        right_lensometer_sph:  right?.measurements.sph  ?? null,
        right_lensometer_cyl:  right?.measurements.cyl  ?? null,
        right_lensometer_axis: right?.measurements.axis ?? null,
        right_lensometer_ap:   right?.measurements.ap   ?? null,

        left_sph:   expectedL?.sph  ?? null,
        left_cyl:   expectedL?.cyl  ?? null,
        left_axis:  expectedL?.axis ?? null,
        left_ap:    expectedL?.ap   ?? null,
        left_pd:    null,
        left_lensometer_sph:   left?.measurements.sph  ?? null,
        left_lensometer_cyl:   left?.measurements.cyl  ?? null,
        left_lensometer_axis:  left?.measurements.axis ?? null,
        left_lensometer_ap:    left?.measurements.ap   ?? null,

        qc_status,
        qcf_dept:   qcf_dept   ?? null,
        qcf_reason: qcf_reason ?? null,
        fail_side:  computedFailSide,

        coating,
        lens_index,
        lens_name,
        lens_type,
        remarks: remarks ?? null,
      } as any,
    });

    return NextResponse.json({
      success:    true,
      record_id:  (created as any).id?.toString?.() ?? null,
      fitting_id,
      qc_status,
      fail_side: computedFailSide,
      right: rqc ? { status: rqc.status, failed: rqc.failed, expected: rqc.expected, measured: rqc.measured } : null,
      left:  lqc ? { status: lqc.status, failed: lqc.failed, expected: lqc.expected, measured: lqc.measured } : null,
    });
  } catch (err: any) {
    console.error('QC ERROR:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 },
    );
  } finally {
    if (conn) conn.release();
  }
}