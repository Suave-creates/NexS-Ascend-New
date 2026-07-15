import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';
import type { TumblingCompletionType, TumblingProcessStatus } from '@/generated/metal_frame';
import { ensureContainersInitialized } from './container.service';
import { autoCompleteDueProcesses, parseProducts } from './process.service';
import { getTumblingConfig } from './config.service';
import { computeProgress } from './progress.service';
import { istTodayRangeUtc } from './timezone';
import {
  ContainerDisplayStatus,
  DashboardContainerSummary,
  DashboardResponse,
  DashboardStationCard,
  StationOverallStatus,
} from './types';

const STATUS_PRIORITY: StationOverallStatus[] = [
  'STOPPED',
  'RUNNING',
  'COMPLETING_SOON',
  'DRAFT',
  'COMPLETED',
  'AVAILABLE',
  'INACTIVE',
];

interface LatestProcessRow {
  id: number;
  containerId: number;
  processCode: string;
  status: TumblingProcessStatus;
  completionType: TumblingCompletionType | null;
  durationMinutes: number;
  startedAt: Date | null;
  expectedCompletionAt: Date | null;
  completedAt: Date | null;
  stoppedAt: Date | null;
  updatedAt: Date;
  products: unknown;
}

function overallStatus(left: StationOverallStatus, right: StationOverallStatus): StationOverallStatus {
  return STATUS_PRIORITY.find((p) => p === left || p === right) ?? 'AVAILABLE';
}

/**
 * Builds one dashboard container summary + its KPI contribution from a
 * container row and (at most) its single most-recent process. Never touches
 * product lists in bulk — only a length count.
 */
function buildContainerSummary(
  container: { id: number; side: 'LEFT' | 'RIGHT'; displayName: string; isActive: boolean; updatedAt: Date },
  latest: LatestProcessRow | undefined,
  now: Date,
  nearCompletionThresholdMinutes: number,
): { summary: DashboardContainerSummary; category: StationOverallStatus } {
  const isActiveProcess = latest && (latest.status === 'DRAFT' || latest.status === 'RUNNING');
  const isTerminalVisible = latest && (latest.status === 'COMPLETED' || latest.status === 'COMPLETED_EARLY' || latest.status === 'STOPPED');

  let status: ContainerDisplayStatus;
  if (isActiveProcess) {
    status = latest!.status as 'DRAFT' | 'RUNNING';
  } else if (!container.isActive) {
    status = 'INACTIVE';
  } else if (isTerminalVisible) {
    status = latest!.status === 'STOPPED' ? 'STOPPED' : 'COMPLETED';
  } else {
    status = 'AVAILABLE';
  }

  const showProcess = isActiveProcess || isTerminalVisible;
  const progress = showProcess
    ? computeProgress({
        status: latest!.status,
        startedAt: latest!.startedAt,
        expectedCompletionAt: latest!.expectedCompletionAt,
        completedAt: latest!.completedAt,
        stoppedAt: latest!.stoppedAt,
        durationMinutes: latest!.durationMinutes,
        now,
        nearCompletionThresholdMinutes,
      })
    : null;

  const category: StationOverallStatus =
    status === 'RUNNING' && progress?.isNearCompletion ? 'COMPLETING_SOON' : status;

  return {
    summary: {
      containerId: container.id,
      side: container.side,
      displayName: container.displayName,
      isActive: container.isActive,
      status,
      updatedAt: (showProcess ? latest!.updatedAt : container.updatedAt).toISOString(),
      activeProcess:
        showProcess && latest
          ? {
              id: latest.id,
              processCode: latest.processCode,
              status: latest.status,
              completionType: latest.completionType ?? null,
              productCount: parseProducts(latest.products).length,
              startedAt: latest.startedAt?.toISOString() ?? null,
              expectedCompletionAt: latest.expectedCompletionAt?.toISOString() ?? null,
              completedAt: latest.completedAt?.toISOString() ?? null,
              stoppedAt: latest.stoppedAt?.toISOString() ?? null,
              durationMinutes: latest.durationMinutes,
              progress: progress!,
            }
          : null,
    },
    category,
  };
}

export async function getDashboard(): Promise<DashboardResponse> {
  await ensureContainersInitialized();
  await autoCompleteDueProcesses();

  const now = new Date();
  const config = await getTumblingConfig();

  const containers = await prisma.tumblingContainer.findMany({ orderBy: [{ stationNumber: 'asc' }, { side: 'asc' }] });
  const containerIds = containers.map((c) => c.id);

  const latestGroups = containerIds.length
    ? await prisma.tumblingProcess.groupBy({ by: ['containerId'], where: { containerId: { in: containerIds } }, _max: { id: true } })
    : [];
  const latestIds = latestGroups.map((g) => g._max.id).filter((id): id is number => id != null);

  const latestProcesses = latestIds.length ? await prisma.tumblingProcess.findMany({ where: { id: { in: latestIds } } }) : [];
  const latestByContainerId = new Map(latestProcesses.map((p) => [p.containerId, p as unknown as LatestProcessRow]));

  const byStation = new Map<number, typeof containers>();
  for (const c of containers) {
    const list = byStation.get(c.stationNumber) ?? [];
    list.push(c);
    byStation.set(c.stationNumber, list);
  }

  const stationCards: DashboardStationCard[] = [];
  let runningContainers = 0;
  let availableContainers = 0;
  let completingSoon = 0;

  for (const stationNumber of [...byStation.keys()].sort((a, b) => a - b)) {
    const [leftContainer, rightContainer] = byStation.get(stationNumber)!.sort((a, b) => (a.side < b.side ? -1 : 1));
    const left = buildContainerSummary(leftContainer, latestByContainerId.get(leftContainer.id), now, config.nearCompletionThresholdMinutes);
    const right = buildContainerSummary(rightContainer, latestByContainerId.get(rightContainer.id), now, config.nearCompletionThresholdMinutes);

    for (const side of [left, right]) {
      if (side.summary.status === 'RUNNING') runningContainers++;
      if (side.summary.status === 'AVAILABLE') availableContainers++;
      if (side.category === 'COMPLETING_SOON') completingSoon++;
    }

    const bothInactive = !leftContainer.isActive && !rightContainer.isActive;
    const combinedStatus = overallStatus(left.category, right.category);

    stationCards.push({
      stationNumber,
      overallStatus: bothInactive && combinedStatus === 'AVAILABLE' ? 'INACTIVE' : combinedStatus,
      updatedAt: [leftContainer.updatedAt, rightContainer.updatedAt].reduce((a, b) => (b > a ? b : a)).toISOString(),
      left: left.summary,
      right: right.summary,
    });
  }

  const { start: todayStart, end: todayEnd } = istTodayRangeUtc(now);
  const [completedToday, stoppedOrInterruptedToday] = await Promise.all([
    prisma.tumblingProcess.count({
      where: { status: { in: ['COMPLETED', 'COMPLETED_EARLY'] }, completedAt: { gte: todayStart, lt: todayEnd } },
    }),
    prisma.tumblingProcess.count({
      where: { status: 'STOPPED', stoppedAt: { gte: todayStart, lt: todayEnd } },
    }),
  ]);

  return {
    serverTime: now.toISOString(),
    nearCompletionThresholdMinutes: config.nearCompletionThresholdMinutes,
    summary: {
      totalStations: byStation.size,
      runningContainers,
      availableContainers,
      completingSoon,
      completedToday,
      stoppedOrInterruptedToday,
    },
    stations: stationCards,
  };
}
