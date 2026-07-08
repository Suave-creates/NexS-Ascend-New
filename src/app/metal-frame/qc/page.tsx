'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  PageHeader,
  Field,
  Input,
  Button,
  Modal,
  StatCard,
  Alert,
} from '@/components/ui';
import { cn } from '@/lib/cn';
import {
  type QcReason,
  DEFAULT_REASONS,
  HOTKEY_SEQUENCE,
  nextAvailableHotkey,
  SUPERVISOR_CODE,
} from '@/lib/qcReasons';

const BARCODE_REGEX = /^[A-Z]{3}\d{9}$/;
const QC_PERSON_KEY = 'qc-person-v1';
const QC_STATION_KEY = 'qc-station-v1';

// A scan may be a plain barcode (3 letters + 9 digits) or a "link barcode" — a
// longer string (e.g. a URL) that ends in the barcode. In that case pick the
// trailing 12 chars. Returns the normalized barcode, or null if none is present.
function pickBarcode(raw: string): string | null {
  const s = raw.trim().toUpperCase();
  if (BARCODE_REGEX.test(s)) return s;
  if (s.length > 12) {
    const tail = s.slice(-12);
    if (BARCODE_REGEX.test(tail)) return tail;
  }
  return null;
}

type Toast = { text: string; tone: 'success' | 'error' | 'warning' } | null;
type Prev = { status: string; reason: string | null; qcPerson: string; minutesSince: number } | null;

