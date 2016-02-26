'use strict';

function readingsCtrl(lineChartService, firebaseHelperService) {
  /* jshint validthis: true */
  var ctrl = this;
  ctrl.chartAllSizes = [{id: '24', value: '24 hours'},
                          {id: '48', value: '48 hours'},
                          {id: '168', value: '1 week'}];
  ctrl.chartSize = {id: '24'};
  ctrl.rooms = false;
  ctrl.loadGraphs = function() {
    ctrl.temperatures = [];
    ctrl.humidities = [];
    lineChartService.getChartData(ctrl.rooms, 'hum', ctrl.chartSize.id).then(function(data) {
      ctrl.humidities = data;
    });
    lineChartService.getChartData(ctrl.rooms, 'temp', ctrl.chartSize.id).then(function(data) {
      ctrl.temperatures = data;
    });
  };

  var showData = function() {
    var tempRooms = firebaseHelperService.getData('/rooms');
    tempRooms.$loaded()
    .then(function(data){
      ctrl.rooms = data;
      ctrl.loadGraphs();
    });
    ctrl.errors = firebaseHelperService.getData('/errors');
  };

  var rootRef = firebaseHelperService.getRootReference();
  var authRef = firebaseHelperService.getAuth();

  ctrl.login = function() {
    authRef.$authWithOAuthPopup('google').then(function() {
       // No need to do anything here it's handled by onAuth
    }).catch(function(error) {
       console.error('Authentication failed:', error);
    });
  };

  rootRef.onAuth(function(authData) {
    if (authData) {
      ctrl.authData = authData;
      console.log('Logged in as:', authData.uid);
      showData();
    } else {
      console.log('Logged out');
      ctrl.authData = null;
    }
  });

  ctrl.logout = function() {
    angular.forEach(ctrl.rooms, function(room) {
        ctrl.readings[room.$id].$destroy();
      });
    if (ctrl.rooms) { ctrl.rooms.$destroy(); }
    if (ctrl.errors) { ctrl.errors.$destroy(); }
    ctrl.temperatures = [];
    ctrl.humidities = [];
    rootRef.unauth();
  };

  ctrl.tempOptions = lineChartService.getChartOption('Temperature', 'Time', 'Temperature (°C)');
  ctrl.humOptions = lineChartService.getChartOption('Humidity', 'Time', 'Humidity (%)');

}

angular.module('sensorReadingApp').
component('readings', {
  templateUrl: 'index/readings.html',
  controller: readingsCtrl
});
