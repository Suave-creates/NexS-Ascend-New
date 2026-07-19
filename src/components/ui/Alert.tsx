import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'success' | 'error' | 'warning' | 'notice' | 'info';

const TONES: Record<Tone, string> = {
  success: 'border-good-600/30 border-l-good-600 bg-good-50 text-good-600',
  error: 'border-danger-600/30 border-l-danger-600 bg-danger-50 text-danger-600',
  warning: 'border-gold-500/40 border-l-gold-500 bg-gold-100 text-gold-700',
  notice: 'border-notice-600/30 border-l-notice-600 bg-notice-50 text-notice-600',
  info: 'border-blue-300 border-l-blue-500 bg-blue-50 text-blue-800',
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function Alert({ tone = 'info', className, children, role = 'status', ...props }: AlertProps) {
  return (
    <div
      role={role}
      className={cn('rounded-lg border border-l-4 px-4 py-3 text-sm font-medium', TONES[tone], className)}
      {...props}
    >
      {children}
    </div>
  );
}
