(function () {
  'use strict';

  angular
    .module('myGathering')
    .controller('CreateController', CreateController);

  CreateController.$inject = ['$scope', '$state', '$filter', 'Authentication', 'Utils', 'gatheringAPI', 'ionicTimePicker', 'ionicDatePicker', '$ionicPopup', '$ionicLoading'];

  function CreateController($scope, $state, $filter, Authentication, Utils, gatheringAPI, ionicTimePicker, ionicDatePicker, $ionicPopup, $ionicLoading) {

    $scope.newGathering = Utils.getNewGatheringTemplate();
    $scope.newLocation = Utils.getNewLocationTemplate();

    $scope.newGathering.gathering_start_date_time = new Date();

    $scope.start_date = "";
    $scope.types = [];
    $scope.topics = [];
    $scope.options1 = null;
    $scope.address_details = '';
    $scope.place = null;
    $scope.showDateError = true;
    $scope.formSubmitted = false;

    $scope.autocompleteOptions = {
        // componentRestrictions: { country: 'au' },
        types: ['geocode']
    };

    $scope.currentUser = Authentication.getCurrentUser();

    $scope.newGathering.owner = {
      ownerId: $scope.currentUser._id,
      username: $scope.currentUser.username,
      name: $scope.currentUser.name
    };

    // Get the gathering types list
    gatheringAPI.getTypes()
    .then(function(data) {
      console.log(data);
      $scope.types = data.data;
    })
    .catch(function(err) {
      console.log('failed to get gathering types ' + err);
    });

    // Get the gathering topics list
    gatheringAPI.getTopics()
    .then(function(data) {
      console.log(data);
      $scope.topics = data.data;
    })
    .catch(function(err) {
      console.log('failed to get gathering topics ' + err);
    });

    var datePicker = {
      callback: function (val) {  //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Date not selected');
        } else {          
          var selectedDate = new Date(val);
          var tempDate = new Date($scope.newGathering.gathering_start_date_time);

          selectedDate.setHours(tempDate.getHours());
          selectedDate.setMinutes(tempDate.getMinutes());

          $scope.newGathering.gathering_start_date_time = selectedDate;
          $scope.newGathering.gathering_end_date_time = selectedDate;

          // change filter depending on the width of the screen
          $scope.start_date = $filter('date')($scope.newGathering.gathering_start_date_time, "h:mm a EEEE, MMMM d, y");

          $scope.showDateError = false;
        }
      },
      templateType: 'popup'       //Optional
    };

    

    var timePicker = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          
          
          var selectedTime = new Date(val * 1000);
          var tempDate = new Date($scope.newGathering.gathering_start_date_time);
          tempDate.setHours(selectedTime.getUTCHours());
          tempDate.setMinutes(selectedTime.getUTCMinutes());

          $scope.newGathering.gathering_start_date_time = tempDate;
          $scope.newGathering.gathering_end_date_time = tempDate;

          // change filter depending on the width of the screen
          $scope.start_date = $filter('date')($scope.newGathering.gathering_start_date_time, "h:mm a EEEE, MMMM d, y");

          $scope.showDateError = false;
        }
      }
    };

    $scope.createGathering = function(isValid) {
      console.log('Create Gathering called');

      $scope.formSubmitted = true;

      //$scope.showPopUp();

      

      if(!isValid) {
        console.log("FORM IS INVALID+++++++++++++++++++++++++++++++++++++");
        $scope.isFormValid = false;
        $scope.showPopUp();        
      }else {
        console.log("FORM IS OK+++++++++++++++++++++++++++++++++++++");

        // Add the location document to the Gathering document
        $scope.newGathering.location = $scope.newLocation;

        console.log("Post the gathering to the server");
        // Post the new gathering to the server
        console.log("Gathering to Post:" + JSON.stringify($scope.newGathering));

        $scope.showLoading();

        gatheringAPI.createGathering($scope.newGathering)
        .then(function(data) {
          console.log("Gathering Added");
          //console.log("data=" + JSON.stringify(data));
          //$state.go('gathering-dashboard', {id: data.data.id});  
          $scope.hideLoading();
          $scope.showSuccessPopUp();

          //$state.go('app.main');
           
        })
        .catch(function(err) {
          console.log('failed to create gathering ' + err);
        });

      

      }

    };

    $scope.showSuccessPopUp = function() {
      // Custom popup
      var successPopup = $ionicPopup.show({
         template: '<div></div>',
         title: 'Success',
         subTitle: 'The new Gathering was successfully added.',
         scope: $scope,
      
         buttons: [
            { 
              text: 'OK',
              type: 'button-primary'
            } 
         ]
      });

      successPopup.then(function(res) {
        console.log('Success Gathering added!', res);
        $state.go('app.main');
      });
    };



    $scope.showPopUp = function() {
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<div></div>',
         title: 'Form Error',
         subTitle: 'You have 1 or more form errors!',
         scope: $scope,
      
         buttons: [
            { 
              text: 'OK',
              type: 'button-primary'
            } 
            // {
            //   text: '<b>Save</b>',
            //   type: 'button-positive',
            //   onTap: function(e) {
            
            //     if (!$scope.data.model) {
            //       //don't allow the user to close unless he enters model...
            //       e.preventDefault();
            //     } else {
            //       return $scope.data.model;
            //     }
            //   }
            // }
         ]
      });

      myPopup.then(function(res) {
         console.log('Tapped!', res);
      });



    };

    $scope.showTimePicker = function() {
      ionicTimePicker.openTimePicker(timePicker);
    };
    
    $scope.showDatePicker = function(){
      ionicDatePicker.openDatePicker(datePicker);
    };

    $scope.showLoading = function() {
      $ionicLoading.show({
        template: 'Creating new gathering ...',
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

    $scope.$on('g-places-autocomplete:select', function (event, param) {
      //console.log(event);
      //console.log("Param:" + JSON.stringify(param));

      var components = param.address_components;

      if (typeof components === 'undefined') {
        console.log("No address has been given");
      }else{
        console.log("We Have an address object");

        //console.log("LAT:" + vm.address_details.geometry.location.lat);

        $scope.newLocation.location.coordinates = [param.geometry.location.lng(), param.geometry.location.lat()];

        $scope.newLocation.formatted_address = param.formatted_address;
        $scope.newLocation.name = param.name;

        components.forEach(function(types) {

          var component_type = types.types[0];

          //console.log("Type:" + component_type);

          switch(component_type) {
            case 'country':
              //console.log('Country:' + types.long_name);
              $scope.newLocation.country = types.long_name;
              $scope.newLocation.country_short = types.short_name;
              break;
            case 'locality':                
              //console.log('Locality:' + types.long_name);
              $scope.newLocation.locality = types.long_name;
              break;
            case 'sublocality_level_1':                
              //console.log('SubLocality:' + types.long_name);
              $scope.newLocation.locality = types.long_name;
              break;
            case 'administrative_area_level_1':                
              //console.log('State:' + types.long_name);
              $scope.newLocation.state_prov = types.long_name;
              break;
            case 'postal_code':                
              //console.log('Postal Code:' + types.long_name);
              $scope.newLocation.postal_code = types.long_name;
              break;
            default:
              //default code block
          }
        });


        console.log("New Location:" + JSON.stringify($scope.newLocation));



      }


    });







    
  }

})();


