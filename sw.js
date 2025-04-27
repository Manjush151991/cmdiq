const CACHE_NAME = 'cmdiq-v1';
const ASSETS = [
  './',
  'index.html',
  'assets/style.css',
  'assets/scripts.js',
  'assets/windows-style.css',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/favicon.ico',
  'offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('offline.html'));
    })
  );
});

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
});
