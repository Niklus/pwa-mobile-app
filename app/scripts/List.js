
'use strict';

import idb from '../libs/idb';
const dbPromise = idb.open('articles-db');

class List {

  constructor(content) {
    this.content = content;
  }

  getSection(section){
    
    section = section.length === 0 ? 'world' : section;

    const range = IDBKeyRange.only(section);

    dbPromise.then(function(db) {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      const index = store.index('section');
      return index.getAll(range);
    }).then((items) => {   
      items.length === 0 ? this.getData(section) : this.render(items, true);
    });
  }

  getData(section){    
    this.getJson(section)
    .then(this.readAsJson)
    .then(res => res.response.results)
    .then(items => this.render(items))
    .then(items => this.addToDb(items))
    .catch(this.logError);
  }

  getJson(section){
    const key = 'a0f2219a-e62d-4c78-b0ac-f4f8717d3580';
    const url = "https://content.guardianapis.com/";
    return fetch(`${url}${section}?&show-fields=all&api-key=${key}`);
  }

  readAsJson(response) { 
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }

  render(data, fromDb){  

    let str = '';
    
    // Order from the latest
    data = data.sort(function(a, b){
      
      const dateA = a.webPublicationDate;
      const dateB = b.webPublicationDate;
      
      if(dateA > dateB) {
        return -1;
      }

      if(dateA < dateB){
        return 1;
      }

      return 0;
    });

    data.forEach(function(el){ 
      str += `
      <div class="grid-cell mdc-elevation--z1 mdc-layout-grid__cell">
        <img src=${el.fields.thumbnail} >
        <a href='#/${el.id}'>
          <p class="mdc-typography--body1"> ${el.webTitle} </p>
        </a>
        <p class="date">${el.webPublicationDate.slice(0,10)}</p>
      </div>`;
    });

    const grid = document.createElement('div');
    grid.classList.add('mdc-layout-grid');
    grid.innerHTML = str;

    this.content.innerHTML = '';
    this.content.appendChild(grid);
  
    if(fromDb){
      console.log('from db');     
    }else{
      console.log('from network');
      return data; // return data to be added to database, since we wanna render as soon as they come in
    }
  }

  addToDb(items){

    dbPromise.then(function(db) {
      const tx = db.transaction('articles', 'readwrite');
      const store = tx.objectStore('articles');
      items.forEach(function(item){
        item.timeStamp = Date.now();
        store.put(item); // put vs add : use put --no errors
      });
      return tx.complete;
    }).then(function() {
      console.log('items added!'); //use a snackbar
    });
  }

  logError(error){
    console.log('Looks like there was a problem: \n', error);
  }

  checkTimeStamp() {}
}

export default List;