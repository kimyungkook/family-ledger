/* FamilyLedger — PWA: 네트워크 그대로 전달 (캐시 미사용, fetch 실패 시 재시도로 깨지지 않음) */
self.addEventListener('install', function (e) {
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request));
});
