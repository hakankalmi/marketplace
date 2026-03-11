'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToPush, isPushSupported, getPushPermission } from '@/lib/push-notifications';

/**
 * Persistent notification permission bar.
 * Visible until the user grants notification permission — cannot be dismissed.
 * Once granted, subscribes to push and saves token to backend.
 */
export function NotificationPermissionBar() {
  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    // Don't show if push not supported or already granted/denied by browser
    if (!isPushSupported()) return;

    const permission = getPushPermission();
    // 'default' = not yet asked, show the bar
    // 'denied' = user blocked in browser settings, can't ask again — show hint
    // 'granted' = already have permission, no need
    if (permission === 'granted') return;

    setVisible(true);
  }, []);

  const handleEnable = useCallback(async () => {
    if (requesting) return;
    setRequesting(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Subscribe and save token to backend
        await subscribeToPush();
        setVisible(false);
      }
      // If denied or dismissed, bar stays visible
    } catch {
      // Permission request failed — bar stays
    } finally {
      setRequesting(false);
    }
  }, [requesting]);

  const isDenied = typeof window !== 'undefined'
    && 'Notification' in window
    && Notification.permission === 'denied';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-r from-brand-primary/5 via-brand-primary/8 to-brand-primary/5 border-b border-brand-primary/10">
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <Bell size={16} className="text-brand-primary" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm text-brand-text/80 truncate">
                  {isDenied
                    ? 'Bildirimler engellendi — tarayıcı ayarlarından izin verin'
                    : 'Sipariş durumunuzdan anında haberdar olun'
                  }
                </p>
              </div>

              {!isDenied && (
                <button
                  onClick={handleEnable}
                  disabled={requesting}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary-dark transition-all active:scale-[0.97] disabled:opacity-60"
                >
                  {requesting ? 'İzin isteniyor...' : 'Bildirimleri Aç'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
