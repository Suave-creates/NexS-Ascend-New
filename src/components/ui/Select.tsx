import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { FIELD_BASE } from './Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(FIELD_BASE, 'cursor-pointer pr-9', className)} {...props}>
        {children}
      </select>
    );
  },
);
