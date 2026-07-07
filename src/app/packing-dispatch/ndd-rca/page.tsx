"use client";

// Web version of "NDD RCA/App.py" — the RCA control panel. One RCA date drives every
// step; each step streams its live Python stdout into the console over Server-Sent
// Events. EXPORT now uploads the DRCA workbook to Google Drive (Year/Month split)
// instead of saving it locally, so OPEN .XLSX returns the Drive link and FOLDER opens
// the Drive folder.

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui";

const API = "/api/packing-dispatch/ndd-rca";
const DRIVE_FOLDER = "1Kygr8PWqaZ8t0GAZDnB3nBJIgriAeC9U";

// console line colours (the neon console echoes App.py's black/neon panel),
// anchored to the brand/semantic palette: success→good, error→danger,
// warn/info→gold, head→notice, dim→brand.
const LINE: Record<string, string> = {
  head: "#e8650a", // notice-600
  ok: "#1a7a4a", // good-600
  err: "#c0392b", // danger-600
  info: "#e8b400", // gold-500
  dim: "#6c79aa", // brand-400
};

type Step = { key: string; label: string; sub: string; tone: string };

const STEPS: Step[] = [
  { key: "fetch", label: "FETCH", sub: "Power BI → CSV", tone: "border-brand-600 text-brand-600 hover:bg-brand-50 focus-visible:ring-brand-300" },
  { key: "push", label: "PUSH", sub: "CSV + DB → Sheets", tone: "border-good-600 text-good-600 hover:bg-good-50 focus-visible:ring-good-600/40" },
  { key: "qcf", label: "QCF", sub: "QC-fail → QCF tab", tone: "border-notice-600 text-notice-600 hover:bg-notice-50 focus-visible:ring-notice-600/40" },
  { key: "excel", label: "EXPORT", sub: "Tabs → Drive .xlsx", tone: "border-gold-700 text-gold-700 hover:bg-gold-100 focus-visible:ring-gold-500/40" },
];

interface LogLine {
  text: string;
  tag: string | null;
}

