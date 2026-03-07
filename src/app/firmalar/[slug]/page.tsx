import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyDetailView } from './company-detail-view';
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return { title: 'Firma Bulunamadı' };

  return {
    title: `${company.companyName} — Fiyatlar, Yorumlar ve Sipariş`,
    description:
      company.description ||
      `${company.companyName} hizmetleri, fiyat listesi, müşteri yorumları. Hemen sipariş verin.`,
  };
}

export default async function FirmaDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) notFound();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <CompanyDetailView company={company} />
      </main>
      <Footer />
    </>
  );
}
