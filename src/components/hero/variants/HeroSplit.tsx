'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Star, Shield, Clock, CheckCircle } from 'lucide-react';
import { useBrand } from '@/lib/brand/context';
import { Button } from '@/components/ui/button';
import { slugify } from '@/lib/utils';
import { CityAutocomplete } from '@/components/search/CityAutocomplete';
import type { LocationItem } from '@/lib/turkey-locations';

export function HeroSplit() {
  const theme = useBrand();
  const router = useRouter();

  const handleCitySelect = (item: LocationItem) => {
    router.push(`/${slugify(item.city)}/hali-yikama`);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
      }}
    >
      {/* Dekoratif daireler */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: theme.colors.accent }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: '#fff' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sol: İçerik */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {theme.seo.heroTitle}
            </motion.h1>

            <motion.p
              className="mt-5 text-lg sm:text-xl text-white/80 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {theme.seo.heroSubtitle}
            </motion.p>

            {/* Arama Kutusu */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CityAutocomplete
                onSelect={handleCitySelect}
                placeholder="Şehir veya ilçe ara..."
                className="flex-1"
              />
              <Button
                size="lg"
                onClick={() => router.push('/firmalar')}
                className="w-full sm:w-auto !bg-white !text-gray-900 hover:!bg-gray-100 !shadow-lg !py-4 !text-base !font-semibold"
              >
                <Search size={18} />
                Tüm Firmalar
              </Button>
            </motion.div>

            {/* Güven Sayaçları */}
            <motion.div
              className="mt-10 flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[
                { value: '500+', label: 'Firma' },
                { value: '10,000+', label: 'Sipariş' },
                { value: '4.8', label: 'Ortalama Puan' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-heading font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Sağ: Güven Kartları */}
          <motion.div
            className="hidden lg:flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {[
              {
                icon: Shield,
                title: 'Güvenilir Firmalar',
                desc: 'Tüm firmalar doğrulanmış ve puanlanmış',
              },
              {
                icon: Star,
                title: 'Gerçek Yorumlar',
                desc: 'Müşteri deneyimlerini okuyun, doğru seçim yapın',
              },
              {
                icon: Clock,
                title: 'Hızlı Servis',
                desc: 'Ortalama 2 saat içinde firma dönüşü',
              },
              {
                icon: CheckCircle,
                title: 'Kolay Sipariş',
                desc: 'Tek tıkla sipariş, kapıda ödeme',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <item.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/70 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
