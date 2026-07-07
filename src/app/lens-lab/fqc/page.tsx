"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────────────────
const AGENT_URL =
  process.env.NEXT_PUBLIC_AGENT_URL ?? "http://127.0.0.1:13131";

// ─────────────────────────────────────────────────────────
//  CSS (unified design tokens — brand-700 navy, gold/good/notice/danger)
// ─────────────────────────────────────────────────────────
const CSS = `
  .fqc-root{
    --navy:var(--color-brand-700); --navy-d:var(--color-brand-800); --navy-l:var(--color-brand-600);
    --accent:var(--color-gold-500); --red:var(--color-danger-600); --red-bg:var(--color-danger-50);
    --orange:var(--color-notice-600); --orange-bg:var(--color-notice-50);
    --green:var(--color-good-600); --green-bg:var(--color-good-50);
    --border:var(--color-brand-200); --text:var(--color-brand-900); --muted:var(--color-brand-400);
    --bg:var(--color-brand-50); --white:#fff;
  }
  .fqc-root *{box-sizing:border-box}

  .fqc-root{min-height:100vh;display:flex;flex-direction:column;font-size:13px;font-family:var(--font-sans);color:var(--text)}

  .fqc-header{background:var(--navy-d);color:var(--white);padding:0 20px;height:54px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid var(--accent);position:sticky;top:0;z-index:100;gap:14px}
  .fqc-header-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;letter-spacing:.3px}
  .fqc-header-brand span.badge{background:var(--accent);color:var(--navy-d);font-size:10px;font-weight:800;padding:2px 6px;border-radius:3px;letter-spacing:1px}
  .fqc-header-scan{flex:1;max-width:340px;display:flex;gap:8px;align-items:center}
  .fqc-header-scan input{flex:1;height:32px;border:1.5px solid var(--navy-l);border-radius:5px;background:rgba(255,255,255,.08);color:var(--white);padding:0 10px;font-size:13px;outline:none;font-family:'DM Mono',monospace}
  .fqc-header-scan input::placeholder{color:rgba(255,255,255,.35)}
  .fqc-header-scan input:focus{border-color:var(--accent);background:rgba(255,255,255,.13)}
  .fqc-header-scan input.auto-loaded{border-color:var(--green) !important;background:rgba(26,122,74,.15) !important}

  .op-badge{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);border:1px solid var(--navy-l);border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;color:var(--white)}
  .op-badge:hover{background:rgba(255,255,255,.12)}
  .op-badge .grade{background:var(--accent);color:var(--navy-d);font-weight:800;font-size:10px;padding:1px 6px;border-radius:3px;letter-spacing:.5px}

  .ap-toggle{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);border:1px solid var(--navy-l);border-radius:6px;padding:4px 10px;font-size:10px;cursor:pointer;color:var(--white);user-select:none;letter-spacing:.4px;text-transform:uppercase;font-weight:700}
  .ap-toggle:hover{background:rgba(255,255,255,.12)}
  .ap-toggle.on{background:rgba(26,122,74,.25);border-color:var(--green)}
  .ap-toggle .switch{width:24px;height:14px;border-radius:7px;background:rgba(255,255,255,.2);position:relative;transition:background .15s}
  .ap-toggle .switch::after{content:'';position:absolute;top:1px;left:1px;width:12px;height:12px;border-radius:50%;background:#fff;transition:left .15s}
  .ap-toggle.on .switch{background:var(--green)}
  .ap-toggle.on .switch::after{left:11px}

  .ap-countdown{position:fixed;inset:0;background:rgba(26,122,74,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:1500;color:#fff;cursor:pointer;animation:apFadeIn .15s ease-out}
  .ap-countdown .ap-icon{font-size:80px;margin-bottom:10px;animation:apPulse 1.2s ease-in-out infinite}
  .ap-countdown .ap-title{font-size:32px;font-weight:900;letter-spacing:2px;margin-bottom:6px}
  .ap-countdown .ap-sub{font-size:14px;opacity:.85;margin-bottom:20px}
  .ap-countdown .ap-cancel{font-size:11px;opacity:.7;letter-spacing:1px;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.5);padding:8px 18px;border-radius:6px;font-weight:700}
  @keyframes apFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes apPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}

  .device-status{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,.65)}
  .device-dot{width:8px;height:8px;border-radius:50%;background:#888;flex-shrink:0}
  .device-dot.connected{background:#2ecc71;animation:blink 1.5s infinite}
  .device-dot.waiting{background:var(--orange);animation:blink .8s infinite}
  .device-dot.offline{background:#888}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}

  .fqc-pill-bar{background:var(--navy);color:var(--white);padding:8px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.08);font-size:12px;flex-wrap:wrap}
  .fqc-pill{background:rgba(255,255,255,.1);border-radius:20px;padding:3px 12px;display:flex;gap:6px;align-items:center}
  .fqc-pill .label{color:rgba(255,255,255,.55);font-size:10px;text-transform:uppercase;letter-spacing:.5px}
  .fqc-pill .value{font-weight:600;color:var(--white)}

  .fqc-body{flex:1;padding:14px 18px;display:flex;flex-direction:column;gap:12px;max-width:1600px;width:100%;margin:0 auto}

  .capture-bar{background:var(--white);border:1.5px solid var(--border);border-radius:10px;padding:11px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 1px 4px rgba(31,41,92,.06)}
  .capture-info{display:flex;align-items:center;gap:14px;font-size:13px}
  .capture-info .lbl{font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px;font-size:11px}
  .capture-info .meta{color:var(--muted);font-family:'DM Mono',monospace;font-size:12px}
  .capture-info .meta.warn{color:var(--orange);font-weight:600}
  .capture-info .meta.ok{color:var(--green);font-weight:600}
  .recapture-btn{height:32px;padding:0 14px;border:1.5px solid var(--navy-l);border-radius:6px;background:var(--white);color:var(--navy);font-size:11px;font-weight:700;letter-spacing:.5px;cursor:pointer}
  .recapture-btn:hover{background:var(--navy);color:var(--white)}

  .lens-grid-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media (max-width:1100px){.lens-grid-row{grid-template-columns:1fr}}

  .lens-panel{background:var(--white);border-radius:10px;border:1.5px solid var(--border);overflow:hidden;box-shadow:0 1px 4px rgba(31,41,92,.06);display:flex;flex-direction:column}
  .lens-panel-header{padding:9px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
  .lens-panel-header.right-hdr{background:linear-gradient(90deg,#eef1fb 0%,#f8f9fd 100%)}
  .lens-panel-header.left-hdr{background:linear-gradient(90deg,#f5f3ff 0%,#f8f9fd 100%)}
  .lens-side-label{font-weight:800;font-size:13px;letter-spacing:1px;color:var(--navy);display:flex;align-items:center;gap:8px}
  .lens-side-dot{width:8px;height:8px;border-radius:50%}
  .dot-right{background:var(--navy)}.dot-left{background:#7c3aed}
  .cat-badge{font-size:9px;font-weight:800;letter-spacing:.6px;background:var(--navy);color:var(--white);padding:2px 7px;border-radius:3px;text-transform:uppercase}

  .lens-prescription{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-bottom:1px solid var(--border)}
  .lens-field{background:var(--white);padding:7px 10px;display:flex;flex-direction:column;gap:2px}
  .lens-field .lf-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;font-weight:600}
  .lens-field .lf-value{font-size:14px;font-weight:700;color:var(--text);font-family:'DM Mono',monospace}
  .lens-field .lf-value.na{color:var(--muted);font-weight:400;font-size:13px}
  .lens-field.wide{grid-column:span 2}

  .lensometer-section{padding:12px 14px;background:#fafbfd;border-bottom:1px solid var(--border)}
  .lensometer-title{font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.8px;margin-bottom:9px;display:flex;align-items:center;gap:6px}
  .lensometer-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .lm-field{display:flex;flex-direction:column;gap:3px}
  .lm-field label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;font-weight:600;display:flex;justify-content:space-between;gap:6px}
  .lm-field label .exp{color:var(--muted);font-weight:600;font-family:'DM Mono',monospace;text-transform:none;letter-spacing:0;white-space:nowrap}
  .lm-field label .exp .tol{color:var(--navy-l);font-weight:700}

  .lm-readout{height:34px;border:1.5px solid var(--border);border-radius:6px;padding:0 8px;display:flex;align-items:center;justify-content:center;font-size:14px;font-family:'DM Mono',monospace;font-weight:700;color:var(--text);background:var(--white)}
  .lm-readout.empty{color:var(--muted);font-weight:400;background:#fafafd;border-style:dashed}
  .lm-readout.ok{border-color:var(--green);background:var(--green-bg);color:var(--green)}
  .lm-readout.warn{border-color:var(--orange);background:var(--orange-bg);color:var(--orange)}
  .lm-readout.mismatch{border-color:var(--red);background:var(--red-bg);color:var(--red)}

  .live-badge{background:rgba(26,122,74,.12);color:var(--green);border:1px solid var(--green);border-radius:4px;font-size:10px;font-weight:700;padding:1px 7px;letter-spacing:.5px}
  .waiting-badge{background:rgba(232,101,10,.1);color:var(--orange);border:1px solid var(--orange);border-radius:4px;font-size:10px;font-weight:700;padding:1px 7px;letter-spacing:.5px;animation:blink 1s infinite}

  .auto-qc{margin-top:10px;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:8px;letter-spacing:.4px}
  .auto-qc.pass{background:var(--green-bg);color:var(--green);border:1px solid var(--green)}
  .auto-qc.fail{background:var(--red-bg);color:var(--red);border:1px solid var(--red)}
  .auto-qc.idle{background:#fafbfd;color:var(--muted);border:1px dashed var(--border)}

  .decision-bar{background:var(--white);border-radius:10px;border:1.5px solid var(--border);padding:14px 16px;display:flex;flex-direction:column;gap:12px;box-shadow:0 1px 4px rgba(31,41,92,.06)}
  .sec-label{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px}
  .disposition-group{display:flex;gap:8px;flex-wrap:wrap}
  .disp-btn{flex:1;min-width:120px;height:42px;border-radius:7px;border:2px solid transparent;font-size:12px;font-weight:800;letter-spacing:1px;cursor:pointer;outline:none}
  .disp-btn.pass{background:var(--white);border-color:var(--green);color:var(--green)}
  .disp-btn.pass.active,.disp-btn.pass:hover:not(:disabled){background:var(--green);color:var(--white)}
  .disp-btn.hold{background:var(--white);border-color:var(--orange);color:var(--orange)}
  .disp-btn.hold.active,.disp-btn.hold:hover:not(:disabled){background:var(--orange);color:var(--white)}
  .disp-btn.fail{background:var(--white);border-color:var(--red);color:var(--red)}
  .disp-btn.fail.active,.disp-btn.fail:hover:not(:disabled){background:var(--red);color:var(--white)}
  .disp-btn:disabled{opacity:.35;cursor:not-allowed}
  .disp-btn.locked{position:relative;opacity:.35;cursor:not-allowed}
  .disp-btn.locked::after{content:'🔒';position:absolute;top:4px;right:6px;font-size:11px;opacity:.8}

  .grade-lock{background:var(--orange-bg);border-left:3px solid var(--orange);padding:9px 12px;border-radius:0 7px 7px 0;font-size:12px;color:var(--orange);font-weight:600;display:flex;align-items:flex-start;gap:8px;line-height:1.4}
  .grade-lock strong{font-weight:800;text-transform:uppercase;letter-spacing:.5px;font-size:11px;flex-shrink:0}

  .qcf-block{display:flex;flex-direction:column;gap:6px}
  .dept-radios{display:flex;gap:6px;flex-wrap:wrap}
  .dept-radio{display:none}
  .dept-label{padding:4px 12px;border-radius:18px;border:1.5px solid var(--border);cursor:pointer;font-size:10px;font-weight:700;letter-spacing:.4px;color:var(--muted)}
  .dept-radio:checked+.dept-label{border-color:var(--navy);background:var(--navy);color:var(--white)}
  .qcf-reason-select{width:100%;height:34px;border:1.5px solid var(--border);border-radius:6px;padding:0 10px;font-size:12px;color:var(--text);background:var(--white);outline:none}
  .fail-side-row{display:flex;gap:6px}
  .fail-side-row .fs-btn{flex:1;height:32px;border:1.5px solid var(--border);border-radius:6px;background:var(--white);color:var(--muted);font-size:11px;font-weight:700;cursor:pointer}
  .fail-side-row .fs-btn.active{background:var(--red);color:var(--white);border-color:var(--red)}
  .remarks-textarea{width:100%;height:48px;border:1.5px solid var(--border);border-radius:6px;padding:8px 10px;font-size:12px;font-family:inherit;color:var(--text);resize:none;outline:none}

  .submit-bar{position:sticky;bottom:0;background:var(--white);border:1.5px solid var(--border);border-radius:10px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 -2px 8px rgba(31,41,92,.06);gap:12px;flex-wrap:wrap}
  .submit-summary{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;align-items:center}
  .summary-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:7px;font-weight:700;border:1.5px solid var(--border);background:var(--bg);color:var(--muted)}
  .summary-chip.pass{background:var(--green-bg);border-color:var(--green);color:var(--green)}
  .summary-chip.fail{background:var(--red-bg);border-color:var(--red);color:var(--red)}
  .submit-btn{height:46px;padding:0 28px;background:var(--navy-d);color:var(--white);border:none;border-radius:7px;font-size:14px;font-weight:800;letter-spacing:1px;cursor:pointer}
  .submit-btn:hover:not(:disabled){background:var(--navy-l)}
  .submit-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed}

  .modal-overlay{position:fixed;inset:0;background:rgba(21,29,66,.7);display:flex;align-items:center;justify-content:center;z-index:1000}
  .modal-card{background:var(--white);border-radius:12px;padding:28px 32px;max-width:420px;width:90%;box-shadow:0 16px 48px rgba(0,0,0,.25)}
  .modal-card h3{margin:0 0 4px;color:var(--navy-d);font-size:18px;font-weight:800}
  .modal-card p{color:var(--muted);font-size:13px;margin-bottom:18px}
  .modal-row{margin-bottom:14px}
  .modal-row label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:700;margin-bottom:5px}
  .modal-row input,.modal-row select{width:100%;height:38px;border:1.5px solid var(--border);border-radius:6px;padding:0 10px;font-size:13px;font-family:inherit;outline:none;background:var(--white)}
  .modal-row input:focus,.modal-row select:focus{border-color:var(--navy)}
  .modal-btn{width:100%;height:42px;background:var(--navy-d);color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:800;letter-spacing:1px;cursor:pointer}
  .modal-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed}

  .toast-overlay{position:fixed;inset:0;background:rgba(21,29,66,.65);display:flex;align-items:center;justify-content:center;z-index:999}
  .toast-card{background:var(--white);border-radius:14px;padding:32px 36px;text-align:center;max-width:480px;width:90%;box-shadow:0 16px 48px rgba(0,0,0,.25)}
  .toast-icon{font-size:42px;margin-bottom:10px}
  .toast-title{font-size:20px;font-weight:900;color:var(--navy-d);margin-bottom:6px}
  .toast-sub{font-size:13px;color:var(--muted);margin-bottom:18px}
  .lens-result-row{display:flex;gap:10px;margin-bottom:16px;justify-content:center;flex-wrap:wrap}
  .lens-result-chip{padding:6px 16px;border-radius:7px;font-size:12px;font-weight:800;display:flex;flex-direction:column;gap:2px;align-items:center;min-width:110px}
  .lens-result-chip .lrc-side{font-size:10px;opacity:.75;letter-spacing:.5px}
  .chip-pass{background:var(--green-bg);color:var(--green);border:1.5px solid var(--green)}
  .chip-fail{background:var(--red-bg);color:var(--red);border:1.5px solid var(--red)}
  .toast-meta{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:20px}
  .toast-pill{background:var(--bg);border-radius:6px;padding:5px 14px;font-size:12px}
  .toast-pill .tp-label{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.5px}
  .toast-pill .tp-val{font-weight:800;color:var(--navy);font-size:14px;font-family:'DM Mono',monospace}
  .toast-next-btn{width:100%;height:42px;background:var(--navy-d);color:var(--white);border:none;border-radius:7px;font-size:14px;font-weight:800;cursor:pointer}

  .empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 20px;text-align:center;color:var(--muted)}
  .empty-state svg{opacity:.2;margin-bottom:14px}
  .empty-state h3{font-size:16px;font-weight:700;color:var(--navy);margin-bottom:6px}
  .empty-state p{font-size:13px}
  .loading-bar{height:3px;background:linear-gradient(90deg,var(--navy) 0%,var(--accent) 50%,var(--navy) 100%);background-size:200%;animation:shimmer 1s infinite}
  @keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}
  .error-bar{background:var(--red-bg);border-left:3px solid var(--red);padding:10px 14px;border-radius:0 7px 7px 0;font-size:13px;color:var(--red);font-weight:600}
  .agent-warning{background:var(--orange-bg);border-left:3px solid var(--orange);padding:10px 14px;border-radius:0 7px 7px 0;font-size:12px;color:var(--orange);font-weight:600}
  .agent-warning a{color:var(--orange);text-decoration:underline}
`;

