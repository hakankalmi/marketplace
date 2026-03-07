import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyCard } from '@/components/company/CompanyCard';
import { MapPin, Building2 } from 'lucide-react';
import { slugify, getCategoryDisplayName } from '@/lib/utils';
import type { CompanyListDto, PaginatedResponse, CityDto } from '@/lib/api/types';

const brand = getBrandConfig();

async function getCities(): Promise<CityDto[]> {
  try {
    const res = await fetch(`${API_URL}/api/mp/cities`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function findCityBySlug(cities: CityDto[], slug: string): CityDto | undefined {
  return cities.find((c) => slugify(c.city) === slug);
}

const IS_ALL_TURKEY = 'turkiye';

async function getCompaniesByCity(city: string | null): Promise<PaginatedResponse<CompanyListDto>> {
  try {
    const cityParam = city ? `&city=${encodeURIComponent(city)}` : '';
    const res = await fetch(
      `${API_URL}/api/mp/companies?sortBy=rating&pageSize=50${cityParam}`,
      {
        headers: { 'X-Marketplace-Brand': BRAND_CODE },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return { items: [], totalCount: 0, page: 1, pageSize: 50 };
    return res.json();
  } catch {
    return { items: [], totalCount: 0, page: 1, pageSize: 50 };
  }
}

// getCategoryDisplayName imported from utils

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}): Promise<Metadata> {
  const { city: citySlug, category } = await params;
  const isAllTurkey = citySlug === IS_ALL_TURKEY;
  const categoryDisplay = getCategoryDisplayName(category);

  if (isAllTurkey) {
    const title = `${categoryDisplay} Firmaları | ${brand.name}`;
    const description = `Türkiye genelinde en iyi ${categoryDisplay.toLowerCase()} firmaları. Fiyat karşılaştırma, gerçek müşteri yorumları. Hemen sipariş verin.`;
    return {
      title,
      description,
      alternates: { canonical: `/${citySlug}/${category}` },
      openGraph: { title, description, url: `https://${brand.domain}/${citySlug}/${category}` },
    };
  }

  const cities = await getCities();
  const cityData = findCityBySlug(cities, citySlug);
  if (!cityData) return { title: 'Sayfa Bulunamadı' };

  const title = `${cityData.city} ${categoryDisplay} Firmaları | ${brand.name}`;
  const description = `${cityData.city} şehrinde en iyi ${categoryDisplay.toLowerCase()} firmaları. ${cityData.companyCount} firma, fiyat karşılaştırma, gerçek müşteri yorumları. Hemen sipariş verin.`;

  return {
    title,
    description,
    alternates: { canonical: `/${citySlug}/${category}` },
    openGraph: { title, description, url: `https://${brand.domain}/${citySlug}/${category}` },
  };
}

export default async function CityCategoryPage({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}) {
  const { city: citySlug, category } = await params;
  const isAllTurkey = citySlug === IS_ALL_TURKEY;
  const categoryDisplay = getCategoryDisplayName(category);

  let cityName: string;
  let data: PaginatedResponse<CompanyListDto>;

  if (isAllTurkey) {
    cityName = 'Türkiye';
    data = await getCompaniesByCity(null);
  } else {
    const cities = await getCities();
    const cityData = findCityBySlug(cities, citySlug);
    if (!cityData) notFound();
    cityName = cityData.city;
    data = await getCompaniesByCity(cityName);
  }

  const heading = isAllTurkey
    ? categoryDisplay
    : `${cityName} ${categoryDisplay}`;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        {/* Hero */}
        <section
          className="relative py-14 lg:py-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-brand-text-muted mb-6">
              <a href="/" className="hover:text-brand-primary transition-colors">
                Anasayfa
              </a>
              <span>/</span>
              {!isAllTurkey && (
                <>
                  <a
                    href={`/${citySlug}`}
                    className="hover:text-brand-primary transition-colors"
                  >
                    {cityName}
                  </a>
                  <span>/</span>
                </>
              )}
              <span className="text-brand-text font-medium">{categoryDisplay}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <MapPin size={24} className="text-brand-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-brand-text">
                    {heading}
                  </h1>
                  <p className="text-brand-text-muted mt-1">
                    {data.totalCount} firma bulundu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Firma Listesi */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((company, i) => (
                  <CompanyCard
                    key={company.companyId}
                    company={company}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Building2 size={48} className="mx-auto text-brand-text-muted/30 mb-4" />
                <h3 className="text-lg font-medium text-brand-text">
                  {isAllTurkey
                    ? `Henüz ${categoryDisplay.toLowerCase()} firması yok`
                    : `${cityName} şehrinde henüz ${categoryDisplay.toLowerCase()} firması yok`}
                </h3>
                <p className="text-brand-text-muted mt-2 max-w-md mx-auto">
                  Yakında firmalar eklenecek. Diğer kategorilerdeki firmalarımızı inceleyebilirsiniz.
                </p>
                <a
                  href="/firmalar"
                  className="inline-block mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-brand font-medium hover:opacity-90 transition"
                >
                  Tüm Firmaları Gör
                </a>
              </div>
            )}
          </div>
        </section>

        {/* SEO JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${heading} Firmaları`,
              numberOfItems: data.items.length,
              itemListElement: data.items.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'LocalBusiness',
                  name: c.companyName,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: c.city || cityName,
                    addressCountry: 'TR',
                  },
                  ...(c.averageRating > 0 && {
                    aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: c.averageRating.toFixed(1),
                      reviewCount: c.totalReviewCount,
                    },
                  }),
                },
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
