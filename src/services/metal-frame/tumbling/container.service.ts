import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';
import { autoCompleteDueProcesses, parseEvents, parseProducts, processInclude } from './process.service';
import { computeProgress } from './progress.service';
import { getTumblingConfig } from './config.service';
import { TumblingError } from './types';

const TOTAL_STATIONS = 22;

let ensureInitPromise: Promise<void> | null = null;

/**
 * Creates any of the 44 containers (22 stations x Left/Right) that are
 * missing. The migration already seeds all 44 on a fresh database — this is
 * a defensive, idempotent belt-and-suspenders check for environments where
 * the migration hasn't run yet. Never touches an existing row.
 */
export async function ensureContainersInitialized(): Promise<void> {
  if (!ensureInitPromise) {
    ensureInitPromise = (async () => {
      const existing = await prisma.tumblingContainer.findMany({ select: { stationNumber: true, side: true } });
      if (existing.length >= TOTAL_STATIONS * 2) return;
      const have = new Set(existing.map((c) => `${c.stationNumber}:${c.side}`));

      for (let n = 1; n <= TOTAL_STATIONS; n++) {
        if (!have.has(`${n}:LEFT`)) {
          await prisma.tumblingContainer.upsert({
            where: { stationNumber_side: { stationNumber: n, side: 'LEFT' } },
            update: {},
            create: { stationNumber: n, side: 'LEFT', displayName: 'Left Container' },
          });
        }
        if (!have.has(`${n}:RIGHT`)) {
          await prisma.tumblingContainer.upsert({
            where: { stationNumber_side: { stationNumber: n, side: 'RIGHT' } },
            update: {},
            create: { stationNumber: n, side: 'RIGHT', displayName: 'Right Container' },
          });
        }
      }
    })().catch((err) => {
      // Allow a future call to retry instead of caching a rejected promise forever.
      ensureInitPromise = null;
      throw err;
    });
  }
  return ensureInitPromise;
}

export async function listContainers() {
  await ensureContainersInitialized();
  return prisma.tumblingContainer.findMany({ orderBy: [{ stationNumber: 'asc' }, { side: 'asc' }] });
}

export async function getContainerById(containerId: number) {
  const container = await prisma.tumblingContainer.findUnique({ where: { id: containerId } });
  if (!container) throw new TumblingError(404, 'Container not found.');
  return container;
}

export async function updateContainer(containerId: number, patch: { displayName?: string; isActive?: boolean }) {
  await getContainerById(containerId);
  return prisma.tumblingContainer.update({
    where: { id: containerId },
    data: {
      ...(patch.displayName !== undefined ? { displayName: patch.displayName } : {}),
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
    },
  });
}

/**
 * Both containers for one station, each with its latest process (full
 * detail, not just a count) — this is only fetched when an operator opens
 * one station's modal, never for all 22 at once.
 */
export async function getStationDetail(stationNumber: number) {
  await ensureContainersInitialized();
  await autoCompleteDueProcesses();

  const containers = await prisma.tumblingContainer.findMany({ where: { stationNumber }, orderBy: { side: 'asc' } });
  if (containers.length === 0) throw new TumblingError(404, 'Station not found.');

  const config = await getTumblingConfig();
  const now = new Date();

  const panels = await Promise.all(
    containers.map(async (container) => {
      const latest = await prisma.tumblingProcess.findFirst({
        where: { containerId: container.id },
        orderBy: { id: 'desc' },
        include: processInclude,
      });
      const isVisible = !!latest && latest.status !== 'CANCELLED';

      return {
        containerId: container.id,
        side: container.side,
        displayName: container.displayName,
        isActive: container.isActive,
        process:
          isVisible && latest
            ? {
                ...latest,
                products: parseProducts(latest.products),
                events: parseEvents(latest.events),
                progress: computeProgress({
                  status: latest.status,
                  startedAt: latest.startedAt,
                  expectedCompletionAt: latest.expectedCompletionAt,
                  completedAt: latest.completedAt,
                  stoppedAt: latest.stoppedAt,
                  durationMinutes: latest.durationMinutes,
                  now,
                  nearCompletionThresholdMinutes: config.nearCompletionThresholdMinutes,
                }),
              }
            : null,
      };
    }),
  );

  const left = panels.find((p) => p.side === 'LEFT')!;
  const right = panels.find((p) => p.side === 'RIGHT')!;

  return { serverTime: now.toISOString(), config, stationNumber, left, right };
}

export async function getContainerDetail(containerId: number) {
  await autoCompleteDueProcesses();
  const container = await getContainerById(containerId);
  const config = await getTumblingConfig();
  const now = new Date();

  const latest = await prisma.tumblingProcess.findFirst({
    where: { containerId },
    orderBy: { id: 'desc' },
    include: processInclude,
  });
  const isVisible = !!latest && latest.status !== 'CANCELLED';

  return {
    serverTime: now.toISOString(),
    container,
    process:
      isVisible && latest
        ? {
            ...latest,
            products: parseProducts(latest.products),
            events: parseEvents(latest.events),
            progress: computeProgress({
              status: latest.status,
              startedAt: latest.startedAt,
              expectedCompletionAt: latest.expectedCompletionAt,
              completedAt: latest.completedAt,
              stoppedAt: latest.stoppedAt,
              durationMinutes: latest.durationMinutes,
              now,
              nearCompletionThresholdMinutes: config.nearCompletionThresholdMinutes,
            }),
          }
        : null,
  };
}
