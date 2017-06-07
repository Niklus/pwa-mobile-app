//Use the es6 "way" to register grid element and detail element: then inject them in one div as needed
//put api calls in api module

'use strict';

import List from './List';
import Detail from './Detail';
import View from './View';
import idb from '../libs/idb';

class App {

  constructor() {
    this.view = new View(this);
    this.list = new List(this.view);
    this.detail = new Detail(this.view);
    this.createDb().then(() => this.getContent());
    window.onhashchange = () => this.getContent();
  }

  createDb() {

    if (!('indexedDB' in window)) {
      alert('This browser doesn\'t support IndexedDB'); // Render something on the screen and tell them to use chrome !
      return;
    }
    
    // Use the switch for better versioning
    
    return idb.open('article-store', 2, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains('articles')) {
        console.log('Creating articles object store');
        const store = upgradeDb.createObjectStore('articles', {keyPath: 'id'});
        console.log('Creating indexes');
        store.createIndex('section', 'sectionId', {unique: false});  
        store.createIndex('timeStamp', 'timeStamp', {unique: false});
      }
    });
  }

  getContent() {
    const id = this.getId(window.location.hash);
    id.length < 10 ? this.list.getSection(id) : this.detail.getDetail(id);
  }

  getId(hash){
    return (hash.replace(/[\/]/, "")).replace(/[#]/, ""); // Fix this ugly code..regex
  }

  updateSection(section) {
    
    if (window.navigator.onLine) { // && timeStamp - currentTime > 30 min
      
      console.log("updating section"); //Show snackbar

      //let section = this.getId(window.location.hash);
      //section = section.length === 0 ? 'world' : section;

      //Check db size, clear e.t.c
      //List.getData(section);
    } else {
      console.log("You are offline");
    }
  }
}

export default App;


