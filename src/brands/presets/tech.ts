import type { BrandTheme } from '@/types/brand';

/**
 * Tech persona — Uber tarzı: koyu tonlar, keskin hatlar,
 * fullbleed hero, glass kartlar, slim nav.
 */
export const techPreset: Omit<BrandTheme, 'code' | 'name' | 'domain' | 'logoUrl' | 'faviconUrl' | 'seo' | 'categoryFilter'> = {
  persona: 'tech',
  heroVariant: 'fullbleed',
  cardVariant: 'glass',
  navVariant: 'slim',
  footerVariant: 'minimal',
  animationStyle: 'dramatic',
  backgroundPattern: 'gradient',

  colors: {
    primary: '#6366F1',
    primaryLight: '#EEF2FF',
    primaryDark: '#4F46E5',
    secondary: '#0F172A',
    accent: '#06B6D4',
    background: '#FAFAFA',
    surface: '#F5F5F5',
    surfaceHover: '#EEEEEE',
    text: '#09090B',
    textMuted: '#71717A',
    border: '#E4E4E7',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    rating: '#F59E0B',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
  },

  darkColors: {
    background: '#09090B',
    surface: '#18181B',
    surfaceHover: '#27272A',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    border: '#27272A',
  },

  fonts: {
    heading: 'Space Grotesk',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
  },

  borderRadius: 'none',
  shadowIntensity: 'dramatic',

  features: {
    darkMode: true,
    cityLandingPages: true,
    aiSearch: false,
    priceComparison: false,
    trustBadges: false,
  },
};
