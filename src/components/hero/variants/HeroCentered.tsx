'use client';

import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useBrand } from '@/lib/brand/context';
import { Button } from '@/components/ui/button';

export function HeroCentered() {
  const theme = useBrand();

  return (
    <section className="relative bg-brand-surface py-20 lg:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${theme.colors.primary} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          ✨ Güvenilir firmalar, tek tıkla sipariş
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl font-heading font-bold text-brand-text leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {theme.seo.heroTitle}
        </motion.h1>

        <motion.p
          className="mt-5 text-lg text-brand-text-muted max-w-xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {theme.seo.heroSubtitle}
        </motion.p>

        {/* Arama Kutusu */}
        <motion.div
          className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="relative flex-1">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
            />
            <input
              type="text"
              placeholder="Şehir seçin..."
              className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>
          <Link href="/firmalar">
            <Button size="lg" className="w-full sm:w-auto">
              <Search size={18} />
              Firma Ara
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
