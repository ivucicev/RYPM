// src/sw.js
// 1) Receive push (classic or declarative-compatible payload)
self.addEventListener("push", (event) => {
    let data = {};
    try { data = event.data?.json() ?? {}; } catch { }

    // If it’s a declarative-style payload, it will have { notification: {...} }
    const n = data.notification || {};
    const title = n.title || data.title || "Notification";
    const opts = {
        body: n.body || data.body,
        icon: n.icon || data.icon,
        badge: n.badge || n.app_badge,
        tag: n.tag || "default",
        actions: n.actions,
        data: { navigate: n.navigate || data.navigate || "/" }
    };

    event.waitUntil(self.registration.showNotification(title, opts));
});

// 2) Handle taps
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.navigate || "/";
    event.waitUntil(clients.openWindow(url));
});

// 3) (optional) Activate immediately on update
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));