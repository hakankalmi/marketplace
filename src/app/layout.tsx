import type { Metadata } from 'next';
import { getBrandConfig } from '@/brands';
import { generateCSSVariables, generateDarkCSSVariables } from '@/lib/brand/css-injector';
import { getGoogleFontsUrl } from '@/lib/brand/font-loader';
import { Providers } from './providers';
import './globals.css';

const brand = getBrandConfig();

export const metadata: Metadata = {
  title: brand.seo.metaTitle,
  description: brand.seo.metaDescription,
  icons: {
    icon: brand.faviconUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cssVars = generateCSSVariables(brand);
  const darkCssVars = generateDarkCSSVariables(brand);
  const fontsUrl = getGoogleFontsUrl(brand.fonts);

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={fontsUrl} rel="stylesheet" />
        <style
          dangerouslySetInnerHTML={{
            __html: `${cssVars}\n${darkCssVars}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-bg text-brand-text font-body antialiased">
        <Providers theme={brand}>{children}</Providers>
      </body>
    </html>
  );
}
