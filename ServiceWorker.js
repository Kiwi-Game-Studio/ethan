const cacheName = "DefaultCompany-PianoLand-0.0.8";

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll([
                "Build/pianoland_0.0.8.loader.js?version=1",
                "Build/pianoland_0.0.8.framework.js?version=1",
                "Build/pianoland_0.0.8.data?version=1",
                "Build/pianoland_0.0.8.wasm?version=1",
                "TemplateData/style.css?version=1"
            ]);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[Service Worker] Activate');

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== cacheName) {
                        console.log('[Service Worker] Deleting old cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then((response) => {
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            return response || fetch(e.request);
        })
    );
});
