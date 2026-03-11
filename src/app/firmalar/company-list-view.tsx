'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Star, X, ShoppingCart, MapPin, Grid3X3, SlidersHorizontal } from 'lucide-react';
import { getCompanies } from '@/lib/api/companies';
import { getCategories, getCities } from '@/lib/api/customer';
import { CompanyCard } from '@/components/company/CompanyCard';
import { Button } from '@/components/ui/button';
import { ListSkeleton } from '@/components/ui/skeleton';
import type { CompanySearchQuery } from '@/lib/api/types';

export function CompanyListView() {
  const [query, setQuery] = useState<CompanySearchQuery>({
    page: 1,
    pageSize: 12,
    sortBy: 'rating',
  });
  const [searchText, setSearchText] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const {
    data: companiesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['companies', query],
    queryFn: () => getCompanies(query),
  });

  const handleSearch = useCallback(() => {
    setQuery((prev) => ({ ...prev, q: searchText || undefined, page: 1 }));
  }, [searchText]);

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchText('');
    setQuery({ page: 1, pageSize: 12, sortBy: 'rating' });
  };

  const hasActiveFilters = query.city || query.categoryId || query.q || query.onlineOnly || query.sortBy !== 'rating';
  const totalPages = companiesData
    ? Math.ceil(companiesData.totalCount / (query.pageSize || 12))
    : 0;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Firma ara..."
            className="w-full pl-9 pr-9 py-2 bg-brand-surface border border-brand-border rounded-xl text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
          />
          {searchText && (
            <button
              onClick={() => { setSearchText(''); setQuery(prev => ({ ...prev, q: undefined, page: 1 })); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition shrink-0"
        >
          <Search size={16} />
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-xs font-medium hover:bg-brand-primary/15 transition-all shrink-0"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filter Chips — single row, horizontal scroll */}
      <div className="flex gap-1.5 items-center overflow-x-auto pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible scrollbar-hide">
        {/* Sort chips */}
        {([
          { key: 'rating', label: 'Puan', icon: '⭐' },
          { key: 'completedOrders', label: 'Sipariş Sayısı', icon: '📦' },
          { key: 'responseTime', label: 'Hız', icon: '⚡' },
        ] as const).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setQuery(prev => ({ ...prev, sortBy: opt.key, page: 1 }))}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
              query.sortBy === opt.key
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20'
                : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-text'
            }`}
          >
            <span className="text-[10px]">{opt.icon}</span>
            {opt.label}
          </button>
        ))}

        <div className="w-px h-4 bg-brand-border/50 shrink-0 mx-0.5" />

        {/* City dropdown chip */}
        <div className="relative shrink-0">
          <select
            value={query.city || ''}
            onChange={(e) => setQuery(prev => ({ ...prev, city: e.target.value || undefined, page: 1 }))}
            className={`appearance-none pl-6 pr-6 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              query.city
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-brand-primary/40'
            }`}
          >
            <option value="">Şehir</option>
            {citiesData?.map((city) => (
              <option key={city.city} value={city.city}>
                {city.city}
              </option>
            ))}
          </select>
          <MapPin size={10} className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${query.city ? 'text-white' : 'text-brand-text-muted'}`} />
        </div>

        {/* Category dropdown chip */}
        <div className="relative shrink-0">
          <select
            value={query.categoryId || ''}
            onChange={(e) => setQuery(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
            className={`appearance-none pl-6 pr-6 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              query.categoryId
                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-brand-primary/40'
            }`}
          >
            <option value="">Kategori</option>
            {categoriesData?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Grid3X3 size={10} className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${query.categoryId ? 'text-white' : 'text-brand-text-muted'}`} />
        </div>

        <div className="w-px h-4 bg-brand-border/50 shrink-0 mx-0.5" />

        {/* Online chip */}
        <button
          onClick={() => setQuery(prev => ({ ...prev, onlineOnly: prev.onlineOnly ? undefined : true, page: 1 }))}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
            query.onlineOnly
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'
              : 'bg-brand-surface border-brand-border/60 text-brand-text-muted hover:border-emerald-400 hover:text-brand-text'
          }`}
        >
          <ShoppingCart size={9} />
          Online Sipariş
        </button>
      </div>

      {/* Results count */}
      {companiesData && (
        <div className="flex items-center gap-2 text-xs text-brand-text-muted">
          <SlidersHorizontal size={12} />
          <span>
            <strong className="text-brand-text">{companiesData.totalCount}</strong> firma
            {isFetching && <span className="animate-pulse"> — yükleniyor...</span>}
          </span>
        </div>
      )}

      {/* Company List */}
      {isLoading ? (
        <ListSkeleton count={9} />
      ) : companiesData && companiesData.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {companiesData.items.map((company, i) => (
              <CompanyCard
                key={company.companyId}
                company={company}
                index={i}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <Button
                variant="secondary"
                size="sm"
                disabled={query.page === 1}
                onClick={() => handlePageChange((query.page || 1) - 1)}
              >
                Önceki
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={page === query.page ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="secondary"
                size="sm"
                disabled={query.page === totalPages}
                onClick={() => handlePageChange((query.page || 1) + 1)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-brand-text-muted/30 mb-3" />
          <p className="text-brand-text font-medium">Firma bulunamadı</p>
          <p className="text-sm text-brand-text-muted mt-1">
            Farklı filtreler deneyebilir veya arama terimini değiştirebilirsiniz.
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={clearFilters}
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
