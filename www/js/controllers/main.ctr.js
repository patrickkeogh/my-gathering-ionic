(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', 'Geocode'];

  function MainController($scope, Geocode) {

    $scope.gatherings = [];

    $scope.distance = 10000;
    $scope.details = '';
    $scope.address_text = '';

    $scope.search_address = {
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

    angular.element(document).ready(function() {

      console.log("init called in Main Controller");

      Geocode.getCurrentLocation().then(function(result){

        console.log("We have a result:" + JSON.stringify(result));
          $scope.search_address = result;


      });

    });



    
  }

})();


