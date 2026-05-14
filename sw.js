/* FamilyLedger — PWA: 네트워크 그대로 전달 + 알림 처리 추가 */
self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request));
});

/* ★★★ [추가] 알림 클릭 시 앱 포커스 ★★★ */
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list) {
      if(list.length > 0) return list[0].focus();
      return clients.openWindow('./');
    })
  );
});
