'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';
const SIZES: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  size = 'md',
  className,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] animate-[fadeIn_.15s_ease]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-[modalIn_.18s_ease]',
          SIZES[size],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
