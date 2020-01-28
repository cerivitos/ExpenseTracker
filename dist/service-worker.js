/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "components.css",
    "revision": "ff7879fbb44b3e07c95a9fb92c787ba4"
  },
  {
    "url": "index.html",
    "revision": "339d1a9314ffe999581fb5e94e069842"
  },
  {
    "url": "main.css",
    "revision": "4ab63893c949ebac7468998b3528b9a7"
  },
  {
    "url": "main.js",
    "revision": "168affac97d8a9045b111e3c6b601cd1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute("/main.js", new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute("/main.css", new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute("/components.css", new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute("/^https://fonts.googleapis.com/", new workbox.strategies.StaleWhileRevalidate(), 'GET');
