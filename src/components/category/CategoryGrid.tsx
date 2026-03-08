'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { CategoryResponseDto } from '@/lib/api/types';

interface CategoryGridProps {
  categories: CategoryResponseDto[];
}

// Map category keys to emoji icons + gradient colors
const categoryMeta: Record<string, { icon: string; gradient: string }> = {
  hali_yikama: { icon: '🧹', gradient: 'from-red-500/10 to-orange-500/10' },
  koltuk_yikama: { icon: '🛋️', gradient: 'from-blue-500/10 to-indigo-500/10' },
  yorgan_yikama: { icon: '🛏️', gradient: 'from-purple-500/10 to-pink-500/10' },
  perde_yikama: { icon: '🪟', gradient: 'from-teal-500/10 to-emerald-500/10' },
  ev_temizligi: { icon: '🏠', gradient: 'from-amber-500/10 to-yellow-500/10' },
  ofis_temizligi: { icon: '🏢', gradient: 'from-slate-500/10 to-gray-500/10' },
};

const defaultMeta = { icon: '✨', gradient: 'from-brand-primary/10 to-brand-primary/5' };

function keyToSlug(key: string): string {
  return key.replace(/_/g, '-');
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-10 lg:py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
            Hizmet Kategorileri
          </h2>
          <p className="mt-2 text-brand-text-muted">
            İhtiyacınıza uygun hizmeti seçin
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const meta = categoryMeta[cat.key] || defaultMeta;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={`/turkiye/${keyToSlug(cat.key)}`}
                  className={`group flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${meta.gradient} rounded-2xl border border-brand-border/50 hover:border-brand-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {meta.icon}
                  </div>
                  <span className="font-semibold text-brand-text group-hover:text-brand-primary transition-colors text-center text-sm leading-tight">
                    {cat.name}
                  </span>
                  {cat.companyCount != null && cat.companyCount > 0 && (
                    <span className="text-xs text-brand-text-muted bg-white/60 px-2 py-0.5 rounded-full">
                      {cat.companyCount} firma
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Placeholder skeleton */
export function CategoryGridPlaceholder() {
  return (
    <section className="py-10 lg:py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
            Hizmet Kategorileri
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-6 bg-brand-bg rounded-2xl border border-brand-border/50"
            >
              <div className="w-12 h-12 rounded-full bg-brand-border/30 animate-pulse" />
              <div className="h-4 w-20 bg-brand-border/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
