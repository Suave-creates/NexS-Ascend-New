export const METAL_FRAME_FITTING_LINE_IDS = [
  'L1',
  'L2',
  'L3',
  'L4',
  'L5',
  'L6',
  'L7',
  'L8',
  'L9',
  'L10',
] as const;

export type MetalFrameFittingLineId = (typeof METAL_FRAME_FITTING_LINE_IDS)[number];

/** Accept common saved aliases, but always persist the established L1-L10 form. */
export function normalizeMetalFrameFittingLineId(value: unknown): MetalFrameFittingLineId | null {
  if (typeof value !== 'string') return null;

  const compact = value.trim().toUpperCase().replace(/[\s_-]/g, '');
  const match = /^(?:L|LINE)?(\d{1,2})$/.exec(compact);
  if (!match) return null;

  const lineNumber = Number(match[1]);
  if (!Number.isInteger(lineNumber) || lineNumber < 1 || lineNumber > 10) return null;

  return `L${lineNumber}` as MetalFrameFittingLineId;
}
