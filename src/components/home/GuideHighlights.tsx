import Link from 'next/link';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { guides } from '@/app/rehber/guides';

/** Top 6 guides displayed on the homepage for internal linking + SEO */
export function GuideHighlights() {
  const featured = guides.slice(0, 6);

  return (
    <section className="py-12 lg:py-16 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-text">
              Rehber & İpuçları
            </h2>
            <p className="text-sm text-brand-text-muted mt-1">
              Profesyonel temizlik hakkında bilmeniz gereken her şey
            </p>
          </div>
          <Link
            href="/rehber"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            Tüm Rehberler
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((guide) => (
            <Link key={guide.slug} href={`/rehber/${guide.slug}`}>
              <article className="group h-full bg-brand-surface rounded-brand border border-brand-border p-5 hover:border-brand-primary hover:shadow-brand transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{guide.heroEmoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-brand-text group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                      {guide.title.split(' — ')[0]}
                    </h3>
                    <p className="text-xs text-brand-text-muted mt-1.5 line-clamp-2">
                      {guide.metaDescription.slice(0, 100)}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5 text-xs text-brand-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {guide.readingTime} dk
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={10} />
                        {guide.faq.length} SSS
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/rehber"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary"
          >
            Tüm Rehberleri Gör
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
