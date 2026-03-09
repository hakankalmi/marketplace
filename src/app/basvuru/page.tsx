import type { Metadata } from 'next';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { ApplicationForm } from './ApplicationForm';
import { Building2, CheckCircle } from 'lucide-react';

const brand = getBrandConfig();

export const metadata: Metadata = {
  title: `Firma Başvurusu | ${brand.name}`,
  description: `${brand.name} platformunda yerinizi alın. Müşterilerinize online sipariş, takip ve güvenilir hizmet deneyimi sunun. Hemen ücretsiz başvurun.`,
};

export default function BasvuruPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        {/* Hero */}
        <section
          className="relative py-16 lg:py-24 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary} 0%, ${brand.colors.primaryDark} 100%)`,
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: brand.colors.accent }} />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-5" style={{ background: '#fff' }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full text-white text-sm font-medium mb-6">
              <Building2 size={16} />
              Hizmet Veren Olun
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
              {brand.name} Platformunda<br />Yerinizi Alın
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Binlerce müşteriye ulaşın, online sipariş alın, profesyonel firma profilinizi oluşturun. Platformumuz tamamen ücretsizdir.
            </p>
          </div>
        </section>

        {/* Avantajlar */}
        <section className="py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-heading font-bold text-brand-text text-center mb-10">
              Neden {brand.name}?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Ücretsiz firma profili ve tanıtım sayfası',
                'Online sipariş alma ve yönetimi',
                'Müşteri yorumları ile güven oluşturma',
                'Anlık bildirimler ile sipariş takibi',
                'Profesyonel firma görünümü',
                'Binlerce potansiyel müşteriye erişim',
                'Detaylı hizmet bölgesi tanımlama',
                'Mobil uyumlu firma profili',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 p-4 bg-brand-surface rounded-xl border border-brand-border/50">
                  <CheckCircle size={20} className="text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-brand-text font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Başvuru Formu */}
        <section className="py-14 bg-brand-surface">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <ApplicationForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
