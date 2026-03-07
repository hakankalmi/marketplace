'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        'bg-brand-surface rounded-brand-lg border border-brand-border',
        'p-0 w-full max-w-lg shadow-xl',
        'open:animate-in open:fade-in open:zoom-in-95',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <h2 className="text-lg font-heading font-semibold text-brand-text">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text transition-colors p-1 rounded-brand hover:bg-brand-surface-hover"
          >
            <X size={20} />
          </button>
        </div>
      )}
      <div className="p-6">{children}</div>
    </dialog>
  );
}
