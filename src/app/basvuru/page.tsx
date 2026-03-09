import type { Metadata } from 'next';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { Building2, CheckCircle, ArrowRight, Phone, Mail, Globe } from 'lucide-react';

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

        {/* Başvuru Formu / İletişim */}
        <section className="py-14 bg-brand-surface">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-bg rounded-2xl border border-brand-border p-8 text-center">
              <h2 className="text-2xl font-heading font-bold text-brand-text mb-4">
                Hemen Başvurun
              </h2>
              <p className="text-brand-text-muted mb-8 leading-relaxed">
                Firma başvurunuz için aşağıdaki kanallardan bizimle iletişime geçin. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
              </p>

              <div className="space-y-4">
                <a
                  href="https://wa.me/905330916795?text=Merhaba%2C%20firma%20ba%C5%9Fvurusu%20yapmak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-[#25D366] text-white rounded-xl font-medium hover:opacity-90 transition text-base"
                >
                  <Phone size={20} />
                  WhatsApp ile Başvur
                </a>

                <a
                  href="mailto:info@haliyikamacilar.com?subject=Firma%20Ba%C5%9Fvurusu"
                  className="flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-brand-primary text-white rounded-xl font-medium hover:opacity-90 transition text-base"
                >
                  <Mail size={20} />
                  E-posta ile Başvur
                </a>

                <a
                  href="https://protakip.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3.5 px-6 border border-brand-border text-brand-text rounded-xl font-medium hover:border-brand-primary hover:text-brand-primary transition text-base"
                >
                  <Globe size={20} />
                  ProTakip Hakkında Bilgi Alın
                  <ArrowRight size={16} />
                </a>
              </div>

              <p className="text-xs text-brand-text-muted mt-6">
                Başvurunuz ücretsizdir. Herhangi bir taahhüt gerektirmez.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
