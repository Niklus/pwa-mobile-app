class AppDrawer extends HTMLElement {
  
  constructor() { 
  	super();
  	this.addEventListener('click', this.toggle);
    this.addEventListener('click', this.goBack);
  	this.main = document.getElementById("main");
  	window.addEventListener('hashchange', this.updateTitle.bind(this));
    this.sections = {};
  }
  
  connectedCallback() {
  	this.render();
    mdc.autoInit()
    document.getElementById('nav-icon').addEventListener('click', function(evt) {
      evt.preventDefault();
      document.getElementById('nav-menu').MDCTemporaryDrawer.open = true;
    });
  }

  getSections(json){
    return  fetch(`api/${json}`)
    .then(res => res.json())
    .then(res => res.response.results)
  }

  render(){
  	
    this.innerHTML = `
      
      <header class="mdc-toolbar mdc-toolbar--fixed mdc-theme--text-primary-on-background">
        <div class="mdc-toolbar__row" >
          <section class="mdc-toolbar__section">
              <i id="nav-icon" class="material-icons mdc-ripple-surface"
               aria-label="Click to show the navigation menu"
               aria-controls="nav-menu"
               data-mdc-auto-init="MDCRipple"
               data-mdc-ripple-is-unbounded>menu</i>
            <span id="title" class="mdc-toolbar__section mdc-toolbar__title"></span>
              <i id="back-icon" class="back-icon material-icons mdc-ripple-surface"
               aria-label="go back"
               aria-controls="back-btn"
               data-mdc-auto-init="MDCRipple"
               data-mdc-ripple-is-unbounded>arrow_back</i>
          </section>
        </div>
      </header>

      <aside id="nav-menu" class="mdc-temporary-drawer" data-mdc-auto-init="MDCTemporaryDrawer">
        <nav class="mdc-temporary-drawer__drawer">
          <header class="mdc-temporary-drawer__header">
            <div class="mdc-temporary-drawer__header-content mdc-theme--primary-bg mdc-theme--text-primary-on-primary">
              NEWS
            </div>
          </header>
          <nav id="mySidenav" class="mdc-temporary-drawer__content mdc-list">
          </nav>
        </nav>
      </aside>

  	`;

  	this.nav = document.getElementById("mySidenav");

  	this.getSections('sections.json').then(arr => {
      arr.forEach(obj => {
        var link = document.createElement('A');
        link.href = `#/${obj.id}`;
        link.innerHTML = `${obj.webTitle}`;
        link.classList.add('mdc-list-item');
        this.nav.append(link);
        this.sections[obj.id] = obj.webTitle;  
      });
    }).then(()=> this.updateTitle());
  }

  updateTitle(){

  	if(this.sectionId === (window.location.hash.slice(2) || 'world')){
  		return;
  	}else if(window.location.hash.slice(0,8) !== "#/detail"){
  		this.sectionId = (window.location.hash.slice(2) || 'world');
      this.querySelector("#title").innerHTML = this.sections[this.sectionId].toUpperCase();
    }
  }

  goBack(event) {
    
    let element = event.target;
  
    if (element.id === 'back-icon') {
      window.history.back();
    }
  }

  /*toggle(event){
  	let element = event.target;
    if (element.className === 'closebtn' || element.tagName === 'A') { 
      this.close();
    }else if(element.className === 'openbtn'){
      this.open();
    }
  }*/
  
  /*open(){
  	this.nav.style.visibility = 'visible';
  	this.nav.style.width = "250px";
  	this.main.style.pointerEvents = 'none';
  	this.main.style.opacity = 0.5;

  }

  close(){
  	this.nav.style.width = "0";
  	this.nav.style.visibility = 'hidden';
  	this.main.style.pointerEvents = 'auto'; 
  	this.main.style.opacity = 1;
  }*/

  addSection(){
  	//fetch Json: and append
  }
}

window.customElements.define('app-drawer', AppDrawer);
