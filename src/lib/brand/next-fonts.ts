import {
  Poppins,
  Inter,
  DM_Serif_Display,
  DM_Sans,
  Space_Grotesk,
  Merriweather,
  Source_Sans_3,
  Playfair_Display,
  Lato,
} from 'next/font/google';
import type { BrandFonts } from '@/types/brand';

/*
 * All Google Fonts used across brand presets, loaded via next/font.
 * Self-hosted from Next.js server — eliminates render-blocking Google Fonts CSS.
 * Each font is assigned a CSS variable; only the active brand's fonts are
 * referenced in CSS, so browsers download only what's needed.
 */

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-dm-serif-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans-3',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

/** Map: Google Fonts display name → next/font instance */
const fontInstances: Record<string, { variable: string }> = {
  Poppins: poppins,
  Inter: inter,
  'DM Serif Display': dmSerifDisplay,
  'DM Sans': dmSans,
  'Space Grotesk': spaceGrotesk,
  Merriweather: merriweather,
  'Source Sans 3': sourceSans3,
  'Playfair Display': playfairDisplay,
  Lato: lato,
};

/**
 * Map: Google Fonts display name → CSS variable name.
 * Used by css-injector to reference `var(--font-xxx)` instead of raw font names.
 */
export const fontVarMap: Record<string, string> = {
  Poppins: '--font-poppins',
  Inter: '--font-inter',
  'DM Serif Display': '--font-dm-serif-display',
  'DM Sans': '--font-dm-sans',
  'Space Grotesk': '--font-space-grotesk',
  Merriweather: '--font-merriweather',
  'Source Sans 3': '--font-source-sans-3',
  'Playfair Display': '--font-playfair-display',
  Lato: '--font-lato',
};

/**
 * Returns space-separated CSS variable class names for the active brand fonts.
 * Apply to `<html>` element so CSS variables are available globally.
 */
export function getBrandFontClassNames(fonts: BrandFonts): string {
  const classes: string[] = [];

  const heading = fontInstances[fonts.heading];
  if (heading) classes.push(heading.variable);

  if (fonts.body !== fonts.heading) {
    const body = fontInstances[fonts.body];
    if (body) classes.push(body.variable);
  }

  return classes.join(' ');
}
