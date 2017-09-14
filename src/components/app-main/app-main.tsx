import { Component, Element} from '@stencil/core';
import { MDCSnackbar } from '@material/snackbar';
import Dexie from 'dexie';

@Component({
  tag: 'app-main',
  styleUrl: 'app-main.scss'
})
export class AppMain {

  @Element() element: HTMLElement;

  dexieDb;

  constructor(){
    // Initialize database
    this.dexieDb = new Dexie('news-database');
    this.dexieDb.version(1).stores({ articles: 'id, sectionId, timeStamp' });
  }

  componentDidLoad(){
    
    const snackBar = new MDCSnackbar(this.element.querySelector('.mdc-snackbar'));
   
    // Show Network Status
    let networkMsg = window.navigator.onLine ? 'ONLINE' : 'OFFLINE';
    snackBar.show({ message: networkMsg });
    
    // Event Listeners 
    window.addEventListener('online', () => snackBar.show({ message: 'ONLINE' }));
    window.addEventListener('offline',() => snackBar.show({ message: 'OFFLINE'}));
  }


  render() {
    console.log('render main')
    return (
      <div id="app-main">
      
        { /* App Navigation*/ }
        <app-nav></app-nav>

        <div class="mdc-toolbar-fixed-adjust"> 
          { /* App Router*/ }
          <stencil-router id="router">
            
            <stencil-route
              url="/"
              component="app-list"
              router="#router"
              componentProps={{
                db: this.dexieDb
              }}
              exact={true}
            />
            <stencil-route
              url="/detail"
              component="app-detail"
              router="#router"
              componentProps={{
                db: this.dexieDb
              }}
            />
          </stencil-router>
          
          { /* App Snackbar:*/ }
          <snack-bar></snack-bar>
        </div>
      </div>
    );
  }
}