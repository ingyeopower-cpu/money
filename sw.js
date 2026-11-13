// sw.js - 고석현의 돈통 PWA Service Worker (오프라인 지원 및 앱 설치 활성화)
const CACHE_NAME = 'money-pwa-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon-32x32.png',
  './assets/toad_gain_poster.jpg',
  './assets/toad_loss_poster.jpg',
  './data/market_insights.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Google Apps Script API 및 실시간 금융/환율 API는 SW 캐시를 거치지 않고 직접 통신
  const bypassHosts = [
    'script.google.com',
    'googleusercontent.com',
    'api.exchangerate-api.com',
    'open.er-api.com',
    'api.frankfurter.dev',
    'finance.yahoo.com'
  ];
  if (bypassHosts.some(host => req.url.includes(host))) {
    return;
  }

  // Network-first with cache fallback
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && req.url.startsWith('http')) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone).catch(() => {});
          });
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(req, { ignoreSearch: true }).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (req.mode === 'navigate') {
            return caches.match('./index.html', { ignoreSearch: true });
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
