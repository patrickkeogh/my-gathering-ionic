(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('UpdateGatheringController', ManageGatheringsController);

  ManageGatheringsController.$inject = [
    '$scope',
    '$state',
    'Authentication',
    'gatheringAPI'
  ];

  function ManageGatheringsController($scope, $state, Authentication, gatheringAPI) {

    $scope.gatherings = [];

    $scope.currentUser = Authentication.getCurrentUser();

    angular.element(document).ready(function() {

      console.log("init called in Gathering");

      //console.log('')

      var query = {};

      query = {
        "owner.username": $scope.currentUser.username
      };

      getGatherings(query);

    });

    function getGatherings(query) {
      console.log("Query Used:" + JSON.stringify(query));
      gatheringAPI.getGatherings(1, 5, query)
      .then(function(data) {
          console.log(data);
          $scope.gatherings = data.data;
      })
      .catch(function(err) {
        console.log('failed to get gatherings: ' + err);
      });
    }

    $scope.goToDetails = function(gathering) {
      console.log('goToDetails:' + gathering._id);
      $state.go('app.manage', {id: gathering._id});
    };

    $scope.updateDate = function() {

      console.log("Update Date called");

    };

  }

})();


