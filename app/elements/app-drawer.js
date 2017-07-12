class AppDrawer extends HTMLElement {
  
  constructor() { 
  	super();
  	this.addEventListener('click', this.toggle);
  	this.main = document.getElementById("main");
  	window.addEventListener('hashchange', this.updateTitle.bind(this));
    this.sections = {};
  }
  
  connectedCallback() {
  	this.render();
  }

  getSections(json){
    return  fetch(`api/${json}`)
    .then(res => res.json())
    .then(res => res.response.results)
  }

  render(){
  	this.innerHTML = `
  		<header>
      		<span class="openbtn">&#9776;</span>
      		<span id="title"></span>
          <span id="update"></span>
    	</header>
	  	<div id="mySidenav" class="sidenav">
			<a class="closebtn">&times;</a>
		</div>
  	`;

  	this.nav = document.getElementById("mySidenav");

  	this.getSections('sections.json').then(arr => {
      arr.forEach(obj => {
        var link = document.createElement('A');
        link.href = `#/${obj.id}`;
        link.innerHTML = `${obj.webTitle}`;
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

  toggle(event){
  	let element = event.target;
    if (element.className === 'closebtn' || element.tagName === 'A') { 
      this.close();
    }else if(element.className === 'openbtn'){
      this.open();
    }
  }
  
  open(){
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
  }

  addSection(){
  	//fetch Json: and append
  }
}

window.customElements.define('app-drawer', AppDrawer);
