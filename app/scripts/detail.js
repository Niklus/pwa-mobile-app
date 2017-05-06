(function() {
  
  'use strict';

  idb.open('articles-db').then(function(db) {
    var tx = db.transaction('articles', 'readonly');
    var store = tx.objectStore('articles');
    return store.get(getId('id', window.location.href));
  }).then(render);
 
  
  function render(item){
    document.getElementById('sectionTitle').innerHTML = item.sectionId.toUpperCase();
    document.getElementById('articleTitle').innerHTML = item.webTitle;
    document.getElementById('articleImage').src = item.fields.thumbnail;
    sanitize(item.fields.body).then(function(body){
      document.getElementById("articleBody").innerHTML = body;
    }).then(ShowControls); // A hack: sanitizer not preserving video controll attributes
  }
  
  // Extract id from querystring
  function getId (id, url) {
    var reg = new RegExp( '[?&]' + id + '=([^&#]*)', 'i' );
    return reg.exec(url)[1];
  }
  
  // Remove unwanted tags from html body, enabling proper styling
  function sanitize(html){
    return new Promise(function(resolve){
      resolve(
         DOMPurify.sanitize(html, {
          FORBID_TAGS: ['figure','figcaption']
        })
      );
    })
  }

  // Show Controls
  function ShowControls(){
    var videos = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach(function(video){
        video.controls = true;
      })
    }
  }
})();