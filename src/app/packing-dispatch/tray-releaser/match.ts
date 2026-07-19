// src/app/packing-dispatch/tray-releaser/match.ts
//
// Decision engine — TS port of the extension's src/match.js. Given the tray list
// (from fetchTrays) and the normalised dump (potential incoming UNASSIGNED +
// INVOICED orders), it computes per tray: how many eligible orders could still
// land in it, fill vs MAX_FILL, age, and a SUGGESTION (advisory only).

import { NEXS_CONFIG as cfg, type DumpOrder, type TrayRecord } from './config';
import { cityForStore } from './storeCity';

export const TIER = {
  FULL: 'FULL',
  NO_INCOMING: 'NO_INCOMING',
  WAITING: 'WAITING',
} as const;

export type Tier = (typeof TIER)[keyof typeof TIER];

export type AnnotatedRow = {
  tray: TrayRecord;
  trayId: string;
  storeCode: string;
  /** City for the store, resolved from Store.xlsx mapping (falls back to code). */
  city: string;
  softCourier: string;
  channel: string;
  priority: number | string | null | undefined;
  fill: number;
  capacityLeft: number;
  matchedCount: number;
  eligibleToAdd: number;
  projectedFill: number;
  matchedOrders: DumpOrder[];
  tier: Tier;
  action: 'RELEASE' | 'HOLD';
  reason: string;
  ageMs: number;
  ageLabel: string;
};

export type AnnotateResult = {
  rows: AnnotatedRow[];
  channelField: string | null;
  usedKeys: readonly string[];
  channelAvailable: boolean;
  summary: {
    total: number;
    full: number;
    noIncoming: number;
    waiting: number;
    releaseSuggested: number;
  };
};

/** Normalise a key part: trim + uppercase so casing/whitespace can't split groups. */
function norm(v: unknown): string {
  return String(v == null ? '' : v)
    .trim()
    .toUpperCase();
}

/** Detect which field (if any) on a tray record carries the channel. */
export function detectChannelField(trays: TrayRecord[]): string | null {
  for (const field of cfg.TRAY_CHANNEL_FIELDS) {
    if (
      trays.some(
        (t) => t && t[field] != null && String(t[field]).trim() !== ''
      )
    ) {
      return field;
    }
  }
  return null;
}

/** Read a tray's value for a logical match key. */
function trayValue(
  tray: TrayRecord,
  logicalKey: string,
  channelField: string | null
): unknown {
  if (logicalKey === 'channel') return channelField ? tray[channelField] : '';
  return tray[logicalKey];
}

/** Build composite keys for the dump so trays can look orders up in O(1). */
function indexDump(
  orders: DumpOrder[],
  keys: readonly string[]
): Map<string, DumpOrder[]> {
  const map = new Map<string, DumpOrder[]>();
  for (const o of orders) {
    const k = keys.map((lk) => norm((o as Record<string, unknown>)[lk])).join('||');
    let bucket = map.get(k);
    if (!bucket) map.set(k, (bucket = []));
    bucket.push(o);
  }
  return map;
}

function ageMs(tray: TrayRecord): number {
  const raw = tray[cfg.AGING_FIELD as keyof TrayRecord] as string | undefined;
  const d = raw ? new Date(raw) : null;
  if (!d || isNaN(d.getTime())) return -1; // unknown age sorts as "newest"
  return Date.now() - d.getTime();
}

