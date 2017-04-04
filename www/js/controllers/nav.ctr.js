(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('NavController', NavController);

  NavController.$inject = ['$scope', '$state', '$ionicModal', '$ionicPopup', '$ionicLoading', 'Authentication'];

  function NavController($scope, $state, $ionicModal, $ionicPopup, $ionicLoading, Authentication) {
    //var vm = this;

    $scope.isLoggedIn = Authentication.isLoggedIn();
    //console.log('Nav isloggedIn:' + $scope.isloggedIn);
    $scope.currentUser = Authentication.getCurrentUser();

    $scope.credentials = {
      name : "",
      username : "",
      password : ""
    };

    $scope.message = "";

    // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/models/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });

    // Login Model
    $ionicModal.fromTemplateUrl('templates/models/login.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('templates/models/register.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

    $scope.openModal = function(index) {
      if (index == 1) $scope.oModal1.show();
      else $scope.oModal2.show();
    };

    $scope.closeModal = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
    };



    // Triggered in the login modal to close it
    // $scope.cancel = function() {
    //   $scope.modal.hide();
    // };


    // Open the login modal
    // $scope.showLogin = function() {
    //   console.log('Login Called');
    //   $scope.modal.show();
    // };

    $scope.register = function () {

      console.log('Submitting registration');

      //var rndPassword = Math.random().toString(36).slice(-8);
      $scope.credentials.password = 'welcome'; //for testing only

      var response = Authentication.register($scope.credentials);
        response.then(function(data) {

          //console.log("response=" + JSON.stringify(data));

          if(data.status === 200) {

            $scope.credentials = {
              name : "",
              username : "",
              password : ""
            };

            $scope.oModal2.hide();

            $scope.message = "Your password has been emailed to the addess you used for registration.  You should change your password after signing in the first time.";
            $scope.oModal1.show();

          } else if(data.status === 400) {
            $scope.showError = true;
            console.log("Error:" + data.data.err);

            if(data.data.err.message === 'No username was given') {
              $scope.errorMessage = 'Error: No email was given';
            }else if(data.data.err === 'The supplied email address has already be used to register!') {
              $scope.errorMessage = 'Error: ' + data.data.err;
            }else {
              $scope.errorMessage = data.data.err;
            }            

          }else{

            console.log("status:" + data.data.status);
          }

        }, function() {

        }); 


    };

    $scope.login = function() {

      console.log('Submitting Login Request');

      $scope.showLoading();

      // if(isValid) {
      var response = Authentication.login($scope.credentials);

      response.then(function(data) {

        $scope.hideLoading();

        //console.log("ResponseDataInController=" + JSON.stringify(data));

        if(data.status === 200) {
          
          console.log("Success:" + data.data.status);
          $scope.message = 'You have successfully logged in.';
          //Globals.setUserStatus(Constants.UserStatus.authenticated);
          //$state.go('tab.main');

          // var alertPopup = $ionicPopup.alert({
          //       title: 'Login failed!',
          //       template: 'Please check your credentials!'
          //   });


          $scope.oModal1.hide();

        }else{
          $scope.showMessage = true;
          $scope.message = data.data.err.message;
        }

      }, function() {

      });
    };

    $scope.logout = function() {
          
        console.log('Logout method called');

        var response = Authentication.logout();

        response.then(function(data) {

          if(data.status === 200) {
            console.log("Success:" + data.data.status);
            
            $state.go('app.main');
          }
        });
      };

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

    $scope.$on('event:auth-login-complete', function() {
      $scope.isLoggedIn = Authentication.isLoggedIn();
      $scope.currentUser = Authentication.getCurrentUser();
    });

    $scope.$on('event:auth-logout-complete', function() {
      $scope.isLoggedIn = Authentication.isLoggedIn();
      $scope.currentUser = Authentication.getCurrentUser();
    });



    
    
  }

})();


