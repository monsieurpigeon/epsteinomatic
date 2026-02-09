const CACHE_NAME = "masqueur-react-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  const isHttp = url.startsWith("http://") || url.startsWith("https://");

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (
          isHttp &&
          res.ok &&
          (e.request.mode === "navigate" ||
            e.request.destination === "script" ||
            e.request.destination === "style")
        ) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        if (e.request.mode === "navigate") {
          return caches
            .match("/index.html")
            .then((c) => c || new Response("Offline", { status: 503 }));
        }
        return caches
          .match(e.request)
          .then((c) => c || new Response("", { status: 503 }));
      })
  );
});
