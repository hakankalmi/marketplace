'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, X, ShoppingCart } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
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

      {/* Quick Filters — always visible, horizontal scroll on mobile */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Sort chips */}
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
              sortBy === opt.key
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                : 'bg-brand-surface border-brand-border text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-text'
            }`}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        ))}

        {/* Separator */}
        <div className="w-px h-5 bg-brand-border hidden sm:block" />

        {/* Rating chips */}
        {RATING_FILTERS.filter(opt => opt.value > 0).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setMinRating(minRating === opt.value ? 0 : opt.value)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
              minRating === opt.value
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                : 'bg-brand-surface border-brand-border text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-text'
            }`}
          >
            <Star size={10} className="fill-current" />
            {opt.label}
          </button>
        ))}

        {/* Online sipariş chip */}
        <button
          onClick={() => setOnlineOnly(!onlineOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
            onlineOnly
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : 'bg-brand-surface border-brand-border text-brand-text-muted hover:border-emerald-400 hover:text-brand-text'
          }`}
        >
          <ShoppingCart size={10} />
          Online Sipariş
        </button>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-brand-primary hover:bg-brand-primary/5 transition-colors"
          >
            <X size={12} />
            Temizle
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-brand-text-muted">
        {filtered.length} firma bulundu
        {search && <span> &middot; &ldquo;{search}&rdquo;</span>}
        {minRating > 0 && <span> &middot; {minRating}+ puan</span>}
        {onlineOnly && <span> &middot; Online sipariş</span>}
      </p>

      {/* Company Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
