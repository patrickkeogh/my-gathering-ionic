(function() {

  angular
    .module('myGathering')
    .service('gatheringAPI', gatheringAPI);

  gatheringAPI.$inject = ['$http', 'Authentication', 'Constants'];

  function gatheringAPI ($http, Authentication, Constants) {

    var url = Constants.HEROKU_URL + '/api/gathering';

    var getTypes = function() {
      return $http.get(url + '/types');
    };

    var getTopics = function() {
      return $http.get(url + '/topics');
    };

    var getGathering = function (id) {
      return $http.get(url + '/' + id);
    };

    var getGatherings = function(page, recsPerPage, query) {
      var queryString = '?page=' + page + '&recsPerPage=' + recsPerPage;

      return $http.get(url + queryString, {
            params: {query}
        });
    };

    var createGathering = function(gathering) {
      return $http.post(url, gathering, {
        headers: {
            'x-access-token': Authentication.getToken
        } 
      });
    };

    var saveBanner = function(id, banner) {
      return $http.post(url + '/' + id + '/banner', banner, {
        headers: {
            'x-access-token': Authentication.getToken
        }
      });
    };

    return {
      getTypes: getTypes,
      getTopics: getTopics,
      getGathering: getGathering,
      getGatherings: getGatherings,
      createGathering: createGathering,
      saveBanner: saveBanner
    };
  }

})();