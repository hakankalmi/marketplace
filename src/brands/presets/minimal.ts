import type { BrandTheme } from '@/types/brand';

/**
 * Minimal persona — Apple tarzı: temiz çizgiler, geniş boşluklar,
 * fullbleed hero, flat kartlar, saydam navbar.
 */
export const minimalPreset: Omit<BrandTheme, 'code' | 'name' | 'domain' | 'logoUrl' | 'faviconUrl' | 'seo' | 'categoryFilter'> = {
  persona: 'minimal',
  heroVariant: 'fullbleed',
  cardVariant: 'flat',
  navVariant: 'transparent',
  footerVariant: 'minimal',
  animationStyle: 'subtle',
  backgroundPattern: 'solid',

  colors: {
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    primaryDark: '#1D4ED8',
    secondary: '#475569',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceHover: '#F3F4F6',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    rating: '#F59E0B',
  },

  darkColors: {
    background: '#111827',
    surface: '#1F2937',
    surfaceHover: '#374151',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    border: '#374151',
  },

  fonts: {
    heading: 'Inter',
    body: 'Inter',
    headingWeight: 600,
    bodyWeight: 400,
  },

  borderRadius: 'sm',
  shadowIntensity: 'subtle',

  features: {
    darkMode: true,
    cityLandingPages: true,
    aiSearch: false,
    priceComparison: false,
    trustBadges: false,
  },
};
