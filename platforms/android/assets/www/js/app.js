angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'firebase', 'ion-floating-menu'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
