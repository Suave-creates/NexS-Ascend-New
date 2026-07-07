'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Card,
  PageHeader,
  Field,
  Input,
  Button,
  Modal,
  StatCard,
  Alert,
  Badge,
} from '@/components/ui';
import { cn } from '@/lib/cn';

const BARCODE_REGEX = /^[A-Z]{3}\d{9}$/;
const SETUP_STORAGE_KEY = 'fitting-setup-v1';

// The six fitting operations — each holds a Person ID (set once, persists).
const OPERATIONS = [
  { key: 'nosePad', label: 'Nose Pad' },
  { key: 'tipFitting', label: 'Tip Fitting' },
  { key: 'lensFitting', label: 'Lens Fitting' },
  { key: 'tipBending', label: 'Tip Bending' },
  { key: 'frontAlign', label: 'Front Alignment' },
  { key: 'frameAlign', label: 'Frame Alignment' },
] as const;

type Persons = Record<(typeof OPERATIONS)[number]['key'], string>;

const EMPTY_PERSONS: Persons = {
  nosePad: '',
  tipFitting: '',
  lensFitting: '',
  tipBending: '',
  frontAlign: '',
  frameAlign: '',
};

type Recent = {
  barcode: string;
  at: string;
  kind: 'fresh' | 'rework' | 'normal';
};

type ToastTone = 'success' | 'error' | 'warning';
type Toast = { text: string; tone: ToastTone } | null;

