(function() {
  'use strict';

  // Define the files to cache: Application Shell
  // cache agressively !
  // init the db on activate: use the switch method

	var filesToCache = [
		'.',
		'index.html',
		'styles/style.css',
		'pages/offline.html',
		'pages/404.html',
		'elements/app-drawer.js',
		'elements/detail-view.js',
		'elements/list-view.js',
		'elements/my-app.js',
		'libs/idb.js',
		"libs/purify.min.js",
		"libs/webcomponents-lite.js",
		"libs/material-components-web.min.js",
		"libs/material-components-web.min.css",
		"images/place-holder.jpg",
		"manifest.json",
		"api/sections.json",
		"https://fonts.googleapis.com/icon?family=Material+Icons",
		"https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
	];
	

  
  	// Define the cahce name
	var staticCacheName = 'pages-cache-v3';
  
  	// Install service worker and cache the static assets
	self.addEventListener('install', function(event) {
	  
	  //console.log('Attempting to install service worker and cache static assets');
	  
	  event.waitUntil(
	  	// Create the cache
	    caches.open(staticCacheName) 
	    .then(function(cache) {
	    	// add files to the cache
	      return cache.addAll(filesToCache); 
	    })
	  );
	});



  	/** 
     *  Intercept requests and serve from the cache if available
  	 *  Using the "cache falling to network" strategy
  	*/
  
  self.addEventListener('fetch', event => {
    
    event.respondWith(
      
      caches.match(event.request)
		.then( response => {

        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        
        //If no response make a network request
        console.log(event.request.url,  'not in cache');
        
        return fetch(event.request).then( response => {
          
          // Respond with custom 404 page if status 404
          if (response.status === 404) {
            return caches.match('pages/404.html');
          }

          return response;
        });
      }).catch(function(error) {

      	// Respond with a custom offline page if network fails
      	// If fetch cannot reach the network, it throws an error and sends it to a .catch
        console.log('Error, ', error);
        return caches.match('pages/offline.html');
      })
    );
  });


  /* 
  	Delete unused caches
    By Changing the cachename e.g to pages-cache-v3 
    we can delete the old cache
   */
  

  self.addEventListener('activate', function(event) {
	  
	  console.log('Activating new service worker...');

	  var cacheWhitelist = [staticCacheName];

	  event.waitUntil(

        //createDB() good place to create db => read: 'https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker'

	    caches.keys().then(function(cacheNames) {
	      return Promise.all(
	        cacheNames.map(function(cacheName) {
	          if (cacheWhitelist.indexOf(cacheName) === -1) {
	            return caches.delete(cacheName);
	          }
	        })
	      );
	    })
	  );
	});

	/*
		We delete old caches in the activate event to make sure that we aren't 
	  	deleting caches before the new service worker has taken over the page. 
		We create an array of caches that are currently in use and delete all other caches.
	*/
})();

