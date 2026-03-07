import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { API_URL, BRAND_CODE, CITIES } from '@/lib/constants';
import { getBrandConfig } from '@/brands';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { CompanyCard } from '@/components/company/CompanyCard';
import { MapPin, Building2, CheckCircle, Sparkles, Shield, Clock, Star } from 'lucide-react';
import { slugify, getCategoryDisplayName } from '@/lib/utils';
import type { CompanyListDto, PaginatedResponse, CityDto } from '@/lib/api/types';

const brand = getBrandConfig();

const IS_ALL_TURKEY = 'turkiye';

// SEO içerik — kategori bazlı
const categoryContent: Record<string, { intro: string; benefits: string[]; faq: { q: string; a: string }[] }> = {
  'hali-yikama': {
    intro: 'Halı yıkama, evinizin hijyeni ve sağlığınız için düzenli olarak yapılması gereken en önemli temizlik hizmetlerinden biridir. Profesyonel halı yıkama firmaları, özel ekipman ve çevre dostu deterjanlarla halılarınızı derinlemesine temizler, akarları ve bakterileri yok eder. Halı Yıkamacılar platformu sayesinde şehrinizdeki en güvenilir halı yıkama firmalarını kolayca bulabilir, fiyatları karşılaştırabilir ve tek tıkla sipariş verebilirsiniz.',
    benefits: [
      'Profesyonel ekipmanlarla derin temizlik',
      'Çevre dostu ve hijyenik yıkama',
      'Ücretsiz adresinizden alma ve teslim',
      'Sigortalı ve garantili hizmet',
      'Online sipariş ve takip kolaylığı',
      'Gerçek müşteri yorumlarıyla güvenli seçim',
    ],
    faq: [
      { q: 'Halı yıkama ne kadar sürer?', a: 'Profesyonel halı yıkama genellikle 2-3 gün sürer. Firma halınızı adresinizden alır, fabrikada yıkar, kurutur ve tertemiz teslim eder.' },
      { q: 'Halı yıkama fiyatları nasıl belirlenir?', a: 'Fiyatlar genellikle metrekare üzerinden hesaplanır. Halının türü (makine halısı, el halısı, yün, ipek) ve boyutuna göre değişir.' },
      { q: 'Halılarımı ne sıklıkla yıkatmalıyım?', a: 'Uzmanlar yılda en az 2 kez profesyonel halı yıkatmayı önermektedir. Alerjisi olan kişiler ve evcil hayvan sahipleri için 3-4 ayda bir önerilir.' },
      { q: 'Halı yıkama güvenli mi?', a: 'Platformumuzdaki tüm firmalar doğrulanmış ve puanlanmıştır. Gerçek müşteri yorumlarını okuyarak güvenle seçim yapabilirsiniz.' },
    ],
  },
  'koltuk-yikama': {
    intro: 'Koltuk yıkama, evinizin ve ofisinizin en çok kullanılan mobilyalarını hijyenik ve tertemiz tutmanın en etkili yoludur. Profesyonel koltuk yıkama firmaları, özel ekstraksiyon makineleri ve kumaş tipine uygun temizlik solüsyonlarıyla koltuklarınızın derinliklerine işlemiş kiri, lekeleri, toz akarlarını ve alerjenleri tamamen temizler. Yerinde uygulanan koltuk yıkama hizmeti sayesinde mobilyalarınızı taşıma zahmetine girmeden, evinizde konforlu bir şekilde temizletebilirsiniz. Düzenli koltuk temizliği, mobilyalarınızın ömrünü uzatır, renk canlılığını korur ve evinizde sağlıklı bir yaşam alanı oluşturur.',
    benefits: [
      'Yerinde profesyonel koltuk yıkama hizmeti',
      'İnatçı leke çıkarma ve koku giderme',
      'Anti-bakteriyel ve anti-alerjik uygulama',
      'Kumaş, deri ve süet tipine özel temizlik',
      'Hızlı kuruma teknolojisi — aynı gün kullanım',
      'Sigortalı hizmet ve müşteri memnuniyeti garantisi',
    ],
    faq: [
      { q: 'Koltuk yıkama yerinde mi yapılır?', a: 'Evet, koltuk yıkama genellikle evinizde veya ofisinizde yerinde yapılır. Profesyonel ekipmanlarla 2-4 saat içinde tamamlanır. Mobilyalarınızı taşımanıza gerek kalmaz.' },
      { q: 'Koltuk yıkama sonrası ne kadar sürede kurur?', a: 'Modern ekstraksiyon makineleriyle yıkanan koltuklar genellikle 4-6 saat içinde kurur. İyi havalandırma ile bu süre 2-3 saate kadar düşebilir.' },
      { q: 'Deri koltuklar da yıkanabilir mi?', a: 'Evet, profesyonel firmalar deri koltuklara özel pH dengeli temizlik solüsyonları kullanır. Deri bakım ve nemlendirme uygulamasıyla koltuklarınız yenilenmiş gibi görünür.' },
      { q: 'Koltuk yıkama fiyatları neye göre belirlenir?', a: 'Fiyatlar koltuk tipine (tekli, ikili, üçlü, köşe takımı), kumaş türüne ve kirlilik derecesine göre değişir. Platformumuzda firmalar arasında kolayca fiyat karşılaştırması yapabilirsiniz.' },
    ],
  },
  'yorgan-yikama': {
    intro: 'Yorgan ve battaniye yıkama, uyku sağlığınız ve hijyeniniz için büyük önem taşıyan bir temizlik hizmetidir. Her gece saatlerce temas ettiğiniz yorganlar ve battaniyeler, zamanla ter, toz akarları, ölü deri hücreleri ve bakteriler biriktirir. Ev tipi çamaşır makineleri yorganları yeterince temizleyemez ve kurutamaz — bu da küf ve kötü koku oluşumuna neden olur. Profesyonel yorgan yıkama firmaları, endüstriyel makineler ve özel deterjanlarla yorganlarınızı derinlemesine yıkar, yüksek sıcaklıkta kurutur ve hijyenik ambalajla teslim eder. Alerjik bünyeli kişiler, çocuklu aileler ve sağlıklı uyku arayanlar için düzenli yorgan yıkatma şarttır.',
    benefits: [
      'Endüstriyel makinelerle derin ve hijyenik yıkama',
      'Yüksek sıcaklıkta kurutma — küf ve akar yok etme',
      'Yün, pamuk, elyaf ve kuş tüyü yorganlara özel işlem',
      'Ücretsiz adresinizden alma ve vakumlu ambalajla teslim',
      'Anti-alerjik ve anti-bakteriyel uygulama',
      'Online sipariş ve şeffaf süreç takibi',
    ],
    faq: [
      { q: 'Yorgan yıkama ne kadar sürer?', a: 'Profesyonel yorgan yıkama genellikle 2-4 gün sürer. Firma yorganınızı adresinizden alır, endüstriyel makinede yıkar, tam kurutur ve hijyenik ambalajla teslim eder.' },
      { q: 'Kuş tüyü yorgan yıkanabilir mi?', a: 'Evet, profesyonel firmalar kuş tüyü yorganlara özel düşük sıcaklıkta, nazik programlarla yıkama yapar. Tüylerin kabarıklığını ve ısı yalıtım özelliğini koruyarak yıkar ve kurutur.' },
      { q: 'Yorganlarımı ne sıklıkla yıkatmalıyım?', a: 'Uzmanlar yorganların yılda en az 2 kez profesyonel olarak yıkatılmasını önerir. Alerjik bünyeli kişiler ve astım hastaları için 3-4 ayda bir yıkatma önerilir.' },
      { q: 'Battaniye ve pike de yıkatılabilir mi?', a: 'Evet, profesyonel firmalar yorgan yanı sıra battaniye, pike, yatak örtüsü, uyku tulumu ve bebek yorganı gibi tüm yatak tekstillerini de yıkar.' },
    ],
  },
  'perde-yikama': {
    intro: 'Perde yıkama, evinizin hem görsel estetiğini hem de iç hava kalitesini doğrudan etkileyen önemli bir temizlik hizmetidir. Pencerelerinizde sürekli asılı duran perdeler, zamanla toz, polen, sigara dumanı ve mutfak yağını emerek kirlenirler — ancak kirlilikleri çoğu zaman gözle fark edilmez. Ev tipi yıkama, ince tül perdelerin yırtılmasına, ağır kadife perdelerin deforme olmasına ve renklerin solmasına neden olabilir. Profesyonel perde yıkama firmaları, kumaş tipine göre özel yıkama programları uygular, perdeleri ütüleyerek ve ölçülerine uygun katlayarak teslim eder. İsteğe bağlı söküm ve takma hizmeti sunan firmalar da mevcuttur.',
    benefits: [
      'Kumaş tipine özel hassas yıkama programları',
      'Tül, kadife, brode, fon perde — her türe uygun işlem',
      'Profesyonel ütüleme ve ölçüsüne uygun katlama',
      'İsteğe bağlı söküm ve asma hizmeti',
      'Renk koruma ve kumaş yumuşatma uygulaması',
      'Ücretsiz adresinizden alma ve teslim',
    ],
    faq: [
      { q: 'Perde yıkama ne kadar sürer?', a: 'Profesyonel perde yıkama genellikle 2-3 gün sürer. Söküm ve asma hizmeti eklenirse 1 gün daha uzayabilir. Firmalar genellikle aynı gün alma ve ertesi gün teslim seçeneği de sunar.' },
      { q: 'Tül perdeler profesyonel yıkamada zarar görür mü?', a: 'Hayır, profesyonel firmalar ince tül perdelere özel düşük sıcaklıkta ve hassas programlarla yıkama yapar. Kumaşın yapısını koruyarak bembeyaz ve tertemiz teslim eder.' },
      { q: 'Perde söküm ve asma hizmeti var mı?', a: 'Birçok profesyonel firma perde söküm ve asma hizmeti sunar. Özellikle yüksek tavan ve büyük pencerelerde bu hizmet büyük kolaylık sağlar. Platformumuzda bu hizmeti sunan firmaları kolayca filtreleyebilirsiniz.' },
      { q: 'Perdelerimi ne sıklıkla yıkatmalıyım?', a: 'Tül perdeler 2-3 ayda bir, fon perdeler 6 ayda bir yıkatılmalıdır. Sigara içilen veya yoğun trafikli caddeye bakan evlerde daha sık yıkama önerilir.' },
    ],
  },
  'yatak-yikama': {
    intro: 'Yatak yıkama ve yatak temizleme, uyku hijyeniniz ve sağlığınız için en kritik temizlik hizmetlerinden biridir. Her gece ortalama 8 saat geçirdiğiniz yatağınız, zamanla ter, toz akarları, ölü deri hücreleri, bakteri ve mantar biriktiren devasa bir sünger görevi görür. Normal ev temizliği bu birikimi yok edemez — profesyonel yatak yıkama firmaları, UV sterilizasyon, buhar temizleme ve derin vakumlama teknolojileriyle yatağınızı derinlemesine temizler ve dezenfekte eder. Özellikle alerjik bünyeli kişiler, astım hastaları, çocuklu aileler ve evcil hayvan sahipleri için düzenli profesyonel yatak temizliği hayati önem taşır.',
    benefits: [
      'UV ışın sterilizasyonu ile akar ve bakteri yok etme',
      'Derin buhar temizleme teknolojisi',
      'Leke çıkarma ve koku giderme uygulaması',
      'Anti-alerjik ve anti-bakteriyel koruma',
      'Yerinde hizmet — yatağınızı taşımanıza gerek yok',
      'Aynı gün hizmet ve hızlı kuruma',
    ],
    faq: [
      { q: 'Yatak yıkama yerinde mi yapılır?', a: 'Evet, profesyonel yatak temizleme genellikle evinizde yerinde yapılır. UV sterilizasyon, buhar temizleme ve derin vakumlama işlemleri 1-2 saat içinde tamamlanır. Yatağınızı taşımanıza gerek kalmaz.' },
      { q: 'Yatak yıkama sonrası ne kadar sürede kullanılabilir?', a: 'Buhar temizleme sonrası yatak genellikle 3-4 saat içinde kurur ve kullanıma hazır olur. UV sterilizasyon uygulamasında ise işlem biter bitmez kullanılabilir.' },
      { q: 'Yatak akarlarını profesyonel temizlik gerçekten yok eder mi?', a: 'Evet, profesyonel UV sterilizasyon ve yüksek sıcaklıkta buhar temizleme, yatak akarlarının %99.9\'unu yok eder. Düzenli temizlik alerjik reaksiyonları önemli ölçüde azaltır.' },
      { q: 'Yatağımı ne sıklıkla profesyonel olarak temizletmeliyim?', a: 'Uzmanlar yılda en az 2 kez profesyonel yatak temizliği önerir. Alerjisi olan kişiler, bebek ve küçük çocuklu aileler için 3-4 ayda bir temizlik ideal sıklıktır.' },
    ],
  },
};

