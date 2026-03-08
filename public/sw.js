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

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'ProTakip';
    const options = {
      body: data.body || '',
      icon: '/brands/hali_sepeti/icon-192.png',
      badge: '/brands/hali_sepeti/icon-192.png',
      tag: data.tag || 'default',
      data: {
        trackingCode: data.trackingCode || '',
        eventKey: data.eventKey || '',
        orderCode: data.orderCode || '',
        url: data.url || '',
      },
      vibrate: [100, 50, 100],
      actions: data.trackingCode
        ? [{ action: 'track', title: 'Takip Et' }]
        : [],
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    // Invalid payload — ignore
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};

  let url = '/hesabim/siparislerim';
  if (data.url) {
    url = data.url;
  } else if (data.trackingCode) {
    url = `/takip/${data.trackingCode}`;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if available
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new tab
      return clients.openWindow(url);
    })
  );
});

// Fetch stratejisi
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // POST/PUT/DELETE — cache desteklemez, SW karışmasın
  if (request.method !== 'GET') return;

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
