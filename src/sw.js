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
    navigator.serviceWorker.register('/sw.js').then( registration => {
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

// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        // Requests are streams. Clone request to use again in fetch.
        // Return response if ok, clone it and add it to cache.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
        	if (!response || response.status !== 200 || response.type !== 'basic'){
        		return reponse;
        	}

        	// Responses also need to be cloned before adding it to cache.
        	const responseToCache = response.clone();
        	caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;

        });
      })
    );
  }
});