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
                    upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });

                case 2:
                    console.log('Creating the reviews object store');
                    upgradeDb.createObjectStore('reviews', { keyPath: 'id' })
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
    static fetchReviewsFromDB() {
        return DBHelper.createDatabase()
            .then((db) => {
                const tx = db.transaction('reviews', 'readonly');
                const store = tx.objectStore('reviews');
                return store.getAll();
            });
    }


    /**
     * Update favourite status in client side database
     */
    static updateFavouriteStatusinDB(restaurant, status) {
        return DBHelper.createDatabase()
            .then(db => DBHelper.getRestaurantFromDB(db, restaurant))
            .then(response => DBHelper.setFavouriteStatus(response, status))
            .then(response => DBHelper.addFavoriteStatustoDB(response))
            .catch(DBHelper.logError);
    }


    static getRestaurantFromDB(db, restaurant) {
        const tx = db.transaction('restaurants', 'readwrite');
        const store = tx.objectStore('restaurants');
        return store.get(restaurant);
    }

    static setFavouriteStatus(response, status) {
        return new Promise((resolve, reject) => {
            const selectedRestaurant = response;
            selectedRestaurant.is_favorite = status;
            resolve(selectedRestaurant);
        });
    }

    static addFavoriteStatustoDB(response) {
        return DBHelper.createDatabase()
            .then((db) => {
                const tx = db.transaction('restaurants', 'readwrite');
                const store = tx.objectStore('restaurants');
                return store.put(response);
            })
            .catch(DBHelper.logError);
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
     * Go to network to get reviews
     */
    static fetchReviewsByIdFromNetwork(id) {
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
        return DBHelper.fetchReviewsFromDB()
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
                let status = res.is_favorite;
                let key = res.id;
                DBHelper.updateFavouriteStatusinDB(key, status);

            })
            .catch(error => console.error('Error:', error))
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