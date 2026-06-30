// Daily Reset v2 — Service Worker (offline + GIF cache)

const CACHE_NAME = 'daily-reset-v2';
const ASSETS = [
  './index.html',
  './app.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/exercises/pushups.svg',
  './icons/exercises/pike_pushups.svg',
  './icons/exercises/squats.svg',
  './icons/exercises/glute_bridge.svg',
  './icons/exercises/plank.svg',
  './icons/exercises/dead_hang.svg',
  './icons/exercises/scapular_pulls.svg',
  './icons/exercises/negative_pullups.svg',
  './icons/exercises/inverted_rows.svg',
  './icons/exercises/hollow_hold.svg',
  './icons/exercises/mountain_climbers.svg',
];

const CACHEABLE_ORIGINS = [
  'static.exercisedb.dev',
  'cdn.jsdelivr.net',
  'pub-7c14918da31d450e8d6787a3c225c277.r2.dev',
];

function isCacheableUrl(url) {
  try {
    const u = new URL(url);
    return CACHEABLE_ORIGINS.some(o => u.hostname === o || u.hostname.endsWith('.' + o));
  } catch {
    return false;
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  if (isCacheableUrl(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
