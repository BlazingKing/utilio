/* Utilio service worker — ทำให้เว็บใช้งานได้แบบออฟไลน์
   กลยุทธ์:
   - ไฟล์ static ของ Next (/_next/static/*) : cache-first (ชื่อไฟล์มี hash อยู่แล้ว)
   - การเปิดหน้า (navigate)                 : network-first แล้ว fallback เป็น cache หรือหน้าแรก
   - ไฟล์อื่น ๆ ในโดเมนเดียวกัน             : stale-while-revalidate
*/

const VERSION = "v1";
const STATIC_CACHE = `utilio-static-${VERSION}`;
const PAGE_CACHE = `utilio-pages-${VERSION}`;
const PRECACHE = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {
        // ถ้า precache ไม่สำเร็จก็ยังติดตั้ง service worker ต่อได้
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("utilio-") && k !== STATIC_CACHE && k !== PAGE_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // จัดการเฉพาะ GET ในโดเมนเดียวกัน
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // ไฟล์ static ที่มี hash — cache ได้ยาว ๆ
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // การเปิดหน้าเว็บ — เอาของใหม่ก่อน ถ้าออฟไลน์ค่อยใช้ของใน cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/")),
        ),
    );
    return;
  }

  // อื่น ๆ — คืน cache ก่อนแล้วอัปเดตเบื้องหลัง
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
