(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('AuthController', controller);

  controller.$inject = [
    '$scope', 
    '$state',
    '$stateParams', 
    'gatheringAPI', 
    'Utils', 
    '$ionicPlatform', 
    '$ionicLoading',
    '$cordovaToast',
    '$ionicHistory',
    'Authentication'
  ];

  function controller($scope, $state, $stateParams, gatheringAPI, Utils, $ionicPlatform, $ionicLoading, $cordovaToast, $ionicHistory, Authentication) {

    $scope.message = "Sign Out? Please confirm";

    $scope.confirmSignout = function() {

      // $cordovaToast.showLongBottom('Here is a message').then(function(success) {
      //   // success
      //   //$state.go('app.home');
      // }, function (error) {
      //   // error
      // });

      logout();

      //$state.go('app.home');
    };

    function logout() {
          
        console.log('Logout method called');

        $scope.showLoading();

        var response = Authentication.logout();

        response.then(function(data) {

          $scope.hideLoading();

          if(data.status === 200) {
            console.log("Success:" + data.data.status);

            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            
            $state.go('app.home');
          } else {
            //console.log("NO Success LOGOUT:" + data.data.status);

          }
        }, function(error) {
          console.log(error);
        });
      }

    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Logging in...',
        duration: 3000
      }).then(function(){
         console.log("The loading indicator is now displayed");
      });
    };

    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         console.log("The loading indicator is now hidden");
      });
    };




   
  }

})();


