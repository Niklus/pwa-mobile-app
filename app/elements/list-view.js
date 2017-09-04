const dbPromise = idb.open('articles');

class ListViewElement extends HTMLElement {

  static get observedAttributes() {
    return ['section'];
  }

  connectedCallback(){
    this.classList.add(...ListViewElement.CLASSES);
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    
    if (attr !== 'section' || !newValue) {
      return;
    }else if(this.section === newValue){
      return; //prevent unnecessary db reads when coming back from detail-view
    }

    this.getFromDb(newValue);
    this.section = newValue;
  }

  getFromDb(section){

    const range = IDBKeyRange.only(section);

    dbPromise.then( db => {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      const index = store.index('section');
      return index.getAll(range);
    }).then((items) => {   
      items.length === 0 ? this.getFromNetwork(section) : this.renderItems(items, true);
    });
  }

  getFromNetwork(section){    
    this.getJson(section)
    .then(this.readAsJson)
    .then(res => res.response.results)
    .then(items => this.renderItems(items))
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

  renderItems(items, fromDb){  

    window.scroll(0, 0);
    
    // Order from the latest
    items = items.sort((a, b) => {
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

    this.innerHTML = items.reduce((a, item) => a + `
    <div class="card mdc-layout-grid__cell">
      <a href="#/detail/${item.id}">
        <div class="mdc-card">
          <section class="mdc-card__media card__16-9-media" style="background-image:url('${item.fields.thumbnail || '/images/place-holder.jpg' }')"></section>
          <section class="mdc-card__primary">
            <h1 class="mdc-card__title mdc-card__title--medium">${item.webTitle}</h1>
            <h2 class="mdc-card__subtitle">${item.webPublicationDate.slice(0,10)}</h2>
          </section>   
        </div>
      </a>
    </div>`, '');

    if(fromDb){
      console.log('from db');     
    }else{
      console.log('from network');
      return items; // return data to be added to database, since we wanna render as soon as they come in
    }
  }

  addToDb(items){

    dbPromise.then( db => {
      const tx = db.transaction('articles', 'readwrite');
      const store = tx.objectStore('articles');
      items.forEach( item => {
        item.timeStamp = Date.now();
        store.put(item);
      });
      return tx.complete;
    }).then(() => {
      console.log('articles downloaded'); 
      this.showToast('Articles Downloaded');
      this.updateTime();
    });
  }

  updateTime(){
    localStorage[this.section] = Date.now();
  }
  
  // Allow article update after an hour if User is online
  updateArticles(){
    if( window.navigator.onLine){
      if(!localStorage[this.section]){
        this.getFromNetwork(this.section)
        this.showToast('Updating Articles')
      }else if((Date.now() - localStorage[this.section]) > 3600000)  {
        this.getFromNetwork(this.section)
        this.showToast('Updating Articles');
      }else{
        this.showToast('Articles Up To Date');
      }
    }else{
      this.showToast('OFFLINE');
    }
    
  }

  showToast(msg) {
    let el = document.getElementById("snackbar");
    el.innerHTML = msg;
    el.className = "show";
    setTimeout(() => el.className = el.className.replace("show", ""), 2000);
  }

  logError(error){
    console.log('Looks like there was a problem: \n', error);
  }

  showNetworkError() {
    // if response.status === 404: already handled in the service worker
    // if you use workbox then handle it here
    this.innerHTML = `
      <p class="error">No network connection</p>`;
  }
}

// TOOP LEVEL STYLE CLASSES
ListViewElement.CLASSES = ['mdc-layout-grid', 'mdc-toolbar-fixed-adjust'];

window.customElements.define('list-view', ListViewElement);
