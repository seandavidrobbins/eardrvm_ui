(function() {
  angular.module('sound_overflow', ['ui.router', 'ngFileUpload', 'ui.bootstrap'])
    .config(AuthRouter);



    AuthRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

    function AuthRouter($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
        .state('welcome', {
          url: '/',
          templateUrl: '../partials/_welcome.html',
        })
        .state('signup', {
          url: '/signup',
          templateUrl: '../partials/_signup.html'
        })
        .state('login', {
          url: '/login',
          templateUrl: '../partials/_login.html'
        })
         .state('home', {
          url: '/user-home',
          templateUrl: '../partials/_user-home.html',
        })
        .state('playlist', {
          url: '/playlist',
          templateUrl: '../partials/_playlist.html'
        })
        .state('album-show', {
          url: '/album-show',
          templateUrl: '../partials/_album-show.html',
        })
        .state('album-update', {
          url: '/album-update',
          templateUrl: '../partials/_update-album.html',
        })
        .state('new-album', {
         url: '/new-album',
         templateUrl: '../partials/_create-album.html'
       })
        .state('song-show', {
          url: '/song-show',
          templateUrl: '../partials/_song-show.html'
        })
        .state('contact', {
          url: '/contact',
          templateUrl: '../partials/_contact.html'
        });

        $urlRouterProvider.otherwise('/');

      //   $locationProvider.html5Mode({
      //     enabled: true,
      //     requireBase: false
      //   });
      }

})()


console.log("app.js");
