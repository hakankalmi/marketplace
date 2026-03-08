'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.protakip.com';

export function GtmLoader() {
  const [gtmId, setGtmId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGtmId() {
      try {
        const res = await fetch(`${API_URL}/api/mp/config`);
        if (res.ok) {
          const data = await res.json();
          if (data.googleTagManagerId) {
            setGtmId(data.googleTagManagerId);
          }
        }
      } catch {
        // GTM is non-critical — silently fail
      }
    }
    fetchGtmId();
  }, []);

  if (!gtmId) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

/** Push an event to the GTM dataLayer */
export function gtmEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as unknown as { dataLayer: unknown[] }).dataLayer =
      (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
      event,
      ...data,
    });
  }
}
