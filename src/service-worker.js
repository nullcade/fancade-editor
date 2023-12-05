/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === "POST" && url.pathname === "/zip-file") {
    event.waitUntil(
      (async function () {
        const client = await self.clients.get(event.resultingClientId);
        /**
         * @type {FormData}
         */
        const data = await event.request.formData();
        const files = data.getAll("zip");
        client.postMessage({ files });
      })()
    );
    event.respondWith(Response.redirect("/", 303));
    return;
  }
});
