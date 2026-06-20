const CACHE_NAME = 'akbari-savings-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/login',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Failed to pre-cache some assets during install:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests and avoid caching API/Auth routes or third party URLs
  if (request.method !== 'GET' || request.url.includes('/api/') || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background (stale-while-revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => { /* Ignore background fetch errors */ });
        
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        // Cache static assets dynamically
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (request.url.includes('_next/static') || request.url.match(/\.(png|jpg|jpeg|svg|woff2|css)$/))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cached page or offline boundary fallback
        return caches.match('/login') || Response.error();
      });
    })
  );
});
