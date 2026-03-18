/* ───── Şehir Bazlı Ek Rehberler — 5 Tür × 81 İl = 405 Makale ───── */

import type { GuideArticle } from './guides';
import { cityData, type CityMeta } from './city-data';

// ─── Yardımcı Fonksiyonlar ───

function districtLinks(c: CityMeta, tier: 'premium' | 'mid' | 'budget', category: string): string {
  return c.districts[tier]
    .map(d => {
      const ds = d.toLowerCase()
        .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
        .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
        .replace(/İ/g,'i').replace(/\s+/g,'-');
      return `[${d} ${category}](/${c.citySlug}-${ds}-hali-yikama-firmalari)`;
    })
    .join(', ');
}

function allDistrictLinks(c: CityMeta, category: string): string {
  const all = [...c.districts.premium, ...c.districts.mid, ...c.districts.budget];
  return all.slice(0, 8)
    .map(d => {
      const ds = d.toLowerCase()
        .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
        .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
        .replace(/İ/g,'i').replace(/\s+/g,'-');
      return `[${d}](/${c.citySlug}-${ds}-hali-yikama-firmalari)`;
    })
    .join(', ');
}

function neighborLinks(c: CityMeta): string {
  return c.neighbors.slice(0, 4)
    .map(n => {
      const meta = cityData.find(x => x.citySlug === n);
      return meta ? `[${meta.city}](/${n}-hali-yikama-firmalari)` : '';
    })
    .filter(Boolean)
    .join(', ');
}

function climateDesc(c: CityMeta): string {
  switch (c.climate) {
    case 'mediterranean': return 'Akdeniz ikliminin hâkim olduğu';
    case 'blacksea': return 'Karadeniz ikliminin nemli ve yağışlı havasının etkisindeki';
    case 'continental': return 'Karasal iklimin sert kışları ve sıcak yazlarıyla bilinen';
    case 'semiarid': return 'Yarı kurak iklimin hâkim olduğu, yazları sıcak ve kuru';
    case 'marmara': return 'Marmara ikliminin ılıman ve nemli yapısına sahip';
    case 'transitional': return 'Geçiş ikliminin etkisinde, mevsimler arası belirgin farkların yaşandığı';
  }
}

function winterWarning(c: CityMeta): string {
  if (!c.winterRisk) return '';
  if (c.climate === 'continental' && c.avgPrice < 60)
    return `\n\n**Kış Uyarısı:** ${c.city}'de kış aylarında sıcaklık -20°C'nin altına düşebilir. Kasım-Mart arası sadece kapalı kurutma tesisli firmalarla çalışın. Açık havada kurutma yapan firmalardan kışın hizmet almak küf ve donma riskine yol açar.`;
  if (c.climate === 'blacksea')
    return `\n\n**Nem Uyarısı:** ${c.city}'de yılın büyük bölümünde nem oranı %70-85 arasındadır. Kapalı kurutma tesisi olan firmayı tercih edin — aksi halde kurutma süresi 3-4 güne uzayabilir ve küf riski artar.`;
  if (c.winterRisk)
    return `\n\n**Kış Ayları:** ${c.city}'de kış aylarında dış kurutma yapılamaz. Kapalı kurutma tesisli firma tercih edin.`;
  return '';
}

function popContext(c: CityMeta): string {
  switch (c.popTier) {
    case 'mega': return `${c.city}, Türkiye'nin en büyük pazarlarından biri olarak geniş firma seçeneği sunuyor`;
    case 'large': return `${c.city}, büyükşehir avantajıyla rekabetçi fiyatlar ve çeşitli firma seçenekleri sunuyor`;
    case 'medium': return `${c.city}'de yeterli sayıda firma mevcut ve rekabet sayesinde fiyatlar makul seviyelerde`;
    case 'small': return `${c.city}'de firma sayısı sınırlı olsa da mevcut firmalar kaliteli hizmet sunuyor`;
    case 'tiny': return `${c.city}'de firma sayısı az olduğundan erken sipariş vermek ve fiyat araştırması yapmak önemli`;
  }
}

// ─── 1. KOLTUK YIKAMA REHBERLERİ ───

