(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('sidenavContent', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/sidenav-content.html',
      controller: ['$scope', function ($scope) {

        $scope.currentList = 'activities';

        $scope.toggleList = function (listName) {
          $scope.currentList = $scope.currentList === listName ? '' : listName;
        };

      }]
    };

  });

})(window.angular);