// ─────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────
const DEPARTMENTS = ["SURFACING", "COATING", "CALCULATION", "FQC"] as const;
type Dept = typeof DEPARTMENTS[number];

const QCF_REASONS: Record<Dept, string[]> = {
  SURFACING: [
    "Add. Wrong Power", "Axis Wrong", "Base Interchange", "Blank Interchange",
    "Cly. Wrong Power", "Concentric Circle", "Improper Grooving", "Orbit Not Process",
    "Polish Mark", "Power Interchange", "Power Wrong", "Sph. Wrong Power",
    "Surfacing Scratch", "Tool Dot", "Without Polish", "Without Engraving",
    "Wrong Blank", "Wrong Engraving", "Wrong Generation", "Wrong Prizm",
    "Double Engraving", "Centration issue",
  ],
  COATING: [
    "Broken", "Dot", "Lens Bend", "Lens Interchange", "Mismatch", "Roughness",
    "Surface Damage", "Trail", "Vibration", "Multiple Rework- Roughness",
    "Multiple Rework Dot", "Deep Scratch", "Multiple Rework- Scratch",
    "Multiple Rework- Dust", "Crack", "Multiple Rework Hc", "Decoating damage",
    "Damage", "Dust", "Machine Accident", "Lacker flow", "Lost", "Others",
  ],
  CALCULATION: ["Same Lense"],
  FQC: ["Lost", "Others"],
};

