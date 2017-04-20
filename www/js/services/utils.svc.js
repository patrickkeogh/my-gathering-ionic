(function () {

  angular
  .module('myGathering')
  .service('Utils', utils);

  utils.$inject = [];

  function utils () {

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


    var getNewGatheringTemplate = function(gathering) {
      return blankGathering;
    };

    var getNewLocationTemplate = function(gathering) {
      return blankLocation;
    };

    return {
      getNewGatheringTemplate: getNewGatheringTemplate,
      getNewLocationTemplate: getNewLocationTemplate
    };


    


  }


})();