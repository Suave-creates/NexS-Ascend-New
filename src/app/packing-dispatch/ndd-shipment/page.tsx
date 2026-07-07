"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  StatCard,
  Button,
  Textarea,
  Input,
  Alert,
  Badge,
} from "@/components/ui";
import { cn } from "@/lib/cn";

type ShipmentType = "Normal" | "Rescue";

interface Counts { total: number; normal: number; rescue: number }

export default function NddShipmentPage() {
  const todayIso = () => new Date().toISOString().slice(0, 10);

  const [awbList,      setAwbList]      = useState("");
  const [type,         setType]         = useState<ShipmentType>("Normal");
  const [loading,      setLoading]      = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);
  const [counts,       setCounts]       = useState<Counts>({ total: 0, normal: 0, rescue: 0 });
  const [selectedDate, setSelectedDate] = useState<string>(todayIso());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toastTimer  = useRef<NodeJS.Timeout | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────────
  const showToast = (msg: string, ok: boolean) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, ok });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/packing-dispatch/ndd-shipment?date=${selectedDate}`);
      if (!res.ok) return;
      const data = await res.json();
      setCounts({ total: data.total ?? 0, normal: data.normal ?? 0, rescue: data.rescue ?? 0 });
    } catch {/* silent */}
  }, [selectedDate]);

  useEffect(() => {
    fetchCounts();
    const iv = setInterval(fetchCounts, 30_000);
    return () => clearInterval(iv);
  }, [fetchCounts]);

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const awbs = awbList
      .split(/\r?\n/)
      .map((l) => l.trim().toUpperCase())
      .filter((l) => l.length > 0);

    if (awbs.length === 0) { showToast("Enter at least one AWB.", false); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/packing-dispatch/ndd-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awbs, type, date: selectedDate }),
      });

      if (res.ok) {
        const data = await res.json();
        const newCount = data.count - data.updated;
        const parts: string[] = [];
        if (newCount > 0)     parts.push(`${newCount} new`);
        if (data.updated > 0) parts.push(`${data.updated} updated`);
        showToast(
          `✔  ${data.count} AWB${data.count !== 1 ? "s" : ""} saved (${parts.join(", ")}) as ${type}.`,
          true
        );
        setAwbList("");
        fetchCounts();
        textareaRef.current?.focus();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error ?? "Failed to save.", false);
      }
    } catch {
      showToast("Network error.", false);
    } finally {
      setLoading(false);
    }
  };

  // ── export CSV ─────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(
        `/api/packing-dispatch/ndd-shipment?date=${selectedDate}&export=true`
      );
      if (!res.ok) { showToast("Export failed.", false); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `NDD_${fmtSelectedDate(selectedDate)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Export failed.", false);
    } finally {
      setExporting(false);
    }
  };

  // ── formatters ─────────────────────────────────────────────────────────────
  const fmtSelectedDate = (ymd: string) => {
    const [y, m, d] = ymd.split("-");
    return `${d}-${m}-${y}`;
  };

  const fmtBigNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n);

  const isToday = selectedDate === todayIso();

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <PageHeader
        title="NDD Shipment"
        subtitle="Packing · Dispatch — record next-day-delivery shipments"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="success"
              onClick={handleExport}
              disabled={exporting || counts.total === 0}
              className="gap-1.5"
            >
              <span>⬇</span>
              {exporting ? "Exporting…" : `Export CSV${counts.total > 0 ? ` (${counts.total.toLocaleString()})` : ""}`}
            </Button>
            <Button variant="outline" onClick={fetchCounts} title="Refresh counts">↻</Button>
          </div>
        }
      />

      {/* ── Date row ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Input
          type="date"
          value={selectedDate}
          max={todayIso()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-auto font-bold tracking-wide"
        />

        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-bold tracking-wide text-brand-700 shadow-sm">
          {fmtSelectedDate(selectedDate)}
          {isToday && <Badge tone="good">TODAY</Badge>}
        </div>

        {!isToday && (
          <Button variant="outline" onClick={() => setSelectedDate(todayIso())}>
            ↩ Today
          </Button>
        )}
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: isToday ? "Today's Total" : "Day Total", value: counts.total,  tone: "navy"   as const, icon: "📦" },
          { label: "Normal",                                 value: counts.normal, tone: "good"   as const, icon: "🔵" },
          { label: "Rescue",                                 value: counts.rescue, tone: "notice" as const, icon: "🟠" },
        ].map((s) => (
          <StatCard
            key={s.label}
            tone={s.tone}
            label={
              <span className="inline-flex items-center justify-center gap-2">
                <span className="text-lg">{s.icon}</span>
                <span className="uppercase tracking-wider">{s.label}</span>
              </span>
            }
            value={fmtBigNum(s.value)}
            sub={s.value >= 1000 ? `${s.value.toLocaleString()} shipments` : undefined}
          />
        ))}
      </div>

      {/* ── Scan card ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <span className="text-[15px] font-bold text-brand-700">Record NDD Shipments</span>
          {isToday && <span className="text-xs text-gray-400">Auto-refreshes every 30s</span>}
        </CardHeader>

        <CardBody className="space-y-5">

          {/* Toast */}
          {toast && (
            <Alert tone={toast.ok ? "success" : "error"} className="font-bold">
              {toast.msg}
            </Alert>
          )}

          <div className="flex flex-wrap gap-5">

            {/* Left: type toggle + textarea */}
            <div className="flex flex-[1_1_320px] flex-col gap-4">
              {/* Type toggle */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Default Type
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                  {(["Normal", "Rescue"] as ShipmentType[]).map((t) => (
                    <button
                      key={t} type="button" onClick={() => setType(t)}
                      className={cn(
                        "flex-1 cursor-pointer py-2.5 text-sm font-bold transition-colors",
                        type === t
                          ? t === "Normal"
                            ? "bg-brand-700 text-white"
                            : "bg-notice-600 text-white"
                          : "bg-transparent text-gray-500 hover:bg-gray-100",
                      )}
                    >
                      {t === "Normal" ? "🔵  Normal" : "🟠  Rescue"}
                    </button>
                  ))}
                </div>
              </div>

              {/* AWB textarea */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    AWB List
                  </label>
                  {awbList.trim() && (() => {
                    const lines  = awbList.split(/\r?\n/).filter((l) => l.trim());
                    const rescue = lines.filter((l) => l.trim().toUpperCase().startsWith("R:")).length;
                    const normal = lines.length - rescue;
                    return (
                      <span className="text-xs font-bold text-brand-700">
                        {lines.length.toLocaleString()} AWB{lines.length !== 1 ? "s" : ""}
                        {rescue > 0 && <span className="ml-1.5 text-notice-600">({rescue}R / {normal}N)</span>}
                      </span>
                    );
                  })()}
                </div>
                <Textarea
                  ref={textareaRef}
                  value={awbList}
                  onChange={(e) => setAwbList(e.target.value)}
                  placeholder={"Scan or paste AWBs here…\nOne per line\n\nPrefix R: → Rescue override\n  e.g.  R:AWB123456789"}
                  autoFocus
                  rows={12}
                  className="resize-y bg-gray-50 font-mono text-[13px] leading-relaxed"
                />
              </div>
            </div>

            {/* Right: submit + tips */}
            <div className="flex flex-[0_0_200px] flex-col justify-end gap-3.5">
              <Button
                onClick={handleSubmit}
                loading={loading}
                size="lg"
                className="font-extrabold"
              >
                {loading ? "Saving…" : "Submit ➜"}
              </Button>

              {/* Tips */}
              <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Tips
                </div>
                {[
                  ["(no prefix)", "Uses default type"],
                  ["R:AWB…", "Force → Rescue"],
                  ["N:AWB…", "Force → Normal"],
                  ["Duplicate AWB", "Auto-replaced"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <code className="flex-shrink-0 whitespace-nowrap rounded bg-brand-50 px-1.5 py-px text-[11px] font-bold text-brand-600">{k}</code>
                    <span className="text-[11px] leading-snug text-gray-500">{v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </CardBody>
      </Card>

    </div>
  );
}
