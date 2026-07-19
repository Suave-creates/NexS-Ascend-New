// src/lib/flashRules.ts
//
// Shared types + evaluation engine for the "Flash Watcher" rule system.
//
// A Rule watches responses seen by the browser extension. When its conditions
// match, the extension paints a full-screen flash with the configured message.
//
// This module is the single source of truth for the rule SHAPE and the
// matching semantics. The browser extension ships a hand-written mirror of the
// evaluate logic in `public/extensions/nexs-flash-watcher/engine.js` (plain JS,
// no bundler) — keep the two in sync when changing semantics.

export type ConditionMode = 'key' | 'path';

export type Operator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'in'
  | 'notIn'
  | 'regex'
  | 'exists'
  | 'notExists'
  | 'empty'
  | 'gt'
  | 'lt';

export interface Condition {
  /**
   * Field to read from the response.
   * - mode 'key': a key NAME matched anywhere in the JSON tree (e.g. "FACILITY_CODE").
   * - mode 'path': a dotted path from the root (e.g. "data.orderAndEntityTypeResponse.orderDetailsResponse.source").
   *   Use `[]` or `*` for "every element of this array" (e.g. "items[].barcode").
   */
  field: string;
  mode: ConditionMode;
  op: Operator;
  /** For `in`/`notIn` this is a newline/comma separated list. Ignored for exists/notExists/empty. */
  value?: string;
  caseInsensitive?: boolean;
}

export type FlashTheme = 'siren' | 'red' | 'blue' | 'gold' | 'green';

export interface FlashConfig {
  title: string;
  message: string;
  theme: FlashTheme;
  /** Auto-dismiss after this many ms. 0 = stay until dismissed. */
  durationMs: number;
  sound: boolean;
  /** Show the matched field values as chips on the overlay. */
  showMatches: boolean;
}

export interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  /** Only evaluate on responses whose request URL contains this substring. Empty = every response. */
  urlContains?: string;
  /** 'all' = every condition must match (AND). 'any' = at least one (OR). */
  match: 'all' | 'any';
  conditions: Condition[];
  flash: FlashConfig;
}

export interface RulesDocument {
  version: number;
  updatedAt: string | null;
  rules: Rule[];
}

export const OPERATORS_NEEDING_VALUE: Operator[] = [
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'in',
  'notIn',
  'regex',
  'gt',
  'lt',
];

export const OPERATOR_LABELS: Record<Operator, string> = {
  equals: 'equals',
  notEquals: 'does not equal',
  contains: 'contains',
  notContains: 'does not contain',
  in: 'is in list',
  notIn: 'is not in list',
  regex: 'matches regex',
  exists: 'exists',
  notExists: 'does not exist',
  empty: 'is empty',
  gt: 'greater than',
  lt: 'less than',
};

export const THEME_LABELS: Record<FlashTheme, string> = {
  siren: 'Police Siren (red/blue)',
  red: 'Red Alert',
  blue: 'Blue',
  gold: 'Gold',
  green: 'Green',
};

/* ────────────────────────────────────────────────────────────
   Value collection
   ──────────────────────────────────────────────────────────── */

function normKey(k: string): string {
  return String(k).toLowerCase().replace(/[_\s]/g, '');
}

/** Walk the whole tree, collecting every value stored under a key named `field`. */
function collectByKey(node: unknown, wantKey: string, out: unknown[]): void {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) {
    for (const item of node) collectByKey(item, wantKey, out);
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (normKey(k) === wantKey) out.push(v);
      collectByKey(v, wantKey, out);
    }
  }
}

