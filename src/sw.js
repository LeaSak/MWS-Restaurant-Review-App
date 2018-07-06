importScripts('/js/vendor/idb.min.js');

const CACHE_NAME = 'restaurant-app-v1';
const CACHE_IMAGES = 'restaurant-app-images-v1';

const STATIC_ASSETS = [
    '/',
    'restaurant.html',
    'css/app-main.css',
    'css/app-restaurant.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'js/vendor/idb.min.js',
    'js/vendor/lazysizes.min.js',
    'https://fonts.googleapis.com/css?family=Work+Sans:400,500" rel="stylesheet'
];

// Cache static assets on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }));
});


self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {

        // index.html
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/'));
            return;
        }

        // add images to photo cache
        if (requestUrl.pathname.startsWith('/img/')) {
            event.respondWith(servePhoto(event.request));
            return;
        }

    }

    // Don't cache PUT/POST requests
    if (event.request.method !== 'GET') return;

    // cache default method
    // https://jakearchibald.com/2014/offline-cookbook/#on-network-response
    // If the request is in the cache, return it
    // else go to the network, cache the response and return it at the same time
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request).then(response => {
                    console.log(response);
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

//Listens for a sync event,
// post messages to client
self.addEventListener('sync', (event) => {
    if(event.tag === 'review-sync'){
        console.log('sync event received by sw');
        event.waitUntil(sendMessagetoSW({ message: 'post-reviews'}));
    }
});

function sendMessagetoSW(message){
    return clients.matchAll()
    .then((clients) => {
        clients.forEach(client => client.postMessage(message));
    })
}

function servePhoto(request) {
    var storageUrl = request.url.replace(/-\d+\.[^.]+$/, '');

    return caches.open(CACHE_IMAGES).then(cache => {
        return cache.match(storageUrl).then(response => {
            if (response) return response;

            return fetch(request).then(networkResponse => {
                cache.put(storageUrl, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}