export default function QcPage() {
  const [qcPerson, setQcPerson] = useState('');
  const [qcStation, setQcStation] = useState('');
  const [setupLoaded, setSetupLoaded] = useState(false);

  const [scan, setScan] = useState('');
  const [current, setCurrent] = useState<string | null>(null); // barcode awaiting verdict
  const [prev, setPrev] = useState<Prev>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const [reasons, setReasons] = useState<QcReason[]>([]);
  const [reasonsState, setReasonsState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [stats, setStats] = useState<{ pass: number; fail: number }>({ pass: 0, fail: 0 });

  const [supOpen, setSupOpen] = useState(false);
  const [supSaving, setSupSaving] = useState(false);

  const scanRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedAt = useRef(0); // when the current barcode was loaded (to swallow the scanner's own trailing Enter)

  /* ---------- toast helper ---------- */
  const flash = useCallback((text: string, tone: NonNullable<Toast>['tone']) => {
    setToast({ text, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const refocus = useCallback(() => {
    requestAnimationFrame(() => scanRef.current?.focus());
  }, []);

  /* ---------- load persisted person + station ---------- */
  useEffect(() => {
    try {
      const p = localStorage.getItem(QC_PERSON_KEY);
      if (p) setQcPerson(p);
      const s = localStorage.getItem(QC_STATION_KEY);
      if (s) setQcStation(s);
    } catch {
      /* ignore */
    }
    setSetupLoaded(true);
  }, []);

  useEffect(() => {
    if (!setupLoaded) return;
    localStorage.setItem(QC_PERSON_KEY, qcPerson);
    localStorage.setItem(QC_STATION_KEY, qcStation);
  }, [qcPerson, qcStation, setupLoaded]);

  /* ---------- load the DB-backed reason layout (shared across stations) ---------- */
  const loadReasons = useCallback(async () => {
    setReasonsState('loading');
    try {
      const res = await fetch('/api/metal-frame/qc/reasons');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load reasons');
      setReasons(data.reasons);
      setReasonsState('ready');
    } catch {
      setReasonsState('error');
    }
  }, []);

  useEffect(() => {
    loadReasons();
  }, [loadReasons]);

  /* ---------- ordered / grouped reasons ---------- */
  const ordered = useMemo(() => [...reasons].sort((a, b) => a.order - b.order), [reasons]);
  const featured = useMemo(() => ordered.filter((r) => r.featured), [ordered]);
  const rest = useMemo(() => ordered.filter((r) => !r.featured), [ordered]);

  /* ---------- stats ---------- */
  const fetchStats = useCallback(async () => {
    if (!qcPerson.trim()) return;
    try {
      const res = await fetch(`/api/metal-frame/qc/stats?qcPerson=${encodeURIComponent(qcPerson)}`);
      if (res.ok) setStats(await res.json());
    } catch {
      /* ignore */
    }
  }, [qcPerson]);

  useEffect(() => {
    fetchStats();
    const iv = setInterval(fetchStats, 45_000);
    return () => clearInterval(iv);
  }, [fetchStats]);

  const resetCurrent = useCallback(() => {
    setCurrent(null);
    setPrev(null);
    refocus();
  }, [refocus]);

  const setupReady = !!qcPerson.trim() && !!qcStation.trim();

  /* ---------- load a scanned barcode ---------- */
  const loadBarcode = useCallback(
    async (barcode: string) => {
      if (!setupReady) {
        flash('❌ Set the QC Person and QC Station first.', 'error');
        refocus();
        return;
      }
      loadedAt.current = Date.now();
      setCurrent(barcode);
      setPrev(null);
      try {
        const res = await fetch(`/api/metal-frame/qc?barcode=${encodeURIComponent(barcode)}`);
        if (res.ok) {
          const data = await res.json();
          setPrev(data.previous);
        }
      } catch {
        /* ignore */
      }
    },
    [setupReady, flash, refocus],
  );

  useEffect(() => {
    const barcode = pickBarcode(scan);
    if (!barcode) return;
    setScan('');
    loadBarcode(barcode);
  }, [scan, loadBarcode]);

  /* ---------- record a verdict ---------- */
  const record = useCallback(
    async (status: 'PASS' | 'FAIL', reason?: string) => {
      if (!current || busy) return;
      // Do not allow a double QC pass — the piece was already passed.
      if (status === 'PASS' && prev?.status === 'PASS') {
        flash('❌ Already passed QC — double pass is not allowed.', 'error');
        return;
      }
      setBusy(true);
      try {
        const res = await fetch('/api/metal-frame/qc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode: current, qcPerson, qcStation, status, reason: reason ?? null }),
        });
        const data = await res.json();
        if (!res.ok) {
          flash(`❌ ${data.error}`, 'error');
          return;
        }
        flash(
          status === 'PASS' ? '✔️ Passed.' : `✖️ Failed — ${reason}`,
          status === 'PASS' ? 'success' : 'warning',
        );
        resetCurrent();
        fetchStats();
      } catch (e: any) {
        flash(`❌ ${e.message || 'Network error'}`, 'error');
      } finally {
        setBusy(false);
      }
    },
    [current, busy, qcPerson, qcStation, flash, resetCurrent, fetchStats, prev],
  );

  /* ---------- keyboard hotkeys while a barcode is loaded ---------- */
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (supOpen) return;
      const el = e.target as HTMLElement | null;
      const isScanBox = el === scanRef.current;
      // ignore typing in other fields (QC person/station, supervisor panel) —
      // but NOT the scan box, which keeps focus between scans
      const tag = el?.tagName;
      if ((tag === 'INPUT' || tag === 'TEXTAREA') && !isScanBox) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        // the scanner fires its own Enter right after the barcode — skip it
        if (Date.now() - loadedAt.current < 350) return;
        // mid-way through typing/scanning the next barcode — not a verdict
        if (isScanBox && scanRef.current?.value) return;
        record('PASS');
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setScan('');
        resetCurrent();
        return;
      }
      // printable chars in the scan box land in the buffer; the effect below
      // decides whether a lone char is a fail hotkey or the start of a scan
      if (isScanBox) return;
      const k = e.key.toUpperCase();
      const match = reasons.find((r) => r.key && r.key.toUpperCase() === k);
      if (match) {
        e.preventDefault();
        record('FAIL', match.label);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, reasons, supOpen, record, resetCurrent]);

  /* ---------- fail hotkeys typed into the scan box ---------- */
  // The scan box keeps focus at all times, so hotkey presses land in it as
  // text. A lone hotkey char that sits unchanged for 150ms is a verdict; a
  // scanner burst streams its next char within ~20ms, which cancels the timer
  // and lets the barcode build up normally.
  useEffect(() => {
    if (!current || busy || supOpen || scan.length !== 1) return;
    const match = reasons.find((r) => r.key && r.key.toUpperCase() === scan);
    if (!match) return;
    const t = setTimeout(() => {
      setScan('');
      record('FAIL', match.label);
    }, 150);
    return () => clearTimeout(t);
  }, [scan, current, busy, supOpen, reasons, record]);

  /* ---------- supervisor save (writes to DB for ALL stations) ---------- */
  const saveReasonsToServer = useCallback(
    async (next: QcReason[], code: string) => {
      setSupSaving(true);
      try {
        const res = await fetch('/api/metal-frame/qc/reasons', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            reasons: next.map((r) => ({ label: r.label, key: r.key, featured: r.featured })),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          flash(`❌ ${data.error}`, 'error');
          return false;
        }
        setReasons(data.reasons);
        setSupOpen(false);
        flash('✔️ Reason layout saved for all QC stations.', 'success');
        refocus();
        return true;
      } catch (e: any) {
        flash(`❌ ${e.message || 'Network error'}`, 'error');
        return false;
      } finally {
        setSupSaving(false);
      }
    },
    [flash, refocus],
  );

  const passRate = useMemo(() => {
    const total = stats.pass + stats.fail;
    return total ? Math.round((stats.pass / total) * 100) : null;
  }, [stats]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="QC Dashboard"
        subtitle="Scan a barcode, then pass it or pick a fail reason"
        actions={
          <Button variant="outline" onClick={() => setSupOpen(true)}>
            ⚙️ Supervisor
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Pass (1 hr)" value={stats.pass} tone="good" />
        <StatCard label="Fail (1 hr)" value={stats.fail} tone="danger" />
        <StatCard label="Pass rate (1 hr)" value={passRate == null ? '—' : `${passRate}%`} />
        <StatCard label="QC Station / Line" value={qcStation || '—'} tone="navy" />
      </div>

      {/* Top controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="QC Person" hint="Stays set until you change it (this device).">
              <Input
                value={qcPerson}
                onChange={(e) => setQcPerson(e.target.value)}
                placeholder="QC Person ID / name"
              />
            </Field>
            <Field label="QC Station / Line" hint="Stays set until you change it (this device).">
              <Input
                value={qcStation}
                onChange={(e) => setQcStation(e.target.value)}
                placeholder="e.g. QC-1 / Line 3"
              />
            </Field>
          </div>
        </Card>
        <Card className="p-5">
          <Field label="Scan barcode" hint="Format: 3 letters + 9 digits (e.g. ABC123456789)">
            <Input
              ref={scanRef}
              autoFocus
              value={scan}
              onChange={(e) => setScan(e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="Scan or type barcode…"
              className="text-lg tracking-wider"
            />
          </Field>
        </Card>
      </div>

      {!setupReady && (
        <Alert tone="warning">Set the QC Person and QC Station / Line before scanning.</Alert>
      )}

      {toast && <Alert tone={toast.tone}>{toast.text}</Alert>}

      {/* Current barcode + verdict */}
      <Card className="p-6">
        {!current ? (
          <p className="text-center text-sm text-gray-400">
            Scan a barcode to begin. Then press <kbd className="rounded border px-1">Enter</kbd> to
            Pass, or a reason&apos;s hotkey to Fail.
          </p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-500">Current barcode</div>
                <div className="font-mono text-2xl font-bold tracking-wider text-brand-700">
                  {current}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={resetCurrent}>
                  Cancel (Esc)
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  loading={busy}
                  disabled={prev?.status === 'PASS'}
                  onClick={() => record('PASS')}
                >
                  ✔ PASS (Enter)
                </Button>
              </div>
            </div>

            {prev && (
              <Alert tone={prev.status === 'PASS' ? 'error' : 'warning'}>
                Previously QC&apos;d {prev.minutesSince} min ago by{' '}
                <strong>{prev.qcPerson}</strong>: <strong>{prev.status}</strong>
                {prev.reason ? ` — ${prev.reason}` : ''}
                {prev.status === 'PASS' && ' — already passed, double pass is not allowed.'}
              </Alert>
            )}
          </>
        )}
      </Card>

      {/* Fail reasons */}
      {reasonsState === 'loading' ? (
        <Card className="p-6 text-center text-sm text-gray-400">Loading reason layout…</Card>
      ) : reasonsState === 'error' ? (
        <Card className="p-6 text-center">
          <p className="mb-3 text-sm text-danger-600">Couldn&apos;t load the reason layout.</p>
          <Button variant="outline" onClick={loadReasons}>
            Retry
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Featured (big, left) */}
          <Card className="p-5 lg:col-span-1">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Top reasons</h3>
            <div className="grid grid-cols-1 gap-3">
              {featured.length === 0 && (
                <p className="text-sm text-gray-400">
                  None featured — set some in the supervisor panel.
                </p>
              )}
              {featured.map((r) => (
                <ReasonButton
                  key={r.id}
                  reason={r}
                  big
                  disabled={!current || busy}
                  onClick={() => record('FAIL', r.label)}
                />
              ))}
            </div>
          </Card>

          {/* Rest (numbered chips, right) */}
          <Card className="p-5 lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">All reasons</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {rest.map((r) => (
                <ReasonButton
                  key={r.id}
                  reason={r}
                  disabled={!current || busy}
                  onClick={() => record('FAIL', r.label)}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      <SupervisorPanel
        open={supOpen}
        reasons={ordered}
        saving={supSaving}
        onClose={() => setSupOpen(false)}
        onSave={saveReasonsToServer}
      />
    </div>
  );
}

/* ============================================================= */
/* Reason button                                                 */
/* ============================================================= */
function ReasonButton({
  reason,
  big = false,
  disabled,
  onClick,
}: {
  reason: QcReason;
  big?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-2 rounded-lg border text-left transition',
        'disabled:cursor-not-allowed disabled:opacity-40',
        big ? 'px-4 py-4' : 'px-3 py-2.5',
        'border-gray-300 bg-white hover:border-danger-400 hover:bg-danger-50',
      )}
    >
      {reason.key && (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-md bg-brand-700 font-bold text-white',
            big ? 'h-8 w-8 text-base' : 'h-6 w-6 text-xs',
          )}
        >
          {reason.key.toUpperCase()}
        </span>
      )}
      <span className={cn('flex-1 font-medium text-gray-800', big ? 'text-base' : 'text-sm')}>
        {reason.label}
      </span>
    </button>
  );
}

/* ============================================================= */
/* Hotkey picker — tap a key from a keypad; taken keys are        */
/* disabled so a digit/letter can never be double-assigned.       */
/* ============================================================= */
function HotkeyPicker({
  value,
  takenByOthers,
  open,
  onToggle,
  onChange,
}: {
  value: string;
  takenByOthers: Set<string>;
  open: boolean;
  onToggle: () => void;
  onChange: (key: string) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        title="Assign a hotkey"
        className={cn(
          'flex h-9 w-12 shrink-0 items-center justify-center rounded-md border font-bold transition',
          value
            ? 'border-brand-300 bg-brand-50 text-brand-700'
            : 'border-dashed border-gray-300 bg-white text-gray-400',
          open && 'ring-2 ring-brand-300',
        )}
      >
        {value ? value.toUpperCase() : '—'}
      </button>

      {open && (
        <div className="col-span-full mt-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
          <div className="mb-1.5 text-[11px] text-gray-500">
            Tap a key to assign. Greyed keys are used by another reason.
          </div>
          <div className="grid grid-cols-9 gap-1">
            {HOTKEY_SEQUENCE.map((k) => {
              const taken = takenByOthers.has(k);
              const isCurrent = value.toUpperCase() === k;
              return (
                <button
                  key={k}
                  type="button"
                  disabled={taken && !isCurrent}
                  onClick={() => onChange(isCurrent ? '' : k)}
                  className={cn(
                    'h-8 rounded text-xs font-bold transition',
                    isCurrent
                      ? 'bg-brand-700 text-white'
                      : taken
                        ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                        : 'bg-white text-gray-700 hover:bg-brand-100',
                  )}
                >
                  {k}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="mt-2 w-full rounded border border-gray-200 bg-white py-1 text-xs text-gray-500 hover:bg-gray-50"
          >
            No hotkey
          </button>
        </div>
      )}
    </>
  );
}

/* ============================================================= */
/* Supervisor panel — DB-backed layout editor                    */
/* ============================================================= */
function SupervisorPanel({
  open,
  reasons,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  reasons: QcReason[];
  saving: boolean;
  onClose: () => void;
  onSave: (r: QcReason[], code: string) => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [draft, setDraft] = useState<QcReason[]>([]);
  const [pickerOpenId, setPickerOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(reasons.map((r) => ({ ...r })));
      setUnlocked(SUPERVISOR_CODE === '');
      setCode('');
      setPickerOpenId(null);
    }
  }, [open, reasons]);

  const move = (idx: number, dir: -1 | 1) => {
    setDraft((d) => {
      const next = [...d];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return next;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const update = (idx: number, patch: Partial<QcReason>) => {
    setDraft((d) => d.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const remove = (idx: number) =>
    setDraft((d) => d.filter((_, i) => i !== idx).map((r, i) => ({ ...r, order: i })));

  const add = () => {
    setDraft((d) => [
      ...d,
      {
        id: `tmp-${d.length}-${d.reduce((a, r) => a + r.label.length, 0)}`,
        label: 'New reason',
        key: nextAvailableHotkey(d),
        featured: false,
        order: d.length,
      },
    ]);
  };

  const commit = () => {
    const cleaned = draft
      .map((r, i) => ({ ...r, label: r.label.trim() || 'Untitled', order: i }))
      .filter((r) => r.label);
    onSave(cleaned, code);
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-brand-700">Supervisor — QC reason layout</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {!unlocked ? (
        <div className="space-y-3">
          <Alert tone="info">Enter the supervisor code to edit the reason layout.</Alert>
          <Field label="Supervisor code">
            <Input
              type="password"
              value={code}
              autoFocus
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && code === SUPERVISOR_CODE) setUnlocked(true);
              }}
              placeholder="••••"
            />
          </Field>
          <div className="flex justify-end">
            <Button onClick={() => (code === SUPERVISOR_CODE ? setUnlocked(true) : null)}>
              Unlock
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-gray-500">
            Reorder with ▲▼, tap the key box to allot a hotkey (1-9, 0, A-Z — taken keys are
            disabled), toggle <strong>Featured</strong> to show a reason as a big button on the left,
            rename, add or remove. Changes are saved to the database and apply to{' '}
            <strong>every QC station</strong>.
          </p>

          <div className="max-h-[52vh] space-y-1.5 overflow-y-auto pr-1">
            {draft.map((r, i) => {
              const takenByOthers = new Set(
                draft
                  .filter((_, j) => j !== i)
                  .map((o) => o.key.toUpperCase())
                  .filter(Boolean),
              );
              return (
                <div
                  key={r.id}
                  className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5"
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      className="px-1 text-gray-400 hover:text-gray-700"
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      className="px-1 text-gray-400 hover:text-gray-700"
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  <HotkeyPicker
                    value={r.key}
                    takenByOthers={takenByOthers}
                    open={pickerOpenId === r.id}
                    onToggle={() => setPickerOpenId((cur) => (cur === r.id ? null : r.id))}
                    onChange={(key) => {
                      update(i, { key });
                      setPickerOpenId(null);
                    }}
                  />

                  <Input
                    value={r.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    className="w-full"
                  />

                  <button
                    type="button"
                    onClick={() => update(i, { featured: !r.featured })}
                    className={cn(
                      'rounded-md border px-2.5 py-1.5 text-xs font-semibold transition',
                      r.featured
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
                    )}
                  >
                    {r.featured ? '★ Featured' : '☆ Feature'}
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="px-2 text-danger-500 hover:text-danger-700"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={add}>
                + Add reason
              </Button>
              <Button variant="ghost" onClick={() => setDraft(DEFAULT_REASONS.map((r) => ({ ...r })))}>
                Reset to defaults
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={commit} loading={saving}>
                Save for all stations
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
