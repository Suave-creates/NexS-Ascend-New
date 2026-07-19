import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';
import type { Prisma, TumblingProcessStatus } from '@/generated/metal_frame';
import { getTumblingConfig } from './config.service';
import { computeProgress } from './progress.service';
import { appendEvent } from './audit';
import { verifyAuthorization } from './authorization.service';
import {
  AuthorizationInput,
  AuthorizedActor,
  OperatorActor,
  ProcessEventEntry,
  ProductInput,
  TumblingError,
} from './types';

function generateProcessCode(stationNumber: number, side: 'LEFT' | 'RIGHT'): string {
  const stationPart = String(stationNumber).padStart(2, '0');
  const sidePart = side === 'LEFT' ? 'L' : 'R';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TMB-${stationPart}${sidePart}-${ts}-${rand}`;
}

function isUniqueConstraintError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002';
}

function statusConflictMessage(status: TumblingProcessStatus): string {
  switch (status) {
    case 'COMPLETED':
    case 'COMPLETED_EARLY':
      return 'This process has already been completed.';
    case 'STOPPED':
      return 'This process has already been stopped.';
    case 'CANCELLED':
      return 'This process has already been cancelled.';
    case 'DRAFT':
      return 'This process has not been started yet.';
    default:
      return 'This process is not in a valid state for that action.';
  }
}

export function parseProducts(json: unknown): ProductInput[] {
  return Array.isArray(json) ? (json as ProductInput[]) : [];
}

export function parseEvents(json: unknown): ProcessEventEntry[] {
  return Array.isArray(json) ? (json as ProcessEventEntry[]) : [];
}

export const processInclude = { container: true } satisfies Prisma.TumblingProcessInclude;
export type ProcessWithContainer = Prisma.TumblingProcessGetPayload<{ include: typeof processInclude }>;

/**
 * Detects RUNNING processes past their expectedCompletionAt and flips them to
 * COMPLETED. Guards every update with `status: 'RUNNING'` so concurrent or
 * repeated calls never double-fire the completion event — the backend is
 * always the source of truth for completion, never a browser timer.
 */
export async function autoCompleteDueProcesses(now: Date = new Date()): Promise<number> {
  const due = await prisma.tumblingProcess.findMany({
    where: { status: 'RUNNING', expectedCompletionAt: { lte: now } },
    select: { id: true, expectedCompletionAt: true, events: true, products: true },
  });
  if (due.length === 0) return 0;

  let completedCount = 0;
  for (const proc of due) {
    const events = appendEvent(parseEvents(proc.events), {
      type: 'PROCESS_COMPLETED_AUTOMATICALLY',
      metadata: { productsAffected: parseProducts(proc.products).map((p) => p.pid) },
    });
    const result = await prisma.tumblingProcess.updateMany({
      where: { id: proc.id, status: 'RUNNING' },
      data: {
        status: 'COMPLETED',
        completedAt: proc.expectedCompletionAt,
        completionType: 'AUTOMATIC',
        activeSlotContainerId: null,
        events: events as unknown as Prisma.InputJsonValue,
      },
    });
    if (result.count === 1) completedCount++;
  }
  return completedCount;
}

export async function getProcessDetail(processId: number) {
  await autoCompleteDueProcesses();
  const process = await prisma.tumblingProcess.findUnique({ where: { id: processId }, include: processInclude });
  if (!process) throw new TumblingError(404, 'Process not found.');
  return process;
}

export async function createDraftProcess(input: {
  containerId: number;
  product: ProductInput;
  operator: OperatorActor;
}) {
  const container = await prisma.tumblingContainer.findUnique({ where: { id: input.containerId } });
  if (!container) throw new TumblingError(404, 'Container not found.');
  if (!container.isActive) throw new TumblingError(409, 'This container is currently inactive.');

  const config = await getTumblingConfig();
  const events = appendEvent([], {
    type: 'PROCESS_CREATED',
    by: input.operator.name,
    metadata: { pid: input.product.pid },
  });

  for (let attempt = 0; attempt < 3; attempt++) {
    const processCode = generateProcessCode(container.stationNumber, container.side);
    try {
      return await prisma.tumblingProcess.create({
        data: {
          processCode,
          containerId: container.id,
          status: 'DRAFT',
          durationMinutes: config.defaultDurationMinutes,
          activeSlotContainerId: container.id,
          products: [input.product] as unknown as Prisma.InputJsonValue,
          events: events as unknown as Prisma.InputJsonValue,
        },
        include: processInclude,
      });
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        const target = (err as { meta?: { target?: string[] | string } }).meta?.target;
        const targetStr = Array.isArray(target) ? target.join(',') : String(target ?? '');
        if (targetStr.includes('activeSlotContainerId')) {
          throw new TumblingError(409, 'This container already has an active process.');
        }
        if (targetStr.includes('processCode') && attempt < 2) continue; // extremely unlikely — retry with a new code
      }
      throw err;
    }
  }
  throw new TumblingError(500, 'Could not create the process. Please try again.');
}

export async function startProcess(processId: number, operator: OperatorActor) {
  const process = await prisma.tumblingProcess.findUnique({ where: { id: processId } });
  if (!process) throw new TumblingError(404, 'Process not found.');
  if (process.status !== 'DRAFT') throw new TumblingError(409, statusConflictMessage(process.status));

  const products = parseProducts(process.products);
  if (products.length === 0) throw new TumblingError(400, 'A product is required before starting.');

  const now = new Date();
  const expectedCompletionAt = new Date(now.getTime() + process.durationMinutes * 60_000);
  const nextEvents = appendEvent(parseEvents(process.events), {
    type: 'PROCESS_STARTED',
    by: operator.name,
    metadata: { productCount: products.length, expectedCompletionAt: expectedCompletionAt.toISOString() },
  });

  return prisma.tumblingProcess.update({
    where: { id: processId },
    data: {
      status: 'RUNNING',
      startedAt: now,
      expectedCompletionAt,
      startedByName: operator.name,
      events: nextEvents as unknown as Prisma.InputJsonValue,
    },
    include: processInclude,
  });
}

export async function cancelDraftProcess(processId: number, operator: OperatorActor) {
  const process = await prisma.tumblingProcess.findUnique({ where: { id: processId } });
  if (!process) throw new TumblingError(404, 'Process not found.');
  if (process.status !== 'DRAFT') throw new TumblingError(409, statusConflictMessage(process.status));

  const nextEvents = appendEvent(parseEvents(process.events), { type: 'PROCESS_CANCELLED', by: operator.name });

  return prisma.tumblingProcess.update({
    where: { id: processId },
    data: { status: 'CANCELLED', activeSlotContainerId: null, events: nextEvents as unknown as Prisma.InputJsonValue },
    include: processInclude,
  });
}

interface TerminateInput {
  processId: number;
  auth: AuthorizationInput;
  reason: string;
  remarks: string | null;
  operator: OperatorActor;
}

async function terminateRunningProcess(input: TerminateInput, mode: 'EARLY' | 'STOPPED') {
  const actor: AuthorizedActor = await verifyAuthorization(input.auth);

  const process = await prisma.tumblingProcess.findUnique({ where: { id: input.processId } });
  if (!process) throw new TumblingError(404, 'Process not found.');
  if (process.status !== 'RUNNING') throw new TumblingError(409, statusConflictMessage(process.status));
  if (!process.startedAt) throw new TumblingError(409, 'This process has not been started yet.');

  const now = new Date();
  const products = parseProducts(process.products);
  const actualElapsedMs = now.getTime() - process.startedAt.getTime();

  const nextEvents = appendEvent(parseEvents(process.events), {
    type: mode === 'EARLY' ? 'PROCESS_COMPLETED_EARLY' : 'PROCESS_STOPPED',
    by: input.operator.name,
    authorizedBy: actor.nameSnapshot,
    reason: input.reason,
    remarks: input.remarks,
    metadata: {
      originalExpectedCompletionAt: process.expectedCompletionAt?.toISOString() ?? null,
      actualElapsedMs,
      productsAffected: products.map((p) => p.pid),
    },
  });

  return prisma.tumblingProcess.update({
    where: { id: input.processId },
    data: {
      ...(mode === 'EARLY'
        ? { status: 'COMPLETED_EARLY' as const, completedAt: now, completionType: 'EARLY' as const }
        : { status: 'STOPPED' as const, stoppedAt: now, completionType: 'STOPPED' as const }),
      reason: input.reason,
      remarks: input.remarks,
      authorizedByCode: actor.employeeCode,
      authorizedByName: actor.nameSnapshot,
      activeSlotContainerId: null,
      events: nextEvents as unknown as Prisma.InputJsonValue,
    },
    include: processInclude,
  });
}

export const completeProcessEarly = (input: TerminateInput) => terminateRunningProcess(input, 'EARLY');
export const stopProcess = (input: TerminateInput) => terminateRunningProcess(input, 'STOPPED');

export function withProgress(process: ProcessWithContainer, now: Date, nearCompletionThresholdMinutes: number) {
  return {
    ...process,
    products: parseProducts(process.products),
    events: parseEvents(process.events),
    progress: computeProgress({
      status: process.status,
      startedAt: process.startedAt,
      expectedCompletionAt: process.expectedCompletionAt,
      completedAt: process.completedAt,
      stoppedAt: process.stoppedAt,
      durationMinutes: process.durationMinutes,
      now,
      nearCompletionThresholdMinutes,
    }),
  };
}
