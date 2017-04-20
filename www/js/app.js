(function() {
    'use strict';
    
    angular
    .module('myGathering', [
      'ionic',
      'ionic-timepicker',
      'ionic-datepicker',
      'ngCordova',
      'ngMessages',
      'google.places'
    ])
    .config(config)
    .constant('Constants', {
        HEROKU_URL: 'https://my-gathering.herokuapp.com',
        TOKEN_ID: 'myGathering-token',
        LOCATION_ID: 'myGathering-locations',
        ENV: 'false'
    })
    .run(run);
    
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 'ionicTimePickerProvider', 'ionicDatePickerProvider'];
    run.$inject = ['$ionicPlatform'];
    
    function config($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicTimePickerProvider, ionicDatePickerProvider) {

      $ionicConfigProvider.navBar.alignTitle('center');

      var datePickerObj = {
        inputDate: new Date(),
        titleLabel: 'Select a Date',
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        mondayFirst: false,
        weeksList: ["S", "M", "T", "W", "T", "F", "S"],
        monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        templateType: 'popup',
        from: new Date(2012, 8, 1),
        to: new Date(2018, 8, 1),
        showTodayButton: true,
        dateFormat: 'dd MMMM yyyy',
        closeOnSelect: false,
        disableWeekdays: []
      };


      // disabledDates: [            //Optional
      //   new Date(2016, 2, 16),
      //   new Date(2015, 3, 16),
      //   new Date(2015, 4, 16),
      //   new Date(2015, 5, 16),
      //   new Date('Wednesday, August 12, 2015'),
      //   new Date("08-16-2016"),
      //   new Date(1439676000000)
      // ],
      // from: new Date(2012, 1, 1), //Optional
      // to: new Date(2016, 10, 30), //Optional
      // inputDate: new Date(),      //Optional
      // mondayFirst: true,          //Optional
      // disableWeekdays: [0],       //Optional
      // closeOnSelect: false,       //Optional

      ionicDatePickerProvider.configDatePicker(datePickerObj);

      var timePickerObj = {
        inputTime: ((new Date()).getHours() * 60 * 60),
        format: 12,
        step: 15,
        setLabel: 'OK',
        closeLabel: 'Cancel'
      };

      ionicTimePickerProvider.configTimePicker(timePickerObj);




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
      })
      .state('app.create', {
        url: '/create',
        views: {
          'menu-content': {
            templateUrl: 'templates/create.html',
            controller: 'CreateController'
          }
        }
      })
      .state('app.gathering', {
        url: '/gathering/:id',
        views: {
          'menu-content': {
            templateUrl: 'templates/gathering.html',
            controller: 'GatheringController'
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




