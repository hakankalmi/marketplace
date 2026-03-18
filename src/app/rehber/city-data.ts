/* ───── 81 İl Metadata — SEO Makale Üretimi İçin ───── */

export type ClimateZone = 'mediterranean' | 'blacksea' | 'continental' | 'semiarid' | 'marmara' | 'transitional';
export type PopTier = 'mega' | 'large' | 'medium' | 'small' | 'tiny';

export interface CityMeta {
  city: string;
  citySlug: string;
  emoji: string;
  population: number;
  popTier: PopTier;
  climate: ClimateZone;
  coastal: boolean;
  humid: boolean;
  avgPrice: number;        // makine halısı ortalama TL/m²
  priceMin: number;
  priceMax: number;
  koltukAvg: number;       // koltuk yıkama TL/koltuk
  yorganAvg: number;       // yorgan yıkama TL/adet
  perdeAvg: number;        // perde yıkama TL/m²
  districts: {
    premium: string[];
    mid: string[];
    budget: string[];
  };
  specialties: string[];    // halı/bölge özelliği
  neighbors: string[];      // komşu şehir slug'ları
  winterRisk: boolean;      // kışın kurutma riski
  summerDry: boolean;       // yazın hızlı kurutma
  tourismPeak: boolean;     // turizm sezonu var mı
  industrialDust: boolean;  // endüstriyel toz sorunu
  bestMonths: string;       // ideal yıkama dönemi
  peakMonths: string;       // yoğun dönem
}

function s(city: string): string {
  return city
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/İ/g, 'i').replace(/Ğ/g, 'g').replace(/Ü/g, 'u')
    .replace(/Ş/g, 's').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
    .replace(/\s+/g, '');
}

