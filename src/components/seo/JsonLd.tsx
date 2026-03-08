import { getBrandConfig } from '@/brands';
import type { CompanyDetailDto, ProductDto, ReviewDto } from '@/lib/api/types';

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

/* ───── Unit type helpers ───── */

const UNIT_LABELS: Record<number, string> = {
  0: 'm²',
  1: 'adet',
  2: 'kg',
  3: 'm',
};

/* ───── Working hours → Schema.org day mapping ───── */

const DAY_MAP: Record<string, string> = {
  Pazartesi: 'Monday',
  Salı: 'Tuesday',
  Çarşamba: 'Wednesday',
  Perşembe: 'Thursday',
  Cuma: 'Friday',
  Cumartesi: 'Saturday',
  Pazar: 'Sunday',
};

function buildOpeningHours(workingHours: Record<string, string>): object[] {
  const specs: object[] = [];
  for (const [trDay, timeRange] of Object.entries(workingHours)) {
    const day = DAY_MAP[trDay];
    if (!day || !timeRange) continue;

    // Handle "09:00-18:00" or "09:00 - 18:00" or "Kapalı"
    const match = timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (!match) continue; // skip "Kapalı" or invalid

    specs.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${day}`,
      opens: match[1],
      closes: match[2],
    });
  }
  return specs;
}

/* ───── Individual reviews → Schema.org Review ───── */

function buildReviews(reviews: ReviewDto[]): object[] {
  return reviews
    .filter((r) => r.rating > 0 && r.createdAt) // datePublished is required
    .slice(0, 10) // Google recommends max ~10
    .map((r) => {
      const review: Record<string, unknown> = {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.customerName || 'Anonim',
        },
        datePublished: r.createdAt.split('T')[0],
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      };

      // reviewBody — Google requires text content for valid review snippet
      if (r.comment) {
        review.reviewBody = r.comment;
      }

      return review;
    });
}

/* ───── Products → Schema.org Offer items ───── */

function buildOffers(products: ProductDto[]): object[] {
  const active = products.filter((p) => p.isActive && p.unitPrice > 0);
  if (active.length === 0) return [];

  return active.map((p) => ({
    '@type': 'Offer',
    name: p.productName,
    price: p.unitPrice.toFixed(2),
    priceCurrency: p.currency || 'TRY',
    unitText: UNIT_LABELS[p.unitType] || 'adet',
    availability: 'https://schema.org/InStock',
  }));
}

/* ───── Price range string for Google ───── */

function buildPriceRange(products: ProductDto[]): string | undefined {
  const prices = products
    .filter((p) => p.isActive && p.unitPrice > 0)
    .map((p) => p.unitPrice);
  if (prices.length === 0) return undefined;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `${min} TL`;
  return `${min} TL - ${max} TL`;
}

/* ───── Main LocalBusiness JSON-LD ───── */

export function LocalBusinessJsonLd({
  company,
  canonicalPath,
}: {
  company: CompanyDetailDto;
  canonicalPath: string;
}) {
  const url = `https://${brand.domain}${canonicalPath}`;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name: company.companyName,
    url,
    ...(company.description && { description: company.description }),
  };

  // Image — prefer gallery photos, fallback to logo
  if (company.photoUrls && company.photoUrls.length > 0) {
    data.image = company.photoUrls;
  } else if (company.logoUrl) {
    data.image = company.logoUrl;
  }

  // Address
  if (company.city) {
    data.address = {
      '@type': 'PostalAddress',
      addressLocality: company.city,
      addressCountry: 'TR',
    };
  }

  // Service area (districts served)
  if (company.serviceAreas?.length > 0) {
    data.areaServed = company.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    }));
  }

  // Aggregate rating
  if (company.averageRating > 0 && company.totalReviewCount > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: company.averageRating.toFixed(1),
      reviewCount: company.totalReviewCount,
      bestRating: '5',
      worstRating: '1',
    };
  }

  // Individual reviews
  if (company.recentReviews?.length > 0) {
    data.review = buildReviews(company.recentReviews);
  }

  // Working hours
  if (company.workingHours && Object.keys(company.workingHours).length > 0) {
    const hours = buildOpeningHours(company.workingHours);
    if (hours.length > 0) {
      data.openingHoursSpecification = hours;
    }
  }

  // Price range (Google rich result)
  const priceRange = buildPriceRange(company.products);
  if (priceRange) {
    data.priceRange = priceRange;
  }

  // Services with individual pricing
  if (company.products?.length > 0) {
    data.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${company.companyName} Fiyat Listesi`,
      itemListElement: buildOffers(company.products),
    };
  }

  // Order action
  if (company.acceptingOrders) {
    data.potentialAction = {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/siparis`,
      },
    };
  }

  // Completed orders as interaction statistic
  if (company.completedOrderCount > 0) {
    data.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/BuyAction',
      userInteractionCount: company.completedOrderCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

