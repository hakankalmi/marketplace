'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getCompanies } from '@/lib/api/companies';
import { getCategories, getCities } from '@/lib/api/customer';
import { CompanyCard } from '@/components/company/CompanyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListSkeleton } from '@/components/ui/skeleton';
import type { CompanySearchQuery } from '@/lib/api/types';

export function CompanyListView() {
  const [query, setQuery] = useState<CompanySearchQuery>({
    page: 1,
    pageSize: 12,
    sortBy: 'rating',
  });
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const handleCityChange = (city: string) => {
    setQuery((prev) => ({
      ...prev,
      city: city || undefined,
      page: 1,
    }));
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setQuery((prev) => ({
      ...prev,
      categoryId,
      page: 1,
    }));
  };

  const handleSortChange = (sortBy: CompanySearchQuery['sortBy']) => {
    setQuery((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchText('');
    setQuery({ page: 1, pageSize: 12, sortBy: 'rating' });
  };

  const hasActiveFilters = query.city || query.categoryId || query.q;
  const totalPages = companiesData
    ? Math.ceil(companiesData.totalCount / (query.pageSize || 12))
    : 0;

  return (
    <div>
      {/* Arama + Filtre Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            icon={<Search size={18} />}
            placeholder="Firma adı ile arayın..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="shrink-0">
          <Search size={16} />
          Ara
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <SlidersHorizontal size={16} />
          Filtrele
        </Button>
      </div>

      {/* Filtre Paneli */}
      {showFilters && (
        <div className="mb-6 p-4 bg-brand-surface rounded-brand border border-brand-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-brand-text">Filtreler</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-brand-primary hover:underline flex items-center gap-1"
              >
                <X size={14} />
                Temizle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Şehir */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                Şehir
              </label>
              <select
                value={query.city || ''}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="">Tüm Şehirler</option>
                {citiesData?.map((city) => (
                  <option key={city.city} value={city.city}>
                    {city.city} ({city.companyCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                Kategori
              </label>
              <select
                value={query.categoryId || ''}
                onChange={(e) =>
                  handleCategoryChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="">Tüm Kategoriler</option>
                {categoriesData?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.companyCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                Sıralama
              </label>
              <select
                value={query.sortBy || 'rating'}
                onChange={(e) =>
                  handleSortChange(e.target.value as CompanySearchQuery['sortBy'])
                }
                className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-brand text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="rating">En Yüksek Puan</option>
                <option value="completedOrders">En Çok Sipariş</option>
                <option value="responseTime">En Hızlı Yanıt</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sonuç Sayısı */}
      {companiesData && (
        <p className="text-sm text-brand-text-muted mb-4">
          {companiesData.totalCount} firma bulundu
          {isFetching && ' — yükleniyor...'}
        </p>
      )}

      {/* Firma Listesi */}
      {isLoading ? (
        <ListSkeleton count={9} />
      ) : companiesData && companiesData.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companiesData.items.map((company, i) => (
              <CompanyCard
                key={company.companyId}
                company={company}
                index={i}
              />
            ))}
          </div>

          {/* Sayfalama */}
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
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-brand-text">
            Firma bulunamadı
          </h3>
          <p className="text-brand-text-muted mt-1">
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
