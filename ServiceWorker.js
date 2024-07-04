const cacheName = "DefaultCompany-PianoLand-0.0.6";
const contentToCache = [
  "Build/pianoland_0.0.6.loader.js",
  "Build/pianoland_0.0.6.framework.js",
  "Build/pianoland_0.0.6.data",
  "Build/pianoland_0.0.6.wasm",
  "TemplateData/style.css",
];

self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");

  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (thisCacheName) {
          if (thisCacheName !== cacheName) {
            console.log(
              "[Service Worker] Removing cached files from old cache:",
              thisCacheName
            );
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
