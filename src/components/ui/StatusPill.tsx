import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'gold' | 'danger' | 'good' | 'notice';

// Solid, high-contrast pill for at-a-glance status (e.g. "NEEDS ATTENTION").
const TONES: Record<Tone, string> = {
  gold: 'bg-gold-500 text-[#3a2800]',
  danger: 'bg-danger-600 text-white',
  good: 'bg-good-600 text-white',
  notice: 'bg-notice-600 text-white',
};

export function StatusPill({
  tone = 'gold',
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
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
