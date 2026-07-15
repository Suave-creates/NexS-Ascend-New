'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { FiRefreshCw, FiClock, FiGrid, FiSettings } from 'react-icons/fi';
import { PageHeader, Alert, Card, CardBody, Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { DashboardResponse } from '@/services/metal-frame/tumbling/types';
import { KpiRow, KpiRowSkeleton } from './_components/KpiRow';
import { DashboardFilters, DashboardFilterValue } from './_components/DashboardFilters';
import { StationCard } from './_components/StationCard';
import { StationGridSkeleton } from './_components/Skeletons';
import { StationModal } from './_components/StationModal';
import { formatClockTime } from './_components/format';

const POLL_INTERVAL_MS = 20_000;

export default function TumblingDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DashboardFilterValue>('ALL');
  const [now, setNow] = useState(() => new Date());
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [openStationNumber, setOpenStationNumber] = useState<number | null>(null);

  const busyRef = useRef(false);
  // serverTime - Date.now() at the moment of the last successful poll, so the
  // 1s local ticker tracks the backend clock instead of drifting with the
  // browser's — completion always lands on the server's schedule, not ours.
  const clockOffsetRef = useRef(0);

  // A QR code / shared link can deep-link straight to a station via ?station=N.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get('station'));
    if (Number.isInteger(n) && n >= 1 && n <= 22) setOpenStationNumber(n);
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await fetch('/api/metal-frame/tumbling/dashboard');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load the dashboard.');
      clockOffsetRef.current = new Date(json.serverTime).getTime() - Date.now();
      setDashboard(json);
      setError(null);
      setLastRefreshedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load the dashboard.');
    } finally {
      setLoading(false);
      busyRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const iv = setInterval(fetchDashboard, POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [fetchDashboard]);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date(Date.now() + clockOffsetRef.current)), 1000);
    return () => clearInterval(iv);
  }, []);

  const filteredStations = useMemo(() => {
    if (!dashboard) return [];
    const q = search.trim().toLowerCase();

    return dashboard.stations.filter((station) => {
      if (filter !== 'ALL' && station.overallStatus !== filter) return false;
      if (!q) return true;
      const haystacks = [
        `station ${station.stationNumber}`,
        String(station.stationNumber),
        station.left.activeProcess?.processCode,
        station.right.activeProcess?.processCode,
      ];
      return haystacks.some((h) => h?.toLowerCase().includes(q));
    });
  }, [dashboard, search, filter]);

  function closeStationModal() {
    setOpenStationNumber(null);
    if (window.location.search.includes('station=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  return (
    <div>
      <PageHeader
        title="Tumbling"
        subtitle={`Metal Frame tumbling — 22 stations · 44 containers · ${now.toLocaleDateString(undefined, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <FiRefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
              {lastRefreshedAt ? `Refreshed ${formatClockTime(lastRefreshedAt.toISOString())}` : 'Loading…'}
            </div>
            <div className="flex items-center gap-2">
              <Link href="/metal-frame/tumbling/processes">
                <Button variant="outline" size="sm">
                  <FiClock className="h-3.5 w-3.5" /> History
                </Button>
              </Link>
              <Link href="/metal-frame/tumbling/qr-codes">
                <Button variant="outline" size="sm">
                  <FiGrid className="h-3.5 w-3.5" /> QR Codes
                </Button>
              </Link>
              <Link href="/metal-frame/tumbling/settings">
                <Button variant="outline" size="sm">
                  <FiSettings className="h-3.5 w-3.5" /> Settings
                </Button>
              </Link>
            </div>
          </div>
        }
      />

      {error && (
        <Alert tone="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-6">{dashboard ? <KpiRow summary={dashboard.summary} /> : <KpiRowSkeleton />}</div>

      <div className="mb-4">
        <DashboardFilters search={search} onSearchChange={setSearch} filter={filter} onFilterChange={setFilter} />
      </div>

      {!dashboard && loading ? (
        <StationGridSkeleton />
      ) : filteredStations.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-sm text-gray-500">
            {dashboard && dashboard.stations.length === 0
              ? 'No stations found.'
              : 'No stations match your search or filter.'}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStations.map((station) => (
            <StationCard
              key={station.stationNumber}
              station={station}
              now={now}
              nearCompletionThresholdMinutes={dashboard!.nearCompletionThresholdMinutes}
              onOpen={setOpenStationNumber}
            />
          ))}
        </div>
      )}

      <StationModal stationNumber={openStationNumber} onClose={closeStationModal} />
    </div>
  );
}
