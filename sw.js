// Lock In v11 — Service Worker

const CACHE_NAME = 'lock-in-v21';
const ASSETS = [
  './index.html',
  './app.css',
  './app.js',
  './exercises.js',
  './nutrition.js',
  './notifications.js',
  './assistant.js',
  './icons.js',
  './onboarding.css',
  './onboarding.js',
  './manifest.json',
  './privacy.html',
  './data/exercise-catalog.json',
  './data/program-map.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
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
  'raw.githubusercontent.com',
  'api.workoutxapp.com',
  'cdn.jsdelivr.net',
  'pub-7c14918da31d450e8d6787a3c225c277.r2.dev',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

function isExerciseGifProxy(url) {
  try {
    const u = new URL(url);
    return /\/exercise-gif\/[^/]+$/.test(u.pathname);
  } catch {
    return false;
  }
}

function isCacheableUrl(url) {
  try {
    const u = new URL(url);
    if (isExerciseGifProxy(url)) return true;
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

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow('./index.html');
    })
  );
});

let swSchedule = { enabled: false, blocks: [], completed: {}, date: '' };
const swNotified = new Set();

function parseTimeMins(time) {
  const p = String(time || '').split(':');
  if (p.length < 2) return null;
  const h = parseInt(p[0], 10);
  const m = parseInt(p[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function checkSwScheduleNotifications() {
  if (!swSchedule.enabled || !swSchedule.blocks.length) return;
  const date = todayKey();
  if (swSchedule.date && swSchedule.date !== date) swNotified.clear();
  swSchedule.date = date;
  const nowM = new Date().getHours() * 60 + new Date().getMinutes();
  for (const b of swSchedule.blocks) {
    const t = parseTimeMins(b.time);
    if (t == null || nowM < t || nowM >= t + 20) continue;
    if (swSchedule.completed?.[b.id]) continue;
    const key = `${date}_${b.id}`;
    if (swNotified.has(key)) continue;
    swNotified.add(key);
    const action = b.type === 'water' ? 'Drink water' : b.type === 'meal' ? 'Time to eat' : b.type === 'workout' ? 'Workout time' : 'Schedule check-in';
    self.registration.showNotification('Lock In', {
      body: `${b.time} — ${action}: ${b.label}`,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: `lockin-${b.id}`,
      renotify: true,
    });
    break;
  }
}

self.addEventListener('message', event => {
  const data = event.data;
  if (!data || data.type !== 'SYNC_SCHEDULE') return;
  swSchedule.enabled = !!data.enabled;
  swSchedule.blocks = Array.isArray(data.blocks) ? data.blocks : [];
  swSchedule.completed = data.completed || {};
  swSchedule.date = data.date || todayKey();
});

setInterval(checkSwScheduleNotifications, 60000);

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
