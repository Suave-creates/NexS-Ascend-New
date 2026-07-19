'use client';

// src/app/extensions/rules/page.tsx
//
// Flash Rules builder. Ops define WHICH response fields to watch, under WHICH
// condition, and WHAT full-screen message the extension should flash. Rules are
// saved to /api/flash-rules and the browser extension live-fetches them.

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardBody,
  PageHeader,
  Alert,
  Badge,
} from '@/components/ui';
import { cn } from '@/lib/cn';
import {
  Rule,
  Condition,
  Operator,
  FlashTheme,
  OPERATOR_LABELS,
  THEME_LABELS,
  OPERATORS_NEEDING_VALUE,
  DiscoveredField,
  discoverFields,
  evaluateAll,
  newRule,
  newCondition,
  makeId,
} from '@/lib/flashRules';

/* ── theme palette shared with the extension overlay ─────────────── */
const THEME_BG: Record<FlashTheme, string> = {
  siren: 'linear-gradient(135deg,#7a0d0d,#0b1f6b)',
  red: 'linear-gradient(135deg,#7a0d0d,#c62828)',
  blue: 'linear-gradient(135deg,#0b2a6b,#1565c0)',
  gold: 'linear-gradient(135deg,#7a5c00,#d4af37)',
  green: 'linear-gradient(135deg,#0b5a2a,#2e7d32)',
};

const OPS: Operator[] = [
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'in',
  'notIn',
  'regex',
  'exists',
  'notExists',
  'empty',
  'gt',
  'lt',
];

