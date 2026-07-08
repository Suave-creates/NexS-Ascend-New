import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone =
  | 'gray'
  | 'navy'
  | 'good'
  | 'danger'
  | 'notice'
  | 'gold'
  // legacy aliases kept for convenience
  | 'green'
  | 'red'
  | 'amber'
  | 'blue';

const TONES: Record<Tone, string> = {
  gray: 'bg-gray-100 text-gray-700',
  navy: 'bg-brand-50 text-brand-700',
  good: 'bg-good-50 text-good-600',
  danger: 'bg-danger-50 text-danger-600',
  notice: 'bg-notice-50 text-notice-600',
  gold: 'bg-gold-100 text-gold-700',
  green: 'bg-good-50 text-good-600',
  red: 'bg-danger-50 text-danger-600',
  amber: 'bg-gold-100 text-gold-700',
  blue: 'bg-blue-100 text-blue-700',
};

export function Badge({
  tone = 'gray',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
