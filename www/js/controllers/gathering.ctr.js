(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('GatheringController', GatheringController);

  GatheringController.$inject = ['$scope', '$stateParams', 'gatheringAPI', 'Utils', '$ionicPlatform', '$ionicLoading'];

  function GatheringController($scope, $stateParams, gatheringAPI, Utils, $ionicPlatform, $ionicLoading) {

    $scope.gathering = {};
 
    //$scope.gathering.name = "Gathering Details";

    console.log("Gathering Controller loaded");

    $scope.id = $stateParams.id;

    $ionicPlatform.ready(function() {
      
      $scope.showLoading();

      gatheringAPI.getGathering($scope.id)
      .then(function(data) {
        console.log(data.data);
        $scope.gathering = data.data[0];
        $scope.hideLoading();
      })
      .catch(function(err) {
        console.log('failed to get gathering ' + err);
        $scope.hideLoading();
      });

    });

    $scope.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!',
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

    $scope.showDescriptionModel = function() {

      console.log("Show Update Description Model called in Gathering Controller");

      Utils.showUpdateDescription('selected')
      .then(function(result) {
        if(result) {
          // vm.selectedContact = result; 
          console.log('We have a result:' + result);
        }
      });
    };

    $scope.updateDescription = function() {

      console.log("Update description called in Gathering Controller");



    };


    
  }

})();


