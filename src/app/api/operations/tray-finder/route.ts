// File: src/app/api/operations/tray-finder/route.ts
import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

// ---- Config ----
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100; // hard ceiling for safety
const MAX_TRAY_IDS = 1000; // bulk safety cap

// Load mapping from numeric ID to location name (JSON file)
function loadLocationMap(): Record<number, string> {
  try {
    const mapPath = path.resolve(process.cwd(), 'src/lib/locationMap.json');
    const json = fs.readFileSync(mapPath, 'utf-8');
    return JSON.parse(json);
  } catch (err) {
    console.error('Failed to load location map:', err);
    return {};
  }
}

type Row = {
  trayId: string;
  location: number;
  timestamp: string;
  action: string | null;
};

function normalizeLimit(raw: string | null): number {
  const n = raw ? Number(raw) : DEFAULT_LIMIT;
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(n), MAX_LIMIT);
}

function normalizeTrayId(id: string): string {
  return id.trim().toUpperCase();
}

// -----------------
// GET /api/operations/tray-finder?trayId=CT00000&limit=20
// Single tray: returns { history: [...] }
// -----------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trayId = searchParams.get('trayId');
  const limit = normalizeLimit(searchParams.get('limit'));

  if (!trayId) {
    return NextResponse.json({ error: 'trayId is required' }, { status: 400 });
  }

  const id = normalizeTrayId(trayId);

  try {
    // Last N scan entries (including duplicates), newest first
    const [rows] = await pool.query(
      `
        SELECT
          tray_barcode AS trayId,
          location_id  AS location,
          scan_time    AS timestamp,
          action       AS action
        FROM bosch_cv_db.conveyor_tray_movement
        WHERE tray_barcode = ?
        ORDER BY scan_time DESC
        LIMIT ?
      `,
      [id, limit]
    );

    const typedRows = rows as Row[];
    const locMap = loadLocationMap();
    const history = typedRows.map((r) => ({
      trayId: r.trayId,
      location: r.location,
      locationName: locMap[r.location] ?? `Location ${r.location}`,
      timestamp: r.timestamp,
      action: r.action ?? '',
    }));

    // If no records, return 404 to match your old behavior
    if (history.length === 0) {
      return NextResponse.json({ error: 'Tray not found' }, { status: 404 });
    }

    return NextResponse.json({ history });
  } catch (error: any) {
    console.error('DB error (GET /tray-finder):', error);
    return NextResponse.json(
      { error: 'Failed to fetch tray history' },
      { status: 500 }
    );
  }
}

// -----------------
// POST /api/operations/tray-finder
// Body: { trayIds: string[], limit?: number }
// Returns: { results: Record<trayId, history[]> }
// -----------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const trayIds: unknown = body?.trayIds;
    const limit = normalizeLimit(
      body?.limit !== undefined ? String(body.limit) : null
    );

    if (!Array.isArray(trayIds) || trayIds.length === 0) {
      return NextResponse.json(
        { error: 'trayIds (non-empty array) is required' },
        { status: 400 }
      );
    }

    if (trayIds.length > MAX_TRAY_IDS) {
      return NextResponse.json(
        { error: `Too many trayIds. Max allowed is ${MAX_TRAY_IDS}.` },
        { status: 400 }
      );
    }

    // Normalize & dedupe
    const unique = Array.from(
      new Set(
        trayIds
          .map((t) => (typeof t === 'string' ? normalizeTrayId(t) : ''))
          .filter(Boolean)
      )
    );

    if (unique.length === 0) {
      return NextResponse.json(
        { error: 'No valid trayIds after normalization.' },
        { status: 400 }
      );
    }

    // Build IN (...) placeholders
    const placeholders = unique.map(() => '?').join(',');
    // Use a window function to take last N per tray (MySQL 8+)
    const sql = `
      SELECT trayId, location, timestamp, action
      FROM (
        SELECT
          tray_barcode AS trayId,
          location_id  AS location,
          scan_time    AS timestamp,
          action       AS action,
          ROW_NUMBER() OVER (PARTITION BY tray_barcode ORDER BY scan_time DESC) AS rn
        FROM bosch_cv_db.conveyor_tray_movement
        WHERE tray_barcode IN (${placeholders})
      ) t
      WHERE t.rn <= ?
      ORDER BY trayId, timestamp DESC
    `;

    const params = [...unique, limit];

    const [rows] = await pool.query(sql, params);
    const typed = rows as Row[];

    const locMap = loadLocationMap();
    const results: Record<string, Array<{
      trayId: string;
      location: number;
      locationName: string;
      timestamp: string;
      action: string;
    }>> = {};

    for (const r of typed) {
      if (!results[r.trayId]) results[r.trayId] = [];
      results[r.trayId].push({
        trayId: r.trayId,
        location: r.location,
        locationName: locMap[r.location] ?? `Location ${r.location}`,
        timestamp: r.timestamp,
        action: r.action ?? '',
      });
    }

    // Ensure all requested IDs are present in the object (even if empty)
    for (const id of unique) {
      if (!results[id]) results[id] = [];
    }

    return NextResponse.json({ results, meta: { count: Object.keys(results).length, limit } });
  } catch (error: any) {
    console.error('DB error (POST /tray-finder):', error);
    return NextResponse.json(
      { error: 'Failed to fetch bulk tray history' },
      { status: 500 }
    );
  }
}
