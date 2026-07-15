import { prismaMetalFrame as prisma } from '@/utils/prismaMetalFrame';
import type { Prisma, TumblingProcessStatus } from '@/generated/metal_frame';
import { parseProducts } from './process.service';
import { PaginatedResult, PaginationParams, ProcessHistoryRowDto } from './types';

export interface ProcessHistoryFilters {
  search?: string;
  stationNumber?: number;
  containerId?: number;
  status?: TumblingProcessStatus;
  operator?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

function buildWhere(filters: ProcessHistoryFilters): Prisma.TumblingProcessWhereInput {
  const where: Prisma.TumblingProcessWhereInput = {};
  if (filters.containerId) where.containerId = filters.containerId;
  if (filters.stationNumber) where.container = { stationNumber: filters.stationNumber };
  if (filters.status) where.status = filters.status;
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {}),
    };
  }
  if (filters.operator) {
    where.OR = [
      { startedByName: { contains: filters.operator } },
      { authorizedByName: { contains: filters.operator } },
    ];
  }
  if (filters.search) {
    const s = filters.search;
    where.OR = [...(where.OR ?? []), { processCode: { contains: s } }, { products: { string_contains: s } }];
  }
  return where;
}

export async function listProcessHistory(
  filters: ProcessHistoryFilters,
  pagination: PaginationParams,
): Promise<PaginatedResult<ProcessHistoryRowDto>> {
  const where = buildWhere(filters);

  const [totalItems, rows] = await Promise.all([
    prisma.tumblingProcess.count({ where }),
    prisma.tumblingProcess.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize,
      include: { container: true },
    }),
  ]);

  const items: ProcessHistoryRowDto[] = rows.map((r) => {
    const actualCompletionAt = r.completedAt ?? r.stoppedAt ?? null;
    return {
      id: r.id,
      processCode: r.processCode,
      stationNumber: r.container.stationNumber,
      containerSide: r.container.side,
      productCount: parseProducts(r.products).length,
      startedAt: r.startedAt?.toISOString() ?? null,
      expectedCompletionAt: r.expectedCompletionAt?.toISOString() ?? null,
      actualCompletionAt: actualCompletionAt?.toISOString() ?? null,
      totalDurationMs: r.startedAt && actualCompletionAt ? actualCompletionAt.getTime() - r.startedAt.getTime() : null,
      status: r.status,
      startedByName: r.startedByName,
      authorizedByName: r.authorizedByName,
      reason: r.reason,
    };
  });

  return {
    items,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pagination.pageSize)),
  };
}
