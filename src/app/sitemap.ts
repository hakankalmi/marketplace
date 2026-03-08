import type { MetadataRoute } from 'next';
import { API_URL, BRAND_CODE, CITIES } from '@/lib/constants';
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

  // ── Kategori ana sayfaları: /turkiye/hali-yikama ──
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${baseUrl}/turkiye/${cat}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // ── 81 il landing sayfaları: /sivas, /istanbul ──
  for (const city of CITIES) {
    const citySlug = slugify(city);
    entries.push({
      url: `${baseUrl}/${citySlug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // ── Şehir+Kategori sayfaları: /sivas-hali-yikama-firmalari ──
    for (const cat of CATEGORIES) {
      entries.push({
        url: `${baseUrl}/${citySlug}-${cat}-firmalari`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
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

  // ── Firma detay sayfaları: /{city}/{category}/{slug} ──
  try {
    const res = await fetch(
      `${API_URL}/api/mp/companies?pageSize=1000`,
      {
        headers: { 'X-Marketplace-Brand': BRAND_CODE },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = await res.json();
      for (const company of (data.items || []) as CompanyItem[]) {
        const companySlug = company.slug || company.companyId;
        const citySlug = company.city ? slugify(company.city) : null;
        const category = company.categoryKeys?.[0] || 'hali-yikama';

        if (citySlug) {
          entries.push({
            url: `${baseUrl}/${citySlug}/${category}/${companySlug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch {
    // Continue without company URLs
  }

  return entries;
}
