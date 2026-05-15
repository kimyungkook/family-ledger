/* ★★★ FamilyLedger AI — Service Worker v3 (PWA 알림 완전 지원) ★★★ */
var CACHE_NAME = 'familyledger-v3';

/* ─── 설치 ─── */
self.addEventListener('install', function(e) {
  self.skipWaiting(); /* 즉시 활성화 */
});

/* ─── 활성화 (이전 캐시 삭제) ─── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim(); /* 즉시 제어권 획득 */
    })
  );
});

/* ─── 네트워크 요청 처리 ─── */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});

/* ★★★ 알림 클릭 처리 — PWA 앱 화면 포커스 ★★★ */
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(list) {
        /* 이미 열린 창이 있으면 포커스 */
        for (var i = 0; i < list.length; i++) {
          if ('focus' in list[i]) {
            return list[i].focus();
          }
        }
        /* 없으면 새 창 열기 */
        return clients.openWindow('./');
      })
  );
});

/* ★★★ 푸시 메시지 수신 (백그라운드 알림) ★★★ */
self.addEventListener('push', function(e) {
  var data = { title: '가계부 알림', body: '' };
  try {
    if (e.data) data = e.data.json();
  } catch(err) {}

  var options = {
    body: data.body || '',
    icon: 'https://kimyungkook.github.io/family-ledger/icon-192.png',
    badge: 'https://kimyungkook.github.io/family-ledger/icon-192.png',
    tag: data.tag || ('push-' + Date.now()),
    vibrate: [200, 100, 200],
    requireInteraction: false
  };

  e.waitUntil(
    self.registration.showNotification(data.title || '가계부 알림', options)
  );
});
