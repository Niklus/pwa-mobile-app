

/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    console.log('Service Worker registration successful with scope: ',
    registration.scope);
  })
  .catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });
}*/

window.addEventListener('online', function(e) {
  console.log("You are online"); //Find a better visual indicator
}, false);

window.addEventListener('offline', function(e) {  
  console.log("You are offline");
}, false);

// check if the user is connected
if (window.navigator.onLine) {
  console.log("You are online");
} else {
  console.log("You are offline");
}



