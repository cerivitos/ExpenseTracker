var cacheName = "expenses-cache-v0.22";
var filesToCache = [
  "/",
  "/index.html",
  "/main.css",
  "/main.js",
  "/components.css",
  "https://fonts.googleapis.com/css?family=Rubik&display=swap",
  "https://fonts.googleapis.com/icon?family=Material+Icons+Round"
];
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener("message", function(e) {
  if (e.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
self.addEventListener("activate", e => {
  return self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(e.request);
    })
  );
});
