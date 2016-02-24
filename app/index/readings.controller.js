'use strict';

angular.module('sensorReadingApp').
controller('readingsCtrl', function($scope, lineChartService, firebaseHelperService) {
  $scope.chartAllSizes = [{id: '24', value: '24 hours'},
                          {id: '48', value: '48 hours'},
                          {id: '168', value: '1 week'}];
  $scope.chartSize = {id: '24'};
  $scope.loadGraphs = function() {
    $scope.temperatures = [];
    $scope.humidities = [];
    lineChartService.getChartData($scope.rooms, 'hum', $scope.chartSize.id).then(function(data) {
      $scope.humidities = data;
    });
    lineChartService.getChartData($scope.rooms, 'temp', $scope.chartSize.id).then(function(data) {
      $scope.temperatures = data;
    });
  };

  var showData = function() {
    $scope.rooms = firebaseHelperService.getData('/rooms');
    $scope.readings = {};
    $scope.rooms.$loaded()
    .then(function(data){
      angular.forEach(data, function(room) {
        $scope.readings[room.$id] = firebaseHelperService.getLastReading(room.$id, 1);
      });
    });
    $scope.errors = firebaseHelperService.getData('/errors');
    $scope.loadGraphs();
  };

  var rootRef = firebaseHelperService.getRootReference();
  var authRef = firebaseHelperService.getAuth();

  $scope.login = function() {
    authRef.$authWithOAuthPopup('google').then(function() {
       // No need to do anything here it's handled by onAuth
    }).catch(function(error) {
       console.error('Authentication failed:', error);
    });
  };

  rootRef.onAuth(function(authData) {
    if (authData) {
      $scope.authData = authData;
      console.log('Logged in as:', authData.uid);
      showData();
    } else {
      console.log('Logged out');
      $scope.authData = null;
    }
  });

  $scope.logout = function() {
    angular.forEach($scope.rooms, function(room) {
        $scope.readings[room.$id].$destroy();
      });
    if ($scope.rooms) { $scope.rooms.$destroy(); }
    if ($scope.errors) { $scope.errors.$destroy(); }
    $scope.temperatures = [];
    $scope.humidities = [];
    rootRef.unauth();
  };

  $scope.tempOptions = lineChartService.getChartOption('Temperature', 'Time', 'Temperature (°C)');
  $scope.humOptions = lineChartService.getChartOption('Humidity', 'Time', 'Humidity (%)');

});
