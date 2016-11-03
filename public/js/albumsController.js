(function(){
  angular.module('nitpic')
    .controller('albumsController', albumsController);

  function albumsController($http, $state, $stateParams){
    var rootUrl = "http://localhost:3000";
    var self = this;

    self.getAlbums = function(){
      $http.get(`${rootUrl}/albums`)
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.albums = response.data.albums
      })
    }

    // Call methods on load
    this.getAlbums();

  }
})()
console.log("albumsController.js");
