/* eslint-disable */

/*
  This is a custom service worker
  This configuration is selected when the application is built
*/

workbox.core.setCacheNameDetails({prefix: "WasmPWA"});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


/*
  This section registers the back-end petitions,
  If the petition fails, its stored in indexedDB and syncs later
*/
const regexp = new RegExp("/^http://localhost:8080\\/api\\/.*/");

workbox.routing.registerRoute(regexp, workbox.strategies.networkFirst({ "cacheName":"petitions-cache","networkTimeoutSeconds":10,"matchOptions":{"ignoreSearch":true}, plugins: [new workbox.expiration.Plugin({"maxEntries":5,"maxAgeSeconds":60,"purgeOnQuotaError":false}), new workbox.backgroundSync.Plugin("offline-petition-queue-post", {"maxRetentionTime":3600}), new workbox.cacheableResponse.Plugin({"statuses":[0,200],"headers":{"x-test":"true"}}), new workbox.broadcastUpdate.Plugin("my-update-channel")] }), 'POST');
workbox.routing.registerRoute(regexp, workbox.strategies.networkFirst({ "cacheName":"petitions-cache","networkTimeoutSeconds":10,"matchOptions":{"ignoreSearch":true}, plugins: [new workbox.expiration.Plugin({"maxEntries":5,"maxAgeSeconds":60,"purgeOnQuotaError":false}), new workbox.backgroundSync.Plugin("offline-petition-queue-put", {"maxRetentionTime":3600}), new workbox.cacheableResponse.Plugin({"statuses":[0,200],"headers":{"x-test":"true"}}), new workbox.broadcastUpdate.Plugin("my-update-channel")] }), 'PUT');
workbox.routing.registerRoute(regexp, workbox.strategies.networkFirst({ "cacheName":"petitions-cache","networkTimeoutSeconds":10,"matchOptions":{"ignoreSearch":true}, plugins: [new workbox.expiration.Plugin({"maxEntries":5,"maxAgeSeconds":60,"purgeOnQuotaError":false}), new workbox.backgroundSync.Plugin("offline-petition-queue-delete", {"maxRetentionTime":3600}), new workbox.cacheableResponse.Plugin({"statuses":[0,200],"headers":{"x-test":"true"}}), new workbox.broadcastUpdate.Plugin("my-update-channel")] }), 'DELETE');


// In this section we can specify what happens when the back-end petition fails
workbox.routing.setCatchHandler(({url, event, params}) => {
});
