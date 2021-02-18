var CACHE_NAME = 'todo-cache-v4';
var FOLDER_NAME = 'post_requests';
var IDB_VERSION = 1;
var form_data;
var urlsToCache = [
    'index.html',
    'style.css',
    'user-management.js.',
    'cell-handlebars.js',

    'icon/logo-192.png'

    'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    'https://kit.fontawesome.com/3b875e8537.js',
    'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js',
    'https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js'
];

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('install', function(event) {
    self.skipWaiting() // Activate worker immediately
    
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Start caching site...');
            return cache.addAll(urlsToCache);
        })
    );
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
                Datenbank anpassen.

        Wenn GET:
            dh Webseite oder Inhalte

            Wenn es die Webseite ist:
                Wenn man online ist:
                    GET files

                Wenn man offline ist:   
                    Serve cached files


            Wenn es Inhalte sind (Request zu .php):
                Wenn man online ist:
                    GET response

                Wenn man offline ist:
                    Speichere die Ergebnisse in der lokalen datenbank.
                    Schicke dem user die Ergebnisse zurück
    */

    if (event.request.method === 'POST') { // Wenn POST
        let successful = true;
        event.respondWith( //Wenn man online ist
            fetch(event.request.clone()
        ).catch(function (error) { //Wenn man offline ist
            savePostRequests(event.request.clone().url, form_data);
            successful = false;
        }));
        console.log(successful);
    } 
    else { // Wenn GET
        event.respondWith(fetch(event.request));
    }

//#region Comments

/*

    if (event.request.method === 'POST') {
        // attempt to send request normally
        event.respondWith(fetch(event.request.clone()).catch(function (error) {
            // only save post requests in browser, if an error occurs
            console.log("Fetch POST");
            savePostRequests(event.request.clone().url, form_data)
        }));
    }
    else { // Get request
        event.respondWith(
            fetch(event.request).catch(function(e) {
                console.error('Fetch failed; returning offline page instead.', e);

                var init = { "status" : 200 , "statusText" : "offline" };
                var responseToCache = new Response(null, init);

                //Irgendwas stimmt da nicht
                return caches.open(CACHE_NAME).then(function(cache) {
                    cache.put("index.html", responseToCache);

                    console.log("Body: " + responseToCache.body);
                    if(responseToCache.body == null) {
                        responseToCache = new Response("index.html", init);
                        console.log("Body2: ");
                    }

                    return responseToCache;
                });
            })
        );
*/

        /*

        if (event.request.headers.get('accept').indexOf('text/html') !== -1) {
            console.log('Handling fetch event for', event.request.url);
            event.respondWith(
                fetch(event.request).catch(function(e) {
                    console.error('Fetch failed; returning offline page instead.', e);
                    return caches.open(CACHE_NAME).then(function(cache) {
                        return cache.match(event.request, {ignoreVary: true}) 
                    });
                })
            );
        }
        else {
            console.log('Request for items');

            event.respondWith(
                //Try online if offline return empty
                fetch(event.request).then( function(response) {
                    console.log(JSON.parse(response.body));
                    if(response.body == "{}") {
                        return response;
                    }
                    caches.open(CACHE_NAME).then(function(cache) {
                        console.log('Opened cache');
                        cache.add("index.html");
                    });
                    return response;
                }).catch(function(e) {
                    // offline
                    var init = { "status" : 200 , "statusText" : "offline" };
                    var response = new Response("{}",init);
                    return response;
                })
            );
        }
        */

        /*
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return fetch(event.request).then( function(response) {
                    
                    // Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        console.log("No valid response - Cached files");

                        var responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                        return responseToCache;
                    }

                    console.log("Valid response - No cached files")
                    return response;
                }).catch(function(err) { // fallback mechanism
                    console.log("No response - Cached files");

                    console.log(event.request);
                    caches.open(CACHE_NAME).then(function(cache) { 
                        console.log(cache.match(event.request));
                    });
                    
                    /*
                    return caches.open(err).then(function(cache) {
                        return cache.match('offline.html');
                    });
                    
                    caches.open(CACHE_NAME).then(function(cache) {
                        var cacheMatch = cache.match(event.request);
                        if(cacheMatch.statusText == "error") {
                            return "{}";
                        }
                        return cacheMatch;
                    });
                });
            })
        );
        */
//#endregion

    }
);

//#region Local Database
/*
    Functions for local Database:

        Init Database
        Change Content ("Halo dass isst teyt" -> "Hallo das ist text")
        Change Type (Todo -> Done)
        Soft Delete
        Hard Delete
        Add Item (Content + Type)
        Read Items
*/

var db;

function InitDatabase() {
    db = openDatabase('todolist', '1.0', 'Database of latest opened Todolist', 2 * 1024 * 1024);

    db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS todolist (`title` text NOT NULL, `content` text NOT NULL, `color` text DEFAULT `black`, `cate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), `uniqe_id` text DEFAULT NULL, `order` int DEFAULT 0, `hidden` tinyint(1) NOT NULL DEFAULT 0) ENGINE=InnoDB DEFAULT CHARSET=latin1;'); 
    });
}

//#endregion  



function openDatabase () {
    // if `flask-form` does not already exist in our browser (under our site), it is created
    var indexedDBOpenRequest = indexedDB.open('flask-form', IDB_VERSION)
    indexedDBOpenRequest.onerror = function (error) {
        // error creating db
        console.error('IndexedDB error:', error);
    }
    indexedDBOpenRequest.onupgradeneeded = function () {
        // This should only executes if there's a need to 
        // create/update db.
        this.result.createObjectStore('post_requests', {
            autoIncrement: true, keyPath: 'id' 
        });
    }
    // This will execute each time the database is opened.
    indexedDBOpenRequest.onsuccess = function () {
        return this.result;
    }
}
var our_db = openDatabase();

self.addEventListener('message', function (event) {
    console.log('form data', event.data)
    if (event.data.hasOwnProperty('form_data')) {
        // receives form data from script.js upon submission
        form_data = event.data.form_data;
    }
});

function getObjectStore (storeName, mode) {
    // retrieve our object store
    return our_db.transaction(storeName, mode).objectStore(storeName);
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

self.addEventListener('sync', function (event) {
    console.log('Now online!');
    if (event.tag === 'sendFormData') { // event.tag name checked
        // here must be the same as the one used while registering
        // sync
        event.waitUntil(
            // Send our POST request to the server, now that the user is
            // online
            sendPostToServer()
        );
        console.log('Sent offline data to server!');
    }
});

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