import type { Metadata } from 'next';
import { getBrandConfig } from '@/brands';
import { generateCSSVariables, generateDarkCSSVariables } from '@/lib/brand/css-injector';
import { getBrandFontClassNames } from '@/lib/brand/next-fonts';
import { Providers } from './providers';
import { ServiceWorkerRegister } from '@/components/shared/sw-register';
import { BottomNav } from '@/components/nav/BottomNav';
import { GtmLoader } from '@/components/shared/GtmLoader';
import './globals.css';

const brand = getBrandConfig();

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: brand.seo.metaTitle,
    template: `%s | ${brand.name}`,
  },
  description: brand.seo.metaDescription,
  icons: {
    icon: brand.faviconUrl,
  },
  openGraph: {
    type: 'website',
    siteName: brand.name,
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cssVars = generateCSSVariables(brand);
  const darkCssVars = generateDarkCSSVariables(brand);
  const fontClassNames = getBrandFontClassNames(brand.fonts);

  return (
    <html lang="tr" className={fontClassNames} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.protakip.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <style
          dangerouslySetInnerHTML={{
            __html: `${cssVars}\n${darkCssVars}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-bg text-brand-text font-body antialiased">
        <Providers theme={brand}>
          <GtmLoader />
          {children}
          <BottomNav />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
