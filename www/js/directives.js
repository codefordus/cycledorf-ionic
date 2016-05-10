angular.module('starter.directives', [])

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        var mapOptions = {
          center: new L.latLng(51.220692, 6.772686),
          zoom: 17
        };
        var map = L.map($element[0], mapOptions);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        L.DomEvent.addListener(window, 'load', initialize);
      }
    }
  }
});
