import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/brands';

export default function manifest(): MetadataRoute.Manifest {
  const brand = getBrandConfig();

  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.seo.metaDescription,
    start_url: '/',
    display: 'standalone',
    background_color: brand.colors.background,
    theme_color: brand.colors.primary,
    icons: [
      {
        src: `${brand.logoUrl}`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `${brand.logoUrl}`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