function generateKoltukGuide(c: CityMeta): GuideArticle {
  const koltukMin = Math.round(c.koltukAvg * 0.6);
  const koltukMax = Math.round(c.koltukAvg * 1.8);
  const berjerAvg = Math.round(c.koltukAvg * 0.5);
  const yatakKoltukAvg = Math.round(c.koltukAvg * 1.3);
  const arabaKoltukAvg = Math.round(c.koltukAvg * 0.8);

  return {
    slug: `${c.citySlug}-koltuk-yikama`,
    city: c.city,
    citySlug: c.citySlug,
    title: `${c.city} Koltuk Yıkama Rehberi — Fiyatlar, Firmalar ve İpuçları`,
    metaTitle: `${c.city} Koltuk Yıkama Fiyatları 2026 | En İyi Firmalar ve İpuçları`,
    metaDescription: `${c.city} koltuk yıkama fiyatları 2026 güncel liste. ${c.districts.premium[0]} ve ${c.districts.mid[0]} ilçelerinde en iyi koltuk yıkama firmaları, fiyat karşılaştırması.`,
    datePublished: '2026-03-19',
    dateModified: '2026-03-19',
    category: 'koltuk-yikama',
    readingTime: 7,
    heroEmoji: '🛋️',
    intro: `${c.city}'de koltuk yıkama fiyatları koltuğun türüne, boyutuna ve kumaş cinsine göre ${koltukMin}-${koltukMax} TL arasında değişiyor. ${popContext(c)}. Bu rehberde ${c.city} koltuk yıkama fiyatlarını detaylı karşılaştırıyor, doğru firma seçmenize yardımcı oluyoruz.`,
    sections: [
      {
        heading: `${c.city} Koltuk Yıkama Fiyatları 2026`,
        content: `${c.city}'de koltuk yıkama fiyatları koltuğun türüne göre belirgin farklılıklar gösterir:

**2'li Koltuk Takımı:** Ortalama ${Math.round(c.koltukAvg * 0.7)} TL (aralık: ${Math.round(koltukMin * 0.7)}-${Math.round(koltukMax * 0.7)} TL)
**3'lü Koltuk Takımı:** Ortalama ${c.koltukAvg} TL (aralık: ${koltukMin}-${koltukMax} TL)
**L Koltuk:** Ortalama ${Math.round(c.koltukAvg * 1.2)} TL (aralık: ${Math.round(koltukMin * 1.2)}-${Math.round(koltukMax * 1.2)} TL)
**Berjer / Tekli Koltuk:** Ortalama ${berjerAvg} TL
**Yatak Olabilen Koltuk:** Ortalama ${yatakKoltukAvg} TL (mekanizma nedeniyle ek ücret)
**Araç Koltuğu (Komple İç):** Ortalama ${arabaKoltukAvg} TL

${c.avgPrice > 100
  ? `**Not:** ${c.city} fiyatları Türkiye ortalamasının üzerindedir. Bunun nedeni yüksek işletme maliyetleri ve yaşam standartlarıdır.`
  : c.avgPrice < 60
    ? `**Avantaj:** ${c.city} fiyatları Türkiye ortalamasının oldukça altındadır. Uygun fiyata kaliteli hizmet alabilirsiniz.`
    : `${c.city} fiyatları Türkiye ortalamasına yakın seviyelerdedir.`
}`,
      },
      {
        heading: `${c.city} Koltuk Yıkama — İlçe Bazlı Firmalar`,
        content: `${c.city}'de koltuk yıkama hizmeti veren firmalar ilçelere göre dağılım gösterir:

**Yüksek Fiyat Bölgeleri:**
${districtLinks(c, 'premium', 'koltuk yıkama')}
Bu ilçelerde firmalar genellikle premium kumaş temizliği ve leke çıkarma konusunda uzmanlaşmıştır.

**Orta Fiyat Bölgeleri:**
${districtLinks(c, 'mid', 'koltuk yıkama')}
Fiyat/kalite oranı en dengeli bölgeler. Rekabet yoğun olduğundan uygun teklifler alabilirsiniz.

**Uygun Fiyat Bölgeleri:**
${districtLinks(c, 'budget', 'koltuk yıkama')}
İşletme maliyetleri düşük, fiyatlar daha uygun.${c.popTier === 'tiny' || c.popTier === 'small'
  ? `\n\n**Not:** ${c.city}'de koltuk yıkama hizmeti veren firma sayısı sınırlıdır. Halı yıkama firmaları genellikle koltuk yıkama hizmeti de sunmaktadır — [${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) arasından koltuk yıkama hizmeti verenlerini filtreleyebilirsiniz.`
  : ''
}`,
      },
      {
        heading: `Koltuk Yıkama — ${c.city}'de Dikkat Edilmesi Gerekenler`,
        content: `**Kumaş Türü Söyleyin:** Kadife, süet, deri, kumaş ve microfiber koltuklar farklı yıkama tekniği gerektirir. Firmaya koltuğunuzun kumaş türünü mutlaka belirtin — yanlış deterjan veya basınç kumaşa zarar verebilir.

**Yerinde Yıkama vs Fabrikaya Götürme:** Koltuk yıkama genellikle yerinde (evinizde) yapılır. Firma ekibi gelir, koltuklarınızı yerinde yıkar ve kuruması 4-8 saat sürer. Bazı firmalar kılıf çıkarılabilir koltukları fabrikada yıkar — bu daha hijyenik ama 1-2 gün koltuğunuz olmaz.

**Leke Bildirin:** Mürekkep, boya, kan veya evcil hayvan idrarı gibi inatçı lekeler özel işlem gerektirir. Önceden bildirirseniz firma hazırlıklı gelir.

${c.humid
  ? `**${c.city} Nem Faktörü:** ${c.city}'nin nemli havası nedeniyle yerinde yıkanan koltukların kuruması uzayabilir. Yıkama sonrası odayı iyi havalandırın veya fan kullanın. Mümkünse kuru mevsimde (${c.bestMonths}) yıkatın.`
  : c.climate === 'continental'
    ? `**Kış Döneminde:** ${c.city}'de kış aylarında yerinde yıkanan koltuklar soğuk nedeniyle çok yavaş kurur. Firma yıkama sonrası fan veya ısıtıcı bırakmazsa küf kokusu oluşabilir. Kış aylarında yerinde koltuk yıkama talep etmeden önce firmaya kurutma yöntemini sorun.`
    : `**Kurutma:** Yıkama sonrası 4-8 saat içinde koltuk kurur. Pencere açık bırakmak kurutmayı hızlandırır.`
}

[${c.city} halı yıkama firmalarını inceleyin](/${c.citySlug}-hali-yikama-firmalari) — birçoğu aynı zamanda koltuk yıkama hizmeti de sunmaktadır.`,
      },
      {
        heading: `${c.city}'de Koltuk Yıkama Sıklığı ve Bakım`,
        content: `**Normal Kullanım:** Yılda 1-2 kez profesyonel koltuk yıkama yeterli. İlkbahar ve sonbahar ideal dönemler.

**Evcil Hayvan Olan Ev:** 3-4 ayda bir profesyonel temizlik önerilir. Tüy ve koku birikimi hızlıdır.

**Çocuklu Ev:** 4-6 ayda bir. Çocukların döktüğü gıda ve içecek lekeleri zamanla bakteri üretir.

**Alerji/Astım Hastası:** Her mevsim değişiminde (yılda 4 kez). Koltuk kumaşları toz akarı için ideal üreme ortamı sunar.

**Günlük Bakım İpuçları:**
- Haftada 1 kez elektrikli süpürge ile koltukları süpürün
- Taze lekelere hemen soğuk su + temiz bez ile müdahale edin (ovalamayın, bastırarak emin)
- [Halı yıkama](/rehber/hali-yikama-fiyatlari) ile birlikte koltuk yıkama yaptırmak toplu indirim sağlar
- Koltuk örtüsü kullanmak temizlik sıklığını azaltır ama örtü altında da kir birikir — sadece örtü yıkamak yetmez

**Maliyet Tasarrufu:** Koltuk yıkamayı [halı yıkama](/${c.citySlug}-hali-yikama-firmalari) + [yorgan yıkama](/rehber/${c.citySlug}-yorgan-yikama) ile birleştirirseniz toplam %10-15 indirim alabilirsiniz.`,
      },
    ],
    faq: [
      { q: `${c.city}'de koltuk yıkama kaç TL?`, a: `3'lü koltuk takımı ortalama ${c.koltukAvg} TL (aralık: ${koltukMin}-${koltukMax} TL). L koltuk ${Math.round(c.koltukAvg * 1.2)} TL, tekli berjer ${berjerAvg} TL civarındadır.` },
      { q: `Koltuk yıkama kaç saat sürer?`, a: `Yerinde yıkama 30-60 dakika sürer (koltuk sayısına göre). Kuruması 4-8 saat. Nemli bölgelerde (${c.humid ? c.city + ' dahil' : 'kıyı şehirleri'}) kurutma süresi uzayabilir.` },
      { q: `Deri koltuk yıkanır mı?`, a: `Evet, ama özel deri temizleme solüsyonu gerekir. Normal deterjan deriyi kurutur ve çatlatır. Firmaya mutlaka deri koltuk olduğunu söyleyin.` },
      { q: `${c.city}'de koltuk yıkama firması nasıl bulurum?`, a: `[${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından koltuk yıkama hizmeti de sunan firmaları bulabilirsiniz.` },
    ],
    relatedSlugs: [`${c.citySlug}-hali-yikama`, 'koltuk-yikama-fiyatlari', 'koltuk-bakim-onerileri', `${c.citySlug}-hali-yikama-fiyatlari`],
  };
}

