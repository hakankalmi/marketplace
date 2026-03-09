'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ArrowUpDown, X } from 'lucide-react';
import { CompanyCard } from './CompanyCard';
import type { CompanyListDto } from '@/lib/api/types';

type SortKey = 'rating' | 'responseTime' | 'completedOrders';

const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'rating', label: 'En Yüksek Puan', icon: '⭐' },
  { key: 'completedOrders', label: 'En Çok Sipariş', icon: '📦' },
  { key: 'responseTime', label: 'En Hızlı Yanıt', icon: '⚡' },
];

const RATING_FILTERS = [
  { value: 0, label: 'Tümü' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

interface CompanyListClientProps {
  companies: CompanyListDto[];
}

export function CompanyListClient({ companies }: CompanyListClientProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = search.length > 0 || minRating > 0 || sortBy !== 'rating';

  const filtered = useMemo(() => {
    let result = [...companies];

    // Search filter
    if (search.length > 0) {
      const q = search.toLocaleLowerCase('tr-TR');
      result = result.filter(
        (c) =>
          c.companyName.toLocaleLowerCase('tr-TR').includes(q) ||
          c.description?.toLocaleLowerCase('tr-TR').includes(q)
      );
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((c) => c.averageRating >= minRating);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'completedOrders':
          return b.completedOrderCount - a.completedOrderCount;
        case 'responseTime':
          // Lower response time = better, 0 means no data → push to end
          const aTime = a.responseTimeMinutes || 9999;
          const bTime = b.responseTimeMinutes || 9999;
          return aTime - bTime;
        default:
          return 0;
      }
    });

    return result;
  }, [companies, search, sortBy, minRating]);

  const clearFilters = () => {
    setSearch('');
    setSortBy('rating');
    setMinRating(0);
  };

  return (
    <div className="space-y-6">
      {/* Search + Filter Toggle */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-brand-border rounded-brand text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-brand text-sm font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
              : 'bg-brand-surface border-brand-border text-brand-text-muted hover:border-brand-primary/40'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filtrele</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
          )}
        </button>
      </div>

      {/* Expandable Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-brand-surface rounded-brand border border-brand-border space-y-4">
              {/* Sort */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-brand-text-muted mb-2">
                  <ArrowUpDown size={12} />
                  Sıralama
                </label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        sortBy === opt.key
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-text'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-brand-text-muted mb-2">
                  <Star size={12} />
                  Minimum Puan
                </label>
                <div className="flex flex-wrap gap-2">
                  {RATING_FILTERS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMinRating(opt.value)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        minRating === opt.value
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-text'
                      }`}
                    >
                      {opt.value > 0 && <Star size={10} className="fill-current" />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand-primary hover:underline"
                >
                  Filtreleri temizle
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {(search || minRating > 0) && (
        <p className="text-sm text-brand-text-muted">
          {filtered.length} firma bulundu
          {search && <span> &middot; &ldquo;{search}&rdquo;</span>}
          {minRating > 0 && <span> &middot; {minRating}+ puan</span>}
        </p>
      )}

      {/* Company Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((company, i) => (
            <CompanyCard key={company.companyId} company={company} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-brand-text-muted/30 mb-3" />
          <p className="text-brand-text font-medium">Sonuç bulunamadı</p>
          <p className="text-sm text-brand-text-muted mt-1">
            Farklı arama kriterleri deneyin
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-brand-primary hover:underline"
            >
              Filtreleri temizle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
