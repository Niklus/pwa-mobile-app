import { Component, Element, Prop} from '@stencil/core';
import { MDCTemporaryDrawer } from '@material/drawer';
import { MDCSimpleMenu } from '@material/menu';
import sections from './sections'

@Component({
  tag: 'app-nav',
  styleUrl:'app-nav.scss' 
})

export class AppNav {

  @Element() element: HTMLElement;

  list:Array<object> = sections;

  appDrawer: {open: boolean};
 
  @Prop() section: string;

  componentDidLoad(){
    
    // // Update title with sectionId after loading
    this.updateTitle();

    // Initialise Temporary Drawer
    const tempDrawer = this.element.querySelector('.mdc-temporary-drawer');
    this.appDrawer = new MDCTemporaryDrawer(tempDrawer); 
    
    let simpleMenu = new MDCSimpleMenu(this.element.querySelector('.mdc-simple-menu'));
    this.element.querySelector('.simpleMenu')
    .addEventListener('click', () => simpleMenu.open = !simpleMenu.open);

    window.addEventListener('hashchange',() => this.updateTitle()); 
  }

  toggleDrawer(bool){
    this.appDrawer.open = bool;
  }

  // Update title with sectionId
  updateTitle(){
     
    let sectionId;
    
    if(window.location.pathname !== '/detail'){
      sectionId = window.location.hash.slice(1) || 'world';
    }else{
      // refreshing while in detail view
      let str = window.location.hash.slice(1);
      let n = str.indexOf('/');
      sectionId = str.substring(0, n != -1 ? n : str.length);
    }

    let obj:any = this.list.find(el => el['id'] === sectionId)
    this.element.querySelector('.title').innerHTML = obj.webTitle.toUpperCase();
  }

  render() {

    let listItems = this.list.map((item: any) => {
      return (
        <div>
          <a  
            class="mdc-list-item"
            href={`#${item.id}`} 
            onClick={() => this.toggleDrawer(false)}>
            {item.webTitle}
          </a>
          <hr class="mdc-list-divider"/>
        </div>
      );
    });
   
    return (
      <div id="app-nav">
        <header class="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
          <div class="mdc-toolbar__row">
            <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
              
              <span class="menu mdc-toolbar__icon mdc-toolbar__icon--menu" onClick={() => this.toggleDrawer(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff"  width="24" height="24" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
              </span>
              
              <span class="back mdc-toolbar__icon mdc-toolbar__icon--menu" onClick={()=>window.history.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              </span>
              
              <span class="title mdc-toolbar__title"></span>
            </section>
            <section class="mdc-toolbar__section mdc-toolbar__section--align-end" role="toolbar">
              <div class="mdc-menu-anchor">
                <span class="mdc-toolbar__icon mdc-toolbar__icon--menu simpleMenu" aria-label="Simple menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </span>
                <div class="mdc-simple-menu">
                  <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
                    <li class="mdc-list-item update" role="menuitem">Update</li>
                    <li class="mdc-list-item" role="menuitem" >Delete</li>
                    <li class="mdc-list-item" role="menuitem" >Reload</li>
                    <li class="mdc-list-divider" role="separator"></li>
                    <li class="mdc-list-item" role="menuitem">Share...</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </header>
        <aside class="mdc-temporary-drawer">
          <nav class="mdc-temporary-drawer__drawer">
            
            <header class="mdc-temporary-drawer__header">
              <div class="mdc-temporary-drawer__header-content mdc-theme--primary-bg mdc-theme--text-primary-on-primary">
                NEWS
              </div>
            </header>

            <nav class="mdc-temporary-drawer__content mdc-list-group">
              <div class="mdc-list">
                {listItems}
              </div>
            </nav>
          </nav>
        </aside>
      </div>
    );
  }
}











