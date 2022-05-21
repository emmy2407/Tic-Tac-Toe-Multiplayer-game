//installing the service worker
const cache = "my-cache";
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cache).then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json',
                './css/style.css',
                
            ])
        })
    )
  })

  self.addEventListener('fetch', event => {
      event.respondWith(
          caches.open(cache)
          .then(cache => cache.match(event.request))
          .then(response => {
              return response || fetch(event.request)
          })
      )
  })
  
  //activate service worker, listens to the activate event      
  self.addEventListener('activate', function(event) {
    console.log('this event triggers when the service worker activates')
  })

  //   self.addEventListener('fetch', function(event) {
//     console.log('used to intercept requests so we can check for the file or data in the cache')
//   })           