export const cityData: CityMeta[] = [
  {
    city: 'İstanbul', citySlug: 'istanbul', emoji: '🌉',
    population: 16_000_000, popTier: 'mega',
    climate: 'marmara', coastal: true, humid: true,
    avgPrice: 140, priceMin: 70, priceMax: 450,
    koltukAvg: 350, yorganAvg: 200, perdeAvg: 45,
    districts: {
      premium: ['Beşiktaş', 'Kadıköy', 'Şişli', 'Bakırköy', 'Sarıyer', 'Üsküdar'],
      mid: ['Ataşehir', 'Maltepe', 'Kartal', 'Beylikdüzü', 'Avcılar', 'Bağcılar', 'Ümraniye'],
      budget: ['Pendik', 'Tuzla', 'Sultanbeyli', 'Esenyurt', 'Arnavutköy', 'Silivri']
    },
    specialties: ['ipek_halı_uzmanlığı', 'çadır_yıkamacı_riski', 'yakalar_arası_fiyat_farkı'],
    neighbors: ['kocaeli', 'tekirdag', 'yalova', 'bursa'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Eylül-Ekim', peakMonths: 'Haziran-Temmuz',
  },
  {
    city: 'Ankara', citySlug: 'ankara', emoji: '🏛️',
    population: 5_800_000, popTier: 'mega',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 90, priceMin: 70, priceMax: 140,
    koltukAvg: 250, yorganAvg: 140, perdeAvg: 30,
    districts: {
      premium: ['Çankaya', 'Yenimahalle'],
      mid: ['Keçiören', 'Etimesgut', 'Pursaklar'],
      budget: ['Mamak', 'Altındağ', 'Sincan', 'Kahramankazan', 'Polatlı']
    },
    specialties: ['devlet_kurumları_halı_temizliği', 'kuru_iklim_avantajı'],
    neighbors: ['eskisehir', 'konya', 'kirikkale', 'cankiri', 'bolu'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'İzmir', citySlug: 'izmir', emoji: '🌊',
    population: 4_400_000, popTier: 'large',
    climate: 'mediterranean', coastal: true, humid: true,
    avgPrice: 95, priceMin: 70, priceMax: 160,
    koltukAvg: 280, yorganAvg: 150, perdeAvg: 32,
    districts: {
      premium: ['Karşıyaka', 'Konak', 'Balçova', 'Narlıdere', 'Çeşme', 'Urla'],
      mid: ['Bornova', 'Buca', 'Bayraklı', 'Çiğli', 'Karabağlar', 'Menemen'],
      budget: ['Torbalı', 'Kemalpaşa', 'Bergama', 'Aliağa', 'Tire', 'Ödemiş']
    },
    specialties: ['nem_ve_küf_riski', 'yazlık_ev_temizliği', 'kilim_cicim'],
    neighbors: ['manisa', 'aydin', 'mugla', 'balikesir'],
    winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Eylül-Ekim', peakMonths: 'Haziran-Temmuz',
  },
  {
    city: 'Bursa', citySlug: 'bursa', emoji: '🌿',
    population: 3_200_000, popTier: 'large',
    climate: 'marmara', coastal: true, humid: true,
    avgPrice: 90, priceMin: 65, priceMax: 140,
    koltukAvg: 260, yorganAvg: 140, perdeAvg: 30,
    districts: {
      premium: ['Nilüfer', 'Osmangazi'],
      mid: ['Yıldırım', 'Mudanya', 'Gemlik'],
      budget: ['İnegöl', 'Orhangazi', 'Karacabey', 'Mustafakemalpaşa']
    },
    specialties: ['osmanlı_ipek_halısı', 'tekstil_merkezi'],
    neighbors: ['istanbul', 'balikesir', 'kocaeli', 'yalova', 'eskisehir'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Antalya', citySlug: 'antalya', emoji: '☀️',
    population: 2_600_000, popTier: 'large',
    climate: 'mediterranean', coastal: true, humid: true,
    avgPrice: 105, priceMin: 70, priceMax: 200,
    koltukAvg: 300, yorganAvg: 160, perdeAvg: 35,
    districts: {
      premium: ['Muratpaşa', 'Konyaaltı', 'Lara'],
      mid: ['Kepez', 'Aksu', 'Döşemealtı'],
      budget: ['Alanya', 'Manavgat', 'Serik', 'Kumluca', 'Kaş']
    },
    specialties: ['otel_halı_temizliği', 'turizm_sezonu_yoğunluğu', 'sahil_tuz_etkisi'],
    neighbors: ['mugla', 'burdur', 'isparta', 'mersin'],
    winterRisk: false, summerDry: true, tourismPeak: true, industrialDust: false,
    bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Konya', citySlug: 'konya', emoji: '🌾',
    population: 2_300_000, popTier: 'large',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 75, priceMin: 55, priceMax: 110,
    koltukAvg: 220, yorganAvg: 120, perdeAvg: 25,
    districts: {
      premium: ['Selçuklu', 'Meram'],
      mid: ['Karatay', 'Beyşehir'],
      budget: ['Ereğli', 'Akşehir', 'Cihanbeyli', 'Çumra']
    },
    specialties: ['ladik_halısı', 'kuru_bozkır_iklimi', 'geniş_yüzölçümü'],
    neighbors: ['ankara', 'mersin', 'karaman', 'aksaray', 'isparta'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Adana', citySlug: 'adana', emoji: '🌶️',
    population: 2_200_000, popTier: 'large',
    climate: 'mediterranean', coastal: false, humid: true,
    avgPrice: 70, priceMin: 50, priceMax: 100,
    koltukAvg: 200, yorganAvg: 110, perdeAvg: 22,
    districts: {
      premium: ['Seyhan', 'Çukurova'],
      mid: ['Yüreğir', 'Sarıçam'],
      budget: ['Ceyhan', 'Kozan', 'İmamoğlu', 'Tufanbeyli']
    },
    specialties: ['çukurova_sıcağı', 'tarım_tozu', 'güve_riski'],
    neighbors: ['mersin', 'osmaniye', 'hatay', 'kayseri'],
    winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: true,
    bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Gaziantep', citySlug: 'gaziantep', emoji: '🧵',
    population: 2_100_000, popTier: 'large',
    climate: 'semiarid', coastal: false, humid: false,
    avgPrice: 70, priceMin: 50, priceMax: 100,
    koltukAvg: 200, yorganAvg: 110, perdeAvg: 22,
    districts: {
      premium: ['Şahinbey', 'Şehitkamil'],
      mid: ['Nizip', 'İslahiye'],
      budget: ['Araban', 'Oğuzeli', 'Nurdağı', 'Karkamış']
    },
    specialties: ['halı_üretim_merkezi', 'el_halısı_uzmanlığı', 'kuru_iklim'],
    neighbors: ['sanliurfa', 'adiyaman', 'kahramanmaras', 'kilis', 'hatay'],
    winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: true,
    bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Nisan-Mayıs',
  },
  {
    city: 'Şanlıurfa', citySlug: 'sanliurfa', emoji: '🏺',
    population: 2_100_000, popTier: 'large',
    climate: 'semiarid', coastal: false, humid: false,
    avgPrice: 58, priceMin: 40, priceMax: 80,
    koltukAvg: 170, yorganAvg: 95, perdeAvg: 18,
    districts: {
      premium: ['Eyyübiye', 'Haliliye'],
      mid: ['Karaköprü', 'Viranşehir'],
      budget: ['Siverek', 'Suruç', 'Birecik', 'Harran']
    },
    specialties: ['kuru_sıcak_iklim', 'geleneksel_kilim'],
    neighbors: ['gaziantep', 'diyarbakir', 'mardin', 'adiyaman'],
    winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Nisan-Mayıs',
  },
  {
    city: 'Kocaeli', citySlug: 'kocaeli', emoji: '🏭',
    population: 2_000_000, popTier: 'large',
    climate: 'marmara', coastal: true, humid: true,
    avgPrice: 135, priceMin: 75, priceMax: 200,
    koltukAvg: 320, yorganAvg: 180, perdeAvg: 40,
    districts: {
      premium: ['İzmit', 'Gebze'],
      mid: ['Darıca', 'Çayırova', 'Derince', 'Kartepe'],
      budget: ['Gölcük', 'Kandıra', 'Karamürsel']
    },
    specialties: ['sanayi_bölgesi_halı_temizliği', 'istanbul_sınır_fiyat_etkisi'],
    neighbors: ['istanbul', 'sakarya', 'bursa', 'yalova'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: true,
    bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Mersin', citySlug: 'mersin', emoji: '🍋',
    population: 1_900_000, popTier: 'large',
    climate: 'mediterranean', coastal: true, humid: true,
    avgPrice: 75, priceMin: 55, priceMax: 110,
    koltukAvg: 220, yorganAvg: 120, perdeAvg: 25,
    districts: {
      premium: ['Mezitli', 'Yenişehir'],
      mid: ['Toroslar', 'Akdeniz', 'Tarsus'],
      budget: ['Erdemli', 'Silifke', 'Mut', 'Anamur']
    },
    specialties: ['limon_kokulu_şehir', 'nem_ve_tuz', 'liman_tozu'],
    neighbors: ['adana', 'antalya', 'konya', 'karaman'],
    winterRisk: false, summerDry: true, tourismPeak: true, industrialDust: true,
    bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Diyarbakır', citySlug: 'diyarbakir', emoji: '🏰',
    population: 1_800_000, popTier: 'large',
    climate: 'semiarid', coastal: false, humid: false,
    avgPrice: 62, priceMin: 45, priceMax: 85,
    koltukAvg: 180, yorganAvg: 100, perdeAvg: 20,
    districts: {
      premium: ['Kayapınar', 'Bağlar'],
      mid: ['Yenişehir', 'Sur'],
      budget: ['Bismil', 'Ergani', 'Silvan', 'Çermik']
    },
    specialties: ['aşırı_sıcak_yaz', 'geleneksel_halı_dokuma'],
    neighbors: ['sanliurfa', 'mardin', 'batman', 'bingol', 'elazig', 'mus'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Ekim', peakMonths: 'Nisan-Mayıs',
  },
  {
    city: 'Hatay', citySlug: 'hatay', emoji: '🕌',
    population: 1_600_000, popTier: 'large',
    climate: 'mediterranean', coastal: true, humid: true,
    avgPrice: 65, priceMin: 45, priceMax: 95,
    koltukAvg: 190, yorganAvg: 105, perdeAvg: 21,
    districts: {
      premium: ['Antakya', 'Defne'],
      mid: ['İskenderun', 'Dörtyol', 'Kırıkhan'],
      budget: ['Samandağ', 'Reyhanlı', 'Hassa', 'Altınözü']
    },
    specialties: ['demir_çelik_tozu', 'liman_kirliliği', 'deprem_sonrası_yeniden_yapılanma'],
    neighbors: ['adana', 'osmaniye', 'gaziantep', 'kilis'],
    winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: true,
    bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Manisa', citySlug: 'manisa', emoji: '🍇',
    population: 1_400_000, popTier: 'medium',
    climate: 'mediterranean', coastal: false, humid: false,
    avgPrice: 72, priceMin: 50, priceMax: 100,
    koltukAvg: 210, yorganAvg: 115, perdeAvg: 23,
    districts: {
      premium: ['Yunusemre', 'Şehzadeler'],
      mid: ['Turgutlu', 'Akhisar', 'Salihli'],
      budget: ['Soma', 'Kula', 'Demirci', 'Sarıgöl']
    },
    specialties: ['kula_halısı', 'gördes_halısı', 'üzüm_bağı_tozu'],
    neighbors: ['izmir', 'aydin', 'denizli', 'balikesir', 'kutahya'],
    winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Eylül-Ekim', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Samsun', citySlug: 'samsun', emoji: '🌧️',
    population: 1_350_000, popTier: 'medium',
    climate: 'blacksea', coastal: true, humid: true,
    avgPrice: 68, priceMin: 50, priceMax: 95,
    koltukAvg: 200, yorganAvg: 110, perdeAvg: 22,
    districts: {
      premium: ['Atakum', 'İlkadım'],
      mid: ['Canik', 'Tekkeköy'],
      budget: ['Bafra', 'Çarşamba', 'Terme', 'Vezirköprü']
    },
    specialties: ['karadeniz_nemi', 'yüksek_yağış', 'küf_riski'],
    neighbors: ['ordu', 'amasya', 'tokat', 'sinop'],
    winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: false,
    bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz',
  },
  {
    city: 'Balıkesir', citySlug: 'balikesir', emoji: '🫒',
    population: 1_200_000, popTier: 'medium',
    climate: 'marmara', coastal: true, humid: true,
    avgPrice: 72, priceMin: 50, priceMax: 100,
    koltukAvg: 210, yorganAvg: 115, perdeAvg: 23,
    districts: {
      premium: ['Altıeylül', 'Karesi'],
      mid: ['Bandırma', 'Edremit', 'Ayvalık', 'Gönen'],
      budget: ['Bigadiç', 'Susurluk', 'Erdek', 'Burhaniye']
    },
    specialties: ['zeytinyağı_lekesi', 'tatil_bölgesi', 'yazlık_ev_yoğunluğu'],
    neighbors: ['istanbul', 'bursa', 'canakkale', 'manisa', 'izmir'],
    winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Eylül-Ekim', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Tekirdağ', citySlug: 'tekirdag', emoji: '🌻',
    population: 1_100_000, popTier: 'medium',
    climate: 'marmara', coastal: true, humid: true,
    avgPrice: 80, priceMin: 55, priceMax: 120,
    koltukAvg: 230, yorganAvg: 130, perdeAvg: 27,
    districts: {
      premium: ['Süleymanpaşa', 'Çorlu'],
      mid: ['Çerkezköy', 'Ergene', 'Kapaklı'],
      budget: ['Malkara', 'Hayrabolu', 'Muratlı', 'Saray']
    },
    specialties: ['istanbul_yakınlığı', 'sanayi_bölgesi'],
    neighbors: ['istanbul', 'edirne', 'kirklareli'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: true,
    bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Aydın', citySlug: 'aydin', emoji: '🏖️',
    population: 1_100_000, popTier: 'medium',
    climate: 'mediterranean', coastal: true, humid: true,
    avgPrice: 72, priceMin: 50, priceMax: 100,
    koltukAvg: 210, yorganAvg: 115, perdeAvg: 23,
    districts: {
      premium: ['Efeler', 'Kuşadası', 'Didim'],
      mid: ['Nazilli', 'Söke', 'Germencik'],
      budget: ['Çine', 'Bozdoğan', 'Sultanhisar', 'Karacasu']
    },
    specialties: ['tatil_bölgesi_yoğunluğu', 'yazlık_ev', 'nem_etkisi'],
    neighbors: ['izmir', 'mugla', 'denizli', 'manisa'],
    winterRisk: false, summerDry: true, tourismPeak: true, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Eylül-Ekim', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Denizli', citySlug: 'denizli', emoji: '♨️',
    population: 1_040_000, popTier: 'medium',
    climate: 'transitional', coastal: false, humid: false,
    avgPrice: 70, priceMin: 50, priceMax: 100,
    koltukAvg: 200, yorganAvg: 110, perdeAvg: 22,
    districts: {
      premium: ['Merkezefendi', 'Pamukkale'],
      mid: ['Çivril', 'Acıpayam', 'Sarayköy'],
      budget: ['Honaz', 'Çal', 'Buldan', 'Tavas']
    },
    specialties: ['tekstil_merkezi', 'termal_turizm', 'buldan_bezi'],
    neighbors: ['aydin', 'mugla', 'burdur', 'isparta', 'manisa', 'usak'],
    winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false,
    bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Eskişehir', citySlug: 'eskisehir', emoji: '🎓',
    population: 900_000, popTier: 'medium',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 80, priceMin: 60, priceMax: 120,
    koltukAvg: 230, yorganAvg: 130, perdeAvg: 27,
    districts: {
      premium: ['Tepebaşı', 'Odunpazarı'],
      mid: ['Sivrihisar'],
      budget: ['Çifteler', 'Mahmudiye', 'Alpu']
    },
    specialties: ['üniversite_şehri', 'öğrenci_paketleri', 'lületaşı'],
    neighbors: ['ankara', 'bursa', 'kutahya', 'bolu', 'konya'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Sakarya', citySlug: 'sakarya', emoji: '🌲',
    population: 1_000_000, popTier: 'medium',
    climate: 'marmara', coastal: true, humid: true,
    avgPrice: 78, priceMin: 55, priceMax: 110,
    koltukAvg: 220, yorganAvg: 125, perdeAvg: 25,
    districts: {
      premium: ['Serdivan', 'Erenler'],
      mid: ['Adapazarı', 'Akyazı', 'Hendek'],
      budget: ['Sapanca', 'Geyve', 'Kaynarca', 'Ferizli']
    },
    specialties: ['nem_oranı_yüksek', 'istanbul_overflow'],
    neighbors: ['istanbul', 'kocaeli', 'bolu', 'duzce'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Muğla', citySlug: 'mugla', emoji: '⛵',
    population: 1_000_000, popTier: 'medium',
    climate: 'mediterranean', coastal: true, humid: true,
    avgPrice: 82, priceMin: 55, priceMax: 130,
    koltukAvg: 240, yorganAvg: 135, perdeAvg: 28,
    districts: {
      premium: ['Bodrum', 'Fethiye', 'Marmaris', 'Dalaman'],
      mid: ['Menteşe', 'Milas', 'Köyceğiz'],
      budget: ['Yatağan', 'Ula', 'Kavaklıdere', 'Ortaca']
    },
    specialties: ['lüks_villa_temizliği', 'turizm_sezonu', 'deniz_tuzu_etkisi'],
    neighbors: ['aydin', 'denizli', 'burdur', 'antalya'],
    winterRisk: false, summerDry: true, tourismPeak: true, industrialDust: false,
    bestMonths: 'Nisan-Mayıs, Ekim-Kasım', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Trabzon', citySlug: 'trabzon', emoji: '⛰️',
    population: 810_000, popTier: 'medium',
    climate: 'blacksea', coastal: true, humid: true,
    avgPrice: 72, priceMin: 55, priceMax: 100,
    koltukAvg: 210, yorganAvg: 115, perdeAvg: 23,
    districts: {
      premium: ['Ortahisar'],
      mid: ['Akçaabat', 'Yomra', 'Arsin'],
      budget: ['Of', 'Sürmene', 'Çaykara', 'Maçka', 'Tonya']
    },
    specialties: ['karadeniz_nemi', 'yağış_200_gün', 'çay_bahçesi_toprağı'],
    neighbors: ['rize', 'giresun', 'gumushane', 'bayburt'],
    winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: false,
    bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz',
  },
  {
    city: 'Kahramanmaraş', citySlug: 'kahramanmaras', emoji: '🍦',
    population: 1_150_000, popTier: 'medium',
    climate: 'transitional', coastal: false, humid: false,
    avgPrice: 62, priceMin: 45, priceMax: 85,
    koltukAvg: 180, yorganAvg: 100, perdeAvg: 20,
    districts: {
      premium: ['Onikişubat', 'Dulkadiroğlu'],
      mid: ['Elbistan', 'Afşin'],
      budget: ['Türkoğlu', 'Pazarcık', 'Göksun', 'Andırın']
    },
    specialties: ['deprem_sonrası_yeniden_yapılanma', 'dondurma_şehri'],
    neighbors: ['gaziantep', 'adana', 'osmaniye', 'kayseri', 'sivas', 'malatya'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Van', citySlug: 'van', emoji: '🐱',
    population: 1_100_000, popTier: 'medium',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 55, priceMin: 40, priceMax: 75,
    koltukAvg: 160, yorganAvg: 90, perdeAvg: 17,
    districts: {
      premium: ['İpekyolu', 'Tuşba'],
      mid: ['Edremit', 'Erciş'],
      budget: ['Özalp', 'Başkale', 'Çaldıran', 'Gevaş']
    },
    specialties: ['van_kilimi', 'sert_kış', 'göl_nemi'],
    neighbors: ['hakkari', 'bitlis', 'mus', 'agri'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz',
  },
  {
    city: 'Malatya', citySlug: 'malatya', emoji: '🍑',
    population: 800_000, popTier: 'medium',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 62, priceMin: 45, priceMax: 85,
    koltukAvg: 180, yorganAvg: 100, perdeAvg: 20,
    districts: {
      premium: ['Battalgazi', 'Yeşilyurt'],
      mid: ['Doğanşehir', 'Akçadağ'],
      budget: ['Darende', 'Hekimhan', 'Arguvan', 'Pütürge']
    },
    specialties: ['kayısı_başkenti', 'kuru_iklim_avantajı'],
    neighbors: ['elazig', 'sivas', 'kahramanmaras', 'adiyaman', 'diyarbakir'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Elazığ', citySlug: 'elazig', emoji: '🏔️',
    population: 590_000, popTier: 'small',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 60, priceMin: 42, priceMax: 82,
    koltukAvg: 175, yorganAvg: 95, perdeAvg: 19,
    districts: {
      premium: ['Merkez'],
      mid: ['Kovancılar', 'Karakoçan'],
      budget: ['Baskil', 'Maden', 'Sivrice', 'Palu']
    },
    specialties: ['keban_barajı', 'üniversite_şehri'],
    neighbors: ['malatya', 'diyarbakir', 'bingol', 'tunceli', 'erzincan'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Sivas', citySlug: 'sivas', emoji: '🧶',
    population: 640_000, popTier: 'small',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 60, priceMin: 45, priceMax: 80,
    koltukAvg: 175, yorganAvg: 95, perdeAvg: 19,
    districts: {
      premium: ['Merkez'],
      mid: ['Şarkışla', 'Suşehri'],
      budget: ['Gemerek', 'Kangal', 'Zara', 'Divriği']
    },
    specialties: ['dünyaca_ünlü_sivas_halısı', 'kangal_çoban_köpeği', 'sert_kış'],
    neighbors: ['tokat', 'amasya', 'yozgat', 'kayseri', 'kahramanmaras', 'malatya', 'erzincan'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Ordu', citySlug: 'ordu', emoji: '🌰',
    population: 750_000, popTier: 'small',
    climate: 'blacksea', coastal: true, humid: true,
    avgPrice: 62, priceMin: 45, priceMax: 85,
    koltukAvg: 180, yorganAvg: 100, perdeAvg: 20,
    districts: {
      premium: ['Altınordu'],
      mid: ['Ünye', 'Fatsa'],
      budget: ['Perşembe', 'Kumru', 'Ulubey', 'Mesudiye']
    },
    specialties: ['fındık_sezonu_talebi', 'karadeniz_nemi'],
    neighbors: ['samsun', 'tokat', 'giresun', 'sivas'],
    winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: false,
    bestMonths: 'Temmuz-Ağustos', peakMonths: 'Ağustos-Eylül',
  },
  {
    city: 'Afyonkarahisar', citySlug: 'afyonkarahisar', emoji: '♨️',
    population: 730_000, popTier: 'small',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 62, priceMin: 42, priceMax: 85,
    koltukAvg: 180, yorganAvg: 100, perdeAvg: 20,
    districts: {
      premium: ['Merkez'],
      mid: ['Sandıklı', 'Bolvadin', 'Emirdağ'],
      budget: ['Dinar', 'Çay', 'İhsaniye', 'Sinanpaşa']
    },
    specialties: ['termal_otel_halı_temizliği', 'mermer_tozu'],
    neighbors: ['eskisehir', 'kutahya', 'usak', 'denizli', 'burdur', 'isparta', 'konya'],
    winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: true,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  {
    city: 'Isparta', citySlug: 'isparta', emoji: '🌹',
    population: 440_000, popTier: 'small',
    climate: 'continental', coastal: false, humid: false,
    avgPrice: 60, priceMin: 42, priceMax: 82,
    koltukAvg: 175, yorganAvg: 95, perdeAvg: 19,
    districts: {
      premium: ['Merkez'],
      mid: ['Yalvaç', 'Eğirdir'],
      budget: ['Şarkikaraağaç', 'Gelendost', 'Senirkent', 'Uluborlu']
    },
    specialties: ['isparta_halısı', 'gül_yağı', 'üniversite_şehri'],
    neighbors: ['antalya', 'burdur', 'afyonkarahisar', 'konya'],
    winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false,
    bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran',
  },
  // --- Remaining cities with compact data ---
  ...[
    { city: 'Adıyaman', citySlug: 'adiyaman', emoji: '⛰️', population: 620_000, popTier: 'small' as PopTier, climate: 'semiarid' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Kahta', 'Besni'], budget: ['Gölbaşı', 'Tut', 'Gerger', 'Samsat'] }, specialties: ['nemrut_dağı_turizmi'], neighbors: ['malatya', 'sanliurfa', 'gaziantep', 'kahramanmaras'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Ağrı', citySlug: 'agri', emoji: '🏔️', population: 540_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 50, priceMin: 35, priceMax: 70, koltukAvg: 150, yorganAvg: 85, perdeAvg: 16, districts: { premium: ['Merkez'], mid: ['Doğubayazıt', 'Patnos'], budget: ['Diyadin', 'Eleşkirt', 'Taşlıçay', 'Tutak'] }, specialties: ['ağrı_dağı', 'sert_kış_koşulları'], neighbors: ['van', 'igdir', 'kars', 'erzurum', 'mus'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Aksaray', citySlug: 'aksaray', emoji: '🏜️', population: 420_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Ortaköy'], budget: ['Güzelyurt', 'Eskil', 'Ağaçören', 'Sarıyahşi'] }, specialties: ['kapadokya_turizmi', 'ihlara_vadisi'], neighbors: ['konya', 'nevsehir', 'nigde', 'kirsehir'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Amasya', citySlug: 'amasya', emoji: '👑', population: 340_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Merzifon', 'Suluova'], budget: ['Taşova', 'Göynücek', 'Hamamözü', 'Gümüşhacıköy'] }, specialties: ['elma_başkenti', 'tarihi_şehir'], neighbors: ['samsun', 'tokat', 'corum', 'sivas'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Ardahan', citySlug: 'ardahan', emoji: '❄️', population: 98_000, popTier: 'tiny' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Göle'], budget: ['Çıldır', 'Hanak', 'Posof', 'Damal'] }, specialties: ['türkiye_en_soğuk', 'yaylacılık'], neighbors: ['kars', 'artvin'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Artvin', citySlug: 'artvin', emoji: '🌲', population: 170_000, popTier: 'tiny' as PopTier, climate: 'blacksea' as ClimateZone, coastal: true, humid: true, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Hopa', 'Borçka'], budget: ['Arhavi', 'Yusufeli', 'Şavşat', 'Ardanuç'] }, specialties: ['doğa_turizmi', 'yağışlı_iklim'], neighbors: ['trabzon', 'rize', 'ardahan', 'erzurum'], winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: false, bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Bartın', citySlug: 'bartin', emoji: '🪵', population: 195_000, popTier: 'tiny' as PopTier, climate: 'blacksea' as ClimateZone, coastal: true, humid: true, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Amasra'], budget: ['Ulus', 'Kurucaşile'] }, specialties: ['amasra_turizmi', 'orman_nemi'], neighbors: ['zonguldak', 'kastamonu', 'karabuk'], winterRisk: true, summerDry: false, tourismPeak: true, industrialDust: false, bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Batman', citySlug: 'batman', emoji: '🛢️', population: 620_000, popTier: 'small' as PopTier, climate: 'semiarid' as ClimateZone, coastal: false, humid: false, avgPrice: 52, priceMin: 35, priceMax: 72, koltukAvg: 155, yorganAvg: 87, perdeAvg: 16, districts: { premium: ['Merkez'], mid: ['Kozluk'], budget: ['Beşiri', 'Gercüş', 'Hasankeyf', 'Sason'] }, specialties: ['petrol_rafinerisi', 'sıcak_kuru_yaz'], neighbors: ['diyarbakir', 'siirt', 'mardin', 'bitlis', 'mus'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: true, bestMonths: 'Nisan-Mayıs, Ekim', peakMonths: 'Nisan-Mayıs' },
    { city: 'Bayburt', citySlug: 'bayburt', emoji: '🏯', population: 84_000, popTier: 'tiny' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Aydıntepe'], budget: ['Demirözü'] }, specialties: ['ehram_dokumacılığı', 'sert_kış'], neighbors: ['trabzon', 'erzurum', 'gumushane', 'erzincan'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Bilecik', citySlug: 'bilecik', emoji: '🏰', population: 225_000, popTier: 'tiny' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Bozüyük', 'Söğüt'], budget: ['Osmaneli', 'Pazaryeri', 'Gölpazarı', 'İnhisar'] }, specialties: ['osmanlı_kuruluş_şehri'], neighbors: ['eskisehir', 'bursa', 'bolu', 'kutahya'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Bingöl', citySlug: 'bingol', emoji: '💐', population: 280_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 50, priceMin: 35, priceMax: 68, koltukAvg: 150, yorganAvg: 85, perdeAvg: 16, districts: { premium: ['Merkez'], mid: ['Genç', 'Solhan'], budget: ['Karlıova', 'Kiğı', 'Adaklı', 'Yayladere'] }, specialties: ['bal_üretimi', 'sert_kış'], neighbors: ['elazig', 'diyarbakir', 'mus', 'tunceli', 'erzurum'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Bitlis', citySlug: 'bitlis', emoji: '🏔️', population: 350_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 50, priceMin: 35, priceMax: 68, koltukAvg: 150, yorganAvg: 85, perdeAvg: 16, districts: { premium: ['Merkez', 'Tatvan'], mid: ['Ahlat'], budget: ['Güroymak', 'Hizan', 'Mutki', 'Adilcevaz'] }, specialties: ['nemrut_krater_gölü', 'sert_kış'], neighbors: ['van', 'mus', 'siirt', 'batman'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Bolu', citySlug: 'bolu', emoji: '🍄', population: 315_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: true, avgPrice: 62, priceMin: 42, priceMax: 85, koltukAvg: 180, yorganAvg: 100, perdeAvg: 20, districts: { premium: ['Merkez'], mid: ['Gerede', 'Mudurnu'], budget: ['Mengen', 'Göynük', 'Seben', 'Yeniçağa'] }, specialties: ['abant_gölü_turizm', 'orman_nemi', 'aşçılık_başkenti'], neighbors: ['ankara', 'eskisehir', 'duzce', 'sakarya', 'cankiri'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Burdur', citySlug: 'burdur', emoji: '🦩', population: 270_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Bucak'], budget: ['Gölhisar', 'Tefenni', 'Yeşilova', 'Ağlasun'] }, specialties: ['burdur_gölü', 'lavanta_üretimi'], neighbors: ['antalya', 'isparta', 'mugla', 'denizli', 'afyonkarahisar'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Çanakkale', citySlug: 'canakkale', emoji: '⚓', population: 540_000, popTier: 'small' as PopTier, climate: 'marmara' as ClimateZone, coastal: true, humid: true, avgPrice: 68, priceMin: 48, priceMax: 95, koltukAvg: 200, yorganAvg: 110, perdeAvg: 22, districts: { premium: ['Merkez'], mid: ['Biga', 'Çan', 'Gelibolu'], budget: ['Ezine', 'Bayramiç', 'Lapseki', 'Ayvacık'] }, specialties: ['boğaz_rüzgârı', 'turizm_tarihi_alan'], neighbors: ['balikesir', 'tekirdag', 'edirne'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Çankırı', citySlug: 'cankiri', emoji: '🧂', population: 195_000, popTier: 'tiny' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 52, priceMin: 35, priceMax: 72, koltukAvg: 155, yorganAvg: 87, perdeAvg: 16, districts: { premium: ['Merkez'], mid: ['Çerkeş'], budget: ['Ilgaz', 'Kurşunlu', 'Şabanözü', 'Yapraklı'] }, specialties: ['tuz_mağarası_turizm'], neighbors: ['ankara', 'corum', 'kastamonu', 'bolu'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Çorum', citySlug: 'corum', emoji: '🫘', population: 530_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Sungurlu', 'Osmancık'], budget: ['Alaca', 'İskilip', 'Bayat', 'Kargı'] }, specialties: ['leblebi_başkenti', 'hitit_uygarlığı'], neighbors: ['amasya', 'samsun', 'ankara', 'cankiri', 'yozgat', 'tokat'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Düzce', citySlug: 'duzce', emoji: '🌿', population: 390_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: true, avgPrice: 62, priceMin: 42, priceMax: 85, koltukAvg: 180, yorganAvg: 100, perdeAvg: 20, districts: { premium: ['Merkez'], mid: ['Akçakoca'], budget: ['Kaynaşlı', 'Gölyaka', 'Cumayeri', 'Çilimli'] }, specialties: ['fındık_üretimi', 'nem_sorunu'], neighbors: ['bolu', 'sakarya', 'zonguldak'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Edirne', citySlug: 'edirne', emoji: '🏛️', population: 410_000, popTier: 'small' as PopTier, climate: 'marmara' as ClimateZone, coastal: false, humid: true, avgPrice: 62, priceMin: 42, priceMax: 85, koltukAvg: 180, yorganAvg: 100, perdeAvg: 20, districts: { premium: ['Merkez'], mid: ['Keşan', 'Uzunköprü'], budget: ['İpsala', 'Havsa', 'Lalapaşa', 'Süloğlu'] }, specialties: ['sınır_şehri', 'tarihi_camiler', 'kırkpınar'], neighbors: ['tekirdag', 'kirklareli'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Erzincan', citySlug: 'erzincan', emoji: '🍎', population: 235_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Tercan', 'Üzümlü'], budget: ['Refahiye', 'Kemaliye', 'İliç', 'Kemah'] }, specialties: ['tulum_peyniri', 'deprem_riski'], neighbors: ['erzurum', 'sivas', 'tunceli', 'elazig', 'gumushane', 'bayburt'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Erzurum', citySlug: 'erzurum', emoji: '🎿', population: 760_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 60, priceMin: 45, priceMax: 80, koltukAvg: 175, yorganAvg: 95, perdeAvg: 19, districts: { premium: ['Yakutiye', 'Palandöken'], mid: ['Aziziye', 'Oltu'], budget: ['Horasan', 'Pasinler', 'Aşkale', 'Hınıs'] }, specialties: ['geleneksel_halı_dokuma', 'palandöken_kayak', 'sert_kış_eksi_30'], neighbors: ['kars', 'agri', 'mus', 'bingol', 'erzincan', 'bayburt', 'artvin'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Giresun', citySlug: 'giresun', emoji: '🌰', population: 450_000, popTier: 'small' as PopTier, climate: 'blacksea' as ClimateZone, coastal: true, humid: true, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Bulancak', 'Görele'], budget: ['Espiye', 'Tirebolu', 'Keşap', 'Şebinkarahisar'] }, specialties: ['fındık_üretimi', 'karadeniz_nemi'], neighbors: ['trabzon', 'ordu', 'sivas', 'gumushane'], winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: false, bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Gümüşhane', citySlug: 'gumushane', emoji: '⛏️', population: 150_000, popTier: 'tiny' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 52, priceMin: 35, priceMax: 70, koltukAvg: 155, yorganAvg: 87, perdeAvg: 16, districts: { premium: ['Merkez'], mid: ['Kelkit', 'Şiran'], budget: ['Torul', 'Köse', 'Kürtün'] }, specialties: ['pestil_köme', 'yüksek_rakım'], neighbors: ['trabzon', 'bayburt', 'erzincan', 'giresun', 'sivas'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Hakkari', citySlug: 'hakkari', emoji: '🏔️', population: 280_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Yüksekova'], budget: ['Şemdinli', 'Çukurca', 'Derecik'] }, specialties: ['yüksek_rakım', 'sert_kış', 'sınır_şehri'], neighbors: ['van', 'sirnak'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Iğdır', citySlug: 'igdir', emoji: '🏔️', population: 200_000, popTier: 'tiny' as PopTier, climate: 'semiarid' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Tuzluca'], budget: ['Aralık', 'Karakoyunlu'] }, specialties: ['ağrı_dağı_manzarası', 'kayısı_üretimi'], neighbors: ['agri', 'kars'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Karabük', citySlug: 'karabuk', emoji: '🏗️', population: 250_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: true, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Safranbolu'], budget: ['Yenice', 'Eskipazar', 'Ovacık', 'Eflani'] }, specialties: ['demir_çelik_endüstrisi', 'safranbolu_tarihi'], neighbors: ['zonguldak', 'bartin', 'kastamonu', 'bolu', 'cankiri'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: true, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Karaman', citySlug: 'karaman', emoji: '🏛️', population: 250_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Ermenek'], budget: ['Sarıveliler', 'Mut', 'Ayrancı', 'Başyayla'] }, specialties: ['bisküvi_sanayii', 'bozkır_iklimi'], neighbors: ['konya', 'mersin', 'antalya'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: true, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Kars', citySlug: 'kars', emoji: '❄️', population: 285_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Sarıkamış'], budget: ['Kağızman', 'Arpaçay', 'Digor', 'Selim'] }, specialties: ['ani_harabeleri_turizm', 'gravyer_peyniri', 'çok_sert_kış'], neighbors: ['erzurum', 'agri', 'igdir', 'ardahan'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Kastamonu', citySlug: 'kastamonu', emoji: '🌲', population: 380_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: true, humid: true, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Tosya', 'Taşköprü'], budget: ['İnebolu', 'Araç', 'Cide', 'Devrekani'] }, specialties: ['orman_şehri', 'el_sanatları'], neighbors: ['sinop', 'cankiri', 'corum', 'karabuk', 'bartin'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Kayseri', citySlug: 'kayseri', emoji: '🎿', population: 1_400_000, popTier: 'medium' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 72, priceMin: 55, priceMax: 100, koltukAvg: 210, yorganAvg: 115, perdeAvg: 23, districts: { premium: ['Kocasinan', 'Melikgazi'], mid: ['Talas', 'İncesu'], budget: ['Develi', 'Yahyalı', 'Bünyan', 'Pınarbaşı'] }, specialties: ['bünyan_halısı', 'erciyes_kayak', 'sanayi_şehri', 'pastırma'], neighbors: ['sivas', 'yozgat', 'nevsehir', 'nigde', 'adana', 'kahramanmaras'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: true, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Kilis', citySlug: 'kilis', emoji: '🫒', population: 140_000, popTier: 'tiny' as PopTier, climate: 'semiarid' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Musabeyli'], budget: ['Elbeyli', 'Polateli'] }, specialties: ['zeytinyağı', 'sınır_şehri'], neighbors: ['gaziantep', 'hatay'], winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Nisan-Mayıs' },
    { city: 'Kırıkkale', citySlug: 'kirikkale', emoji: '🏭', population: 280_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Yahşihan', 'Keskin'], budget: ['Sulakyurt', 'Bahşılı', 'Delice', 'Balışeyh'] }, specialties: ['silah_sanayii', 'ankara_yakınlığı'], neighbors: ['ankara', 'kirsehir', 'yozgat', 'cankiri'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: true, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Kırklareli', citySlug: 'kirklareli', emoji: '🌾', population: 360_000, popTier: 'small' as PopTier, climate: 'marmara' as ClimateZone, coastal: true, humid: true, avgPrice: 60, priceMin: 42, priceMax: 82, koltukAvg: 175, yorganAvg: 95, perdeAvg: 19, districts: { premium: ['Merkez'], mid: ['Lüleburgaz', 'Babaeski'], budget: ['Vize', 'Pınarhisar', 'Demirköy', 'Kofçaz'] }, specialties: ['trakya_rüzgârı', 'sınır_şehri'], neighbors: ['edirne', 'tekirdag', 'istanbul'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Kırşehir', citySlug: 'kirsehir', emoji: '🎵', population: 240_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Kaman'], budget: ['Mucur', 'Çiçekdağı', 'Akpınar', 'Boztepe'] }, specialties: ['neşet_ertaş_şehri', 'termal_kaynaklar'], neighbors: ['ankara', 'aksaray', 'nevsehir', 'yozgat', 'kirikkale'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Kütahya', citySlug: 'kutahya', emoji: '🏺', population: 580_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Tavşanlı', 'Simav', 'Gediz'], budget: ['Emet', 'Domaniç', 'Altıntaş', 'Hisarcık'] }, specialties: ['çini_başkenti', 'termal_turizm'], neighbors: ['eskisehir', 'bursa', 'bilecik', 'afyonkarahisar', 'manisa', 'usak'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Mardin', citySlug: 'mardin', emoji: '🏰', population: 840_000, popTier: 'medium' as PopTier, climate: 'semiarid' as ClimateZone, coastal: false, humid: false, avgPrice: 52, priceMin: 35, priceMax: 72, koltukAvg: 155, yorganAvg: 87, perdeAvg: 16, districts: { premium: ['Artuklu'], mid: ['Kızıltepe', 'Midyat', 'Nusaybin'], budget: ['Derik', 'Mazıdağı', 'Ömerli', 'Savur'] }, specialties: ['taş_evler_turizm', 'süryanice_kültür', 'sıcak_kuru'], neighbors: ['sanliurfa', 'diyarbakir', 'batman', 'siirt', 'sirnak'], winterRisk: false, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Nisan-Mayıs, Ekim', peakMonths: 'Nisan-Mayıs' },
    { city: 'Muş', citySlug: 'mus', emoji: '🌄', population: 410_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Malazgirt', 'Bulanık'], budget: ['Varto', 'Hasköy', 'Korkut'] }, specialties: ['malazgirt_savaşı_tarihi', 'sert_kış'], neighbors: ['van', 'bitlis', 'bingol', 'diyarbakir', 'agri'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Nevşehir', citySlug: 'nevsehir', emoji: '🎈', population: 300_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 62, priceMin: 42, priceMax: 85, koltukAvg: 180, yorganAvg: 100, perdeAvg: 20, districts: { premium: ['Merkez'], mid: ['Ürgüp', 'Avanos', 'Göreme'], budget: ['Derinkuyu', 'Kozaklı', 'Hacıbektaş', 'Acıgöl'] }, specialties: ['kapadokya_turizm', 'otel_halı_temizliği', 'çömlek'], neighbors: ['aksaray', 'kayseri', 'nigde', 'kirsehir', 'yozgat'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Niğde', citySlug: 'nigde', emoji: '🏔️', population: 360_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Bor'], budget: ['Çamardı', 'Ulukışla', 'Altunhisar', 'Çiftlik'] }, specialties: ['aladağlar', 'patates_üretimi'], neighbors: ['aksaray', 'nevsehir', 'kayseri', 'mersin', 'adana', 'konya'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Osmaniye', citySlug: 'osmaniye', emoji: '🏰', population: 540_000, popTier: 'small' as PopTier, climate: 'mediterranean' as ClimateZone, coastal: false, humid: true, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Kadirli', 'Düziçi'], budget: ['Bahçe', 'Hasanbeyli', 'Sumbas', 'Toprakkale'] }, specialties: ['çukurova_geçiş'], neighbors: ['adana', 'hatay', 'gaziantep', 'kahramanmaras'], winterRisk: false, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mart-Mayıs, Ekim-Kasım', peakMonths: 'Mayıs-Haziran' },
    { city: 'Rize', citySlug: 'rize', emoji: '🍵', population: 330_000, popTier: 'small' as PopTier, climate: 'blacksea' as ClimateZone, coastal: true, humid: true, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Çamlıhemşin', 'Ardeşen'], budget: ['Pazar', 'Fındıklı', 'İkizdere', 'Güneysu'] }, specialties: ['türkiye_en_yağışlı', 'çay_üretimi', 'yüksek_nem'], neighbors: ['trabzon', 'artvin'], winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: false, bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Siirt', citySlug: 'siirt', emoji: '🏔️', population: 330_000, popTier: 'small' as PopTier, climate: 'semiarid' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Kurtalan'], budget: ['Baykan', 'Şirvan', 'Pervari', 'Eruh'] }, specialties: ['battaniye_üretimi', 'fıstık_üretimi'], neighbors: ['batman', 'bitlis', 'sirnak', 'van', 'diyarbakir'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Nisan-Mayıs, Ekim', peakMonths: 'Nisan-Mayıs' },
    { city: 'Sinop', citySlug: 'sinop', emoji: '⛵', population: 210_000, popTier: 'tiny' as PopTier, climate: 'blacksea' as ClimateZone, coastal: true, humid: true, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Boyabat', 'Gerze'], budget: ['Durağan', 'Ayancık', 'Türkeli', 'Erfelek'] }, specialties: ['türkiye_en_mutlu_şehir', 'hamsi_festivali'], neighbors: ['samsun', 'kastamonu'], winterRisk: true, summerDry: false, tourismPeak: true, industrialDust: false, bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Şırnak', citySlug: 'sirnak', emoji: '⛰️', population: 530_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 48, priceMin: 32, priceMax: 65, koltukAvg: 140, yorganAvg: 80, perdeAvg: 15, districts: { premium: ['Merkez'], mid: ['Cizre', 'Silopi'], budget: ['İdil', 'Uludere', 'Beytüşşebap', 'Güçlükonak'] }, specialties: ['sınır_şehri', 'sert_kış'], neighbors: ['hakkari', 'siirt', 'mardin'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Eylül', peakMonths: 'Haziran-Temmuz' },
    { city: 'Tokat', citySlug: 'tokat', emoji: '🌾', population: 600_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Erbaa', 'Niksar', 'Turhal'], budget: ['Zile', 'Almus', 'Reşadiye', 'Artova'] }, specialties: ['yazma_baskı', 'tokat_kebabı'], neighbors: ['samsun', 'amasya', 'sivas', 'ordu'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Tunceli', citySlug: 'tunceli', emoji: '🐺', population: 85_000, popTier: 'tiny' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 52, priceMin: 35, priceMax: 70, koltukAvg: 155, yorganAvg: 87, perdeAvg: 16, districts: { premium: ['Merkez'], mid: ['Pertek', 'Çemişgezek'], budget: ['Hozat', 'Ovacık', 'Mazgirt', 'Pülümür'] }, specialties: ['munzur_vadisi', 'doğa_turizmi'], neighbors: ['elazig', 'bingol', 'erzincan'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Haziran-Ağustos', peakMonths: 'Haziran-Temmuz' },
    { city: 'Uşak', citySlug: 'usak', emoji: '🧶', population: 370_000, popTier: 'small' as PopTier, climate: 'transitional' as ClimateZone, coastal: false, humid: false, avgPrice: 58, priceMin: 40, priceMax: 78, koltukAvg: 170, yorganAvg: 92, perdeAvg: 18, districts: { premium: ['Merkez'], mid: ['Banaz', 'Eşme'], budget: ['Sivaslı', 'Ulubey', 'Karahallı'] }, specialties: ['uşak_halısı', 'deri_sanayii'], neighbors: ['kutahya', 'afyonkarahisar', 'denizli', 'manisa'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Yalova', citySlug: 'yalova', emoji: '🌸', population: 275_000, popTier: 'small' as PopTier, climate: 'marmara' as ClimateZone, coastal: true, humid: true, avgPrice: 78, priceMin: 55, priceMax: 110, koltukAvg: 220, yorganAvg: 125, perdeAvg: 25, districts: { premium: ['Merkez'], mid: ['Çiftlikköy', 'Çınarcık'], budget: ['Termal', 'Altınova', 'Armutlu'] }, specialties: ['termal_turizm', 'istanbul_yakınlığı'], neighbors: ['istanbul', 'bursa', 'kocaeli'], winterRisk: true, summerDry: true, tourismPeak: true, industrialDust: false, bestMonths: 'Nisan-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Yozgat', citySlug: 'yozgat', emoji: '🌲', population: 420_000, popTier: 'small' as PopTier, climate: 'continental' as ClimateZone, coastal: false, humid: false, avgPrice: 55, priceMin: 38, priceMax: 75, koltukAvg: 160, yorganAvg: 90, perdeAvg: 17, districts: { premium: ['Merkez'], mid: ['Sorgun', 'Yerköy', 'Boğazlıyan'], budget: ['Akdağmadeni', 'Çekerek', 'Sarıkaya', 'Şefaatli'] }, specialties: ['çamlık_milli_parkı', 'bozok_üniversitesi'], neighbors: ['ankara', 'kayseri', 'sivas', 'tokat', 'corum', 'kirikkale', 'kirsehir', 'nevsehir'], winterRisk: true, summerDry: true, tourismPeak: false, industrialDust: false, bestMonths: 'Mayıs-Haziran, Eylül', peakMonths: 'Mayıs-Haziran' },
    { city: 'Zonguldak', citySlug: 'zonguldak', emoji: '⛏️', population: 600_000, popTier: 'small' as PopTier, climate: 'blacksea' as ClimateZone, coastal: true, humid: true, avgPrice: 62, priceMin: 42, priceMax: 85, koltukAvg: 180, yorganAvg: 100, perdeAvg: 20, districts: { premium: ['Merkez'], mid: ['Ereğli', 'Çaycuma', 'Devrek'], budget: ['Alaplı', 'Gökçebey', 'Kilimli', 'Kozlu'] }, specialties: ['maden_şehri', 'kömür_tozu', 'karadeniz_nemi'], neighbors: ['bartin', 'karabuk', 'duzce', 'bolu'], winterRisk: true, summerDry: false, tourismPeak: false, industrialDust: true, bestMonths: 'Temmuz-Ağustos', peakMonths: 'Haziran-Temmuz' },
  ],
];

export function getCityMeta(citySlug: string): CityMeta | undefined {
  return cityData.find(c => c.citySlug === citySlug);
}
