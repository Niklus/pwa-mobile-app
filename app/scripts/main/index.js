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

import App from '../App';
import idb from '../../libs/idb';

window.addEventListener("load", () => {
  
  if (!('indexedDB' in window)) {
    alert('This browser doesn\'t support IndexedDB'); // Render something on the screen and tell them to use chrome !
    return;
  }

  // Use the switch for better versioning
  idb.open('articles-db', 2, upgradeDb => {
    if (!upgradeDb.objectStoreNames.contains('articles')) {
      console.log('Creating articles object store');
      const store = upgradeDb.createObjectStore('articles', {keyPath: 'id'});
      console.log('Creating indexes');
      store.createIndex('section', 'sectionId', {unique: false});  
      store.createIndex('timeStamp', 'timeStamp', {unique: false});
    }
  }).then(() => new App()); // Initialize app after setting up dom and the database
});
