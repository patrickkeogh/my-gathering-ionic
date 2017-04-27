(function () {

  angular
  .module('myGathering')
  .service('IonicUtils', IonicUtils);

  IonicUtils.$inject = ['$rootScope', '$ionicModal'];

  function IonicUtils ($rootScope, $ionicModal) {

    var getIonicModel = function(gathering) {

      $ionicModal.fromTemplateUrl('templates/modals/search.modal.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.objSeachModel = modal;
      });
      
      return blankLocation;
    };

    return {
      getNewGatheringTemplate: getNewGatheringTemplate,
      getNewLocationTemplate: getNewLocationTemplate,
      getSearchQuery: getSearchQuery,
      setSearchQuery: setSearchQuery
    };


    


  }


})();