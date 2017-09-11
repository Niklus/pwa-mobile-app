import { Component, Prop, Element, State} from '@stencil/core';
import DOMPurify from 'dompurify';

@Component({
  tag: 'app-detail',
  styleUrl: 'app-detail.scss'
})
export class AppDetail {
  
  @Prop() db;

  @Element() element: HTMLElement;

  @State() article;
  
  componentDidLoad(){
    this.getById(window.location.hash.slice(1));
    this.toggleIcons();
    window.scrollTo(0, 0);
  }
  
  // Update dom with sanitized html
  componentDidUpdate() {
    const articleBody:any = this.element.querySelector('.article_body');
    articleBody.innerHTML = this.sanitize(this.article.fields.body);
    this.showControls();
  }
  
  // Get Item by id form database
  getById(id){
    this.db.transaction("r", this.db.articles, () => {
      this.db.articles.get(id).then (item => this.article = item)
    }).catch(function(err) {
      console.error(err.stack);
    });
  }
  
  // Sanitize to enable proper styling 
  sanitize(htmlStr) {
    return DOMPurify.sanitize(htmlStr, {
      FORBID_TAGS: ['figure','figcaption']
    });
  }
   
  // For some reason the video controls disapear after sanitization
  showControls()  {
    const videos:any = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach( video => {
        video.controls = true;
      });
    }
  }

  toggleIcons(){
    // Toggle Icons
    let menuIcon:any = document.querySelector(".menu");
    let backIcon:any = document.querySelector(".back");
    let simpleMenuIcon:any = document.querySelector(".simpleMenu");
    menuIcon.style.display = 'none';
    backIcon.style.display = '';
    simpleMenuIcon.style.display = 'none';
  }

  render() {
    if(this.article){
      return (
        <div id="app-detail">
          <section class="typography--section mdc-typography">
            <div class='image'>
              <img src={this.article.fields.thumbnail} alt="article image"/>
              <h2 class="mdc-typography--headline mdc-typography--adjust-margin">{this.article.webTitle}</h2>
            </div>
            <div class="article_body mdc-typography--body1 mdc-typography--adjust-margin"></div>
          </section>
        </div>
      )
    }else{
      return (null);
    }
  }
}