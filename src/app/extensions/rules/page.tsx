'use client';

// src/app/extensions/rules/page.tsx
//
// Flash Rules builder. Ops define WHICH response fields to watch, under WHICH
// condition, and WHAT full-screen message the extension should flash. Rules are
// saved to /api/flash-rules and the browser extension live-fetches them.

import { useEffect, useMemo, useState } from 'react';
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
    <div className="flash-rules-page max-w-6xl mx-auto py-6">
      {/* keep form-control text black regardless of OS dark mode */}
      <style>{`
        .flash-rules-page input,
        .flash-rules-page textarea,
        .flash-rules-page select {
          color: #111827;
        }
        .flash-rules-page input::placeholder,
        .flash-rules-page textarea::placeholder {
          color: #9ca3af;
        }
      `}</style>
      {/* header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-800">Flash Rules</h1>
        <div className="flex items-center gap-3">
          <a href="/extensions" className="text-sm text-blue-600 hover:underline">
            ← Extensions
          </a>
          <button
            onClick={addRule}
            className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg"
          >
            + Add rule
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
          >
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-4">
        Define which response fields to watch and the full-screen message to flash. The browser
        extension live-fetches these rules.{' '}
        {updatedAt && (
          <span className="text-gray-400">
            Published v{version} · {new Date(updatedAt).toLocaleString()}
          </span>
        )}
      </p>
      {status && (
        <div
          className={`mb-4 text-sm font-medium px-3 py-2 rounded-lg ${
            status.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: rules ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {rules.length === 0 && (
            <div className="text-gray-400 text-sm border border-dashed border-gray-300 rounded-xl p-8 text-center">
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
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="font-semibold text-gray-800 mb-1 text-sm">Sample response</div>
            <p className="text-xs text-gray-400 mb-2">
              Paste a scan response to pick fields and live-test which rules fire.
            </p>
            <textarea
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder='{ "data": { … } }'
              spellCheck={false}
              className="w-full h-32 text-xs font-mono border border-gray-200 rounded-lg p-2 resize-y"
            />
            {parsedSample === undefined && (
              <div className="text-xs text-red-600 mt-1">Not valid JSON</div>
            )}
            {parsedSample && (
              <div className="text-xs mt-2">
                {sampleMatches.length > 0 ? (
                  <span className="text-green-700 font-medium">
                    {sampleMatches.length} rule(s) would fire:{' '}
                    {sampleMatches.map((m) => m.rule.name).join(', ')}
                  </span>
                ) : (
                  <span className="text-gray-400">No rules fire on this sample.</span>
                )}
              </div>
            )}
          </div>

          {parsedSample && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="font-semibold text-gray-800 mb-1 text-sm">
                Fields {pickerTarget ? '(click to assign)' : '(click “pick” on a condition first)'}
              </div>
              <input
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                placeholder="filter by name or value…"
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 mb-2"
              />
              <div className="max-h-96 overflow-auto flex flex-col gap-1">
                {discovered.map((d) => (
                  <button
                    key={d.path}
                    onClick={() => pickField(d)}
                    disabled={!pickerTarget}
                    className="text-left text-xs px-2 py-1.5 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={d.path}
                  >
                    <span className="font-mono font-semibold text-gray-700">{d.key}</span>
                    <span className="text-gray-400"> = {String(d.sample).slice(0, 40)}</span>
                    <div className="font-mono text-[10px] text-gray-300 truncate">{d.path}</div>
                  </button>
                ))}
              </div>
            </div>
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
    <div
      className={`bg-white border rounded-xl p-4 shadow-sm ${
        fired ? 'border-green-400 ring-1 ring-green-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={rule.enabled}
          onChange={(e) => onPatch({ enabled: e.target.checked })}
          title="Enabled"
        />
        <input
          value={rule.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          className="font-semibold text-gray-800 border-b border-transparent hover:border-gray-200 focus:border-blue-400 outline-none flex-1"
        />
        {hasSample && fired && (
          <span className="text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            fires
          </span>
        )}
        <button onClick={onPreview} className="text-xs text-blue-600 hover:underline">
          Preview
        </button>
        <button onClick={onRemove} className="text-xs text-red-500 hover:underline">
          Delete
        </button>
      </div>

      {/* match mode + url filter */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
        <label className="flex items-center gap-1">
          Match
          <select
            value={rule.match}
            onChange={(e) => onPatch({ match: e.target.value as 'all' | 'any' })}
            className="border border-gray-200 rounded px-1.5 py-1"
          >
            <option value="any">ANY condition (OR)</option>
            <option value="all">ALL conditions (AND)</option>
          </select>
        </label>
        <label className="flex items-center gap-1">
          URL contains
          <input
            value={rule.urlContains ?? ''}
            onChange={(e) => onPatch({ urlContains: e.target.value })}
            placeholder="(any response)"
            className="border border-gray-200 rounded px-1.5 py-1 font-mono w-40"
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
        <button
          onClick={onAddCond}
          className="self-start text-xs text-gray-500 hover:text-gray-700 mt-1"
        >
          + add condition
        </button>
      </div>

      {/* flash config */}
      <div className="mt-4 border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-xs">
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-gray-500 font-medium">Flash title</span>
          <input
            value={rule.flash.title}
            onChange={(e) => onPatch({ flash: { ...rule.flash, title: e.target.value } })}
            className="border border-gray-200 rounded px-2 py-1.5 font-semibold"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-gray-500 font-medium">Message</span>
          <textarea
            value={rule.flash.message}
            onChange={(e) => onPatch({ flash: { ...rule.flash, message: e.target.value } })}
            className="border border-gray-200 rounded px-2 py-1.5 resize-y h-14"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-500 font-medium">Theme</span>
          <select
            value={rule.flash.theme}
            onChange={(e) => onPatch({ flash: { ...rule.flash, theme: e.target.value as FlashTheme } })}
            className="border border-gray-200 rounded px-2 py-1.5"
          >
            {(Object.keys(THEME_LABELS) as FlashTheme[]).map((t) => (
              <option key={t} value={t}>
                {THEME_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-500 font-medium">Auto-close (ms, 0 = manual)</span>
          <input
            type="number"
            min={0}
            value={rule.flash.durationMs}
            onChange={(e) =>
              onPatch({ flash: { ...rule.flash, durationMs: Number(e.target.value) } })
            }
            className="border border-gray-200 rounded px-2 py-1.5"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rule.flash.sound}
            onChange={(e) => onPatch({ flash: { ...rule.flash, sound: e.target.checked } })}
          />
          <span className="text-gray-600">Siren sound</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rule.flash.showMatches}
            onChange={(e) => onPatch({ flash: { ...rule.flash, showMatches: e.target.checked } })}
          />
          <span className="text-gray-600">Show matched values</span>
        </label>
      </div>
    </div>
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
    <div className="flex flex-wrap items-start gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-2">
      <span className="text-[10px] text-gray-400 mt-2 w-4">{idx + 1}</span>
      <select
        value={c.mode}
        onChange={(e) => onPatch({ mode: e.target.value as 'key' | 'path' })}
        className="text-xs border border-gray-200 rounded px-1 py-1.5"
        title="key = match anywhere by field name; path = exact dotted path"
      >
        <option value="key">key</option>
        <option value="path">path</option>
      </select>
      <input
        value={c.field}
        onChange={(e) => onPatch({ field: e.target.value })}
        placeholder={c.mode === 'key' ? 'FACILITY_CODE' : 'data.x.y'}
        className="text-xs border border-gray-200 rounded px-2 py-1.5 font-mono flex-1 min-w-[8rem]"
      />
      <button
        onClick={onPick}
        className={`text-[10px] px-2 py-1.5 rounded border ${
          picking
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-200 text-gray-500 hover:bg-gray-100'
        }`}
        title="Pick this condition's field from the sample response"
      >
        pick
      </button>
      <select
        value={c.op}
        onChange={(e) => onPatch({ op: e.target.value as Operator })}
        className="text-xs border border-gray-200 rounded px-1 py-1.5"
      >
        {OPS.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>
      {needsValue &&
        (isList ? (
          <textarea
            value={c.value ?? ''}
            onChange={(e) => onPatch({ value: e.target.value })}
            placeholder="one per line or comma separated"
            className="text-xs border border-gray-200 rounded px-2 py-1.5 font-mono w-full h-14 resize-y"
          />
        ) : (
          <input
            value={c.value ?? ''}
            onChange={(e) => onPatch({ value: e.target.value })}
            placeholder="value"
            className="text-xs border border-gray-200 rounded px-2 py-1.5 font-mono min-w-[6rem]"
          />
        ))}
      <label className="flex items-center gap-1 text-[10px] text-gray-500 mt-1.5" title="Case-insensitive">
        <input
          type="checkbox"
          checked={c.caseInsensitive !== false}
          onChange={(e) => onPatch({ caseInsensitive: e.target.checked })}
        />
        Aa
      </label>
      <button onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 mt-1.5">
        ✕
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Flash preview (mirrors the extension overlay, roughly)
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
