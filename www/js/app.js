(function() {
    'use strict';
    
    angular
    .module('myGathering', [
      'ionic'
    ])
    .config(config)
    .constant('Constants', {
        HEROKU_URL: 'https://my-gathering.herokuapp.com',
        TOKEN_ID: 'myGathering-token',
        LOCATION_ID: 'myGathering-locations',
        ENV: 'false'
    })
    .run(run);
    
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];
    run.$inject = ['$ionicPlatform'];
    
    function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

      $ionicConfigProvider.navBar.alignTitle('center');




      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

      // setup an abstract state for the tabs directive
      // .state('tab', {
      //   url: '/tab',
      //   abstract: true,
      //   templateUrl: 'templates/tabs.html',
      //   controller: 'NavController as vm'
      // })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu-main.html',
        controller: 'NavController'
      })

      // Each tab has its own nav history stack:

      .state('app.main', {
        url: '/main',
        views: {
          'menu-content': {
            templateUrl: 'templates/main.html',
            controller: 'MainController'
          }
        }
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menu-content': {
            templateUrl: 'templates/search.html',
            controller: 'MainController'
          }
        }
      });


      // .state('tab.search', {
      //   url: '/search',
      //   views: {
      //     'tab-search': {
      //       templateUrl: 'templates/search.html',
      //       controller: 'SearchController'
      //     }
      //   }
      // })

      // .state('tab.login', {
      //   url: '/login',
      //   views: {
      //     'tab-login': {
      //       templateUrl: 'templates/login.html',
      //       controller: 'AuthController as vm'
      //     }
      //   }
      // })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/main');
    }

    function run($ionicPlatform) {

      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
        
    }
    
})();




