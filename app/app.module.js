'use strict';


// Declare app level module which depends on filters, and services
angular.module('sensorReadingApp', ['firebase', 'nvd3', 'templates', 'ngComponentRouter'])
.value('$routerRootComponent', 'app')
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

