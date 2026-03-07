import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyCard } from '@/components/company/CompanyCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { slugify, getCategoryDisplayName } from '@/lib/utils';
import type { CompanyListDto, PaginatedResponse, CityDto } from '@/lib/api/types';

const brand = getBrandConfig();

// Bilinen kategori slug'ları — slug parse etmek için
const KNOWN_CATEGORIES = [
  'hali-yikama',
  'koltuk-yikama',
  'yorgan-yikama',
  'perde-yikama',
  'ev-temizligi',
  'ofis-temizligi',
];

/**
 * "izmir-hali-yikama-firmalari" → { citySlug: "izmir", categorySlug: "hali-yikama" }
 * "istanbul-koltuk-yikama-firmalari" → { citySlug: "istanbul", categorySlug: "koltuk-yikama" }
 */
function parseFirmalariSlug(slug: string): { citySlug: string; categorySlug: string } | null {
  if (!slug.endsWith('-firmalari')) return null;
  const base = slug.replace(/-firmalari$/, '');
  for (const cat of KNOWN_CATEGORIES) {
    if (base.endsWith(`-${cat}`)) {
      const citySlug = base.slice(0, -(cat.length + 1));
      if (citySlug.length > 0) return { citySlug, categorySlug: cat };
    }
  }
  return null;
}

async function getCities(): Promise<CityDto[]> {
  try {
    const res = await fetch(`${API_URL}/api/mp/cities`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // API string[] veya CityDto[] dönebilir — normalize et
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
      return (data as string[]).map((city) => ({ city, companyCount: 0 }));
    }
    return data;
  } catch {
    return [];
  }
}

function findCityBySlug(cities: CityDto[], slug: string): CityDto | undefined {
  return cities.find((c) => slugify(c.city) === slug);
}

async function getCompaniesByCity(
  city: string,
): Promise<CompanyListDto[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/mp/companies?city=${encodeURIComponent(city)}&sortBy=rating&pageSize=50`,
      {
        headers: { 'X-Marketplace-Brand': BRAND_CODE },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const data: PaginatedResponse<CompanyListDto> = await res.json();
    return data.items;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;

  // "izmir-hali-yikama-firmalari" formatını kontrol et
  const firmalari = parseFirmalariSlug(slug);
  if (firmalari) {
    const cities = await getCities();
    const cityData = findCityBySlug(cities, firmalari.citySlug);
    if (!cityData) return { title: 'Sayfa Bulunamadı' };
    const categoryDisplay = getCategoryDisplayName(firmalari.categorySlug);
    const title = `${cityData.city} ${categoryDisplay} Firmaları | ${brand.name}`;
    const description = `${cityData.city} şehrinde en iyi ${categoryDisplay.toLowerCase()} firmaları. Fiyat karşılaştırma, gerçek müşteri yorumları. Hemen sipariş verin.`;
    return {
      title,
      description,
      alternates: { canonical: `/${slug}` },
      openGraph: { title, description, url: `https://${brand.domain}/${slug}` },
    };
  }

  // Normal şehir landing
  const cities = await getCities();
  const cityData = findCityBySlug(cities, slug);
  if (!cityData) return { title: 'Sayfa Bulunamadı' };

  const title = `${cityData.city} — ${brand.name}`;
  const description = `${cityData.city} şehrinde en iyi hizmet firmaları. Fiyatları karşılaştırın, yorumları okuyun, hemen sipariş verin.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://${brand.domain}/${slug}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;

  // ── "izmir-hali-yikama-firmalari" formatı ──
  const firmalari = parseFirmalariSlug(slug);
  if (firmalari) {
    const cities = await getCities();
    const cityData = findCityBySlug(cities, firmalari.citySlug);
    if (!cityData) notFound();

    const categoryDisplay = getCategoryDisplayName(firmalari.categorySlug);
    const companies = await getCompaniesByCity(cityData.city);
    const heading = `${cityData.city} ${categoryDisplay} Firmaları`;

    return (
      <>
        <Nav />
        <main className="min-h-screen bg-brand-bg">
          <section
            className="relative py-14 lg:py-20 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-sm text-brand-text-muted mb-6">
                <a href="/" className="hover:text-brand-primary transition-colors">Anasayfa</a>
                <span>/</span>
                <a href={`/turkiye/${firmalari.categorySlug}`} className="hover:text-brand-primary transition-colors">
                  {categoryDisplay}
                </a>
                <span>/</span>
                <span className="text-brand-text font-medium">{cityData.city}</span>
              </nav>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <MapPin size={24} className="text-brand-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-brand-text">
                    {heading}
                  </h1>
                  <p className="text-brand-text-muted mt-1">
                    {companies.length} firma bulundu
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {companies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.map((company, i) => (
                    <CompanyCard key={company.companyId} company={company} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MapPin size={48} className="mx-auto text-brand-text-muted/30 mb-4" />
                  <h3 className="text-lg font-medium text-brand-text">
                    {cityData.city} şehrinde henüz {categoryDisplay.toLowerCase()} firması yok
                  </h3>
                  <p className="text-brand-text-muted mt-2 max-w-md mx-auto">
                    Yakında firmalar eklenecek. Diğer şehirlerdeki firmalarımızı inceleyebilirsiniz.
                  </p>
                  <a
                    href={`/turkiye/${firmalari.categorySlug}`}
                    className="inline-block mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-brand font-medium hover:opacity-90 transition"
                  >
                    Tüm Şehirleri Gör
                  </a>
                </div>
              )}
            </div>
          </section>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: heading,
                numberOfItems: companies.length,
                itemListElement: companies.map((c, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': 'LocalBusiness',
                    name: c.companyName,
                    address: { '@type': 'PostalAddress', addressLocality: cityData.city, addressCountry: 'TR' },
                    ...(c.averageRating > 0 && {
                      aggregateRating: { '@type': 'AggregateRating', ratingValue: c.averageRating.toFixed(1), reviewCount: c.totalReviewCount },
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

  // ── Normal şehir landing sayfası ──
  const cities = await getCities();
  const cityData = findCityBySlug(cities, slug);
  if (!cityData) notFound();

  const companies = await getCompaniesByCity(cityData.city);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <section
          className="relative py-16 lg:py-24 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full mb-4">
              <MapPin size={14} />
              {cityData.city}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-brand-text">
              {cityData.city} Hizmet Firmaları
            </h1>
            <p className="mt-4 text-lg text-brand-text-muted max-w-2xl mx-auto">
              {cityData.city} şehrinde {cityData.companyCount} firma ile hizmetinizdeyiz.
              En iyi firmaları karşılaştırın, tek tıkla sipariş verin.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {companies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.map((company, i) => (
                    <CompanyCard key={company.companyId} company={company} index={i} />
                  ))}
                </div>
                <div className="text-center mt-10">
                  <Link href={`/${slug}/hali-yikama`}>
                    <Button variant="outline">
                      Tüm {cityData.city} Firmalarını Gör
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-brand-text">
                  {cityData.city} şehrinde henüz firma yok
                </h3>
                <p className="text-brand-text-muted mt-1">
                  Yakında bu bölgede de firmalar eklenecek.
                </p>
              </div>
            )}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${cityData.city} Hizmet Firmaları`,
              numberOfItems: companies.length,
              itemListElement: companies.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'LocalBusiness',
                  name: c.companyName,
                  address: { '@type': 'PostalAddress', addressLocality: cityData.city, addressCountry: 'TR' },
                  ...(c.averageRating > 0 && {
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: c.averageRating.toFixed(1), reviewCount: c.totalReviewCount },
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
