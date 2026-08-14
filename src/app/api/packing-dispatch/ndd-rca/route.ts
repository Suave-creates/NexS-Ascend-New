// src/app/api/packing-dispatch/ndd-rca/route.ts
//
// Web version of "NDD RCA/App.py" — the control panel that drives the RCA pipeline.
// Instead of a standalone Python HTTP server, this Next.js route shells out to the
// same Fetch.py / Push.py scripts in the "NDD RCA" folder and streams their stdout
// to the browser over Server-Sent Events. All Power BI / Google / openpyxl logic
// stays in Python; this is just the orchestration layer App.py used to be.
//
//   GET ?action=run&step=fetch|push|qcf|excel|all&date=YYYY-MM-DD   -> SSE log stream
//   GET ?action=dac&date=YYYY-MM-DD                                 -> DAC .xlsx download
//   GET ?action=link&date=YYYY-MM-DD                                -> {ok, link} Drive URL
//   GET ?action=default-date                                        -> {date}
//
// EXPORT now uploads the DRCA workbook to Google Drive (Year/Month split) rather than
// saving it locally — see Push.py:export_excel / upload_drca_to_drive.
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { authMiddleware, type AuthenticatedRequest } from '@/middleware/auth';

// Runs live subprocesses + holds DB/Drive creds — never statically cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PY = process.env.NDD_RCA_PYTHON || 'python';
const RCA_DIR = path.join(process.cwd(), 'src', 'app', 'api', 'packing-dispatch', 'ndd-rca', 'NDD-RCA');

// step key -> (label, python argv), mirroring App.py's STEPS.
const STEPS: Record<string, { label: string; argv: string[] }> = {
  fetch: { label: 'FETCH', argv: ['Fetch.py'] },
  push: { label: 'PUSH', argv: ['Push.py', 'both'] },
  qcf: { label: 'QCF', argv: ['Push.py', 'qcf'] },
  excel: { label: 'EXPORT', argv: ['Push.py', 'excel'] },
};
const RUN_ALL = ['fetch', 'push', 'excel']; // QCF left out on purpose (manual QC-fail input)

// One pipeline run at a time, per server process (App.py used a thread lock).
let running = false;

const isValidDate = (d: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));

const pyEnv = (date: string) => ({
  ...process.env,
  NDD_RCA_DATE: date,
  PYTHONUNBUFFERED: '1',
  PYTHONIOENCODING: 'utf-8',
});

type Send = (line: string, tag?: string | null) => void;

// Spawn one step and stream every stdout/stderr line through send(). Resolves to the
// process success (exit code 0). Lines that look like errors are tagged 'err'.
function runStep(argv: string[], date: string, send: Send): Promise<boolean> {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(PY, ['-u', ...argv], { cwd: RCA_DIR, env: pyEnv(date) });
    } catch (e) {
      send(`✗ could not start ${argv.join(' ')}: ${(e as Error).message}`, 'err');
      resolve(false);
      return;
    }
    let buf = '';
    const pump = (chunk: Buffer) => {
      buf += chunk.toString('utf-8');
      let nl: number;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).replace(/\r$/, '');
        buf = buf.slice(nl + 1);
        const low = line.toLowerCase();
        const tag =
          ['error', 'traceback', 'skipped', '✗'].some((w) => low.includes(w))
            ? 'err'
            : null;
        send(line, tag);
      }
    };
    child.stdout.on('data', pump);
    child.stderr.on('data', pump);
    child.on('error', (e) => {
      send(`✗ could not start ${argv.join(' ')}: ${e.message}`, 'err');
      resolve(false);
    });
    child.on('close', (code) => {
      if (buf) send(buf.replace(/\r$/, ''));
      resolve(code === 0);
    });
  });
}

// Collect a short-lived python command's combined output (used by dac / link).
function runOnce(
  argv: string[],
  date: string,
): Promise<{ code: number; out: string }> {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(PY, ['-u', ...argv], { cwd: RCA_DIR, env: pyEnv(date) });
    } catch (e) {
      resolve({ code: -1, out: (e as Error).message });
      return;
    }
    let out = '';
    const grab = (c: Buffer) => (out += c.toString('utf-8'));
    child.stdout.on('data', grab);
    child.stderr.on('data', grab);
    child.on('error', (e) => resolve({ code: -1, out: out + e.message }));
    child.on('close', (code) => resolve({ code: code ?? -1, out }));
  });
}