// ─── 2. HALI YIKAMA FİYATLARI (ŞEHİR BAZLI DETAY) ───

function generateFiyatGuide(c: CityMeta): GuideArticle {
  const yunAvg = Math.round(c.avgPrice * 1.6);
  const ipekAvg = Math.round(c.avgPrice * 3);
  const shaggyAvg = Math.round(c.avgPrice * 1.15);
  const elHalisiAvg = Math.round(c.avgPrice * 2.8);

  const istanbulCompare = c.avgPrice < 140
    ? `İstanbul ortalamasına (140 TL/m²) kıyasla **%${Math.round((1 - c.avgPrice / 140) * 100)} daha uygun**.`
    : c.avgPrice === 140
      ? `İstanbul ortalamasıyla aynı seviyede.`
      : `İstanbul ortalamasının üzerinde.`;

  return {
    slug: `${c.citySlug}-hali-yikama-fiyatlari`,
    city: c.city,
    citySlug: c.citySlug,
    title: `${c.city} Halı Yıkama Fiyatları 2026 — Güncel m² Fiyat Listesi`,
    metaTitle: `${c.city} Halı Yıkama Fiyatları 2026 | Güncel m² Fiyat Listesi`,
    metaDescription: `${c.city} halı yıkama fiyatları 2026 güncel liste. Makine halısı, yün, ipek, shaggy fiyatları. ${c.districts.premium[0]}, ${c.districts.mid[0]} ilçelerinde m² fiyat karşılaştırması.`,
    datePublished: '2026-03-19',
    dateModified: '2026-03-19',
    category: 'hali-yikama',
    readingTime: 8,
    heroEmoji: '💰',
    intro: `${c.city}'de halı yıkama fiyatları halı türüne, ilçeye ve firmaya göre ${c.priceMin}-${c.priceMax} TL/m² arasında değişiyor. ${istanbulCompare} Bu rehberde ${c.city} halı yıkama fiyatlarını tür bazlı detaylı karşılaştırıyoruz.`,
    sections: [
      {
        heading: `${c.city} Halı Yıkama Fiyatları — Tür Bazlı Liste`,
        content: `${c.city}'de 2026 yılı güncel halı yıkama fiyatları:

**Makine Halısı:** Ortalama ${c.avgPrice} TL/m² (aralık: ${c.priceMin}-${c.priceMax} TL)
En yaygın halı türü. ${istanbulCompare}

**Yün Halı:** Ortalama ${yunAvg} TL/m² (aralık: ${Math.round(yunAvg * 0.65)}-${Math.round(yunAvg * 2.2)} TL)
Özel deterjan ve nazik program gerektirir. Makine halısının yaklaşık 1.6 katı.

**İpek Halı:** Ortalama ${ipekAvg} TL/m² (aralık: ${Math.round(ipekAvg * 0.5)}-${Math.round(ipekAvg * 3)} TL)
En geniş fiyat aralığına sahip halı türü. Sadece uzman firmalara emanet edin.

**Shaggy / Uzun Tüylü:** Ortalama ${shaggyAvg} TL/m² (aralık: ${Math.round(shaggyAvg * 0.7)}-${Math.round(shaggyAvg * 1.8)} TL)
Makine halısından %15-20 daha pahalı. Daha fazla su ve kurutma süresi gerektirir.

**El Dokuma Halı:** Ortalama ${elHalisiAvg} TL/m² (aralık: ${Math.round(elHalisiAvg * 0.4)}-${Math.round(elHalisiAvg * 4)} TL)
Değer ve antiklik durumuna göre fiyat büyük farklılık gösterir.

${c.specialties.some(s => s.includes('halı') || s.includes('kilim'))
  ? `**${c.city}'ye Özel:** ${c.city} yöresel halı/kilim üretimi ile bilinir. Bu özel ürünler standart yıkama ile değil, el halısı uzmanı tarafından özenle yıkanmalıdır.`
  : ''
}`,
      },
      {
        heading: `${c.city} Halı Yıkama Fiyatları — İlçe Bazlı Karşılaştırma`,
        content: `${c.city} ortalaması makine halısı için ${c.avgPrice} TL/m²'dir. İlçeler arası fiyat farkları:

**Yüksek Fiyat Bölgeleri (${Math.round(c.avgPrice * 1.15)}-${Math.round(c.avgPrice * 1.5)} TL/m²):**
${districtLinks(c, 'premium', 'halı yıkama')}
${c.popTier === 'mega' || c.popTier === 'large'
  ? 'Kira ve işçilik maliyetleri yüksek, firma sayısı az ama kalite üst düzey.'
  : 'Gelir düzeyi yüksek bölgeler, firmalar genellikle premium hizmet sunuyor.'
}

**Orta Fiyat Bölgeleri (${Math.round(c.avgPrice * 0.85)}-${Math.round(c.avgPrice * 1.15)} TL/m²):**
${districtLinks(c, 'mid', 'halı yıkama')}
${c.popTier === 'mega' || c.popTier === 'large'
  ? 'Rekabet yoğun, fiyat/kalite oranı en iyi bölgeler.'
  : 'Firma yoğunluğu orta düzeyde, fiyatlar makul.'
}

**Uygun Fiyat Bölgeleri (${Math.round(c.avgPrice * 0.6)}-${Math.round(c.avgPrice * 0.85)} TL/m²):**
${districtLinks(c, 'budget', 'halı yıkama')}
İşletme maliyetleri düşük. Fiyat avantajı var ama firma seçiminde dikkatli olun.

[${c.city} halı yıkama firmalarını karşılaştırın →](/${c.citySlug}-hali-yikama-firmalari)`,
      },
      {
        heading: `${c.city}'de Halı Yıkama Fiyatını Etkileyen Faktörler`,
        content: `${c.city}'de fiyatları belirleyen yerel faktörler:

**1. Ulaşım Maliyeti:** ${c.popTier === 'mega'
  ? `${c.city} trafiği ulaşım süresini ve maliyetini artırır. Kendi ilçenize yakın firma seçmek hem daha ucuz hem daha hızlıdır.`
  : c.popTier === 'large'
    ? `${c.city}'de ulaşım mesafeleri büyükşehir ortalamasında. İlçenize yakın firma seçerek ulaşım maliyetini düşürebilirsiniz.`
    : `${c.city}'de mesafeler kısa, ulaşım maliyeti büyükşehirlere göre düşük. Bu fiyatlara olumlu yansıyor.`
}

**2. Mevsim:** ${c.peakMonths} en yoğun dönem — fiyatlar %10-15 artabilir. ${c.bestMonths} döneminde daha uygun fiyat ve hızlı teslimat alabilirsiniz.

**3. Halı Boyutu:** 20 m² üzeri siparişlerde firmalar toplu indirim uygular. Tüm halılarınızı aynı anda verin.

**4. Ek Hizmetler:** [Koltuk yıkama](/rehber/${c.citySlug}-koltuk-yikama) veya [yorgan yıkama](/rehber/${c.citySlug}-yorgan-yikama) eklemek birim maliyeti düşürür — firma zaten geliyor, ulaşım maliyeti bölünür.

${c.industrialDust
  ? `**5. Endüstriyel Toz:** ${c.city}'de sanayi bölgesi yakınındaki halılar daha hızlı kirlenir. Bu bölgelerde yılda 2-3 kez yıkama gerekebilir — yıllık maliyeti düşürmek için firma ile yıllık anlaşma yapabilirsiniz.`
  : c.humid
    ? `**5. Nem Etkisi:** ${c.city}'nin nemli iklimi halıların daha sık kirlenmesine neden olur. Yılda en az 2 kez profesyonel yıkama önerilir.`
    : `**5. İklim Avantajı:** ${c.city}'nin ${c.climate === 'continental' ? 'kuru' : 'ılıman'} iklimi halı kurutma süresini kısaltır, bu da firmalar için maliyet avantajı yaratır.`
}

**Genel [halı yıkama fiyatları](/rehber/hali-yikama-fiyatlari)** rehberimizde Türkiye geneli karşılaştırma ve fiyatı etkileyen tüm faktörleri detaylı bulabilirsiniz.${winterWarning(c)}`,
      },
      {
        heading: `${c.city}'de En Uygun Halı Yıkama Fiyatını Bulma Yolları`,
        content: `**1. Karşılaştırma Yapın:** [${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından en az 3 firmanın fiyatını karşılaştırın. En ucuzu değil, en iyi fiyat/kalite oranını sunanı seçin.

**2. Yoğun Sezonu Kaçının:** ${c.peakMonths} yerine ${c.bestMonths} döneminde yıkatarak %10-15 tasarruf edin.

**3. Toplu Sipariş Verin:** Tüm halılarınızı + [yorgan-yastık](/rehber/${c.citySlug}-yorgan-yikama) + [perde](/rehber/${c.citySlug}-perde-yikama) birlikte verin. Firma ulaşım maliyetini tek seferde karşılar.

**4. Komşularla Organize Olun:** Apartmandaki 5-6 komşuyla aynı gün halı vererek toplu indirim alabilirsiniz. Detaylar için [apartman toplu halı yıkama rehberimize](/rehber/apartman-toplu-hali-yikama) göz atın.

**5. Fırsatları Takip Edin:** [Fırsat bildirimi](/firsatlar) alarak bölgenizdeki kampanyalardan haberdar olun.

${neighborLinks(c) ? `**6. Komşu Şehirleri Değerlendirin:** ${neighborLinks(c)} gibi komşu şehirlerdeki firmaları da karşılaştırabilirsiniz — sınır ilçelerde hizmet verebilirler.` : ''}`,
      },
    ],
    faq: [
      { q: `${c.city}'de halı yıkama m² fiyatı ne kadar?`, a: `Makine halısı ortalama ${c.avgPrice} TL/m² (aralık: ${c.priceMin}-${c.priceMax} TL). Yün halı ${yunAvg} TL/m², ipek halı ${ipekAvg} TL/m² civarındadır.` },
      { q: `${c.city}'de en ucuz halı yıkama nerede?`, a: `${c.districts.budget.slice(0, 3).join(', ')} gibi ilçelerde fiyatlar ${c.city} ortalamasının altındadır.` },
      { q: `${c.city} halı yıkama fiyatları İstanbul'a göre nasıl?`, a: istanbulCompare },
      { q: `${c.city}'de toplu halı yıkama indirimi var mı?`, a: `Evet, 20 m² üzeri siparişlerde ve 5+ komşuyla toplu siparişlerde %15-25 indirim alınabilir.` },
    ],
    relatedSlugs: [`${c.citySlug}-hali-yikama`, 'hali-yikama-fiyatlari', 'turkiye-hali-yikama-haritasi', `${c.citySlug}-koltuk-yikama`],
  };
}

