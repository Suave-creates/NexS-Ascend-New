import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'navy' | 'good' | 'danger' | 'notice' | 'gold';

const VALUE_TONES: Record<Tone, string> = {
  navy: 'text-brand-700',
  good: 'text-good-600',
  danger: 'text-danger-600',
  notice: 'text-notice-600',
  gold: 'text-gold-700',
};

const BAR_TONES: Record<Tone, string> = {
  navy: 'border-l-brand-700',
  good: 'border-l-good-600',
  danger: 'border-l-danger-600',
  notice: 'border-l-notice-600',
  gold: 'border-l-gold-500',
};

export function StatCard({
  label,
  value,
  sub,
  tone = 'navy',
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-l-4 border-gray-200 bg-white px-4 py-3 text-center shadow-sm',
        BAR_TONES[tone],
        className,
      )}
    >
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className={cn('text-2xl font-bold leading-tight', VALUE_TONES[tone])}>{value}</div>
      {sub != null && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}
