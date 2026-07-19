import { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Scroll-safe wrapper + base table. */
export function Table({ className, children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className={cn('min-w-full divide-y divide-gray-200 text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-gray-100 bg-white', className)} {...props}>
      {children}
    </tbody>
  );
}

type RowTone = 'danger' | 'notice' | 'good' | 'gold';
const ROW_TONES: Record<RowTone, string> = {
  danger: 'bg-danger-50 text-danger-600 hover:bg-danger-50',
  notice: 'bg-notice-50 text-notice-600 hover:bg-notice-50',
  good: 'bg-good-50 text-good-600 hover:bg-good-50',
  gold: 'bg-gold-100 text-gold-700 hover:bg-gold-100',
};

export interface TRProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the whole row to flag status (red/orange/green/gold). */
  tone?: RowTone;
}

export function TR({ tone, className, children, ...props }: TRProps) {
  return (
    <tr
      className={cn('transition-colors', tone ? ROW_TONES[tone] : 'hover:bg-gray-50/70', className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TH({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TD({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-2.5 align-middle text-gray-700', className)} {...props}>
      {children}
    </td>
  );
}
