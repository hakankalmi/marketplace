'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useBrand } from '@/lib/brand/context';

const DISMISSED_KEY = 'pwa-install-dismissed';
const INSTALLED_KEY = 'pwa-installed';
// Show again after 24 hours if dismissed
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
  const brand = useBrand();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, 'true');
    }

    setDeferredPrompt(null);
    setShow(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem(INSTALLED_KEY) === 'true') return;

    // If dismissed, wait 24h before showing again
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < DISMISS_COOLDOWN_MS) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Brief delay so page settles first
      setTimeout(() => setShow(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/15 border border-slate-200/80">
            {/* Gradient accent bar */}
            <div
              className="h-1"
              style={{
                background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.secondary || brand.colors.primary}dd)`,
              }}
            />

            <div className="p-4">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Kapat"
              >
                <X size={16} className="text-slate-400" />
              </button>

              <div className="flex items-start gap-3.5">
                {/* App icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ background: `${brand.colors.primary}15`, border: `1px solid ${brand.colors.primary}20` }}
                >
                  <Download size={22} style={{ color: brand.colors.primary }} />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {brand.name} Uygulaması
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Anında sipariş takibi ve bildirimler için uygulamayı yükleyin
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={handleInstall}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:shadow-md active:scale-[0.97]"
                      style={{ background: brand.colors.primary }}
                    >
                      Yükle
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Şimdi Değil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
