// QC fail-reason layout config.
//
// The reason layout (labels, hotkeys, "featured" flag, order) is now stored in
// the DB (metal_frame.QcReason) so a supervisor's edit applies to EVERY QC
// station at once — not just one browser. This file holds the shared, pure
// helpers used by both the client (QC page + supervisor panel) and the server
// (auto-seed + validation in /api/qc/reasons). Nothing here touches
// localStorage or `window`, so it is safe to import from a route handler.

export type QcReason = {
  id: string; // stable identifier (DB id as string; temp id for unsaved rows)
  label: string; // shown on the button + stored in DB on a fail
  key: string; // single-char keyboard hotkey (1-9, 0, A-Z)
  featured: boolean; // true => big button on the left
  order: number; // position (lower = first)
};

// Passcode to open the supervisor panel. Change this to lock it down.
// Set to '' to remove the gate entirely. The server also checks it on PUT.
export const SUPERVISOR_CODE: string = '0000';

// Hotkeys, in the order they are auto-assigned: 1-9, then 0, then A..Z.
export const HOTKEY_SEQUENCE: string[] = [
  ...'123456789'.split(''),
  '0',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
];

// Seed list — parsed from the QC reason sheet. The first five are featured
// (big, on the left) by default; everything else is a numbered/lettered chip
// on the right. Everything is editable from the supervisor panel afterwards.
const SEED: { label: string; featured: boolean }[] = [
  { label: 'Temple Loose', featured: true },
  { label: 'Temple Alignment', featured: true },
  { label: 'Pitch Position', featured: true },
  { label: 'Frame Scratch', featured: true },
  { label: 'Tip Damage', featured: true },
  { label: 'Coating peel off', featured: false },
  { label: 'Front sheet Gap', featured: false },
  { label: 'Tip Loose', featured: false },
  { label: 'Lens Damage', featured: false },
  { label: 'Lens Tint', featured: false },
  { label: 'Lens Loose / Tight', featured: false },
  { label: 'Fitting issue', featured: false },
  { label: 'Tip Scratch/Dent', featured: false },
  { label: 'Tip angle', featured: false },
  { label: 'Shape Deform', featured: false },
  { label: 'Rivet Damage', featured: false },
  { label: 'Nosearm Alignment', featured: false },
  { label: 'Printing Damage', featured: false },
  { label: 'Lens pop out', featured: false },
  { label: 'Logo Damage & Orientation', featured: false },
  { label: 'W/O PID', featured: false },
  { label: 'Coating variation', featured: false },
];

// The default layout, shipped to a fresh DB (auto-seed) and used by the
// "Reset to defaults" button in the supervisor panel.
export const DEFAULT_REASONS: QcReason[] = SEED.map((r, i) => ({
  id: `default-${i}`,
  label: r.label,
  key: HOTKEY_SEQUENCE[i] ?? '',
  featured: r.featured,
  order: i,
}));

// The first free hotkey given the keys already in use.
export function nextAvailableHotkey(reasons: { key: string }[]): string {
  const used = new Set(reasons.map((r) => r.key.toUpperCase()).filter(Boolean));
  return HOTKEY_SEQUENCE.find((k) => !used.has(k.toUpperCase())) ?? '';
}
