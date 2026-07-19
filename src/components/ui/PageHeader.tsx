import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-brand-700">{title}</h1>
        {subtitle != null && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions != null && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
