'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brand-text mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-brand',
              'text-brand-text placeholder:text-brand-text-muted',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary',
              icon && 'pl-10',
              error && 'border-brand-error focus:ring-brand-error/30 focus:border-brand-error',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
