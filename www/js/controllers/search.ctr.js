(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'gatheringAPI', 'Utils', '$ionicScrollDelegate', '$ionicModal', '$ionicPlatform', '$ionicLoading'];

  function SearchController($scope, $rootScope, $state, $timeout, gatheringAPI, Utils, $ionicScrollDelegate, $ionicModal, $ionicPlatform, $ionicLoading) {

    $scope.gatherings = {};

    $scope.address_details = '';
    $scope.place = null;
    $scope.searchCoords = null;
    $scope.searchOptions = {
      distance: 1000000000,
      coords: null,
      topic: null,
      type: null 
    };
    
    $scope.enableAddressField = false;

    $scope.numToShow = 0;
 
    $scope.autocompleteOptions = {
      // componentRestrictions: { country: 'au' },
      types: ['geocode']
    };

    // Get the gathering types list
    gatheringAPI.getTypes()
    .then(function(data) {
      //console.log(data);
      $scope.types = data.data;
    })
    .catch(function(err) {
      console.log('failed to get gathering types ' + err);
    });

    // Get the gathering topics list
    gatheringAPI.getTopics()
    .then(function(data) {
      //console.log(data);
      $scope.topics = data.data;
    })
    .catch(function(err) {
      console.log('failed to get gathering topics ' + err);
    });

    console.log("Search Controller loaded");

    $ionicPlatform.ready(function() {

      $scope.showLoading();

      $ionicModal.fromTemplateUrl('templates/modals/search.modal.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.objSeachModel = modal;
      });

      var query = Utils.getSearchQuery();

      if(null !== query) {
        getGatherings(query);
      }

    });

    $scope.openSearchModal = function() {
      console.log('Open Modal called in Search ctr');
      $scope.searchOptions = {
        distance: 1000000000,
        coords: null,
        topic: null,
        type: null 
      };

      $scope.address_details = '';
        
      $scope.newQuery = null;

      $scope.objSeachModel.show();

      document.getElementById('place').value = "";
    };

    $scope.closeModal = function() {
      console.log('Close Modal called in Search ctr');
      $scope.objSeachModel.hide();
    };




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

    $scope.searchForGatherings = function() {

      console.log('SearchForGatherings() called:');

      var query = null;

      if($scope.searchCoords !== null) {

        if(query === null){
          query = {};
        }

        query['location.location'] = {
          $near: {
            $geometry: { type: "Point",  coordinates: $scope.searchCoords },
            $minDistance: 0.01,
            $maxDistance: $scope.searchOptions.distance

          }
        };
      } else {
        query = {};
      } 

      console.log("Search TYPE:" + $scope.searchOptions.type);

      if ($scope.searchOptions.type === null) {
        console.log("Search TYPE is BADDDDDDDDDDDDDDDDDDD");
      }else{

        query['type.0._id'] = $scope.searchOptions.type._id;       
        
      }
      console.log("Search TOPIC:" + $scope.searchOptions.topic);

      if ($scope.searchOptions.topic === null) {
        console.log("Search TOPIC is BADDDDDDDDDDDDDDDDDDD");
      }else{

        query['topic.0._id'] = $scope.searchOptions.topic._id;       
        
      }       



      console.log(query);

      getGatherings(query);

      $scope.newQuery = query;

      //$rootScope.$broadcast('event:searchQueryChanged', query);

      $scope.numToShow = 0;

      $ionicScrollDelegate.scrollTop();


      $scope.closeModal();

    }; 

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

    $scope.$on('event:searchQueryChanged', function(event, val) {
      console.log('event:searchQueryChanged');

      var query = val;
      console.log(query);

      if(null !== query) {
        getGatherings(query);
      }
    });

    $scope.$on('g-places-autocomplete:select', function (event, param) {

      var components = param.address_components;

      if (typeof components === 'undefined') {
        console.log("No address has been given");
      }else{
        console.log("We Have an address object");

        //console.log("LAT:" + vm.address_details.geometry.location.lat);

        $scope.searchCoords = [param.geometry.location.lng(), param.geometry.location.lat()];

      }
    });
    
  }

})();