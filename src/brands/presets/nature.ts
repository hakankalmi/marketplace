import type { BrandTheme } from '@/types/brand';

/**
 * Nature persona — Organik tarzı: doğal renkler, büyük yuvarlaklıklar,
 * split hero, elevated kartlar, transparent nav.
 */
export const naturePreset: Omit<BrandTheme, 'code' | 'name' | 'domain' | 'logoUrl' | 'faviconUrl' | 'seo' | 'categoryFilter'> = {
  persona: 'nature',
  heroVariant: 'split',
  cardVariant: 'elevated',
  navVariant: 'transparent',
  footerVariant: 'rich',
  animationStyle: 'subtle',
  backgroundPattern: 'solid',

  colors: {
    primary: '#059669',
    primaryLight: '#ECFDF5',
    primaryDark: '#047857',
    secondary: '#78716C',
    accent: '#84CC16',
    background: '#FAFDF7',
    surface: '#F5F9F0',
    surfaceHover: '#EDF5E6',
    text: '#1C1917',
    textMuted: '#78716C',
    border: '#D6D3D1',
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    rating: '#FACC15',
    gradient: 'linear-gradient(135deg, #059669 0%, #84CC16 100%)',
  },

  darkColors: {
    background: '#1C1917',
    surface: '#292524',
    surfaceHover: '#44403C',
    text: '#FAFAF9',
    textMuted: '#A8A29E',
    border: '#44403C',
  },

  fonts: {
    heading: 'Playfair Display',
    body: 'Lato',
    headingWeight: 700,
    bodyWeight: 400,
  },

  borderRadius: '2xl',
  shadowIntensity: 'subtle',

  features: {
    darkMode: true,
    cityLandingPages: true,
    aiSearch: false,
    priceComparison: false,
    trustBadges: true,
  },
};
