/** Türkiye illeri ve popüler ilçeleri — hero autocomplete için */

export interface LocationItem {
  label: string;
  city: string;
  district?: string;
  type: 'city' | 'district';
}

const citiesWithDistricts: Record<string, string[]> = {
  'Adana': ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam', 'Ceyhan', 'Kozan'],
  'Adıyaman': ['Merkez', 'Kahta', 'Besni', 'Gölbaşı'],
  'Afyonkarahisar': ['Merkez', 'Sandıklı', 'Dinar', 'Bolvadin'],
  'Ağrı': ['Merkez', 'Patnos', 'Doğubayazıt'],
  'Aksaray': ['Merkez', 'Ortaköy'],
  'Amasya': ['Merkez', 'Merzifon', 'Suluova'],
  'Ankara': ['Çankaya', 'Keçiören', 'Mamak', 'Etimesgut', 'Sincan', 'Yenimahalle', 'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı'],
  'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 'Kumluca', 'Kaş'],
  'Ardahan': ['Merkez'],
  'Artvin': ['Merkez', 'Hopa', 'Arhavi'],
  'Aydın': ['Efeler', 'Nazilli', 'Söke', 'Kuşadası', 'Didim', 'İncirliova'],
  'Balıkesir': ['Altıeylül', 'Karesi', 'Bandırma', 'Edremit', 'Gönen', 'Ayvalık'],
  'Bartın': ['Merkez'],
  'Batman': ['Merkez', 'Sason', 'Kozluk'],
  'Bayburt': ['Merkez'],
  'Bilecik': ['Merkez', 'Bozüyük', 'Söğüt'],
  'Bingöl': ['Merkez', 'Genç', 'Solhan'],
  'Bitlis': ['Merkez', 'Tatvan', 'Ahlat'],
  'Bolu': ['Merkez', 'Gerede', 'Mudurnu'],
  'Burdur': ['Merkez', 'Bucak'],
  'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'İnegöl', 'Gemlik', 'Mudanya', 'Gürsu', 'Kestel', 'Mustafakemalpaşa'],
  'Çanakkale': ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Ayvacık'],
  'Çankırı': ['Merkez'],
  'Çorum': ['Merkez', 'Osmancık', 'Sungurlu', 'İskilip'],
  'Denizli': ['Merkezefendi', 'Pamukkale', 'Çivril', 'Acıpayam', 'Tavas'],
  'Diyarbakır': ['Bağlar', 'Kayapınar', 'Yenişehir', 'Sur', 'Bismil', 'Ergani', 'Silvan'],
  'Düzce': ['Merkez', 'Akçakoca'],
  'Edirne': ['Merkez', 'Keşan', 'Uzunköprü'],
  'Elazığ': ['Merkez', 'Kovancılar', 'Karakoçan'],
  'Erzincan': ['Merkez', 'Üzümlü'],
  'Erzurum': ['Yakutiye', 'Palandöken', 'Aziziye', 'Oltu', 'Horasan'],
  'Eskişehir': ['Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler'],
  'Gaziantep': ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Nurdağı'],
  'Giresun': ['Merkez', 'Bulancak', 'Espiye'],
  'Gümüşhane': ['Merkez', 'Kelkit'],
  'Hakkari': ['Merkez', 'Yüksekova', 'Çukurca'],
  'Hatay': ['Antakya', 'İskenderun', 'Defne', 'Samandağ', 'Dörtyol', 'Kırıkhan'],
  'Iğdır': ['Merkez'],
  'Isparta': ['Merkez', 'Yalvaç', 'Eğirdir'],
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Bakırköy', 'Ataşehir', 'Üsküdar', 'Maltepe', 'Pendik', 'Kartal', 'Tuzla', 'Sultanbeyli', 'Ümraniye', 'Şişli', 'Beyoğlu', 'Fatih', 'Eyüpsultan', 'Sarıyer', 'Beykoz', 'Başakşehir', 'Küçükçekmece', 'Bağcılar', 'Bahçelievler', 'Güngören', 'Esenler', 'Bayrampaşa', 'Gaziosmanpaşa', 'Sultangazi', 'Avcılar', 'Esenyurt', 'Beylikdüzü', 'Büyükçekmece', 'Çekmeköy', 'Sancaktepe', 'Arnavutköy', 'Silivri', 'Çatalca', 'Adalar', 'Şile'],
  'İzmir': ['Konak', 'Bornova', 'Buca', 'Karşıyaka', 'Bayraklı', 'Çiğli', 'Gaziemir', 'Karabağlar', 'Narlıdere', 'Balçova', 'Torbalı', 'Menemen', 'Bergama', 'Ödemiş', 'Tire', 'Kemalpaşa', 'Aliağa'],
  'Kahramanmaraş': ['Onikişubat', 'Dulkadiroğlu', 'Elbistan', 'Afşin', 'Türkoğlu', 'Göksun'],
  'Karabük': ['Merkez', 'Safranbolu'],
  'Karaman': ['Merkez', 'Ermenek'],
  'Kars': ['Merkez', 'Sarıkamış'],
  'Kastamonu': ['Merkez', 'Tosya', 'Taşköprü', 'İnebolu'],
  'Kayseri': ['Melikgazi', 'Kocasinan', 'Talas', 'Hacılar', 'İncesu', 'Develi'],
  'Kilis': ['Merkez'],
  'Kırıkkale': ['Merkez', 'Keskin'],
  'Kırklareli': ['Merkez', 'Lüleburgaz', 'Babaeski'],
  'Kırşehir': ['Merkez', 'Kaman'],
  'Kocaeli': ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Derince', 'Gölcük', 'Kartepe', 'Başiskele', 'Çayırova', 'Dilovası'],
  'Konya': ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Cihanbeyli'],
  'Kütahya': ['Merkez', 'Tavşanlı', 'Simav', 'Gediz'],
  'Malatya': ['Battalgazi', 'Yeşilyurt', 'Darende', 'Doğanşehir', 'Akçadağ'],
  'Manisa': ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu', 'Salihli', 'Soma'],
  'Mardin': ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik'],
  'Mersin': ['Yenişehir', 'Mezitli', 'Toroslar', 'Akdeniz', 'Tarsus', 'Silifke', 'Erdemli', 'Anamur'],
  'Muğla': ['Menteşe', 'Bodrum', 'Fethiye', 'Marmaris', 'Milas', 'Dalaman', 'Ortaca', 'Datça', 'Köyceğiz'],
  'Muş': ['Merkez', 'Bulanık', 'Malazgirt'],
  'Nevşehir': ['Merkez', 'Ürgüp', 'Avanos'],
  'Niğde': ['Merkez', 'Bor'],
  'Ordu': ['Altınordu', 'Ünye', 'Fatsa', 'Perşembe'],
  'Osmaniye': ['Merkez', 'Kadirli', 'Düziçi'],
  'Rize': ['Merkez', 'Çamlıhemşin', 'Ardeşen', 'Pazar'],
  'Sakarya': ['Adapazarı', 'Serdivan', 'Erenler', 'Arifiye', 'Hendek', 'Sapanca'],
  'Samsun': ['İlkadım', 'Atakum', 'Canik', 'Tekkeköy', 'Bafra', 'Çarşamba', 'Terme'],
  'Şanlıurfa': ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Suruç'],
  'Siirt': ['Merkez', 'Kurtalan'],
  'Sinop': ['Merkez', 'Boyabat'],
  'Sivas': ['Merkez', 'Şarkışla', 'Suşehri', 'Zara'],
  'Şırnak': ['Merkez', 'Cizre', 'Silopi', 'İdil'],
  'Tekirdağ': ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Ergene', 'Kapaklı', 'Malkara'],
  'Tokat': ['Merkez', 'Erbaa', 'Turhal', 'Niksar', 'Zile'],
  'Trabzon': ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra', 'Sürmene'],
  'Tunceli': ['Merkez', 'Pertek'],
  'Uşak': ['Merkez', 'Banaz', 'Eşme'],
  'Van': ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Gevaş'],
  'Yalova': ['Merkez', 'Çınarcık', 'Altınova'],
  'Yozgat': ['Merkez', 'Sorgun', 'Yerköy', 'Boğazlıyan'],
  'Zonguldak': ['Merkez', 'Ereğli', 'Çaycuma', 'Devrek', 'Alaplı'],
};

