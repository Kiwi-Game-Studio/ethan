const cacheName = "DefaultCompany-PianoLand-0.1";
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
  if (!e.request.url.startsWith('http')) {
    console.log(`[Service Worker] Skipping non-HTTP request: ${e.request.url}`);
    return;
    }
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);

      const requestURL = new URL(e.request.url);
      
      // Only cache supported schemes (http and https)
      if (requestURL.protocol === 'http:' || requestURL.protocol === 'https:') {
          const cache = await caches.open(cacheName);
          console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
          cache.put(e.request, response.clone());
      } else {
          console.log(`[Service Worker] Not caching unsupported protocol: ${e.request.url}`);
      }
      
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
