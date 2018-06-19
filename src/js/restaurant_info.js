

document.addEventListener('DOMContentLoaded', (event) => {
    fetchRestaurantFromURL();
    DBHelper.toggleMap('map-anchor', 'map-section');
    DBHelper.toggleButtonState();
});


/**
 * Initialize Google map
 */
window.initMap = (restaurant = self.restaurant) => {
    self.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });

            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);

            let setTitle = () => {
                const iFrame = document.querySelector('#map iframe');
                iFrame.setAttribute('title', 'Map with selected restaurant marker');
            }
            self.map.addListener('tilesloaded', setTitle);
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = () => {
    if (self.restaurant) {
        return self.restaurant;
    }

    const id = getParameterByName('id');
    return DBHelper.fetchRestaurantById(id)
    .then((restaurant) => {
                self.restaurant = restaurant;
                console.log(restaurant);
                fillRestaurantHTML();
                return restaurant;
    })
    .then((restaurant) => {
        fillBreadcrumb(restaurant)
        return restaurant;
    })
    .catch(DBHelper.logError);
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.textContent = restaurant.name;

    const addressTitle = document.getElementById('address-title');
    addressTitle.textContent = 'Address';

    const address = document.getElementById('restaurant-address');
    address.textContent = restaurant.address;

    const saveButton = document.getElementById('save');
    saveButton.setAttribute('data-restaurant-id', restaurant.id);
    saveButton.setAttribute('aria-pressed', restaurant.is_favorite);

    const image = document.getElementById('restaurant-img');
    image.setAttribute('alt', restaurant.name);
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.sizes = '100vw';
    image.srcset = DBHelper.srcsetForRestaurant(restaurant);

    const cuisineTitle = document.getElementById('cuisine-title');
    cuisineTitle.textContent = 'Cuisine';

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.textContent = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        const hourTitle = document.getElementById('hours-title');
        hourTitle.textContent = 'Operating Hours';

        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');

    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.textContent = key;
        day.className = 'day';
        row.appendChild(day);

        const time = document.createElement('td');
        time.textContent = operatingHours[key];
        time.className = 'time';
        row.appendChild(time);

        hours.appendChild(row);
    }
};

/**
 * Fetch reviews from Database or network
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = () => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h4');
    title.className = 'review-section-title';
    title.textContent = 'Reviews';
    container.appendChild(title);
    console.log(restaurant.id);

    // Fetch all restaurant reviews and append to page
    return DBHelper.fetchReviewsById(restaurant.id)
    .then((reviews) => {

        if (reviews.length === 0) {
            const noReviews = document.createElement('p');
            noReviews.textContent = 'No reviews yet!';
            container.appendChild(noReviews);
            return;
        }

        const ul = document.getElementById('reviews-list');
        ul.innerHTML = reviews.map(review => createReviewHTML(review)).join('');
        container.appendChild(ul);


    })
    .catch(DBHelper.logError);
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(review.createdAt).toLocaleString('en-US', dateOptions);
    console.log(date);

    const reviewHTML =
    `<li class="reviews-list-item">
        <div class="name-container">
            <p>${review.name}</p>
            <p class="review-date">${date}</p>
        </div>
        <p class="rating">Rating: ${review.rating}</p>
        <p class="comments">${review.comments}</p>
    </li>`;

    return reviewHTML;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */

const fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.textContent = restaurant.name;
    breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};