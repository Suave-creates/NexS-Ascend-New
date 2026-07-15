import { StatCard } from '@/components/ui';
import type { DashboardSummary } from '@/services/metal-frame/tumbling/types';

export function KpiRow({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Total Stations" value={summary.totalStations} tone="navy" />
      <StatCard label="Running" value={summary.runningContainers} sub="containers" tone="navy" />
      <StatCard label="Available" value={summary.availableContainers} sub="containers" tone="good" />
      <StatCard label="Completing Soon" value={summary.completingSoon} tone="notice" />
      <StatCard label="Completed Today" value={summary.completedToday} tone="good" />
      <StatCard label="Stopped Today" value={summary.stoppedOrInterruptedToday} sub="incl. interrupted" tone="danger" />
    </div>
  );
}

export function KpiRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[70px] animate-pulse rounded-xl border border-gray-200 bg-gray-100" />
      ))}
    </div>
  );
}