// ── action: run (SSE) ───────────────────────────────────────────────────────
function streamRun(step: string, date: string): NextResponse {
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send: Send = (line, tag = null) => {
        if (closed) return;
        try {
          controller.enqueue(
            enc.encode(`data: ${JSON.stringify({ line, tag })}\n\n`),
          );
        } catch {
          closed = true;
        }
      };
      const done = () => {
        if (closed) return;
        try {
          controller.enqueue(enc.encode('event: done\ndata: {}\n\n'));
          controller.close();
        } catch {
          /* already gone */
        }
        closed = true;
      };

      if (!isValidDate(date)) {
        send(`✗ Invalid date '${date}' (use YYYY-MM-DD)`, 'err');
        return done();
      }
      if (step !== 'all' && !STEPS[step]) {
        send(`✗ Unknown step '${step}'`, 'err');
        return done();
      }
      if (running) {
        send('✗ A run is already in progress — wait for it to finish.', 'err');
        return done();
      }

      running = true;
      try {
        const keys = step === 'all' ? RUN_ALL : [step];
        let ok = true;
        for (const key of keys) {
          const { label, argv } = STEPS[key];
          send(`\n╔═ ${label}  [${date}] ════════`, 'head');
          ok = await runStep(argv, date, send);
          if (!ok) {
            send(`┗ ${label} stopped (non-zero exit)`, 'err');
            break;
          }
          send(`┗ ${label} done`, 'ok');
        }
        send(ok ? '\n✔ ALL DONE' : '\n✗ STOPPED', ok ? 'ok' : 'err');
      } finally {
        running = false;
        done();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

// ── action: dac (build the Dispatch view workbook and download it) ───────────
async function exportDac(date: string): Promise<NextResponse> {
  if (!isValidDate(date)) {
    return NextResponse.json({ ok: false, msg: `✗ Invalid date '${date}' (use YYYY-MM-DD)` });
  }
  const [y, m, d] = date.split('-');
  const tmp = path.join(os.tmpdir(), `DAC_${d}_${m}_${y}_${Date.now()}.xlsx`);
  const { code, out } = await runOnce(['Push.py', 'dac', date, tmp], date);
  try {
    const data = await fs.readFile(tmp);
    await fs.unlink(tmp).catch(() => {});
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="DAC ${d}_${m}_${y}.xlsx"`,
      },
    });
  } catch {
    await fs.unlink(tmp).catch(() => {});
    return NextResponse.json({
      ok: false,
      msg: `✗ DAC export failed (exit ${code}): ${out.trim().slice(-400)}`,
    });
  }
}

// ── action: link (Drive URL of the exported DRCA workbook) ───────────────────
async function driveLink(date: string): Promise<NextResponse> {
  if (!isValidDate(date)) {
    return NextResponse.json({ ok: false, msg: `✗ Invalid date '${date}' (use YYYY-MM-DD)` });
  }
  const { code, out } = await runOnce(['Push.py', 'link', date], date);
  const last = out.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean).pop() || '';
  if (code === 0 && last && last !== 'NONE') {
    return NextResponse.json({ ok: true, link: last });
  }
  return NextResponse.json({
    ok: false,
    msg:
      last === 'NONE'
        ? 'No export on Drive yet — run EXPORT first.'
        : `✗ link lookup failed: ${out.trim().slice(-400)}`,
  });
}

// today − 2 days (App.py falls back to this when no CSV is present).
function defaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d.toISOString().slice(0, 10);
}

// The browser drives the run/RUN ALL log stream with a native EventSource,
// which cannot attach an Authorization header. So `action=run` can't go
// through authMiddleware's normal Bearer check like every other action here —
// instead the client first mints a short-lived, single-use ticket over a
// regular authenticated apiFetch call (`action=ticket`), then passes that
// ticket on the EventSource URL. The full session JWT never touches a URL.
const TICKET_TTL_MS = 30_000;
const runTickets = new Map<string, { employeeCode: string; expiresAt: number }>();

function mintRunTicket(employeeCode: string): string {
  const ticket = randomUUID();
  runTickets.set(ticket, { employeeCode, expiresAt: Date.now() + TICKET_TTL_MS });
  return ticket;
}

function consumeRunTicket(ticket: string): string | null {
  const entry = runTickets.get(ticket);
  if (!entry) return null;
  runTickets.delete(ticket);
  return Date.now() <= entry.expiresAt ? entry.employeeCode : null;
}

const authedGet = authMiddleware(async (req: AuthenticatedRequest) => {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'run';
  const date = (searchParams.get('date') || '').trim();

  switch (action) {
    case 'dac':
      return exportDac(date);
    case 'link':
      return driveLink(date);
    case 'default-date':
      return NextResponse.json({ date: defaultDate() });
    case 'ticket':
      return NextResponse.json({ ticket: mintRunTicket(req.user.employeeCode) });
    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 404 });
  }
});

export async function GET(req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { searchParams } = new URL(req.url);
  if ((searchParams.get('action') || 'run') === 'run') {
    const employeeCode = consumeRunTicket(searchParams.get('ticket') || '');
    if (!employeeCode) {
      return NextResponse.json({ error: 'Unauthorized', code: 'NO_TOKEN' }, { status: 401 });
    }
    return streamRun(searchParams.get('step') || '', (searchParams.get('date') || '').trim());
  }
  return authedGet(req, ctx);
}
