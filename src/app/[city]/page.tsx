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
import { slugify } from '@/lib/utils';
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

async function getCompaniesByCity(
  city: string
): Promise<CompanyListDto[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/mp/companies?city=${encodeURIComponent(city)}&sortBy=rating&pageSize=20`,
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
  const cities = await getCities();
  const cityData = findCityBySlug(cities, slug);
  if (!cityData) return { title: 'Sayfa Bulunamadı' };

  const title = `${cityData.city} — ${brand.name}`;
  const description = `${cityData.city} şehrinde en iyi hizmet firmaları. Fiyatları karşılaştırın, yorumları okuyun, hemen sipariş verin.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://${brand.domain}/${slug}`,
    },
  };
}

export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const cities = await getCities();
  const cityData = findCityBySlug(cities, slug);

  if (!cityData) notFound();

  const companies = await getCompaniesByCity(cityData.city);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        {/* Hero */}
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

        {/* Firma Listesi */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {companies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.map((company, i) => (
                    <CompanyCard
                      key={company.companyId}
                      company={company}
                      index={i}
                    />
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

        {/* SEO JSON-LD */}
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
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: cityData.city,
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
