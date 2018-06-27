"use strict";document.addEventListener("DOMContentLoaded",function(e){fetchRestaurantFromURL(),DBHelper.toggleMap("map-anchor","map-section"),DBHelper.toggleButtonState(),formListener()}),window.initMap=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:e.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map);self.map.addListener("tilesloaded",function(){document.querySelector("#map iframe").setAttribute("title","Map with selected restaurant marker")})};var fetchRestaurantFromURL=function(){if(self.restaurant)return self.restaurant;var e=getParameterByName("id");return DBHelper.fetchRestaurantById(e).then(function(e){return self.restaurant=e,console.log(e),fillRestaurantHTML(),e}).then(function(e){return fillBreadcrumb(e),e}).catch(DBHelper.logError)},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").textContent=e.name,document.getElementById("address-title").textContent="Address",document.getElementById("restaurant-address").textContent=e.address;var t=document.getElementById("save");t.setAttribute("data-restaurant-id",e.id),t.setAttribute("aria-pressed",e.is_favorite);var n=document.getElementById("restaurant-img");(n.setAttribute("alt",e.name),n.src=DBHelper.imageUrlForRestaurant(e),n.sizes="100vw",n.srcset=DBHelper.srcsetForRestaurant(e),document.getElementById("cuisine-title").textContent="Cuisine",document.getElementById("restaurant-cuisine").textContent=e.cuisine_type,e.operating_hours)&&(document.getElementById("hours-title").textContent="Operating Hours",fillRestaurantHoursHTML());fillReviewsHTML()},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var r=document.createElement("tr"),a=document.createElement("td");a.textContent=n,a.className="day",r.appendChild(a);var d=document.createElement("td");d.textContent=e[n],d.className="time",r.appendChild(d),t.appendChild(r)}},appendReview=function(e){var t=document.getElementById("reviews-list"),n=createReviewHTML(e);t.appendChild(n)},fillReviewsHTML=function(){return DBHelper.fetchReviewsById(restaurant.id).then(function(e){var t=document.getElementById("reviews-container");if(0===e.length){var n=document.createElement("p");return n.textContent="No reviews yet!",void t.appendChild(n)}e.forEach(function(e){appendReview(e)})}).catch(DBHelper.logError)},createReviewHTML=function(e){var t=document.createElement("li");t.classList.add("reviews-list-item");var n=new Date(e.updatedAt).toLocaleString("en-US",{year:"numeric",month:"long",day:"numeric"}),r=document.createElement("div");r.classList.add("name-container");var a=document.createElement("p");a.textContent=e.name;var d=document.createElement("p");d.classList.add("review-date"),d.textContent=n,r.appendChild(a),r.appendChild(d),t.appendChild(r);var i=document.createElement("p");i.classList.add("rating"),i.textContent="Rating: "+e.rating,t.appendChild(i);var o=document.createElement("p");return o.classList.add("comments"),o.textContent=e.comments,t.appendChild(o),t},formListener=function(){var e=document.getElementById("review-form"),d=document.getElementById("reviewer-name"),i=document.getElementById("reviewer-rating"),o=document.getElementById("review-text");e.addEventListener("submit",function(e){e.preventDefault();var t=d.value,n=i.value,r=o.value,a={restaurant_id:getParameterByName("id"),name:t,rating:n,comments:r,updatedAt:new Date};console.log(a),appendReview(a),DBHelper.postReviewtoServer(a)})},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.textContent=e.name,t.appendChild(n)},getParameterByName=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null};
//# sourceMappingURL=restaurant_info.js.map
