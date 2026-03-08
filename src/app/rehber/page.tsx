import type { Metadata } from 'next';
import Link from 'next/link';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { guides } from './guides';

const brand = getBrandConfig();

export const metadata: Metadata = {
  title: `Rehber — Halı Yıkama, Koltuk Yıkama Bilgi Merkezi`,
  description: 'Halı yıkama fiyatları, leke çıkarma yöntemleri, bakım ipuçları ve daha fazlası. Profesyonel temizlik hakkında bilmeniz gereken her şey.',
  alternates: { canonical: '/rehber' },
  openGraph: {
    title: `Rehber | ${brand.name}`,
    description: 'Halı yıkama, koltuk yıkama ve temizlik hakkında kapsamlı rehberler.',
    url: `https://${brand.domain}/rehber`,
    type: 'website',
    siteName: brand.name,
    locale: 'tr_TR',
  },
  twitter: { card: 'summary', title: `Rehber | ${brand.name}` },
};

export default function RehberPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Anasayfa', href: '/' },
          { name: 'Rehber' },
        ]}
      />
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        {/* Hero */}
        <section
          className="relative py-16 lg:py-24 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full mb-4">
              <BookOpen size={14} />
              Bilgi Merkezi
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-brand-text">
              Temizlik Rehberi
            </h1>
            <p className="mt-4 text-lg text-brand-text-muted max-w-2xl mx-auto">
              Halı yıkama fiyatları, leke çıkarma yöntemleri, bakım ipuçları ve profesyonel temizlik hakkında bilmeniz gereken her şey.
            </p>
          </div>
        </section>

        {/* Makale Listesi */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {guides.map((guide) => (
                <Link key={guide.slug} href={`/rehber/${guide.slug}`}>
                  <article className="group bg-brand-surface rounded-brand border border-brand-border p-6 hover:shadow-brand hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl shrink-0">{guide.heroEmoji}</div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-heading font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
                          {guide.title}
                        </h2>
                        <p className="mt-2 text-sm text-brand-text-muted line-clamp-2">
                          {guide.intro}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-brand-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {guide.readingTime} dk okuma
                          </span>
                          <span>{guide.dateModified}</span>
                          <span className="ml-auto flex items-center gap-1 text-brand-primary font-medium">
                            Oku <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
