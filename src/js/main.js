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

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */

 // TOD0: Template this
const createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'restaurant-list-item';

  const imgBox = document.createElement('div');
  imgBox.className = 'flex-card-img';
  li.append(imgBox);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.sizes = '(min-width: 600px) 50vw, (min-width: 960px) 33.33vw, 100vw';
  image.srcset = DBHelper.srcsetForRestaurant(restaurant);
  image.setAttribute('alt', restaurant.alt);
  imgBox.append(image);

  const contentBox = document.createElement('div');
  contentBox.className = 'flex-card-content';
  li.append(contentBox);

  const name = document.createElement('h3');
  name.textContent = restaurant.name;
  name.className = 'restaurant-list-heading';
  contentBox.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.textContent = restaurant.neighborhood;
  neighborhood.className = 'neighborhood';
  contentBox.append(neighborhood);

  const address = document.createElement('p');
  address.textContent = restaurant.address;
  address.className = 'address';
  contentBox.append(address);

  const more = document.createElement('a');
  more.className = 'restaurant-link';
  more.textContent = 'View Venue';
  more.href = DBHelper.urlForRestaurant(restaurant);
  contentBox.append(more);

  return li;
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
