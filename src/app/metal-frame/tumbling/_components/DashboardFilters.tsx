import { FiSearch } from 'react-icons/fi';
import { Input } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { StationOverallStatus } from '@/services/metal-frame/tumbling/types';

export type DashboardFilterValue = 'ALL' | StationOverallStatus;

const FILTERS: { value: DashboardFilterValue; label: string }[] = [
  { value: 'ALL', label: 'All Stations' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'COMPLETING_SOON', label: 'Completing Soon' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'STOPPED', label: 'Stopped' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export function DashboardFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filter: DashboardFilterValue;
  onFilterChange: (value: DashboardFilterValue) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search station, PID, sheet code, process..."
          className="pl-9"
          aria-label="Search stations and processes"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFilterChange(f.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition',
              filter === f.value
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-700',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
