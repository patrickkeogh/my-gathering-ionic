(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('GatheringUpdateController', GatheringUpdateController);

  GatheringUpdateController.$inject = [
    '$scope', 
    '$stateParams', 
    'gatheringAPI', 
    'Utils', 
    '$ionicPlatform', 
    '$ionicLoading', 
    'filepickerService'
  ];

  function GatheringUpdateController($scope, $stateParams, gatheringAPI, Utils, $ionicPlatform, $ionicLoading, filepickerService) {

    $scope.gathering = {};
    $scope.uploadedPicture = null;
 
    //$scope.gathering.name = "Gathering Details";

    console.log("Gathering Controller loaded");

    $scope.id = $stateParams.id;

    $ionicPlatform.ready(function() {
      
      //$scope.showLoading();

      gatheringAPI.getGathering($scope.id)
      .then(function(data) {
        console.log(data.data);
        $scope.gathering = data.data[0];
        //$scope.hideLoading();
      })
      .catch(function(err) {
        console.log('failed to get gathering ' + err);
        //$scope.hideLoading();
      });

    });

    //Single file upload, you can take a look at the options
    $scope.upload = function(){
      filepickerService.pick(
        {
          mimetype: 'image/*',
          language: 'en',
          services: ['CONVERT', 'COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
          conversions: ['crop'],
          cropRatio: 2/1,
          cropMin: [300, 150],
          // cropDim: [300, 150],
          cropMax: [2160, 1080],
          cropForce: true,
          openTo: 'COMPUTER'
        },
        function(Blob){
            console.log(JSON.stringify(Blob));
            $scope.uploadedPicture = Blob;
            $scope.gathering.banner = Blob;
            $scope.$apply();
        }
      );
    };

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

    $scope.showBannerModel = function() {

      console.log("Show Update Banner Model called in Gathering Controller");

      Utils.showUpdateBanner('selected')
      .then(function(result) {
        if(result) {
          // vm.selectedContact = result; 
          console.log('We have a result:' + result);
        }
      });
    };

    $scope.updateDescription = function() {

      console.log("Update description called in Gathering Controller");

      $scope.closeModal('Joe');

    };

    $scope.updateBanner = function() {

      console.log("Update descrnner called in Gathering Controller");

      $scope.closeModal($scope.uploadedPicture);

    };


    
  }

})();


