const CACHE_NAME = 'senior-talk-cache';
const urlsToCache = [
    '/senior_talk/style/main.css',
    '/senior_talk/components/Reply.js',
    //'/senior_talk/components/Message.js',
    '/senior_talk/components/Toastr.js',
];

self.addEventListener('install', event => {
    // Perform install steps
    console.log("install the worker");
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log("fetching data...");
    const requestUrl = new URL(event.request.url);
    if (event.request.method === 'GET' && requestUrl.origin === location.origin) {
        event.respondWith(
            fetch(event.request).then(response => {
                const responseClone = response.clone();
                // Open the cache and add the image to it
                caches.open('senior-talk-cache').then(cache => {
                  cache.put(event.request, responseClone);
                });

                return response;
            }).catch(() => {
                return caches.open('senior-talk-cache').then(cache => {
                    return cache.match(event.request);
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request to make it mutable
                let fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response to make it mutable
                        let responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
        );
    }
});

self.addEventListener('activate', event => {
    let cacheWhitelist = ['senior-talk-cache'];

    console.log("activate the worker");
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
