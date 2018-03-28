"use strict";var map,restaurants=void 0,neighborhoods=void 0,cuisines=void 0,markers=[];document.addEventListener("DOMContentLoaded",function(e){fetchNeighborhoods(),fetchCuisines()});var fetchNeighborhoods=function(){DBHelper.fetchNeighborhoods(function(e,t){e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.neighborhoods,n=document.getElementById("neighborhoods-select");e.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,n.append(t)})},fetchCuisines=function(){DBHelper.fetchCuisines(function(e,t){e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})},fillCuisinesHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.cuisines,n=document.getElementById("cuisines-select");e.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,n.append(t)})};window.initMap=function(){self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants(),self.map.addListener("tilesloaded",function(){return document.querySelector("#map iframe").setAttribute("title","Map with markers for selected restaurants")})};var updateRestaurants=function(){var e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,a=t.selectedIndex,r=e[n].value,s=t[a].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(r,s,function(e,t){e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})},resetRestaurants=function(e){self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(function(e){return e.setMap(null)}),self.markers=[],self.restaurants=e},fillRestaurantsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants,t=document.getElementById("restaurants-list");e.forEach(function(e){t.append(createRestaurantHTML(e))}),addMarkersToMap()},createRestaurantHTML=function(e){var t=document.createElement("li");t.className="restaurant-list-item";var n=document.createElement("div");n.className="flex-card-img",t.append(n);var a=document.createElement("img");a.className="restaurant-img",a.src=DBHelper.imageUrlForRestaurant(e),a.sizes="(min-width: 600px) 50vw, (min-width: 960px) 33.33vw, 100vw",a.srcset=DBHelper.srcsetForRestaurant(e),a.setAttribute("alt",e.alt),n.append(a);var r=document.createElement("div");r.className="flex-card-content",t.append(r);var s=document.createElement("h3");s.innerHTML=e.name,s.className="restaurant-list-heading",r.append(s);var o=document.createElement("p");o.innerHTML=e.neighborhood,o.className="neighborhood",r.append(o);var i=document.createElement("p");i.innerHTML=e.address,i.className="address",r.append(i);var l=document.createElement("a");return l.className="restaurant-link",l.innerHTML="View Venue",l.href=DBHelper.urlForRestaurant(e),r.append(l),t},addMarkersToMap=function(){(0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants).forEach(function(e){var t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",function(){window.location.href=t.url}),self.markers.push(t)})};
//# sourceMappingURL=main.js.map
