'use strict';

angular.module('parkLocator').controller('MainCtrl', [ '$scope', 'mapService', 'accordionService', 'parkService', 'uiGmapGoogleMapApi', 'Flash', 'amenitiesService',
	function ($scope, mapService, accordionService, parkService, gMapsAPI, Flash, amenitiesService) {
    
    // Basic accordion config
    $scope.settings = accordionService.settings;

    // Set Location Section
    $scope.geoLocate = function() {

    	Flash.create('info', 'We are attempting to obtain your location. Please wait a few seconds.');

	  	// Try HTML5 geolocation.
	    if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition( function (position) {
	        $scope.$apply(mapService.updateUserCoords(position.coords.latitude, position.coords.longitude));
	      });
	    } else {
	      var message = '<strong> Oops!</strong>  Your browser does not support Geolocation.';
	      Flash.create('warning', message);
	      console.log('Geolocation not supported');
	    }
	  };

	  $scope.geoLocate();

	  // Define some async objects from our services
    $scope.parks = parkService.markers;
    $scope.amenities = amenitiesService.list;


    // Filter by activity section
    $scope.selectedActivities = [];

    $scope.addToSelected = function (amenity) {
    	$scope.selectedActivities.push(amenity);
    	$scope.amenities.uniques.splice( $scope.amenities.uniques.indexOf(amenity), 1);
    	console.log($scope.amenities.uniques);
    };

    $scope.removeSelected = function (amenity) {
    	$scope.amenities.uniques.push( amenity );
    	$scope.selectedActivities.splice($scope.selectedActivities.indexOf(amenity), 1);
    	console.log($scope.selectedActivities);
    };

    // Select a park section
    $scope.centerToPark = function (park) {
    	park.onMarkerClicked();
    	mapService.map.location.coords.latitude = park.latitude;
    	mapService.map.location.coords.longitude = park.longitude;
    	mapService.map.zoom = 16;
    };

    // Search box inside set my location panel
	  var autocomplete,
	  		directionsService,
	  		directionsDisplay;

	  gMapsAPI.then(function(maps) {
	  	$scope.mapsApi = maps;
	  	// Address typeahead
	    var input = document.getElementById('autocomplete');
	    var options = {
	      componentRestrictions: {country: 'us'}
	    };
	    autocomplete = new maps.places.Autocomplete( input, options );
	    autocomplete.addListener('place_changed', updateUserMarker);
	    var circle = new maps.Circle({
        center: {lat: 35.79741992502266, lng: -78.64118938203126 },
        // Radius is in meters - 15km
        radius: 15000
      });
      // Bias autocomplete results to locations in Raleigh
      autocomplete.setBounds(circle.getBounds());

      // Directions Service
      initializeDirections();

	  });

	  // Function used by address typeahead on a place selected
	  var updateUserMarker = function() {
	    var loc = autocomplete.getPlace().geometry.location;
	    $scope.$apply(mapService.updateUserCoords(loc.lat(), loc.lng()));
	  };

	  var initializeDirections = function () {
	    directionsService = new $scope.mapsApi.DirectionsService();
	    directionsDisplay = new $scope.mapsApi.DirectionsRenderer();
	    var mapOptions = {
		    zoom: 16,
		    center: new $scope.mapsApi.LatLng(mapService.map.myLocationMarker.coords.latitude, mapService.map.myLocationMarker.coords.longitude)
		  }
		  var map = new $scope.mapsApi.Map(document.getElementById("mini-map"), mapOptions);
	  	directionsDisplay.setMap( map );
	  };

	  var calcRoute = function(park) {
	  	console.log("attempting to calc route");
		  var request = {
		      origin: new $scope.mapsApi.LatLng(mapService.map.myLocationMarker.coords.latitude, mapService.map.myLocationMarker.coords.longitude),
		      destination: new $scope.mapsApi.LatLng(park.latitude, park.longitude),
		      travelMode: $scope.mapsApi.TravelMode.DRIVING
		  };
	  	console.log(request);
		  directionsService.route(request, displayDirections);
		};

		var displayDirections = function(response, status) {
			console.log("displaying directions now!");
	    if (status === $scope.mapsApi.DirectionsStatus.OK) {
	    	console.log("here");
	      directionsDisplay.setDirections(response);
	    }
	  };

	  $scope.$watch('parks.currentPark', calcRoute);

  }]);
