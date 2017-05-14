// Use ES6 syntax except Class
// Separate to different modules
// Use gulp
const app = (function() {
  
  'use strict';

  //Globals
  const endpoint = 'https://content.guardianapis.com/';
  const key = 'a0f2219a-e62d-4c78-b0ac-f4f8717d3580';
  let scrollPos = 0;
  
  // Dom
  const grid = document.getElementById("grid");
  const detail = document.getElementById("detail");
  const update = document.getElementById("update");
  const arrow = document.getElementById("arrow");
  const sectionTitle = document.getElementById("sectionTitle");
  const sections = document.querySelectorAll(".section");
  
  arrow.addEventListener('click',() => window.history.back())
  update.addEventListener('click', updateSection)

  sections.forEach((section)=>{
    section.addEventListener('click',() => scrollPos = 0)
  });


  // enable manual scrolling
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }


  /////////////DATABASE//////////////////////////
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }
  // Use the switch for better versioning
  const dbPromise = idb.open('articles-db', 2, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('articles')) {
      console.log('Creating articles object store');
      const store = upgradeDb.createObjectStore('articles', {keyPath: 'id'});
      console.log('Creating indexes');
      store.createIndex('section', 'sectionId', {unique: false});  
      store.createIndex('timeStamp', 'timeStamp', {unique: false});
      //create a timestamp index here
    }
  });
  
  ////////INITIALIZE///////////////////////////
  function init(){
    getStuff(getId(window.location.hash));
    window.onhashchange = function(){
      getStuff(getId(window.location.hash));    
    }
  }

  function getStuff(id){
    // if Id is less than ten then we get sections
    if(id.length < 10){ 
      getSection(id);
    }else{
      getDetail(id);
    }
  }

  function getId(hash){
    return (hash.replace(/[\/]/, ""))
    .replace(/[#]/, ""); // Fix this ugly code..regex
  }

  //////////////GRID////////////////////////////////////////

  function getSection(section){
    
    section = section.length === 0 ? 'world' : section;

    const range = IDBKeyRange.only(section);

    dbPromise.then(function(db) {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      const index = store.index('section');
      return index.getAll(range);
    }).then(function(items) {    
      items.length === 0 ? getData(section) : render(items, true);
    });
  }

  function getData(section){
    getJson(section)
    .then(readAsJson)
    .then(extract)
    .then(render)
    .then(addToDb)
    .catch(logError)
  }

  function getJson(section){
    return fetch(endpoint+section+"?&show-fields=all&api-key="+key);
  }

  function readAsJson(response) { 
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json()
  }

  function extract(result){
    return result.response.results;
  }

  function render(data, fromDb){  

    let str = '';

    data.forEach(function(el){ 
      str += `
      <div class="grid-cell mdc-elevation--z1 mdc-layout-grid__cell">
        <img src=${el.fields.thumbnail} >
        <a href='#/${el.id}'>
        <p class="mdc-typography--body1"> ${el.webTitle} </p>
        </a>
      </div>`;
    });

    grid.innerHTML = str;
    detail.innerHTML ='';
    arrow.style = "display:none"
    update.style = "display:revert"

    sectionTitle.innerHTML = `${data[0].sectionId.toUpperCase()}`;
    
    window.scroll(0, scrollPos);
   
    if(fromDb){
      console.log('from db')     
    }else{
      console.log('from network')
      return data; // return data to be added to database
    }
  }

  function addToDb(items){
    dbPromise.then(function(db) {
      const tx = db.transaction('articles', 'readwrite');
      const store = tx.objectStore('articles');
      items.forEach(function(item){
        item.timeStamp = Date.now();
        store.put(item); // put vs add : use put --no errors
      })
      return tx.complete;
    }).then(function() {
      console.log('items added!'); //use a snackbar
    });
  }

  function logError(error){
    console.log('Looks like there was a problem: \n', error);
  }


  ////////Details///////////////////////

  function getDetail(id){
    dbPromise.then(function(db) {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      return store.get(id);
    }).then((item)=>{
      console.log('from db');
      renderDetail(item);
    });
  }


  function renderDetail(item){
    
    if(!item){
      fetchDetail(getId(window.location.hash))
      return;
    }
    

    sanitize(item.fields.body)
    .then(function(body){
      
      let str  = `<img src=${item.fields.thumbnail} >
      <h1 class="mdc-typography--display1">${item.webTitle}</h1>
      <div>${body}</div>`;
      
      scrollPos = window.scrollY;
      grid.innerHTML = '';
      detail.innerHTML = str;
      arrow.style = "display:revert"
      update.style = "display:none"
    }).then(ShowControls); // A hack: sanitizer not preserving video controll attributes

    
  }

  function fetchDetail(id){

    // Rare Case: old bookmarked url
    // if no item, that means the old url and data misses from the database
    // use the id to fetch data online if (navigator.online) and render and save

    getJson(id)
    .then((res) => res.json())
    .then((res)=>res.response.content)
    .then(renderDetail)
    // Could then store in db
  }

 

  // Remove unwanted tags from html body, enabling proper styling
  function sanitize(html){
    return new Promise(function(resolve){
      resolve(
         DOMPurify.sanitize(html, {
          FORBID_TAGS: ['figure','figcaption']
        })
      );
    })
  }

  // Show Controls
  function ShowControls(){
    const videos = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach(function(video){
        video.controls = true;
      })
    }
  }

   
  ///////UPDATING////////////////////
  function updateSection(){
    
    if (window.navigator.onLine) { // && timeStamp - currentTime > 30 min
      
      console.log("updating section"); //Show snackbar

      let section = getId(window.location.hash);
      section = section.length === 0 ? 'world' : section;

      //Check db size, clear e.t.c
      //getData(section);
    } else {
      console.log("You are offline");
    }
  }

  function checkTimeStamp() {}

  return { init }; // ES6: make sure to polyfill
})();

app.init();


/*try to Save the images as blobs*/