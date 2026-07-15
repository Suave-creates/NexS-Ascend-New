import { cn } from '@/lib/cn';

export function ProgressBar({
  percent,
  tone = 'navy',
  className,
}: {
  percent: number;
  tone?: 'navy' | 'notice' | 'danger' | 'good';
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const barColor = {
    navy: 'bg-brand-600',
    notice: 'bg-notice-600',
    danger: 'bg-danger-600',
    good: 'bg-good-600',
  }[tone];

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-100', className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-1000 ease-linear', barColor, tone === 'notice' && 'animate-pulse')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
