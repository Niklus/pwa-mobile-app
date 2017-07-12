/*Perform complex queries here*/

/*consider word count */

var endpoint = 'https://content.guardianapis.com/';
var key = '&api-key=a0f2219a-e62d-4c78-b0ac-f4f8717d3580';

export default {
  
  getSection(section) {
    
    var url = endpoint+section+"?&show-fields=all"+key;

    return fetch(url)
    .then( res => {
      var results = res.response.results;
      return results
    });
  }
};