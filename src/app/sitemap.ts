import type { MetadataRoute } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { getBrandConfig } from '@/brands';
import { slugify } from '@/lib/utils';
import { guides } from './rehber/guides';

const brand = getBrandConfig();
const baseUrl = `https://${brand.domain}`;

const CATEGORIES = [
  'hali-yikama',
  'koltuk-yikama',
  'yorgan-yikama',
  'perde-yikama',
  'yatak-yikama',
  'ev-temizligi',
  'ofis-temizligi',
];

interface CompanyItem {
  companyId: string;
  slug: string | null;
  city: string | null;
  categoryKeys: string[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    // ── Statik sayfalar ──
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/firmalar`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/giris`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/hakkimizda`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/gizlilik`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/kullanim-kosullari`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // ── Kategori ana sayfaları: /turkiye/hali-yikama (zengin SEO içerik — her zaman) ──
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${baseUrl}/turkiye/${cat}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // ── Rehber (Blog) sayfaları: /rehber/{slug} ──
  entries.push({
    url: `${baseUrl}/rehber`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  });
  for (const guide of guides) {
    entries.push({
      url: `${baseUrl}/rehber/${guide.slug}`,
      lastModified: new Date(guide.dateModified),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // ── Firmalardan türeyen sayfalar ──
  // SEO: SADECE firması olan il / il+kategori / firma detay sayfaları sitemap'e girer.
  // Boş il/ilçe/kategori sayfaları (thin/doorway content) sitemap'e ALINMAZ.
  try {
    const res = await fetch(`${API_URL}/api/mp/companies?pageSize=1000`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      const companies = (data.items || []) as CompanyItem[];

      const citiesWithFirms = new Set<string>();
      const cityCategoryWithFirms = new Set<string>(); // "citySlug|category"

      for (const company of companies) {
        const citySlug = company.city ? slugify(company.city) : null;
        if (!citySlug) continue;

        citiesWithFirms.add(citySlug);
        for (const rawKey of company.categoryKeys || []) {
          const cat = rawKey.replace(/_/g, '-');
          if (CATEGORIES.includes(cat)) {
            cityCategoryWithFirms.add(`${citySlug}|${cat}`);
          }
        }

        // Firma detay sayfası: /{city}/{category}/{slug}
        const companySlug = company.slug || company.companyId;
        const category = (company.categoryKeys?.[0] || 'hali-yikama').replace(/_/g, '-');
        entries.push({
          url: `${baseUrl}/${citySlug}/${category}/${companySlug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }

      // İl landing sayfaları: /izmir — sadece firması olanlar
      for (const citySlug of citiesWithFirms) {
        entries.push({
          url: `${baseUrl}/${citySlug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }

      // İl + kategori sayfaları: /izmir-hali-yikama-firmalari — sadece firması olanlar
      for (const key of cityCategoryWithFirms) {
        const [citySlug, cat] = key.split('|');
        entries.push({
          url: `${baseUrl}/${citySlug}-${cat}-firmalari`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // Continue without company-derived URLs
  }

  return entries;
}
