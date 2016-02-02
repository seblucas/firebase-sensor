'use strict';

angular.module('sensorReadingApp').
controller('readingsCtrl', function($scope, $firebaseArray, dateFilter, $firebaseAuth) {
  var fireBaseUrl = 'https://<YOUR OWN APP URL>.firebaseio.com';
  $scope.getLastReading = function(room, limit) {
    var ref = new Firebase(fireBaseUrl + '/readings/' + room);
    // Only the last readings are interesting
    ref = ref.limitToLast(limit);
    return $firebaseArray(ref);
  };

  $scope.loadGraphs = function() {
    $scope.temperatures = [];
    $scope.humidities = [];
    $scope.rooms.$loaded()
    .then(function(data){
      var limit = new Date() / 1000;
      limit -= 3600 * 24;
      var tempData = {};
      var humData = {};
      angular.forEach(data, function(room, key) {
        if (room.readings.temp === 0 && room.readings.hum === 0) {
          return;
        }
        var readings = $scope.getLastReading(room.$id, 96); // 4 readings per hour * 24 = 96
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
    var ref = new Firebase(fireBaseUrl + '/rooms');
    $scope.rooms = $firebaseArray(ref);
    $scope.readings = {};
    $scope.rooms.$loaded()
    .then(function(data){
      angular.forEach(data, function(room) {
        $scope.readings[room.$id] = $scope.getLastReading(room.$id, 1);
      });
    });
    ref = new Firebase(fireBaseUrl + '/errors');
    $scope.errors = $firebaseArray(ref);
    $scope.loadGraphs();
  };

  $scope.login = function() {
    var ref = new Firebase(fireBaseUrl);
    var auth = $firebaseAuth(ref);
    auth.$authWithOAuthPopup('google').then(function() {
       // No need to do anything here it's handled by onAuth
    }).catch(function(error) {
       console.error('Authentication failed:', error);
    });
  };

  var authRef = new Firebase(fireBaseUrl);
  authRef.onAuth(function(authData) {
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
    //$scope.nvd3Temperature.refresh();
    $scope.humidities = [];
    //$scope.nvd3Humidities.refresh();
    authRef.unauth();
  };

  $scope.tempOptions = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            interpolate: 'basis-open',
            x: function(entry){ return entry[0]; },
            y: function(entry){ return entry[1]; },
            useInteractiveGuideline: true,
            xAxis: {
                axisLabel: 'Time',
                tickFormat: function(d){
                    return dateFilter(new Date(d * 1000), 'yyyy-MM-dd HH:mm');
                },
                axisLabelDistance: -10
            },
            yAxis: {
                axisLabel: 'Temperature (°C)',
                axisLabelDistance: -10
            },
        },
        title: {
            enable: true,
            text: 'Temperature'
        }
  };

  $scope.humOptions = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            interpolate: 'basis-open',
            x: function(entry){ return entry[0]; },
            y: function(entry){ return entry[1]; },
            useInteractiveGuideline: true,
            xAxis: {
                axisLabel: 'Time',
                tickFormat: function(d){
                    return dateFilter(new Date(d * 1000), 'yyyy-MM-dd HH:mm');
                },
                axisLabelDistance: -10
            },
            yAxis: {
                axisLabel: 'Humidity (%)',
                axisLabelDistance: -10
            },
        },
        title: {
            enable: true,
            text: 'Humidity'
        }
  };
});
