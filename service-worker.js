const CACHE_NAME = 'senior-talk-cache';
const urlsToCache = [
    '/senior_talk/style/main.css',
    //'/senior_talk/components/Reply.js',
    //'/senior_talk/components/Message.js',
    //'/senior_talk/components/Toastr.js',
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
