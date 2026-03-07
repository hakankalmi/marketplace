import type { BrandTheme } from '@/types/brand';

/**
 * Warm persona — Airbnb tarzı: yumuşak renkler, yuvarlak köşeler,
 * centered hero, pill-tabs nav, yumuşak gölgeler.
 */
export const warmPreset: Omit<BrandTheme, 'code' | 'name' | 'domain' | 'logoUrl' | 'faviconUrl' | 'seo' | 'categoryFilter'> = {
  persona: 'warm',
  heroVariant: 'centered',
  cardVariant: 'elevated',
  navVariant: 'pill-tabs',
  footerVariant: 'rich',
  animationStyle: 'subtle',
  backgroundPattern: 'solid',

  colors: {
    primary: '#E85D04',
    primaryLight: '#FFF4ED',
    primaryDark: '#C44D03',
    secondary: '#6D6875',
    accent: '#B5838D',
    background: '#FFFBF5',
    surface: '#FFF8F0',
    surfaceHover: '#FFF0E0',
    text: '#2B2D42',
    textMuted: '#8D99AE',
    border: '#EDE0D4',
    success: '#2D6A4F',
    warning: '#E9C46A',
    error: '#D62828',
    rating: '#F4A261',
    gradient: 'linear-gradient(135deg, #E85D04 0%, #F4A261 100%)',
  },

  darkColors: {
    background: '#1A1A2E',
    surface: '#2B2D42',
    surfaceHover: '#3D405B',
    text: '#EDF2F4',
    textMuted: '#8D99AE',
    border: '#3D405B',
  },

  fonts: {
    heading: 'DM Serif Display',
    body: 'DM Sans',
    headingWeight: 400,
    bodyWeight: 400,
  },

  borderRadius: 'xl',
  shadowIntensity: 'subtle',

  features: {
    darkMode: true,
    cityLandingPages: true,
    aiSearch: false,
    priceComparison: false,
    trustBadges: true,
  },
};
