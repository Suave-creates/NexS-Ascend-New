export const METAL_FRAME_QC_STATION_IDS = [
  'QC01',
  'QC02',
  'QC03',
  'QC04',
  'QC05',
  'QC06',
  'QC07',
  'QC08',
  'QC09',
  'QC10',
] as const;

export type MetalFrameQcStationId = (typeof METAL_FRAME_QC_STATION_IDS)[number];

/**
 * Accept legacy spellings during rollout, but always persist one canonical ID.
 */
export function normalizeMetalFrameQcStationId(value: unknown): MetalFrameQcStationId | null {
  if (typeof value !== 'string') return null;

  const compact = value.trim().toUpperCase().replace(/[\s_-]/g, '');
  if (!/^QC\d{1,2}$/.test(compact)) return null;

  const stationNumber = Number(compact.slice(2));
  if (!Number.isInteger(stationNumber) || stationNumber < 1 || stationNumber > 10) return null;

  return `QC${String(stationNumber).padStart(2, '0')}` as MetalFrameQcStationId;
}
