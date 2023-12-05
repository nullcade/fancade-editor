import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(window.self.__WB_MANIFEST);

window.self.addEventListener("fetch", (event) => {
  if (event.request.url.endsWith("/zip-file")) {
    event.waitUntil(
      (async () => {
        const data = await event.request.formData();
        const cache = await caches.open("zips");
        await cache.put("/", data);
        event.respondWith(Response.redirect("/", 303));
      })()
    );
  }
});
