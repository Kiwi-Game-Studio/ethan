const cacheName = "DefaultCompany-PianoLand-0.0.6";
const contentToCache = [
    "Build/pianoland_0.0.6.loader.js",
    "Build/pianoland_0.0.6.framework.js",
    "Build/pianoland_0.0.6.data",
    "Build/pianoland_0.0.6.wasm",
    "TemplateData/style.css",
    "index.html"
];

// Install event - cache the app shell
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil((async function () {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

// Activate event - clear old caches
self.addEventListener('activate', function (e) {
    console.log('[Service Worker] Activate');
    e.waitUntil((async function () {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(async (name) => {
                if (name !== cacheName) {
                    console.log(`[Service Worker] Deleting old cache: ${name}`);
                    await caches.delete(name);
                }
            })
        );
    })());
});

// Fetch event - serve from cache if available, else fetch from network
self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
        let response = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (response) { return response; }

        response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});