// ─── 3. EN İYİ HALI YIKAMA FİRMASI SEÇİMİ ───

function generateFirmaGuide(c: CityMeta): GuideArticle {
  return {
    slug: `${c.citySlug}-en-iyi-hali-yikama`,
    city: c.city,
    citySlug: c.citySlug,
    title: `${c.city} En İyi Halı Yıkama Firmaları Nasıl Bulunur?`,
    metaTitle: `${c.city} En İyi Halı Yıkama Firmaları 2026 | Güvenilir Firma Rehberi`,
    metaDescription: `${c.city}'de güvenilir halı yıkama firması nasıl seçilir? Sahte firma tuzakları, ilçe bazlı firma karşılaştırması ve güvenilirlik kontrol listesi.`,
    datePublished: '2026-03-19',
    dateModified: '2026-03-19',
    category: 'hali-yikama',
    readingTime: 7,
    heroEmoji: '🏆',
    intro: `${c.city}'de halı yıkama firması seçerken doğru karar vermek, halınızın ömrünü uzatır ve para tasarrufu sağlar. ${c.popTier === 'mega' || c.popTier === 'large'
      ? `${c.city} gibi büyükşehirlerde yüzlerce firma arasından seçim yapmak kafa karıştırıcı olabilir.`
      : `${c.city}'de firma sayısı sınırlı olsa da doğru seçim yapmanız yine de kritik.`
    } Bu rehberde ${c.city}'ye özel firma seçim kriterlerini anlatıyoruz.`,
    sections: [
      {
        heading: `${c.city}'de Güvenilir Halı Yıkama Firması Nasıl Anlaşılır?`,
        content: `**1. Sabit İşyeri / Fabrika Adresi:**
${c.popTier === 'mega'
  ? `${c.city}'de kayıt dışı "çadır" halı yıkamacılar ciddi risk oluşturur. İşyeri adresi olmayan, WhatsApp üzerinden sipariş alan ve kasasız çalışan firmalardan uzak durun. Halınız kaybolabilir veya zarar görebilir.`
  : `${c.city}'de firma sayısı az olduğundan alternatif sınırlı, ancak yine de sabit işyeri olan firmaları tercih edin.`
}

**2. Vergi Levhası ve Ticaret Kaydı:**
Kayıtlı firma demek sorumluluk demek. Halınıza zarar gelmesi durumunda yasal süreç başlatabilirsiniz.

**3. Müşteri Yorumları:**
Gerçek müşteri yorumları firmanın kalitesini en iyi yansıtan gösterge. ★4.0 üzeri puanlı firmaları tercih edin. Yorum sayısı da önemli — 5 yorumla 4.8 puan ile 100 yorumla 4.3 puan arasında ikincisi daha güvenilirdir.

**4. Sigorta ve Garanti:**
Profesyonel firmalar teslim aldıkları halının sorumluluğunu üstlenir. Hasar durumunda tazminat politikası olan firmayı seçin.

**5. Şeffaf Fiyatlandırma:**
İyi firmalar m² fiyatını net söyler. "Halıyı göreyim sonra fiyat veririm" diyen firmalar genellikle şişirilmiş fiyat uygular.

[${c.city} halı yıkama firmalarını karşılaştırın →](/${c.citySlug}-hali-yikama-firmalari)`,
      },
      {
        heading: `${c.city}'de İlçe Bazlı Firma Yoğunluğu`,
        content: `${c.city}'de firma dağılımı ilçelere göre farklılık gösterir:

**Firma Yoğunluğu Yüksek (Seçenek Çok):**
${districtLinks(c, 'premium', 'halı yıkama')}, ${districtLinks(c, 'mid', 'halı yıkama')}
Bu bölgelerde rekabet yoğun olduğundan fiyatlar daha rekabetçi ve hizmet kalitesi genellikle yüksek.

**Firma Yoğunluğu Düşük (Dikkatli Seçin):**
${districtLinks(c, 'budget', 'halı yıkama')}
Bu bölgelerde az sayıda firma hizmet vermektedir. Alternatif az olduğundan firma kalitesini önceden araştırın.

${c.popTier === 'mega'
  ? `**İpucu:** ${c.city}'de ilçenize yakın firma seçmek hem ulaşım maliyetini düşürür hem teslimat süresini kısaltır.`
  : c.popTier === 'large'
    ? `**İpucu:** ${c.city} merkezindeki firmalar genellikle çevre ilçelere de hizmet verir. Merkezden uzak ilçelerdeyseniz ulaşım ücreti olup olmadığını önceden sorun.`
    : `**İpucu:** ${c.city}'de firma sayısı sınırlı olduğundan, komşu şehirlerdeki firmaları da (${neighborLinks(c)}) değerlendirmenizde fayda var.`
}`,
      },
      {
        heading: `${c.city}'de Halı Yıkama Firması Seçerken Sorulacak 7 Soru`,
        content: `Sipariş vermeden önce firmaya şu soruları sorun:

**1. "m² fiyatınız ne kadar?"** — Net cevap vermeyen firmaya dikkat. [${c.city} güncel fiyatları](/rehber/${c.citySlug}-hali-yikama-fiyatlari) ile karşılaştırın.

**2. "Kurutma yönteminiz nedir?"** — ${c.winterRisk
  ? `${c.city}'de kış aylarında kapalı kurutma tesisi olan firma şart. Açık havada kurutma yapan firmalardan kışın halı yıkatmayın.`
  : `Kapalı kurutma tesisi olan firmalar daha hijyenik ve hızlı kurutur.`
}

