(function(){
  angular.module('nitpic')
    .controller('albumsController', albumsController);

  albumsController.$inject = ['$scope', '$http', 'Upload', '$timeout'];

  function albumsController($scope, $http, Upload, $timeout){
    var url = 'http://localhost:3000';

    //need an initial http to get all the photos for an album

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
    };
  }
})()
