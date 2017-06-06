//import setupServiceWorker from './setupServiceWorker';
// setupServiceWorker(); 
// Play with custom vanilla serviceworker first
// Then use the precache and sw-toolbox if necessary.


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

'use strict';

import App from '../App';


window.addEventListener("load", () => new App());