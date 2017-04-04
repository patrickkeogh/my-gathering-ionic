(function() {

  angular
    .module('myGathering')
    .service('Geocode', geocode);

    geocode.$inject = ['$window', '$q', 'Constants'];

    function geocode ($window, $q, Constants) {

      // An empty address object
      var address = {
        location: {
          "type": "Point",
          "coordinates": []
        },
        country: '',
        country_short: '',
        formatted_address: '',
        locality: '',
        postal_code: '',
        state_prov: '',
        name: ''
      };

      // Default geo coords: Barrie ON, Canada
      var default_lat = 43.761539;
      var default_lng = -79.411079;

      var getNavigatorCoords = function () {

        var latlng;
        var defer = $q.defer();

        if (navigator.geolocation) {
          console.log('We have a navigator');
          console.log('Try to use navigator to get GPO coords');

          navigator.geolocation.getCurrentPosition(function(pos){

            latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            console.log('Coords received from Navigator:' + latlng);

            if(Constants.ENV === 'true') {
              var temp = test_coords[Math.floor((Math.random() * test_coords.length) + 1) - 1].coords;
              latlng = new google.maps.LatLng(temp.latitude, temp.longitude);
            }
            defer.resolve(latlng);

          }, function(error) {
            // The navigator is turned off, create latlng from default coords
            console.log('The navigator is turned off, create latlng from default coords');
            latlng = new google.maps.LatLng(default_lat, default_lng);
            defer.resolve(latlng);
          });
          
        } else {
          // Navigator could not be found, use default coords
          console.log('We have NO navigator, use default coords');
          latlng = new google.maps.LatLng(default_lat, default_lng);
          defer.resolve(latlng);
        }

        return defer.promise;
      };

      this.getCurrentLocation = function () {

        var defer = $q.defer();

        getNavigatorCoords().then(function(coords){

          if(coords) {

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'latLng': coords }, function (results, status) {

              if (status === google.maps.GeocoderStatus.OK) {

                var parsedAddress = parseLocation(results[1]);         
                defer.resolve(parsedAddress);

              } else {
                defer.reject({
                  type: status,
                  message: 'Zero results for geocoding your cooords'
                });

              }
            }, function(error){
              console.log('Error with geocoder:' + JSON.stringify(error));
              defer.reject(false);
            }, {timeout: 12000});





          }

        });

        return defer.promise;



      };

      var parseLocation = function (location) {

        //console.log("Data:" + JSON.stringify(location));

        var location_obj = address;

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
      };


    }

})();

       