// ─────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────
interface PowerRow {
  order_id: string | null;
  product_id: string | null;
  right_lens: string | null;
  axis: number | null;
  sph: number | null;
  lens_height: number | null;
  lens_width: number | null;
  cyl: number | null;
  ap: number | null;
  bottom_distance: number | null;
  edge_distance: number | null;
  effective_dia: number | null;
  lens_index: string | null;
  lensname: string | null;
  lenstype: string | null;
  coating: string | null;
}

interface FetchedData {
  fitting_id: string;
  order_id:   string;
  right:      PowerRow | null;
  left:       PowerRow | null;
}

interface AgentReading {
  printNo:    string;
  receivedAt: string;
  R?: { s: number; c: number; a: number; add: number };
  L?: { s: number; c: number; a: number; add: number };
}

type QcStatus = "PASS" | "HOLD" | "FAIL";
type FailSide = "LEFT" | "RIGHT" | "BOTH";

interface DecisionState {
  status:   QcStatus | null;
  dept:     Dept | null;
  reason:   string;
  failSide: FailSide | null;
  remarks:  string;
}
const defaultDecision = (): DecisionState =>
  ({ status: null, dept: null, reason: "", failSide: null, remarks: "" });

interface Operator { id: string; grade: 1 | 2 }

// ─────────────────────────────────────────────────────────
//  Tolerance chart
// ─────────────────────────────────────────────────────────
type LensCategory = "PROGRESSIVE" | "SV_BIFOCAL";

function detectLensCategory(presc: PowerRow | null): LensCategory {
  const text = [presc?.lenstype, presc?.lensname, presc?.coating]
    .filter(Boolean).join(" ").toLowerCase();
  if (text.includes("progressive")) return "PROGRESSIVE";
  return "SV_BIFOCAL";
}

function sphTol(prescSph: number, cat: LensCategory): number {
  const a = Math.abs(prescSph);
  if (cat === "PROGRESSIVE") return a <= 8.0 ? 0.16 : a * 0.02;
  if (a <= 3.0) return 0.13;
  if (a <= 6.0) return 0.15;
  return 0.18;
}

function cylTol(prescCyl: number, cat: LensCategory): number {
  const a = Math.abs(prescCyl);
  if (cat === "PROGRESSIVE") {
    if (a <= 2.0)  return 0.16;
    if (a <= 3.5)  return 0.18;
    return 0.17;
  }
  if (a <= 2.0) return 0.15;
  return 0.16;
}

