// ProTakip Marketplace — Service Worker
// Cache stratejisi: Network-first for API, Cache-first for static assets

const CACHE_NAME = 'mp-v1';
const STATIC_CACHE = 'mp-static-v1';

// Cache'lenecek statik dosyalar
const STATIC_ASSETS = [
  '/',
  '/firmalar',
  '/giris',
];

// Install — statik asset'leri cache'le
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch stratejisi
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API istekleri — network-first, cache fallback
  if (url.pathname.startsWith('/api') || url.origin.includes('api.protakip.com')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Next.js static assets — cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Brand assets — cache-first
  if (url.pathname.startsWith('/brands/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML sayfalar — network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Diğer — network-first
  event.respondWith(networkFirst(request));
});

// Network-first stratejisi
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Offline fallback for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/');
    }
    return new Response('Offline', { status: 503 });
  }
}

// Cache-first stratejisi
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}
