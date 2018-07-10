    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(() => {
                navigator.serviceWorker.addEventListener('message', message => {
                    console.log('message received');
                    if (message.data.message === 'post-reviews') {
                        console.log(message.data.message);
                        DBHelper.fetchPendingReviewsFromDB();
                    }
                    if (message.data.message === 'heart-status'){
                        console.log(message.data.message);
                        DBHelper.fetchPendingHeartStatus();
                    }
                });
            })
            .catch(error => `ServiceWorker registration failed: ${error}`);

    }