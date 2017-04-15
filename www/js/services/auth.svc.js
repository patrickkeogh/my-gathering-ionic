(function () {

  angular
    .module('myGathering')
    .service('Authentication', authentication);

  authentication.$inject = ['$rootScope', '$window', '$http', 'Constants'];

  function authentication ($rootScope, $window, $http, Constants) {

    var url = Constants.HEROKU_URL + '/api';
    var token_id = Constants.TOKEN_ID;

    var saveToken = function (token) {
      $window.localStorage[token_id] = token;
    };

    var removeToken = function (token) {
      $window.localStorage.removeItem(token_id);
    };

    this.getToken = function () {
      return $window.localStorage[token_id];
    };

    // this.getUsername = function () {
    //   if(this.isLoggedIn()){
    //     var token = this.getToken();
    //     var payload = token.split('.')[1];
    //     payload = $window.atob(payload);
    //     payload = JSON.parse(payload);

    //     return payload._doc.username;
    //   }

    // };

    this.getCurrentUser = function() {
      if(this.isLoggedIn()){
        var token = this.getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        //console.log('payload exp:' + JSON.stringify(payload._doc));

        return {
          username : payload._doc.username,
          name : payload._doc.name,
          _id: payload._doc._id
        };
      }
    };

    this.isLoggedIn = function() {
      //console.log("IsLoggedIn called:");
      var token = this.getToken();
      var payload;

      if(token){
        //console.log('We have a token');
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        //console.log('payload exp:' + JSON.stringify(payload.exp));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    this.register = function(user) {
      return $http.post(url + '/register', user).
      then(function(data) {
          return data;
      }, function(error) {
          console.log("Login Error=" + JSON.stringify(error));
          return error;
      });
    };

    this.login = function(user) {
      return $http.post(url + '/login', user).
      then(function(data) {
        console.log("We Got a Token:" + data.data.token);
        saveToken(data.data.token);
        $rootScope.$broadcast('event:auth-login-complete');
        return data;      
      }, function(error) {
        console.log("Login Error=" + JSON.stringify(error));
        return error;
      });
    };

    this.logout = function() {
      return $http.get(url + '/logout').
      then(function(data) {
        removeToken();
        $rootScope.$broadcast('event:auth-logout-complete');
        console.log("Logout Service:" + JSON.stringify(data));
        return data;
      }, function(error) {
        console.log(JSON.stringify(error));
        return error;
      });
    };
  }


})();