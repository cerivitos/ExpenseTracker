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
    "revision": "85e240bbd45e72917aeaf997809c3257"
  },
  {
    "url": "index.html",
    "revision": "0c2f73d7c6eaa848561846c6ca173ea1"
  },
  {
    "url": "load-image.all.min.js",
    "revision": "1bbfc74fcc88384c1c703bc605787cae"
  },
  {
    "url": "load-image.js",
    "revision": "aa0204b4fe2b4d0d4c3216f27c71b385"
  },
  {
    "url": "main.css",
    "revision": "4ab63893c949ebac7468998b3528b9a7"
  },
  {
    "url": "main.js",
    "revision": "cad647a0584ac3b3aef88be7796db0e9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute("/main.js", new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute("/main.css", new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute("/components.css", new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute("/^https://fonts.googleapis.com/", new workbox.strategies.StaleWhileRevalidate(), 'GET');
