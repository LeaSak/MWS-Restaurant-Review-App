"use strict";var idbApp=function(){var t=idb.open("restaurants",2,function(t){switch(t.oldVersion){case 0:case 1:console.log("Creating the restaurants object store"),t.createObjectStore("restaurants",{keyPath:"id"})}});return{idbPromise:t,addRestaurants:function(e){return t.then(function(t){if(t){var r=t.transaction("restaurants","readwrite").objectStore("restaurants");return Promise.all(e.map(function(t){return console.log("adding restaurants to database"),r.put(t)}))}}).catch(function(t){tx.abort(),console.error(t)})},fetchRestaurantsFromDB:function(){return t.then(function(t){return t.transaction("restaurants","readonly").objectStore("restaurants").getAll()})}}}();
//# sourceMappingURL=index.js.map
