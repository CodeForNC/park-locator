(function() {

	'use strict';

  function parkLocatorCtrl() {
    var map = L.map("map").setView([37.75, -122.23], 10);

      L.esri.basemapLayer("Topographic").addTo(map);

  }

  parkLocatorCtrl.$inject = []

  angular
    .module('parkLocator')
    .controller('parkLocatorCtrl', parkLocatorCtrl);

})();
