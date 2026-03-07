import { getBrandConfig } from '@/brands';

const brand = getBrandConfig();

export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    url: `https://${brand.domain}`,
    description: brand.seo.metaDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://${brand.domain}/firmalar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({
  name,
  description,
  city,
  rating,
  reviewCount,
  slug,
}: {
  name: string;
  description?: string;
  city?: string;
  rating: number;
  reviewCount: number;
  slug: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url: `https://${brand.domain}/firmalar/${slug}`,
    ...(description && { description }),
    ...(city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressCountry: 'TR',
      },
    }),
    ...(rating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toFixed(1),
        reviewCount,
        bestRating: '5',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