export default function FittingPage() {
  const [persons, setPersons] = useState<Persons>(EMPTY_PERSONS);
  const [lineNumber, setLineNumber] = useState('');
  const [setupLoaded, setSetupLoaded] = useState(false);

  const [scan, setScan] = useState('');
  const [reworkMode, setReworkMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [stats, setStats] = useState({ count: 0, reworkCount: 0 });

  const [dupOpen, setDupOpen] = useState(false);
  const [reworkOpen, setReworkOpen] = useState(false);
  const [pending, setPending] = useState<{ barcode: string; minutesSince: number | null }>({
    barcode: '',
    minutesSince: null,
  });

  const scanRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------- persistence: setup is "static until changed" ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETUP_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.persons) setPersons({ ...EMPTY_PERSONS, ...saved.persons });
        if (typeof saved.lineNumber === 'string') setLineNumber(saved.lineNumber);
      }
    } catch {
      /* ignore */
    }
    setSetupLoaded(true);
  }, []);

  useEffect(() => {
    if (!setupLoaded) return;
    localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify({ persons, lineNumber }));
  }, [persons, lineNumber, setupLoaded]);

  const setupComplete =
    !!lineNumber.trim() && OPERATIONS.every((op) => persons[op.key].trim());

  /* ---------- stats poll ---------- */
  const fetchStats = useCallback(async () => {
    if (!lineNumber.trim()) return;
    try {
      const res = await fetch(`/api/fitting/stats?lineNumber=${encodeURIComponent(lineNumber)}`);
      if (res.ok) setStats(await res.json());
    } catch {
      /* ignore */
    }
  }, [lineNumber]);

  useEffect(() => {
    fetchStats();
    const iv = setInterval(fetchStats, 45_000);
    return () => clearInterval(iv);
  }, [fetchStats]);

  /* ---------- toast helper ---------- */
  const flash = useCallback((text: string, tone: ToastTone) => {
    setToast({ text, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const refocus = useCallback(() => {
    requestAnimationFrame(() => scanRef.current?.focus());
  }, []);

  /* ---------- submit a scan ---------- */
  const submit = useCallback(
    async (barcode: string, intent: 'auto' | 'rework' | 'normal') => {
      setBusy(true);
      try {
        const res = await fetch('/api/fitting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barcode, lineNumber, persons, intent }),
        });
        const data = await res.json();

        if (!res.ok) {
          flash(`❌ ${data.error}`, 'error');
          return;
        }

        if (data.status === 'duplicate') {
          setPending({ barcode, minutesSince: data.minutesSince });
          setDupOpen(true);
          return;
        }
        if (data.status === 'possible_rework') {
          setPending({ barcode, minutesSince: data.minutesSince });
          setReworkOpen(true);
          return;
        }

        // recorded
        const kind: Recent['kind'] = data.isRework ? 'rework' : data.wasRepeat ? 'normal' : 'fresh';
        flash(
          data.isRework ? '↻ Rework recorded.' : '✔️ Scan recorded.',
          data.isRework ? 'warning' : 'success',
        );
        setRecent((r) =>
          [{ barcode, at: new Date().toLocaleTimeString(), kind }, ...r].slice(0, 12),
        );
        fetchStats();
      } catch (e: any) {
        flash(`❌ ${e.message || 'Network error'}`, 'error');
      } finally {
        setBusy(false);
      }
    },
    [lineNumber, persons, flash, fetchStats],
  );

  /* ---------- auto-submit when a valid barcode is scanned ---------- */
  useEffect(() => {
    if (!BARCODE_REGEX.test(scan)) return;
    const barcode = scan;
    setScan('');

    if (!setupComplete) {
      flash('❌ Complete the line setup before scanning.', 'error');
      refocus();
      return;
    }
    submit(barcode, reworkMode ? 'rework' : 'auto').then(refocus);
  }, [scan, setupComplete, reworkMode, submit, flash, refocus]);

  /* ---------- modal actions ---------- */
  const closeModals = () => {
    setDupOpen(false);
    setReworkOpen(false);
    refocus();
  };

  const confirmRework = async () => {
    setDupOpen(false);
    setReworkOpen(false);
    await submit(pending.barcode, 'rework');
    refocus();
  };

  const confirmNormal = async () => {
    setReworkOpen(false);
    await submit(pending.barcode, 'normal');
    refocus();
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <PageHeader
        title="Fitting Dashboard"
        subtitle="Continuous barcode scanning across the fitting line"
        actions={
          <button
            type="button"
            onClick={() => setReworkMode((v) => !v)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
              reworkMode
                ? 'border-gold-500 bg-gold-100 text-gold-700'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
            )}
          >
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                reworkMode ? 'bg-gold-500' : 'bg-gray-300',
              )}
            />
            Rework mode {reworkMode ? 'ON' : 'OFF'}
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Last 1 hr scans" value={stats.count} sub={lineNumber || '—'} />
        <StatCard label="Rework (1 hr)" value={stats.reworkCount} tone="gold" />
        <StatCard
          label="Line setup"
          value={setupComplete ? 'Ready' : 'Incomplete'}
          tone={setupComplete ? 'good' : 'danger'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Scan area */}
        <Card className="lg:col-span-2 p-6">
          {reworkMode && (
            <Alert tone="warning" className="mb-4">
              ↻ Rework mode is ON — every scan is recorded as a <strong>rework</strong>.
            </Alert>
          )}

          <Field label="Scan barcode" hint="Format: 3 letters + 9 digits (e.g. ABC123456789)">
            <Input
              ref={scanRef}
              autoFocus
              value={scan}
              disabled={busy}
              onChange={(e) => setScan(e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="Scan or type barcode…"
              className="text-lg tracking-wider"
            />
          </Field>

          {toast && (
            <div className="mt-4">
              <Alert tone={toast.tone}>{toast.text}</Alert>
            </div>
          )}

          {!setupComplete && (
            <p className="mt-4 text-sm text-danger-600">
              Set all six operation Person IDs and the Line Number on the right to start scanning.
            </p>
          )}

          {/* Recent scans */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Recent scans</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400">No scans yet this session.</p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {recent.map((r, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="font-mono tracking-wide text-gray-800">{r.barcode}</span>
                    <span className="flex items-center gap-3">
                      {r.kind === 'rework' && <Badge tone="gold">Rework</Badge>}
                      {r.kind === 'normal' && <Badge tone="notice">Repeat</Badge>}
                      {r.kind === 'fresh' && <Badge tone="good">New</Badge>}
                      <span className="text-gray-400">{r.at}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Setup */}
        <Card className="p-6">
          <h3 className="mb-1 text-base font-semibold text-gray-800">Line setup</h3>
          <p className="mb-4 text-xs text-gray-500">
            Static — stays until you change it. Saved on this device.
          </p>

          <Field label="Line Number" className="mb-4">
            <Input
              value={lineNumber}
              onChange={(e) => setLineNumber(e.target.value)}
              placeholder="e.g. L1"
            />
          </Field>

          <div className="space-y-3">
            {OPERATIONS.map((op, i) => (
              <Field key={op.key} label={`${i + 1}. ${op.label} — Person ID`}>
                <Input
                  value={persons[op.key]}
                  onChange={(e) =>
                    setPersons((p) => ({ ...p, [op.key]: e.target.value }))
                  }
                  placeholder="Person ID"
                />
              </Field>
            ))}
          </div>
        </Card>
      </div>

      {/* Duplicate modal (<30 min) */}
      <Modal open={dupOpen} onClose={closeModals} size="sm">
        <Alert tone="error" className="mb-4">
          ⚠️ Duplicate scan
        </Alert>
        <p className="mb-1 text-sm text-gray-700">
          <span className="font-mono">{pending.barcode}</span> was scanned{' '}
          <strong>{pending.minutesSince} min</strong> ago (under 30 min).
        </p>
        <p className="mb-5 text-sm text-gray-500">
          This looks like an accidental re-scan. Ignore it, or mark it as a rework if the piece
          genuinely came back.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeModals}>
            Ignore
          </Button>
          <Button variant="secondary" onClick={confirmRework}>
            Mark as Rework
          </Button>
        </div>
      </Modal>

      {/* Possible rework modal (>=30 min) */}
      <Modal open={reworkOpen} onClose={closeModals} size="sm">
        <Alert tone="warning" className="mb-4">
          ↻ Possible rework
        </Alert>
        <p className="mb-5 text-sm text-gray-700">
          <span className="font-mono">{pending.barcode}</span> was last scanned{' '}
          <strong>{pending.minutesSince} min</strong> ago. Is this a rework?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={confirmNormal}>
            No, record normally
          </Button>
          <Button onClick={confirmRework}>Yes, it&apos;s a rework</Button>
        </div>
      </Modal>
    </div>
  );
}
