const CACHE_NAME = "version-1";
const urlToCache = ["index.html", "offline.html"];

const self = this;
// install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlToCache);
    })
  );
});
// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async () => {
      try {
        return await fetch(event.request);
      } catch {
        return await caches.match("offline.html");
      }
    })
  );
});

// Active the SW
self.addEventListener("activate", (event) => {
  const cacheWhitlist = [];
  cacheWhitlist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
