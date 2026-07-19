import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'floating';

const CARD_VARIANTS: Record<CardVariant, string> = {
  // For normal pages on the neutral surface.
  default: 'border border-gray-200 shadow-sm',
  // For pages that keep a full-screen background photo behind the card.
  floating: 'border border-white/50 shadow-xl ring-1 ring-black/5 bg-white/95 backdrop-blur-sm',
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div className={cn('rounded-2xl bg-white', CARD_VARIANTS[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}
