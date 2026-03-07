import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/brands';

export default function robots(): MetadataRoute.Robots {
  const brand = getBrandConfig();
  const baseUrl = `https://${brand.domain}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/hesabim/', '/giris'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
