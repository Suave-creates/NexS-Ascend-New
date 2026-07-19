import { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('block text-sm font-medium text-gray-700', className)} {...props}>
      {children}
    </label>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label != null && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint != null && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
