"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Button, Input, Textarea, Select, Field,
  Card, CardBody, PageHeader, Modal, Alert, Badge,
} from "@/components/ui";
import { cn } from "@/lib/cn";

// ─────────────────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────────────────
const AGENT_URL =
  process.env.NEXT_PUBLIC_AGENT_URL ?? "http://127.0.0.1:13131";

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

// Shared style maps (brand / semantic tokens)
const READOUT_STATE: Record<FieldState, string> = {
  "":       "border-gray-300 bg-white text-gray-900",
  ok:       "border-good-600 bg-good-50 text-good-600",
  warn:     "border-notice-600 bg-notice-50 text-notice-600",
  mismatch: "border-danger-600 bg-danger-50 text-danger-600",
};

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
  const dotClass = side === "RIGHT" ? "bg-brand-700" : "bg-brand-400";

  if (!presc) {
    return (
      <Card className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-brand-700">
            <span className={cn("h-2 w-2 rounded-full", dotClass)} />
            {side} LENS
          </div>
        </div>
        <div className="p-6 text-center text-xs text-gray-500">
          No {side} lens prescription found for this order
        </div>
      </Card>
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

  const prescFields: Array<[string, string]> = [
    ["SPH",   fmt(presc.sph)],
    ["CYL",   fmt(presc.cyl)],
    ["AXIS",  presc.axis != null ? `${presc.axis}°` : "—"],
    ["AP",    fmt(presc.ap)],
    ["A (W)", presc.lens_width  != null ? `${presc.lens_width}mm`  : "—"],
    ["B (H)", presc.lens_height != null ? `${presc.lens_height}mm` : "—"],
    ["ED",    presc.effective_dia != null ? `${presc.effective_dia}mm` : "—"],
    ["ED-D",  presc.edge_distance != null ? `${presc.edge_distance}mm` : "—"],
  ];

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-brand-700">
          <span className={cn("h-2 w-2 rounded-full", dotClass)} />
          {side} LENS
          <Badge tone="navy">
            {cat === "PROGRESSIVE" ? "PROG" : "SV/BF"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-500">{presc.lenstype ?? "—"}</span>
          {presc.lens_index && (
            <span className="text-[11px] font-bold text-brand-700">IDX {presc.lens_index}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-px border-b border-gray-200 bg-gray-200">
        {prescFields.map(([label, value]) => (
          <div className="flex flex-col gap-0.5 bg-white px-2.5 py-2" key={label}>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</span>
            <span className={cn(
              "font-mono text-sm font-bold tabular-nums",
              value === "—" ? "text-gray-400 font-normal" : "text-gray-900",
            )}>{value}</span>
          </div>
        ))}
        <div className="col-span-2 flex flex-col gap-0.5 bg-white px-2.5 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Lens Name</span>
          <span className="text-xs font-bold text-gray-900">{presc.lensname ?? "—"}</span>
        </div>
        <div className="col-span-2 flex flex-col gap-0.5 bg-white px-2.5 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Coating</span>
          <span className="text-[11px] font-semibold text-gray-900">{presc.coating ?? "—"}</span>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-brand-700">
          <span className={cn(
            "h-2 w-2 rounded-full",
            deviceConnected ? "bg-good-500 animate-pulse" : "bg-notice-500 animate-pulse",
          )} />
          CCQ-AutoFocimeter
          {deviceConnected
            ? <Badge tone="good">LIVE</Badge>
            : <Badge tone="notice" className="animate-pulse">WAITING</Badge>}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {fields.map(f => (
            <div className="flex flex-col gap-1" key={f.key}>
              <div className="flex items-center justify-between gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                <span>{f.label}</span>
                <span className="font-mono normal-case tracking-normal text-gray-400 whitespace-nowrap">
                  exp {f.expected} <span className="font-bold text-brand-600">{f.tol}</span>
                </span>
              </div>
              <div className={cn(
                "flex h-9 items-center justify-center rounded-md border-[1.5px] px-2 font-mono text-sm font-bold tabular-nums",
                !hasReading
                  ? "border-dashed border-gray-300 bg-gray-50 font-normal text-gray-400"
                  : READOUT_STATE[f.state],
              )}>
                {f.measured}
              </div>
            </div>
          ))}
        </div>

        {!hasReading ? (
          <div className="mt-2.5 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-500">
            ⏳ Waiting for lensmeter reading…
          </div>
        ) : allOk ? (
          <Alert tone="success" className="mt-2.5 py-2 text-xs">
            ✓ Auto-check: all measurements within tolerance
          </Alert>
        ) : anyFail ? (
          <Alert tone="error" className="mt-2.5 py-2 text-xs">
            ✗ Auto-check failed:&nbsp;
            {fields.filter(f => f.state === "mismatch").map(f => f.label).join(", ")}
          </Alert>
        ) : (
          <div className="mt-2.5 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-500">
            — partial reading; review carefully
          </div>
        )}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
//  Operator login modal
// ─────────────────────────────────────────────────────────
function OperatorModal({ initial, onSave }: { initial?: Operator; onSave: (op: Operator) => void }) {
  const [id, setId] = useState(initial?.id ?? "");
  const [grade, setGrade] = useState<1 | 2>(initial?.grade ?? 1);
  return (
    <Modal open size="sm">
      <h3 className="text-lg font-bold text-brand-700">Operator Login</h3>
      <p className="mt-1 mb-4 text-sm text-gray-500">
        Enter your operator ID and grade. This is required to record QC inspections.
      </p>
      <div className="space-y-4">
        <Field label="Operator ID" htmlFor="op-id">
          <Input id="op-id" value={id} autoFocus maxLength={50}
                 onChange={e => setId(e.target.value)} placeholder="e.g. OP123" />
        </Field>
        <Field label="Grade" htmlFor="op-grade">
          <Select id="op-grade" value={grade}
                  onChange={e => setGrade(Number(e.target.value) as 1 | 2)}>
            <option value={1}>Grade 1</option>
            <option value={2}>Grade 2</option>
          </Select>
        </Field>
        <Button className="w-full" disabled={!id.trim()}
                onClick={() => onSave({ id: id.trim(), grade })}>
          CONTINUE
        </Button>
      </div>
    </Modal>
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

  const deviceLabel = !agentConnected ? "Agent offline"
    : deviceConnected ? "Lensometer Live"
    : "Agent ready · waiting for device";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-2">
            Lens Lab FQC
            <Badge tone="gold">by - Bhaskar Soni</Badge>
          </span>
        }
        subtitle="Final quality check — lensometer prescription verification"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleAutoPass}
              title={autoPass
                ? "Auto-Pass ON — inspections auto-submit when both eyes are within tolerance. Click to disable."
                : "Auto-Pass OFF — operator must press PASS for every inspection. Click to enable."}
              className={cn(
                "gap-2 text-[10px] font-bold uppercase tracking-wide",
                autoPass
                  ? "border-good-600 bg-good-50 text-good-700 hover:bg-good-50"
                  : "text-gray-500",
              )}>
              <span className={cn(
                "relative h-3.5 w-6 rounded-full transition-colors",
                autoPass ? "bg-good-600" : "bg-gray-300",
              )}>
                <span className={cn(
                  "absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-all",
                  autoPass ? "left-3" : "left-0.5",
                )} />
              </span>
              Auto-Pass
            </Button>

            {operator && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOpModal(true)}
                title="Click to change operator"
                className="gap-1.5 text-xs font-normal">
                <span className="text-gray-400">OP</span>
                <strong className="text-gray-800">{operator.id}</strong>
                <Badge tone="gold">G{operator.grade}</Badge>
              </Button>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={cn(
                "h-2 w-2 rounded-full",
                !agentConnected ? "bg-gray-400"
                  : deviceConnected ? "bg-good-500 animate-pulse"
                  : "bg-notice-500 animate-pulse",
              )} />
              {deviceLabel}
            </div>
          </div>
        }
      />

      {/* Scan bar */}
      <Card>
        <CardBody className="flex flex-wrap items-center gap-3 py-3">
          <Input
            ref={scanInputRef}
            value={fittingIdInput}
            className={cn(
              "flex-1 min-w-[200px] font-mono",
              autoLoaded && fetchedData &&
                "border-good-500 bg-good-50 focus:border-good-500 focus:ring-good-500/30",
            )}
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
          <Button
            onClick={() => fetchPrescription(fittingIdInput)}
            disabled={fetchLoading || !fittingIdInput.trim()}
            loading={fetchLoading}>
            LOAD
          </Button>
        </CardBody>
      </Card>

      {fetchLoading && (
        <div className="h-1 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-brand-600" />
        </div>
      )}

      {fetchedData && (
        <Card>
          <CardBody className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 lg:grid-cols-5">
            {([
              ["Fitting ID", fetchedData.fitting_id],
              ["Order ID",   fetchedData.order_id],
              ["Lens Type",  fetchedData.right?.lenstype ?? fetchedData.left?.lenstype ?? "—"],
              ["Index",      fetchedData.right?.lens_index ?? fetchedData.left?.lens_index ?? "—"],
              ["Coating",    fetchedData.right?.coating ?? fetchedData.left?.coating ?? "—"],
            ] as Array<[string, string]>).map(([label, value]) => (
              <div key={label} className="min-w-0">
                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{label}</div>
                <div className="mt-0.5 truncate text-sm font-semibold text-gray-900">{value}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {fetchError && <Alert tone="error">⚠ {fetchError}</Alert>}

      {!agentConnected && (
        <Alert tone="warning">
          ⚠ Cannot reach the lensometer agent at <code>{AGENT_URL}</code>. Make sure
          <strong> nexs-lensometer-agent.exe </strong>is running on this workstation.
          All measurements come from the device — manual entry is not allowed.
          {" "}<a className="underline" href={AGENT_URL} target="_blank" rel="noopener">Open agent status →</a>
        </Alert>
      )}

      {fetchedData ? (
        <>
          {/* Capture bar */}
          <Card>
            <CardBody className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[11px] font-bold uppercase tracking-wide text-brand-700">Lensometer</span>
                {reading ? (
                  <span className="font-mono text-xs font-semibold text-good-600">
                    ✓ Reading #{reading.printNo} · {new Date(reading.receivedAt).toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-notice-600">
                    Place both lenses on the meter and press Print
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={recapture}>↻ RECAPTURE</Button>
            </CardBody>
          </Card>

          {/* Lens panels */}
          <div className="grid gap-4 lg:grid-cols-2">
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

          {/* Decision */}
          <Card>
            <CardBody className="space-y-3">
              {grade1Locked && (
                <Alert tone="notice" className="flex items-start gap-2">
                  <strong className="flex-shrink-0 text-[11px] font-extrabold uppercase tracking-wide">🔒 G1 Lock</strong>
                  <span>
                    SPH / CYL out of tolerance ({lockedFields.join(", ")}) —
                    Grade&nbsp;1 must <strong>HOLD</strong> for senior (Grade&nbsp;2) review.
                    PASS and FAIL are locked. AXIS / AP failures stay at operator discretion.
                  </span>
                </Alert>
              )}

              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">QC Decision (operator)</div>
                <div className="flex flex-wrap gap-2">
                  {(["PASS", "HOLD", "FAIL"] as const).map(s => {
                    const lockedForG1 = grade1Locked && s !== "HOLD";
                    const baseDisabled = !reading || submitting || !!submitResult;
                    const active = decision.status === s;
                    const variant = active
                      ? (s === "PASS" ? "success" : s === "FAIL" ? "danger" : "outline")
                      : "outline";
                    return (
                      <Button
                        key={s}
                        variant={variant}
                        disabled={baseDisabled || lockedForG1}
                        title={lockedForG1
                          ? "Grade 1 must HOLD when SPH or CYL is out of tolerance"
                          : undefined}
                        className={cn(
                          "relative h-11 min-w-[120px] flex-1 text-xs font-extrabold tracking-wider",
                          s === "HOLD" && active &&
                            "border-notice-600 bg-notice-600 text-white hover:bg-notice-700",
                        )}
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
                        {lockedForG1 && <span className="absolute right-1.5 top-1 text-[11px] opacity-80">🔒</span>}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {qcfRequired && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Department</div>
                    <div className="flex flex-wrap gap-1.5">
                      {DEPARTMENTS.map(d => (
                        <label
                          key={d}
                          htmlFor={`dept-${d}`}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1 text-[10px] font-bold tracking-wide transition-colors",
                            decision.dept === d
                              ? "border-brand-700 bg-brand-700 text-white"
                              : "border-gray-300 text-gray-500 hover:bg-gray-50",
                          )}>
                          <input type="radio" id={`dept-${d}`} name="dept" className="sr-only"
                                 checked={decision.dept === d} disabled={submitting}
                                 onChange={() => setDecision(s => ({ ...s, dept: d, reason: "" }))} />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  {decision.dept && (
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">QCF Reason</div>
                      <Select value={decision.reason} disabled={submitting}
                              onChange={e => setDecision(s => ({ ...s, reason: e.target.value }))}>
                        <option value="">— Select reason —</option>
                        {QCF_REASONS[decision.dept].map(r => <option key={r} value={r}>{r}</option>)}
                      </Select>
                    </div>
                  )}
                </>
              )}

              {decision.status === "FAIL" && (
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Fail Side</div>
                  <div className="flex gap-1.5">
                    {(["LEFT", "RIGHT", "BOTH"] as const).map(fs => (
                      <Button
                        key={fs}
                        type="button"
                        size="sm"
                        variant={decision.failSide === fs ? "danger" : "outline"}
                        disabled={submitting}
                        className="h-8 flex-1 text-[11px] font-bold"
                        onClick={() => setDecision(s => ({ ...s, failSide: fs }))}>
                        {fs}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Remarks {qcfRequired ? "" : "(optional)"}
                </div>
                <Textarea value={decision.remarks} disabled={submitting}
                          className="min-h-[48px]"
                          placeholder="Notes for this inspection (optional)"
                          onChange={e => setDecision(s => ({ ...s, remarks: e.target.value }))} />
              </div>
            </CardBody>
          </Card>

          {/* Submit bar */}
          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {autoPass && !grade1Locked && (
                <span className="inline-flex items-center gap-1 rounded-lg border-[1.5px] border-good-600 bg-good-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-good-600">
                  ⚡ Auto-Pass armed
                </span>
              )}
              {autoEval?.left && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border-[1.5px] px-3 py-1.5 font-bold",
                  autoEval.left.status === "PASS"
                    ? "border-good-600 bg-good-50 text-good-600"
                    : "border-danger-600 bg-danger-50 text-danger-600",
                )}>
                  <span className="text-[9px] tracking-wide opacity-60">LEFT</span>
                  AUTO {autoEval.left.status}{autoEval.left.failed.length ? ` · ${autoEval.left.failed.join(",")}` : ""}
                </span>
              )}
              {autoEval?.right && (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border-[1.5px] px-3 py-1.5 font-bold",
                  autoEval.right.status === "PASS"
                    ? "border-good-600 bg-good-50 text-good-600"
                    : "border-danger-600 bg-danger-50 text-danger-600",
                )}>
                  <span className="text-[9px] tracking-wide opacity-60">RIGHT</span>
                  AUTO {autoEval.right.status}{autoEval.right.failed.length ? ` · ${autoEval.right.failed.join(",")}` : ""}
                </span>
              )}
            </div>
            <Button size="lg" disabled={!canSubmit} loading={submitting}
                    onClick={() => submitInspection()}>
              {submitting ? "Submitting…"
                : !reading ? "WAITING FOR READING…"
                : grade1Locked && decision.status !== "HOLD" ? "G1 — HOLD ONLY"
                : "✓ SUBMIT INSPECTION"}
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardBody className="flex flex-col items-center justify-center px-5 py-14 text-center text-gray-500">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-3.5 text-brand-700 opacity-20">
              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2.5" />
              <ellipse cx="32" cy="32" rx="18" ry="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="32" cy="32" r="4" fill="currentColor" />
            </svg>
            <h3 className="mb-1.5 text-base font-bold text-brand-700">Ready for Inspection</h3>
            <p className="text-sm">Scan or enter a 9-digit Fitting ID above to load prescription data</p>
          </CardBody>
        </Card>
      )}

      {/* Auto-pass countdown overlay */}
      {autoPassCountdown && (
        <div
          onClick={() => { operatorTouchedRef.current = true; cancelAutoPass(); }}
          className="fixed inset-0 z-[1500] flex cursor-pointer flex-col items-center justify-center bg-good-600/95 text-white">
          <div className="mb-2.5 animate-pulse text-7xl">✓</div>
          <div className="mb-1.5 text-3xl font-black tracking-widest">AUTO PASS</div>
          <div className="mb-5 text-sm opacity-85">Submitting inspection automatically…</div>
          <div className="rounded-lg border-[1.5px] border-white/50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide opacity-70">
            Click anywhere or press Esc to cancel
          </div>
        </div>
      )}

      {showOpModal && <OperatorModal initial={operator ?? undefined} onSave={saveOperator} />}

      {/* Result toast */}
      {submitResult && fetchedData && (
        <div
          onClick={resetForNext}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-brand-900/65 p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-2.5 text-4xl">
              {submitResult.qc_status === "PASS" ? "✅"
                : submitResult.qc_status === "FAIL" ? "❌"
                : "⏸"}
            </div>
            <div className="mb-1.5 text-xl font-black text-brand-700">
              {submitResult.qc_status === "PASS" ? "Inspection Passed"
                : submitResult.qc_status === "FAIL" ? "Inspection Failed"
                : "Inspection on Hold"}
            </div>
            <div className="mb-4 text-sm text-gray-500">
              Fitting {fetchedData.fitting_id} — saved to blanks-fqc{submitResult.record_id ? ` · #${submitResult.record_id}` : ""}
            </div>

            <div className="mb-4 flex flex-wrap justify-center gap-2.5">
              {(["LEFT", "RIGHT"] as const).map(s => {
                const r = s === "RIGHT" ? submitResult.right : submitResult.left;
                if (!r) return null;
                return (
                  <div key={s} className={cn(
                    "flex min-w-[110px] flex-col items-center gap-0.5 rounded-lg border-[1.5px] px-4 py-1.5 text-xs font-extrabold",
                    r.status === "PASS"
                      ? "border-good-600 bg-good-50 text-good-600"
                      : "border-danger-600 bg-danger-50 text-danger-600",
                  )}>
                    <span className="text-[10px] tracking-wide opacity-75">{s} LENS</span>
                    <span>AUTO {r.status}</span>
                    {r.failed.length > 0 && <span className="text-[10px] opacity-70">{r.failed.join(", ")}</span>}
                  </div>
                );
              })}
            </div>

            <div className="mb-5 flex flex-wrap justify-center gap-3">
              <div className="rounded-md bg-gray-100 px-3.5 py-1.5">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Fitting ID</div>
                <div className="font-mono text-sm font-extrabold text-brand-700">{fetchedData.fitting_id}</div>
              </div>
              <div className="rounded-md bg-gray-100 px-3.5 py-1.5">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Order ID</div>
                <div className="font-mono text-sm font-extrabold text-brand-700">{fetchedData.order_id}</div>
              </div>
              {submitResult.fail_side && (
                <div className="rounded-md bg-gray-100 px-3.5 py-1.5">
                  <div className="text-[10px] uppercase tracking-wide text-gray-500">Fail Side</div>
                  <div className="font-mono text-sm font-extrabold text-brand-700">{submitResult.fail_side}</div>
                </div>
              )}
            </div>

            <Button className="w-full" size="lg" onClick={resetForNext}>
              ▶ NEXT QC INSPECTION
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
