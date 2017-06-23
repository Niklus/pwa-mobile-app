class AppDrawer extends HTMLElement {
  
  constructor() { 
  	super();
  	this.addEventListener('click', this.toggle);
  	this.main = document.getElementById("main");
  	this.sections = ['world', 'culture', 'politics', 'technology', 'business', 'music', 'fashion', 'sport', 'society', 'media', 'travel'];//e.t.c
  	window.addEventListener('hashchange', this.updateSection.bind(this));
  }
  
  connectedCallback() {
  	this.render();
  }

  render(){
  	this.innerHTML = `
  		<header>
      		<span class="openbtn">&#9776;</span>
      		<span id="section"></span>
          <span id="update"></span>
    	</header>
	  	<div id="mySidenav" class="sidenav">
			<a class="closebtn">&times;</a>
		</div>
  	`;

  	this.nav = document.getElementById("mySidenav");

  	this.sections.forEach(section => {
  		var link = document.createElement('A');
  		link.href = `#/${section}`;
  		link.innerHTML = `${section}`;
  		this.nav.append(link);
  	});

  	this.updateSection();
  }

  updateSection(){

  	if(this.section === (window.location.hash.slice(2) || 'world').toUpperCase()){
  		return;
  	}
  	else if(window.location.hash.slice(0,8) !== "#/detail"){
  		this.section = (window.location.hash.slice(2) || 'world').toUpperCase();
	  	this.querySelector("#section").innerHTML = this.section;
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
