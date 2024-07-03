const cacheName = "DefaultCompany-PianoLand-0.2"; // Version incremented
const contentToCache = [
    "Build/pianoland.loader.js",
    "Build/pianoland.framework.js",
    "Build/pianoland.data",
    "Build/pianoland.wasm",
    "TemplateData/style.css",
    "Il2CppData/Metadata/global-metadata.dat"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', function (e) {
    console.log('[Service Worker] Activate');
    e.waitUntil((async function () {
        // Get all cache names
        const cacheNames = await caches.keys();
        // Wait until all old caches are deleted
        await Promise.all(
            cacheNames.map(function (name) {
                if (name !== cacheName) {
                    console.log('[Service Worker] Deleting old cache:', name);
                    return caches.delete(name);
                }
            })
        );
    })());
});

self.addEventListener('fetch', function (e) {
    if (!e.request.url.startsWith('http')) {
        console.log(`[Service Worker] Skipping non-HTTP request: ${e.request.url}`);
        return;
    }

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



/*const cacheName = "DefaultCompany-PianoLand-0.1";
const contentToCache = [
    "Build/pianoland.loader.js",
    "Build/pianoland.framework.js",
    "Build/pianoland.data",
    "Build/pianoland.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

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
});*/
