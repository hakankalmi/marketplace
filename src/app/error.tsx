'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to external service in production (Sentry etc.)
    if (process.env.NODE_ENV === 'production') {
      // silent — avoid console in production
    } else {
      console.error('[App Error]', error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-heading font-bold text-brand-text mb-2">
          Bir sorun oluştu
        </h2>
        <p className="text-sm text-brand-text-muted mb-6 leading-relaxed">
          Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-brand font-medium text-sm hover:bg-brand-primary-dark transition-colors"
        >
          <RotateCcw size={16} />
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
