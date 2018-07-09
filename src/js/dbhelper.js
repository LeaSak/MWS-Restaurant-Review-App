/**
 * Common database helper functions.
 */

class DBHelper {

    /**
     * Make an IndexedDB Database
     */
    static createDatabase() {
        const idbPromise = idb.open('restaurants', 2, (upgradeDb) => {
            switch (upgradeDb.oldVersion) {
                case 0:
                    // a placeholder case so that the switch block will
                    // execute when the database is first created
                    // (oldVersion is 0)
                case 1:
                    console.log('Creating the restaurants object store');
                    let restaurantStore = upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });

                case 2:
                    console.log('Creating the reviews object store');
                    let reviewStore = upgradeDb.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true });
                    reviewStore.createIndex('restaurant_id', 'restaurant_id');


                case 3:
                    console.log('Creating the pending reviews object store');
                    let pendingReviewStore = upgradeDb.createObjectStore('pending_reviews', { keyPath: 'id', autoIncrement: true});
            }
        })

        return idbPromise;
    }

    /**
     * Add restaurants to the database
     */
    static addRestaurantsToDB(restaurants) {
        return DBHelper.createDatabase()
            .then((db) => {
                if (!db) {
                    return;
                }
                const tx = db.transaction('restaurants', 'readwrite');
                const store = tx.objectStore('restaurants');

                return Promise.all(restaurants.map(restaurant => {
                    console.log('adding restaurants to database');
                    return store.put(restaurant);
                }));
            })
            .catch((error) => {
                tx.abort();
                console.error(error);
            });

    }

    /**
     * Get all restaurants from the database
     */
    static fetchRestaurantsFromDB() {
        return DBHelper.createDatabase()
            .then((db) => {
                const tx = db.transaction('restaurants', 'readonly');
                const store = tx.objectStore('restaurants');
                return store.getAll();
            });
    }

    /**
     * Add reviews to the database
     */
    static addReviewsToDB(reviews) {
        return DBHelper.createDatabase()
            .then((db) => {
                if (!db) {
                    return;
                }
                const tx = db.transaction('reviews', 'readwrite');
                const store = tx.objectStore('reviews');

                return Promise.all(reviews.map(review => {
                    console.log('adding reviews to database');
                    return store.put(review);
                }));

            })
            .catch((error) => {
                tx.abort();
                console.error(error);
            });
    }

    /**
     * Fetch reviews from database
     */
    static fetchLocalReviewsById(id) {
        console.log('fetchReviewsfromDB');
        return DBHelper.createDatabase()
            .then((db) => {
                const tx = db.transaction('reviews', 'readonly');
                const store = tx.objectStore('reviews');
                const index = store.index('restaurant_id');
                return index.getAll(id);
            });
    }

    /**
     * Go to network to get reviews by restaurant id
     */
    static fetchReviewsByIdFromNetwork(id) {
        console.log('fetch reviews from network');
        return fetch(DBHelper.DATABASE_URL + `/reviews/?restaurant_id=${id}`)
            .then(DBHelper.validateJSON)
            .then(response => {
                return response;
            })

    }

    /**
     * Fetch reviews from DB
     * If no reviews, fetch from network
     * add to database
     */
    static fetchReviewsById(id) {
        return DBHelper.fetchLocalReviewsById(id)
            .then(function(response) {

                if (response.length === 0) {
                    return DBHelper.fetchReviewsByIdFromNetwork(id)
                        .then(response => {
                            DBHelper.addReviewsToDB(response);
                            return response;
                        })
                        .catch(DBHelper.logError);
                    }

                return response;

            })
    }


    /**
     * Update favourite status in client side database
     */

    static updateLocalFavouriteStatus(response) {
        return DBHelper.createDatabase()
            .then((db) => {
                const tx = db.transaction('restaurants', 'readwrite');
                const store = tx.objectStore('restaurants');
                return store.put(response);
            })
    }

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */

    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}`;
    }


    static logError(error) {
        console.error(error);
    }

    static validateJSON(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    }

    static defineRestaurants(response) {
        const restaurants = response;
        console.log('Network contact');
        return restaurants;
    }

    /**
     * Go to network to get restaurants
     */
    static fetchRestaurantsFromNetwork() {
        return fetch(DBHelper.DATABASE_URL + '/restaurants')
            .then(DBHelper.validateJSON)
            .then(DBHelper.defineRestaurants);
    }

    /**
     * Fetch Restaurants without error handling
     * Error Handling is in other functions
     * Fetches restaurants from server
     * Adds them to the database
     * Returns dynamic request results
     *
     */

    static fetchRestaurants() {
        // First try to get results from Database
        return DBHelper.fetchRestaurantsFromDB()
            .then(function(response) {
                // If the database is empty
                // Go to the network
                // Add network response to IndexedDB
                if (response.length === 0) {
                    return DBHelper.fetchRestaurantsFromNetwork()
                        .then(response => {
                            DBHelper.addRestaurantsToDB(response);
                            return response;
                        })
                        .catch(DBHelper.logError);
                }
                return response;
            });
    }

    /**
     * Fetch a restaurant by its ID.
     * Error handling is in window.initMap()
     */
    static fetchRestaurantById(id) {
        return fetch(DBHelper.DATABASE_URL + '/restaurants/' + id)
            .then(DBHelper.validateJSON)
            .then((response) => {
                return response;
            })
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood
     * Error handling is in updateRestaurants().
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                let results = restaurants;
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                return results;
            })
    }

    /**
     * Fetch all neighborhoods.
     * Error handling is in fetchNeighboods().
     */
    static fetchNeighborhoods() {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
                return uniqueNeighborhoods;
            })
    }

    /**
     * Fetch all cuisines with proper error handling.
     * Error handling is in fetchCuisines().
     */
    static fetchCuisines() {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
                return uniqueCuisines;
            })
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        return (`img/${restaurant.id}-600.jpg`);
    }

    /**
     * Restaurant image srcset string.
     */
    static srcsetForRestaurant(restaurant) {
        return (`img/webp/${restaurant.id}-400.webp 400w,
      img/webp/${restaurant.id}-600.webp 600w,
      img/webp/${restaurant.id}-800.webp 800w`);
    }

    /**
     * Update favorite status.
     */
    static addFavoriteStatus(id, status) {
        let url = (`http://localhost:1337/restaurants/${id}/?is_favorite=${status}`);

        return fetch(url, {
                method: 'PUT',
            })
            .then(DBHelper.validateJSON)
            .then((res) => {
                console.log('put request result', res);
                DBHelper.updateLocalFavouriteStatus(res);

            })
            .catch(error => console.error('Error:', error))
    }

    /**
     * Click handler to update favourite button aria labels.
     */
    static toggleButtonState() {
        document.addEventListener('click', DBHelper.updateButtonState, false);
    }

    /**
     * Toggles aria labels and aria pressed state
     */
    static updateButtonState(e) {
        const Id = e.target.dataset.action;

        if (!Id) {

            return;

        } else {

            if (e.target.dataset.action === 'save') {
                let saveButton = e.target;
                let restaurantId = saveButton.dataset.restaurantId;
                console.log(restaurantId);
                let currentState = saveButton.getAttribute('aria-pressed');
                let pressed = 'true';
                let labelText = 'Remove from favourites';


                if (currentState === 'true') {
                    pressed = 'false';
                    labelText = 'Add to favourites';
                }

                saveButton.setAttribute('aria-pressed', pressed);
                saveButton.setAttribute('aria-label', labelText);

                //post data about restaurant to Server and IndexedDB
                DBHelper.addFavoriteStatus(restaurantId, pressed);
            }

        }
    }

    /**
     * Update server with new review
     * If offline, request background sync
     * cache review locally
     */
    static submitReview(review) {
        // if online submit review to server
        DBHelper.postReviewtoServer(review)
            .catch(() => {
                console.log('submit review failed');
                // if offline, send reviews to pending_reviews cache
                DBHelper.submitPendingReviewtoDB(review);
                DBHelper.sendSyncRequest(review);
            });
    }

    /**
     * Register a sync event
     */
    static sendSyncRequest(review) {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.ready
                .then(reg => reg.sync.register('review-sync'))
                .then(() => console.log('Sync event registered'));
        }
    }

    /**
     * Submit review to server
     */
    static postReviewtoServer(review) {
        const url = 'http://localhost:1337/reviews/';
        console.log(url);
        console.log(review);
        const options = {
            method: 'POST',
            body: JSON.stringify(review)
        }

        return fetch(url, options);
    }


    /**
     * If offline, send review to pending_review object store
     */
    static submitPendingReviewtoDB(review) {
        console.log('submit pending review to pending_reviews');
        return DBHelper.createDatabase()
            .then((db) => {
                if (!db) {
                    return;
                }
                const tx = db.transaction('pending_reviews', 'readwrite');
                const store = tx.objectStore('pending_reviews');

                console.log(review);
                console.log('adding review to pending_reviews');

                store.put(review);

                return tx.complete;
            })
    }

    /**
     * Update local database with new review
     */
    static submitSingleReviewtoDB(review) {
        return DBHelper.createDatabase()
            .then((db) => {
                const tx = db.transaction('reviews', 'readwrite');
                const store = tx.objectStore('reviews');
                return store.put(review);
            })
            .catch(DBHelper.logError);
    }

    /**
     * Fetch reviews from local database
     * to send to server
     */
    static fetchPendingReviewsFromDB() {
        return DBHelper.createDatabase()
            .then(db => {
                if (!db) {
                    return;
                }
                const tx = db.transaction('pending_reviews', 'readonly');
                const store = tx.objectStore('pending_reviews');
                return store.getAll();
            })
            .then(responses => {

                const reviews = responses || [];

                console.log('reading reviews from pending_reviews');
                console.log(reviews);

                return Promise.all(reviews.map(review => {
                    console.log('post each review to server');
                    return DBHelper.postReviewtoServer(review);

                }));
            })
            .then(DBHelper.clearPendingReviews)
            .catch(error => console.log(error));
    }

    /**
     * Clear pending reviews from local database
     */
    static clearPendingReviews() {
        return DBHelper.createDatabase()
            .then(db => {
                if (!db) {
                    return;
                }
                const tx = db.transaction('pending_reviews', 'readwrite');
                const store = tx.objectStore('pending_reviews');
                store.clear();
                console.log('pending review store cleared');
                return tx.complete;

            })

    }


    /**
     * Add map script to html
     */
    static addScript() {
        const target = document.body;
        const mapScript = document.createElement('script');
        mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCSQXjgi1K6hqDS4W3nWVK_z0lntlbLFPo&libraries=places&callback=initMap';
        target.appendChild(mapScript);
    }

    static toggleMap(anchorID, mapElemID) {
        const anchor = document.getElementById(anchorID);
        const mapFrame = document.getElementById(mapElemID);

        anchor.addEventListener('click', (e) => {
            // Prevent Default link behaviour
            e.preventDefault();

            // Check for map section
            if (!mapFrame) return;

            // Toggle map section visiblity
            mapFrame.classList.toggle('is-visible');

            // Fetch script only if it hasn't already been fetched
            if (!window.google) {
                DBHelper.addScript();
            }

        }, false);

    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP
        });
        return marker;
    }

}