angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $interval, $ionicLoading) {
  $scope.timer = 0;
  var clickme = true;
  var startfun = null;

  $scope.status = "Start";
  var inter = function() {
    $scope.timer += 1;
  };

  $scope.start = function() {
    if (clickme === true) {
      $scope.timer = 0;
      $scope.status = "Stop";
      clickme = false;
      startfun = $interval(foo, 1000);
    } else if (clickme === false) {
      clickme = true;
      $interval.cancel(startfun);
      $scope.status = "Start";
    }
  };
  $scope.reset=function(){

      $interval.cancel(startfun);
      $scope.timer = 0;
      $scope.status = "Start";
      clickme = true;

  };


  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setView(L.latLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