export default function NddRcaPage() {
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("IDLE");
  const [log, setLog] = useState<LogLine[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // initial RCA date from the server (today − 2)
  useEffect(() => {
    fetch(`${API}?action=default-date`)
      .then((r) => r.json())
      .then((d) => setDate(d.date))
      .catch(() => {
        const t = new Date();
        t.setDate(t.getDate() - 2);
        setDate(t.toISOString().slice(0, 10));
      });
  }, []);

  // auto-scroll console to bottom on new lines
  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  // tidy up the stream if the component unmounts mid-run
  useEffect(() => () => esRef.current?.close(), []);

  const emit = useCallback((text: string, tag: string | null = null) => {
    setLog((prev) => [...prev, { text, tag }]);
  }, []);

  const validDate = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));

  const run = (step: string, label: string) => {
    if (busy) return;
    if (!validDate(date)) {
      emit(`✗ Invalid date '${date}' (use YYYY-MM-DD)`, "err");
      return;
    }
    setBusy(true);
    setStatus(label);
    const es = new EventSource(
      `${API}?action=run&step=${encodeURIComponent(step)}&date=${encodeURIComponent(date)}`,
    );
    esRef.current = es;
    es.onmessage = (e) => {
      const d = JSON.parse(e.data) as LogLine & { line: string };
      emit(d.line, d.tag);
    };
    es.addEventListener("done", () => {
      es.close();
      esRef.current = null;
      setBusy(false);
      setStatus("IDLE");
    });
    es.onerror = () => {
      es.close();
      esRef.current = null;
      if (busy) emit("✗ connection lost", "err");
      setBusy(false);
      setStatus("IDLE");
    };
  };

  const openXlsx = async () => {
    if (!validDate(date)) {
      emit(`✗ Invalid date '${date}' (use YYYY-MM-DD)`, "err");
      return;
    }
    emit(`looking up Drive file for ${date} …`, "dim");
    try {
      const r = await fetch(`${API}?action=link&date=${encodeURIComponent(date)}`);
      const d = await r.json();
      if (d.ok && d.link) {
        emit(`opening ${d.link}`, "info");
        window.open(d.link, "_blank", "noopener");
      } else {
        emit(d.msg || "✗ no Drive file found", "err");
      }
    } catch {
      emit("✗ could not reach server", "err");
    }
  };

  const exportDac = async () => {
    if (busy) return;
    if (!validDate(date)) {
      emit(`✗ Invalid date '${date}' (use YYYY-MM-DD)`, "err");
      return;
    }
    emit(`building Dispatch view (DAC) for ${date} …`, "dim");
    try {
      const r = await fetch(`${API}?action=dac&date=${encodeURIComponent(date)}`);
      const ct = r.headers.get("Content-Type") || "";
      if (ct.includes("application/json")) {
        const d = await r.json();
        emit(d.msg || "✗ export failed", "err");
        return;
      }
      const blob = await r.blob();
      const cd = r.headers.get("Content-Disposition") || "";
      const m = cd.match(/filename="?([^"]+)"?/);
      const name = m ? m[1] : "DAC.xlsx";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      emit(`downloaded ${name}`, "info");
    } catch {
      emit("✗ could not reach server", "err");
    }
  };

  const openFolder = () =>
    window.open(
      `https://drive.google.com/drive/folders/${DRIVE_FOLDER}`,
      "_blank",
      "noopener",
    );

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex h-16 items-center justify-between rounded-2xl bg-gradient-to-br from-brand-800 to-brand-500 px-6 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500 text-[17px] font-black text-brand-900">
            ▸
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-white">
              NDD RCA — Control Panel
            </div>
            <div className="mt-0.5 text-[11px] text-white/40">Packing · Dispatch</div>
          </div>
        </div>
        <span className={cn("text-[13px] font-bold tracking-wide", busy ? "text-gold-500" : "text-white/50")}>
          ● {status}
        </span>
      </header>

      <div className="mx-auto max-w-4xl space-y-4">
        {/* RCA date */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            RCA Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={busy}
            className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-bold tracking-wide text-gray-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:bg-gray-50"
          />
          <span className="text-xs text-gray-500">drives Fetch, Push, QCF &amp; Export</span>
        </div>

        {/* Step buttons */}
        <div className="grid grid-cols-4 gap-3.5">
          {STEPS.map((s) => (
            <div key={s.key} className="flex flex-col gap-1.5">
              <button
                onClick={() => run(s.key, s.label)}
                disabled={busy}
                className={cn(
                  "rounded-lg border bg-white py-3 text-sm font-extrabold tracking-wide shadow-sm transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-45",
                  s.tone,
                )}
              >
                {s.label}
              </button>
              <span className="text-center text-[11px] text-gray-500">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* RUN ALL */}
        <Button
          onClick={() => run("all", "RUN ALL")}
          disabled={busy}
          size="lg"
          className="w-full text-base font-black tracking-[0.15em]"
        >
          ▶ RUN ALL
        </Button>

        {/* Action row */}
        <div className="flex flex-wrap gap-2.5">
          <ActionBtn label="⤓ OPEN .XLSX" tone="border-gold-500 text-gold-700 hover:bg-gold-100" onClick={openXlsx} disabled={busy} />
          <ActionBtn label="⤓ DISPATCH (DAC)" tone="border-danger-600 text-danger-600 hover:bg-danger-50" onClick={exportDac} disabled={busy} />
          <ActionBtn label="▣ DRIVE FOLDER" tone="border-gray-300 text-gray-600 hover:bg-gray-50" onClick={openFolder} disabled={false} />
          <div className="flex-1" />
          <ActionBtn label="⌫ CLEAR LOG" tone="border-gray-300 text-gray-600 hover:bg-gray-50" onClick={() => setLog([])} disabled={false} />
        </div>

        {/* Console */}
        <div
          ref={consoleRef}
          className="overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-brand-800 bg-[#05050a] px-4 py-3.5 font-mono text-[13px] leading-relaxed"
          style={{ minHeight: 320, maxHeight: "55vh" }}
        >
          {log.length === 0 ? (
            <span style={{ color: LINE.dim }}>
              Ready. Set the RCA date and pick a step.{"\n"}
              FETCH may open a browser the first time for Power BI sign-in.{"\n"}
              EXPORT uploads the DRCA workbook to Google Drive (Year/Month).
            </span>
          ) : (
            log.map((l, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  color: (l.tag && LINE[l.tag]) || LINE.ok,
                  fontWeight: l.tag === "head" ? 700 : 400,
                }}
              >
                {l.text || " "}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  tone,
  onClick,
  disabled,
}: {
  label: string;
  tone: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg border bg-white px-4 py-2 text-[13px] font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-45",
        tone,
      )}
    >
      {label}
    </button>
  );
}
