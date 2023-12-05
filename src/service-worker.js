import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === "POST" && url.pathname === "/") {
    event.waitUntil(
      (async function () {
        const client = await self.clients.get(event.resultingClientId);
        const data = await event.request.formData();
        const files = data.get("file");
        client.postMessage({ files });
      })()
    );
    event.respondWith(Response.redirect("/", 303));
    return;
  }
});
