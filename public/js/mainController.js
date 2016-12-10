
(function(){
  angular.module('sound_overflow')
     .controller('mainController', mainController);


  mainController.$inject = ['$scope', '$http', 'Upload', '$timeout', '$state', '$stateParams'];

  function mainController($scope, $http, Upload, $timeout, $state, $stateParams){
    var rootUrl = 'https://sound-overflow-api.herokuapp.com';
    // var rootUrl = 'http://localhost:4000';
    var self = this;
    self.thisAlbum = $stateParams.album


  // ======================================================== //
                  // USERS CONTROLLER //
  // ======================================================== //

  self.currentUserCheck = function(userId) {
    if (localStorage.user_id == userId.toString()) {
      self.isUser = true;
    }
    else {
      self.isUser = false;
    }
  }
  // Get all users from backend
  self.getUsers = function(){
    $http.get(`${rootUrl}/users`)
    .catch(function(err){
      console.error(err);
    })
    .then(function(response){
      self.allUsers = response.data.users;
    });
  }
  // ======================================================== //
                        // LOGIN //
  // ======================================================== //
  self.login = function(userPass){
    $http.post(`${rootUrl}/users/login`, {user: {username: userPass.username, password: userPass.password}})
    .then(function(response){
      self.user = response.data.user
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('token', response.data.token);
      self.getUserAlbums(self.user.id);
      $state.go('home', {url: '/user-home', user: response.data.user});
    })
    .catch(function(err){
      console.error(err);
    })
  }
  // ======================================================== //
                    // SIGNUP //
  // ======================================================== //
  self.signup = function(userPass){
    $http.post(`${rootUrl}/users`, {user: {username: userPass.username, password: userPass.password }})
    .then(function(response) {
      self.user = response.data.user
      localStorage.setItem('user_id', JSON.stringify(response.data.user.id));
      localStorage.setItem('token', JSON.stringify(response.data.token));
      self.getUserAlbums(self.user.id);
      $state.go('home', {url: '/user-home', user: response.data.user});
    })
    .catch(function(err) {
      console.error(err);
    });
  }
  // ======================================================== //
                    // LOGOUT //
  // ======================================================== //
  self.logout = function() {
    self.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    $state.go('welcome', {url: '/'});
  }

//  ======================================================== //
                    // ALBUMS CONTROLLER //
//  ======================================================== //

    self.getAllAlbums = function(){
      $http.get(`${rootUrl}/albums`)
      .then(function(response){
        self.allAlbums = response.data.albums
        console.log(self.allAlbums);
        $state.go('playlist');
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.getUserAlbums = function(userId){
      self.currentUserCheck(userId);
      $http({
        method: 'GET',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${userId}`
      })
      .then(function(response){
        self.userAlbums = response.data.albums
        $state.go('home');
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.createAlbum = function(album) {
      var token = JSON.stringify(localStorage.getItem('token')).replace(/"/g,"");
      $http({
        method: 'POST',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
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
      .then(function(response){
        // debugger;
        // self.thisAlbum = response.data.album;
        // $state.go('album-show', {album: album});
        self.showAlbum(response.data.album);
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.updateAlbum = function(album, albumId) {
      $http({
        method: 'PATCH',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}/albums/${albumId}`,
        data: {
          album:
            {
              title: album.title,
              description: album.description
            }
        }
      })
      .then(function(response){
        self.showAlbum(response.data.album);
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.showAlbum = function(album) {
      self.currentUserCheck(album.user_id);
      $http.get(`${rootUrl}/albums/${album.id}`)
      .then(function(response){
        self.getAlbumOwner(album.user_id);
        self.thisAlbum = response.data.album;
        self.getAlbumSongs(self.thisAlbum.id);
      })
      .then(function(response){
        $state.go('album-show');
      })
      .catch(function(err){
        console.error(err);
      })
    }
    // Gets owner (user) of selected album
    self.getAlbumOwner = function(userId) {
      $http({
        method: 'GET',
        headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${userId}`,
      })
      .then(function(response){
        self.thisAlbumOwner = response.data.user;
      })
      .catch(function(err){
        console.error(err);
      })
    }

    self.deleteAlbum = function(album){
      $http({
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/users/${localStorage.getItem('user_id')}/albums/${album.id}`
      })
      .then(function(response){
        console.log(response);
        self.getUserAlbums(self.user.id);
        $state.go('home');
      });
    }

    self.getAlbumSongs = function(albumId) {
      $http({
        method: 'GET',
        headers:   {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
        url: `${rootUrl}/albums/${albumId}/songs`
      })
      .then(function(response){
        console.log(response);
        self.thisAlbum.songs = response.data.song;
        // console.log("song:");
        console.log(self.thisAlbum.songs);
        $state.go('album-show');
      })
      .catch(function(err){
        console.error(err);
      })
    }

  // ======================================================== //
                  // SONGS CONTROLLER //
  // ======================================================== //

  self.showSong = function(index){
    self.thisSong = self.thisAlbum.songs[index];
    self.getSongComments(self.thisSong.id);
      //link to the large 600x60 audio src url
      //add mainCtrl.audioSource to the ng-src
      // all other song data like title found mainCtrl.song
    $state.go('song-show');
  }
  self.getSongComments = function(songId){
    $http({
      method: 'GET',
      url: `${rootUrl}/songs/${songId}/comments`
    })
    .then(function(response){
      console.log("getSongComments");
      console.log(response);
      self.thisSong.comments = response.data.comments;
    })
    .catch(function(err){
      console.error(err);
    })
  }
  self.uploadSong = function(audio, albumId){
    console.log(albumId);
    console.log(audio);
    audio.upload = Upload.upload({
      url: `${rootUrl}/albums/${albumId}/songs`,
      data: {song: {title: $scope.title, audio: audio}}
    })
    .then(function(response){
        console.log(response);
        self.getAlbumSongs(albumId);
        $state.go('album-show');
    })
    .catch(function(err){
      console.log(err);
    });
  }
  self.deleteSong = function(song){
    $http({
      method: 'DELETE',
      headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
      url: `${rootUrl}/songs/${song.id}`
    })
    .then(function(response){
      console.log(response);
      self.showAlbum(self.thisAlbum);
      $state.go('album-show');
    })
    .catch(function(err){
      console.log(error);
    })
  }

  // ======================================================== //
                  // COMMENTS CONTROLLER //
  // ======================================================== //


  self.createComment = function(newComment, songId) {
    $http({
      method: 'POST',
      headers: {'Authorization': `Bearer ${JSON.stringify(localStorage.getItem('token'))}`},
      url: `${rootUrl}/songs/${songId}/comments`,
      data: {
        comment: newComment
      }
    })
    .then(function(response){
    self.thisSong.comments = response.data.comments;
    })
    .catch(function(err){
      console.error(err);
    })
    newComment = "";
  }

  self.deleteComment = function(commentId){
    $http({
      method: 'DELETE',
      url: `${rootUrl}/songs/${song_id}/comments/${commentId}`
    })
    .then(function(response){
      console.log(response);
      self.songComments = response.data.comments;
    });
  }

} // Close mainController function

})()
