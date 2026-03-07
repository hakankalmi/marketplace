import type { BrandTheme } from '@/types/brand';

/**
 * Bold persona — Yemeksepeti tarzı: güçlü renkler, büyük tipografi,
 * split hero, elevated kartlar, solid navbar.
 */
export const boldPreset: Omit<BrandTheme, 'code' | 'name' | 'domain' | 'logoUrl' | 'faviconUrl' | 'seo' | 'categoryFilter'> = {
  persona: 'bold',
  heroVariant: 'split',
  cardVariant: 'elevated',
  navVariant: 'solid',
  footerVariant: 'rich',
  animationStyle: 'playful',
  backgroundPattern: 'solid',

  colors: {
    primary: '#E11D48',
    primaryLight: '#FFF1F2',
    primaryDark: '#BE123C',
    secondary: '#1E293B',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceHover: '#F1F5F9',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    rating: '#F59E0B',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #F59E0B 100%)',
  },

  darkColors: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
  },

  fonts: {
    heading: 'Poppins',
    body: 'Inter',
    headingWeight: 700,
    bodyWeight: 400,
  },

  borderRadius: 'lg',
  shadowIntensity: 'medium',

  features: {
    darkMode: true,
    cityLandingPages: true,
    aiSearch: false,
    priceComparison: false,
    trustBadges: true,
  },
};
