export type DesignPersona = 'minimal' | 'bold' | 'warm' | 'tech' | 'classic' | 'nature';
export type HeroVariant = 'fullbleed' | 'split' | 'centered' | 'video' | 'animated-search';
export type CardVariant = 'flat' | 'elevated' | 'glass' | 'bordered' | 'accent-top';
export type NavVariant = 'transparent' | 'solid' | 'pill-tabs' | 'slim';
export type FooterVariant = 'minimal' | 'rich' | 'mega';
export type AnimationStyle = 'subtle' | 'playful' | 'professional' | 'dramatic';
export type BackgroundPattern = 'solid' | 'gradient' | 'mesh' | 'dots' | 'waves';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ShadowIntensity = 'none' | 'subtle' | 'medium' | 'dramatic';

export interface BrandColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  rating: string;
  gradient?: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
  headingWeight: number;
  bodyWeight: number;
}

export interface BrandSeo {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  socialLinks?: Record<string, string>;
}

export interface BrandFeatures {
  darkMode: boolean;
  cityLandingPages: boolean;
  aiSearch: boolean;
  priceComparison: boolean;
  trustBadges: boolean;
}

export interface BrandTheme {
  // Kimlik
  code: string;
  name: string;
  domain: string;
  logoUrl: string;
  faviconUrl: string;

  // Tasarım seçimleri
  persona: DesignPersona;
  heroVariant: HeroVariant;
  cardVariant: CardVariant;
  navVariant: NavVariant;
  footerVariant: FooterVariant;
  animationStyle: AnimationStyle;
  backgroundPattern: BackgroundPattern;

  // Görsel
  colors: BrandColors;
  darkColors?: Partial<BrandColors>;
  fonts: BrandFonts;
  borderRadius: BorderRadius;
  shadowIntensity: ShadowIntensity;

  // İçerik
  seo: BrandSeo;
  features: BrandFeatures;
  categoryFilter: number[];
}
