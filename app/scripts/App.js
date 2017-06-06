//Use the es6 "way" to register grid element and detail element: then inject them in one div as needed
//put api calls in api module

'use strict';

import List from './List';
import Detail from './Detail';
import idb from '../libs/idb';

class App {

  constructor() {

    // Enable manual scrolling
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    //Set scroll position
    this.scrollPos = 0;
    this.update = document.getElementById("update");
    this.arrow = document.getElementById("arrow");
    this.sectionTitle = document.getElementById("sectionTitle");
    this.sections = document.querySelectorAll(".section");
    this.content = document.getElementById("content");
    this.list = new List(this.content);
    this.detail = new Detail(this.content);
    
    //Event listeners
    this.arrow.addEventListener('click',() => window.history.back());
    this.update.addEventListener('click', this.updateSection);
    this.sections.forEach( section => {
      section.addEventListener('click',() => this.scrollPos = 0);
    });

    window.addEventListener('online', () => console.log("You are online"));
    window.addEventListener('offline',() => console.log("You are offline"));

    // Check for conection
    if (window.navigator.onLine) {
      console.log("You are online");
    } else {
      console.log("You are offline");
    }
  
    this.createDb();//.then(() => this.render());
    //window.onhashchange = () => this.render();   
  }

  createDb() {
    /*
      if (!('indexedDB' in window)) {
        alert('This browser doesn\'t support IndexedDB'); // Render something on the screen and tell them to use chrome !
        return;
      }
      // Use the switch for better versioning
    */
    /*return idb.open('articles-db', 1, upgradeDb => {
      if (!upgradeDb.objectStoreNames.contains('articles')) {
        console.log('Creating articles object store');
        const store = upgradeDb.createObjectStore('articles', {keyPath: 'id'});
        console.log('Creating indexes');
        store.createIndex('section', 'sectionId', {unique: false});  
        store.createIndex('timeStamp', 'timeStamp', {unique: false});
      }
    })*/
    console.log('make db first then do stuff')
  }

  render() {
    const id = this.getId(window.location.hash);
    id.length < 10 ? this.renderList(id) : this.renderDetail(id);
  }

  renderList(id){
    window.scroll(0, this.scrollPos);
    this.arrow.style = "display:none";
    this.update.style = "display:revert";
    //this.sectionTitle.innerHTML = `${data[0].sectionId.toUpperCase()} NEWS`;
    this.list.getSection(id);
  }

  renderDetail(id){
    this.scrollPos = window.scrollY;
    window.scroll(0, 0);
    this.arrow.style = "display:revert";
    this.update.style = "display:none";
    this.detail.getDetail(id);
  }

  getId(hash){
    return (hash.replace(/[\/]/, "")).replace(/[#]/, ""); // Fix this ugly code..regex
  }

  updateSection() {
    
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


