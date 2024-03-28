const staticCacheName = 'static-site-v1'
const dynamicCacheName = 'dynamic-site-v1'
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v141/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
]

self.addEventListener('install', async event => {
    console.log('####: Service Worker has been installed', event)
    const cache = await caches.open(staticCacheName)
    await cache.addAll(ASSETS)
})

self.addEventListener('activate', async event => {
    console.log('####: Service Worker has been activated', event)
    const cachesKeysArr = await caches.keys()
    console.log('####: Caches keys', cachesKeysArr)
    await Promise.all(
        cachesKeysArr
            .filter(key => key !== staticCacheName)
            .map(key => caches.delete(key))
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(cacheFirst(event.request))
    // event.respondWith(
    //     caches.match(event.request).then(cacheRes => {
    //         return cacheRes || fetch(event.request).then(response => {
    //             return caches.open(dynamicCacheName).then(cache => {
    //                 if (event.request.url.includes('http://') || event.request.url.includes('https://'))
    //                     cache.put(event.request.url, response.clone())
    //                 return response
    //             })
    //         })
    //     })
    // )
})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    // console.log('####: cached', cached)
    try {
        return cached ?? await fetch(request)
    } catch (e) {
        console.log('####: e', e)
        return networkFirst(request)
    }
}

async function networkFirst (request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request)
        if (request.url.includes('http://') || request.url.includes('https://'))
            await cache.put(request, response.clone())
        return response
    } catch (e) {
        console.log('####: e', e)
        const cached = await cache.match(request)
        return cached
    }
}
