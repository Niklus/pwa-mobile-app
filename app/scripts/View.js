
'use strict';

import DOMpurify from '../libs/purify.min.js';

class View {
  constructor(app) {

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
    
    
    //Import all sections in array anf fill html

    //Event listeners
    this.arrow.addEventListener('click',() => window.history.back());
    this.update.addEventListener('click',() => app.updateSection());
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
  }

  renderList(data){
    window.scroll(0, this.scrollPos);
    this.arrow.style = "display:none";
    this.update.style = "display:revert";
    //this.sectionTitle.innerHTML = `${data[0].sectionId.toUpperCase()} NEWS`;
    this.content.innerHTML = ''
    
    let str = '';
    
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
  }

  renderDetail(item){

    this.scrollPos = window.scrollY;
    window.scroll(0, 0);
    this.arrow.style = "display:revert";
    this.update.style = "display:none";
    this.content.innerHTML = ''

    this.sanitize(item.fields.body)
      .then((body) => {
        this.content.innerHTML = `
        <section class="article demo-typography--section mdc-typography">
          <img src=${item.fields.thumbnail}>
          <h1 class="mdc-typography--headline"">${item.webTitle}</h1>
          <div class="mdc-typography--body1 mdc-typography--adjust-margin" >${body}</div>
        </section>`;
    }).then(this.ShowControls); // A hack: sanitizer not preserving video controll attributes
  }

  sanitize(html) {
    return new Promise(function(resolve){
      resolve(
         DOMpurify.sanitize(html, {
          FORBID_TAGS: ['figure','figcaption']
        })
      );
    });
  }

  ShowControls()  {
    const videos = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach(function(video){
        video.controls = true;
      });
    }
  }
}

export default View;