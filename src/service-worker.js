/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("fetch", (event) => {
  console.log(event);
  const url = new URL(event.request.url);
  console.log(url);
  if (event.request.method === "POST" && url.pathname === "/zip-file") {
    console.log("hmm?");
    event.waitUntil(
      (async function () {
        console.log("ok buddy");
        const client = await self.clients.get(event.resultingClientId);
        /**
         * @type {FormData}
         */
        const data = await event.request.formData();
        console.log(data.keys());
        Array.from(data.keys()).forEach(value => {
          console.log(`${value} :`);
          console.log(data.getAll(value));
        });
        console.log("done")
        const files = data.get("zip");
        client.postMessage({ files });
        console.log(client);
        console.log(data);
        console.log(files);
      })()
    );
    console.log("man return me to somewhere else");
    event.respondWith(Response.redirect("/", 303));
    return;
  }
});
