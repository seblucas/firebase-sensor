'use strict';


// Declare app level module which depends on filters, and services
angular.module('sensorReadingApp', ['firebase', 'nvd3', 'templates', 'ngRoute'])
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    template: '<home-page rooms="vm.rooms" errors="vm.errors"></home-page>'
  })
  .when('/errors', {
    template: '<home-page rooms="vm.rooms" errors="vm.errors"></home-page>'
  });
});
