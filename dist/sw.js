"use strict";importScripts("/js/vendor/idb.min.js");var CACHE_NAME="restaurant-app-v1",CACHE_IMAGES="restaurant-app-images-v1",STATIC_ASSETS=["/","restaurant.html","css/app-main.css","css/app-restaurant.css","js/dbhelper.js","js/main.js","js/restaurant_info.js","js/vendor/idb.min.js","js/vendor/lazysizes.min.js",'https://fonts.googleapis.com/css?family=Work+Sans:400,500" rel="stylesheet'];function sendMessagetoSW(t){return clients.matchAll().then(function(e){e.forEach(function(e){return e.postMessage(t)})})}function servePhoto(n){var s=n.url.replace(/-\d+\.[^.]+$/,"");return caches.open(CACHE_IMAGES).then(function(t){return t.match(s).then(function(e){return e||fetch(n).then(function(e){return t.put(s,e.clone()),e})})})}self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(e){return e.addAll(STATIC_ASSETS)}))}),self.addEventListener("fetch",function(n){var e=new URL(n.request.url);if(e.origin===location.origin){if("/"===e.pathname)return void n.respondWith(caches.match("/"));if(e.pathname.startsWith("/img/"))return void n.respondWith(servePhoto(n.request))}"GET"===n.request.method&&n.respondWith(caches.open(CACHE_NAME).then(function(t){return t.match(n.request).then(function(e){return e||fetch(n.request).then(function(e){return console.log(e),t.put(n.request,e.clone()),e})})}))}),self.addEventListener("sync",function(e){"review-sync"===e.tag&&(console.log("sync event received by sw"),e.waitUntil(sendMessagetoSW({message:"post-reviews"})))});
//# sourceMappingURL=sw.js.map
