import 'server-only';

import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { NextResponse } from 'next/server';

type DistributionItem = { name: string; count: number };

export type DecantingXlsxMetadata = {
  title: string;
  asOfDate: string;
  windowStart: string;
  windowEnd: string;
  generatedAt: string;
  totalPids: number;
  newPids: number;
  grnMatchedPids: number;
  sourceRows: Record<string, number>;
  warnings: string[];
  decantDistribution: DistributionItem[];
  commentsDistribution: DistributionItem[];
};

export class DecantingExportBusyError extends Error {
  constructor() {
    super('Another Decanting XLSX export is already running. Try again shortly.');
    this.name = 'DecantingExportBusyError';
  }
}

const state = globalThis as typeof globalThis & { decantingXlsxBusy?: boolean };
const SCRIPT_PATH = path.join(
  process.cwd(),
  'src',
  'app',
  'api',
  'stock-in',
  'decanting_xlsx.py',
);
const EXPORT_TIMEOUT_MS = 15 * 60_000;

async function writeChunk(stream: NodeJS.WritableStream, value: string): Promise<void> {
  if (stream.write(value)) return;
  await once(stream, 'drain');
}

async function buildWorkbook<Row>(options: {
  python: string;
  metadata: DecantingXlsxMetadata;
  csvHeader: string;
  csvRow: (row: Row) => string;
  rows: Row[];
  signal?: AbortSignal;
}): Promise<{ directory: string; filePath: string; size: number }> {
  const directory = await mkdtemp(path.join(tmpdir(), 'nexs-decanting-'));
  const filePath = path.join(directory, 'export.xlsx');
  try {
    await new Promise<void>((resolve, reject) => {
      let settled = false;
      let stderr = '';
      const child = spawn(options.python, ['-u', SCRIPT_PATH, filePath], {
        cwd: process.cwd(),
        env: { ...process.env, PYTHONUNBUFFERED: '1', PYTHONIOENCODING: 'utf-8' },
        windowsHide: true,
      });
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        options.signal?.removeEventListener('abort', abort);
        if (error) reject(error);
        else resolve();
      };
      const abort = () => {
        child.kill();
        finish(new Error('The XLSX export was cancelled.'));
      };
      const timeout = setTimeout(() => {
        child.kill();
        finish(new Error('The colored XLSX export exceeded fifteen minutes.'));
      }, EXPORT_TIMEOUT_MS);

      options.signal?.addEventListener('abort', abort, { once: true });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString('utf8');
        if (stderr.length > 64 * 1024) stderr = stderr.slice(-64 * 1024);
      });
      child.on('error', (error) => finish(new Error(`Could not start the XLSX writer: ${error.message}`)));
      child.on('close', (code) => {
        if (code === 0) finish();
        else {
          const detail = stderr.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).at(-1);
          finish(new Error(detail || 'The colored XLSX writer failed.'));
        }
      });

      void (async () => {
        try {
          await writeChunk(child.stdin, `${JSON.stringify(options.metadata)}\n`);
          await writeChunk(child.stdin, `${options.csvHeader}\r\n`);
          for (let index = 0; index < options.rows.length; index += 250) {
            if (options.signal?.aborted) throw new Error('The XLSX export was cancelled.');
            const chunk = options.rows
              .slice(index, index + 250)
              .map(options.csvRow)
              .join('\r\n');
            await writeChunk(child.stdin, `${chunk}\r\n`);
          }
          child.stdin.end();
        } catch (error) {
          child.kill();
          finish(error instanceof Error ? error : new Error('Could not write XLSX input.'));
        }
      })();
    });
    const details = await stat(filePath);
    return { directory, filePath, size: details.size };
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

function streamedFileResponse(
  filePath: string,
  directory: string,
  size: number,
  filename: string,
): NextResponse {
  const source = createReadStream(filePath);
  let cleaned = false;
  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    await rm(directory, { recursive: true, force: true }).catch(() => undefined);
  };
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      source.on('data', (chunk) => {
        const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
        controller.enqueue(new Uint8Array(bytes));
      });
      source.on('end', () => {
        controller.close();
        void cleanup();
      });
      source.on('error', (error) => {
        controller.error(error);
        void cleanup();
      });
    },
    cancel() {
      source.destroy();
      return cleanup();
    },
  });
  return new NextResponse(body, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(size),
      'X-Export-Row-Count': String(0),
    },
  });
}

export async function coloredDecantingXlsxResponse<Row>(options: {
  python: string;
  metadata: DecantingXlsxMetadata;
  csvHeader: string;
  csvRow: (row: Row) => string;
  rows: Row[];
  filename: string;
  signal?: AbortSignal;
}): Promise<NextResponse> {
  if (state.decantingXlsxBusy) throw new DecantingExportBusyError();
  state.decantingXlsxBusy = true;
  try {
    const workbook = await buildWorkbook(options);
    const response = streamedFileResponse(
      workbook.filePath,
      workbook.directory,
      workbook.size,
      options.filename,
    );
    response.headers.set('X-Export-Row-Count', String(options.rows.length));
    return response;
  } finally {
    state.decantingXlsxBusy = false;
  }
}
