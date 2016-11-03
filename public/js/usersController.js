(function(){
  angular.module('nitpic')
    .controller('usersController', usersController);

  function usersController($http, $state, $stateParams){
    var rootUrl = "http://localhost:3000";
    var self = this;

    // Get all users from backend
    self.getUsers = function(){
      $http.get(`${rootUrl}/users`)
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.users = response.data;
      });
    }

    // User login
    self.login = function(userPass){
      $http.post(`${rootUrl}/users/login`, {user: {username: userPass.username, password: userPass.password}})
      .catch(function(err){
        console.error(err);
      })
      .then(function(response){
        self.user = response.data.user

        localStorage.setItem('token', JSON.stringify(response.data.token));
        $state.go('home', {url: '/user-home', user: response.data.user});
      })
      .catch(function(err){
        console.error(err);
      })
    }

    // Signup
    self.signup = function(userPass){
      console.log("This is the userPass");
      console.log(userPass);
      $http.post(`${rootUrl}/users`, {user: {username: userPass.username, password: userPass.password }})
      .catch(function(err){
        console.error(err);
      })
      .then(function(response) {
        console.log("Errors:");
        console.log(response.data.errors);
        console.log("User:");
        console.log(response.data.user);
        $state.go('home', {url: '/user-home'})
      })
      .catch((err) => {
        console.error(err);
      });
    }

    self.getUsers();
  }
})()
console.log("usersController.js");
// POST   /users/login(.:format)                                                   users#login
// users GET    /users(.:format)                                                         users#index
// POST   /users(.:format)                                                         users#create
// user GET    /users/:id(.:format)                                                     users#show
// PATCH  /users/:id(.:format)                                                     users#update
// PUT    /users/:id(.:format)                                                     users#update
// DELETE /users/:id(.:format)
