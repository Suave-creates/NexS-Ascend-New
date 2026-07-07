'use client';

import { useEffect, useRef, useState } from 'react';

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
  ShreeRajXpress:   /^SRLK\d{5,6}$/i,
  Lenskart:         /^SNXS\d{16}$/i,
  Courier_Unknown_1: GENERIC_AWB,
  Courier_Unknown_2: GENERIC_AWB,
  Courier_Unknown_3: GENERIC_AWB,
};

function validateForPartner(partner: Partner, awb: string) {
  return RE[partner].test((awb || '').trim());
}

/**
 * Detect which partner family an AWB belongs to.
 * Returns null if no match, or the detected Partner (first in family).
 * If the selected partner's family matches → no mismatch.
 */
function detectPartner(awb: string): Partner | null {
  const s = (awb || '').trim();
  for (const p of PARTNERS) if (RE[p].test(s)) return p;
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
  { courier: 'ShreeRajXpress', rule: 'SRLK + 5–6 digits',                 example: 'SRLK00750' },
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

  const triggerPulse = () => { setPulse(true); setTimeout(() => setPulse(false), 300); };

  useEffect(() => {
    const awbTrim = awb.trim().toUpperCase();
    if (!awbTrim || !personId || !armed || mismatchModal.show || duplicateModal.show) return;

    const timeout = setTimeout(() => {
      const detected = detectPartner(awbTrim);

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

      if (validateForPartner(partner, awbTrim)) {
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
  }, [awb, partner, personId, armed, mismatchModal.show, duplicateModal.show]);

  const clearAwbAndRefocus = () => {
    setAwb('');
    setTimeout(() => { if (armed && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, 0);
  };

  const successRate = counters.total > 0 ? Math.round((counters.valid / counters.total) * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --navy: #0f1a3e;
          --navy-mid: #1a2a5e;
          --accent: #e8ff3d;
          --accent-dim: rgba(232, 255, 61, 0.12);
          --green: #22c55e;
          --red: #ef4444;
          --amber: #f59e0b;
          --glass: rgba(255,255,255,0.04);
          --glass-border: rgba(255,255,255,0.10);
          --text: #f0f4ff;
          --text-muted: #8899cc;
          --card-bg: rgba(15, 26, 62, 0.85);
        }

        .ch-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .ch-root {
          font-family: 'Syne', sans-serif;
          background: var(--navy);
          min-height: 100vh;
          color: var(--text);
          background-image:
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(30,50,130,0.6) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(10,20,80,0.8) 0%, transparent 60%),
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px);
          padding: 0 0 60px;
        }

        /* ── TOP BAR ── */
        .ch-topbar {
          background: rgba(10,16,48,0.95);
          border-bottom: 1px solid var(--glass-border);
          padding: 14px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .ch-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ch-logo-mark {
          width: 32px; height: 32px;
          background: var(--accent);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
          flex-shrink: 0;
        }
        .ch-logo-text {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text);
        }
        .ch-logo-sub {
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.08em;
        }
        .ch-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-dim);
          border: 1px solid rgba(232,255,61,0.3);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          font-family: 'Space Mono', monospace;
          color: var(--accent);
        }
        .ch-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* ── LAYOUT ── */
        .ch-body { max-width: 1180px; margin: 0 auto; padding: 32px 24px 0; }

        .ch-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
        }

        /* ── CARD ── */
        .ch-card {
          background: var(--card-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          backdrop-filter: blur(16px);
          padding: 28px;
          position: relative;
          overflow: hidden;
        }
        .ch-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .ch-section-label {
          font-size: 10px;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ch-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--glass-border);
        }

        /* ── FORM ── */
        .ch-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .ch-field label {
          display: block;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .ch-select, .ch-input-text {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: var(--text);
          padding: 10px 14px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        .ch-select:focus, .ch-input-text:focus {
          border-color: rgba(232,255,61,0.5);
          box-shadow: 0 0 0 3px rgba(232,255,61,0.08);
        }
        .ch-select option { background: #0f1a3e; color: #f0f4ff; }

        .ch-select-wrap { position: relative; }
        .ch-select-wrap::after {
          content: '▾';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          font-size: 12px;
        }

        /* ── AWB INPUT ── */
        .ch-awb-wrap { position: relative; margin-bottom: 20px; }
        .ch-awb-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 2px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text);
          padding: 18px 52px 18px 20px;
          font-family: 'Space Mono', monospace;
          font-size: 22px;
          letter-spacing: 0.08em;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .ch-awb-input:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .ch-awb-input.armed {
          border-color: rgba(232,255,61,0.5);
          background: rgba(232,255,61,0.03);
          box-shadow: 0 0 0 4px rgba(232,255,61,0.06), inset 0 0 30px rgba(232,255,61,0.03);
        }
        .ch-awb-input.armed:focus {
          box-shadow: 0 0 0 4px rgba(232,255,61,0.12), inset 0 0 30px rgba(232,255,61,0.05);
        }
        .ch-awb-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          opacity: 0.4;
        }

        /* ── TOAST ── */
        .ch-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          padding: 12px 28px;
          border-radius: 40px;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          animation: toastIn 0.2s ease;
          white-space: nowrap;
          pointer-events: none;
        }
        .ch-toast.success {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.4);
          color: #86efac;
          box-shadow: 0 0 24px rgba(34,197,94,0.2);
        }
        .ch-toast.error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.4);
          color: #fca5a5;
          box-shadow: 0 0 24px rgba(239,68,68,0.2);
        }
        @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

        /* ── SCAN BUTTON ── */
        .ch-scan-btn {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 13px 20px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ch-scan-btn.start {
          background: var(--accent);
          color: var(--navy);
          box-shadow: 0 4px 20px rgba(232,255,61,0.3);
        }
        .ch-scan-btn.start:hover { box-shadow: 0 6px 28px rgba(232,255,61,0.45); transform: translateY(-1px); }
        .ch-scan-btn.stop {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.4);
          color: #fca5a5;
        }
        .ch-scan-btn.stop:hover { background: rgba(239,68,68,0.22); }
        .ch-scan-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        /* ── ERROR BANNER ── */
        .ch-error-banner {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          color: #fca5a5;
          font-size: 13px;
        }
        .ch-error-dismiss {
          background: rgba(239,68,68,0.3);
          border: none;
          border-radius: 6px;
          color: #fca5a5;
          padding: 4px 10px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .ch-error-dismiss:hover { background: rgba(239,68,68,0.45); }

        /* ── RIGHT PANEL ── */
        .ch-right { display: flex; flex-direction: column; gap: 20px; }

        /* ── COUNTER ── */
        .ch-counter-hero {
          text-align: center;
          padding: 8px 0 16px;
        }
        .ch-counter-num {
          font-family: 'Space Mono', monospace;
          font-size: 72px;
          font-weight: 700;
          line-height: 1;
          color: var(--accent);
          letter-spacing: -2px;
          transition: transform 0.15s;
        }
        .ch-counter-num.pulse { transform: scale(1.08); }
        .ch-counter-label {
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .ch-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .ch-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
        }
        .ch-stat-num {
          font-family: 'Space Mono', monospace;
          font-size: 28px;
          font-weight: 700;
        }
        .ch-stat-num.green { color: var(--green); }
        .ch-stat-num.amber { color: var(--amber); }
        .ch-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'Space Mono', monospace;
          margin-top: 2px;
        }

        /* Progress bar */
        .ch-progress-wrap {
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          height: 6px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .ch-progress-bar {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--green), #86efac);
          transition: width 0.4s ease;
        }
        .ch-progress-label {
          font-size: 10px;
          font-family: 'Space Mono', monospace;
          color: var(--text-muted);
          text-align: right;
          margin-bottom: 12px;
        }

        /* Partner chip */
        .ch-partner-chip {
          background: var(--accent-dim);
          border: 1px solid rgba(232,255,61,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--accent);
          letter-spacing: 0.05em;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ch-reset-btn {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: var(--text-muted);
          padding: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .ch-reset-btn:hover {
          background: rgba(255,255,255,0.08);
          color: var(--text);
        }

        /* ── FORMAT TABLE ── */
        .ch-formats { grid-column: 1 / -1; }
        .ch-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .ch-table th {
          background: rgba(255,255,255,0.05);
          padding: 8px 12px;
          text-align: left;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-transform: uppercase;
          border-bottom: 1px solid var(--glass-border);
        }
        .ch-table td {
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: var(--text);
        }
        .ch-table tr:last-child td { border-bottom: none; }
        .ch-table tr:hover td { background: rgba(255,255,255,0.03); }
        .ch-table .mono { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--accent); }

        /* ── MODAL ── */
        .ch-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 10, 30, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }
        .ch-modal {
          background: #111d4a;
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 36px 32px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          animation: modalIn 0.2s ease;
        }
        @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
        .ch-modal-icon { font-size: 42px; margin-bottom: 14px; line-height: 1; }
        .ch-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 10px;
        }
        .ch-modal-body {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .ch-modal-body b { color: var(--text); font-weight: 700; }
        .ch-modal-awb {
          font-family: 'Space Mono', monospace;
          font-size: 16px;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(232,255,61,0.2);
          border-radius: 8px;
          padding: 8px 16px;
          display: inline-block;
          margin: 8px 0 16px;
          letter-spacing: 0.08em;
        }
        .ch-modal-btns { display: flex; gap: 10px; justify-content: center; }
        .ch-btn {
          border: none;
          border-radius: 10px;
          padding: 11px 22px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.04em;
        }
        .ch-btn-ghost {
          background: rgba(255,255,255,0.07);
          color: var(--text-muted);
          border: 1px solid var(--glass-border);
        }
        .ch-btn-ghost:hover { background: rgba(255,255,255,0.12); color: var(--text); }
        .ch-btn-primary {
          background: var(--accent);
          color: var(--navy);
        }
        .ch-btn-primary:hover { box-shadow: 0 4px 16px rgba(232,255,61,0.3); transform: translateY(-1px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .ch-topbar { padding: 12px 16px; }
          .ch-body { padding: 16px 12px 0; }
          .ch-grid { grid-template-columns: 1fr; }
          .ch-formats { grid-column: 1; }
          .ch-form-row { grid-template-columns: 1fr; }
          .ch-counter-num { font-size: 56px; }
        }
      `}</style>

          <div
      className="ch-root"
      style={{
        backgroundImage: "url('/images/manual-warehouse-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
        {/* Top Bar */}
        <header className="ch-topbar">
          <div className="ch-logo">
            <div className="ch-logo-mark">CH</div>
            <div>
              <div className="ch-logo-text">Courier Handover</div>
              <div className="ch-logo-sub">AWB SCAN SYSTEM</div>
            </div>
          </div>
          <div className="ch-badge">
            <div className="ch-dot" />
            {armed ? 'SCANNING ACTIVE' : 'SYSTEM READY'}
          </div>
        </header>

        <main className="ch-body">
          <div className="ch-grid">

            {/* ── LEFT: Form ── */}
            <div className="ch-card">
              <div className="ch-section-label">Scan Configuration</div>

              {errorSticky && (
                <div className="ch-error-banner">
                  <span>❌ {errorSticky}</span>
                  <button className="ch-error-dismiss" onClick={() => { setErrorSticky(null); clearAwbAndRefocus(); }}>DISMISS</button>
                </div>
              )}

              <div className="ch-form-row">
                <div className="ch-field">
                  <label>Courier Partner</label>
                  <div className="ch-select-wrap">
                    <select
                      value={partner}
                      onChange={(e) => setPartner(e.target.value as Partner)}
                      className="ch-select"
                    >
                      {PARTNERS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="ch-field">
                  <label>Person ID (present)</label>
                  <input
                    type="text"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value.toUpperCase())}
                    placeholder="e.g. ARYA01"
                    className="ch-input-text"
                  />
                </div>
              </div>

              <div className="ch-field" style={{ marginBottom: 20 }}>
                <label>AWB / Barcode</label>
                <div className="ch-awb-wrap">
                  <input
                    ref={inputRef}
                    type="text"
                    value={awb}
                    onChange={(e) => setAwb(e.target.value.toUpperCase())}
                    onPaste={(e) => e.preventDefault()}
                    placeholder={armed ? 'Scan barcode here…' : 'Arm scanner to enable input'}
                    className={`ch-awb-input${armed ? ' armed' : ''}`}
                    disabled={!armed}
                  />
                  <span className="ch-awb-icon">{armed ? '⚡' : '🔒'}</span>
                </div>
              </div>

              <button
                className={`ch-scan-btn ${armed ? 'stop' : 'start'}`}
                onClick={() => { if (!partner || arming) return; setArmed((s) => !s); if (!armed) clearAwbAndRefocus(); }}
                disabled={!partner || arming}
              >
                {arming ? '⏳ Preparing…' : armed ? '⏸ Pause Scanning' : '▶ Start Scanning'}
              </button>
            </div>

            {/* ── RIGHT: Stats ── */}
            <div className="ch-right">
              <div className="ch-card">
                <div className="ch-section-label">Session Counter</div>

                <div className="ch-counter-hero">
                  <div className={`ch-counter-num${pulse ? ' pulse' : ''}`}>{counters.total}</div>
                  <div className="ch-counter-label">Total Scanned</div>
                </div>

                <div className="ch-stats-row">
                  <div className="ch-stat">
                    <div className="ch-stat-num green">{counters.valid}</div>
                    <div className="ch-stat-label">Valid</div>
                  </div>
                  <div className="ch-stat">
                    <div className="ch-stat-num amber">{counters.invalid}</div>
                    <div className="ch-stat-label">Invalid</div>
                  </div>
                </div>

                <div className="ch-progress-wrap">
                  <div className="ch-progress-bar" style={{ width: `${successRate}%` }} />
                </div>
                <div className="ch-progress-label">{successRate}% success rate</div>

                <div className="ch-partner-chip">
                  <span>📦</span>
                  <span>{partner}</span>
                </div>

                <button className="ch-reset-btn" onClick={() => setCounters({ valid: 0, invalid: 0, total: 0 })}>
                  ↺ Reset Counter
                </button>
              </div>
            </div>

            {/* ── BOTTOM: AWB Formats ── */}
            <div className="ch-card ch-formats">
              <div className="ch-section-label">AWB Format Reference</div>
              <table className="ch-table">
                <thead>
                  <tr>
                    <th>Courier</th>
                    <th>Format Rule</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {AWB_FORMATS.map((r) => (
                    <tr key={r.courier}>
                      <td style={{ fontWeight: 600 }}>{r.courier}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{r.rule}</td>
                      <td className="mono">{r.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>

        {/* Toast */}
        {msg && <div className={`ch-toast ${msg.type}`}>{msg.text}</div>}

        {/* Mismatch Modal */}
        {mismatchModal.show && (
          <div className="ch-overlay">
            <div className="ch-modal">
              <div className="ch-modal-icon">🚨</div>
              <div className="ch-modal-title">Partner Mismatch</div>
              <div className="ch-modal-awb">{mismatchModal.awb}</div>
              <div className="ch-modal-body">
                This shipment belongs to <b>{mismatchModal.detected ?? 'Unknown'}</b>,
                but you're scanning under <b>{partner}</b>.
              </div>
              <div className="ch-modal-btns">
                <button className="ch-btn ch-btn-ghost" onClick={() => { setMismatchModal({ show: false, awb: '', detected: null }); clearAwbAndRefocus(); }}>
                  Dismiss
                </button>
                {mismatchModal.detected && (
                  <button className="ch-btn ch-btn-primary" onClick={() => { setPartner(mismatchModal.detected!); setMismatchModal({ show: false, awb: '', detected: null }); clearAwbAndRefocus(); }}>
                    Switch to {mismatchModal.detected}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Modal */}
        {duplicateModal.show && (
          <div className="ch-overlay">
            <div className="ch-modal">
              <div className="ch-modal-icon">⚠️</div>
              <div className="ch-modal-title">Duplicate Scan</div>
              <div className="ch-modal-awb">{duplicateModal.awb}</div>
              <div className="ch-modal-body">
                This AWB was already recorded in this session.<br />
                The latest scan has overwritten the previous record.
              </div>
              <div className="ch-modal-btns">
                <button className="ch-btn ch-btn-primary" onClick={() => { setDuplicateModal({ show: false, awb: '' }); clearAwbAndRefocus(); }}>
                  OK, Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}