// src/app/api/flash-rules/route.ts
//
// Rules store for the "Flash Watcher" browser extension.
//
//   GET    → returns the current rules document. CORS-open + no-store so the
//            extension's background worker can live-fetch it from any origin.
//   PUT    → replaces the whole rules array (called by the builder UI). Bumps
//            the version and stamps updatedAt.
//   POST   → alias for PUT.
//   OPTIONS → CORS preflight.
//
// Rules are persisted to data/flash-rules.json (no DB migration needed).

import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Rule, RulesDocument } from '@/lib/flashRules';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FILE = path.join(process.cwd(), 'data', 'flash-rules.json');

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function readStore(): Promise<RulesDocument> {
  try {
    const txt = await readFile(FILE, 'utf8');
    const parsed = JSON.parse(txt) as RulesDocument;
    return {
      version: typeof parsed.version === 'number' ? parsed.version : 0,
      updatedAt: parsed.updatedAt ?? null,
      rules: Array.isArray(parsed.rules) ? parsed.rules : [],
    };
  } catch {
    return { version: 0, updatedAt: null, rules: [] };
  }
}

async function writeStore(doc: RulesDocument): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(doc, null, 2), 'utf8');
}

/** Light validation / normalisation so a malformed payload can't poison the store. */
function sanitizeRules(input: unknown): Rule[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .map((r, i) => {
      const flash = (r.flash ?? {}) as Record<string, unknown>;
      return {
        id: typeof r.id === 'string' && r.id ? r.id : `rule_${i}`,
        name: typeof r.name === 'string' ? r.name : `Rule ${i + 1}`,
        enabled: r.enabled !== false,
        urlContains: typeof r.urlContains === 'string' ? r.urlContains : '',
        match: r.match === 'all' ? 'all' : 'any',
        conditions: Array.isArray(r.conditions)
          ? (r.conditions as Record<string, unknown>[]).map((c) => ({
              field: typeof c.field === 'string' ? c.field : '',
              mode: c.mode === 'path' ? 'path' : 'key',
              op: typeof c.op === 'string' ? (c.op as Rule['conditions'][number]['op']) : 'equals',
              value: typeof c.value === 'string' ? c.value : '',
              caseInsensitive: c.caseInsensitive !== false,
            }))
          : [],
        flash: {
          title: typeof flash.title === 'string' ? flash.title : 'Alert',
          message: typeof flash.message === 'string' ? flash.message : '',
          theme: ['siren', 'red', 'blue', 'gold', 'green'].includes(flash.theme as string)
            ? (flash.theme as Rule['flash']['theme'])
            : 'siren',
          durationMs:
            typeof flash.durationMs === 'number' && flash.durationMs >= 0 ? flash.durationMs : 6000,
          sound: flash.sound !== false,
          showMatches: flash.showMatches !== false,
        },
      };
    });
}

export async function GET() {
  const doc = await readStore();
  return NextResponse.json(doc, {
    headers: { ...CORS, 'Cache-Control': 'no-store' },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

async function save(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS });
  }
  const rules = sanitizeRules((body as { rules?: unknown })?.rules ?? body);
  const prev = await readStore();
  const doc: RulesDocument = {
    version: (prev.version || 0) + 1,
    updatedAt: new Date().toISOString(),
    rules,
  };
  await writeStore(doc);
  return NextResponse.json(doc, { headers: CORS });
}

export async function PUT(req: Request) {
  return save(req);
}

export async function POST(req: Request) {
  return save(req);
}
