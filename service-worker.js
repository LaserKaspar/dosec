var CACHE_NAME = 'todo-cache-v6'; //change to trigger pwa update
var FOLDER_NAME = 'post_requests';
var IDB_VERSION = 1;

var form_data;
//blacklist in register-service-worker.js:blacklist

this.onpush = event => {
    console.log(event.data);
    // From here we can write the data to IndexedDB, send it to any open
    // windows, display a notification, etc.
}

self.addEventListener('activate', function(event) {
    console.log("SW - available");
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('install', function(event) {
    self.skipWaiting() // Activate worker immediately
    
    /*
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Start caching site...');
            return cache.addAll(urlsToCache);
        })
    );
    */
});

self.addEventListener('fetch', function(event) {

    /*
        Wenn POST:
            dh der Client will etwas speichern

            Wenn man offline ist:
                Den POST für später speichern.

            Wenn man online ist:
                Den POST durchführen.

                Wenn es das erste mal ist:
                    Lokale Datenbank löschen und Ergebnisse speichern.

            Immer:
                Lokale Datenbank anpassen.

        Wenn GET:
            dh Webseite oder Inhalte

            Wenn es die Webseite ist:
                Wenn man online ist:
                    GET files

                Wenn man offline ist:   
                    Serve cached files


            Wenn es Inhalte sind (Request zu read.php):
                Wenn man online ist:
                    GET response

                Wenn man offline ist:
                    Speichere die Ergebnisse in der lokalen datenbank.
                    Schicke dem user die Ergebnisse zurück
    */

    // skip the request. if request is not made with http protocol
    if (!(event.request.url.indexOf('http') === 0)) return; 

    if (event.request.method === 'POST') { // Wenn POST
        let successful = true;
        event.respondWith( //Wenn man online ist
            fetch(event.request.clone())
            .catch(function (error) { //Wenn man offline ist
                savePostRequests(event.request.clone().url, form_data);
                successful = false;
            })
        );
        console.log(successful ? "Responded with online data." : "User seems to be offline caching request..." );
    }
    else { // GET
        if(event.request.url.endsWith(".php")) { // cells
            event.respondWith( //Wenn man online ist
                fetch(event.request.clone())
                .catch(function (error) { //Wenn man offline ist
                    //Respond with local Database
                    console.log("Respond with local database not finished!");

                    event.request.data

                    var deleteOperation = {operation : "delete", user : "felix", uniqe_id : "uu_id"};
                    var createOperation = {operation : "create", user : "felix", uniqe_id : "uu_id", cell : {title : "Test title", content : "Test content", color : "red"}};
                    var editOperation = {operation : "edit", user : "felix", uniqe_id : "uu_id", cell : {title : "Test title", content : "Test content", color : "red"}};

                    var getLastModDate = {operation : "getLastMod", user : "felix"};
                    var getOperation = {operation : "get", user : "felix", pwd : "hashedPwd"};
                    
                    var checkPwd = {operation : "checkPwd", user : "felix", pwd : "hashedPwd"};

                    var getSettings = {operation : "getSettings", user : "felix", pwd : "hashedPwd"};
                    var setSettings = {operation : "setSettings", user : "felix", pwd : "hashedPwd", settings : {encrypt : false, links : true}}


                    console.log("Request for cells was not successful using database.");
                    console.log("link: " + event.request.url.split("#")[0]);
                })
            );
        }
        else { // Website files eg. scripts, fonts, index...

            event.respondWith(
                caches.open(CACHE_NAME)
                .then(function(cache) {
                    var cache_url = event.request.url.split("#")[0];
                    if(cache_url.endsWith("/")) { cache_url += "index.html"; }

                    return cache.match(cache_url)
                    .then(function(response) {
                        var fetchPromise = fetch(event.request).then(function(networkResponse) { //online
                            cache.put(cache_url, networkResponse.clone());
                            return networkResponse;
                        }).catch(error => { //offline
                            console.log(["You may be offline or your network connection is really slow...", error, cache_url]) 
                        });
                        // response contains cached data, if available
                        return response || fetchPromise;
                    });
                })
            );

            /*
            event.respondWith(
                fetch(event.request.clone())
                .catch(function (error) { //Wenn man offline ist
                    //Respond with local Cache
                    var cache_url = event.request.url.split("#")[0];
                    console.log("Responding with local cache of files.");

                    if(cache_url.endsWith("/")) { cache_url += "index.html"; }

                    var cache = caches.open(CACHE_NAME).then(function(cache) {
                        return cache.match(cache_url);
                    });

                    console.log("Request for web files eg. scrips, fonts, etc. was not successful using cache.");
                    console.log("link: " + event.request.url.split("#")[0]);

                    return cache;

                    
                    service worker cache: 
                        deliver cached files if available 
                            -> if not possible try network 
                        Try to fetch every time for next use if available
                    
                })
            );
            */
        }
    } 
});

function openDatabase () {
    var indexedDBOpenRequest = indexedDB.open('post-requests', IDB_VERSION)

    indexedDBOpenRequest.onerror = function (error) {
        console.error('IndexedDB error:', error);
    }

    // This only executes if there's a need to create/update db.
    indexedDBOpenRequest.onupgradeneeded = function () {
        this.result.createObjectStore('post_requests', {
            autoIncrement: true, keyPath: 'id' 
        });
    }
    // This will execute each time the database is opened.
    indexedDBOpenRequest.onsuccess = function () {
        idx_db = this.result;
    }
}
var idx_db;
openDatabase();

var form_data;
self.addEventListener('message', function (event) {
    //Cache all Requests if online
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(event.data.payload);
            })
        );
    }
    //St
    else if (event.data.hasOwnProperty('form_data')) {
        // receives form data from script upon submission
        form_data = event.data.form_data;
    }
    else if (event.data == "sync") {
        console.log('Now online!');
        event.waitUntil(
            // Send our POST request to the server, now that the user is
            // online
            sendPostToServer()
        );
        console.log('Sent offline data to server!');
    }
});

