
const CACHE_NAME = "vip-taxi-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "index.html",
  "style.css",
  "manifest.json",
  "service-worker.js",
  "5 AR.webp",
  "AL .webp",
  "carroanimado.webp",
  "iconoapp 2.webp",
  "logo.webp",
  "img3.webp",
  "fondo.webp",
  "1WEBAPP.webp",
  "2PAGINASWEB.webp",
  "3VIDEOS.webp",
  "4TURADIO.webp",
  "5JINGLES.webp",
  "mi_contacto.vcf"
];

// Instalar: guarda archivos principales en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activar: limpia versiones anteriores del caché
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: estrategias distintas para imágenes y otros archivos
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Estrategia Cache First para imágenes (incluye .webp, .jpg, .png)
  if (url.pathname.match(/\.(jpg|png|webp)$/i)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Estrategia Network First para lo demás
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

