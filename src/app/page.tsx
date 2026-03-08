import type { Metadata } from 'next';
import { getBrandConfig } from '@/brands';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { Nav } from '@/components/nav/Nav';
import { Hero } from '@/components/hero/Hero';
import { CategoryGrid, CategoryGridPlaceholder } from '@/components/category/CategoryGrid';
import { FeaturedCompanies } from '@/components/company/FeaturedCompanies';
import { TrustSection } from '@/components/trust/TrustSection';
import { Footer } from '@/components/footer/Footer';
import { WebsiteJsonLd } from '@/components/seo/JsonLd';
import { GuideHighlights } from '@/components/home/GuideHighlights';
import type { CategoryResponseDto, CompanyListDto, PaginatedResponse } from '@/lib/api/types';

const brand = getBrandConfig();

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(brand.seo.heroTitle)}&subtitle=${encodeURIComponent(brand.seo.heroSubtitle)}&type=home`,
        width: 1200,
        height: 630,
        alt: brand.seo.metaTitle,
      },
    ],
  },
};

async function fetchCategories(): Promise<CategoryResponseDto[]> {
  try {
    const res = await fetch(`${API_URL}/api/mp/categories`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchFeaturedCompanies(): Promise<CompanyListDto[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/mp/companies?sortBy=rating&pageSize=6`,
      {
        headers: { 'X-Marketplace-Brand': BRAND_CODE },
        next: { revalidate: 120 },
      }
    );
    if (!res.ok) return [];
    const data: PaginatedResponse<CompanyListDto> = await res.json();
    return data.items;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, companies] = await Promise.all([
    fetchCategories(),
    fetchFeaturedCompanies(),
  ]);

  return (
    <>
      <WebsiteJsonLd />
      <Nav />
      <main>
        <Hero />
        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <CategoryGridPlaceholder />
        )}
        <FeaturedCompanies companies={companies} />
        <GuideHighlights />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
