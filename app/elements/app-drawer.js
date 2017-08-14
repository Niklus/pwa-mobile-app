class AppDrawer extends HTMLElement {
  
  constructor() {
   
    super();

    window.addEventListener('hashchange', () => {
        this.toggleDisplay();
    });
  
    this.sections = {};
  } 

  static get observedAttributes() {
    return ['section'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    
    if (attr !== 'section' || !newValue) {
      return;
    }else if(this.section === newValue){
      return;
    }
    
    this.section = newValue;
    
    this.updateSection();
  }

  connectedCallback() {

    this.innerHTML = this.template;
    
    mdc.autoInit();
    
    this.navMenu = this.querySelector('#nav-menu');
    
    this.navBtn = this.querySelector('#nav-icon')
    this.navBtn.addEventListener('click', evt => {
      evt.preventDefault();
      this.navMenu.MDCTemporaryDrawer.open = true;
    });
    
    this.updateBtn = this.querySelector('#update');
    this.updateBtn.addEventListener('click', evt => {
      this.updateArticles();
    });
    
    this.backBtn = this.querySelector('#back-icon');
    this.backBtn.addEventListener('click', () => {
        window.history.back();
    });

    this.renderNavList();
    this.toggleDisplay();
  }

  getSections(json){
    return fetch(`api/${json}`)
    .then(res => res.json())
    .then(res => res.response.results)
  }

  renderNavList(){
    
    this.nav = this.querySelector("#mySidenav");
    this.getSections('sections.json').then(arr => {
      arr.forEach( obj => {
        const link = document.createElement('A');
        link.href = `#/${obj.id}`;
        link.innerHTML = `${obj.webTitle}`;
        link.classList.add('mdc-list-item');
        link.addEventListener('click', () => {
          //this.navMenu.MDCTemporaryDrawer.open = false;
        });       
        this.nav.append(link);
        this.sections[obj.id] = obj.webTitle;  
      });
    }).then(() => this.updateSection());
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
             <i id="back-icon" class="back-icon material-icons mdc-ripple-surface"
             aria-label="go back"
             aria-controls="back-btn"
             data-mdc-auto-init="MDCRipple"
             data-mdc-ripple-is-unbounded>arrow_back</i>
          <span id="title" class="mdc-toolbar__section mdc-toolbar__title"></span>
            <i id="update" class="material-icons mdc-ripple-surface"
             aria-label="update"
             aria-controls="update-btn"
             data-mdc-auto-init="MDCRipple"
             data-mdc-ripple-is-unbounded>update</i>
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

  updateSection(){
    const title = this.sections[this.section];
    if(title) {
        this.querySelector("#title").innerHTML = title.toUpperCase();
    }
  }

  toggleDisplay(){
    if (window.location.hash.slice(0,8) === "#/detail") {
      this.backBtn.style = 'dispaly:revert';
      this.navBtn.style = 'display:none';
      this.updateBtn.style = 'display:none';
    } else {
      this.backBtn.style = 'display:none';
      this.navBtn.style = 'display:revert';
      this.updateBtn.style = 'display:revert';
    }
  }

  updateArticles(){
   const listView = this.parentElement.querySelector('list-view');
   listView.updateArticles();
  }
}

window.customElements.define('app-drawer', AppDrawer);
