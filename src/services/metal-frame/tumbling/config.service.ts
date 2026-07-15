import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';

export interface TumblingConfigValues {
  defaultDurationMinutes: number;
  nearCompletionThresholdMinutes: number;
}

const ROW_ID = 1;
const CACHE_TTL_MS = 30_000;
let cache: { values: TumblingConfigValues; expiresAt: number } | null = null;

/** Reads the single configuration row, creating it with defaults on first use. Cached briefly since the dashboard polls frequently. */
export async function getTumblingConfig(): Promise<TumblingConfigValues> {
  if (cache && cache.expiresAt > Date.now()) return cache.values;

  const row = await prisma.tumblingConfiguration.upsert({
    where: { id: ROW_ID },
    update: {},
    create: { id: ROW_ID },
  });

  const values: TumblingConfigValues = {
    defaultDurationMinutes: row.defaultDurationMinutes,
    nearCompletionThresholdMinutes: row.nearCompletionThresholdMinutes,
  };
  cache = { values, expiresAt: Date.now() + CACHE_TTL_MS };
  return values;
}

export function invalidateTumblingConfigCache(): void {
  cache = null;
}

/** Applies partial updates. Does not touch historical process durationMinutes snapshots. */
export async function updateTumblingConfig(patch: Partial<TumblingConfigValues>): Promise<TumblingConfigValues> {
  await prisma.tumblingConfiguration.upsert({
    where: { id: ROW_ID },
    update: patch,
    create: { id: ROW_ID, ...patch },
  });

  invalidateTumblingConfigCache();
  return getTumblingConfig();
}
