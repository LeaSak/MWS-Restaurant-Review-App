"use strict";document.addEventListener("DOMContentLoaded",function(e){fetchRestaurantFromURL(),DBHelper.toggleMap("map-anchor","map-section")}),window.initMap=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:e.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map);self.map.addListener("tilesloaded",function(){document.querySelector("#map iframe").setAttribute("title","Map with selected restaurant marker")})};var fetchRestaurantFromURL=function(){if(self.restaurant)return self.restaurant;var e=getParameterByName("id");return DBHelper.fetchRestaurantById(e).then(function(e){return self.restaurant=e,console.log(e),fillRestaurantHTML(),e}).then(function(e){return fillBreadcrumb(e),e}).catch(DBHelper.logError)},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").textContent=e.name,document.getElementById("address-title").textContent="Address",document.getElementById("restaurant-address").textContent=e.address;var t=document.getElementById("restaurant-img");(t.setAttribute("alt",e.name),t.src=DBHelper.imageUrlForRestaurant(e),t.sizes="100vw",t.srcset=DBHelper.srcsetForRestaurant(e),document.getElementById("cuisine-title").textContent="Cuisine",document.getElementById("restaurant-cuisine").textContent=e.cuisine_type,e.operating_hours)&&(document.getElementById("hours-title").textContent="Operating Hours",fillRestaurantHoursHTML());fillReviewsHTML()},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var r=document.createElement("tr"),a=document.createElement("td");a.textContent=n,a.className="day",r.appendChild(a);var l=document.createElement("td");l.textContent=e[n],l.className="time",r.appendChild(l),t.appendChild(r)}},fillReviewsHTML=function(){var r=document.getElementById("reviews-container"),e=document.createElement("h4");return e.className="review-section-title",e.textContent="Reviews",r.appendChild(e),console.log(restaurant.id),DBHelper.fetchReviewsById(restaurant.id).then(function(e){if(0===e.length){var t=document.createElement("p");return t.textContent="No reviews yet!",void r.appendChild(t)}var n=document.getElementById("reviews-list");n.innerHTML=e.map(function(e){return createReviewHTML(e)}).join(""),r.appendChild(n)}).catch(DBHelper.logError)},createReviewHTML=function(e){var t=new Date(e.createdAt).toLocaleString("en-US",{year:"numeric",month:"long",day:"numeric"});return console.log(t),'<li class="reviews-list-item">\n        <div class="name-container">\n            <p>'+e.name+'</p>\n            <p class="review-date">'+t+'</p>\n        </div>\n        <p class="rating">Rating: '+e.rating+'</p>\n        <p class="comments">'+e.comments+"</p>\n    </li>"},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.textContent=e.name,t.appendChild(n)},getParameterByName=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null};
//# sourceMappingURL=restaurant_info.js.map
