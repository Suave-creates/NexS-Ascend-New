"use client";

// src/app/packing-dispatch/tray-releaser/page.tsx
//
// NexS Tray Releaser — webapp port of the Chrome extension.
//   • Dump: pulled from /api/packing-dispatch/dump (runs SQL directly on NexS_DB).
//   • Trays / release: called LIVE from the browser against app.nexs.lenskart.com,
//     exactly like the extension — the user must be logged into NexS in another tab.
//     (Cross-origin caveat: see nexsApi.ts.)

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { NEXS_CONFIG as cfg, type DumpOrder, type TrayRecord } from './config';
import {
  annotateTrays,
  multiComparator,
  TIER,
  type AnnotatedRow,
  type SortKey,
  type Tier,
} from './match';
import {
  fetchAllTrays,
  releaseTrays,
  loadDumpFromBackend,
  loadDumpFromFile,
  type FetchContext,
  type ReleaseTray,
} from './nexsApi';

// ---- small helpers ---------------------------------------------------------
const priLabel = (p: unknown) => {
  const n = Number(p);
  return cfg.PRIORITY_LABELS[n] != null
    ? cfg.PRIORITY_LABELS[n]
    : p == null || p === ''
    ? ''
    : String(p);
};
const priClass = (p: unknown) => {
  const n = Number(p);
  return n === 1 ? 'P1' : n === 2 ? 'P2' : 'dash';
};
const tierLabel = (t: Tier) =>
  t === TIER.NO_INCOMING ? 'No incoming' : t === TIER.FULL ? 'Full' : 'Waiting';

type LogLine = { text: string; cls?: string };
type ColFilters = {
  tier: Set<string>;
  softCourier: Set<string>;
  channel: Set<string>;
  priority: Set<number>;
  city: Set<string>;
  trayId: string;
};

const emptyColFilters = (): ColFilters => ({
  tier: new Set(),
  softCourier: new Set(),
  channel: new Set(),
  priority: new Set(),
  city: new Set(),
  trayId: '',
});

// Multi-select filter keys (set-based) vs text keys.
const MULTI_KEYS = ['tier', 'softCourier', 'channel', 'priority', 'city'] as const;
const TEXT_KEYS = ['trayId'] as const;

// Pure row getter for a filter key.
function rowVal(r: AnnotatedRow, key: keyof ColFilters): unknown {
  switch (key) {
    case 'tier':
      return r.tier;
    case 'softCourier':
      return r.softCourier;
    case 'channel':
      return r.channel;
    case 'priority':
      return r.priority;
    case 'trayId':
      return r.trayId;
    case 'city':
      return r.city;
  }
}

// Pure view computation, shared by render + the auto engine.
function buildViewRows(
  annotated: AnnotatedRow[],
  colFilters: ColFilters,
  quickFilters: Set<string>,
  search: string,
  sortKeys: SortKey[]
): AnnotatedRow[] {
  let rows = annotated.filter((r) => {
    // column filters
    for (const k of MULTI_KEYS) {
      const set = colFilters[k] as Set<unknown>;
      if (set.size && !set.has(rowVal(r, k))) return false;
    }
    for (const k of TEXT_KEYS) {
      const v = colFilters[k];
      if (v && !String(rowVal(r, k)).toLowerCase().includes(v.toLowerCase()))
        return false;
    }
    // quick filters (OR among themselves, AND with column filters)
    if (quickFilters.size) {
      let q = false;
      if (quickFilters.has('NO_INCOMING') && r.tier === TIER.NO_INCOMING) q = true;
      if (
        quickFilters.has('WAITING_4H') &&
        r.tier === TIER.WAITING &&
        r.ageMs > cfg.QUICK_WAITING_AGE_HOURS * 3600000
      )
        q = true;
      if (!q) return false;
    }
    return true;
  });

  const t = search.trim().toLowerCase();
  if (t) {
    rows = rows.filter((r) =>
      [r.trayId, r.city, r.storeCode, r.softCourier, r.channel, priLabel(r.priority), r.reason].some(
        (v) => String(v).toLowerCase().includes(t)
      )
    );
  }
  return rows.slice().sort(multiComparator(sortKeys));
}

const SORT_LABELS: Record<string, string> = {
  suggestion: 'Suggestion',
  priority: 'Priority',
  aging: 'Aging',
  shipments: 'Shipments',
  matched: 'Incoming',
  projected: 'Projected',
  softCourier: 'Soft Courier',
  channel: 'Channel',
  city: 'City',
  trayId: 'Tray ID',
};

const FUNNEL = (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 2.5A.5.5 0 0 1 1.5 2h13a.5.5 0 0 1 .4.8L10 9v4.2a.5.5 0 0 1-.27.44l-3 1.5A.5.5 0 0 1 6 14.7V9L1.1 2.8A.5.5 0 0 1 1 2.5Z" />
  </svg>
);

