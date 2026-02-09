const CACHE_NAME = "masqueur-v3";
const URLS = [
  "/",
  "/index.html",
  "/travail.html",
  "/css/style.css",
  "/js/app.js",
  "/js/travail.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(URLS.filter(Boolean)).catch(() => {});
      })
      .then(() => self.skipWaiting())
  );
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
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          if (res.status === 0 || res.type === "opaque") return res;
          const url = new URL(e.request.url);
          if (
            url.origin === location.origin ||
            url.hostname === "cdn.jsdelivr.net" ||
            url.hostname.includes("tfhub")
          ) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => {
          if (e.request.mode === "navigate") {
            return caches.match("/index.html") || caches.match("/");
          }
          return new Response("", { status: 503, statusText: "Offline" });
        });
    })
  );
});
