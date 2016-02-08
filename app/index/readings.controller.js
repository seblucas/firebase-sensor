'use strict';

angular.module('sensorReadingApp').
controller('readingsCtrl', function($scope, lineChartService, firebaseHelperService) {
  $scope.loadGraphs = function() {
    $scope.temperatures = [];
    $scope.humidities = [];
    $scope.rooms.$loaded()
    .then(function(data){
      var limit = new Date() / 1000;
      limit -= 3600 * 24;
      var tempData = {};
      var humData = {};
      angular.forEach(data, function(room) {
        if (room.readings.temp === 0 && room.readings.hum === 0) {
          return;
        }
        var readings = firebaseHelperService.getLastReading(room.$id, 96); // 4 readings per hour * 24 = 96
        tempData[room.$id] = {key: room.$id, color: room.color, values: []};
        humData[room.$id] = {key: room.$id, color: room.color, values: []};
        readings.$loaded().then(function(values){
          angular.forEach(values, function(reading) {
            if (reading.time > limit) {
              if (room.readings.hum === 1) {
                humData[room.$id].values.push ([reading.time, reading.hum]);
              }
              if (room.readings.temp === 1) {
                tempData[room.$id].values.push ([reading.time, reading.temp]);
              }
            }
          });
          if (room.readings.temp === 1) {
            $scope.temperatures.push(tempData[room.$id]);
          }
          if (room.readings.hum === 1) {
            $scope.humidities.push(humData[room.$id]);
          }
          // Freeup some watches as we don't want to autoupdate the graph
          values.$destroy();
        });
      });
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
