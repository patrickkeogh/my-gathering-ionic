(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', 'Geocode', '$ionicPlatform', '$ionicLoading', '$cordovaGeolocation'];

  function MainController($scope, Geocode, $ionicPlatform, $ionicLoading, $cordovaGeolocation) {

    $scope.gatherings = [];

    $scope.distance = 10000;
    $scope.details = '';
    $scope.address_text = '';

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

    // $scope.showLoading = function() {
    //       $ionicLoading.show({
    //         template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    //         duration: 3000
    //       }).then(function(){
    //          console.log("The loading indicator is now displayed");
    //       });
    //     };  

    //     $scope.hideLoading = function(){
    //       $ionicLoading.hide().then(function(){
    //          console.log("The loading indicator is now hidden");
    //       });
    //     };

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
          console.log('Results:' + JSON.stringify(results));


          if (status === google.maps.GeocoderStatus.OK) {
            console.log('Results:' + JSON.stringify(results));
            $scope.search_address = parseLocation(results[1]); 

          }

          $scope.hideLoading();

        }, function (error) {
          console.log('Geocoder Error:' + error);
          $scope.hideLoading();

        });

      }, function(error) {
        $scope.hideLoading(); 
        console.log('Error using Cordova Geolocation: ' + error);

      });

    });

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



    

        
       
        // $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        //   console.log('Coords received from Navigator:' + JSON.stringify(position));
        //     var lat  = position.coords.latitude;
        //     var long = position.coords.longitude;
             
        //     var myLatlng = new google.maps.LatLng(lat, long);

        //     var geocoder = new google.maps.Geocoder();

        //     geocoder.geocode({ 'latLng': myLatlng }, function (results, status) {

        //       console.log('Status:' + status);

        //       if (status === google.maps.GeocoderStatus.OK) {

        //         console.log('Results:' + JSON.stringify(results));

        //         //var parsedAddress = parseLocation();         
        //         //defer.resolve(parsedAddress);

        //       } else {
        //         // defer.reject({
        //         //   type: status,
        //         //   message: 'Zero results for geocoding your cooords'
        //         // });

        //       }
        //     }, function(error){
        //       console.log('Error with geocoder:' + JSON.stringify(error));
        //       //defer.reject(false);
        //     }, {timeout: 12000});

           
        //     // var mapOptions = {
        //     //     center: myLatlng,
        //     //     zoom: 16,
        //     //     mapTypeId: google.maps.MapTypeId.ROADMAP
        //     // };          
             
        //     // var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
             
        //     //$scope.map = map;   
        //     $ionicLoading.hide();           
             
        // }, function(err) {
        //     $ionicLoading.hide();
        //     console.log(err);
        // });
    

    // angular.element(document).ready(function() {

    //   console.log("init called in Main Controller");

    //   ionic.Platform.ready(function(){
    //       // Code goes here
    //   }

    //   Geocode.getCurrentLocation().then(function(result){

    //     console.log("We have a result:" + JSON.stringify(result));
    //       $scope.search_address = result;


    //   });

    // 


    
  }

})();


