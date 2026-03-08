import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { getBrandConfig } from '@/brands';
import { getCategoryDisplayName } from '@/lib/utils';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyDetailView } from './company-detail-view';
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import type { CompanyDetailDto } from '@/lib/api/types';

const brand = getBrandConfig();

async function getCompany(slug: string): Promise<CompanyDetailDto | null> {
  try {
    const res = await fetch(`${API_URL}/api/mp/companies/${slug}`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, city, category } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: 'Firma Bulunamadı' };

  const cityDisplay = company.city || decodeURIComponent(city).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const categoryDisplay = getCategoryDisplayName(category);

  const title = `${company.companyName} | ${cityDisplay} ${categoryDisplay} — Fiyatlar ve Yorumlar`;
  const description = `${company.companyName} - ${cityDisplay} ${categoryDisplay} hizmeti. ★${company.averageRating.toFixed(1)} puan, ${company.totalReviewCount} yorum. Fiyat listesi ve online sipariş.`;
  const url = `https://${brand.domain}/${city}/${category}/${slug}`;

  // OG image: prefer first gallery photo, fallback to logo
  const ogImage = company.photoUrls?.[0] || company.logoUrl || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/${city}/${category}/${slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: brand.name,
      locale: 'tr_TR',
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: company.companyName }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function FirmaDetayPage({
  params,
}: {
  params: Promise<{ city: string; category: string; slug: string }>;
}) {
  const { slug, city, category } = await params;
  const company = await getCompany(slug);

  if (!company) notFound();

  const cityDisplay = company.city || decodeURIComponent(city).replace(/-/g, ' ');
  const categoryDisplay = getCategoryDisplayName(category);

  return (
    <>
      <LocalBusinessJsonLd
        company={company}
        canonicalPath={`/${city}/${category}/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Anasayfa', href: '/' },
          { name: cityDisplay, href: `/${city}` },
          { name: categoryDisplay, href: `/${city}/${category}` },
          { name: company.companyName },
        ]}
      />
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <CompanyDetailView company={company} city={city} category={category} />
      </main>
      <Footer />
    </>
  );
}
