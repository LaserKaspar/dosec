var urlBlacklist = [
    //not implemented
    //remove this array from toCache
];

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);

        //serviceWorkerRegistration.showNotification("test", {icon: "icon/logo-192.png"});

    }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });

    navigator.serviceWorker.ready.then(function(registration) {
        console.log('Service Worker Ready');

        //asyncPush(registration);

        console.log('Sync event registered!');

        //*---------------*
        // perform caching
        //*---------------*
        let toCache = performance.getEntriesByType('resource').map((r) => r.name);
        console.log(toCache);
        //remove blacklisted requests

        const data = {
            type: 'CACHE_URLS',
            payload: [
                location.href,
                ...toCache
            ]
        };
        registration.active.postMessage(data);

        return registration.active.postMessage("sync");
    }).catch(function(error) {
        // system was unable to register for a sync,
        // this could be an OS-level restriction
        console.log('Sync registration failed...' + error);
    });

    /*
    var pushSubscription;

    async function asyncPush(serviceWorkerRegistration) { //ich sollte vapid versuchen
        try {
            pushSubscription = serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BDj0C06ShQAIsDQ64CUVjj8VAWyYfZKrXDYZfbPsi0H1S7lbMFcMAweiMzAFrHd1BZ2dW8oM5idkuXcBOWqGqa0"
            });
            // The push subscription details needed by the application
            // server are now available, and can be sent to it using,
            // for example, an XMLHttpRequest.
            console.log(pushSubscription.endpoint);
            console.log(pushSubscription.getKey("p256dh"));
            console.log(pushSubscription.getKey("auth"));
        } catch (err) {
            // In a production environment it might make sense to
            // also report information about errors back to the
            // application server.
            console.log(err);
        }
    }
    */
}