function axisTol(prescCyl: number): number {
  const a = Math.abs(prescCyl);
  if (a <= 0.25) return 14;
  if (a <= 0.50) return 7;
  if (a <= 0.75) return 5;
  if (a <= 1.50) return 3;
  return 2;
}

function apTol(_prescAp: number, _cat: LensCategory): number { return 0.18; }

function axisDiff(p: number, m: number): number {
  const d = Math.abs(p - m) % 180;
  return Math.min(d, 180 - d);
}

// ─────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────
function fmt(v: number | null | undefined, decimals = 2): string {
  if (v === null || v === undefined || typeof v !== "number" || !Number.isFinite(v)) return "—";
  return v >= 0 ? `+${v.toFixed(decimals)}` : v.toFixed(decimals);
}

type FieldState = "" | "ok" | "warn" | "mismatch";

function checkValue(prescribed: number | null, measured: number | null, tol: number): FieldState {
  if (measured === null || prescribed === null) return "";
  return Math.abs(prescribed - measured) > tol ? "mismatch" : "ok";
}

function checkAxis(prescribed: number | null, measured: number | null, tol: number): FieldState {
  if (measured === null || prescribed === null) return "";
  const diff = axisDiff(prescribed, measured);
  if (diff > tol) return "mismatch";
  if (diff > Math.max(tol - 2, 0)) return "warn";
  return "ok";
}

function parseRows(rows: PowerRow[]): { right: PowerRow | null; left: PowerRow | null } {
  const right = rows.find(r => r.right_lens === "R" || r.right_lens === "1" || r.right_lens === "right") ?? null;
  const left  = rows.find(r => r.right_lens === "L" || r.right_lens === "0" || r.right_lens === "left")  ?? null;
  if (!right && !left && rows.length >= 2) return { right: rows[0], left: rows[1] };
  if (!right && !left && rows.length === 1) return { right: rows[0], left: null };
  return { right, left };
}

function toMeasurement(eye: AgentReading["R"]) {
  if (!eye) return null;
  return { sph: eye.s, cyl: eye.c, axis: eye.a, ap: eye.add };
}

function evaluateEye(
  presc: PowerRow | null,
  m: { sph: number; cyl: number; axis: number; ap: number | null } | null,
): { status: "PASS" | "FAIL"; failed: string[] } | null {
  if (!presc || !m) return null;
  const failed: string[] = [];
  const cat = detectLensCategory(presc);

  if (presc.sph !== null && Math.abs(presc.sph - m.sph) > sphTol(presc.sph, cat)) failed.push("SPH");
  if (presc.cyl !== null && Math.abs(presc.cyl - m.cyl) > cylTol(presc.cyl, cat)) failed.push("CYL");

  const cylSmall = Math.abs(presc.cyl ?? 0) < 0.25 && Math.abs(m.cyl) < 0.25;
  if (!cylSmall && presc.axis !== null && axisDiff(presc.axis, m.axis) > axisTol(presc.cyl ?? 0)) {
    failed.push("AXIS");
  }

  if (presc.ap !== null && presc.ap > 0 && m.ap !== null
      && Math.abs(presc.ap - m.ap) > apTol(presc.ap, cat)) {
    failed.push("AP");
  }

  return { status: failed.length ? "FAIL" : "PASS", failed };
}