/** Resolve a dotted path, expanding `[]` / `*` array wildcards into every element. */
function collectByPath(node: unknown, segments: string[], out: unknown[]): void {
  if (node === null || node === undefined) return;
  if (segments.length === 0) {
    out.push(node);
    return;
  }
  const [head, ...rest] = segments;
  if (head === '*' || head === '[]') {
    if (Array.isArray(node)) {
      for (const item of node) collectByPath(item, rest, out);
    }
    return;
  }
  if (Array.isArray(node)) {
    // allow numeric index into an array
    const idx = Number(head);
    if (Number.isInteger(idx) && idx >= 0 && idx < node.length) {
      collectByPath(node[idx], rest, out);
    }
    return;
  }
  if (typeof node === 'object') {
    collectByPath((node as Record<string, unknown>)[head], rest, out);
  }
}

function splitPath(path: string): string[] {
  // turns "items[].barcode" / "items[0].barcode" into ["items","[]"/"0","barcode"]
  return path
    .replace(/\[\s*\]/g, '.[].')
    .replace(/\[\s*(\d+)\s*\]/g, '.$1.')
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function collectValues(root: unknown, cond: Condition): unknown[] {
  const out: unknown[] = [];
  if (cond.mode === 'key') {
    collectByKey(root, normKey(cond.field), out);
  } else {
    collectByPath(root, splitPath(cond.field), out);
  }
  return out;
}

/* ────────────────────────────────────────────────────────────
   Operator evaluation
   ──────────────────────────────────────────────────────────── */

function isBlank(v: unknown): boolean {
  return (
    v === null ||
    v === undefined ||
    (typeof v === 'string' && v.trim() === '') ||
    (typeof v === 'string' && v.trim().toLowerCase() === 'null')
  );
}

function scalarText(v: unknown): string | null {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return null;
}

export function parseList(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function cmp(a: string, b: string, ci: boolean): boolean {
  return ci ? a.toLowerCase() === b.toLowerCase() : a === b;
}

/**
 * Evaluate one condition against a response tree.
 * Returns the list of matched (triggering) values — empty array means "no match".
 */
export function evaluateCondition(root: unknown, cond: Condition): unknown[] {
  const found = collectValues(root, cond);
  const ci = cond.caseInsensitive !== false; // default case-insensitive
  const target = cond.value ?? '';
  const list = parseList(target);

  switch (cond.op) {
    case 'exists':
      return found.some((v) => !isBlank(v)) ? found.filter((v) => !isBlank(v)) : [];
    case 'notExists':
      // matches when NOTHING (non-blank) was found
      return found.every((v) => isBlank(v)) ? ['(absent)'] : [];
    case 'empty':
      return found.length > 0 && found.every((v) => isBlank(v)) ? found : [];
    default:
      break;
  }

  const texts = found
    .map((v) => ({ raw: v, txt: scalarText(v) }))
    .filter((x) => x.txt !== null) as { raw: unknown; txt: string }[];

  const hits: unknown[] = [];
  for (const { raw, txt } of texts) {
    const t = txt.trim();
    switch (cond.op) {
      case 'equals':
        if (cmp(t, target.trim(), ci)) hits.push(raw);
        break;
      case 'notEquals':
        // handled after loop
        break;
      case 'contains':
        if (ci ? t.toLowerCase().includes(target.trim().toLowerCase()) : t.includes(target.trim()))
          hits.push(raw);
        break;
      case 'notContains':
        break;
      case 'in':
        if (list.some((item) => cmp(t, item, ci))) hits.push(raw);
        break;
      case 'notIn':
        break;
      case 'regex':
        try {
          if (new RegExp(target, ci ? 'i' : '').test(t)) hits.push(raw);
        } catch {
          /* invalid regex → no match */
        }
        break;
      case 'gt':
        if (!Number.isNaN(Number(t)) && Number(t) > Number(target)) hits.push(raw);
        break;
      case 'lt':
        if (!Number.isNaN(Number(t)) && Number(t) < Number(target)) hits.push(raw);
        break;
    }
  }

  // Negative operators: match when NO collected value violates the constraint,
  // and at least one value was present to check.
  if (cond.op === 'notEquals' || cond.op === 'notContains' || cond.op === 'notIn') {
    if (texts.length === 0) return [];
    const violated = texts.some(({ txt }) => {
      const t = txt.trim();
      if (cond.op === 'notEquals') return cmp(t, target.trim(), ci);
      if (cond.op === 'notContains')
        return ci ? t.toLowerCase().includes(target.trim().toLowerCase()) : t.includes(target.trim());
      return list.some((item) => cmp(t, item, ci)); // notIn
    });
    return violated ? [] : texts.map((x) => x.raw);
  }

  return hits;
}

export interface RuleMatch {
  rule: Rule;
  matchedValues: { field: string; value: string }[];
}

/** Evaluate a rule against a response. Returns a match (with triggering values) or null. */
export function evaluateRule(root: unknown, rule: Rule, url?: string): RuleMatch | null {
  if (!rule.enabled) return null;
  if (rule.urlContains && url && !url.includes(rule.urlContains)) return null;
  if (!rule.conditions || rule.conditions.length === 0) return null;

  const perCondition = rule.conditions.map((c) => ({
    cond: c,
    hits: evaluateCondition(root, c),
  }));

  const matchedCount = perCondition.filter((p) => p.hits.length > 0).length;
  const passed =
    rule.match === 'all' ? matchedCount === rule.conditions.length : matchedCount > 0;

  if (!passed) return null;

  const matchedValues: { field: string; value: string }[] = [];
  for (const p of perCondition) {
    for (const v of p.hits) {
      const txt = scalarText(v) ?? String(v);
      matchedValues.push({ field: p.cond.field, value: txt });
    }
  }
  return { rule, matchedValues };
}

/** Evaluate all rules; returns every rule that matched. */
export function evaluateAll(root: unknown, rules: Rule[], url?: string): RuleMatch[] {
  const out: RuleMatch[] = [];
  for (const rule of rules) {
    const m = evaluateRule(root, rule, url);
    if (m) out.push(m);
  }
  return out;
}

/* ────────────────────────────────────────────────────────────
   Field discovery — used by the builder's "pick a field" helper
   ──────────────────────────────────────────────────────────── */

export interface DiscoveredField {
  key: string; // leaf key name
  path: string; // dotted path (arrays collapsed to [])
  sample: string; // a sample value
}

export function discoverFields(root: unknown, limit = 400): DiscoveredField[] {
  const byPath = new Map<string, DiscoveredField>();

  function walk(node: unknown, path: string) {
    if (byPath.size >= limit) return;
    if (node === null || node === undefined) return;
    if (Array.isArray(node)) {
      // collapse array index into []
      for (const item of node) walk(item, path ? `${path}[]` : '[]');
      return;
    }
    if (typeof node === 'object') {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        const childPath = path ? `${path}.${k}` : k;
        if (typeof v === 'object' && v !== null) {
          walk(v, childPath);
        } else {
          if (!byPath.has(childPath)) {
            byPath.set(childPath, {
              key: k,
              path: childPath,
              sample: v === null ? 'null' : String(v),
            });
          }
        }
      }
    }
  }

  walk(root, '');
  return Array.from(byPath.values());
}

/* ────────────────────────────────────────────────────────────
   Defaults / factories
   ──────────────────────────────────────────────────────────── */

export function newCondition(): Condition {
  return { field: '', mode: 'key', op: 'equals', value: '', caseInsensitive: true };
}

export function newRule(id: string): Rule {
  return {
    id,
    name: 'New rule',
    enabled: true,
    urlContains: '',
    match: 'any',
    conditions: [newCondition()],
    flash: {
      title: 'Alert',
      message: '',
      theme: 'siren',
      durationMs: 6000,
      sound: true,
      showMatches: true,
    },
  };
}

export function makeId(seed: number): string {
  return `rule_${seed.toString(36)}_${(seed * 2654435761 % 1e9).toString(36)}`;
}
