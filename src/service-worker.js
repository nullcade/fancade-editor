/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event) => {
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
