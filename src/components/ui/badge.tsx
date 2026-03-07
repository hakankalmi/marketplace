import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-surface text-brand-text-muted border border-brand-border',
  success: 'bg-brand-success/10 text-brand-success',
  warning: 'bg-brand-warning/10 text-brand-warning',
  error: 'bg-brand-error/10 text-brand-error',
  accent: 'bg-brand-primary/10 text-brand-primary',
};

export function Badge({
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
