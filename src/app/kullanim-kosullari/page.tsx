import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

const brand = getBrandConfig();

export const metadata = {
  title: `Kullanım Koşulları — ${brand.name}`,
};

export default function KullanimKosullariPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-heading font-bold text-brand-text mb-6">
            Kullanım Koşulları
          </h1>
          <div className="text-brand-text-muted space-y-4 text-sm leading-relaxed">
            <p>
              <strong className="text-brand-text">{brand.name}</strong>{' '}
              platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz.
            </p>
            <h2 className="text-lg font-heading font-semibold text-brand-text mt-6">
              Hizmet Kapsamı
            </h2>
            <p>
              Platform, hizmet firmaları ile müşterileri buluşturan bir
              pazaryeri hizmeti sunmaktadır. Hizmetin kalitesinden ilgili firma
              sorumludur.
            </p>
            <h2 className="text-lg font-heading font-semibold text-brand-text mt-6">
              Sipariş ve Ödeme
            </h2>
            <p>
              Siparişler firma onayına tabidir. Ödeme koşulları firma ile
              müşteri arasında belirlenir.
            </p>
            <h2 className="text-lg font-heading font-semibold text-brand-text mt-6">
              Sorumluluk Reddi
            </h2>
            <p>
              Platform, firmalar tarafından verilen hizmetlerin kalitesi veya
              zamanlaması konusunda garanti vermez.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
