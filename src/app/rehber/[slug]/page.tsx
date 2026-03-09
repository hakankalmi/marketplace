import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { BreadcrumbJsonLd, ArticleJsonLd, FaqJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import { Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getGuideBySlug, guides } from '../guides';

const brand = getBrandConfig();

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Rehber Bulunamadı' };

  const url = `https://${brand.domain}/rehber/${slug}`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `/rehber/${slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      type: 'article',
      siteName: brand.name,
      locale: 'tr_TR',
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(guide.title.split(' — ')[0])}&subtitle=${encodeURIComponent(guide.metaDescription.slice(0, 80))}&type=guide`,
          width: 1200,
          height: 630,
          alt: guide.metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = guide.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter(Boolean);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Anasayfa', href: '/' },
          { name: 'Rehber', href: '/rehber' },
          { name: guide.title },
        ]}
      />
      <ArticleJsonLd
        title={guide.title}
        description={guide.metaDescription}
        path={`/rehber/${slug}`}
        datePublished={guide.datePublished}
        dateModified={guide.dateModified}
      />
      {guide.faq.length > 0 && <FaqJsonLd faq={guide.faq} />}
      {(() => {
        // Detect guides with numbered step sections (e.g. "1. Ön Muayene", "2. Toz Alma")
        const numberedSteps = guide.sections.filter((s) => /^\d+\.\s/.test(s.heading));
        if (numberedSteps.length >= 3) {
          return (
            <HowToJsonLd
              name={guide.title}
              description={guide.metaDescription}
              steps={numberedSteps.map((s) => ({
                name: s.heading.replace(/^\d+\.\s*/, ''),
                text: s.content.replace(/\*\*/g, '').slice(0, 500),
              }))}
              totalTime={guide.readingTime >= 60 ? `PT${Math.round(guide.readingTime / 60)}H` : `PT${guide.readingTime}M`}
            />
          );
        }
        return null;
      })()}
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        {/* Hero */}
        <section
          className="relative py-14 lg:py-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-brand-text-muted mb-6">
              <Link href="/" className="hover:text-brand-primary transition-colors">Anasayfa</Link>
              <span>/</span>
              <Link href="/rehber" className="hover:text-brand-primary transition-colors">Rehber</Link>
              <span>/</span>
              <span className="text-brand-text font-medium line-clamp-1">{guide.title.split(' — ')[0]}</span>
            </nav>

            <div className="text-4xl mb-4">{guide.heroEmoji}</div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-brand-text leading-tight">
              {guide.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-brand-text-muted">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {guide.readingTime} dk okuma
              </span>
              <span>Son güncelleme: {guide.dateModified}</span>
            </div>
          </div>
        </section>

        {/* İçerik */}
        <article className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Intro */}
            <p className="text-lg text-brand-text-muted leading-relaxed mb-10">
              {guide.intro}
            </p>

            {/* İçindekiler */}
            <nav className="bg-brand-surface rounded-brand border border-brand-border p-6 mb-10">
              <h2 className="text-sm font-heading font-semibold text-brand-text-muted uppercase tracking-wider mb-3">
                İçindekiler
              </h2>
              <ol className="space-y-2">
                {guide.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-brand-primary hover:underline text-sm"
                    >
                      {i + 1}. {section.heading}
                    </a>
                  </li>
                ))}
                {guide.faq.length > 0 && (
                  <li>
                    <a href="#faq" className="text-brand-primary hover:underline text-sm">
                      Sıkça Sorulan Sorular
                    </a>
                  </li>
                )}
              </ol>
            </nav>

            {/* Bölümler */}
            {guide.sections.map((section, i) => (
              <section key={i} id={`section-${i}`} className="mb-12">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-text mb-4">
                  {section.heading}
                </h2>
                <div className="prose prose-lg max-w-none text-brand-text-muted leading-relaxed whitespace-pre-line">
                  {section.content.split('\n\n').map((paragraph, pi) => {
                    // Bold + link text rendering
                    const parts = paragraph.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
                    return (
                      <p key={pi} className="mb-4">
                        {parts.map((part, partI) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={partI} className="text-brand-text font-semibold">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                          if (linkMatch) {
                            return (
                              <Link key={partI} href={linkMatch[2]} className="text-brand-primary hover:underline font-medium">
                                {linkMatch[1]}
                              </Link>
                            );
                          }
                          return <span key={partI}>{part}</span>;
                        })}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* SSS */}
            {guide.faq.length > 0 && (
              <section id="faq" className="mb-12">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-text mb-6">
                  Sıkça Sorulan Sorular
                </h2>
                <div className="space-y-4">
                  {guide.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group bg-brand-surface rounded-brand border border-brand-border overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-brand-text hover:text-brand-primary transition-colors">
                        {item.q}
                        <ArrowRight
                          size={16}
                          className="text-brand-text-muted group-open:rotate-90 transition-transform shrink-0 ml-2"
                        />
                      </summary>
                      <div className="px-5 pb-5 text-brand-text-muted leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="bg-brand-surface rounded-brand border border-brand-border p-8 text-center mb-12">
              <h3 className="text-lg font-heading font-semibold text-brand-text mb-2">
                Profesyonel hizmet mi arıyorsunuz?
              </h3>
              <p className="text-brand-text-muted mb-4">
                {guide.city ? (
                  <>En iyi <Link href={`/${guide.citySlug}-${guide.category}-firmalari`} className="text-brand-primary hover:underline font-medium">{guide.city} halı yıkama firmalarını</Link> karşılaştırın, kolayca sipariş verin.</>
                ) : (
                  'Şehrinizdeki en iyi firmaları karşılaştırın, kolayca sipariş verin.'
                )}
              </p>
              <Link
                href={guide.city ? `/${guide.citySlug}-${guide.category}-firmalari` : `/turkiye/${guide.category}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-brand font-medium hover:opacity-90 transition"
              >
                <BookOpen size={16} />
                {guide.city ? `${guide.city} Firmalarını İncele` : 'Firmaları İncele'}
              </Link>
            </div>

            {/* İlgili Rehberler */}
            {relatedGuides.length > 0 && (
              <section>
                <h2 className="text-lg font-heading font-semibold text-brand-text mb-4">
                  İlgili Rehberler
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedGuides.map((related) => related && (
                    <Link key={related.slug} href={`/rehber/${related.slug}`}>
                      <div className="group bg-brand-surface rounded-brand border border-brand-border p-4 hover:border-brand-primary transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{related.heroEmoji}</span>
                          <div>
                            <h3 className="text-sm font-medium text-brand-text group-hover:text-brand-primary transition-colors line-clamp-2">
                              {related.title.split(' — ')[0]}
                            </h3>
                            <span className="text-xs text-brand-text-muted flex items-center gap-1 mt-1">
                              <Clock size={10} />
                              {related.readingTime} dk
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Geri dön */}
            <div className="mt-10 pt-6 border-t border-brand-border">
              <Link
                href="/rehber"
                className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
              >
                <ArrowLeft size={14} />
                Tüm Rehberler
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