**3. "El/ipek halı yıkama yapıyor musunuz?"** — Değerli halılarınız için uzman firma gerekli. Her firma el halısı yıkayamaz.

**4. "Teslimat süresi kaç gün?"** — Standart 2-5 gün. ${c.peakMonths} döneminde 7+ güne uzayabilir.

**5. "Ulaşım ücreti var mı?"** — Bazı firmalar uzak ilçelere ek ulaşım ücreti alır.

**6. "Hasar durumunda ne yapıyorsunuz?"** — Profesyonel firmalar tazminat politikası sunar.

**7. "Evcil hayvan/alerji yıkama programınız var mı?"** — Özel ihtiyaçlarınız varsa belirtin.

Detaylı firma seçim kriterleri için [halı yıkama firması nasıl seçilir](/rehber/hali-yikama-firmasi-nasil-secilir) rehberimize göz atın.`,
      },
      {
        heading: `${c.city}'de Halı Yıkama — Kaçınılması Gereken Tuzaklar`,
        content: `**1. Aşırı Düşük Fiyat:** ${c.city} ortalaması ${c.avgPrice} TL/m². Bu ortalamanın %30+ altında fiyat veren firmalar genellikle kalitesiz deterjan kullanır, yetersiz durulama yapar veya halıyı kayıtsız ele alır.

**2. Telefon Numarası Olmayan Firma:** Sadece sosyal medya üzerinden ulaşılabilen, sabit telefon veya WhatsApp Business hesabı olmayan firmalara güvenmeyin.

**3. "Her Halıyı Yıkarız" İddiası:** Gerçekten profesyonel firmalar sınırlarını bilir. Her türlü halıyı yıkayacağını söyleyen firma, aslında hiçbirinde uzman değildir.

**4. Fiyat Sonradan Değişen Firma:** m² fiyatı anlaşıp, teslimatta "halınız çok kirliydi, ek ücret" diyen firmalar.

**5. Halı Değiştirme:** Nadiren de olsa, özellikle değerli halılarda görülen bir sorun. Yıkama öncesi halınızın fotoğrafını çekin ve ayırt edici özelliklerini not edin.

${c.popTier === 'mega'
  ? `${c.city} gibi büyükşehirlerde yüzlerce firma arasından güvenilir olanı bulmak zor olabilir. [Platform üzerinden](/${c.citySlug}-hali-yikama-firmalari) doğrulanmış firmalar arasından seçim yaparak riski minimuma indirebilirsiniz.`
  : `[${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından doğrulanmış firmalar arasından güvenle seçim yapabilirsiniz.`
}`,
      },
    ],
    faq: [
      { q: `${c.city}'de en güvenilir halı yıkama firması hangisi?`, a: `Tek bir "en iyi" firma yerine, müşteri yorumlarına (★4.0+), sabit işyerine ve şeffaf fiyatlandırmaya sahip firmaları tercih edin. ${c.city} halı yıkama firmalarını karşılaştırarak karar verin.` },
      { q: `${c.city}'de halı yıkama firmasına halı teslim ederken nelere dikkat etmeliyim?`, a: `Halılarınızın fotoğrafını çekin, sorunlu noktaları (leke, yırtık) işaretleyin, halı sayısını ve boyutlarını belirtin. Teslim fişi/makbuzu mutlaka alın.` },
      { q: `${c.city}'de online halı yıkama sipariş verebilir miyim?`, a: `Evet, platform üzerinden firmaları karşılaştırıp online sipariş verebilirsiniz. Firma ekibi belirlenen tarihte halılarınızı teslim almaya gelir.` },
    ],
    relatedSlugs: [`${c.citySlug}-hali-yikama`, 'hali-yikama-firmasi-nasil-secilir', `${c.citySlug}-hali-yikama-fiyatlari`],
  };
}

