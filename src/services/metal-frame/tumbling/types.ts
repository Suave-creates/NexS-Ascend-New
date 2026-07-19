// Shared types for the Tumbling Process Management plugin. Safe to import
// from both server code (services/API routes) and client components.
import type { TumblingCompletionType, TumblingContainerSide, TumblingProcessStatus } from '@/generated/metal_frame';

export type { TumblingCompletionType, TumblingContainerSide, TumblingProcessStatus };

/** Collapsed, UI-facing status for a container (see dashboard.service.ts). */
export type ContainerDisplayStatus =
  | 'AVAILABLE'
  | 'DRAFT'
  | 'RUNNING'
  | 'COMPLETED'
  | 'STOPPED'
  | 'INACTIVE';

/** Overall station status, ranked by the priority order from the spec. */
export type StationOverallStatus =
  | 'STOPPED'
  | 'RUNNING'
  | 'COMPLETING_SOON'
  | 'DRAFT'
  | 'COMPLETED'
  | 'AVAILABLE'
  | 'INACTIVE';

export interface ProgressResult {
  elapsedMs: number;
  remainingMs: number;
  progressPercent: number;
  isNearCompletion: boolean;
  isOverdue: boolean;
}

/** Shape persisted inside TumblingProcess.products (JSON). */
export interface ProductInput {
  pid: string;
  sheetCode: string;
  modelNumber: string;
  quantity: number;
}

/** Shape persisted inside TumblingProcess.events (JSON) — one immutable timeline entry. */
export interface ProcessEventEntry {
  type: string;
  at: string;
  by?: string | null;
  authorizedBy?: string | null;
  reason?: string | null;
  remarks?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface AuthorizationInput {
  employeeCode: string;
  password: string;
}

export interface AuthorizedActor {
  userId: number;
  employeeCode: string;
  nameSnapshot: string;
}

export interface OperatorActor {
  name: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** A domain-level error carrying the intended HTTP status + user-facing message. */
export class TumblingError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'TumblingError';
  }
}

export interface DashboardContainerSummary {
  containerId: number;
  side: TumblingContainerSide;
  displayName: string;
  isActive: boolean;
  status: ContainerDisplayStatus;
  updatedAt: string;
  activeProcess: {
    id: number;
    processCode: string;
    status: TumblingProcessStatus;
    completionType: TumblingCompletionType | null;
    productCount: number;
    startedAt: string | null;
    expectedCompletionAt: string | null;
    completedAt: string | null;
    stoppedAt: string | null;
    durationMinutes: number;
    progress: ProgressResult;
  } | null;
}

export interface DashboardStationCard {
  stationNumber: number;
  overallStatus: StationOverallStatus;
  updatedAt: string;
  left: DashboardContainerSummary;
  right: DashboardContainerSummary;
}

export interface DashboardSummary {
  totalStations: number;
  runningContainers: number;
  availableContainers: number;
  completingSoon: number;
  completedToday: number;
  stoppedOrInterruptedToday: number;
}

export interface DashboardResponse {
  serverTime: string;
  nearCompletionThresholdMinutes: number;
  summary: DashboardSummary;
  stations: DashboardStationCard[];
}

// ---------------------------------------------------------------------------
// "Wire" DTOs for station/process detail responses — every Date becomes a
// string once it round-trips through NextResponse.json().
// ---------------------------------------------------------------------------
export interface ProcessDetailDto {
  id: number;
  processCode: string;
  containerId: number;
  status: TumblingProcessStatus;
  durationMinutes: number;
  startedAt: string | null;
  expectedCompletionAt: string | null;
  completedAt: string | null;
  stoppedAt: string | null;
  completionType: TumblingCompletionType | null;
  reason: string | null;
  remarks: string | null;
  startedByName: string | null;
  authorizedByName: string | null;
  products: ProductInput[];
  events: ProcessEventEntry[];
  progress: ProgressResult;
}

export interface StationContainerPanelDto {
  containerId: number;
  side: TumblingContainerSide;
  displayName: string;
  isActive: boolean;
  process: ProcessDetailDto | null;
}

export interface TumblingConfigValuesDto {
  defaultDurationMinutes: number;
  nearCompletionThresholdMinutes: number;
}

export interface StationDetailResponse {
  serverTime: string;
  config: TumblingConfigValuesDto;
  stationNumber: number;
  left: StationContainerPanelDto;
  right: StationContainerPanelDto;
}

export interface ProcessHistoryRowDto {
  id: number;
  processCode: string;
  stationNumber: number;
  containerSide: TumblingContainerSide;
  productCount: number;
  startedAt: string | null;
  expectedCompletionAt: string | null;
  actualCompletionAt: string | null;
  totalDurationMs: number | null;
  status: TumblingProcessStatus;
  startedByName: string | null;
  authorizedByName: string | null;
  reason: string | null;
}
