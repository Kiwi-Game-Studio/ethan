// ServiceWorker.js

const CACHE_NAME = 'pianoland_0.0.11'; // Replace with a unique name for your app cache

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker ... ' + CACHE_NAME);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[Service Worker] Pre-caching App Shell');
                // Cache Unity WebGL build files or other important assets here
                cache.addAll([
                    '/',
                    '/index.html',
                    '/TemplateData/favicon.ico',
                    '/TemplateData/style.css',
                    '/Build/pianoland_0.0.11.loader.js', // Example Unity WebGL loader script
                    '/Build/pianoland_0.0.11.data',  // Example Unity WebGL data file
                    '/Build/pianoland_0.0.11.framework.js', // Example Unity WebGL framework file
                    '/Build/pianoland_0.0.11.wasm', // Example Unity WebGL code file
                    // Add other files your application needs to function offline
                ]);
            })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then(function(res) {
                            return caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                });
                        });
                }
            })
    );
});
