angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $interval, $ionicLoading) {
  $scope.timer = 0;
  var clickme = true;

  // FireBase-vars
  var fireBase = null;
  var fireBaseTracks = null;
  var fireBaseStats = null;
  var fireBaseStatsDriven = null;
  var fireBaseStatsTime = null;
  var fireBaseStatsTracks = null;

  // Track-vars
  var current_track = [];
  var current_track_watch = null;
  var current_track_distance = 0;
  var current_track_last_time = 0;
  var current_track_duration = 0;
  var current_track_duration_interval = null;
  var currently_tracking = false;

  // FIREBASE INIT STUFF
  fireBase = new Firebase("https://cycledorf-phonegap.firebaseio.com/");
  fireBase.authAnonymously(function (e, authData) {
    if (e)
      console.warn(e.code);
    else {
        console.info("[FB]Auth successfull!");
        fireBaseTracks = fireBase.child("tracks");
        console.info("[FB]Child 'tracks' added!");
        fireBaseStats = fireBase.child("stats");
        console.info("[FB]Child 'stats' added!");
        fireBaseStatsDriven = fireBaseStats.child("total_driven");
        console.info("[FB]Child 'stats.total_driven' added!");
        fireBaseStatsTime = fireBaseStats.child("total_time");
        console.info("[FB]Child 'stats.total_time' added!");
        fireBaseStatsTracks = fireBaseStats.child("total_tracks");
        console.info("[FB]Child 'stats.total_tracks' added!");
      }
  });

  function geoSuccess(pos) {
    console.log("[GEO]New Data!"); // DEBUG
    if (pos.coords.accuracy > 80) { // only nodes with accuracy 80 meters or lower are accepted
      console.warn("[GEO]Accuracy too low!"); // DEBUG
    } else {
      current_track.push({ acc: pos.coords.accuracy, lat: pos.coords.latitude, lon: pos.coords.longitude, timestamp: Math.floor(new Date().getTime() / 1000) });
      var len = current_track.length;
      if (len > 1) {
        curDistance = getDistance(current_track[len - 1].lat, current_track[len - 1].lon, current_track[len - 2].lat, current_track[len - 2].lon);

        // STATS
        current_track_distance += curDistance;
        fireBaseStatsDriven.transaction(function (curData) {
          return curData + curDistance;
        });
      }
      console.log("[GEO]New Data!"); //DEBUG
      // LEAFLET


      //map.setView(L.latLng(pos.coords.longitude, pos.coords.latitude));
    }
  }

  function geoError(e) {
      geolocation.clearWatch(current_track_watch);
      $interval.cancel(current_track_duration_interval);
      currently_tracking = false;
      console.error(e);
  }

  $scope.status = "Start";
  function time_now() {
    $scope.timer += 1;
  };

  $scope.start = function() {
    if (clickme === true) {
      clickme = false;
      console.log("[GPS]Tracking enabled!");

      $scope.timer = 0;
      $scope.status = "Stop";

      current_track = [];
      current_track_distance = 0;
      current_track_duration = 0;
      current_track_duration_interval = $interval(time_now, 1000);
      current_track_watch = navigator.geolocation.watchPosition(geoSuccess, geoError, {frequency: 2000, enableHighAccuracy: true});
    } else if (clickme === false) {
      clickme = true;

      navigator.geolocation.clearWatch(current_track_watch);
      console.log("[GPS]Tracking stopped!");
      currently_tracking = false;
      if (current_track.length >= 2) { //Check if track has two or more nodes
          var dur = Math.floor(new Date((new Date(current_track[current_track.length - 1].timestamp).getTime()) - (new Date(current_track[0].timestamp).getTime())).getTime());
          fireBaseTracks.push({ data: current_track, distance: current_track_distance, start_time: current_track[0].timestamp, end_time: current_track[current_track.length - 1].timestamp, duration: dur });
          fireBaseStatsTime.transaction(function (curTime) {
              return curTime + dur;
          });
          fireBaseStatsTracks.transaction(function (curTracks) {
              return curTracks + 1;
          });
      } else
        console.log("[GPS]Track not recorded, too few nodes!");
      $interval.cancel(current_track_duration_interval); // startfun => current_track_duration_interval
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
