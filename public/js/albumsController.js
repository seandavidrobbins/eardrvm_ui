(function(){
  angular.module('nitpic')
    .controller('albumsController', albumsController);


  albumsController.$inject = ['$scope', '$http', 'Upload', '$timeout'];

  function albumsController($scope, $http, Upload, $timeout, $state, $stateParams){
    var url = 'http://localhost:3000';

    self.getAlbums = function(){
      $http.get(`${rootUrl}/albums`)
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.albums = response.data.albums
      })
    }

    $scope.uploadPhoto = function(image){
      console.log("Uploading...");
      image.upload = Upload.upload({
        url: url + '/photos',
        data: {photo: {title: $scope.title, image: image}}
      })
      .then(function(response){
          console.log(response);
      })
      .catch(function(err){
        console.log(err);
      });
    }

    // Call methods on load
    this.getAlbums();
  }
})()
