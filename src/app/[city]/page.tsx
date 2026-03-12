import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE, CITIES } from '@/lib/constants';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyListClient } from '@/components/company/CompanyListClient';
import { MapPin, Building2, Send } from 'lucide-react';
import { slugify, getCategoryDisplayName, getCategoryId } from '@/lib/utils';
import type { CompanyListDto, PaginatedResponse, CityDto } from '@/lib/api/types';

const brand = getBrandConfig();

// Bilinen kategori slug'ları — slug parse etmek için
const KNOWN_CATEGORIES = [
  'hali-yikama',
  'koltuk-yikama',
  'yorgan-yikama',
  'perde-yikama',
  'yatak-yikama',
  'ev-temizligi',
  'ofis-temizligi',
];

// Build city slug lookup once
const CITY_SLUGS = CITIES.map((c) => ({ name: c, slug: slugify(c) }));

/**
 * "izmir-hali-yikama-firmalari" → { citySlug: "izmir", categorySlug: "hali-yikama" }
 * "sivas-gurun-hali-yikama-firmalari" → { citySlug: "sivas", categorySlug: "hali-yikama", districtSlug: "gurun" }
 */
function parseFirmalariSlug(rawSlug: string): { citySlug: string; categorySlug: string; districtSlug?: string; cityName?: string } | null {
  // Normalize: underscores → dashes (category keys like hali_yikama → hali-yikama)
  const slug = rawSlug.replace(/_/g, '-');
  if (!slug.endsWith('-firmalari')) return null;
  const base = slug.replace(/-firmalari$/, '');
  for (const cat of KNOWN_CATEGORIES) {
    if (base.endsWith(`-${cat}`)) {
      const prefix = base.slice(0, -(cat.length + 1));
      if (prefix.length === 0) continue;

      // Try to match a known city from the beginning
      for (const { name, slug: cs } of CITY_SLUGS) {
        if (prefix === cs) {
          return { citySlug: cs, categorySlug: cat, cityName: name };
        }
        if (prefix.startsWith(`${cs}-`)) {
          const districtSlug = prefix.slice(cs.length + 1);
          if (districtSlug.length > 0) {
            return { citySlug: cs, categorySlug: cat, districtSlug, cityName: name };
          }
        }
      }
    }
  }
  return null;
}