export default function FlashRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [version, setVersion] = useState<number>(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // sample response + field discovery
  const [sampleText, setSampleText] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [pickerTarget, setPickerTarget] = useState<{ ruleId: string; condIdx: number } | null>(
    null
  );

  const [preview, setPreview] = useState<Rule | null>(null);

  /* ── load ─────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/flash-rules', { cache: 'no-store' });
        const doc = await res.json();
        setRules(Array.isArray(doc.rules) ? doc.rules : []);
        setVersion(doc.version ?? 0);
        setUpdatedAt(doc.updatedAt ?? null);
      } catch {
        setStatus({ msg: 'Failed to load rules', ok: false });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── sample parsing + discovery ───────────────────────────────── */
  const parsedSample = useMemo(() => {
    if (!sampleText.trim()) return null;
    try {
      return JSON.parse(sampleText);
    } catch {
      return undefined; // undefined = parse error, null = empty
    }
  }, [sampleText]);

  const discovered: DiscoveredField[] = useMemo(() => {
    if (!parsedSample) return [];
    const all = discoverFields(parsedSample);
    if (!fieldFilter.trim()) return all.slice(0, 200);
    const f = fieldFilter.trim().toLowerCase();
    return all
      .filter((d) => d.path.toLowerCase().includes(f) || String(d.sample).toLowerCase().includes(f))
      .slice(0, 200);
  }, [parsedSample, fieldFilter]);

  // live test: which rules would fire on the pasted sample
  const sampleMatches = useMemo(() => {
    if (!parsedSample) return [];
    try {
      return evaluateAll(parsedSample, rules);
    } catch {
      return [];
    }
  }, [parsedSample, rules]);

  /* ── mutations ────────────────────────────────────────────────── */
  function patchRule(id: string, patch: Partial<Rule>) {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function patchCondition(ruleId: string, idx: number, patch: Partial<Condition>) {
    setRules((rs) =>
      rs.map((r) =>
        r.id === ruleId
          ? { ...r, conditions: r.conditions.map((c, i) => (i === idx ? { ...c, ...patch } : c)) }
          : r
      )
    );
  }
  function addRule() {
    const r = newRule(makeId(rules.length + Date.parse(updatedAt ?? '2020-01-01') % 100000));
    setRules((rs) => [...rs, r]);
    setSelectedRuleId(r.id);
  }
  function removeRule(id: string) {
    setRules((rs) => rs.filter((r) => r.id !== id));
    if (selectedRuleId === id) setSelectedRuleId(null);
  }
  function addCondition(ruleId: string) {
    setRules((rs) =>
      rs.map((r) => (r.id === ruleId ? { ...r, conditions: [...r.conditions, newCondition()] } : r))
    );
  }
  function removeCondition(ruleId: string, idx: number) {
    setRules((rs) =>
      rs.map((r) =>
        r.id === ruleId ? { ...r, conditions: r.conditions.filter((_, i) => i !== idx) } : r
      )
    );
  }

  function pickField(field: DiscoveredField) {
    if (!pickerTarget) {
      setStatus({ msg: 'Click "pick" on a condition first, then choose a field', ok: false });
      return;
    }
    patchCondition(pickerTarget.ruleId, pickerTarget.condIdx, {
      field: field.key,
      mode: 'key',
    });
    setStatus({ msg: `Set field → ${field.key}`, ok: true });
  }

  /* ── save ─────────────────────────────────────────────────────── */
  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/flash-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });
      const doc = await res.json();
      if (!res.ok) throw new Error(doc?.error || 'Save failed');
      setRules(doc.rules);
      setVersion(doc.version);
      setUpdatedAt(doc.updatedAt);
      setStatus({ msg: `Saved ✓  (v${doc.version})`, ok: true });
    } catch (e) {
      setStatus({ msg: (e as Error).message, ok: false });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Loading rules…</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Flash Rules"
        subtitle={
          <>
            Define which response fields to watch and the full-screen message to flash. The browser
            extension live-fetches these rules.{' '}
            {updatedAt && (
              <span className="text-gray-400">
                Published v{version} · {new Date(updatedAt).toLocaleString()}
              </span>
            )}
          </>
        }
        actions={
          <>
            <a
              href="/extensions"
              className="text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
            >
              ← Extensions
            </a>
            <Button variant="outline" onClick={addRule}>
              + Add rule
            </Button>
            <Button onClick={save} loading={saving}>
              {saving ? 'Saving…' : 'Save & publish'}
            </Button>
          </>
        }
      />

      {status && (
        <Alert tone={status.ok ? 'success' : 'error'}>{status.msg}</Alert>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ── LEFT: rules ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {rules.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
              No rules yet. Click <strong>+ Add rule</strong> to create one.
            </div>
          )}
          {rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onPatch={(p) => patchRule(rule.id, p)}
              onPatchCond={(i, p) => patchCondition(rule.id, i, p)}
              onAddCond={() => addCondition(rule.id)}
              onRemoveCond={(i) => removeCondition(rule.id, i)}
              onRemove={() => removeRule(rule.id)}
              onPickTarget={(i) => setPickerTarget({ ruleId: rule.id, condIdx: i })}
              pickerActive={(i) =>
                pickerTarget?.ruleId === rule.id && pickerTarget?.condIdx === i
              }
              onPreview={() => setPreview(rule)}
              fired={sampleMatches.some((m) => m.rule.id === rule.id)}
              hasSample={!!parsedSample}
            />
          ))}
        </div>

        {/* ── RIGHT: sample + field picker ────────────────────────── */}
        <div className="flex flex-col gap-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-1 text-sm font-semibold text-brand-700">Sample response</div>
              <p className="mb-2 text-xs text-gray-400">
                Paste a scan response to pick fields and live-test which rules fire.
              </p>
              <Textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder='{ "data": { … } }'
                spellCheck={false}
                className="h-32 min-h-[8rem] font-mono text-xs"
              />
              {parsedSample === undefined && (
                <div className="mt-1 text-xs text-danger-600">Not valid JSON</div>
              )}
              {parsedSample && (
                <div className="mt-2 text-xs">
                  {sampleMatches.length > 0 ? (
                    <span className="font-medium text-good-600">
                      {sampleMatches.length} rule(s) would fire:{' '}
                      {sampleMatches.map((m) => m.rule.name).join(', ')}
                    </span>
                  ) : (
                    <span className="text-gray-400">No rules fire on this sample.</span>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {parsedSample && (
            <Card>
              <CardBody className="p-4">
                <div className="mb-1 text-sm font-semibold text-brand-700">
                  Fields{' '}
                  {pickerTarget ? '(click to assign)' : '(click “pick” on a condition first)'}
                </div>
                <Input
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                  placeholder="filter by name or value…"
                  className="mb-2 text-xs"
                />
                <div className="flex max-h-96 flex-col gap-1 overflow-auto">
                  {discovered.map((d) => (
                    <Button
                      key={d.path}
                      variant="ghost"
                      size="sm"
                      onClick={() => pickField(d)}
                      disabled={!pickerTarget}
                      className="h-auto w-full flex-col items-start rounded-lg border border-gray-100 px-2 py-1.5 text-left text-xs font-normal hover:border-brand-300 hover:bg-brand-50"
                      title={d.path}
                    >
                      <span>
                        <span className="font-mono font-semibold text-gray-700">{d.key}</span>
                        <span className="text-gray-400"> = {String(d.sample).slice(0, 40)}</span>
                      </span>
                      <span className="w-full truncate font-mono text-[10px] text-gray-300">
                        {d.path}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {preview && <FlashPreview rule={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Rule card
   ──────────────────────────────────────────────────────────────── */
function RuleCard({
  rule,
  onPatch,
  onPatchCond,
  onAddCond,
  onRemoveCond,
  onRemove,
  onPickTarget,
  pickerActive,
  onPreview,
  fired,
  hasSample,
}: {
  rule: Rule;
  onPatch: (p: Partial<Rule>) => void;
  onPatchCond: (i: number, p: Partial<Condition>) => void;
  onAddCond: () => void;
  onRemoveCond: (i: number) => void;
  onRemove: () => void;
  onPickTarget: (i: number) => void;
  pickerActive: (i: number) => boolean;
  onPreview: () => void;
  fired: boolean;
  hasSample: boolean;
}) {
  return (
    <Card className={cn(fired && 'ring-2 ring-good-600/40')}>
      <CardBody className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={rule.enabled}
            onChange={(e) => onPatch({ enabled: e.target.checked })}
            title="Enabled"
            className="h-4 w-4 accent-brand-700"
          />
          <input
            value={rule.name}
            onChange={(e) => onPatch({ name: e.target.value })}
            className="flex-1 border-b border-transparent bg-transparent font-semibold text-gray-900 outline-none hover:border-gray-200 focus:border-brand-500"
          />
          {hasSample && fired && <Badge tone="good">fires</Badge>}
          <Button variant="ghost" size="sm" onClick={onPreview}>
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-danger-600 hover:bg-danger-50"
          >
            Delete
          </Button>
        </div>

        {/* match mode + url filter */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <label className="flex items-center gap-1.5">
            Match
            <Select
              value={rule.match}
              onChange={(e) => onPatch({ match: e.target.value as 'all' | 'any' })}
              className="w-auto py-1 text-xs"
            >
              <option value="any">ANY condition (OR)</option>
              <option value="all">ALL conditions (AND)</option>
            </Select>
          </label>
          <label className="flex items-center gap-1.5">
            URL contains
            <Input
              value={rule.urlContains ?? ''}
              onChange={(e) => onPatch({ urlContains: e.target.value })}
              placeholder="(any response)"
              className="w-40 py-1 font-mono text-xs"
            />
          </label>
        </div>

        {/* conditions */}
        <div className="flex flex-col gap-2">
          {rule.conditions.map((c, i) => (
            <ConditionRow
              key={i}
              c={c}
              idx={i}
              onPatch={(p) => onPatchCond(i, p)}
              onRemove={() => onRemoveCond(i)}
              onPick={() => onPickTarget(i)}
              picking={pickerActive(i)}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddCond}
            className="mt-1 self-start text-xs font-medium text-brand-700 hover:text-brand-800"
          >
            + add condition
          </Button>
        </div>

        {/* flash config */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs">
          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-medium text-gray-500">Flash title</span>
            <Input
              value={rule.flash.title}
              onChange={(e) => onPatch({ flash: { ...rule.flash, title: e.target.value } })}
              className="py-1.5 font-semibold"
            />
          </label>
          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-medium text-gray-500">Message</span>
            <Textarea
              value={rule.flash.message}
              onChange={(e) => onPatch({ flash: { ...rule.flash, message: e.target.value } })}
              className="h-14 min-h-[3.5rem] py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-500">Theme</span>
            <Select
              value={rule.flash.theme}
              onChange={(e) =>
                onPatch({ flash: { ...rule.flash, theme: e.target.value as FlashTheme } })
              }
              className="py-1.5"
            >
              {(Object.keys(THEME_LABELS) as FlashTheme[]).map((t) => (
                <option key={t} value={t}>
                  {THEME_LABELS[t]}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium text-gray-500">Auto-close (ms, 0 = manual)</span>
            <Input
              type="number"
              min={0}
              value={rule.flash.durationMs}
              onChange={(e) =>
                onPatch({ flash: { ...rule.flash, durationMs: Number(e.target.value) } })
              }
              className="py-1.5"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rule.flash.sound}
              onChange={(e) => onPatch({ flash: { ...rule.flash, sound: e.target.checked } })}
              className="h-4 w-4 accent-brand-700"
            />
            <span className="text-gray-600">Siren sound</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rule.flash.showMatches}
              onChange={(e) => onPatch({ flash: { ...rule.flash, showMatches: e.target.checked } })}
              className="h-4 w-4 accent-brand-700"
            />
            <span className="text-gray-600">Show matched values</span>
          </label>
        </div>
      </CardBody>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────
   Condition row
   ──────────────────────────────────────────────────────────────── */
function ConditionRow({
  c,
  idx,
  onPatch,
  onRemove,
  onPick,
  picking,
}: {
  c: Condition;
  idx: number;
  onPatch: (p: Partial<Condition>) => void;
  onRemove: () => void;
  onPick: () => void;
  picking: boolean;
}) {
  const needsValue = OPERATORS_NEEDING_VALUE.includes(c.op);
  const isList = c.op === 'in' || c.op === 'notIn';
  return (
    <div className="flex flex-wrap items-start gap-1.5 rounded-lg border border-gray-100 bg-gray-50 p-2">
      <span className="mt-2 w-4 text-[10px] text-gray-400">{idx + 1}</span>
      <Select
        value={c.mode}
        onChange={(e) => onPatch({ mode: e.target.value as 'key' | 'path' })}
        className="w-auto py-1.5 text-xs"
        title="key = match anywhere by field name; path = exact dotted path"
      >
        <option value="key">key</option>
        <option value="path">path</option>
      </Select>
      <Input
        value={c.field}
        onChange={(e) => onPatch({ field: e.target.value })}
        placeholder={c.mode === 'key' ? 'FACILITY_CODE' : 'data.x.y'}
        className="min-w-[8rem] flex-1 py-1.5 font-mono text-xs"
      />
      <Button
        variant={picking ? 'primary' : 'outline'}
        size="sm"
        onClick={onPick}
        title="Pick this condition's field from the sample response"
      >
        pick
      </Button>
      <Select
        value={c.op}
        onChange={(e) => onPatch({ op: e.target.value as Operator })}
        className="w-auto py-1.5 text-xs"
      >
        {OPS.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </Select>
      {needsValue &&
        (isList ? (
          <Textarea
            value={c.value ?? ''}
            onChange={(e) => onPatch({ value: e.target.value })}
            placeholder="one per line or comma separated"
            className="h-14 min-h-[3.5rem] w-full py-1.5 font-mono text-xs"
          />
        ) : (
          <Input
            value={c.value ?? ''}
            onChange={(e) => onPatch({ value: e.target.value })}
            placeholder="value"
            className="min-w-[6rem] py-1.5 font-mono text-xs"
          />
        ))}
      <label
        className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500"
        title="Case-insensitive"
      >
        <input
          type="checkbox"
          checked={c.caseInsensitive !== false}
          onChange={(e) => onPatch({ caseInsensitive: e.target.checked })}
          className="h-3.5 w-3.5 accent-brand-700"
        />
        Aa
      </label>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="mt-1.5 text-xs text-danger-600 hover:text-danger-700"
        title="Remove condition"
      >
        ✕
      </Button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Flash preview (mirrors the extension overlay, roughly)
   NOTE: the gradient/theme styling below intentionally mirrors the real
   browser-extension overlay, so these colors are functional (a faithful
   preview) rather than ad-hoc page chrome — kept as inline styles.
   ──────────────────────────────────────────────────────────────── */
function FlashPreview({ rule, onClose }: { rule: Rule; onClose: () => void }) {
  useEffect(() => {
    if (rule.flash.durationMs > 0) {
      const t = setTimeout(onClose, rule.flash.durationMs);
      return () => clearTimeout(t);
    }
  }, [rule, onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8,9,13,0.88)',
        backdropFilter: 'blur(6px)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          background: THEME_BG[rule.flash.theme],
          color: '#fff',
          borderRadius: 24,
          padding: '48px 64px',
          maxWidth: '90vw',
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.8 }}>
          Flash Preview
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, margin: '8px 0', lineHeight: 1.05 }}>
          {rule.flash.title || 'Alert'}
        </div>
        {rule.flash.message && (
          <div style={{ fontSize: 16, opacity: 0.9, maxWidth: 560, margin: '0 auto' }}>
            {rule.flash.message}
          </div>
        )}
        {rule.flash.showMatches && (
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 999,
                padding: '6px 16px',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              matched value(s) shown here
            </span>
          </div>
        )}
        <div style={{ marginTop: 24, fontSize: 13, opacity: 0.7 }}>Click anywhere to dismiss</div>
      </div>
    </div>
  );
}
