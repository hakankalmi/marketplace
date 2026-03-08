import { getBrandConfig } from '@/brands';
import { getCategoryDisplayName } from '@/lib/utils';
import type { CompanyDetailDto, ProductDto, ReviewDto } from '@/lib/api/types';

const brand = getBrandConfig();
const baseUrl = `https://${brand.domain}`;

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

/* ───── BreadcrumbList JSON-LD ───── */

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href?: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href && { item: `${baseUrl}${item.href}` }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ───── FAQPage JSON-LD ───── */

export function FaqJsonLd({ faq }: { faq: { q: string; a: string }[] }) {
  if (faq.length === 0) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ───── HowTo JSON-LD (Step-by-step guides) ───── */

export function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string; // ISO 8601 duration, e.g. "PT2H" for 2 hours
}) {
  if (steps.length === 0) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  if (totalTime) {
    data.totalTime = totalTime;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ───── Organization JSON-LD (Global) ───── */

export function OrganizationJsonLd() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: baseUrl,
    logo: `${baseUrl}${brand.logoUrl}`,
  };

  if (brand.seo.socialLinks) {
    const links = Object.values(brand.seo.socialLinks);
    if (links.length > 0) {
      data.sameAs = links;
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ───── Article JSON-LD (Blog) ───── */

export function ArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${baseUrl}${path}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: brand.name,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: brand.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${brand.logoUrl}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${path}`,
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

