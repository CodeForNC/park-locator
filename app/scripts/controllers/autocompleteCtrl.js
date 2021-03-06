(function(angular, ga) {

  'use strict';

  angular.module('appControllers').controller('autocompleteCtrl', ['$scope', 'googleMaps', 'mapService', '$mdSidenav',
    function($scope, googleMaps, mapService, $mdSidenav){

      // Search box inside set my location dialog
      var myLocation, input;

      googleMaps.isReady().then(function(maps) {

        input = document.getElementById($scope.inputId);
        var options = {
          componentRestrictions: {country: 'us'}
        };
        myLocation = new maps.places.Autocomplete( input, options );
        myLocation.addListener('place_changed', updateUserMarker);
        var circle = new maps.Circle({
          center: {lat: 35.79741992502266, lng: -78.64118938203126 },
          // Radius is in meters - 15km
          radius: 15000
        });
        // Bias autocomplete results to locations in Raleigh
        myLocation.setBounds(circle.getBounds());

      });

      // Function used by address typeahead on a place selected
      var updateUserMarker = function() {
        // Close the sidenav if not locked open
        $mdSidenav('left').close();
        // Reset the input field
        input.value = '';

        var loc = myLocation.getPlace().geometry.location;
        ga('send', 'event', 'Location', 'geocoded', loc.lat() + ',' + loc.lng() );
        mapService.updateUserCoords( loc.lat(), loc.lng() );
      };

  }]);

})(angular || window.angular, ga);