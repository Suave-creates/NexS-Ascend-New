// src/app/api/packing-dispatch/auto-release-lock/route.ts
//
// Cross-device auto-release lock / heartbeat for the Tray Releaser.
//
// A tab that is running the auto-release loop POSTs a heartbeat here each cycle.
// Every dashboard polls GET so it can show "auto-release already running on
// {workstation}" and disable its own Start button. A lock is considered STALE
// (i.e. free) if no heartbeat has arrived for LOCK_STALE_MULTIPLIER × interval —
// this covers a tab that crashed or was closed without releasing.
//
//   GET    ?facility=NXS1                      → current holder (or free)
//   POST   { facility, workstation, action }   → 'start' | 'heartbeat' (upsert)
//   DELETE ?facility=&workstation=             → release if owned
//
// Store: data/auto-release-lock.json (single-instance file store, keyed by
// facility). Same pattern as the flash-rules store.

import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FILE = path.join(process.cwd(), 'data', 'auto-release-lock.json');
const STALE_MULTIPLIER = 2;

type Lock = {
  facility: string;
  workstation: string;
  startedAt: string;
  lastHeartbeat: string;
  intervalMinutes: number;
  cycles: number;
  released: number;
};
type Store = { locks: Record<string, Lock> };

async function readStore(): Promise<Store> {
  try {
    const txt = await readFile(FILE, 'utf8');
    const parsed = JSON.parse(txt) as Partial<Store>;
    return { locks: parsed.locks && typeof parsed.locks === 'object' ? parsed.locks : {} };
  } catch {
    return { locks: {} };
  }
}

async function writeStore(store: Store): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(store, null, 2), 'utf8');
}

function isStale(lock: Lock): boolean {
  const hb = Date.parse(lock.lastHeartbeat);
  if (Number.isNaN(hb)) return true;
  const windowMs = Math.max(1, lock.intervalMinutes || 5) * 60000 * STALE_MULTIPLIER;
  return Date.now() - hb > windowMs;
}

function view(lock: Lock | undefined | null) {
  if (!lock) return { active: false, stale: false, lock: null };
  const stale = isStale(lock);
  return { active: !stale, stale, lock };
}

export async function GET(req: Request) {
  const facility = (new URL(req.url).searchParams.get('facility') || '').toUpperCase();
  const store = await readStore();
  const lock = facility ? store.locks[facility] : null;
  return NextResponse.json(
    { facility, ...view(lock), now: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const facility = String(body.facility || '').toUpperCase();
  const workstation = String(body.workstation || '').toUpperCase();
  const action = body.action === 'start' ? 'start' : 'heartbeat';
  if (!facility || !workstation) {
    return NextResponse.json({ error: 'facility and workstation are required' }, { status: 400 });
  }
  const intervalMinutes = Math.max(1, Number(body.intervalMinutes) || 5);
  const cycles = Number(body.cycles) || 0;
  const released = Number(body.released) || 0;

  const store = await readStore();
  const existing = store.locks[facility];
  const nowIso = new Date().toISOString();

  // A live lock held by a DIFFERENT workstation blocks both start and heartbeat.
  if (existing && !isStale(existing) && existing.workstation !== workstation) {
    return NextResponse.json({ ok: false, conflict: true, ...view(existing) }, { status: 409 });
  }

  store.locks[facility] = {
    facility,
    workstation,
    // keep the original start time on heartbeats / same-owner restarts
    startedAt: action === 'start' || !existing ? nowIso : existing.startedAt || nowIso,
    lastHeartbeat: nowIso,
    intervalMinutes,
    cycles,
    released,
  };
  await writeStore(store);
  return NextResponse.json({ ok: true, ...view(store.locks[facility]) });
}

export async function DELETE(req: Request) {
  const sp = new URL(req.url).searchParams;
  const facility = (sp.get('facility') || '').toUpperCase();
  const workstation = (sp.get('workstation') || '').toUpperCase();
  const store = await readStore();
  const existing = store.locks[facility];
  // Only the owning workstation may release it.
  if (existing && existing.workstation === workstation) {
    delete store.locks[facility];
    await writeStore(store);
  }
  return NextResponse.json({ ok: true });
}