async function getCities(): Promise<CityDto[]> {
  try {
    const res = await fetch(`${API_URL}/api/mp/cities`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 60 },
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
  // 1. API'den gelen şehirlerle eşleştir
  const fromApi = cities.find((c) => slugify(c.city) === slug);
  if (fromApi) return fromApi;
  // 2. Fallback: 81 il listesinden eşleştir (API'de henüz firma yoksa bile sayfa göster)
  const fromConstants = CITIES.find((c) => slugify(c) === slug);
  if (fromConstants) return { city: fromConstants, companyCount: 0 };
  return undefined;
}

async function getCompaniesByCity(
  city: string,
  district?: string,
  categoryId?: number,
): Promise<CompanyListDto[]> {
  try {
    const districtParam = district ? `&district=${encodeURIComponent(district)}` : '';
    const catParam = categoryId ? `&categoryId=${categoryId}` : '';
    const res = await fetch(
      `${API_URL}/api/mp/companies?city=${encodeURIComponent(city)}&sortBy=rating&pageSize=200${districtParam}${catParam}`,
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

/** Slug → Turkish district/city name with proper Turkish characters */
function deslugify(slug: string): string {
  // Try to find from 81-city list first
  const cityMatch = CITIES.find((c) => slugify(c) === slug);
  if (cityMatch) return cityMatch;
  // Try known district names (common Turkish chars lost in slugification)
  const knownDistrict = KNOWN_DISTRICTS[slug];
  if (knownDistrict) return knownDistrict;
  // Fallback: basic capitalization
  return slug
    .split('-')
    .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
    .join(' ');
}

// Districts where slugify loses Turkish characters — add as discovered
const KNOWN_DISTRICTS: Record<string, string> = {
  'eleskirt': 'Eleşkirt', 'diyadin': 'Diyadin', 'dogubayazit': 'Doğubayazıt',
  'taskopru': 'Taşköprü', 'tosya': 'Tosya', 'taskent': 'Taşkent',
  'golbasi': 'Gölbaşı', 'cankiri': 'Çankırı', 'corum': 'Çorum',
  'duzce': 'Düzce', 'gumushane': 'Gümüşhane', 'igdir': 'Iğdır',
  'iskenderun': 'İskenderun', 'osmaniye': 'Osmaniye', 'sirnak': 'Şırnak',
  'usak': 'Uşak', 'nigde': 'Niğde', 'kirikkale': 'Kırıkkale',
  'kirsehir': 'Kırşehir', 'kutahya': 'Kütahya', 'nevsehir': 'Nevşehir',
  'tekirdag': 'Tekirdağ', 'mugla': 'Muğla', 'burdur': 'Burdur',
  'karabuk': 'Karabük', 'duzici': 'Düziçi', 'elbistan': 'Elbistan',
  'goksun': 'Göksun', 'ercis': 'Erciş', 'ozalp': 'Özalp',
  'suruc': 'Suruç', 'cizre': 'Cizre', 'nusaybin': 'Nusaybin',
  'silopi': 'Silopi', 'yuksekova': 'Yüksekova', 'semdinli': 'Şemdinli',
  'ergani': 'Ergani', 'bismil': 'Bismil', 'silvan': 'Silvan',
  'korfez': 'Körfez', 'gebze': 'Gebze', 'darica': 'Darıca',
  'cayirova': 'Çayırova', 'dilovasi': 'Dilovası', 'kartepe': 'Kartepe',
  'derince': 'Derince', 'golcuk': 'Gölcük', 'basiskele': 'Başiskele',
  'hendek': 'Hendek', 'bolu': 'Bolu',
  'serdivan': 'Serdivan', 'sapanca': 'Sapanca', 'pamukova': 'Pamukova',
  'akyazi': 'Akyazı', 'ferizli': 'Ferizli', 'sogutlu': 'Söğütlü',
  'kaynarca': 'Kaynarca', 'kocaali': 'Kocaali', 'geyve': 'Geyve',
  'tarakli': 'Taraklı', 'guzelce': 'Güzelce', 'buyukcekmece': 'Büyükçekmece',
  'kucukcekmece': 'Küçükçekmece', 'bahcelievler': 'Bahçelievler',
  'bakirkoy': 'Bakırköy', 'besiktas': 'Beşiktaş', 'beyoglu': 'Beyoğlu',
  'kadikoy': 'Kadıköy', 'uskudar': 'Üsküdar', 'sisli': 'Şişli',
  'umraniye': 'Ümraniye', 'sancaktepe': 'Sancaktepe', 'sultanbeyli': 'Sultanbeyli',
  'tuzla': 'Tuzla', 'pendik': 'Pendik', 'kartal': 'Kartal',
  'maltepe': 'Maltepe', 'atasehir': 'Ataşehir', 'cekmekoy': 'Çekmeköy',
  'esenyurt': 'Esenyurt', 'avcilar': 'Avcılar', 'beylikduzu': 'Beylikdüzü',
  'basaksehir': 'Başakşehir', 'arnavutkoy': 'Arnavutköy', 'catalca': 'Çatalca',
  'silivri': 'Silivri', 'sile': 'Şile', 'beykoz': 'Beykoz',
  'sarigazi': 'Sarıgazi', 'sultanahmet': 'Sultanahmet', 'fatih': 'Fatih',
  'eyupsultan': 'Eyüpsultan', 'kagithane': 'Kağıthane', 'sariyer': 'Sarıyer',
  'buyukada': 'Büyükada', 'buca': 'Buca', 'bornova': 'Bornova',
  'karsiyaka': 'Karşıyaka', 'konak': 'Konak', 'cigli': 'Çiğli',
  'bayrakli': 'Bayraklı', 'gaziemir': 'Gaziemir', 'alsancak': 'Alsancak',
  'cesme': 'Çeşme', 'dikili': 'Dikili', 'foca': 'Foça',
  'menemen': 'Menemen', 'odemis': 'Ödemiş', 'seferihisar': 'Seferihisar',
  'selcuk': 'Selçuk', 'tire': 'Tire', 'torbali': 'Torbalı', 'urla': 'Urla',
  'osmangazi': 'Osmangazi', 'nilufer': 'Nilüfer', 'yildirim': 'Yıldırım',
  'gursu': 'Gürsu', 'kestel': 'Kestel', 'inegol': 'İnegöl',
  'gemlik': 'Gemlik', 'mudanya': 'Mudanya', 'mustafakemalpasa': 'Mustafakemalpaşa',
  'orhangazi': 'Orhangazi', 'iznik': 'İznik', 'yenisehir': 'Yenişehir',
  'ceyhan': 'Ceyhan', 'kozan': 'Kozan', 'imamoglu': 'İmamoğlu',
  'tufanbeyli': 'Tufanbeyli', 'pozanti': 'Pozantı', 'saimbeyli': 'Saimbeyli',
  'kepez': 'Kepez', 'muratpasa': 'Muratpaşa', 'konyaalti': 'Konyaaltı',
  'aksu': 'Aksu', 'dosemealti': 'Döşemealtı', 'alanya': 'Alanya',
  'manavgat': 'Manavgat', 'serik': 'Serik', 'kumluca': 'Kumluca',
  'kas': 'Kaş', 'demre': 'Demre', 'finike': 'Finike',
  'yenimahalle': 'Yenimahalle', 'cankaya': 'Çankaya', 'kecioren': 'Keçiören',
  'mamak': 'Mamak', 'etimesgut': 'Etimesgut', 'sincan': 'Sincan',
  'pursaklar': 'Pursaklar', 'altindag': 'Altındağ', 'polatli': 'Polatlı',
  'cubuk': 'Çubuk', 'kahramankazan': 'Kahramankazan', 'beypazari': 'Beypazarı',
  'efeler': 'Efeler', 'nazilli': 'Nazilli', 'soke': 'Söke',
  'kusadasi': 'Kuşadası', 'didim': 'Didim', 'incirliova': 'İncirliova',
  'bodrum': 'Bodrum', 'marmaris': 'Marmaris', 'fethiye': 'Fethiye',
  'milas': 'Milas', 'dalaman': 'Dalaman', 'ortaca': 'Ortaca',
  'datca': 'Datça', 'koycegiz': 'Köyceğiz', 'mentese': 'Menteşe',
  'seydikemer': 'Seydikemer', 'ula': 'Ula', 'yatagan': 'Yatağan',
  'merzifon': 'Merzifon', 'suluova': 'Suluova', 'tasova': 'Taşova',
  'tokat': 'Tokat', 'erbaa': 'Erbaa', 'turhal': 'Turhal', 'niksar': 'Niksar',
  'gurun': 'Gürün', 'kangal': 'Kangal', 'zara': 'Zara',
  'susehi̇r': 'Suşehri', 'susehri': 'Suşehri', 'gemerek': 'Gemerek',
  'sarkisla': 'Şarkışla', 'divrigi': 'Divriği', 'yildizeli': 'Yıldızeli',
  'hafik': 'Hafik', 'imranli': 'İmranlı', 'koyulhisar': 'Koyulhisar',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;

  // "izmir-hali-yikama-firmalari" formatını kontrol et
  const firmalari = parseFirmalariSlug(slug);
  if (firmalari) {
    const cityName = firmalari.cityName || deslugify(firmalari.citySlug);
    const categoryDisplay = getCategoryDisplayName(firmalari.categorySlug);

    if (firmalari.districtSlug) {
      const districtName = deslugify(firmalari.districtSlug);
      const title = `${districtName}, ${cityName} ${categoryDisplay} Firmaları | ${brand.name}`;
      const description = `${cityName} ${districtName} bölgesinde en iyi ${categoryDisplay.toLowerCase()} firmaları. Fiyat karşılaştırma, gerçek müşteri yorumları. Kolayca sipariş verin.`;
      return {
        title,
        description,
        alternates: { canonical: `/${slug}` },
        openGraph: { title, description, url: `https://${brand.domain}/${slug}` },
      };
    }

    const title = `${cityName} ${categoryDisplay} Firmaları | ${brand.name}`;
    const description = `${cityName} şehrinde en iyi ${categoryDisplay.toLowerCase()} firmaları. Fiyat karşılaştırma, gerçek müşteri yorumları. Kolayca sipariş verin.`;
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

  // ── "izmir-hali-yikama-firmalari" veya "sivas-gurun-hali-yikama-firmalari" formatı ──
  const firmalari = parseFirmalariSlug(slug);
  if (firmalari) {
    const cityName = firmalari.cityName || deslugify(firmalari.citySlug);
    const districtName = firmalari.districtSlug ? deslugify(firmalari.districtSlug) : undefined;
    const categoryDisplay = getCategoryDisplayName(firmalari.categorySlug);
    const catId = getCategoryId(firmalari.categorySlug);
    const companies = await getCompaniesByCity(cityName, districtName, catId);
    const locationLabel = districtName ? `${districtName}, ${cityName}` : cityName;
    const heading = `${locationLabel} ${categoryDisplay} Firmaları`;

    return (
      <>
        <Nav />
        <main className="min-h-screen bg-brand-bg">
          <section
            className="relative py-6 sm:py-10 lg:py-16 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-text-muted mb-3 sm:mb-6 flex-wrap">
                <a href="/" className="hover:text-brand-primary transition-colors">Anasayfa</a>
                <span>/</span>
                <a href={`/turkiye/${firmalari.categorySlug}`} className="hover:text-brand-primary transition-colors">
                  {categoryDisplay}
                </a>
                <span>/</span>
                {districtName ? (
                  <>
                    <a href={`/${firmalari.citySlug}-${firmalari.categorySlug}-firmalari`} className="hover:text-brand-primary transition-colors">
                      {cityName}
                    </a>
                    <span>/</span>
                    <span className="text-brand-text font-medium">{districtName}</span>
                  </>
                ) : (
                  <span className="text-brand-text font-medium">{cityName}</span>
                )}
              </nav>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <MapPin size={20} className="text-brand-primary sm:hidden" />
                  <MapPin size={24} className="text-brand-primary hidden sm:block" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-heading font-bold text-brand-text">
                    {heading}
                  </h1>
                  <p className="text-brand-text-muted text-sm mt-0.5">
                    {companies.length} firma bulundu
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-6 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {companies.length > 0 ? (
                <CompanyListClient companies={companies} />
              ) : (
                <div className="text-center py-20 max-w-lg mx-auto">
                  <Building2 size={48} className="mx-auto text-brand-primary/30 mb-4" />
                  <h3 className="text-lg font-heading font-bold text-brand-text">
                    {locationLabel} bölgesinde henüz {categoryDisplay.toLowerCase()} firması yok
                  </h3>
                  <p className="text-brand-text-muted mt-3 leading-relaxed">
                    {locationLabel} bölgesindeki müşterilerimize {brand.name} kalitesi ile hizmet verebilecek bir firma iseniz, lütfen başvurunuzu yapın.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <a
                      href="/basvuru"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-brand font-medium hover:opacity-90 transition"
                    >
                      <Send size={16} />
                      Firma Başvurusu Yap
                    </a>
                    <a
                      href={`/${firmalari.citySlug}-${firmalari.categorySlug}-firmalari`}
                      className="inline-flex items-center justify-center px-6 py-2.5 border border-brand-border text-brand-text rounded-brand font-medium hover:border-brand-primary hover:text-brand-primary transition"
                    >
                      {cityName} Firmalarını Gör
                    </a>
                  </div>
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
                    address: { '@type': 'PostalAddress', addressLocality: cityName, addressCountry: 'TR' },
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
          className="relative py-6 sm:py-10 lg:py-16 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <MapPin size={20} className="text-brand-primary sm:hidden" />
                <MapPin size={24} className="text-brand-primary hidden sm:block" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-heading font-bold text-brand-text">
                  {cityData.city} Hizmet Firmaları
                </h1>
                <p className="text-brand-text-muted text-sm mt-0.5">
                  {companies.length > 0
                    ? `${companies.length} firma ile hizmetinizdeyiz`
                    : 'Yakında firmalar eklenecek'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {companies.length > 0 ? (
              <CompanyListClient companies={companies} />
            ) : (
              <div className="text-center py-16 max-w-lg mx-auto">
                <Building2 size={48} className="mx-auto text-brand-primary/30 mb-4" />
                <h3 className="text-lg font-heading font-bold text-brand-text">
                  {cityData.city} şehrinde henüz firma yok
                </h3>
                <p className="text-brand-text-muted mt-3 leading-relaxed">
                  {cityData.city} bölgesindeki müşterilerimize {brand.name} kalitesi ile hizmet verebilecek bir firma iseniz, lütfen başvurunuzu yapın.
                </p>
                <a
                  href="/basvuru"
                  className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-brand font-medium hover:opacity-90 transition"
                >
                  <Send size={16} />
                  Firma Başvurusu Yap
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
