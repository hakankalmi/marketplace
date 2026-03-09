import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/brands';

export default function robots(): MetadataRoute.Robots {
  const brand = getBrandConfig();
  const baseUrl = `https://${brand.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ['/hesabim/', '/giris', '/api/'],
      },
      // Block AI training crawlers (keep search crawlers allowed)
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Bytespider', 'Amazonbot', 'Applebot-Extended', 'meta-externalagent'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
