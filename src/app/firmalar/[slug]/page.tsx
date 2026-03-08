import { redirect, notFound } from 'next/navigation';
import { API_URL, BRAND_CODE } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import type { CompanyDetailDto } from '@/lib/api/types';

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

// Eski /firmalar/[slug] URL'lerini yeni SEO-friendly URL'e redirect et
export default async function FirmaRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) notFound();

  const city = slugify(company.city || 'turkiye');
  const companySlug = company.slug || slugify(company.companyName);

  redirect(`/${city}/hali-yikama/${companySlug}`);
}
