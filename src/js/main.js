let restaurants,
    neighborhoods,
    cuisines;
var map, markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    fetchNeighborhoods();
    fetchCuisines();
    updateRestaurants();
    DBHelper.toggleMap('map-btn', 'map-cell');
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods()
        .then(neighborhoods => {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        })
        .catch(DBHelper.logError);
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.textContent = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
    DBHelper.fetchCuisines()
        .then(cuisines => {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        })
        .catch(DBHelper.logError);
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');
    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.textContent = cuisine;
        option.value = cuisine;
        select.append(option);
    });
};

const showMap = () => {
    const mapBtn = document.getElementById('map-btn');
    const mapFrame = document.getElementById('map-cell');

    mapBtn.addEventListener('click', (e) => {

        // Check we've clicked on the right target
        if (!e.target.classList.contains('toggle')) return;

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
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false
    });

    updateRestaurants();

    let setTitle = () => {
        const iFrame = document.querySelector('#map iframe');
        iFrame.setAttribute('title', 'Map with markers for selected restaurants');
    }
    self.map.addListener('tilesloaded', setTitle);
};

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
        .then(restaurants => {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        })
        .catch(DBHelper.logError);
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.textContent = '';

    // Remove all map markers if map
    if (map) {
        console.log("markers deleted");
        self.markers.forEach(m => m.setMap(null));
        self.markers = [];
    }

    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = restaurants.map(restaurant => createRestaurantHTML(restaurant)).join('');
    if (window.google) {
        addMarkersToMap();
    }
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {

    const restaurantHTML =
        `<li class="restaurant-list-item">
        <picture class="flex-card-img">
            <source data-srcset="${DBHelper.srcsetForRestaurant(restaurant)}" 
            class="restaurant-img lazyload" data-sizes="auto" type="image/webp">
            <img class="restaurant-img lazyload" 
            data-src="${DBHelper.imageUrlForRestaurant(restaurant)}" alt="Photo of ${restaurant.name}">
        </picture>
        <div class="flex-card-content">
            <h3 class="restaurant-list-heading">${restaurant.name}</h3>
            <p class="neighborhood">${restaurant.neighborhood}</p>
            <p class="address">${restaurant.address}</p>
            <a href="${DBHelper.urlForRestaurant(restaurant)}" class="restaurant-link">View Venue</a>
        </div> 
    </li>`;

    return restaurantHTML;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', () => {
            window.location.href = marker.url;
        });
        self.markers.push(marker);
    });
};