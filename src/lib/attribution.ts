/**
 * Ad Attribution Capture — gclid, fbclid, fbp, fbc, UTM parameters
 *
 * Captures attribution data from URL params and cookies on first visit.
 * Values are stored in localStorage (first-touch — never overwritten).
 * Sent to backend via X-Attribution header on OTP verify and order creation.
 */

const STORAGE_KEY = 'mp_attribution';

export interface AttributionData {
  gclid?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  capturedAt?: string;
}

/** Capture attribution from URL and cookies. Call on every page load. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  // Already captured — don't overwrite (first-touch attribution)
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as AttributionData;
      if (parsed.capturedAt) return;
    } catch { /* corrupted — re-capture */ }
  }

  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid');
  const fbclid = params.get('fbclid');
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  const utmTerm = params.get('utm_term');
  const utmContent = params.get('utm_content');

  // Only save if there's at least one attribution parameter
  if (!gclid && !fbclid && !utmSource) return;

  // Read Meta cookies (_fbp, _fbc)
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  const data: AttributionData = {
    ...(gclid && { gclid }),
    ...(fbclid && { fbclid }),
    ...(fbp && { fbp }),
    ...(fbc && { fbc }),
    ...(utmSource && { utmSource }),
    ...(utmMedium && { utmMedium }),
    ...(utmCampaign && { utmCampaign }),
    ...(utmTerm && { utmTerm }),
    ...(utmContent && { utmContent }),
    capturedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Get stored attribution data (for X-Attribution header). */
export function getAttribution(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}

/** Get attribution as JSON string for X-Attribution header. */
export function getAttributionHeader(): string | null {
  const data = getAttribution();
  if (!data) return null;
  return JSON.stringify(data);
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match?.[2];
}
