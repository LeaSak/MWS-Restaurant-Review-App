/**
 * IndexedDB 
 *
 */

const idbApp = (() => {

    const idbPromise = idb.open('restaurants', 2, (upgradeDb) => {
        switch (upgradeDb.oldVersion) {
            case 0:
                // a placeholder case so that the switch block will
                // execute when the database is first created
                // (oldVersion is 0)
            case 1:
                console.log('Creating the restaurants object store');
                upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
        };
    });

    const addRestaurants = (restaurants) => {
        return idbPromise.then((db) => {
                if (!db) {
                    return;
                }
                const tx = db.transaction('restaurants', 'readwrite');
                const store = tx.objectStore('restaurants');

                return Promise.all(restaurants.map(restaurant => {
                	console.log('adding restaurants to database');
                    return store.put(restaurant);
                }));
            })
            .catch((error) => {
                tx.abort();
                console.error(error);
            });
    }

    const fetchRestaurantsFromDB = () => {
        return idbPromise.then((db) => {
            const tx = db.transaction('restaurants', 'readonly');
            const store = tx.objectStore('restaurants');
            return store.getAll();
        });
    }

    return {
        idbPromise: idbPromise,
        addRestaurants: addRestaurants,
        fetchRestaurantsFromDB: fetchRestaurantsFromDB
    };

})();