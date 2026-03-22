import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

const brand = getBrandConfig();

export const metadata = {
  title: `Hakkımızda — ${brand.name}`,
  description: `${brand.name} hakkında. Türkiye'nin 81 ilinde halı yıkama, koltuk yıkama firmalarını bir araya getiren güvenilir platform.`,
  alternates: { canonical: '/hakkimizda' },
};

export default function HakkimizdaPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-heading font-bold text-brand-text mb-6">
            Hakkımızda
          </h1>
          <div className="prose prose-brand max-w-none text-brand-text-muted space-y-4">
            <p>
              <strong className="text-brand-text">{brand.name}</strong>, size en
              uygun hizmet firmasını bulmanızı kolaylaştıran bir pazaryeri
              platformudur.
            </p>
            <p>
              Amacımız, güvenilir firmaları tek bir çatı altında toplayarak
              fiyatları, yorumları ve hizmet kalitesini karşılaştırmanızı sağlamak.
              Tek tıkla sipariş verin, gerisini bize bırakın.
            </p>
            <h2 className="text-xl font-heading font-semibold text-brand-text mt-8">
              Nasıl Çalışır?
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Şehrinizi seçin ve firmaları keşfedin</li>
              <li>Fiyatları, yorumları ve puanları karşılaştırın</li>
              <li>Beğendiğiniz firmaya sipariş verin</li>
              <li>Firma sizinle iletişime geçsin, hizmeti alın</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