const defaultContent = {
  intro: 'Profesyonel temizlik hizmeti arayanlar için doğru adrestesiniz. Platformumuzda şehrinizdeki en güvenilir firmaları bulabilir, fiyatları karşılaştırabilir ve kolayca sipariş verebilirsiniz.',
  benefits: [
    'Doğrulanmış ve güvenilir firmalar',
    'Gerçek müşteri yorumları',
    'Kolay online sipariş',
    'Ücretsiz fiyat karşılaştırma',
  ],
  faq: [],
};

async function getCities(): Promise<CityDto[]> {
  try {
    const res = await fetch(`${API_URL}/api/mp/cities`, {
      headers: { 'X-Marketplace-Brand': BRAND_CODE },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // API string[] veya CityDto[] dönebilir — normalize et
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
      return (data as string[]).map((city) => ({ city, companyCount: 0 }));
    }
    return data;
  } catch {
    return [];
  }
}

function findCityBySlug(cities: CityDto[], slug: string): CityDto | undefined {
  return cities.find((c) => slugify(c.city) === slug);
}

async function getCompaniesByCity(city: string | null): Promise<PaginatedResponse<CompanyListDto>> {
  try {
    const cityParam = city ? `&city=${encodeURIComponent(city)}` : '';
    const res = await fetch(
      `${API_URL}/api/mp/companies?sortBy=rating&pageSize=50${cityParam}`,
      {
        headers: { 'X-Marketplace-Brand': BRAND_CODE },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return { items: [], totalCount: 0, page: 1, pageSize: 50 };
    return res.json();
  } catch {
    return { items: [], totalCount: 0, page: 1, pageSize: 50 };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}): Promise<Metadata> {
  const { city: citySlug, category } = await params;
  const isAllTurkey = citySlug === IS_ALL_TURKEY;
  const categoryDisplay = getCategoryDisplayName(category);

  if (isAllTurkey) {
    const title = `${categoryDisplay} Firmaları — Türkiye Geneli | ${brand.name}`;
    const description = `Türkiye genelinde en iyi ${categoryDisplay.toLowerCase()} firmaları. 81 ilde fiyat karşılaştırma, gerçek müşteri yorumları. Hemen sipariş verin.`;
    return {
      title,
      description,
      alternates: { canonical: `/${citySlug}/${category}` },
      openGraph: { title, description, url: `https://${brand.domain}/${citySlug}/${category}` },
    };
  }

  const cities = await getCities();
  const cityData = findCityBySlug(cities, citySlug);
  if (!cityData) return { title: 'Sayfa Bulunamadı' };

  const title = `${cityData.city} ${categoryDisplay} Firmaları | ${brand.name}`;
  const description = `${cityData.city} şehrinde en iyi ${categoryDisplay.toLowerCase()} firmaları. ${cityData.companyCount} firma, fiyat karşılaştırma, gerçek müşteri yorumları. Hemen sipariş verin.`;

  return {
    title,
    description,
    alternates: { canonical: `/${citySlug}/${category}` },
    openGraph: { title, description, url: `https://${brand.domain}/${citySlug}/${category}` },
  };
}

export default async function CityCategoryPage({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}) {
  const { city: citySlug, category } = await params;
  const isAllTurkey = citySlug === IS_ALL_TURKEY;
  const categoryDisplay = getCategoryDisplayName(category);

  // ── Tüm Türkiye: SEO içerik + şehir butonları ──
  if (isAllTurkey) {
    const content = categoryContent[category] || defaultContent;
    const categorySlug = category; // e.g. "hali-yikama"

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
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                Türkiye&apos;nin En İyi<br />{categoryDisplay} Firmaları
              </h1>
              <p className="mt-5 text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                81 ilde güvenilir {categoryDisplay.toLowerCase()} firmalarını karşılaştırın,
                gerçek yorumları okuyun, kolayca sipariş verin ve siparişinizin her aşamasını
                şeffaf ve detaylı bir şekilde takip ederek halılarınız teslim edilene kadar
                olan süreçte mükemmel bir deneyim yaşayın.
              </p>

              {/* Güven sayaçları */}
              <div className="mt-10 flex flex-wrap justify-center gap-8 lg:gap-12">
                {[
                  { icon: Shield, value: '500+', label: 'Doğrulanmış Firma' },
                  { icon: Star, value: '4.8', label: 'Ortalama Puan' },
                  { icon: Clock, value: '2 Saat', label: 'Ortalama Dönüş' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <s.icon size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-white">{s.value}</div>
                      <div className="text-xs text-white/60">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SEO İçerik */}
          <section className="py-14">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none text-brand-text">
                <h2 className="text-2xl font-heading font-bold text-brand-text mb-4">
                  Profesyonel {categoryDisplay} Hizmeti
                </h2>
                <p className="text-brand-text-muted leading-relaxed">
                  {content.intro}
                </p>
              </div>

              {/* Avantajlar */}
              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {content.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3 p-4 bg-brand-surface rounded-xl border border-brand-border/50">
                    <CheckCircle size={20} className="text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-brand-text font-medium">{b}</span>
                  </div>
                ))}
              </div>

              {/* SSS */}
              {content.faq.length > 0 && (
                <div className="mt-14">
                  <h2 className="text-2xl font-heading font-bold text-brand-text mb-6">
                    Sıkça Sorulan Sorular
                  </h2>
                  <div className="space-y-4">
                    {content.faq.map((item) => (
                      <details
                        key={item.q}
                        className="group bg-brand-surface rounded-xl border border-brand-border/50 overflow-hidden"
                      >
                        <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-brand-text hover:text-brand-primary transition-colors">
                          {item.q}
                          <Sparkles size={16} className="text-brand-text-muted group-open:text-brand-primary transition-colors shrink-0 ml-2" />
                        </summary>
                        <div className="px-5 pb-5 text-brand-text-muted leading-relaxed">
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Şehir Butonları */}
          <section className="py-14 bg-brand-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-text">
                  Şehrinizi Seçin
                </h2>
                <p className="mt-2 text-brand-text-muted">
                  81 ilde {categoryDisplay.toLowerCase()} firmaları
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {CITIES.map((city) => (
                  <a
                    key={city}
                    href={`/${slugify(city)}-${categorySlug}-firmalari`}
                    className="px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm font-medium text-brand-text hover:border-brand-primary hover:text-brand-primary hover:shadow-md transition-all duration-200"
                  >
                    {city} {categoryDisplay}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: content.faq.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }),
            }}
          />
        </main>
        <Footer />
      </>
    );
  }

  // ── Belirli şehir: firma listesi ──
  const cities = await getCities();
  const cityData = findCityBySlug(cities, citySlug);
  if (!cityData) notFound();
  const cityName = cityData.city;
  const data = await getCompaniesByCity(cityName);
  const heading = `${cityName} ${categoryDisplay}`;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-bg">
        <section
          className="relative py-14 lg:py-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}15 0%, ${brand.colors.primaryLight} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-brand-text-muted mb-6">
              <a href="/" className="hover:text-brand-primary transition-colors">Anasayfa</a>
              <span>/</span>
              <a href={`/turkiye/${category}`} className="hover:text-brand-primary transition-colors">
                {categoryDisplay}
              </a>
              <span>/</span>
              <span className="text-brand-text font-medium">{cityName}</span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <MapPin size={24} className="text-brand-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-brand-text">
                  {heading} Firmaları
                </h1>
                <p className="text-brand-text-muted mt-1">
                  {data.totalCount} firma bulundu
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((company, i) => (
                  <CompanyCard key={company.companyId} company={company} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Building2 size={48} className="mx-auto text-brand-text-muted/30 mb-4" />
                <h3 className="text-lg font-medium text-brand-text">
                  {cityName} şehrinde henüz {categoryDisplay.toLowerCase()} firması yok
                </h3>
                <p className="text-brand-text-muted mt-2 max-w-md mx-auto">
                  Yakında firmalar eklenecek. Diğer şehirlerdeki firmalarımızı inceleyebilirsiniz.
                </p>
                <a
                  href={`/turkiye/${category}`}
                  className="inline-block mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-brand font-medium hover:opacity-90 transition"
                >
                  Tüm Şehirleri Gör
                </a>
              </div>
            )}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${heading} Firmaları`,
              numberOfItems: data.items.length,
              itemListElement: data.items.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'LocalBusiness',
                  name: c.companyName,
                  address: { '@type': 'PostalAddress', addressLocality: c.city || cityName, addressCountry: 'TR' },
                  ...(c.averageRating > 0 && {
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: c.averageRating.toFixed(1), reviewCount: c.totalReviewCount },
                  }),
                },
              })),
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