// ─────────────────────────────────────────────────────────
//  Lens Panel
// ─────────────────────────────────────────────────────────
function LensPanel({
  side, presc, reading, deviceConnected,
}: {
  side: "RIGHT" | "LEFT";
  presc: PowerRow | null;
  reading: { sph: number; cyl: number; axis: number; ap: number | null } | null;
  deviceConnected: boolean;
}) {
  if (!presc) {
    return (
      <div className="lens-panel">
        <div className={`lens-panel-header ${side === "RIGHT" ? "right-hdr" : "left-hdr"}`}>
          <div className="lens-side-label">
            <span className={`lens-side-dot ${side === "RIGHT" ? "dot-right" : "dot-left"}`} />
            {side} LENS
          </div>
        </div>
        <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 12 }}>
          No {side} lens prescription found for this order
        </div>
      </div>
    );
  }

  const cat   = detectLensCategory(presc);
  const sphT  = presc.sph  !== null ? sphTol(presc.sph,  cat) : 0.13;
  const cylT  = presc.cyl  !== null ? cylTol(presc.cyl,  cat) : 0.15;
  const axisT = presc.cyl  !== null ? axisTol(presc.cyl)      : 5;
  const apT   = presc.ap   !== null ? apTol(presc.ap,   cat)  : 0.18;

  const sphState = checkValue(presc.sph, reading?.sph ?? null, sphT);
  const cylState = checkValue(presc.cyl, reading?.cyl ?? null, cylT);

  const cylSmall = Math.abs(presc.cyl ?? 0) < 0.25 && Math.abs(reading?.cyl ?? 0) < 0.25;
  const axisState: FieldState = cylSmall
    ? ""
    : checkAxis(presc.axis, reading?.axis ?? null, axisT);

  const apState = (presc.ap !== null && presc.ap > 0)
    ? checkValue(presc.ap, reading?.ap ?? null, apT)
    : "";

  const states = [sphState, cylState, axisState, apState];
  const hasReading = !!reading;
  const allOk      = hasReading && states.every(s => s === "" || s === "ok");
  const anyFail    = hasReading && states.some(s => s === "mismatch");

  const fields: Array<{
    key: "sph"|"cyl"|"axis"|"ap"; label: string; state: FieldState;
    expected: string; tol: string; measured: string;
  }> = [
    { key: "sph",  label: "SPH",  state: sphState,
      expected: fmt(presc.sph),
      tol:      `±${sphT.toFixed(2)}`,
      measured: reading ? fmt(reading.sph) : "—" },
    { key: "cyl",  label: "CYL",  state: cylState,
      expected: fmt(presc.cyl),
      tol:      `±${cylT.toFixed(2)}`,
      measured: reading ? fmt(reading.cyl) : "—" },
    { key: "axis", label: "AXIS", state: axisState,
      expected: presc.axis != null ? `${presc.axis}°` : "—",
      tol:      cylSmall ? "n/a" : `±${axisT}°`,
      measured: reading ? `${reading.axis}°` : "—" },
    { key: "ap",   label: "AP",   state: apState,
      expected: fmt(presc.ap),
      tol:      (presc.ap !== null && presc.ap > 0) ? `±${apT.toFixed(2)}` : "n/a",
      measured: reading?.ap !== undefined && reading?.ap !== null ? fmt(reading.ap) : "—" },
  ];

  return (
    <div className="lens-panel">
      <div className={`lens-panel-header ${side === "RIGHT" ? "right-hdr" : "left-hdr"}`}>
        <div className="lens-side-label">
          <span className={`lens-side-dot ${side === "RIGHT" ? "dot-right" : "dot-left"}`} />
          {side} LENS
          <span className="cat-badge" title="Tolerance set in use">
            {cat === "PROGRESSIVE" ? "PROG" : "SV/BF"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{presc.lenstype ?? "—"}</span>
          {presc.lens_index && <span style={{ fontSize: 11, color: "var(--navy)", fontWeight: 700 }}>IDX {presc.lens_index}</span>}
        </div>
      </div>

      <div className="lens-prescription">
        {[
          ["SPH",   fmt(presc.sph)],
          ["CYL",   fmt(presc.cyl)],
          ["AXIS",  presc.axis != null ? `${presc.axis}°` : "—"],
          ["AP",    fmt(presc.ap)],
          ["A (W)", presc.lens_width  != null ? `${presc.lens_width}mm`  : "—"],
          ["B (H)", presc.lens_height != null ? `${presc.lens_height}mm` : "—"],
          ["ED",    presc.effective_dia != null ? `${presc.effective_dia}mm` : "—"],
          ["ED-D",  presc.edge_distance != null ? `${presc.edge_distance}mm` : "—"],
        ].map(([label, value]) => (
          <div className="lens-field" key={label as string}>
            <span className="lf-label">{label}</span>
            <span className={`lf-value${value === "—" ? " na" : ""}`}>{value}</span>
          </div>
        ))}
        <div className="lens-field wide">
          <span className="lf-label">Lens Name</span>
          <span className="lf-value" style={{ fontSize: 12 }}>{presc.lensname ?? "—"}</span>
        </div>
        <div className="lens-field wide">
          <span className="lf-label">Coating</span>
          <span className="lf-value" style={{ fontSize: 11, fontWeight: 600 }}>{presc.coating ?? "—"}</span>
        </div>
      </div>

      <div className="lensometer-section">
        <div className="lensometer-title">
          <span className={`device-dot ${deviceConnected ? "connected" : "waiting"}`} />
          CCQ-AutoFocimeter
          {deviceConnected ? <span className="live-badge">LIVE</span> : <span className="waiting-badge">WAITING</span>}
        </div>
        <div className="lensometer-row">
          {fields.map(f => (
            <div className="lm-field" key={f.key}>
              <label>
                <span>{f.label}</span>
                <span className="exp">
                  exp {f.expected} <span className="tol">{f.tol}</span>
                </span>
              </label>
              <div className={`lm-readout${!hasReading ? " empty" : ""}${f.state ? " " + f.state : ""}`}>
                {f.measured}
              </div>
            </div>
          ))}
        </div>

        {!hasReading ? (
          <div className="auto-qc idle">⏳ Waiting for lensmeter reading…</div>
        ) : allOk ? (
          <div className="auto-qc pass">✓ Auto-check: all measurements within tolerance</div>
        ) : anyFail ? (
          <div className="auto-qc fail">
            ✗ Auto-check failed:&nbsp;
            {fields.filter(f => f.state === "mismatch").map(f => f.label).join(", ")}
          </div>
        ) : (
          <div className="auto-qc idle">— partial reading; review carefully</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Operator login modal
// ─────────────────────────────────────────────────────────
function OperatorModal({ initial, onSave }: { initial?: Operator; onSave: (op: Operator) => void }) {
  const [id, setId] = useState(initial?.id ?? "");
  const [grade, setGrade] = useState<1 | 2>(initial?.grade ?? 1);
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Operator Login</h3>
        <p>Enter your operator ID and grade. This is required to record QC inspections.</p>
        <div className="modal-row">
          <label>Operator ID</label>
          <input value={id} autoFocus onChange={e => setId(e.target.value)} placeholder="e.g. OP123" maxLength={50} />
        </div>
        <div className="modal-row">
          <label>Grade</label>
          <select value={grade} onChange={e => setGrade(Number(e.target.value) as 1 | 2)}>
            <option value={1}>Grade 1</option>
            <option value={2}>Grade 2</option>
          </select>
        </div>
        <button
          className="modal-btn"
          disabled={!id.trim()}
          onClick={() => onSave({ id: id.trim(), grade })}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Main page
// ─────────────────────────────────────────────────────────
export default function FQCPage() {
  // Operator
  const [operator, setOperator] = useState<Operator | null>(null);
  const [showOpModal, setShowOpModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("fqc_operator");
      if (raw) {
        const op = JSON.parse(raw);
        if (op?.id && (op.grade === 1 || op.grade === 2)) {
          setOperator(op);
          return;
        }
      }
    } catch {}
    setShowOpModal(true);
  }, []);

  const saveOperator = (op: Operator) => {
    setOperator(op);
    setShowOpModal(false);
    try { sessionStorage.setItem("fqc_operator", JSON.stringify(op)); } catch {}
  };

  // Auto-Pass toggle
  const [autoPass, setAutoPass] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const v = sessionStorage.getItem("fqc_auto_pass");
      if (v === "1") setAutoPass(true);
    } catch {}
  }, []);
  const toggleAutoPass = () => {
    setAutoPass(prev => {
      const next = !prev;
      try { sessionStorage.setItem("fqc_auto_pass", next ? "1" : "0"); } catch {}
      return next;
    });
  };

  const [autoPassCountdown, setAutoPassCountdown] = useState(false);
  const autoPassTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPassFiredRef = useRef<string | null>(null);
  const operatorTouchedRef = useRef(false);

  const cancelAutoPass = useCallback(() => {
    if (autoPassTimerRef.current) {
      clearTimeout(autoPassTimerRef.current);
      autoPassTimerRef.current = null;
    }
    setAutoPassCountdown(false);
  }, []);

  // Scan
  const [fittingIdInput, setFittingIdInput] = useState("");
  const [fetchedData, setFetchedData] = useState<FetchedData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Reading from agent — populated ONLY by post-load SSE events. We never
  // pre-fill from the agent's last reading; that would carry the previous
  // inspection's measurement into this one.
  const [reading, setReading] = useState<AgentReading | null>(null);

  const [agentConnected,  setAgentConnected]  = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);

  // Whether the next reading should overwrite our state.
  // Set true on fitting load + Recapture; cleared after one consumption.
  const armedRef = useRef(false);

  const [decision, setDecision] = useState<DecisionState>(defaultDecision());
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | {
    record_id: string | null;
    qc_status: QcStatus;
    fail_side: FailSide | null;
    right?: { status: "PASS" | "FAIL"; failed: string[] } | null;
    left?:  { status: "PASS" | "FAIL"; failed: string[] } | null;
  }>(null);

  // ─── SSE: open ONCE ───────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    let es: EventSource | null = null;
    let retryT: ReturnType<typeof setTimeout> | null = null;

    const open = () => {
      try { es = new EventSource(`${AGENT_URL}/api/stream`); }
      catch { retryT = setTimeout(open, 5000); return; }

      es.onopen = () => setAgentConnected(true);
      es.addEventListener("status", e => {
        try { setDeviceConnected(!!JSON.parse((e as MessageEvent).data).connected); } catch {}
      });
      es.addEventListener("reading", e => {
        try {
          const r = JSON.parse((e as MessageEvent).data) as AgentReading;
          setDeviceConnected(true);
          if (armedRef.current) {
            setReading(r);
            armedRef.current = false;
          }
        } catch {}
      });
      es.onerror = () => {
        setAgentConnected(false); setDeviceConnected(false);
        try { es?.close(); } catch {}
        es = null; retryT = setTimeout(open, 5000);
      };
    };
    open();
    return () => { if (retryT) clearTimeout(retryT); try { es?.close(); } catch {} };
  }, []);

  // Auto-fetch on 9-digit fitting ID
  useEffect(() => {
    const t = fittingIdInput.trim();
    if (/^\d{9}$/.test(t) && !fetchLoading && !fetchedData) {
      setAutoLoaded(false);
      fetchPrescription(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fittingIdInput]);

  const fetchPrescription = useCallback(async (fid: string) => {
    if (!fid.trim()) return;
    setFetchLoading(true); setFetchError(""); setFetchedData(null);
    setReading(null); setDecision(defaultDecision()); setSubmitResult(null);
    cancelAutoPass();
    autoPassFiredRef.current = null;
    operatorTouchedRef.current = false;

    try {
      const res = await fetch("/api/lens-lab/fqc/data-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fitting_id: fid.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setFetchError(json.error ?? `No record found for Fitting ID: ${fid}`);
        setAutoLoaded(false); return;
      }
      const { fitting_id, order_id, power } = json.data as {
        fitting_id: string; order_id: string; power: PowerRow[];
      };
      const { right, left } = parseRows(power ?? []);
      setFetchedData({ fitting_id, order_id, right, left });
      setAutoLoaded(true);

      // Arm for the NEXT lensometer reading. We deliberately do NOT
      // pre-load the agent's last reading — that would be from the previous
      // inspection and would silently associate the wrong measurement with
      // this order. Clear the agent's cached reading too so any pending SSE
      // event can't deliver stale data either.
      armedRef.current = true;
      try { await fetch(`${AGENT_URL}/api/clear`, { method: "POST" }); } catch {}
    } catch {
      setFetchError("Network error — could not reach API");
      setAutoLoaded(false);
    } finally {
      setFetchLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recapture = useCallback(async () => {
    setReading(null);
    armedRef.current = true;
    cancelAutoPass();
    autoPassFiredRef.current = null;
    operatorTouchedRef.current = false;
    try { await fetch(`${AGENT_URL}/api/clear`, { method: "POST" }); } catch {}
  }, [cancelAutoPass]);

  // Auto-QC
  const autoEval = (() => {
    if (!fetchedData || !reading) return null;
    return {
      right: evaluateEye(fetchedData.right, toMeasurement(reading.R)),
      left:  evaluateEye(fetchedData.left,  toMeasurement(reading.L)),
    };
  })();

  // ─────────────────────────────────────────────────────────
  // Grade-1 lockout
  // ─────────────────────────────────────────────────────────
  // Grade 1 cannot PASS or FAIL when SPH or CYL is out of tolerance —
  // those are the prescription-critical fields and require senior (Grade 2)
  // sign-off. AXIS and AP failures alone DO NOT trigger the lockout: axis
  // is sensitive to lens placement at low cyl, and AP varies with where on
  // the lens the operator measures, so those calls stay with the operator.
  const sphCylFail = !!autoEval && (
    !!autoEval.right?.failed.some(f => f === "SPH" || f === "CYL") ||
    !!autoEval.left ?.failed.some(f => f === "SPH" || f === "CYL")
  );
  const grade1Locked = operator?.grade === 1 && sphCylFail;

  // List of fields that triggered the lockout (for the notice)
  const lockedFields = (() => {
    if (!grade1Locked || !autoEval) return [] as string[];
    const set = new Set<string>();
    autoEval.right?.failed.forEach(f => { if (f === "SPH" || f === "CYL") set.add(`R-${f}`); });
    autoEval.left ?.failed.forEach(f => { if (f === "SPH" || f === "CYL") set.add(`L-${f}`); });
    return Array.from(set);
  })();

  // Auto-Pass effect
  useEffect(() => {
    if (!autoPass) return;
    if (!fetchedData || !reading || !operator) return;
    if (submitting || submitResult) return;
    if (operatorTouchedRef.current) return;
    if (autoPassFiredRef.current === reading.printNo) return;

    const r = autoEval?.right;
    const l = autoEval?.left;
    const rOk = !fetchedData.right || (r && r.status === "PASS");
    const lOk = !fetchedData.left  || (l && l.status === "PASS");
    if (!rOk || !lOk) return;
    if (!r && !l) return;

    autoPassFiredRef.current = reading.printNo;
    setAutoPassCountdown(true);

    autoPassTimerRef.current = setTimeout(() => {
      setAutoPassCountdown(false);
      autoPassTimerRef.current = null;
      submitInspection({ status: "PASS", failSide: null, auto: true });
    }, 700);

    return () => {
      if (autoPassTimerRef.current) {
        clearTimeout(autoPassTimerRef.current);
        autoPassTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPass, reading, fetchedData, operator, submitting, submitResult, autoEval?.right?.status, autoEval?.left?.status]);

  useEffect(() => {
    if (!autoPassCountdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        operatorTouchedRef.current = true;
        cancelAutoPass();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoPassCountdown, cancelAutoPass]);

  const canSubmit = (() => {
    if (!operator || !fetchedData || submitting || submitResult) return false;
    if (!reading) return false;
    if (!decision.status) return false;
    if ((decision.status === "HOLD" || decision.status === "FAIL") && (!decision.dept || !decision.reason)) return false;
    if (decision.status === "FAIL" && !decision.failSide) return false;
    // Grade-1 lockout: when SPH or CYL is out, only HOLD is allowed
    if (grade1Locked && decision.status !== "HOLD") return false;
    return true;
  })();

  async function submitInspection(forced?: { status: QcStatus; failSide: FailSide | null; auto: boolean }) {
    if (!fetchedData || !operator || !reading || submitting) return;

    const effective = forced
      ? { status: forced.status, dept: null as Dept | null, reason: "", failSide: forced.failSide, remarks: "" }
      : decision;

    if (!forced) {
      if (!effective.status) return;
      if ((effective.status === "HOLD" || effective.status === "FAIL") && (!effective.dept || !effective.reason)) return;
      if (effective.status === "FAIL" && !effective.failSide) return;
      if (grade1Locked && effective.status !== "HOLD") return;
    }

    setSubmitting(true);
    try {
      const buildEye = (presc: PowerRow | null, eyeReading: AgentReading["R"]) => {
        if (!presc || !eyeReading) return null;
        return {
          measurements: {
            sph:  eyeReading.s,
            cyl:  eyeReading.c,
            axis: eyeReading.a,
            ap:   eyeReading.add ?? null,
          },
        };
      };

      const payload = {
        fitting_id:     fetchedData.fitting_id,
        operator_id:    operator.id,
        operator_grade: operator.grade,

        right:  buildEye(fetchedData.right, reading.R),
        left:   buildEye(fetchedData.left,  reading.L),

        qc_status:  effective.status,
        qcf_dept:   effective.dept,
        qcf_reason: effective.reason || null,
        fail_side:  effective.failSide,
        remarks:    forced?.auto
          ? (effective.remarks ? `${effective.remarks} · auto-pass` : "auto-pass")
          : (effective.remarks || null),
      };

      const res = await fetch("/api/lens-lab/fqc/qc-tray-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (forced?.auto) console.warn("Auto-pass submit failed:", data.error);
        else alert(data.error ?? "Submit failed");
        return;
      }
      setSubmitResult({
        record_id: data.record_id ?? null,
        qc_status: data.qc_status,
        fail_side: data.fail_side ?? null,
        right: data.right, left: data.left,
      });
      if (forced?.auto) {
        setTimeout(() => resetForNext(), 1100);
      }
    } catch {
      if (!forced?.auto) alert("Network error — submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForNext() {
    setSubmitResult(null);
    setFetchedData(null);
    setFittingIdInput("");
    setAutoLoaded(false);
    setReading(null);
    setDecision(defaultDecision());
    armedRef.current = false;
    // Also wipe the agent's cached reading so the next order starts clean
    // even before fetchPrescription has a chance to run.
    fetch(`${AGENT_URL}/api/clear`, { method: "POST" }).catch(() => {});
    setTimeout(() => scanInputRef.current?.focus(), 100);
  }

  const qcfRequired = decision.status === "HOLD" || decision.status === "FAIL";

  return (
    <>
      <style>{CSS}</style>
      <div className="fqc-root">
        <header className="fqc-header">
          <div className="fqc-header-brand">
            LENS LAB FQC<span className="badge">by - Bhaskar Soni</span>
          </div>

          <div className="fqc-header-scan">
            <input
              ref={scanInputRef}
              value={fittingIdInput}
              className={autoLoaded && fetchedData ? "auto-loaded" : ""}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 9);
                setFittingIdInput(v);
                if (v.length < 9) { setAutoLoaded(false); setFetchError(""); }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && fittingIdInput.trim()) fetchPrescription(fittingIdInput.trim());
              }}
              placeholder="Scan 9-digit Fitting ID…"
              autoFocus
              maxLength={9}
            />
            <button
              onClick={() => fetchPrescription(fittingIdInput)}
              disabled={fetchLoading || !fittingIdInput.trim()}
              style={{
                height: 32, padding: "0 14px", background: "var(--accent)", border: "none",
                borderRadius: 5, fontWeight: 800, fontSize: 12, cursor: "pointer",
                color: "var(--navy-d)", whiteSpace: "nowrap",
                opacity: fetchLoading || !fittingIdInput.trim() ? 0.5 : 1,
              }}>
              {fetchLoading ? "…" : "LOAD"}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className={`ap-toggle${autoPass ? " on" : ""}`}
              onClick={toggleAutoPass}
              title={autoPass
                ? "Auto-Pass ON — inspections auto-submit when both eyes are within tolerance. Click to disable."
                : "Auto-Pass OFF — operator must press PASS for every inspection. Click to enable."}>
              <span className="switch" />
              Auto-Pass
            </button>
            {operator && (
              <button className="op-badge" onClick={() => setShowOpModal(true)} title="Click to change operator">
                <span style={{ opacity: 0.7 }}>OP</span>
                <strong>{operator.id}</strong>
                <span className="grade">G{operator.grade}</span>
              </button>
            )}
            <div className="device-status">
              <span className={`device-dot ${
                !agentConnected ? "offline"
                : deviceConnected ? "connected" : "waiting"}`} />
              {!agentConnected ? "Agent offline"
                : deviceConnected ? "Lensometer Live"
                : "Agent ready · waiting for device"}
            </div>
          </div>
        </header>

        {fetchLoading && <div className="loading-bar" />}

        {fetchedData && (
          <div className="fqc-pill-bar">
            {[
              ["Fitting ID",   fetchedData.fitting_id],
              ["Order ID",     fetchedData.order_id],
              ["Lens Type",    fetchedData.right?.lenstype ?? fetchedData.left?.lenstype ?? "—"],
              ["Index",        fetchedData.right?.lens_index ?? fetchedData.left?.lens_index ?? "—"],
              ["Coating",      fetchedData.right?.coating ?? fetchedData.left?.coating ?? "—"],
            ].map(([label, value]) => (
              <div className="fqc-pill" key={label as string}>
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="fqc-body">
          {fetchError && <div className="error-bar">⚠ {fetchError}</div>}
          {!agentConnected && (
            <div className="agent-warning">
              ⚠ Cannot reach the lensometer agent at <code>{AGENT_URL}</code>. Make sure
              <strong> nexs-lensometer-agent.exe </strong>is running on this workstation.
              All measurements come from the device — manual entry is not allowed.
              {' '}<a href={AGENT_URL} target="_blank" rel="noopener">Open agent status →</a>
            </div>
          )}

          {fetchedData ? (
            <>
              <div className="capture-bar">
                <div className="capture-info">
                  <span className="lbl">Lensometer</span>
                  {reading ? (
                    <span className="meta ok">
                      ✓ Reading #{reading.printNo} · {new Date(reading.receivedAt).toLocaleTimeString()}
                    </span>
                  ) : (
                    <span className="meta warn">
                      Place both lenses on the meter and press Print
                    </span>
                  )}
                </div>
                <button className="recapture-btn" onClick={recapture}>↻ RECAPTURE</button>
              </div>

              <div className="lens-grid-row">
                <LensPanel
                  side="LEFT"
                  presc={fetchedData.left}
                  reading={toMeasurement(reading?.L)}
                  deviceConnected={deviceConnected}
                />
                <LensPanel
                  side="RIGHT"
                  presc={fetchedData.right}
                  reading={toMeasurement(reading?.R)}
                  deviceConnected={deviceConnected}
                />
              </div>

              <div className="decision-bar">
                {grade1Locked && (
                  <div className="grade-lock">
                    <strong>🔒 G1 Lock</strong>
                    <span>
                      SPH / CYL out of tolerance ({lockedFields.join(", ")}) —
                      Grade&nbsp;1 must <strong style={{ color: "var(--orange)" }}>HOLD</strong> for senior (Grade&nbsp;2) review.
                      PASS and FAIL are locked. AXIS / AP failures stay at operator discretion.
                    </span>
                  </div>
                )}

                <div>
                  <div className="sec-label">QC Decision (operator)</div>
                  <div className="disposition-group">
                    {(["PASS", "HOLD", "FAIL"] as const).map(s => {
                      const lockedForG1 = grade1Locked && s !== "HOLD";
                      const baseDisabled = !reading || submitting || !!submitResult;
                      return (
                        <button
                          key={s}
                          disabled={baseDisabled || lockedForG1}
                          title={lockedForG1
                            ? "Grade 1 must HOLD when SPH or CYL is out of tolerance"
                            : undefined}
                          className={`disp-btn ${s.toLowerCase()}${decision.status === s ? " active" : ""}${lockedForG1 ? " locked" : ""}`}
                          onClick={() => {
                            operatorTouchedRef.current = true;
                            cancelAutoPass();
                            setDecision(d => ({
                              ...d,
                              status:   s,
                              ...(s === "PASS" ? { dept: null, reason: "", failSide: null } : {}),
                              failSide: s === "FAIL"
                                ? (autoEval?.right?.status === "FAIL" && autoEval?.left?.status === "FAIL" ? "BOTH"
                                  : autoEval?.right?.status === "FAIL" ? "RIGHT"
                                  : autoEval?.left?.status === "FAIL" ? "LEFT"
                                  : d.failSide)
                                : d.failSide,
                            }));
                          }}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {qcfRequired && (
                  <>
                    <div className="qcf-block">
                      <div className="sec-label">Department</div>
                      <div className="dept-radios">
                        {DEPARTMENTS.map(d => (
                          <React.Fragment key={d}>
                            <input type="radio" id={`dept-${d}`} className="dept-radio" name="dept"
                                   checked={decision.dept === d} disabled={submitting}
                                   onChange={() => setDecision(s => ({ ...s, dept: d, reason: "" }))} />
                            <label htmlFor={`dept-${d}`} className="dept-label">{d}</label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    {decision.dept && (
                      <div className="qcf-block">
                        <div className="sec-label">QCF Reason</div>
                        <select className="qcf-reason-select" value={decision.reason} disabled={submitting}
                                onChange={e => setDecision(s => ({ ...s, reason: e.target.value }))}>
                          <option value="">— Select reason —</option>
                          {QCF_REASONS[decision.dept].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {decision.status === "FAIL" && (
                  <div className="qcf-block">
                    <div className="sec-label">Fail Side</div>
                    <div className="fail-side-row">
                      {(["LEFT", "RIGHT", "BOTH"] as const).map(fs => (
                        <button key={fs} type="button"
                                className={`fs-btn${decision.failSide === fs ? " active" : ""}`}
                                disabled={submitting}
                                onClick={() => setDecision(s => ({ ...s, failSide: fs }))}>
                          {fs}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="qcf-block">
                  <div className="sec-label">Remarks {qcfRequired ? "" : "(optional)"}</div>
                  <textarea className="remarks-textarea" value={decision.remarks} disabled={submitting}
                            placeholder="Notes for this inspection (optional)"
                            onChange={e => setDecision(s => ({ ...s, remarks: e.target.value }))} />
                </div>
              </div>

              <div className="submit-bar">
                <div className="submit-summary">
                  {autoPass && !grade1Locked && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "5px 10px", borderRadius: 7, fontSize: 10, fontWeight: 800,
                      letterSpacing: ".5px", background: "var(--green-bg)", color: "var(--green)",
                      border: "1.5px solid var(--green)", textTransform: "uppercase",
                    }}>
                      ⚡ Auto-Pass armed
                    </span>
                  )}
                  {autoEval?.left  && (
                    <span className={`summary-chip ${autoEval.left.status.toLowerCase()}`}>
                      <span style={{ opacity: 0.6, fontSize: 9, letterSpacing: ".5px" }}>LEFT</span>
                      AUTO {autoEval.left.status}{autoEval.left.failed.length ? ` · ${autoEval.left.failed.join(",")}` : ""}
                    </span>
                  )}
                  {autoEval?.right && (
                    <span className={`summary-chip ${autoEval.right.status.toLowerCase()}`}>
                      <span style={{ opacity: 0.6, fontSize: 9, letterSpacing: ".5px" }}>RIGHT</span>
                      AUTO {autoEval.right.status}{autoEval.right.failed.length ? ` · ${autoEval.right.failed.join(",")}` : ""}
                    </span>
                  )}
                </div>
                <button className="submit-btn" disabled={!canSubmit} onClick={() => submitInspection()}>
                  {submitting ? "Submitting…"
                    : !reading ? "WAITING FOR READING…"
                    : grade1Locked && decision.status !== "HOLD" ? "G1 — HOLD ONLY"
                    : "✓ SUBMIT INSPECTION"}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="var(--navy)" strokeWidth="2.5" />
                <ellipse cx="32" cy="32" rx="18" ry="10" stroke="var(--navy)" strokeWidth="2" />
                <circle cx="32" cy="32" r="4" fill="var(--navy)" />
              </svg>
              <h3>Ready for Inspection</h3>
              <p>Scan or enter a 9-digit Fitting ID above to load prescription data</p>
            </div>
          )}
        </div>

        {autoPassCountdown && (
          <div
            className="ap-countdown"
            onClick={() => {
              operatorTouchedRef.current = true;
              cancelAutoPass();
            }}>
            <div className="ap-icon">✓</div>
            <div className="ap-title">AUTO PASS</div>
            <div className="ap-sub">Submitting inspection automatically…</div>
            <div className="ap-cancel">Click anywhere or press Esc to cancel</div>
          </div>
        )}

        {showOpModal && <OperatorModal initial={operator ?? undefined} onSave={saveOperator} />}

        {submitResult && fetchedData && (
          <div className="toast-overlay" onClick={resetForNext}>
            <div className="toast-card" onClick={e => e.stopPropagation()}>
              <div className="toast-icon">
                {submitResult.qc_status === "PASS" ? "✅"
                  : submitResult.qc_status === "FAIL" ? "❌"
                  : "⏸"}
              </div>
              <div className="toast-title">
                {submitResult.qc_status === "PASS" ? "Inspection Passed"
                  : submitResult.qc_status === "FAIL" ? "Inspection Failed"
                  : "Inspection on Hold"}
              </div>
              <div className="toast-sub">
                Fitting {fetchedData.fitting_id} — saved to blanks-fqc{submitResult.record_id ? ` · #${submitResult.record_id}` : ""}
              </div>

              <div className="lens-result-row">
                {(["LEFT", "RIGHT"] as const).map(s => {
                  const r = s === "RIGHT" ? submitResult.right : submitResult.left;
                  if (!r) return null;
                  return (
                    <div key={s} className={`lens-result-chip ${r.status === "PASS" ? "chip-pass" : "chip-fail"}`}>
                      <span className="lrc-side">{s} LENS</span>
                      <span>AUTO {r.status}</span>
                      {r.failed.length > 0 && <span style={{ fontSize: 10, opacity: 0.7 }}>{r.failed.join(", ")}</span>}
                    </div>
                  );
                })}
              </div>

              <div className="toast-meta">
                <div className="toast-pill">
                  <div className="tp-label">Fitting ID</div>
                  <div className="tp-val">{fetchedData.fitting_id}</div>
                </div>
                <div className="toast-pill">
                  <div className="tp-label">Order ID</div>
                  <div className="tp-val">{fetchedData.order_id}</div>
                </div>
                {submitResult.fail_side && (
                  <div className="toast-pill">
                    <div className="tp-label">Fail Side</div>
                    <div className="tp-val">{submitResult.fail_side}</div>
                  </div>
                )}
              </div>

              <button className="toast-next-btn" onClick={resetForNext}>
                ▶ NEXT QC INSPECTION
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}