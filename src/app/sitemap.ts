import type { MetadataRoute } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { getBrandConfig } from '@/brands';

const brand = getBrandConfig();
const baseUrl = `https://${brand.domain}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/firmalar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/giris`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/gizlilik`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/kullanim-kosullari`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Firma slugları
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
      for (const company of data.items || []) {
        const slug = company.slug || company.companyId;
        entries.push({
          url: `${baseUrl}/firmalar/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // Continue without company URLs
  }

  // Şehir landing sayfaları
  try {
    const res = await fetch(`${API_URL}/api/mp/cities`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const cities = await res.json();
      for (const city of cities) {
        const slug = city.city
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-');
        entries.push({
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // Continue without city URLs
  }

  return entries;
}
