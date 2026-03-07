import { notFound } from 'next/navigation';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { OrderFlow } from '@/components/order/OrderFlow';
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

export default async function SiparisPage({
  params,
}: {
  params: Promise<{ city: string; category: string; slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <OrderFlow company={company} />
        </div>
      </main>
      <Footer />
    </>
  );
}
