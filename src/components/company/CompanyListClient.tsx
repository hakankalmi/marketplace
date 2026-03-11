'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, X, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { CompanyCard } from './CompanyCard';
import type { CompanyListDto } from '@/lib/api/types';

type SortKey = 'rating' | 'responseTime' | 'completedOrders';

const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'rating', label: 'Puan', icon: '⭐' },
  { key: 'completedOrders', label: 'Sipariş Sayısı', icon: '📦' },
  { key: 'responseTime', label: 'Hız', icon: '⚡' },
];

interface CompanyListClientProps {
  companies: CompanyListDto[];
}

export function CompanyListClient({ companies }: CompanyListClientProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [minRating, setMinRating] = useState(0);
  const [onlineOnly, setOnlineOnly] = useState(false);

  const hasActiveFilters = search.length > 0 || minRating > 0 || sortBy !== 'rating' || onlineOnly;

  const filtered = useMemo(() => {
    let result = [...companies];

    if (search.length > 0) {
      const q = search.toLocaleLowerCase('tr-TR');
      result = result.filter(
        (c) =>
          c.companyName.toLocaleLowerCase('tr-TR').includes(q) ||
          c.description?.toLocaleLowerCase('tr-TR').includes(q)
      );
    }

    if (minRating > 0) {
      result = result.filter((c) => c.averageRating >= minRating);
    }

    if (onlineOnly) {
      result = result.filter((c) => c.canAcceptOnlineOrders);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'completedOrders':
          return b.completedOrderCount - a.completedOrderCount;
        case 'responseTime': {
          const aTime = a.responseTimeMinutes || 9999;
          const bTime = b.responseTimeMinutes || 9999;
          return aTime - bTime;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [companies, search, sortBy, minRating, onlineOnly]);

  const clearFilters = () => {
    setSearch('');
    setSortBy('rating');
    setMinRating(0);
    setOnlineOnly(false);
  };

  const activeFilterCount = [minRating > 0, onlineOnly, sortBy !== 'rating'].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Search + Filter Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma ara..."
            className="w-full pl-9 pr-9 py-2 bg-brand-surface border border-brand-border rounded-xl text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {/* Active filter count badge */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-xs font-medium hover:bg-brand-primary/15 transition-all shrink-0"
          >
            <X size={12} />
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
        )}
      </div>

      {/* Chip Filter Bar — single row, horizontal scroll on mobile */}
      <div className="flex gap-1.5 items-center overflow-x-auto pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible scrollbar-hide">
        {/* Sort chips */}
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
              sortBy === opt.key
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20'
                : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-text'
            }`}
          >
            <span className="text-[10px]">{opt.icon}</span>
            {opt.label}
          </button>
        ))}

        {/* Thin separator */}
        <div className="w-px h-4 bg-brand-border/50 shrink-0 mx-0.5" />

        {/* Rating chips */}
        {[4, 4.5].map((value) => (
          <button
            key={value}
            onClick={() => setMinRating(minRating === value ? 0 : value)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
              minRating === value
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
                : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-amber-400 hover:text-brand-text'
            }`}
          >
            <Star size={9} className="fill-current" />
            {value}+
          </button>
        ))}

        {/* Thin separator */}
        <div className="w-px h-4 bg-brand-border/50 shrink-0 mx-0.5" />

        {/* Online sipariş chip */}
        <button
          onClick={() => setOnlineOnly(!onlineOnly)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
            onlineOnly
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'
              : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-emerald-400 hover:text-brand-text'
          }`}
        >
          <ShoppingCart size={9} />
          Online Sipariş
        </button>
      </div>

      {/* Results count — compact */}
      <div className="flex items-center gap-2 text-xs text-brand-text-muted">
        <SlidersHorizontal size={12} />
        <span>
          <strong className="text-brand-text">{filtered.length}</strong> firma
          {search && <span> &middot; &ldquo;{search}&rdquo;</span>}
          {minRating > 0 && <span> &middot; {minRating}+</span>}
          {onlineOnly && <span> &middot; Online</span>}
        </span>
      </div>

      {/* Company Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((company, i) => (
            <CompanyCard key={company.companyId} company={company} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
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
        </motion.div>
      )}
    </div>
  );
}
