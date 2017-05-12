(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('SearchController', SearchController);

  SearchController.$inject = [
    '$scope', 
    '$rootScope', 
    '$state', 
    'moment',
    '$timeout', 
    '$filter',
    'gatheringAPI',
    'Utils', 
    'Geocode',
    '$ionicScrollDelegate', 
    '$ionicModal', 
    '$ionicPlatform', 
    '$ionicLoading',
    'ionicDatePicker',
    '$cordovaGeolocation',
    '$cordovaToast'];

  function SearchController($scope, $rootScope, $state, moment, $timeout, $filter, gatheringAPI, Utils, Geocode, $ionicScrollDelegate, $ionicModal, $ionicPlatform, $ionicLoading, ionicDatePicker, $cordovaGeolocation, $cordovaToast) {

    $scope.gatherings = [];
    var empty_address = Utils.getNewLocationTemplate();
    $scope.dateSearchOptions = Utils.getDateSearchOptions();

    //$scope.dateFilter = $scope.dateSearchOptions[3];

    $scope.start_date = new Date();
    $scope.selectedDate = new Date();

    $scope.isDateDisabled = false;



    $scope.address_details = '';
    $scope.place = null;
    $scope.searchCoords = null;
    $scope.searchOptions = {
      distance: 1000000000,
      coords: null,
      topic: null,
      type: null,
      dateFilter: $scope.dateSearchOptions[3]
    };


    
    $scope.enableAddressField = false;

    $scope.numToShow = 0;
    $scope.numShowing = 0;
    $scope.message = "";
    $scope.useCurrentAddress = false;
    $scope.addressMessage = '';
 
    $scope.autocompleteOptions = {
      // componentRestrictions: { country: 'au' },
      types: ['geocode']
    };

    //constructFooterTag();

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

    //console.log("Search Controller loaded");

    $ionicPlatform.ready(function() {

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

      getCurrentLocation();     

    });

    var datePicker = {
      callback: function (val) {  //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Date not selected');
        } else {          
          $scope.selectedDate = new Date(val);

          $scope.updateQuery();



          //$scope.selectedDate = $filter('date')(new Date(val), "EEEE, MMMM d, y");
        }
      },
      templateType: 'popup'       //Optional
    };

    $scope.openSearchModal = function() {
      $scope.objSeachModel.show();
    };

    $scope.closeModal = function() {
      //console.log('Close Modal called in Search ctr');
      $scope.objSeachModel.hide();
    };

    function getCurrentLocation() {

      console.log('getCurrentLocation Called');

      $scope.showLoading();

      Geocode.getCurrentLocation()
        .then(function(data) {
          //console.log(data);
          //console.log('we  got your current location');
          //$scope.topics = data.data;

          $scope.search_address = data;

          $scope.searchCoords = $scope.search_address.location.coordinates;
          $scope.searchOptions.coords = $scope.search_address.location.coordinates;

          $scope.addressMessage = '';

          if($scope.search_address.locality !== '') {
            $scope.addressMessage += $scope.search_address.locality + ', ';
          }

          if($scope.search_address.state_prov !== '') {
            $scope.addressMessage += $scope.search_address.state_prov;
          }

          if($scope.search_address.country_short !== '') {
            $scope.addressMessage += ", " + $scope.search_address.country_short;
          }

          $scope.useCurrentAddress = true;

          $scope.hideLoading();

          $scope.updateQuery();


        })
        .catch(function(error) {
          console.log('failed to get current location: ' + error);
          $scope.addressMessage = error;
          $scope.hideLoading();

          $ionicPlatform.ready(function () {

            // $cordovaToast
            //   .show('You location is unavailable, please check your setting and try again', 'long', 'center')
            //   .then(function (success) {
            //       // success
            //   }, function (error) {
            //       // error
            // });

          }); 



          //$scope.useCurrentAddress = false;
        });

    }

    function constructFooterTag() {
      
      var ttlGatherings = 0;
      var myGatherings = $scope.gatherings;

      if(myGatherings === undefined) {        
      } else {
        ttlGatherings = myGatherings.length;
      }

      if($scope.numToShow > ttlGatherings){
        $scope.numShowing = ttlGatherings;
      } else {
        $scope.numShowing = $scope.numToShow;
      }

      $scope.message = "Showing " + $scope.numShowing + " of " + ttlGatherings;

    }
    
    function getGatherings(query) {
      console.log("Query Used:" + JSON.stringify(query));

      gatheringAPI.getGatherings(1, 5, query)
      .then(function(data) {
          console.log(data);
          $scope.gatherings = data.data;
          //constructFooterTag();
      })
      .catch(function(err) {
        console.log('failed to get gatherings: ' + err);
      });
    }

    function constructQuery() {

      console.log('Construct Query has been enetered');

      var query = {};
      var startDate;
      var endDate;
      var futureDate;

      console.log("Date Filter Used:" + $scope.searchOptions.dateFilter.value);

      //$scope.showDate = false;

      if($scope.searchOptions.dateFilter.value !== 0 ) {

        switch($scope.searchOptions.dateFilter.value) {
          case 1: // Today
            
            startDate = new Date(moment().hour(0).minute(0).second(0));
            endDate = new Date(moment().hour(23).minute(59).second(59));
            $scope.selectedDate = new Date(startDate);

            $scope.isDateDisabled = true;
            
            console.log('Today Start:' + startDate);
            console.log('Today End:' + endDate);
            break;

          case 2: // Tomorrow             

            futureDate = moment().add(1, 'd');
            startDate = new Date(moment(futureDate).hour(0).minute(0).second(0));
            endDate = new Date(moment(futureDate).hour(23).minute(59).second(59));
            $scope.selectedDate = new Date(startDate);

            $scope.isDateDisabled = true;

            //console.log('Tomorrow Start:' + startDate);
            //console.log('Tomorrow End:' + endDate);

            break;
          case 3: // Next Week
            startDate = new Date(moment($scope.selectedDate).hour(0).minute(0).second(0));
            futureDate = moment($scope.selectedDate).add(1, 'w');
            endDate = new Date(moment(futureDate).hour(23).minute(59).second(59));

            $scope.isDateDisabled = false;

            //console.log('Tomorrow Start:' + startDate);
            //console.log('Tomorrow End:' + endDate);
            break;
          case 4: // Next Month
            startDate = new Date(moment($scope.selectedDate).hour(0).minute(0).second(0));
            futureDate = moment($scope.selectedDate).add(1, 'M');
            endDate = new Date(moment(futureDate).hour(23).minute(59).second(59));

            $scope.isDateDisabled = false;

            //console.log('Tomorrow Start:' + startDate);
            //console.log('Tomorrow End:' + endDate);
            break;
          case 5: // Next Year
            startDate = new Date(moment($scope.selectedDate).hour(0).minute(0).second(0));
            futureDate = moment($scope.selectedDate).add(1, 'y');
            endDate = new Date(moment(futureDate).hour(23).minute(59).second(59));

            $scope.isDateDisabled = false;

            //console.log('Tomorrow Start:' + startDate);
            //console.log('Tomorrow End:' + endDate);
            break;

        }

        query.gathering_start_date_time = {
          $gt:startDate,
          $lt:endDate
        };

      }

      // Check if a gathering type filter was used
      if ($scope.searchOptions.type === null) {
        //console.log("Search TYPE is BADDDDDDDDDDDDDDDDDDD");
      }else{
        query['type.0._id'] = $scope.searchOptions.type._id;        
      }

      if ($scope.searchOptions.topic === null) {
        //console.log("Search TOPIC is BADDDDDDDDDDDDDDDDDDD");
      }else{
        query['topic.0._id'] = $scope.searchOptions.topic._id;        
      } 

      if($scope.searchOptions.coords === null) {
        // Dont include address in the search
        console.log('Dont use location');
      } else {

        query['location.location'] = {
          $near: {
            $geometry: { type: "Point",  coordinates: $scope.searchOptions.coords },
            $minDistance: 0.01,
            $maxDistance: $scope.searchOptions.distance

          }
        };
      } 

      return query;




    }

    $scope.resetFilters = function() {

      $scope.searchOptions = {
        distance: 1000000000,
        coords: null,
        topic: null,
        type: null,
        dateFilter: $scope.dateSearchOptions[3]
      };

      $scope.updateQuery();


    };

    $scope.searchForGatherings = function() {

      // $scope.newQuery = query;

      // //$rootScope.$broadcast('event:searchQueryChanged', query);

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
        constructFooterTag();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');

     }, 3000);      
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
         //console.log("The loading indicator is now displayed");
      });
    };

    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         //console.log("The loading indicator is now hidden");
      });
    };

    $scope.showDatePicker = function(){
      console.log('showDatePicker');
      ionicDatePicker.openDatePicker(datePicker);
    };

    $scope.checkForCurrentAddress = function(value) {

      console.log("check for address called:" + value);

      if(value === true) {
        $scope.place = null;
        getCurrentLocation();
      } else {
        //console.log('Do not use current address');/
        $scope.searchCoords = null;
        $scope.searchOptions.coords = null;
        $scope.updateQuery();

      }

    };

    $scope.updateQuery = function() {
      console.log('updateQuery called:');

      var query = constructQuery(); 
      getGatherings(query); 

    };

    // $scope.$on('event:searchQueryChanged', function(event, val) {
    //   console.log('event:searchQueryChanged');

    //   var query = val;
    //   console.log(query);

    //   if(null !== query) {
    //     getGatherings(query);
    //   }
    // });

    $scope.$on('g-places-autocomplete:select', function (event, param) {

      var components = param.address_components;

      if (typeof components === 'undefined') {
        console.log("No address has been given");
        $scope.searchOptions.coords = null;
      }else{
        console.log("We Have an address object");

        //console.log("LAT:" + vm.address_details.geometry.location.lat);

        $scope.searchCoords = [param.geometry.location.lng(), param.geometry.location.lat()];

        $scope.searchOptions.coords = $scope.searchCoords;

        $scope.updateQuery();

      }
    });
    
  }

})();