class AppDrawer extends HTMLElement {
  
  constructor() { 
  	super();
  	this.addEventListener('click', this.toggle);
    this.addEventListener('click', this.goBack);
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
    
    this.innerHTML = this.template;
  	this.nav = document.getElementById("mySidenav");
  	
    this.getSections('sections.json').then(arr => {
      arr.forEach(obj => {
        
        let link = document.createElement('A');
        
        link.href = `#/${obj.id}`;
        link.innerHTML = `${obj.webTitle}`;
        link.classList.add('mdc-list-item');
        
        link.addEventListener('click', () => {
          document.getElementById('nav-menu').MDCTemporaryDrawer.open = false;
        });       

        this.nav.append(link);
        this.sections[obj.id] = obj.webTitle;  
      });
    }).then(()=> this.updateTitle());
  }

  get template(){
    return `
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
    </aside>`;
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
}

window.customElements.define('app-drawer', AppDrawer);
