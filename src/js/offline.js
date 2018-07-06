function registerServiceWorker() {
    if (!navigator.serviceWorker) return;

    window.addEventListener('load', function() {

        navigator.serviceWorker.register('/sw.js')
        .then((reg) => {

            if (!navigator.serviceWorker.controller) {
                return;
            }
            console.log('SW registered');
            return navigator.serviceWorker.ready;

        })
        .catch(error => `ServiceWorker registration failed: ${error}`);

        navigator.serviceWorker.addEventListener('message', message => {
            if (message.data.message == 'post-reviews') {
                console.log(message.data.message);
                // fetch reviews from database
                DBHelper.fetchPendingReviewsFromDB();
                // post them to server
                // delete cached pending review
            }
        });


    });
}

registerServiceWorker();