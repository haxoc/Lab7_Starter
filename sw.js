// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = "lab-7-starter";
const urlsToCache = [
  "index.html",
  "assets/scripts/main.js",
  "assets/scripts/Router.js",
  "assets/styles/main.css",
  "assets/components/RecipeCard.js",
  "assets/components/RecipeExpand.js",
];

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener("activate", function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  event.waitUntil(clients.claim());
  console.log(`event ${event} happened`)
  
});

// Intercept fetch requests and store them in the cache
self.addEventListener("fetch", function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((new_res) => {
        if (!new_res || new_res.status !== 200 || new_res.type !== "basic") {
          return new_res;
        }

        let res_to_cache = new_res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, res_to_cache);
        });
        return new_res;
      });
    })
  );
});
