(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'gatheringAPI', 'Utils', '$ionicModal', '$ionicPlatform', '$ionicLoading'];

  function SearchController($scope, $rootScope, $state, $timeout, gatheringAPI, Utils, $ionicModal, $ionicPlatform, $ionicLoading) {

    $scope.gatherings = {};

    $scope.numToShow = 0;
 
    //$scope.gathering.name = "Gathering Details";

    console.log("Search Controller loaded");

    $ionicPlatform.ready(function() {

      $scope.showLoading();

      var query = Utils.getSearchQuery();

      if(null !== query) {
        getGatherings(query);
      }

    });




    function getGatherings(query) {
      //console.log("Query Used:" + JSON.stringify(query));

      gatheringAPI.getGatherings(1, 5, query)
      .then(function(data) {
          console.log(data);
          $scope.gatherings = data.data;
      })
      .catch(function(err) {
        console.log('failed to get gatherings: ' + err);
      });
    }

    $scope.addMoreItem = function(done) {
        if ($scope.gatherings.length > $scope.numToShow) {

         $scope.numToShow += 5; // load 20 more items
        done(); // need to call this when finish loading more data
      }
    };


    $scope.getRecs = function() {
      console.log("GetRecs call");

      //Add 5 more recs to the list

      $timeout(function(){
        // some function i wrote
        $scope.numToShow += 5;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');

     }, 5000);

      



      
    };

    $scope.areThereMoreRecsToShow = function() {
      return ($scope.gatherings.length > $scope.numToShow) ? true : false;
    };

    $scope.goToDetails = function(gathering) {
      console.log('goToDetails:' + gathering._id);
      $state.go('app.gathering', {id: gathering._id});
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

    $scope.$on('resourceChange', function (event, val) {
        alert(val);
    });

    $scope.$on('event:searchQueryChanged', function(event, val) {
      console.log('event:searchQueryChanged');

      var query = val;
      console.log(query);

      if(null !== query) {
        getGatherings(query);
      }
    });
    
  }

})();