'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { CategoryResponseDto } from '@/lib/api/types';

interface CategoryGridProps {
  categories: CategoryResponseDto[];
}

// Placeholder icons since actual category icons come from API
const categoryIcons = [
  '🧹', '🛋️', '🧼', '🏠', '🚿', '💨', '🧽', '✨',
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-heading font-bold text-brand-text">
            Hizmet Kategorileri
          </h2>
          <p className="mt-2 text-brand-text-muted">
            İhtiyacınıza uygun hizmeti seçin
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/kategoriler/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 bg-brand-bg rounded-brand border border-brand-border hover:border-brand-primary/30 hover:shadow-brand transition-all duration-300"
              >
                <div className="text-3xl">
                  {categoryIcons[i % categoryIcons.length]}
                </div>
                <span className="font-medium text-brand-text group-hover:text-brand-primary transition-colors text-center">
                  {cat.name}
                </span>
                <span className="text-xs text-brand-text-muted">
                  {cat.companyCount} firma
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Placeholder for when categories are loading or empty */
export function CategoryGridPlaceholder() {
  return (
    <section className="py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-brand-text">
            Hizmet Kategorileri
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-6 bg-brand-bg rounded-brand border border-brand-border"
            >
              <div className="w-12 h-12 rounded-brand bg-brand-border/50 animate-pulse" />
              <div className="h-4 w-24 bg-brand-border/50 rounded animate-pulse" />
              <div className="h-3 w-16 bg-brand-border/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
