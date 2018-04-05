/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}/restaurants`;
    }

    
  static fetchRestaurants() {

        return fetch(DBHelper.DATABASE_URL).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
                return response.json();
            }).then(response => {
                const restaurants = response;
                console.log(restaurants);
                return restaurants;
            })
            .catch( error => {
              console.log(error);
                /*const errorMsg = ('Oops!. Got an error from server', error);
                return callback(errorMsg, null);*/
            });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id) {
        // fetch all restaurants with proper error handling.
        return DBHelper.fetchRestaurants()
        .then(response => {
          const restaurant = response.find(r => r.id == id);
          if(restaurant){
            return restaurant;
          }
        })
        .catch(error => {
          console.log('Restaurant does not exist', error);
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants()
        .then(restaurants => {
          // Filter restaurants to have only given cuisine type
          const results = restaurants.filter(r => r.cuisine_type == cuisine);
          return results;
        })
        .catch(error => {
          console.log(error);
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants()
        .then(restaurant => {
          // Filter restaurants to have only given neighborhood
          const results = restaurants.filter(r => r.neighborhood == neighborhood);
          return results;
        })
        .error(error => {
          console.log(error);
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
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
        .catch(error => {
          console.log(error);
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods() {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
        .then(restaurants => {
          // Get all neighborhoods from all restaurants
          const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
          // Remove duplicates from neighborhoods
          const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
          console.log(uniqueNeighborhoods);
          return uniqueNeighborhoods;
        })
        .catch(error => {
          console.log(error);
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
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
        .catch(error => {
          console.log(error);
        });
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
        return (`img/${restaurant.id}-600.webp`);
    }

    /**
     * Restaurant image srcset string.
     */
    static srcsetForRestaurant(restaurant) {
        return (`img/${restaurant.id}-400.webp 400w, 
      img/${restaurant.id}-600.webp 600w, 
      img/${restaurant.id}-800.webp 800w,
      img/${restaurant.id}-1200.webp 1200w,
      img/${restaurant.id}-1500.webp 1500w,
      img/${restaurant.id}-2000.webp 2000w`);
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