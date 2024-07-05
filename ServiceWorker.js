// ServiceWorker.js

const CACHE_PREFIX = 'pianoland'; // Prefix for cache names
let CURRENT_CACHE_VERSION = '0.0.17'; // Initial cache version, update as needed
const CACHE_NAME = `${CACHE_PREFIX}_${CURRENT_CACHE_VERSION}`;

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker ... ' + CACHE_NAME);
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(function() {
            return caches.open(CACHE_NAME).then(function(cache) {
                console.log('[Service Worker] Pre-caching App Shell');
                // Cache Unity WebGL build files or other important assets here
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/TemplateData/favicon.ico',
                    '/TemplateData/style.css',
                    '/Build/pianoland_0.0.17.loader.js', // Example Unity WebGL loader script
                    '/Build/pianoland_0.0.17.data',      // Example Unity WebGL data file
                    '/Build/pianoland_0.0.17.framework.js', // Example Unity WebGL framework file
                    '/Build/pianoland_0.0.17.wasm',      // Example Unity WebGL code file
                    // Add other files your application needs to function offline
                ]);
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetch Service Worker ...');
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Return cached response if found
            if (response) {
                return response;
            }

            // Otherwise, fetch from network and cache
            return fetch(event.request).then(function(res) {
                return caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                });
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(function() {
            console.log('[Service Worker] Claiming clients for version', CURRENT_CACHE_VERSION);
            return self.clients.claim();
        })
    );
});
/*
        if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/ServiceWorker.js')
          .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(function(error) {
            console.error('Service Worker registration failed:', error);
          });
      });
      }

      */