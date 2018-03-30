const CACHE_NAME = 'restaurant-app-v1';

const STATIC_ASSETS = [
    '/',
    'restaurant.html',
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'data/restaurants.json',
    'https://fonts.googleapis.com/css?family=Work+Sans:400,500" rel="stylesheet'
];


// Check for service worker and do sw registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Cache static assets on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }));
});

// https://jakearchibald.com/2014/offline-cookbook/#on-network-response
// If the request is in the cache, return it
// else go to the network, cache the response and return it
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                return response || fetch(event.request).then((response) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});