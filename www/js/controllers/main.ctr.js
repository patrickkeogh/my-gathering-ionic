(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$state', 'Geocode', 'gatheringAPI', '$ionicPlatform', '$ionicLoading', '$cordovaGeolocation'];

  function MainController($scope, $state, Geocode, gatheringAPI, $ionicPlatform, $ionicLoading, $cordovaGeolocation) {

    $scope.gatherings = [];

    $scope.distance = 10000;
    $scope.details = '';
    $scope.address_text = '';

    $scope.distance = 10000;

    $scope.search_address = {};

    var empty_address = {
      location: {
        "type": "Point",
        "coordinates": [0,0]
      },
      country: '',
      formatted_address: '',
      locality: '',
      postal_code: '',
      state_prov: '',
      name: '',
      notes: ''
    };

    $ionicPlatform.ready(function() {
      $scope.showLoading();
         
      var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
      };

      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {

        var lat  = position.coords.latitude;
        console.log('Lat:' + lat);
        var lng = position.coords.longitude;
        console.log('Long:' + lng);

        var myLatlng = new google.maps.LatLng(lat, lng);

        console.log('Google LatLng:' + myLatlng);

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'latLng': myLatlng }, function (results, status) {

          console.log('Status:' + status);
          //console.log('Results:' + JSON.stringify(results));


          if (status === google.maps.GeocoderStatus.OK) {
            //console.log('Results:' + JSON.stringify(results));
            $scope.search_address = parseLocation(results[1]); 

          }

          $scope.hideLoading();

          // we have a location now, get the first 5 gatherings for this location

          // create a query object

          var query = {};

          query['location.location'] = {
                $near: {
                  $geometry: { type: "Point",  coordinates: $scope.search_address.location.coordinates },
                  $minDistance: 0.01,
                  $maxDistance: $scope.distance

                }
            };

            getGatherings(query);

        }, function (error) {
          console.log('Geocoder Error:' + error);
          $scope.hideLoading();

        });

      }, function(error) {
        $scope.hideLoading(); 
        console.log('Error using Cordova Geolocation: ' + error);

      });

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

    function parseLocation(location) {

      var location_obj = empty_address;

      location_obj.location.coordinates = [location.geometry.location.lng(), location.geometry.location.lat()];
      location_obj.formatted_address = location.formatted_address;

      var components = location.address_components;

      components.forEach(function(types) {

          var component_type = types.types[0];

          switch(component_type) {
            case 'country':
              //console.log('Country:' + types.long_name);
              location_obj.country = types.long_name;
              location_obj.country_short = types.short_name;
              break;
            case 'locality':                
              //console.log('Locality:' + types.long_name);
              location_obj.locality = types.long_name;
              break;
            case 'sublocality_level_1':                
              //console.log('SubLocality:' + types.long_name);
              location_obj.locality = types.long_name;
              break;
            case 'administrative_area_level_1':                
              //console.log('State:' + types.long_name);short
              location_obj.state_prov = types.long_name;
              break;
            case 'postal_code':                
              //console.log('Postal Code:' + types.long_name);
              location_obj.postal_code = types.long_name;
              break;
            default:
                //default code block
          }
        });

        return location_obj;

    }    

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

    $scope.goToDetails = function(gathering) {
      console.log('goToDetails:' + gathering._id);

      $state.go('app.gathering', {id: gathering._id});

    };



    


    
  }

})();


