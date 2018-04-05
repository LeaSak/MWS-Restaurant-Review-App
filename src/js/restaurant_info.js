/**
 * Initialize Google map, called from HTML.
 */

window.initMap = () => {
    fetchRestaurantFromURL()
    .then((restaurant) => {
            self.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            
            fillBreadcrumb();
            
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
            
            let setTitle = () => {
                const iFrame = document.querySelector('#map iframe');
                iFrame.setAttribute('title', 'Map with selected restaurant marker');
            }
            self.map.addListener('tilesloaded', setTitle);
    })
    .catch(error => {
        console.error(error);
    });
};
/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = () => {
    const id = getParameterByName('id');
    if (self.restaurant) {
        return self.restaurant;
    }
    
    else {
        return DBHelper.fetchRestaurantById(id)
            .then((restaurant) => {
                self.restaurant = restaurant;
                fillRestaurantHTML();
                return restaurant;
            })
            .catch(error => {
                if (!id || !restaurant) {
                    console.error(error);
                }
            });

    }
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

    const image = document.getElementById('restaurant-img');
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('alt', restaurant.alt);
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
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
    title.className = 'review-section-title';
    title.textContent = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.textContent = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
    const li = document.createElement('li');
    li.className = 'reviews-list-item';

    const nameBox = document.createElement('div');
    nameBox.className = 'name-container';

    const name = document.createElement('p');
    name.textContent = review.name;
    li.appendChild(nameBox);
    nameBox.appendChild(name);

    const date = document.createElement('p');
    date.textContent = review.date;
    date.className = 'review-date';
    nameBox.appendChild(date);

    const rating = document.createElement('p');
    rating.textContent = `Rating: ${review.rating}`;
    rating.className = 'rating';
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.textContent = review.comments;
    comments.className = 'comments';
    li.appendChild(comments);

    return li;
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