let _cachedLocations: LocationItem[] | null = null;

export function getAllLocations(): LocationItem[] {
  if (_cachedLocations) return _cachedLocations;

  const items: LocationItem[] = [];
  for (const [city, districts] of Object.entries(citiesWithDistricts)) {
    items.push({ label: city, city, type: 'city' });
    for (const district of districts) {
      if (district === 'Merkez') continue;
      items.push({
        label: `${district}, ${city}`,
        city,
        district,
        type: 'district',
      });
    }
  }
  _cachedLocations = items;
  return items;
}

export function searchLocations(query: string, limit = 8): LocationItem[] {
  if (!query || query.length < 2) return [];
  const q = query.toLocaleLowerCase('tr-TR');
  const all = getAllLocations();

  // Önce il eşleşmeleri, sonra ilçe
  const cityMatches: LocationItem[] = [];
  const districtMatches: LocationItem[] = [];

  for (const item of all) {
    const lower = item.label.toLocaleLowerCase('tr-TR');
    if (lower.startsWith(q)) {
      if (item.type === 'city') cityMatches.push(item);
      else districtMatches.push(item);
    } else if (lower.includes(q)) {
      districtMatches.push(item);
    }
    if (cityMatches.length + districtMatches.length >= limit * 2) break;
  }

  return [...cityMatches, ...districtMatches].slice(0, limit);
}
