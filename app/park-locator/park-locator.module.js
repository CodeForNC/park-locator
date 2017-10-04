(function() {

  'use strict';

  angular
    .module('parkLocator')
    .config(configuration)

    configuration.inject = ['$stateProvider', '$urlRouterProvider'];


    function configuration($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('park-locator', {
            url: '/',
            templateUrl: 'park-locator/park-locator.html',
            controller: 'parkLocatorCtrl',
            controllerAs: 'vm'
          })

          // .state('home.park', {
          //   url: ':name',
          //   views: {
          //     '': {
          //       templateUrl: 'views/partials/park-information.html',
          //       controller: 'parkCtrl'
          //     },
          //     'classes-info@home.park': {
          //       templateUrl: 'views/partials/class-section-selection.html',
          //       controller: 'classesCtrl'
          //     }
          //   },
          //   resolve: {
          //     maps: ['googleMaps', function(googleMaps) {
          //       return googleMaps.isReady();
          //     }],
          //     currentPark: ['parkService', '$stateParams', '$timeout', '$q', function(parkService, $stateParams, $timeout, $q) {
          //       var deferred = $q.defer();
          //       $timeout( parkService.resolveCurrentPark, 0, false, deferred, $stateParams.name);
          //       return deferred.promise;
          //     }]
          //   }
          // })
          //
          // .state('home.park.section', {
          //   url: '/:sectionName',
          //   views: {
          //     'classes-info@home.park': {
          //       templateUrl: 'views/partials/course-section.html',
          //       controller: 'sectionCtrl'
          //     }
          //   }
          // });

    }})();
