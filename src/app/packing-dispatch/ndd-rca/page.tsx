"use client";

// Web version of "NDD RCA/App.py" — the RCA control panel. One RCA date drives every
// step; each step streams its live Python stdout into the console over Server-Sent
// Events. EXPORT now uploads the DRCA workbook to Google Drive (Year/Month split)
// instead of saving it locally, so OPEN .XLSX returns the Drive link and FOLDER opens
// the Drive folder.

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Field,
  Card,
  CardBody,
  PageHeader,
  StatusPill,
  Badge,
} from "@/components/ui";

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

type Variant = "primary" | "success" | "outline";
type Step = { key: string; label: string; sub: string; variant: Variant };

const STEPS: Step[] = [
  { key: "fetch", label: "FETCH", sub: "Power BI → CSV", variant: "primary" },
  { key: "push", label: "PUSH", sub: "CSV + DB → Sheets", variant: "success" },
  { key: "qcf", label: "QCF", sub: "QC-fail → QCF tab", variant: "outline" },
  { key: "excel", label: "EXPORT", sub: "Tabs → Drive .xlsx", variant: "outline" },
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
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="NDD RCA — Control Panel"
        subtitle="Packing · Dispatch — one RCA date drives every step"
        actions={
          busy ? (
            <StatusPill tone="gold">● {status}</StatusPill>
          ) : (
            <Badge tone="navy">● {status}</Badge>
          )
        }
      />

      {/* Controls */}
      <Card>
        <CardBody className="space-y-5">
          {/* RCA date */}
          <Field
            label="RCA Date"
            htmlFor="rca-date"
            hint="drives Fetch, Push, QCF & Export"
            className="max-w-xs"
          >
            <Input
              id="rca-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={busy}
            />
          </Field>

          {/* Step buttons */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.key} className="flex flex-col gap-1.5">
                <Button
                  variant={s.variant}
                  onClick={() => run(s.key, s.label)}
                  disabled={busy}
                  className="w-full font-bold tracking-wide"
                >
                  {s.label}
                </Button>
                <span className="text-center text-[11px] text-gray-500">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* RUN ALL */}
          <Button
            onClick={() => run("all", "RUN ALL")}
            loading={busy}
            disabled={busy}
            size="lg"
            className="w-full font-black tracking-[0.15em]"
          >
            ▶ RUN ALL
          </Button>

          {/* Action row */}
          <div className="flex flex-wrap gap-2.5">
            <Button variant="outline" size="sm" onClick={openXlsx} disabled={busy}>
              ⤓ OPEN .XLSX
            </Button>
            <Button variant="danger" size="sm" onClick={exportDac} disabled={busy}>
              ⤓ DISPATCH (DAC)
            </Button>
            <Button variant="outline" size="sm" onClick={openFolder}>
              ▣ DRIVE FOLDER
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={() => setLog([])}>
              ⌫ CLEAR LOG
            </Button>
          </div>
        </CardBody>
      </Card>

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
  );
}