export default function TrayReleaserPage() {
  // ---- core data ----
  const [records, setRecords] = useState<TrayRecord[]>([]);
  const [orders, setOrders] = useState<DumpOrder[]>([]);
  const [facility, setFacility] = useState(cfg.FACILITY_FALLBACK);
  const [workstation, setWorkstation] = useState(cfg.WORKSTATION_FALLBACK);

  // ---- view controls ----
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKeys, setSortKeys] = useState<SortKey[]>([{ attr: 'suggestion', reversed: false }]);
  const [search, setSearch] = useState('');
  const [colFilters, setColFilters] = useState<ColFilters>(emptyColFilters());
  const [quickFilters, setQuickFilters] = useState<Set<string>>(new Set());

  // ---- status / progress / logs ----
  const [status, setStatus] = useState<{ text: string; kind?: string }>({ text: 'Ready.' });
  const [progress, setProgress] = useState<{ active: boolean; pct: number; indet?: boolean }>({
    active: false,
    pct: 0,
  });
  const [busy, setBusy] = useState(false);
  const [releaseLog, setReleaseLog] = useState<LogLine[]>([]);

  // ---- dump pull elapsed timer ----
  const [dumpElapsed, setDumpElapsed] = useState<number | null>(null);

  // ---- auto-release ----
  const [autoBatch, setAutoBatch] = useState(cfg.AUTO_DEFAULTS.batchSize);
  const [autoInterval, setAutoInterval] = useState(cfg.AUTO_DEFAULTS.intervalMinutes);
  const [autoRefreshDump, setAutoRefreshDump] = useState(cfg.AUTO_DEFAULTS.refreshDumpEachCycle);
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoCycles, setAutoCycles] = useState(0);
  const [autoReleased, setAutoReleased] = useState(0);
  const [autoStateText, setAutoStateText] = useState('Idle');
  const [autoCountdown, setAutoCountdown] = useState('');
  const [autoLog, setAutoLog] = useState<LogLine[]>([]);

  const autoRef = useRef({ running: false, busy: false, cycles: 0, released: 0, nextAt: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- filter popover ----
  const [activeFilter, setActiveFilter] = useState<{
    key: keyof ColFilters;
    rect: DOMRect;
  } | null>(null);

  // ---- annotate (derived) ----
  const annotateOut = useMemo(() => annotateTrays(records, orders), [records, orders]);
  const annotated = annotateOut.rows;
  const { channelAvailable, channelField, usedKeys, summary } = annotateOut;

  const viewRows = useMemo(
    () => buildViewRows(annotated, colFilters, quickFilters, search, sortKeys),
    [annotated, colFilters, quickFilters, search, sortKeys]
  );

  // ---- "latest" mirror for the auto engine (avoids stale closures) ----
  const latest = useRef({
    annotated,
    colFilters,
    quickFilters,
    search,
    sortKeys,
    facility,
    workstation,
    orders,
  });
  latest.current = {
    annotated,
    colFilters,
    quickFilters,
    search,
    sortKeys,
    facility,
    workstation,
    orders,
  };

  const ctx = useCallback(
    (): FetchContext => ({ facility, workstation }),
    [facility, workstation]
  );

  // ---- settings persistence ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(cfg.SETTINGS_STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.facility) setFacility(d.facility);
      if (d.workstation) setWorkstation(d.workstation);
      if (Array.isArray(d.sortKeys) && d.sortKeys.length) setSortKeys(d.sortKeys);
      if (typeof d.search === 'string') setSearch(d.search);
      if (Array.isArray(d.quickFilters)) setQuickFilters(new Set(d.quickFilters));
      if (d.colFilters) {
        const cf = emptyColFilters();
        const cfAny = cf as unknown as Record<string, unknown>;
        for (const k of MULTI_KEYS)
          if (Array.isArray(d.colFilters[k])) cfAny[k] = new Set(d.colFilters[k]);
        for (const k of TEXT_KEYS) if (typeof d.colFilters[k] === 'string') cfAny[k] = d.colFilters[k];
        setColFilters(cf);
      }
      if (d.auto) {
        if (d.auto.batch) setAutoBatch(d.auto.batch);
        if (d.auto.mins) setAutoInterval(d.auto.mins);
        if (typeof d.auto.refreshDump === 'boolean') setAutoRefreshDump(d.auto.refreshDump);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cf: Record<string, unknown> = {};
    for (const k of MULTI_KEYS) cf[k] = [...(colFilters[k] as Set<unknown>)];
    for (const k of TEXT_KEYS) cf[k] = colFilters[k];
    const data = {
      facility,
      workstation,
      sortKeys,
      search,
      quickFilters: [...quickFilters],
      colFilters: cf,
      auto: { batch: autoBatch, mins: autoInterval, refreshDump: autoRefreshDump },
    };
    try {
      localStorage.setItem(cfg.SETTINGS_STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [
    facility,
    workstation,
    sortKeys,
    search,
    quickFilters,
    colFilters,
    autoBatch,
    autoInterval,
    autoRefreshDump,
  ]);

  // cleanup timers on unmount
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tickerRef.current) clearInterval(tickerRef.current);
    },
    []
  );

  const log = (setter: typeof setReleaseLog, text: string, cls?: string) =>
    setter((prev) => [...prev, { text, cls }]);

  // ===========================================================================
  // Fetch trays
  // ===========================================================================
  const runFetch = useCallback(async () => {
    setBusy(true);
    setProgress({ active: true, pct: 0 });
    setStatus({ text: 'Fetching trays from NexS…' });
    try {
      const res = await fetchAllTrays(ctx(), ({ fetched, total }) => {
        if (total) {
          setProgress({ active: true, pct: Math.min(100, Math.round((fetched / total) * 100)) });
          setStatus({ text: `Fetched ${fetched} / ${total}…` });
        } else {
          setStatus({ text: `Fetched ${fetched}…` });
        }
      });
      setRecords(res.records);
      setProgress({ active: true, pct: 100 });
      const got = res.records.length;
      const tc = res.totalCount;
      let msg = `Loaded ${got} trays across ${res.pages} page(s) (both directions, de-duped).`;
      let kind = 'ok';
      if (tc != null) {
        if (got >= tc - 10) msg += ` Complete set (totalCount ${tc}).`;
        else {
          msg += ` ⚠ totalCount reads ${tc}; ${tc - got} may have shifted — re-fetch if it matters.`;
          kind = 'warn';
        }
      }
      setStatus({ text: msg, kind });
    } catch (err) {
      setStatus({
        text:
          'Fetch error: ' +
          ((err as Error)?.message || err) +
          ' — make sure you are logged in to app.nexs.lenskart.com in another tab.',
        kind: 'err',
      });
    } finally {
      setBusy(false);
      setTimeout(() => setProgress((p) => ({ ...p, active: false })), 1200);
    }
  }, [ctx]);

  // ===========================================================================
  // Dump
  // ===========================================================================
  const onPullDump = useCallback(async () => {
    setBusy(true);
    setProgress({ active: true, pct: 0, indet: true });
    const t0 = Date.now();
    setDumpElapsed(0);
    const timer = setInterval(() => setDumpElapsed(Math.round((Date.now() - t0) / 1000)), 1000);
    try {
      const o = await loadDumpFromBackend(facility, cfg.DUMP_DAYS);
      setOrders(o);
      setStatus({
        text: `Dump loaded: ${o.length} orders (facility ${facility}, ${Math.round(
          (Date.now() - t0) / 1000
        )}s).`,
        kind: 'ok',
      });
    } catch (err) {
      setStatus({
        text: 'Dump query failed: ' + ((err as Error)?.message || err) + ' — you can upload a CSV instead.',
        kind: 'err',
      });
    } finally {
      clearInterval(timer);
      setDumpElapsed(null);
      setBusy(false);
      setProgress((p) => ({ ...p, indet: false }));
      setTimeout(() => setProgress((p) => ({ ...p, active: false })), 800);
    }
  }, [facility]);

  const onDumpFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setStatus({ text: `Reading ${file.name}…` });
      const o = await loadDumpFromFile(file);
      setOrders(o);
      setStatus({ text: `Dump loaded: ${o.length} orders from ${file.name}.`, kind: 'ok' });
    } catch (err) {
      setStatus({ text: 'Dump read failed: ' + ((err as Error)?.message || err), kind: 'err' });
    } finally {
      e.target.value = '';
    }
  }, []);

  // ===========================================================================
  // Selection
  // ===========================================================================
  const toggleSelect = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleAllVisible = (on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of viewRows) {
        if (on) next.add(r.trayId);
        else next.delete(r.trayId);
      }
      return next;
    });

  const selectSuggested = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of annotated) if (r.action === 'RELEASE') next.add(r.trayId);
      return next;
    });

  // ===========================================================================
  // Sorting / filters
  // ===========================================================================
  const onSort = (attr: string, additive: boolean) => {
    setSortKeys((prev) => {
      const keys = prev.map((k) => ({ ...k }));
      const idx = keys.findIndex((k) => k.attr === attr);
      if (additive) {
        if (idx >= 0) keys[idx].reversed = !keys[idx].reversed;
        else keys.push({ attr, reversed: false });
        return keys;
      }
      if (keys.length === 1 && idx === 0) {
        keys[0].reversed = !keys[0].reversed;
        return keys;
      }
      return [{ attr, reversed: false }];
    });
  };

  const toggleSortLevel = (attr: string) =>
    setSortKeys((prev) => {
      const i = prev.findIndex((k) => k.attr === attr);
      let next = prev.map((k) => ({ ...k }));
      if (i >= 0) next.splice(i, 1);
      else next.push({ attr, reversed: false });
      if (!next.length) next = [{ attr: 'suggestion', reversed: false }];
      return next;
    });

  const toggleQuickFilter = (key: string) =>
    setQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const clearFilters = () => {
    setColFilters(emptyColFilters());
    setQuickFilters(new Set());
    setSearch('');
    setActiveFilter(null);
  };

  const hasSort = (a: string) => sortKeys.some((k) => k.attr === a);
  const isFilterActive = (key: keyof ColFilters) =>
    (MULTI_KEYS as readonly string[]).includes(key)
      ? (colFilters[key] as Set<unknown>).size > 0
      : !!colFilters[key];

  const distinctCounts = (key: keyof ColFilters): [unknown, number][] => {
    const m = new Map<unknown, number>();
    for (const r of annotated) {
      const v = rowVal(r, key);
      m.set(v, (m.get(v) || 0) + 1);
    }
    // City filter is restricted to a curated list (cfg.CITY_FILTER_OPTIONS),
    // shown in that order regardless of how many match the current data.
    if (key === 'city') {
      return cfg.CITY_FILTER_OPTIONS.map((c) => [c, m.get(c) || 0]);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  // ===========================================================================
  // Manual release
  // ===========================================================================
  const releaseSelected = useCallback(async () => {
    const ids = [...selected];
    if (!ids.length) return;
    const map = new Map(annotated.map((r) => [r.trayId, r]));
    const picked = ids.map((id) => map.get(id)).filter(Boolean) as AnnotatedRow[];
    const trays: ReleaseTray[] = picked.map((r) => ({
      trayId: r.trayId,
      storeCode: r.storeCode,
      parentId: r.tray.parentId,
    }));
    const waiting = picked.filter((r) => r.tier === TIER.WAITING).length;
    const msg =
      `Release ${trays.length} tray(s)?` +
      (waiting ? `\n\n${waiting} are still WAITING for incoming orders (override).` : '') +
      `\n\nThis fires the live releaseTray API and cannot be undone.`;
    if (!window.confirm(msg)) return;

    setBusy(true);
    setProgress({ active: true, pct: 0 });
    log(setReleaseLog, `--- Releasing ${trays.length} tray(s) at ${new Date().toLocaleTimeString()} ---`, 'hd');
    try {
      const results = await releaseTrays(ctx(), trays, ({ done, total, last }) => {
        setProgress({ active: true, pct: Math.round((done / total) * 100) });
        setStatus({ text: `Releasing ${done}/${total}…` });
        if (last)
          log(
            setReleaseLog,
            `${last.ok ? '✓' : '✗'} ${last.trayId} — ${
              last.ok ? 'HTTP ' + last.httpStatus : last.error || 'HTTP ' + last.httpStatus
            }`,
            last.ok ? 'ok' : 'err'
          );
      });
      const okIds = results.filter((r) => r.ok).map((r) => r.trayId);
      const failN = results.length - okIds.length;
      setSelected((prev) => {
        const next = new Set(prev);
        okIds.forEach((id) => next.delete(id));
        return next;
      });
      log(setReleaseLog, `Done: ${okIds.length} released, ${failN} failed.`, failN ? 'err' : 'ok');
      setStatus({ text: `Released ${okIds.length}/${results.length}. Refreshing…`, kind: failN ? 'warn' : 'ok' });
      await runFetch();
    } catch (err) {
      setStatus({ text: 'Release error: ' + ((err as Error)?.message || err), kind: 'err' });
      log(setReleaseLog, 'ERROR: ' + ((err as Error)?.message || err), 'err');
    } finally {
      setBusy(false);
      setTimeout(() => setProgress((p) => ({ ...p, active: false })), 1200);
    }
  }, [selected, annotated, ctx, runFetch]);

  // ===========================================================================
  // Auto-release engine
  // ===========================================================================
  const filterSummaryText = useCallback(() => {
    const parts: string[] = [];
    for (const k of MULTI_KEYS) {
      const set = colFilters[k] as Set<unknown>;
      if (set.size)
        parts.push(`${k}=[${[...set].map((v) => (k === 'tier' ? tierLabel(v as Tier) : k === 'priority' ? priLabel(v) : String(v))).join(', ')}]`);
    }
    for (const k of TEXT_KEYS) if (colFilters[k]) parts.push(`${k}~"${colFilters[k]}"`);
    if (quickFilters.size) {
      const q: string[] = [];
      if (quickFilters.has('NO_INCOMING')) q.push('No-incoming');
      if (quickFilters.has('WAITING_4H')) q.push(`Waiting>${cfg.QUICK_WAITING_AGE_HOURS}h`);
      parts.push(`quick=[${q.join(' OR ')}]`);
    }
    if (search.trim()) parts.push(`search~"${search.trim()}"`);
    parts.push('sort=' + sortKeys.map((k) => k.attr + (k.reversed ? '(rev)' : '')).join(' › '));
    return parts.length ? parts.join('  ·  ') : 'no filters (ALL trays)';
  }, [colFilters, quickFilters, search, sortKeys]);

  const tickCountdown = useCallback(() => {
    if (!autoRef.current.running) return;
    if (autoRef.current.busy) {
      setAutoCountdown('working…');
      return;
    }
    const ms = Math.max(0, autoRef.current.nextAt - Date.now());
    const s = Math.round(ms / 1000);
    setAutoCountdown(
      `next in ${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
    );
  }, []);

  const runAutoCycle = useCallback(async () => {
    if (!autoRef.current.running || autoRef.current.busy) return;
    autoRef.current.busy = true;
    const batch = Math.max(1, Math.min(cfg.AUTO_MAX_BATCH, autoBatch));
    const mins = Math.max(cfg.AUTO_MIN_INTERVAL_MIN, autoInterval);
    const cycle = autoRef.current.cycles + 1;
    const L = latest.current;
    try {
      setAutoStateText(`Cycle ${cycle}: fetching…`);
      const fres = await fetchAllTrays({ facility: L.facility, workstation: L.workstation });
      setRecords(fres.records);

      let orderSet = L.orders;
      if (autoRefreshDump) {
        setAutoStateText(`Cycle ${cycle}: refreshing dump…`);
        try {
          orderSet = await loadDumpFromBackend(L.facility, cfg.DUMP_DAYS);
          setOrders(orderSet);
        } catch (e) {
          log(setAutoLog, `cycle ${cycle}: dump refresh failed (${(e as Error)?.message || e}) — using prior dump`, 'warn');
        }
      }

      // Recompute against the freshly fetched records + dump.
      const ann = annotateTrays(fres.records, orderSet).rows;
      const rows = buildViewRows(
        ann,
        L.colFilters,
        L.quickFilters,
        L.search,
        L.sortKeys
      ).slice(0, batch);
      const trays: ReleaseTray[] = rows.map((r) => ({
        trayId: r.trayId,
        storeCode: r.storeCode,
        parentId: r.tray.parentId,
      }));

      if (!trays.length) {
        log(setAutoLog, `cycle ${cycle}: no trays match — nothing to release`, 'warn');
      } else {
        setAutoStateText(`Cycle ${cycle}: releasing ${trays.length}…`);
        const results = await releaseTrays(
          { facility: L.facility, workstation: L.workstation },
          trays
        );
        const ok = results.filter((r) => r.ok).length;
        autoRef.current.released += ok;
        setAutoReleased(autoRef.current.released);
        log(
          setAutoLog,
          `cycle ${cycle}: released ${ok}/${trays.length}` +
            (ok < trays.length ? ` (${trays.length - ok} failed)` : ''),
          ok < trays.length ? 'warn' : 'ok'
        );
      }
      autoRef.current.cycles = cycle;
      setAutoCycles(cycle);
    } catch (err) {
      log(setAutoLog, `cycle ${cycle}: ERROR ${(err as Error)?.message || err}`, 'err');
      setStatus({ text: 'Auto-release error: ' + ((err as Error)?.message || err), kind: 'err' });
    } finally {
      autoRef.current.busy = false;
      if (autoRef.current.running) {
        autoRef.current.nextAt = Date.now() + mins * 60000;
        setAutoStateText('Waiting');
        timerRef.current = setTimeout(runAutoCycle, mins * 60000);
        tickCountdown();
      }
    }
  }, [autoBatch, autoInterval, autoRefreshDump, tickCountdown]);

  const startAuto = useCallback(() => {
    if (autoRef.current.running) return;
    if (!records.length) {
      setStatus({ text: 'Fetch trays before starting auto-release.', kind: 'err' });
      return;
    }
    const batch = Math.max(1, Math.min(cfg.AUTO_MAX_BATCH, autoBatch));
    const mins = Math.max(cfg.AUTO_MIN_INTERVAL_MIN, autoInterval);
    const preview = viewRows.length;
    const ok = window.confirm(
      `Start AUTO-RELEASE?\n\n` +
        `• Every ${mins} min, release up to ${batch} trays\n` +
        `• Scope (current filters/sort):\n   ${filterSummaryText()}\n` +
        `• Right now ${preview} trays match; it will flush the top ${Math.min(batch, preview)} first.\n` +
        (autoRefreshDump
          ? `• Dump refreshed each cycle.\n`
          : `• Using the currently loaded dump (not refreshed).\n`) +
        `\nThis fires the live releaseTray API repeatedly and cannot be undone. Keep this tab open.`
    );
    if (!ok) return;

    autoRef.current = { running: true, busy: false, cycles: 0, released: 0, nextAt: 0 };
    setAutoRunning(true);
    setAutoCycles(0);
    setAutoReleased(0);
    setAutoStateText('Starting…');
    log(setAutoLog, `=== AUTO-RELEASE started ${new Date().toLocaleTimeString()} — batch ${batch}, every ${mins}m ===`, 'hd');
    log(setAutoLog, `scope: ${filterSummaryText()}`, 'warn');
    if (tickerRef.current) clearInterval(tickerRef.current);
    tickerRef.current = setInterval(tickCountdown, 1000);
    runAutoCycle();
  }, [records.length, autoBatch, autoInterval, autoRefreshDump, viewRows.length, filterSummaryText, runAutoCycle, tickCountdown]);

  const stopAuto = useCallback(() => {
    autoRef.current.running = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    setAutoRunning(false);
    setAutoStateText('Idle');
    setAutoCountdown('');
    log(
      setAutoLog,
      `=== auto-release stopped ${new Date().toLocaleTimeString()} (${autoRef.current.cycles} cycles, ${autoRef.current.released} released) ===`,
      'hd'
    );
  }, []);

  // ===========================================================================
  // Export
  // ===========================================================================
  const onExport = useCallback(async () => {
    if (!records.length) return;
    try {
      const XLSX = await import('xlsx');
      const rows = records.map((rec) => {
        const o: Record<string, unknown> = {};
        for (const c of cfg.COLUMNS) o[c.label] = (rec as Record<string, unknown>)[c.key] ?? '';
        return o;
      });
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Trays');
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const name = `nexs-trays-${facility}-${stamp}.xlsx`;
      XLSX.writeFile(wb, name);
      setStatus({ text: `Exported ${records.length} rows to ${name}`, kind: 'ok' });
    } catch (err) {
      setStatus({ text: 'Export failed: ' + ((err as Error)?.message || err), kind: 'err' });
    }
  }, [records, facility]);

  // ===========================================================================
  // Table columns
  // ===========================================================================
  type Col = {
    key: string;
    label?: string;
    sortKey?: string;
    filterKey?: keyof ColFilters;
    num?: boolean;
    sel?: boolean;
  };
  const columns: Col[] = useMemo(() => {
    const c: Col[] = [
      { key: '_sel', sel: true },
      { key: 'tier', label: 'Suggestion', sortKey: 'suggestion', filterKey: 'tier' },
      { key: 'trayId', label: 'Tray ID', sortKey: 'trayId', filterKey: 'trayId' },
      { key: 'city', label: 'City', sortKey: 'city', filterKey: 'city' },
      { key: 'softCourier', label: 'Soft Courier', sortKey: 'softCourier', filterKey: 'softCourier' },
    ];
    if (channelAvailable)
      c.push({ key: 'channel', label: 'Channel', sortKey: 'channel', filterKey: 'channel' });
    c.push(
      { key: 'priority', label: 'Priority', sortKey: 'priority', filterKey: 'priority' },
      { key: 'fill', label: 'No. of Shipments', sortKey: 'shipments', num: true },
      { key: 'matchedCount', label: 'Incoming Orders', sortKey: 'matched', num: true },
      { key: 'projectedFill', label: 'Projected Fill', sortKey: 'projected', num: true },
      { key: 'ageLabel', label: 'Aging', sortKey: 'aging' },
      { key: 'reason', label: 'Reason' }
    );
    return c;
  }, [channelAvailable]);

  const allVisibleSelected = viewRows.length > 0 && viewRows.every((r) => selected.has(r.trayId));

  const dumpGroups = useMemo(
    () => new Set(orders.map((o) => `${o.storeCode}|${o.softCourier}|${o.channel}`)).size,
    [orders]
  );

  // Current courier partners — packages currently sitting in trays vs incoming
  // orders from the dump, grouped by soft courier.
  const courierStats = useMemo(() => {
    const m = new Map<string, { pkg: number; incoming: number }>();
    const get = (c: string) => {
      let e = m.get(c);
      if (!e) m.set(c, (e = { pkg: 0, incoming: 0 }));
      return e;
    };
    for (const r of annotated) get(r.softCourier || '—').pkg += r.fill;
    for (const o of orders) get(o.softCourier || '—').incoming += 1;
    return [...m.entries()]
      .map(([courier, v]) => ({ courier, ...v }))
      .sort((a, b) => b.pkg + b.incoming - (a.pkg + a.incoming));
  }, [annotated, orders]);

  const pickedQueue = useMemo(() => {
    const map = new Map(annotated.map((r) => [r.trayId, r]));
    return [...selected].map((id) => map.get(id)).filter(Boolean) as AnnotatedRow[];
  }, [selected, annotated]);
  const queueWaiting = pickedQueue.filter((r) => r.tier === TIER.WAITING).length;

  // ---------------------------------------------------------------------------
  return (
    <div className="tr-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Header */}
      <header className="tr-header">
        <div className="brand">
          <span className="glyph">◆</span>
          <h1>NexS Tray Releaser</h1>
          <small>Release Console</small>
        </div>
        <span className="meta ctx">
          Facility{' '}
          <input
            type="text"
            className="ctx-input"
            value={facility}
            onChange={(e) => setFacility(e.target.value.toUpperCase())}
            title="facility-code header & dump facility"
          />
          <span style={{ marginLeft: 10 }}>Workstation </span>
          <input
            type="text"
            className="ctx-input"
            value={workstation}
            onChange={(e) => setWorkstation(e.target.value.toUpperCase())}
            title="workstation-id header"
          />
        </span>
        <span className="spacer" />
        <span>
          <span className="pill cap-ok">release ready</span>
        </span>
        <button className="btn-ghost" onClick={onExport} disabled={!records.length}>
          Export
        </button>
        <button
          className="btn-danger"
          onClick={releaseSelected}
          disabled={selected.size === 0 || autoRunning || busy}
        >
          Release selected ({selected.size})
        </button>
      </header>

      {/* Toolbar */}
      <div className="tr-toolbar">
        <input
          type="search"
          placeholder="Quick find across all columns…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="sep" />
        <button className="btn-ghost" onClick={selectSuggested}>
          Select suggested
        </button>
        <span className="sep" />
        <span className="qlabel">Sort</span>
        <button className={'btn-ghost qbtn' + (hasSort('aging') ? ' on' : '')} onClick={() => toggleSortLevel('aging')}>
          Aging ↓
        </button>
        <button className={'btn-ghost qbtn' + (hasSort('shipments') ? ' on' : '')} onClick={() => toggleSortLevel('shipments')}>
          Shipments ↓
        </button>
        <button className={'btn-ghost qbtn' + (hasSort('priority') ? ' on' : '')} onClick={() => toggleSortLevel('priority')}>
          Priority ↓
        </button>
        <span className="sep" />
        <span className="qlabel">Show</span>
        <button className={'btn-ghost qbtn' + (quickFilters.has('NO_INCOMING') ? ' on' : '')} onClick={() => toggleQuickFilter('NO_INCOMING')}>
          No incoming
        </button>
        <button className={'btn-ghost qbtn' + (quickFilters.has('WAITING_4H') ? ' on' : '')} onClick={() => toggleQuickFilter('WAITING_4H')}>
          Waiting &gt;4h
        </button>
        <span className="sep" />
        <button className="btn-ghost" onClick={() => setSelected(new Set())}>
          Clear selection
        </button>
        <button className="btn-ghost" onClick={clearFilters}>
          Clear filters
        </button>
        <button className="btn-ghost" onClick={() => setSortKeys([{ attr: 'suggestion', reversed: false }])}>
          Smart sort
        </button>
        <span className="sep" />
        <span className="meta">
          Sort:{' '}
          {sortKeys
            .map((k, i) => `${i + 1}.${SORT_LABELS[k.attr] || k.attr} ${k.reversed ? '▲' : '▼'}`)
            .join('  ›  ')}
        </span>
        <span className="spacer" />
        <span className="meta">
          {viewRows.length} of {annotated.length} trays
          {selected.size ? ` · ${selected.size} selected` : ''}
        </span>
      </div>

      {/* Layout */}
      <div className="tr-layout">
        <main>
          <table>
            <thead>
              <tr>
                {columns.map((col) => {
                  if (col.sel) {
                    return (
                      <th key="_sel">
                        <div className="th-inner">
                          <input
                            type="checkbox"
                            title="Select all visible"
                            checked={allVisibleSelected}
                            onChange={(e) => toggleAllVisible(e.target.checked)}
                          />
                        </div>
                      </th>
                    );
                  }
                  const sortIdx = col.sortKey ? sortKeys.findIndex((k) => k.attr === col.sortKey) : -1;
                  return (
                    <th key={col.key}>
                      <div className="th-inner">
                        <span
                          className={
                            'th-label' +
                            (col.sortKey ? ' sortable' : '') +
                            (sortIdx >= 0 ? ' active' : '')
                          }
                          title="Click to sort · Shift-click to add a level"
                          onClick={(e) => col.sortKey && onSort(col.sortKey, e.shiftKey)}
                        >
                          {col.label}
                          {sortIdx >= 0 && (
                            <span className="sort-arrow">
                              {(sortKeys[sortIdx].reversed ? '▲' : '▼') +
                                (sortKeys.length > 1 ? String(sortIdx + 1) : '')}
                            </span>
                          )}
                        </span>
                        {col.filterKey && (
                          <span
                            className={'funnel' + (isFilterActive(col.filterKey) ? ' active' : '')}
                            title="Filter"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              setActiveFilter((cur) =>
                                cur && cur.key === col.filterKey ? null : { key: col.filterKey!, rect }
                              );
                            }}
                          >
                            {FUNNEL}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {viewRows.map((r) => (
                <tr key={r.trayId} className={selected.has(r.trayId) ? 'selected' : ''}>
                  {columns.map((col) => {
                    if (col.sel)
                      return (
                        <td key="_sel">
                          <input
                            type="checkbox"
                            checked={selected.has(r.trayId)}
                            onChange={(e) => toggleSelect(r.trayId, e.target.checked)}
                          />
                        </td>
                      );
                    if (col.key === 'tier')
                      return (
                        <td key="tier">
                          <span className={'badge ' + r.tier}>
                            {r.tier === TIER.NO_INCOMING ? 'NO INCOMING' : r.tier}
                          </span>
                        </td>
                      );
                    if (col.key === 'priority')
                      return (
                        <td key="priority">
                          <span className={'pri ' + priClass(r.priority)}>{priLabel(r.priority)}</span>
                        </td>
                      );
                    if (col.key === 'fill')
                      return (
                        <td key="fill" className="num">
                          {r.fill}/{cfg.MAX_FILL}
                        </td>
                      );
                    if (col.num)
                      return (
                        <td key={col.key} className="num">
                          {(r as unknown as Record<string, unknown>)[col.key] as number}
                        </td>
                      );
                    if (col.key === 'reason')
                      return (
                        <td key="reason" className="mini">
                          {r.reason}
                        </td>
                      );
                    return (
                      <td key={col.key}>
                        {String((r as unknown as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {!records.length ? (
            <div className="empty">No trays loaded. Click “Fetch trays”.</div>
          ) : !viewRows.length ? (
            <div className="empty">No trays match the current filters.</div>
          ) : null}
        </main>

        <aside>
          {/* Dump box */}
          <div className="box">
            <h2>
              Query Dump <span className="right">{orders.length ? `${orders.length} orders` : ''}</span>
            </h2>
            <div className="body">
              <div className="file-row">
                <button className="btn-gold" onClick={onPullDump} disabled={busy} title="Run the query directly on NexS_DB">
                  {dumpElapsed != null ? `Querying… ${dumpElapsed}s` : 'Pull from NexS_DB'}
                </button>
                <button className="btn-ghost" onClick={runFetch} disabled={busy} title="Fetch trays live from NexS">
                  Fetch trays
                </button>
                <input type="file" accept=".csv,.tsv,.txt" onChange={onDumpFile} title="…or upload a CSV" />
              </div>
              <div className="hint" style={{ marginTop: 9 }}>
                {!orders.length ? (
                  'Pull the unassigned-orders dump to enable matching & suggestions.'
                ) : !channelAvailable ? (
                  <span style={{ color: 'var(--amber)' }}>
                    ⚠ Tray data has no channel field — matched on <b>store + courier</b> only.
                  </span>
                ) : (
                  <span style={{ color: 'var(--emerald)' }}>
                    Matching on {usedKeys.join(' + ')} (channel: <b>{channelField}</b>).
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Auto-release box */}
          <div className="box">
            <h2>
              Auto-Release{' '}
              <span className="right">
                {autoCycles ? `${autoCycles} cycles · ${autoReleased} released` : ''}
              </span>
            </h2>
            <div className="body">
              <div className="auto-grid">
                <label>Batch (trays / cycle)</label>
                <input
                  type="number"
                  min={1}
                  max={cfg.AUTO_MAX_BATCH}
                  value={autoBatch}
                  disabled={autoRunning}
                  onChange={(e) => setAutoBatch(Number(e.target.value))}
                />
                <label>Interval (minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={autoInterval}
                  disabled={autoRunning}
                  onChange={(e) => setAutoInterval(Number(e.target.value))}
                />
                <label>Refresh dump each cycle</label>
                <input
                  type="checkbox"
                  checked={autoRefreshDump}
                  disabled={autoRunning}
                  onChange={(e) => setAutoRefreshDump(e.target.checked)}
                />
              </div>
              <div className="auto-status">
                <span className={'dot' + (autoRunning ? ' live' : '')} />
                <span>{autoStateText}</span>
                <span className="spacer" />
                <span className="countdown">{autoCountdown}</span>
              </div>
              <div className="toggle-row">
                <button className="btn-gold" onClick={startAuto} disabled={autoRunning || !records.length}>
                  Start auto-release
                </button>
                <button className="btn-danger" onClick={stopAuto} disabled={!autoRunning}>
                  Stop
                </button>
              </div>
              <div className="hint" style={{ marginTop: 8 }}>
                Releases the top <b>{autoBatch}</b> trays matching the <b>current filters &amp; sort</b>, every{' '}
                <b>{autoInterval}</b> min. Keep this tab open. Irreversible.
              </div>
              {autoLog.length > 0 && (
                <div className="log" style={{ marginTop: 9 }}>
                  {autoLog.map((l, i) => (
                    <span key={i} className={l.cls}>
                      {l.text}
                      {'\n'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dump analytics (after fetching the unassigned-orders dump) */}
          <div className="box">
            <h2>
              Dump Analytics{' '}
              <span className="right">{orders.length ? `${orders.length} orders` : ''}</span>
            </h2>
            <div className="body">
              {orders.length > 0 ? (
                <>
                  <div className="kv">
                    <span>Suggested to release</span>
                    <span>
                      {summary.full + summary.noIncoming} (full {summary.full} · no-incoming {summary.noIncoming})
                    </span>
                  </div>
                  <div className="kv">
                    <span>Holding (incoming)</span>
                    <span>{summary.waiting}</span>
                  </div>
                  <div className="kv">
                    <span>store+courier+channel groups</span>
                    <span>{dumpGroups}</span>
                  </div>
                </>
              ) : (
                <div className="hint">
                  Pull the dump to see suggestions; courier partner stats appear once trays are fetched.
                </div>
              )}

              {courierStats.length > 0 && (
                <>
                  <div className="sub-h">Current Courier Partners</div>
                  <table className="mini-tbl">
                    <thead>
                      <tr>
                        <th>Courier</th>
                        <th className="num">Package</th>
                        <th className="num">Incoming</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courierStats.map((c) => (
                        <tr key={c.courier}>
                          <td>{c.courier}</td>
                          <td className="num">{c.pkg}</td>
                          <td className="num">{c.incoming}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>

          {/* Release queue */}
          <div className="box">
            <h2>Release Queue</h2>
            <div className="body">
              <div className="hint">
                Release body is built per tray — <code>{'{ trayId, storeCode, parentId }'}</code>, one PUT each.
              </div>
              <div className="hint" style={{ marginTop: 8 }}>
                {pickedQueue.length ? (
                  <>
                    <strong>{pickedQueue.length}</strong> selected
                    {queueWaiting ? (
                      <span style={{ color: 'var(--amber)' }}> · {queueWaiting} still WAITING (override)</span>
                    ) : null}
                  </>
                ) : (
                  'No trays selected.'
                )}
              </div>
              <div style={{ marginTop: 6 }}>
                {pickedQueue.slice(0, 60).map((r) => (
                  <div className="kv" key={r.trayId}>
                    <span>
                      {r.trayId} <span className="mini">{r.city}/{r.softCourier}</span>
                    </span>
                    <span className={'badge ' + r.tier} style={{ fontSize: 9 }}>
                      {r.tier === TIER.NO_INCOMING ? 'NO INC' : r.tier}
                    </span>
                  </div>
                ))}
                {pickedQueue.length > 60 && (
                  <div className="mini">…and {pickedQueue.length - 60} more</div>
                )}
              </div>
              {releaseLog.length > 0 && (
                <div className="log" style={{ marginTop: 10 }}>
                  {releaseLog.map((l, i) => (
                    <span key={i} className={l.cls}>
                      {l.text}
                      {'\n'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Status bar */}
      <div className="tr-statusbar">
        <span className={status.kind || ''}>{status.text}</span>
        <div className={'progress-wrap' + (progress.active ? ' active' : '') + (progress.indet ? ' indeterminate' : '')}>
          <div className="progress-bar" style={{ width: progress.pct + '%' }} />
        </div>
      </div>

      {/* Filter popover */}
      {activeFilter && (
        <FilterPopover
          fkey={activeFilter.key}
          rect={activeFilter.rect}
          colFilters={colFilters}
          setColFilters={setColFilters}
          distinctCounts={distinctCounts}
          onClose={() => setActiveFilter(null)}
        />
      )}
    </div>
  );
}

// ---- Filter popover --------------------------------------------------------
function FilterPopover({
  fkey,
  rect,
  colFilters,
  setColFilters,
  distinctCounts,
  onClose,
}: {
  fkey: keyof ColFilters;
  rect: DOMRect;
  colFilters: ColFilters;
  setColFilters: Dispatch<SetStateAction<ColFilters>>;
  distinctCounts: (key: keyof ColFilters) => [unknown, number][];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isMulti = (MULTI_KEYS as readonly string[]).includes(fkey);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const title =
    fkey === 'softCourier'
      ? 'Soft Courier'
      : fkey === 'trayId'
      ? 'Tray ID'
      : fkey === 'city'
      ? 'City'
      : fkey.charAt(0).toUpperCase() + fkey.slice(1);

  const left = Math.max(8, Math.min(rect.left, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 290));

  const toggleVal = (val: unknown, on: boolean) =>
    setColFilters((prev) => {
      const next = { ...prev, [fkey]: new Set(prev[fkey] as Set<unknown>) } as ColFilters;
      const set = next[fkey] as Set<unknown>;
      if (on) set.add(val);
      else set.delete(val);
      return next;
    });

  return (
    <div ref={ref} className="filter-popover" style={{ left, top: rect.bottom + 6 }}>
      <div className="fp-head">
        <span className="fp-title">{title}</span>
        {isMulti && (
          <span
            className="fp-clear"
            onClick={() =>
              setColFilters((prev) => {
                const values = distinctCounts(fkey).map(([v]) => v);
                const cur = prev[fkey] as Set<unknown>;
                const next = { ...prev } as ColFilters;
                (next as unknown as Record<string, unknown>)[fkey] =
                  cur.size >= values.length ? new Set() : new Set(values);
                return next;
              })
            }
          >
            All
          </span>
        )}
        <span
          className="fp-clear"
          onClick={() =>
            setColFilters((prev) => {
              const next = { ...prev } as ColFilters;
              (next as unknown as Record<string, unknown>)[fkey] = isMulti ? new Set() : '';
              return next;
            })
          }
        >
          Clear
        </span>
      </div>
      <div className="fp-body">
        {isMulti ? (
          <div className="fp-list">
            {distinctCounts(fkey).map(([val, cnt]) => {
              const checked = (colFilters[fkey] as Set<unknown>).has(val);
              const label =
                fkey === 'tier'
                  ? tierLabel(val as Tier)
                  : fkey === 'priority'
                  ? priLabel(val)
                  : (val as string) || '—';
              return (
                <label className="opt" key={String(val)}>
                  <input type="checkbox" checked={checked} onChange={(e) => toggleVal(val, e.target.checked)} />
                  <span>{label}</span>
                  <span className="cnt">{cnt}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <input
            type="text"
            placeholder="contains…"
            value={colFilters[fkey] as string}
            onChange={(e) =>
              setColFilters((prev) => ({ ...prev, [fkey]: e.target.value } as ColFilters))
            }
          />
        )}
      </div>
    </div>
  );
}

// ============================ Dark Luxury CSS (scoped to .tr-root) ===========
const CSS = `
.tr-root {
  --bg-0:#060708; --bg-1:#0d0f13; --bg-2:#14171d; --bg-3:#1b1f27;
  --line:#262b34; --line-strong:#343b47; --text:#f6f4ee; --text-2:#c4c9d2;
  --muted:#8b929e; --gold:#d9b75a; --gold-hi:#f1d690; --gold-dim:rgba(217,183,90,.14);
  --crimson:#e5484d; --crimson-hi:#ff5d63; --emerald:#46d39a; --amethyst:#b794f6;
  --amber:#f5b942; --shadow:0 10px 40px rgba(0,0,0,.55);
  height:100%; min-height:540px; border-radius:12px; overflow:hidden; border:1px solid var(--line);
  background:
    radial-gradient(1200px 500px at 80% -10%, rgba(217,183,90,.06), transparent 60%),
    radial-gradient(900px 500px at 0% 110%, rgba(183,148,246,.05), transparent 55%),
    var(--bg-0);
  color:var(--text); font:13px/1.55 "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;
  display:flex; flex-direction:column; letter-spacing:.1px;
}
.tr-root *{ box-sizing:border-box; }
.tr-root ::-webkit-scrollbar{ width:11px; height:11px; }
.tr-root ::-webkit-scrollbar-thumb{ background:#2b313b; border-radius:8px; border:2px solid var(--bg-0); }
.tr-header{ padding:13px 22px; background:linear-gradient(180deg,#101319,#0b0d11); border-bottom:1px solid var(--line); display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.tr-root .brand{ display:flex; align-items:baseline; gap:9px; }
.tr-root .brand h1{ font-size:16px; margin:0; font-weight:700; letter-spacing:.4px; }
.tr-root .brand .glyph{ color:var(--gold); font-weight:800; letter-spacing:2px; }
.tr-root .brand small{ color:var(--muted); font-size:10.5px; text-transform:uppercase; letter-spacing:2px; }
.tr-root .spacer{ flex:1; }
.tr-root .meta{ color:var(--text-2); font-size:12.5px; }
.tr-root .meta strong{ color:var(--gold-hi); font-weight:600; }
.tr-root .ctx-input{ width:74px; text-transform:uppercase; padding:4px 7px; }
.tr-root button{ font:inherit; font-size:12.5px; font-weight:600; cursor:pointer; border-radius:8px; padding:8px 14px; border:1px solid transparent; transition:transform .04s ease, background .15s, border-color .15s, color .15s; }
.tr-root button:active:not(:disabled){ transform:translateY(1px); }
.tr-root button:disabled{ opacity:.4; cursor:not-allowed; }
.tr-root .btn-gold{ background:linear-gradient(180deg,var(--gold-hi),var(--gold)); color:#2a2308; border-color:rgba(0,0,0,.25); box-shadow:0 2px 14px rgba(217,183,90,.18); }
.tr-root .btn-gold:hover:not(:disabled){ background:linear-gradient(180deg,#ffe6a8,var(--gold-hi)); }
.tr-root .btn-ghost{ background:var(--bg-2); color:var(--text-2); border-color:var(--line-strong); }
.tr-root .btn-ghost:hover:not(:disabled){ background:var(--bg-3); color:var(--text); border-color:var(--gold); }
.tr-root .btn-danger{ background:linear-gradient(180deg,#f2575c,var(--crimson)); color:#fff; box-shadow:0 2px 14px rgba(229,72,77,.25); }
.tr-root .btn-danger:hover:not(:disabled){ background:linear-gradient(180deg,#ff6b70,var(--crimson-hi)); }
.tr-root .pill{ padding:3px 10px; border-radius:999px; font-size:10.5px; font-weight:800; letter-spacing:.4px; text-transform:uppercase; }
.tr-root .pill.cap-ok{ background:rgba(70,211,154,.15); color:var(--emerald); border:1px solid rgba(70,211,154,.35); }
.tr-toolbar{ padding:9px 22px; background:var(--bg-1); border-bottom:1px solid var(--line); display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.tr-root .sep{ width:1px; height:22px; background:var(--line-strong); margin:0 2px; }
.tr-root input[type=search],.tr-root input[type=text],.tr-root input[type=number],.tr-root select{ background:var(--bg-3); border:1px solid var(--line-strong); color:var(--text); border-radius:8px; padding:7px 10px; font:inherit; font-size:12.5px; }
.tr-root input:focus,.tr-root select:focus{ outline:none; border-color:var(--gold); box-shadow:0 0 0 2px var(--gold-dim); }
.tr-root input[type=search]{ min-width:230px; }
.tr-root .qbtn.on{ background:var(--gold-dim); border-color:var(--gold); color:var(--gold-hi); box-shadow:inset 0 0 0 1px rgba(217,183,90,.25); }
.tr-root .qlabel{ color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:1.2px; font-weight:700; }
.tr-layout{ flex:1; display:flex; min-height:0; }
.tr-layout main{ flex:1; overflow:auto; min-width:0; }
.tr-layout aside{ width:388px; flex-shrink:0; border-left:1px solid var(--line); display:flex; flex-direction:column; overflow-y:auto; background:var(--bg-1); }
.tr-root .box{ border-bottom:1px solid var(--line); }
.tr-root .box>h2{ font-size:11px; text-transform:uppercase; letter-spacing:1.4px; color:var(--gold); margin:0; padding:11px 16px; background:linear-gradient(180deg,#12151b,#0e1116); border-bottom:1px solid var(--line); display:flex; align-items:center; gap:8px; }
.tr-root .box>h2 .right{ margin-left:auto; color:var(--muted); letter-spacing:.3px; text-transform:none; font-weight:600; }
.tr-root .box .body{ padding:13px 16px; }
.tr-root table{ border-collapse:separate; border-spacing:0; width:100%; font-size:12px; }
.tr-root thead th{ position:sticky; top:0; z-index:3; background:#0f1217; border-bottom:1px solid var(--line-strong); padding:0; white-space:nowrap; box-shadow:0 1px 0 rgba(217,183,90,.07); }
.tr-root .th-inner{ display:flex; align-items:center; gap:4px; padding:9px 11px; }
.tr-root .th-label{ color:var(--text-2); font-weight:700; letter-spacing:.4px; cursor:default; user-select:none; text-transform:uppercase; font-size:10.5px; }
.tr-root .th-label.sortable{ cursor:pointer; }
.tr-root .th-label.sortable:hover{ color:var(--gold-hi); }
.tr-root .th-label.active{ color:var(--gold); }
.tr-root .sort-arrow{ color:var(--gold); font-size:10px; margin-left:3px; display:inline-block; }
.tr-root .funnel{ margin-left:2px; width:18px; height:18px; border-radius:5px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); border:1px solid transparent; }
.tr-root .funnel:hover{ color:var(--text); background:var(--bg-3); }
.tr-root .funnel.active{ color:#2a2308; background:var(--gold); border-color:var(--gold-hi); }
.tr-root .funnel svg{ width:11px; height:11px; display:block; }
.tr-root tbody td{ padding:7px 11px; border-bottom:1px solid var(--line); white-space:nowrap; color:var(--text-2); }
.tr-root tbody tr:hover td{ background:rgba(217,183,90,.045); }
.tr-root tbody tr.selected td{ background:rgba(217,183,90,.12); }
.tr-root tbody tr.selected td:first-child{ box-shadow:inset 3px 0 0 var(--gold); }
.tr-root td.num{ text-align:right; font-variant-numeric:tabular-nums; }
.tr-root .mini{ font-size:11px; color:var(--muted); }
.tr-root .badge{ padding:3px 8px; border-radius:6px; font-size:10px; font-weight:800; letter-spacing:.4px; }
.tr-root .badge.FULL{ background:rgba(183,148,246,.16); color:var(--amethyst); border:1px solid rgba(183,148,246,.3); }
.tr-root .badge.NO_INCOMING{ background:rgba(70,211,154,.15); color:var(--emerald); border:1px solid rgba(70,211,154,.32); }
.tr-root .badge.WAITING{ background:rgba(245,185,66,.14); color:var(--amber); border:1px solid rgba(245,185,66,.3); }
.tr-root .pri{ font-weight:700; }
.tr-root .pri.P1{ color:var(--crimson-hi); } .tr-root .pri.P2{ color:var(--amber); } .tr-root .pri.dash{ color:var(--muted); }
.tr-root input[type=checkbox]{ accent-color:var(--gold); width:14px; height:14px; cursor:pointer; }
.tr-root .empty{ padding:44px; text-align:center; color:var(--muted); }
.tr-root .filter-popover{ position:fixed; z-index:50; min-width:210px; max-width:280px; background:var(--bg-2); border:1px solid var(--line-strong); border-radius:10px; box-shadow:var(--shadow); padding:10px; color:var(--text); }
.tr-root .filter-popover .fp-head{ display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.tr-root .filter-popover .fp-title{ font-size:10.5px; text-transform:uppercase; letter-spacing:1px; color:var(--gold); font-weight:800; }
.tr-root .filter-popover .fp-clear{ margin-left:auto; font-size:11px; color:var(--muted); cursor:pointer; }
.tr-root .filter-popover .fp-clear:hover{ color:var(--gold-hi); }
.tr-root .filter-popover .fp-list{ max-height:260px; overflow:auto; display:flex; flex-direction:column; gap:2px; }
.tr-root .filter-popover label.opt{ display:flex; align-items:center; gap:8px; padding:5px 6px; border-radius:6px; cursor:pointer; font-size:12px; }
.tr-root .filter-popover label.opt:hover{ background:var(--bg-3); }
.tr-root .filter-popover label.opt .cnt{ margin-left:auto; color:var(--muted); font-size:10.5px; }
.tr-root .filter-popover input[type=text]{ width:100%; }
.tr-root .kv{ display:flex; justify-content:space-between; gap:8px; padding:3px 0; font-size:12px; }
.tr-root .kv>span:first-child{ color:var(--muted); }
.tr-root .kv>span:last-child{ color:var(--text); font-variant-numeric:tabular-nums; }
.tr-root .hint{ font-size:11.5px; color:var(--muted); line-height:1.6; }
.tr-root .hint code{ color:var(--gold-hi); }
.tr-root .sub-h{ font-size:10.5px; text-transform:uppercase; letter-spacing:1px; color:var(--text-2); margin:10px 0 4px; }
.tr-root .mini-tbl{ width:100%; border-collapse:collapse; font-size:12px; margin-top:2px; }
.tr-root .mini-tbl th{ text-align:left; color:var(--muted); font-size:9.5px; text-transform:uppercase; letter-spacing:.8px; font-weight:700; padding:2px 6px 4px; border-bottom:1px solid var(--line); }
.tr-root .mini-tbl th.num,.tr-root .mini-tbl td.num{ text-align:right; font-variant-numeric:tabular-nums; }
.tr-root .mini-tbl td{ padding:4px 6px; border-bottom:1px solid var(--line); color:var(--text-2); }
.tr-root .mini-tbl tbody tr:hover td{ background:rgba(217,183,90,.05); }
.tr-root .log{ font-family:ui-monospace,Consolas,Menlo,monospace; font-size:11px; white-space:pre-wrap; color:var(--muted); max-height:170px; overflow:auto; background:#0a0c0f; border:1px solid var(--line); border-radius:8px; padding:8px; }
.tr-root .log .ok{ color:var(--emerald); } .tr-root .log .err{ color:var(--crimson-hi); } .tr-root .log .warn{ color:var(--amber); } .tr-root .log .hd{ color:var(--gold); }
.tr-root .file-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.tr-root input[type=file]{ font-size:12px; color:var(--muted); max-width:200px; }
.tr-root .auto-grid{ display:grid; grid-template-columns:1fr 1fr; gap:9px 12px; align-items:center; margin-bottom:10px; }
.tr-root .auto-grid label{ font-size:11.5px; color:var(--muted); }
.tr-root .auto-grid input[type=number]{ width:100%; }
.tr-root .auto-status{ display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:9px; border:1px solid var(--line-strong); background:var(--bg-2); margin-bottom:10px; }
.tr-root .dot{ width:9px; height:9px; border-radius:50%; background:var(--muted); flex-shrink:0; }
.tr-root .dot.live{ background:var(--emerald); animation:tr-pulse 1.6s infinite; }
@keyframes tr-pulse{ 0%{ box-shadow:0 0 0 0 rgba(70,211,154,.5);} 70%{ box-shadow:0 0 0 7px rgba(70,211,154,0);} 100%{ box-shadow:0 0 0 0 rgba(70,211,154,0);} }
.tr-root .countdown{ font-variant-numeric:tabular-nums; font-weight:800; color:var(--gold-hi); font-size:21px; letter-spacing:.5px; line-height:1; }
.tr-root .toggle-row{ display:flex; gap:8px; align-items:center; }
.tr-root .toggle-row button{ flex:1; }
.tr-statusbar{ padding:8px 22px; background:var(--bg-1); border-top:1px solid var(--line); display:flex; align-items:center; gap:14px; min-height:36px; font-size:12.5px; color:var(--text-2); }
.tr-statusbar .ok{ color:var(--emerald); } .tr-statusbar .err{ color:var(--crimson-hi); } .tr-statusbar .warn{ color:var(--amber); }
.tr-root .progress-wrap{ flex:1; max-width:300px; height:7px; background:#0a0c0f; border-radius:6px; overflow:hidden; display:none; border:1px solid var(--line); }
.tr-root .progress-wrap.active{ display:block; }
.tr-root .progress-bar{ height:100%; width:0; background:linear-gradient(90deg,var(--gold),var(--gold-hi)); transition:width .2s; }
.tr-root .progress-wrap.indeterminate .progress-bar{ width:38%; transition:none; animation:tr-indet 1.2s ease-in-out infinite; }
@keyframes tr-indet{ 0%{ margin-left:-38%; } 100%{ margin-left:100%; } }
`;