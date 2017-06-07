
'use strict';

import idb from '../libs/idb';

class Detail {

  constructor(view) {
    this.view = view;
  }
   
  getDetail(id){
    
    idb.open('article-store').then(function(db) {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      return store.get(id);
    }).then((item)=>{
      item ? console.log('from db') : null
      this.render(item);
    });
  }

  getId(hash){
    return (hash.replace(/[\/]/, "")).replace(/[#]/, "");
  }

  render(item){
    
    if(!item){
      console.log('getting from network');
      this.fetchDetail(this.getId(window.location.hash));
      return;
      //Testfor this case by deleting an item and refreshing the detail page.
    }

    this.view.renderDetail(item);
  }

  fetchDetail(id){

    // Rare Case: old bookmarked url
    // if no item, that means the old url and data misses from the database
    // use the id to fetch data online if (navigator.online) and render and save

    this.getJson(id)
    .then(res => res.json())
    .then(res => res.response.content)
    .then(content => this.render(content));
    // Could then store in db
  }

  getJson(section){
    const key = 'a0f2219a-e62d-4c78-b0ac-f4f8717d3580';
    const url = "https://content.guardianapis.com/";
    return fetch(`${url}${section}?&show-fields=all&api-key=${key}`);
  }
}

export default Detail;

// TODO : write tests! 