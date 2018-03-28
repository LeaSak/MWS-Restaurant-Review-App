"use strict";var _createClass=function(){function u(n,e){for(var t=0;t<e.length;t++){var u=e[t];u.enumerable=u.enumerable||!1,u.configurable=!0,"value"in u&&(u.writable=!0),Object.defineProperty(n,u.key,u)}}return function(n,e,t){return e&&u(n.prototype,e),t&&u(n,t),n}}();function _classCallCheck(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}var DBHelper=function(){function i(){_classCallCheck(this,i)}return _createClass(i,null,[{key:"fetchRestaurants",value:function(t){var u=new XMLHttpRequest;u.open("GET",i.DATABASE_URL),u.onload=function(){if(200===u.status){var n=JSON.parse(u.responseText).restaurants;t(null,n)}else{var e="Request failed. Returned status of "+u.status;t(e,null)}},u.send()}},{key:"fetchRestaurantById",value:function(u,r){i.fetchRestaurants(function(n,e){if(n)r(n,null);else{var t=e.find(function(n){return n.id==u});t?r(null,t):r("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(u,r){i.fetchRestaurants(function(n,e){if(n)r(n,null);else{var t=e.filter(function(n){return n.cuisine_type==u});r(null,t)}})}},{key:"fetchRestaurantByNeighborhood",value:function(u,r){i.fetchRestaurants(function(n,e){if(n)r(n,null);else{var t=e.filter(function(n){return n.neighborhood==u});r(null,t)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(u,r,a){i.fetchRestaurants(function(n,e){if(n)a(n,null);else{var t=e;"all"!=u&&(t=t.filter(function(n){return n.cuisine_type==u})),"all"!=r&&(t=t.filter(function(n){return n.neighborhood==r})),a(null,t)}})}},{key:"fetchNeighborhoods",value:function(r){i.fetchRestaurants(function(n,t){if(n)r(n,null);else{var u=t.map(function(n,e){return t[e].neighborhood}),e=u.filter(function(n,e){return u.indexOf(n)==e});r(null,e)}})}},{key:"fetchCuisines",value:function(r){i.fetchRestaurants(function(n,t){if(n)r(n,null);else{var u=t.map(function(n,e){return t[e].cuisine_type}),e=u.filter(function(n,e){return u.indexOf(n)==e});r(null,e)}})}},{key:"urlForRestaurant",value:function(n){return"./restaurant.html?id="+n.id}},{key:"imageUrlForRestaurant",value:function(n){return"img/"+n.id+"-600.jpg"}},{key:"srcsetForRestaurant",value:function(n){return"img/"+n.id+"-400.jpg 400w, \n      img/"+n.id+"-600.jpg 600w, \n      img/"+n.id+"-800.jpg 800w,\n      img/"+n.id+"-1200.jpg 1200w,\n      img/"+n.id+"-1500.jpg 1500w,\n      img/"+n.id+"-2000.jpg 2000w"}},{key:"mapMarkerForRestaurant",value:function(n,e){return new google.maps.Marker({position:n.latlng,title:n.name,url:i.urlForRestaurant(n),map:e,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:8000/data/restaurants.json"}}]),i}();
//# sourceMappingURL=dbhelper.js.map