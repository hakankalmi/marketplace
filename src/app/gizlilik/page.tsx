import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

const brand = getBrandConfig();

export const metadata = {
  title: `Gizlilik Politikası — ${brand.name}`,
};

export default function GizlilikPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl font-heading font-bold text-brand-text mb-6">
            Gizlilik Politikası
          </h1>
          <div className="text-brand-text-muted space-y-4 text-sm leading-relaxed">
            <p>
              <strong className="text-brand-text">{brand.name}</strong> olarak
              kişisel verilerinizin korunmasına büyük önem veriyoruz.
            </p>
            <h2 className="text-lg font-heading font-semibold text-brand-text mt-6">
              Toplanan Veriler
            </h2>
            <p>
              Hizmetlerimizi kullanırken telefon numarası, adres bilgileri ve
              sipariş geçmişi gibi bilgiler toplanmaktadır.
            </p>
            <h2 className="text-lg font-heading font-semibold text-brand-text mt-6">
              Verilerin Kullanımı
            </h2>
            <p>
              Toplanan veriler yalnızca sipariş süreçlerinin yürütülmesi ve
              hizmet kalitesinin artırılması amacıyla kullanılmaktadır.
            </p>
            <h2 className="text-lg font-heading font-semibold text-brand-text mt-6">
              İletişim
            </h2>
            <p>
              Gizlilik ile ilgili sorularınız için bizimle iletişime
              geçebilirsiniz.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
