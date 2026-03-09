import type { Metadata } from 'next';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { FirsatForm } from '@/components/firsatlar/FirsatForm';

export const metadata: Metadata = {
  title: 'Fırsat Bildirimleri — Bölgenizdeki En İyi Halı Yıkama Kampanyaları',
  description:
    'Halı yıkama, koltuk yıkama ve ev temizliği fırsatlarını kaçırmayın. Tercih ettiğiniz aralıklarla bölgenizdeki en iyi kampanyaları SMS veya WhatsApp ile alın.',
};

export default function FirsatlarPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-56px)] bg-brand-bg">
        <div className="max-w-2xl mx-auto px-4 py-12 lg:py-20">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-4xl mb-4 block">🔔</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text mb-3">
              Fırsat Bildirimleri
            </h1>
            <p className="text-brand-text-muted text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
              Onlarca firmadan ayrı ayrı mesaj almak yerine, sizin belirlediğiniz
              sıklıkta bölgenizdeki en iyi fırsatları size iletelim.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                emoji: '🎯',
                title: 'Kişiselleştirilmiş',
                desc: 'Sadece bölgenizdeki firmalardan, sizin ilgilendiğiniz hizmetler',
              },
              {
                emoji: '⏰',
                title: 'Siz Belirleyin',
                desc: 'Ayda bir, 3 ayda bir veya yılda iki — tercih sizin',
              },
              {
                emoji: '🚫',
                title: 'Spam Yok',
                desc: 'Tek kaynaktan, sadece gerçek fırsatlar. İstediğiniz an iptal',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-brand-surface rounded-brand border border-brand-border p-4 text-center"
              >
                <span className="text-2xl block mb-2">{item.emoji}</span>
                <h3 className="text-sm font-semibold text-brand-text mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <FirsatForm />

          {/* Trust note */}
          <p className="text-xs text-brand-text-muted text-center mt-6 max-w-md mx-auto">
            Bilgileriniz yalnızca fırsat bildirimi amacıyla kullanılır ve üçüncü
            taraflarla paylaşılmaz. Dilediğiniz zaman tek tıkla aboneliğinizi
            iptal edebilirsiniz.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
