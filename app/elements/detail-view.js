class DetailViewElement extends HTMLElement {

  static get observedAttributes() {
    return ['id'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr !== 'id' || !newValue) {
      return;
    }
    this.getDetail(newValue);
    this.addEventListener('click', this.closeDetailPage);
  }

  getDetail(id){
    idb.open('articles').then( db => {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      return store.get(id);
    }).then( item => {
      item ? console.log('from db') : null
      this.renderItem(item);
    });
  }

  renderItem(item) {

    this.scrollTop = 0;

    this.innerHTML = `
      <img src="${item.fields.thumbnail || '/images/place-holder.jpg'}" alt="article image">
      <div class="close-btn">&times;</div>
      <div>
        <h1>${item.webTitle}</h1>
        ${this.sanitize(item.fields.body)}
      </div>`;

    this.ShowControls();
  }

  sanitize(html) {
    return DOMPurify.sanitize(html, {
      FORBID_TAGS: ['figure','figcaption']
    });
  }

  ShowControls()  {
    const videos = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach( video => {
        video.controls = true;
      });
    }
  }

  showNetworkError() {
    this.innerHTML = `
    <a href="/" class="close-btn">&times;</a>
    <p class="error">No network connection</p>`;
  }

  closeDetailPage(event) {
    
    let element = event.target;
  
    if (element.className === 'close-btn') {
      window.history.back();
      this.innerHTML = '';
    }
  }
}

window.customElements.define('detail-view', DetailViewElement);
