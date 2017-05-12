(function () {

  angular
  .module('myGathering')
  .service('Utils', utils);

  utils.$inject = ['$rootScope', 'modalService'];

  function utils ($rootScope, modalService) {

    var blankGathering = {
      //id: 1,
      name:"", 
      description: "",
      location: {}, 
      type: "",    
      topic: "", 
      gathering_start_date_time: "",
      gathering_end_date_time: "",
      directions: "",
      access: "Public",
      notes: "",
      status: "Not Published",
      owner: {}
    };

    var blankLocation = {
      location: {
        "type": "Point",
        "coordinates": [-79.3790818, 43.64352050000001] //long, lat for mongo
      },
      country: '',
      country_short: '',
      formatted_address: '',
      locality: '',
      postal_code: '',
      state_prov: '',
      name: '',
      notes: ''
    };

    var dateSearchOptions = [
      {
        name: 'No Date Filter',
        value: 0
      },
      {
        name: 'Starting Today',
        value: 1
      },
      {
        name: 'Starting Tomorrow',
        value: 2
      },
      {
        name: 'Starting Within One Week From',
        value: 3
      },
      {
        name: 'Starting Within One Month From',
        value: 4
      },
      {
        name: 'Starting Within One Year From',
        value: 5
      }

    ];

    var query = null;

    var getSearchQuery = function() {
      console.log('getSearchQuery:' + JSON.stringify(query));
      return query;
    };

    var setSearchQuery = function(value) {
      console.log('setSearchQueryCalled:' + JSON.stringify(value));
      $rootScope.$broadcast('event:searchQueryChanged');
      this.query = value;
    };

    var getNewGatheringTemplate = function() {
      return blankGathering;
    };

    var getNewLocationTemplate = function() {
      return blankLocation;
    };

    var getDateSearchOptions = function() {
      return dateSearchOptions;
    };

    var showUpdateDescription = function(contact){
      console.log('showUpdateDescription called in Utils service');
      return modalService.show('templates/modals/update.description.modal.html', 'GatheringUpdateController as vm', contact);
    };
    
    var showUpdateBanner = function(otherContact) {
      return modalService.show('templates/modals/update.banner.modal.html', 'GatheringUpdateController as vm', otherContact);
    };

    return {
      getNewGatheringTemplate: getNewGatheringTemplate,
      getNewLocationTemplate: getNewLocationTemplate,
      getSearchQuery: getSearchQuery,
      setSearchQuery: setSearchQuery,
      showUpdateDescription: showUpdateDescription,
      showUpdateBanner: showUpdateBanner,
      getDateSearchOptions: getDateSearchOptions
    };


    


  }


})();