self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  
  event.waitUntil(
      caches.keys().then(function (cacheNames) {
          return Promise.all(
              cacheNames.filter(function (cacheName) {
                  // Filter out the caches you want to delete
                  // You might want to check for specific prefixes or conditions
                  return true; // Modify this condition as per your caching strategy
              }).map(function (cacheName) {
                  return caches.delete(cacheName);
              })
          );
      })
  );
  
  // Pre-cache the Unity WebGL build files here if needed
  // e.g., using addAll method on the cache object
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activate');
  // You can do something when the service worker is activated, if needed
});

self.addEventListener('fetch', function (event) {
  console.log('[Service Worker] Fetch', event.request.url);
  
  // You can customize caching strategy for specific requests here
  // e.g., cache-first, network-first, etc.
});
