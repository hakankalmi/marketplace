'use client';

import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useBrand } from '@/lib/brand/context';
import { Button } from '@/components/ui/button';

export function HeroFullbleed() {
  const theme = useBrand();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}dd 0%, ${theme.colors.primaryDark}ee 100%)`,
        }}
      />

      {/* Dot Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {theme.seo.heroTitle}
        </motion.h1>

        <motion.p
          className="mt-5 text-lg sm:text-xl text-white/80 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {theme.seo.heroSubtitle}
        </motion.p>

        {/* Arama Kutusu */}
        <motion.div
          className="mt-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-brand-lg border border-white/20">
            <div className="relative flex-1">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
              />
              <input
                type="text"
                placeholder="Şehir seçin..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-brand text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-colors"
              />
            </div>
            <Link href="/firmalar">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-brand-primary hover:bg-white/90"
              >
                <Search size={18} />
                Firma Ara
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Güven Sayaçları */}
        <motion.div
          className="mt-12 flex justify-center gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[
            { value: '500+', label: 'Firma' },
            { value: '10,000+', label: 'Sipariş' },
            { value: '4.8', label: 'Ortalama Puan' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-heading font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
