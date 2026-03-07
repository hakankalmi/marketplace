import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyDetailView } from './company-detail-view';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';
import type { CompanyDetailDto } from '@/lib/api/types';

async function getCompany(slug: string): Promise<CompanyDetailDto | null> {
  try {
    const res = await fetch(`${API_URL}/api/mp/companies/${slug}`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 60 },
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

  const cityDisplay = decodeURIComponent(city).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const categoryDisplay = decodeURIComponent(category).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `${company.companyName} | ${cityDisplay} ${categoryDisplay} — Fiyatlar ve Yorumlar`,
    description:
      `${company.companyName} - ${cityDisplay} ${categoryDisplay} hizmeti. ★${company.averageRating.toFixed(1)} puan, ${company.totalReviewCount} yorum. Fiyat listesi ve online sipariş.`,
    alternates: {
      canonical: `/${city}/${category}/${slug}`,
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

  return (
    <>
      <LocalBusinessJsonLd
        name={company.companyName}
        description={company.description ?? undefined}
        city={company.city ?? undefined}
        rating={company.averageRating}
        reviewCount={company.totalReviewCount}
        slug={`/${city}/${category}/${slug}`}
      />
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <CompanyDetailView company={company} city={city} category={category} />
      </main>
      <Footer />
    </>
  );
}