// ─── 4. YORGAN YIKAMA REHBERLERİ ───

function generateYorganGuide(c: CityMeta): GuideArticle {
  const yorganMin = Math.round(c.yorganAvg * 0.6);
  const yorganMax = Math.round(c.yorganAvg * 1.8);
  const yastikAvg = Math.round(c.yorganAvg * 0.35);
  const battaniyeAvg = Math.round(c.yorganAvg * 0.7);
  const uyku_tulumu = Math.round(c.yorganAvg * 0.8);

  return {
    slug: `${c.citySlug}-yorgan-yikama`,
    city: c.city,
    citySlug: c.citySlug,
    title: `${c.city} Yorgan Yıkama Fiyatları 2026 — Yastık, Battaniye ve Pike Yıkama`,
    metaTitle: `${c.city} Yorgan Yıkama Fiyatları 2026 | Yastık ve Battaniye Yıkama`,
    metaDescription: `${c.city} yorgan yıkama fiyatları 2026. Tek kişilik, çift kişilik yorgan, yastık, battaniye ve pike yıkama ücretleri. İlçe bazlı firma karşılaştırması.`,
    datePublished: '2026-03-19',
    dateModified: '2026-03-19',
    category: 'hali-yikama',
    readingTime: 6,
    heroEmoji: '🛏️',
    intro: `${c.city}'de yorgan yıkama fiyatları yorgan türüne ve boyutuna göre ${yorganMin}-${yorganMax} TL arasında değişiyor. Yorgunu evde yıkamak çamaşır makinesine sığmadığında veya yün/kuştüyü içerik nedeniyle riskli olduğunda profesyonel yıkama tek çözüm. Bu rehberde ${c.city} yorgan, yastık ve battaniye yıkama fiyatlarını karşılaştırıyoruz.`,
    sections: [
      {
        heading: `${c.city} Yorgan Yıkama Fiyatları — Tür Bazlı`,
        content: `**Tek Kişilik Yorgan:** Ortalama ${Math.round(c.yorganAvg * 0.8)} TL (aralık: ${Math.round(yorganMin * 0.8)}-${Math.round(yorganMax * 0.8)} TL)
**Çift Kişilik Yorgan:** Ortalama ${c.yorganAvg} TL (aralık: ${yorganMin}-${yorganMax} TL)
**Kuştüyü Yorgan:** Ortalama ${Math.round(c.yorganAvg * 1.5)} TL — özel deterjan ve düşük sıcaklık gerektirir
**Yün Yorgan:** Ortalama ${Math.round(c.yorganAvg * 1.3)} TL — yanlış yıkama keçeleştirir
**Yastık (Adet):** Ortalama ${yastikAvg} TL
**Battaniye:** Ortalama ${battaniyeAvg} TL
**Pike / Yatak Örtüsü:** Ortalama ${Math.round(c.yorganAvg * 0.5)} TL
**Uyku Tulumu:** Ortalama ${uyku_tulumu} TL

**Paket İndirimi:** Yorgan + 2 yastık + battaniye paketi genellikle ayrı ayrı fiyatın %15-20 altında. [Halı yıkama](/${c.citySlug}-hali-yikama-firmalari) ile birlikte vererek ek indirim alabilirsiniz.`,
      },
      {
        heading: `${c.city}'de Yorgan Ne Zaman Yıkatılmalı?`,
        content: `**Mevsim Dönümü — En İdeal Zaman:**
${c.climate === 'continental' || c.climate === 'transitional'
  ? `${c.city}'de kıştan çıkışta (Mart-Nisan) kış yorganlarını yıkatıp kaldırmak, sonbaharda (Eylül-Ekim) çıkarıp tekrar yıkatmak ideal. Kış boyunca ter, toz akarı ve vücut yağı biriken yorganı yıkamadan kaldırmak küf ve koku riskine yol açar.`
  : c.climate === 'mediterranean'
    ? `${c.city}'nin ılıman ikliminde ince yorganlar yıl boyu kullanılır. İlkbahar (Nisan-Mayıs) büyük temizlik için ideal. Nem nedeniyle yılda en az 2 kez yıkatın.`
    : c.climate === 'blacksea'
      ? `${c.city}'nin nemli ikliminde yorganlar hızla nem çeker. Yılda en az 2-3 kez profesyonel yıkama önerilir. En uygun dönem: ${c.bestMonths} — yılın en kuru ayları.`
      : `${c.city}'de yılda 1-2 kez profesyonel yorgan yıkama yeterli. İlkbahar ve sonbahar ideal dönemler.`
}

**Sağlık Açısından:** Yorganlar toz akarlarının en sevdiği ortam. Sıcak, nemli ve karanlık — tam akar cenneti. Alerjisi olan kişiler yılda 2-3 kez yıkatmalı. Profesyonel yıkama 60°C+ sıcaklıkla toz akarlarını %95+ oranında yok eder.

**Maliyet Tasarrufu:** [${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) genellikle yorgan yıkama hizmeti de sunar. Halı + yorgan + yastık birlikte verdiğinizde firma tek seferde alır — ulaşım maliyeti bölünür, siz toplam %10-15 daha az ödersiniz.`,
      },
      {
        heading: `Yorgan Yıkama — Evde mi Profesyonel mi?`,
        content: `**Evde Yıkanabilir:** İnce pikeler, polyester yastıklar ve küçük battaniyeler çamaşır makinesinde yıkanabilir (30-40°C, nazik program).

**Profesyonel Gerekli:**
- **Çift kişilik yorgan:** Ev çamaşır makinesine sığmaz. Zorla tıkarsanız ne düzgün yıkanır ne düzgün durulanır.
- **Kuştüyü yorgan:** Yanlış deterjan tüyleri keçeleştirir. Profesyoneller kuştüyüne özel deterjan ve düşük sıcaklık kullanır.
- **Yün yorgan:** Sıcak su çeker ve keçeleştirir. Profesyonel yıkama zorunlu.
- **Büyük battaniye:** 200x220 cm ve üzeri battaniyeler ev makinesine sığmaz.

**Kurutma Kritik:** Yorganların tam kuruması 24-48 saat sürer. Yarı kuru kaldırılan yorgan küflenir. ${c.humid
  ? `${c.city}'nin nemli havasında kurutma süresi uzar — kapalı kurutma tesisli firma tercih edin.`
  : `${c.city}'de ${c.summerDry ? 'yaz aylarında' : 'kuru havalarda'} kurutma hızlıdır.`
}

${allDistrictLinks(c, 'yorgan yıkama')} ilçelerinde yorgan yıkama hizmeti veren firmalar mevcuttur.`,
      },
    ],
    faq: [
      { q: `${c.city}'de yorgan yıkama kaç TL?`, a: `Çift kişilik yorgan ortalama ${c.yorganAvg} TL. Kuştüyü yorgan ${Math.round(c.yorganAvg * 1.5)} TL, yastık ${yastikAvg} TL civarındadır.` },
      { q: `Kuştüyü yorgan yıkanır mı?`, a: `Evet, ama sadece profesyonel firmada. Özel deterjan ve düşük sıcaklıkla yıkanır. Evde yıkamak tüyleri keçeleştirir ve yorgan kabarıklığını kaybeder.` },
      { q: `Yorgan ne sıklıkla yıkatılmalı?`, a: `Normal kullanımda yılda 1-2 kez. Alerjisi olan kişiler yılda 2-3 kez. Yastıklar daha sık yıkanmalı — 3-4 ayda bir.` },
      { q: `${c.city}'de yorgan yıkama firması nasıl bulurum?`, a: `[${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından yorgan yıkama hizmeti de sunan firmaları bulabilirsiniz.` },
    ],
    relatedSlugs: [`${c.citySlug}-hali-yikama`, 'yorgan-yastik-yikama', `${c.citySlug}-hali-yikama-fiyatlari`, `${c.citySlug}-perde-yikama`],
  };
}

// ─── 5. PERDE YIKAMA REHBERLERİ ───

function generatePerdeGuide(c: CityMeta): GuideArticle {
  const perdeMin = Math.round(c.perdeAvg * 0.6);
  const perdeMax = Math.round(c.perdeAvg * 2);
  const tulAvg = Math.round(c.perdeAvg * 0.7);
  const storAvg = Math.round(c.perdeAvg * 1.5);
  const kadife = Math.round(c.perdeAvg * 1.8);

  return {
    slug: `${c.citySlug}-perde-yikama`,
    city: c.city,
    citySlug: c.citySlug,
    title: `${c.city} Perde Yıkama Fiyatları 2026 — Tül, Stor ve Blackout Perde`,
    metaTitle: `${c.city} Perde Yıkama Fiyatları 2026 | Tül, Stor ve Kadife Perde`,
    metaDescription: `${c.city} perde yıkama fiyatları 2026. Tül perde, stor perde, kadife ve blackout perde yıkama ücretleri. ${c.districts.premium[0]} ve ${c.districts.mid[0]} ilçelerinde firmalar.`,
    datePublished: '2026-03-19',
    dateModified: '2026-03-19',
    category: 'perde-yikama',
    readingTime: 6,
    heroEmoji: '🪟',
    intro: `${c.city}'de perde yıkama fiyatları perdenin türüne, boyutuna ve kumaşına göre ${perdeMin}-${perdeMax} TL/m² arasında değişiyor. Perdeleri evde yıkamak çekme, renk solması ve ütü sorunu yaratabilir. Profesyonel perde yıkama hem daha güvenli hem ütü dahil teslim edildiğinde pratik. Bu rehberde ${c.city} perde yıkama fiyatlarını ve firma seçim ipuçlarını paylaşıyoruz.`,
    sections: [
      {
        heading: `${c.city} Perde Yıkama Fiyatları — Tür Bazlı`,
        content: `**Tül Perde:** Ortalama ${tulAvg} TL/m² (aralık: ${Math.round(tulAvg * 0.6)}-${Math.round(tulAvg * 1.8)} TL)
En yaygın perde türü. Hafif ve kolay yıkanır. Fiyat avantajlı.

**Fon Perde (Kumaş):** Ortalama ${c.perdeAvg} TL/m² (aralık: ${perdeMin}-${perdeMax} TL)
Daha ağır, daha fazla deterjan ve kurutma süresi gerektirir.

**Kadife Perde:** Ortalama ${kadife} TL/m² (aralık: ${Math.round(kadife * 0.7)}-${Math.round(kadife * 1.6)} TL)
Hassas kumaş, özel yıkama programı gerektirir. Yanlış yıkama kadife dokusunu bozar.

**Blackout (Karartma) Perde:** Ortalama ${Math.round(c.perdeAvg * 1.3)} TL/m²
Arka yüzeydeki kaplama hassas — bazı blackout perdeler yıkanamaz, sadece silinir.

**Stor Perde (Zebra/Plise):** Ortalama ${storAvg} TL/m² — Mekanizma dahil yıkama daha pahalı
**Jaluzi Perde:** Ortalama ${Math.round(c.perdeAvg * 1.2)} TL/m² — Özel ultrasonik yıkama gerektirir

**Ütü Dahil mi?** Çoğu profesyonel firma perde yıkama hizmetine ütü + asma dahil eder. Sipariş öncesi teyit edin.`,
      },
      {
        heading: `${c.city}'de Perde Yıkama — İklim Etkisi ve Zamanlama`,
        content: `${climateDesc(c)} ${c.city}'de perde yıkama zamanlaması önemlidir:

${c.humid
  ? `**Nem Faktörü:** ${c.city}'nin nemli havası perdelerde küf, toz ve koku birikmesini hızlandırır. Yılda en az 2 kez profesyonel perde yıkama önerilir. Özellikle tül perdeler nem çeker ve zamanla gri-sarıya döner.`
  : c.climate === 'continental'
    ? `**Kuru İklim Avantajı:** ${c.city}'nin kuru havası perde kurutmayı hızlandırır. Ancak toz birikimi yüksek olduğundan yılda 1-2 kez profesyonel yıkama gerekir.`
    : `**Mevsimsel Bakım:** ${c.city}'de ilkbahar büyük temizliği sırasında perdeleri yıkatmak ideal zamanlama. Yılda 1-2 kez yeterli.`
}

${c.industrialDust
  ? `**Endüstriyel Toz:** ${c.city}'de sanayi bölgesine yakın evlerde perdeler çok daha hızlı kirlenir. Bu bölgelerde 3-4 ayda bir yıkama gerekebilir.`
  : c.coastal
    ? `**Deniz Tuzu Etkisi:** Sahile yakın evlerde perdeler tuz kristalleri biriktirir. Bu tuz zamanla kumaşı yıpratır — düzenli yıkama kumaş ömrünü uzatır.`
    : ''
}

**İdeal Dönem:** ${c.bestMonths}. ${c.peakMonths} döneminde firmalar yoğun olduğundan teslimat uzayabilir.

Perde yıkamayı [halı yıkama](/${c.citySlug}-hali-yikama-firmalari) ve [koltuk yıkama](/rehber/${c.citySlug}-koltuk-yikama) ile birleştirmeniz fiyat avantajı sağlar.`,
      },
      {
        heading: `${c.city}'de Perde Yıkama Firması Seçimi`,
        content: `Perde yıkama, halı yıkamadan farklı uzmanlık gerektirir. Firma seçerken dikkat edilmesi gerekenler:

**1. Ütü ve Asma Hizmeti:** İyi firmalar perdeyi yıkar, ütüler ve evinize asılı halde teslim eder. Bu hizmeti sunan firmayı tercih edin — aksi halde evinizde dev perdeleri ütülemek kabus olur.

**2. Kumaş Bilgisi:** Kadife, organze, şifon ve blackout perdeler farklı işlem gerektirir. Firmaya perde kumaşınızı söyleyin.

**3. Söküm ve Takma Hizmeti:** Bazı firmalar perde sökme ve takma işini de yapar. Yüksek tavanlı evlerde veya ray sistemli perdelerde bu hizmet çok değerli.

**4. Kuru Temizleme Seçeneği:** Bazı hassas perdeler (ipek, kadife, organik kumaş) su ile yıkanamaz — kuru temizleme gerektirir. Firmanın bu hizmeti sunup sunmadığını sorun.

**${c.city}'de Firma Bulmak:**
${c.popTier === 'tiny' || c.popTier === 'small'
  ? `${c.city}'de özel perde yıkama firması bulmak zor olabilir. Halı yıkama firmalarının çoğu perde yıkama hizmeti de sunar — [${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından hizmetleri kontrol edebilirsiniz.`
  : `[${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından perde yıkama hizmeti de sunan firmaları bulabilirsiniz. ${allDistrictLinks(c, 'perde yıkama')} ilçelerinde aktif firmalar mevcuttur.`
}`,
      },
    ],
    faq: [
      { q: `${c.city}'de perde yıkama kaç TL?`, a: `Tül perde ortalama ${tulAvg} TL/m², fon perde ${c.perdeAvg} TL/m², kadife perde ${kadife} TL/m² civarındadır.` },
      { q: `Tül perde evde yıkanır mı?`, a: `Evet, ince tül perdeler çamaşır makinesinde 30°C nazik programda yıkanabilir. Ama ütüleme ve asma işi zahmetli. Profesyonel firma ütülü ve asılı teslim eder.` },
      { q: `Blackout perde yıkanır mı?`, a: `Bazı blackout perdeler yıkanabilir, bazıları sadece silinir. Arka kaplama hassas olduğundan firmaya danışın. Yanlış yıkama kaplamayı soyabilir.` },
      { q: `${c.city}'de perde yıkama firması nasıl bulurum?`, a: `[${c.city} halı yıkama firmaları](/${c.citySlug}-hali-yikama-firmalari) sayfasından perde yıkama hizmeti sunan firmaları filtreleyebilirsiniz.` },
    ],
    relatedSlugs: [`${c.citySlug}-hali-yikama`, 'perde-yikama-rehberi', `${c.citySlug}-hali-yikama-fiyatlari`, `${c.citySlug}-yorgan-yikama`],
  };
}

// ─── EXPORT: Tüm Ek Rehberler ───

export const extraCityGuides: GuideArticle[] = cityData.flatMap(c => [
  generateKoltukGuide(c),
  generateFiyatGuide(c),
  generateFirmaGuide(c),
  generateYorganGuide(c),
  generatePerdeGuide(c),
]);