function getObjectStore (storeName, mode) {
    // retrieve our object store
    return idx_db.transaction(storeName, mode).objectStore(storeName);
}
function savePostRequests (url, payload) {
    // get object_store and save our payload inside it
    var request = getObjectStore(FOLDER_NAME, 'readwrite').add({
        url: url,
        payload: payload,
        method: 'POST'
    })
    request.onsuccess = function (event) {
        console.log('a new pos_ request has been added to indexedb');
    }
    request.onerror = function (error) {
        console.error(error);
    }
}

function sendPostToServer () {
    var savedRequests = []
    var req = getObjectStore(FOLDER_NAME).openCursor() // FOLDERNAME
    // is 'post_requests'
    req.onsuccess = async function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // Keep moving the cursor forward and collecting saved
            // requests.
            savedRequests.push(cursor.value);
            cursor.continue();
        } 
        else {
            // At this point, we have collected all the post requests in
            // indexedb.
            for (let savedRequest of savedRequests) {
                // send them to the server one after the other
                console.log('saved request', savedRequest)
                var requestUrl = savedRequest.url
                var payload = JSON.stringify(savedRequest.payload)
                console.log("Hier habe ich aufgehört zu arbeiten. Scheinbar ein fehler, dass das zwar an den server gesendet wird aber nicht im richtigen Format");

                $.post(requestUrl, payload, function(response, sucess) {
                    if(response) console.log("Server Response: " + response);
                    if(!sucess) console.log("Server not responding");
                });

                var method = savedRequest.method
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                } 
                // if you have any other headers put them here
                fetch(requestUrl, {
                    headers: headers,
                    method: method,
                    body: payload
                }).then(function (response) {
                    console.log('server response', response)
                    if (response.status < 400) {
                        // If sending the POST request was successful, then
                        // remove it from the IndexedDB.
                        getObjectStore(FOLDER_NAME, 'readwrite').delete(savedRequest.id);
                    } 
                }).catch(function (error) {
                    // This will be triggered if the network is still down. 
                    // The request will be replayed again
                    // the next time the service worker starts up.
                    console.error('Send to Server failed:', error)
                    // since we are in a catch, it is important an error is
                    //thrown,so the background sync knows to keep retrying 
                    // the send to server
                    throw error
                });
            }
        }
    }
}

self.addEventListener('notificationclick', event => {
    event.waitUntil(self.clients.matchAll().then(clients => {
        if (clients.length){ // check if at least one tab is already open
            clients[0].focus();
        } else {
            self.clients.openWindow('/');
        }
    }));
});
