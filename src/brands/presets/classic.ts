import type { BrandTheme } from '@/types/brand';

/**
 * Classic persona — Trustpilot tarzı: profesyonel, güven odaklı,
 * centered hero, bordered kartlar, solid nav.
 */
export const classicPreset: Omit<BrandTheme, 'code' | 'name' | 'domain' | 'logoUrl' | 'faviconUrl' | 'seo' | 'categoryFilter'> = {
  persona: 'classic',
  heroVariant: 'centered',
  cardVariant: 'bordered',
  navVariant: 'solid',
  footerVariant: 'mega',
  animationStyle: 'professional',
  backgroundPattern: 'solid',

  colors: {
    primary: '#0369A1',
    primaryLight: '#E0F2FE',
    primaryDark: '#075985',
    secondary: '#334155',
    accent: '#0EA5E9',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceHover: '#F1F5F9',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#CBD5E1',
    success: '#16A34A',
    warning: '#CA8A04',
    error: '#DC2626',
    rating: '#EAB308',
  },

  darkColors: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    border: '#334155',
  },

  fonts: {
    heading: 'Merriweather',
    body: 'Source Sans 3',
    headingWeight: 700,
    bodyWeight: 400,
  },

  borderRadius: 'md',
  shadowIntensity: 'subtle',

  features: {
    darkMode: true,
    cityLandingPages: true,
    aiSearch: false,
    priceComparison: true,
    trustBadges: true,
  },
};
