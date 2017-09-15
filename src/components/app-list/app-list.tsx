import { Component, Prop, State,  Element} from '@stencil/core';
import { MDCSnackbar } from '@material/snackbar';

@Component({
  tag: 'app-list',
  styleUrl: 'app-list.scss'
})

export class AppList {

  @Prop() db;

  @State() list;

  @Element() element: HTMLElement;

  componentDidLoad(){
    
    // Get section from db
    this.getFromDb(window.location.hash.slice(1) || 'world');
    
    // Listen to hash events
    window.addEventListener('hashchange',() => { 
      this.getFromDb(window.location.hash.slice(1) || 'world');
    }); 

    this.toggleIcons();

    const updateBtn:any = document.querySelector('.update')
    updateBtn.addEventListener('click', () => this.updateArticles())
  }
  
  // Get data from database
  getFromDb(sectionId){

    this.db.transaction("r", this.db.articles, () => {
      this.db.articles.where('sectionId')
      .equalsIgnoreCase(sectionId)
      .toArray(items => { 

        // Get from network if no data in database
        if(items.length === 0 ){
          this.getFromNetwork(sectionId)
          console.log('getting from network')
        }else{
          this.list = this.sortByDate(items);
          console.log('from db')
        }
      });
    }).catch(function(err) {
      console.error(err.stack);
    });
  }
  
  // Get data from network
  getFromNetwork(sectionId){ 
    this.getJson(sectionId)
    .then(this.readAsJson)
    .then(res => res.response.results)
    .then(items => this.updateList(items))
    .then(items => this.addToDb(items))
    .then(() => this.updateTime(sectionId))
    .catch(this.logError);
  }
  
  // Set list state 
  updateList(items){
    this.list = this.sortByDate(items);
    return items;
  }
  
  // Sort list by web publication date
  sortByDate(arr){
    return arr.sort((a, b) => {
      let dateA = a.webPublicationDate;
      let dateB = b.webPublicationDate;
      if(dateA > dateB) {
        return -1;
      }else if(dateA < dateB){
        return 1;
      }
      return 0;
    });
  }
  
  // Add items to database
  addToDb(items){
    this.db.transaction("rw", this.db.articles, () => {
      items.forEach( item => {
        item.timeStamp = Date.now();
        this.db.articles.put(item);
      });
    }).then(() => {
      this.showToast('Articles Downloaded');
    }).catch(function(err) {
      console.error(err.stack);
    });
  }
  
  // Update download time
  updateTime(sectionId: string){
    
    let dataObj;

    if(!window.localStorage.downloadTimes){
      dataObj = {};
    }else{
      dataObj = JSON.parse(window.localStorage.downloadTimes);
    }

    dataObj[sectionId] = Date.now();
    window.localStorage.downloadTimes = JSON.stringify(dataObj);
  }

  // Allow article update after an hour if User is online
  updateArticles(){
    
    // User must be online in order to make updates
    if(window.navigator.onLine){ 

      let sectionId = window.location.hash.slice(1) || 'world';

      // Get download times if it exists
      if(window.localStorage.downloadTimes){ 
        
        let obj = JSON.parse(window.localStorage.downloadTimes);
        let downloadTime = obj[sectionId];

        // if no time saved in local storage, update articles
        if(!downloadTime){
          this.getFromNetwork(sectionId)
        // if the time lapse since the last update is over an hr then update articles
        }else if((Date.now() - downloadTime) > 3600000)  {
          this.getFromNetwork(sectionId)
        }else{
          this.showToast('Articles Up To Date');
        }
      }else{
        this.getFromNetwork(sectionId)
      }   
    }else{
      this.showToast('OFFLINE');
    }
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

  logError(error){
    console.log('Looks like there was a problem: \n', error);
  }

  showToast(msg){
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    
    const dataObj = {
      message: msg
    };

    snackbar.show(dataObj);
  }

  toggleIcons(){
    // Toggle Icons
    let menuIcon:any = document.querySelector(".menu");
    let backIcon:any = document.querySelector(".back");
    let simpleMenuIcon:any = document.querySelector(".simpleMenu");
    menuIcon.style.display = '';
    backIcon.style.display = 'none';
    simpleMenuIcon.style.display = '';
  }

  render() {

    let listItems;
    
    if(this.list){  
      listItems = this.list.map( item => {
        const styles = { backgroundImage: `url(${ item.fields.thumbnail })` };
        return(
          <div class="mdc-layout-grid__cell">
            <stencil-route-link router="#router" url={`/detail#${item.id}`}>
              <div class="mdc-card">
                <section class="mdc-card__media card__16-9-media" style={styles}></section>
                <section class="mdc-card__primary">
                  <h1 class="mdc-card__title mdc-card__title--medium">{item.webTitle}</h1>
                  <h2 class="mdc-card__subtitle">{item.webPublicationDate.slice(0,10)}</h2>
                </section>   
              </div>  
            </stencil-route-link>
          </div>
        )
      })
    }
    return (
      <div id="app-list">
        <div class="grid mdc-layout-grid">
          <div class="mdc-layout-grid__inner">
            {listItems}
          </div>
        </div>
        <snack-bar></snack-bar>
      </div>
    );
  }
}