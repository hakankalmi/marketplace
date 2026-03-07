'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useBrand } from '@/lib/brand/context';
import { Button } from '@/components/ui/button';

export function HeroSplit() {
  const theme = useBrand();

  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sol: İçerik */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-brand-text leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {theme.seo.heroTitle}
            </motion.h1>

            <motion.p
              className="mt-5 text-lg sm:text-xl text-brand-text-muted max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {theme.seo.heroSubtitle}
            </motion.p>

            {/* Arama Kutusu */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
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
                  className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-brand-border rounded-brand text-brand-text placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
              </div>
              <Link href="/firmalar">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search size={18} />
                  Firma Ara
                </Button>
              </Link>
            </motion.div>

            {/* Güven Sayaçları */}
            <motion.div
              className="mt-10 flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[
                { value: '500+', label: 'Firma' },
                { value: '10,000+', label: 'Sipariş' },
                { value: '4.8', label: 'Ortalama Puan' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-heading font-bold text-brand-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-brand-text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Sağ: Dekoratif Kartlar */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative w-full h-[420px]">
              {/* Arka plan dekorasyon */}
              <div
                className="absolute inset-0 rounded-brand-lg opacity-10"
                style={{ background: theme.colors.gradient || theme.colors.primary }}
              />

              {/* Örnek Firma Kartları */}
              {[
                { name: 'Temiz Halı', rating: 4.9, city: 'İstanbul', top: '10%', left: '5%', rotate: -3 },
                { name: 'Yıldız Yıkama', rating: 4.7, city: 'Ankara', top: '35%', left: '25%', rotate: 2 },
                { name: 'Leke Yok', rating: 4.8, city: 'İzmir', top: '60%', left: '10%', rotate: -1 },
              ].map((card, i) => (
                <motion.div
                  key={card.name}
                  className="absolute bg-brand-surface border border-brand-border rounded-brand p-4 shadow-brand w-64"
                  style={{ top: card.top, left: card.left }}
                  initial={{ opacity: 0, y: 20, rotate: card.rotate }}
                  animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                  transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <span className="text-brand-primary font-bold text-sm">
                        {card.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-brand-text text-sm">
                        {card.name}
                      </p>
                      <p className="text-xs text-brand-text-muted">{card.city}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-brand-rating text-sm">★</span>
                    <span className="text-sm font-medium text-brand-text">
                      {card.rating}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* CTA Arrow */}
              <motion.div
                className="absolute bottom-4 right-4"
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <ArrowRight size={24} className="text-brand-primary" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
