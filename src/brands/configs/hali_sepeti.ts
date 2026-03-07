import type { BrandTheme } from '@/types/brand';
import { boldPreset } from '../presets/bold';

export const haliSepetiConfig: BrandTheme = {
  ...boldPreset,

  code: 'hali_sepeti',
  name: 'Halı Yıkama Sepeti',
  domain: 'haliyikamasepeti.com',
  logoUrl: '/brands/hali_sepeti/logo.svg',
  faviconUrl: '/brands/hali_sepeti/favicon.ico',

  // Marka renkleri — sıcak kırmızı + altın
  colors: {
    ...boldPreset.colors,
    primary: '#DC2626',
    primaryLight: '#FEF2F2',
    primaryDark: '#B91C1C',
    accent: '#F59E0B',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
  },

  seo: {
    metaTitle: 'Halı Yıkama Sepeti — En İyi Halı Yıkama Firmaları',
    metaDescription:
      'Şehrinizde en güvenilir halı yıkama firmalarını karşılaştırın. Fiyatları görün, yorumları okuyun, hemen sipariş verin.',
    heroTitle: 'Halınız Tertemiz, Eviniz Pırıl Pırıl',
    heroSubtitle:
      'Şehrinizin en iyi halı yıkama firmalarını karşılaştırın, tek tıkla sipariş verin.',
    footerText: '© 2026 Halı Yıkama Sepeti. Tüm hakları saklıdır.',
    socialLinks: {
      instagram: 'https://instagram.com/haliyikamasepeti',
    },
  },

  categoryFilter: [],
};
