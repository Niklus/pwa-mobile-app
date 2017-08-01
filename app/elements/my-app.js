class MyAppElement extends HTMLElement {

  constructor() {
    
    super();
    
    this.loadedElements = {};
    this.createDb();

    // Event Listeners 
    window.addEventListener('online', () => this.showToast("ONLINE"));
    window.addEventListener('offline',() => this.showToast("OFFLINE"));
    window.addEventListener('hashchange',() => this.updateVisiblePage());  
  }

  connectedCallback() {
    
    this.updateVisiblePage();
    this.loadElement('app-drawer');  
    
    // Check for conection
    if (window.navigator.onLine) {
      this.showToast("ONLINE");
    } else {
      this.showToast("OFFLINE");
    }
  }

  /**
   * Display the appropriate view based on the Hash.
   */
  updateVisiblePage() {

    if (window.location.hash.slice(0,8) === "#/detail") {
      this.loadElement('detail-view');
      document.body.classList.add('detail-view-active');
      this.detailView = this.querySelector('detail-view');
      this.detailView.setAttribute('id', window.location.hash.slice(9));
      
    } else {
      this.loadElement('list-view');
      document.body.classList.remove('detail-view-active');
      if(this.detailView) this.detailView.innerHTML = "";
      this.listView = this.querySelector('list-view');
      this.listView.setAttribute('section', window.location.hash.slice(2) || 'world');
     
    }
  }

  /**
   * Loads an element definition if it has not been loaded yet.
   */
  loadElement(element) {
    if (this.loadedElements[element]) {
      return;
    }

    const script = document.createElement('script');
    script.src = `/elements/${element}.js`;
    document.head.appendChild(script);
    this.loadedElements[element] = script;
  }

  showToast(msg) {
    let el = this.querySelector("#snackbar")
    el.innerHTML = msg;
    el.className = "show";
    setTimeout(() => el.className = el.className.replace("show", ""), 3000);
  }

  createDb() {

    if (!('indexedDB' in window)) {
      alert('This browser doesn\'t support IndexedDB'); // Render something on the screen and tell them to use chrome !
      return;
    }
    
    // Use the switch for better versioning
    
    return idb.open('articles', 2, upgradeDb => {
      if (!upgradeDb.objectStoreNames.contains('articles')) {
        console.log('Creating articles object store');
        const store = upgradeDb.createObjectStore('articles', {keyPath: 'id'});
        console.log('Creating indexes');
        store.createIndex('section', 'sectionId', {unique: false});  
        store.createIndex('timeStamp', 'timeStamp', {unique: false});
      }
    });
  }
}

window.customElements.define('my-app', MyAppElement);
