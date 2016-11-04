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

    self.createAlbum = function(album) {
      console.log("THIS IS CREATE AL");
      // var user = JSON.parse(localStorage.getItem('user'));
      var token = JSON.stringify(localStorage.getItem('token')).replace(/"/g,"");
      console.log(token);
      $http({
        method: 'POST',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token')).replace(/"/g,"")}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}/albums`,
        data: {
          album:
            {
              user_id : JSON.parse(localStorage.getItem('user_id')),
              title: album.title,
              description: album.description
          }
        }
      })
      // $http.post(`${rootUrl}/users/${user.id}/albums`,
      //   {
      //     headers:
      //     {
      //
      //     }
      //   },
      //   {
      //     album:
      //       {
      //         title: album.title,
      //         description: album.description,
      //     }
      //   })
        .catch(function(err){
          console.error(err);
        })
        .then(function(response){
          console.log(response);
          $state.go('home', {url: '/user-home'});
        })
    }

    // Call methods on load
    this.getAlbums();

  }
})()
console.log("albumsController.js");
