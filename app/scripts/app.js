(function(angular){

  'use strict';

  angular.module('parkLocator', ['appServices', 'appFilters', 'appControllers', 'appDirectives', 'ui.router', 'ngMaterial', 'duScroll', 'dcbImgFallback', 'ngAnimate'])

    .value('duScrollDuration', 600)
    .value('duScrollOffset', 0)
    .value('duScrollEasing', function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    })

    .config([ '$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
      $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
      $httpProvider.defaults.cache = true;
    }])

    .config([ '$mdThemingProvider', function ($mdThemingProvider) {
      $mdThemingProvider.theme('altTheme')
        .primaryPalette('purple')
        .accentPalette('red')
        .warnPalette('yellow');
    }])

    .config([ '$mdIconProvider', function($mdIconProvider) {
      $mdIconProvider.defaultIconSet('img/icons/core.svg', 48);
    }])

    .config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: 'views/main.html',
            controller: 'devicesCtrl'
          })

          .state('home.park', {
            url: ':name',
            views: {
              '': {
                templateUrl: 'views/partials/park-information.html',
                controller: 'parkCtrl'
              },
              'classes-info@home.park': {
                templateUrl: 'views/partials/class-section-selection.html',
                controller: 'classesCtrl'
              }
            },
            resolve: {
              maps: ['googleMaps', function(googleMaps) {
                return googleMaps.isReady();
              }],
              currentPark: ['parkService', '$stateParams', '$timeout', '$q', function(parkService, $stateParams, $timeout, $q) {
                var deferred = $q.defer();
                $timeout( parkService.resolveCurrentPark, 0, false, deferred, $stateParams.name);
                return deferred.promise;
              }]
            }
          })

          .state('home.park.section', {
            url: '/:sectionName',
            views: {
              'classes-info@home.park': {
                templateUrl: 'views/partials/course-section.html',
                controller: 'sectionCtrl'
              }
            }
          });

    }])

    .run(['$rootScope', '$state', function($rootScope, $state) {

      $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        event.preventDefault();
        if (toState.name === 'home.park') {
          $state.go('home');
        }
        console.log(event, toState, toParams, fromState, fromParams, error);
      });

    }]);
  // End angular.module
})(angular || window.angular);