/** Human-friendly age, e.g. "2d 3h" or "5h 12m" or "12m". */
export function formatAge(ms: number): string {
  if (ms < 0) return '—';
  const mins = Math.floor(ms / 60000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${m}m`;
  return `${m}m`;
}

/** Annotate every tray with match + suggestion info. */
export function annotateTrays(
  trays: TrayRecord[],
  orders: DumpOrder[]
): AnnotateResult {
  const channelField = detectChannelField(trays);
  const channelAvailable = !!channelField;
  const usedKeys = channelAvailable ? cfg.MATCH_KEYS : cfg.MATCH_KEYS_FALLBACK;
  const index = indexDump(orders || [], usedKeys);

  const rows: AnnotatedRow[] = trays.map((tray) => {
    const fill = Number(tray.noOfShipments) || 0;
    const capacityLeft = Math.max(0, cfg.MAX_FILL - fill);

    const key = usedKeys
      .map((lk) => norm(trayValue(tray, lk, channelField)))
      .join('||');
    const matched = index.get(key) || [];
    const matchedCount = matched.length;
    const eligibleToAdd = Math.min(matchedCount, capacityLeft);
    const projectedFill = Math.min(cfg.MAX_FILL, fill + matchedCount);

    let tier: Tier;
    let action: 'RELEASE' | 'HOLD';
    let reason: string;
    if (fill >= cfg.MAX_FILL) {
      tier = TIER.FULL;
      action = 'RELEASE';
      reason = `Full (${fill}/${cfg.MAX_FILL})`;
    } else if (matchedCount === 0) {
      tier = TIER.NO_INCOMING;
      action = 'RELEASE';
      reason = 'No eligible incoming orders';
    } else {
      tier = TIER.WAITING;
      action = 'HOLD';
      reason = `${matchedCount} incoming · capacity ${capacityLeft} → ~${projectedFill}/${cfg.MAX_FILL}`;
    }

    const ms = ageMs(tray);
    return {
      tray,
      trayId: tray.trayId,
      storeCode: tray.storeCode,
      city: cityForStore(tray.storeCode),
      softCourier: tray.softCourier,
      channel: channelField ? String(tray[channelField] ?? '') : '',
      priority: tray.orderPriority,
      fill,
      capacityLeft,
      matchedCount,
      eligibleToAdd,
      projectedFill,
      matchedOrders: matched,
      tier,
      action,
      reason,
      ageMs: ms,
      ageLabel: formatAge(ms),
    };
  });

  const summary = {
    total: rows.length,
    full: rows.filter((r) => r.tier === TIER.FULL).length,
    noIncoming: rows.filter((r) => r.tier === TIER.NO_INCOMING).length,
    waiting: rows.filter((r) => r.tier === TIER.WAITING).length,
    releaseSuggested: rows.filter((r) => r.action === 'RELEASE').length,
  };

  return { rows, channelField, usedKeys, channelAvailable, summary };
}

// ---- Sorting ---------------------------------------------------------------

const TIER_RANK: Record<Tier, number> = {
  [TIER.FULL]: 0,
  [TIER.NO_INCOMING]: 1,
  [TIER.WAITING]: 2,
};

function priorityRank(p: number | string | null | undefined): number {
  const r = cfg.PRIORITY_RANK[Number(p)];
  return r == null ? 99 : r;
}

export type SortKey = { attr: string; reversed: boolean };

type Cmp = (a: AnnotatedRow, b: AnnotatedRow) => number;

/** Build a comparator for an attribute (natural / most-actionable-first order). */
export function comparator(attr: string, reversed = false): Cmp {
  let base: Cmp;
  switch (attr) {
    case 'priority':
      base = (a, b) => priorityRank(a.priority) - priorityRank(b.priority);
      break;
    case 'aging':
      base = (a, b) => b.ageMs - a.ageMs; // oldest first
      break;
    case 'shipments':
      base = (a, b) => b.fill - a.fill;
      break;
    case 'matched':
      base = (a, b) => b.matchedCount - a.matchedCount;
      break;
    case 'projected':
      base = (a, b) => b.projectedFill - a.projectedFill;
      break;
    case 'softCourier':
      base = (a, b) => String(a.softCourier).localeCompare(String(b.softCourier));
      break;
    case 'channel':
      base = (a, b) => String(a.channel).localeCompare(String(b.channel));
      break;
    case 'storeCode':
      base = (a, b) => String(a.storeCode).localeCompare(String(b.storeCode));
      break;
    case 'city':
      base = (a, b) => String(a.city).localeCompare(String(b.city));
      break;
    case 'trayId':
      base = (a, b) => String(a.trayId).localeCompare(String(b.trayId));
      break;
    case 'suggestion':
    default:
      base = (a, b) =>
        TIER_RANK[a.tier] - TIER_RANK[b.tier] ||
        b.ageMs - a.ageMs ||
        priorityRank(a.priority) - priorityRank(b.priority);
  }
  return reversed ? (a, b) => -base(a, b) : base;
}

/** Compose several sort levels into one comparator (stable tray-id tie-break). */
export function multiComparator(keys: SortKey[]): Cmp {
  const levels = (keys && keys.length ? keys : [{ attr: 'suggestion', reversed: false }]).map(
    (k) => comparator(k.attr, k.reversed)
  );
  return (a, b) => {
    for (const cmp of levels) {
      const r = cmp(a, b);
      if (r) return r;
    }
    return String(a.trayId).localeCompare(String(b.trayId));
  };
}
