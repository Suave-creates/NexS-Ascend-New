'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FiLock, FiZap, FiEdit2, FiPackage, FiRotateCcw } from 'react-icons/fi';
import {
  Button,
  Input,
  Select,
  Field,
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Modal,
  Alert,
  Badge,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';
import { cn } from '@/lib/cn';

type Partner =
  | 'Purpledrone'
  | 'Bluedart'
  | 'DOT'
  | 'Delcart'
  | 'DTDC'
  | 'XPressBees'
  | 'Velocity'
  | 'Delhivery'
  | 'Delhivery_DK'
  | 'DelhiverySFC'
  | 'Delhivery_PDS'
  | 'BusybeesPPD'
  | 'BusyBeesSSD'
  | 'Fastbeetle'
  | 'Shadowfax'
  | 'Skyeair'
  | 'Blitz'
  | 'BlitzNDD'
  | 'GP_Supply'
  | 'ShreeRajXpress'
  | 'Lenskart'
  | 'Courier_Unknown_1'
  | 'Courier_Unknown_2'
  | 'Courier_Unknown_3';

const PARTNERS: Partner[] = [
  'Purpledrone','Bluedart','DOT','Delcart','DTDC','XPressBees','Velocity',
  'Delhivery','Delhivery_DK','DelhiverySFC','Delhivery_PDS',
  'BusybeesPPD','BusyBeesSSD','Fastbeetle','Shadowfax','Skyeair',
  'Blitz','BlitzNDD','GP_Supply','ShreeRajXpress','Lenskart',
  'Courier_Unknown_1','Courier_Unknown_2','Courier_Unknown_3',
];

// Partners that share the same AWB format — any of them is a valid "family" match
const PARTNER_FAMILIES: Partner[][] = [
  ['Delhivery', 'Delhivery_DK', 'DelhiverySFC', 'Delhivery_PDS'],
  ['Blitz', 'BlitzNDD'],
  ['Courier_Unknown_1', 'Courier_Unknown_2', 'Courier_Unknown_3'],
];

function getFamily(p: Partner): Partner[] {
  return PARTNER_FAMILIES.find((f) => f.includes(p)) ?? [p];
}

const GENERIC_AWB = /^[A-Za-z0-9_-]{6,30}$/;

const PATTERN_STORAGE_KEY = 'ch_awb_custom_patterns';

const RE: Record<Partner, RegExp> = {
  Purpledrone:      /^P[A-Za-z0-9]{12}$/i,
  Bluedart:         /^\d{11}$/,
  DOT:              /^(?:4\d{7}|NCR\d{7}|B2BLK\d{7}|B2CLK\d{7})$/i,
  Delcart:          /^15\d{8}$/,
  DTDC:             /^(?:V\d{10}|D\d{9})$/i,
  XPressBees:       /^\d{12}$/,
  Velocity:         /^(LK\d{9}|VE\d{7})$/i,
  Delhivery:        /^\d{14}$/,
  Delhivery_DK:     /^\d{14}$/,
  DelhiverySFC:     /^\d{14}$/,
  Delhivery_PDS:    /^\d{14}$/,
  BusybeesPPD:      /^\d{12}$/,
  BusyBeesSSD:      /^\d{15}$/,
  Fastbeetle:       /^9\d{7}$/,
  Shadowfax:        /^SF\d{10,12}LE$/i,
  Skyeair:          /^SK\d{6,}$/i,
  Blitz:            /^GS\d{10}$/i,
  BlitzNDD:         /^GS\d{10}$/i,
  GP_Supply:        /^GP\d{9}$/i,
  ShreeRajXpress:   /^(?:SRLK\d{5,6}|B2BSR\d{7})$/i,
  Lenskart:         /^SNXS\d{16}$/i,
  Courier_Unknown_1: GENERIC_AWB,
  Courier_Unknown_2: GENERIC_AWB,
  Courier_Unknown_3: GENERIC_AWB,
};

function validateForPartner(partner: Partner, awb: string, reMap: Record<Partner, RegExp> = RE) {
  return reMap[partner].test((awb || '').trim());
}

/**
 * Detect which partner family an AWB belongs to.
 * Returns null if no match, or the detected Partner (first in family).
 * If the selected partner's family matches → no mismatch.
 */
function detectPartner(awb: string, reMap: Record<Partner, RegExp> = RE): Partner | null {
  const s = (awb || '').trim();
  for (const p of PARTNERS) if (reMap[p].test(s)) return p;
  return null;
}

function isFamilyMatch(selected: Partner, detected: Partner): boolean {
  const family = getFamily(selected);
  return family.includes(detected);
}

const AWB_FORMATS = [
  { courier: 'Purpledrone',    rule: 'P + 12 Alphanumerics',              example: 'PRD008469202P' },
  { courier: 'Bluedart',       rule: '11 digits',                         example: '80903603351' },
  { courier: 'DOT',            rule: '4 + 7 digits OR NCR + 7 digits',    example: '42954471 / NCR3494737' },
  { courier: 'Delcart',        rule: '15 + 8 digits (10 total)',           example: '1505011587' },
  { courier: 'DTDC',           rule: 'V + 10 digits OR D + 9 digits',     example: 'V1001730643' },
  { courier: 'XPressBees',     rule: '12 digits',                         example: '121551566659' },
  { courier: 'Velocity',       rule: 'LK + 9 digits OR VE + 7 digits',    example: 'LK101962084 / VE1234567' },
  { courier: 'Delhivery*',     rule: '14 digits (all Delhivery variants)', example: '34466715645710' },
  { courier: 'BusybeesPPD',    rule: '12 digits',                         example: '121550827944' },
  { courier: 'BusyBeesSSD',    rule: '15 digits',                         example: '152986850198501' },
  { courier: 'Fastbeetle',     rule: 'Starts with 9, 8 digits total',     example: '90051031' },
  { courier: 'Shadowfax',      rule: 'SF + 10–12 digits + LE',            example: 'SF1767653403LE' },
  { courier: 'Skyeair',        rule: 'SK + 6+ digits',                    example: 'SK000012504' },
  { courier: 'Blitz / BlitzNDD', rule: 'GS + 10 digits',                  example: 'GS1234567890' },
  { courier: 'GP Supply',      rule: 'GP + 9 digits',                     example: 'GP777250137' },
  { courier: 'ShreeRajXpress', rule: 'SRLK + 5–6 digits OR B2BSR + 7 digits', example: 'SRLK00750 / B2BSR3030717' },
  { courier: 'Lenskart',       rule: 'SNXS + 16 digits',                  example: 'SNXS0000000000001234' },
];

type Counters = { valid: number; invalid: number; total: number };

export default function CourierHandoverPage() {
  const [partner, setPartner] = useState<Partner>('XPressBees');
  const [personId, setPersonId] = useState('');
  const [awb, setAwb] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errorSticky, setErrorSticky] = useState<string | null>(null);
  const [counters, setCounters] = useState<Counters>({ valid: 0, invalid: 0, total: 0 });
  const [mismatchModal, setMismatchModal] = useState<{ show: boolean; awb: string; detected: Partner | null }>({ show: false, awb: '', detected: null });
  const [duplicateModal, setDuplicateModal] = useState<{ show: boolean; awb: string }>({ show: false, awb: '' });
  const [armed, setArmed] = useState(false);
  const [arming, setArming] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [customPatterns, setCustomPatterns] = useState<Partial<Record<Partner, string>>>({});
  const [patternEditor, setPatternEditor] = useState(false);
  const [editDraft, setEditDraft] = useState<Partial<Record<Partner, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<Partner, string>>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (armed && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [armed]);

  useEffect(() => {
    setArmed(false);
    if (!partner) return;
    setArming(true);
    const t = setTimeout(() => setArming(false), 600);
    return () => clearTimeout(t);
  }, [partner]);

  useEffect(() => {
    if (armed) setCounters({ valid: 0, invalid: 0, total: 0 });
  }, [armed]);

  // Load custom patterns from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PATTERN_STORAGE_KEY);
      if (raw) setCustomPatterns(JSON.parse(raw));
    } catch {}
  }, []);

  // Merge defaults with user overrides
  const effectiveRE = useMemo<Record<Partner, RegExp>>(() => {
    const out = { ...RE } as Record<Partner, RegExp>;
    for (const p of PARTNERS) {
      const src = customPatterns[p];
      if (src) {
        try { out[p] = new RegExp(src, 'i'); } catch {}
      }
    }
    return out;
  }, [customPatterns]);

  const triggerPulse = () => { setPulse(true); setTimeout(() => setPulse(false), 300); };

  useEffect(() => {
    const awbTrim = awb.trim().toUpperCase();
    if (!awbTrim || !personId || !armed || mismatchModal.show || duplicateModal.show) return;

    const timeout = setTimeout(() => {
      const detected = detectPartner(awbTrim, effectiveRE);

      // Mismatch: detected a partner that is NOT in the selected partner's family
      if (detected && !isFamilyMatch(partner, detected)) {
        setCounters((c) => ({ ...c, invalid: c.invalid + 1, total: c.total + 1 }));
        fetch('/api/courier/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partner, awb: awbTrim, personId, mismatch: true, detectedPartner: detected }),
        }).catch(() => {});
        setMismatchModal({ show: true, awb: awbTrim, detected });
        return;
      }

      if (validateForPartner(partner, awbTrim, effectiveRE)) {
        (async () => {
          try {
            const res = await fetch('/api/courier/scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ partner, awb: awbTrim, personId }),
            });
            const j = await res.json().catch(() => ({} as any));
            if (!res.ok || !j.ok) { setErrorSticky(j.error || 'Server error'); return; }

            if (j.duplicate) {
              setCounters((c) => ({ ...c, valid: c.valid + 1, total: c.total + 1 }));
              setDuplicateModal({ show: true, awb: awbTrim });
            } else {
              setCounters((c) => ({ ...c, valid: c.valid + 1, total: c.total + 1 }));
              triggerPulse();
              setMsg({ type: 'success', text: '✔ Recorded' });
              setTimeout(() => setMsg(null), 700);
            }
          } catch (e: any) {
            setErrorSticky(e?.message || 'Network/Server error');
          } finally {
            setAwb('');
          }
        })();
      } else {
        setCounters((c) => ({ ...c, invalid: c.invalid + 1, total: c.total + 1 }));
        setMsg({ type: 'error', text: '✗ Invalid AWB format' });
        setTimeout(() => setMsg(null), 900);
        setAwb('');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [awb, partner, personId, armed, mismatchModal.show, duplicateModal.show, effectiveRE]);

  const clearAwbAndRefocus = () => {
    setAwb('');
    setTimeout(() => { if (armed && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, 0);
  };

  const openPatternEditor = () => { setEditDraft({}); setEditErrors({}); setPatternEditor(true); };

  const successRate = counters.total > 0 ? Math.round((counters.valid / counters.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Courier Handover"
        subtitle="AWB scan system"
        actions={
          <>
            <Badge tone={armed ? 'good' : 'gray'}>
              <span className={cn('mr-1.5 inline-block h-2 w-2 rounded-full', armed ? 'bg-good-600' : 'bg-gray-400')} />
              {armed ? 'SCANNING ACTIVE' : 'SYSTEM READY'}
            </Badge>
            <Button variant="outline" size="sm" onClick={openPatternEditor}>
              <FiEdit2 className="h-4 w-4" /> Edit Patterns
            </Button>
          </>
        }
      />

      {errorSticky && (
        <Alert tone="error" className="flex items-center justify-between gap-3">
          <span>{errorSticky}</span>
          <Button
            variant="danger"
            size="sm"
            onClick={() => { setErrorSticky(null); clearAwbAndRefocus(); }}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── LEFT: Scan configuration ── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Scan Configuration</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Courier Partner">
                <Select value={partner} onChange={(e) => setPartner(e.target.value as Partner)}>
                  {PARTNERS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>

              <Field label="Person ID (present)">
                <Input
                  type="text"
                  value={personId}
                  onChange={(e) => setPersonId(e.target.value.toUpperCase())}
                  placeholder="e.g. ARYA01"
                />
              </Field>
            </div>

            <Field label="AWB / Barcode">
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value.toUpperCase())}
                  onPaste={(e) => e.preventDefault()}
                  placeholder={armed ? 'Scan barcode here…' : 'Arm scanner to enable input'}
                  disabled={!armed}
                  className={cn(
                    'h-14 pr-12 font-mono text-xl tracking-wide',
                    armed && 'border-brand-500 ring-2 ring-brand-500/20',
                  )}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {armed ? <FiZap className="h-5 w-5 text-brand-600" /> : <FiLock className="h-5 w-5" />}
                </span>
              </div>
            </Field>

            <Button
              className="w-full"
              size="lg"
              variant={armed ? 'danger' : 'primary'}
              onClick={() => { if (!partner || arming) return; setArmed((s) => !s); if (!armed) clearAwbAndRefocus(); }}
              disabled={!partner || arming}
              loading={arming}
            >
              {arming ? 'Preparing…' : armed ? 'Pause Scanning' : 'Start Scanning'}
            </Button>
          </CardBody>
        </Card>

        {/* ── RIGHT: Session counter ── */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Session Counter</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="text-center">
              <div className={cn('text-6xl font-bold leading-none text-brand-700 transition-transform duration-150', pulse && 'scale-110')}>
                {counters.total}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">Total Scanned</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Valid" value={counters.valid} tone="good" />
              <StatCard label="Invalid" value={counters.invalid} tone="notice" />
            </div>

            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-good-600 transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-gray-500">{successRate}% success rate</div>
            </div>

            <div className="flex items-center justify-center">
              <Badge tone="navy">
                <FiPackage className="mr-1.5 h-3.5 w-3.5" /> {partner}
              </Badge>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCounters({ valid: 0, invalid: 0, total: 0 })}
            >
              <FiRotateCcw className="h-4 w-4" /> Reset Counter
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* ── AWB Format Reference ── */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">AWB Format Reference</h2>
          <Button variant="outline" size="sm" onClick={openPatternEditor}>
            <FiEdit2 className="h-4 w-4" /> Edit Patterns
          </Button>
        </CardHeader>
        <Table>
          <THead>
            <TR>
              <TH>Courier</TH>
              <TH>Format Rule</TH>
              <TH>Example</TH>
            </TR>
          </THead>
          <TBody>
            {AWB_FORMATS.map((r) => (
              <TR key={r.courier}>
                <TD className="font-semibold text-gray-900">{r.courier}</TD>
                <TD className="text-gray-500">{r.rule}</TD>
                <TD className="font-mono text-brand-700">{r.example}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      {/* Toast */}
      {msg && (
        <div
          className={cn(
            'fixed bottom-7 left-1/2 z-[100] -translate-x-1/2 rounded-full border px-6 py-3 text-sm font-bold shadow-lg',
            msg.type === 'success'
              ? 'border-good-600/40 bg-good-50 text-good-600'
              : 'border-danger-600/40 bg-danger-50 text-danger-600',
          )}
        >
          {msg.text}
        </div>
      )}

      {/* Mismatch Modal */}
      <Modal
        open={mismatchModal.show}
        size="sm"
        onClose={() => { setMismatchModal({ show: false, awb: '', detected: null }); clearAwbAndRefocus(); }}
      >
        <div className="text-center">
          <div className="mb-3 text-4xl">🚨</div>
          <h3 className="mb-2 text-lg font-bold text-brand-700">Partner Mismatch</h3>
          <div className="mb-4 inline-block rounded-lg bg-gold-100 px-4 py-2 font-mono text-sm tracking-wide text-gold-700">
            {mismatchModal.awb}
          </div>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            This shipment belongs to <b className="text-gray-900">{mismatchModal.detected ?? 'Unknown'}</b>,
            but you&apos;re scanning under <b className="text-gray-900">{partner}</b>.
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => { setMismatchModal({ show: false, awb: '', detected: null }); clearAwbAndRefocus(); }}
            >
              Dismiss
            </Button>
            {mismatchModal.detected && (
              <Button
                onClick={() => { setPartner(mismatchModal.detected!); setMismatchModal({ show: false, awb: '', detected: null }); clearAwbAndRefocus(); }}
              >
                Switch to {mismatchModal.detected}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Duplicate Modal */}
      <Modal
        open={duplicateModal.show}
        size="sm"
        onClose={() => { setDuplicateModal({ show: false, awb: '' }); clearAwbAndRefocus(); }}
      >
        <div className="text-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h3 className="mb-2 text-lg font-bold text-brand-700">Duplicate Scan</h3>
          <div className="mb-4 inline-block rounded-lg bg-gold-100 px-4 py-2 font-mono text-sm tracking-wide text-gold-700">
            {duplicateModal.awb}
          </div>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            This AWB was already recorded in this session.<br />
            The latest scan has overwritten the previous record.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => { setDuplicateModal({ show: false, awb: '' }); clearAwbAndRefocus(); }}>
              OK, Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pattern Editor Modal */}
      <Modal
        open={patternEditor}
        size="lg"
        onClose={() => { setPatternEditor(false); setEditDraft({}); setEditErrors({}); }}
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-brand-700">AWB Pattern Editor</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Regex patterns used to validate and detect each courier&apos;s AWB format.
              Edits are saved locally and override the defaults. Flags are always{' '}
              <code className="font-mono text-brand-700">i</code> (case-insensitive).
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCustomPatterns({});
                localStorage.removeItem(PATTERN_STORAGE_KEY);
                setEditDraft({});
                setEditErrors({});
              }}
            >
              Reset All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setPatternEditor(false); setEditDraft({}); setEditErrors({}); }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const newErrors: Partial<Record<Partner, string>> = {};
                let hasError = false;
                for (const p of PARTNERS) {
                  const src = editDraft[p];
                  if (src !== undefined && src.trim() !== '') {
                    try { new RegExp(src); } catch {
                      newErrors[p] = 'Invalid regex';
                      hasError = true;
                    }
                  }
                }
                setEditErrors(newErrors);
                if (hasError) return;
                const next: Partial<Record<Partner, string>> = { ...customPatterns };
                for (const p of PARTNERS) {
                  const src = editDraft[p];
                  if (src === undefined) continue;
                  if (src.trim() === '' || src === RE[p].source) delete next[p];
                  else next[p] = src.trim();
                }
                setCustomPatterns(next);
                try { localStorage.setItem(PATTERN_STORAGE_KEY, JSON.stringify(next)); } catch {}
                setPatternEditor(false);
                setEditDraft({});
                setEditErrors({});
              }}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <THead>
              <TR>
                <TH>Partner</TH>
                <TH>Regex Pattern</TH>
                <TH className="text-center">Status</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {PARTNERS.map((p) => {
                const defaultSrc = RE[p].source;
                const customSrc = customPatterns[p];
                const draftSrc = editDraft[p];
                const displaySrc = draftSrc !== undefined ? draftSrc : (customSrc ?? defaultSrc);
                const isCustom = customSrc !== undefined;
                const isDrafted = draftSrc !== undefined && draftSrc !== defaultSrc;
                const showCustomBadge = isDrafted || (isCustom && draftSrc === undefined);
                const err = editErrors[p];
                return (
                  <TR key={p}>
                    <TD className="whitespace-nowrap font-semibold text-gray-900">{p}</TD>
                    <TD>
                      <Input
                        type="text"
                        value={displaySrc}
                        className={cn('font-mono text-xs', err && 'border-danger-600 focus:border-danger-600 focus:ring-danger-600/30')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditDraft((d) => ({ ...d, [p]: val }));
                          setEditErrors((er) => { const n = { ...er }; delete n[p]; return n; });
                        }}
                      />
                      {err && <div className="mt-1 text-xs text-danger-600">{err}</div>}
                    </TD>
                    <TD className="text-center">
                      {showCustomBadge
                        ? <Badge tone="gold">CUSTOM</Badge>
                        : <span className="text-xs text-gray-400">default</span>}
                    </TD>
                    <TD>
                      {showCustomBadge && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditDraft((d) => ({ ...d, [p]: defaultSrc }));
                            setEditErrors((er) => { const n = { ...er }; delete n[p]; return n; });
                          }}
                        >
                          Reset
                        </Button>
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </div>
      </Modal>
    </div>
  );
}
