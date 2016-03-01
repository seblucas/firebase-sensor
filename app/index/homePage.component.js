'use strict';

function HomePageCtrl(lineChartService) {
  var ctrl = this;
  ctrl.chartAllSizes = [{id: '24', value: '24 hours'},
                          {id: '48', value: '48 hours'},
                          {id: '168', value: '1 week'}];
  ctrl.chartSize = {id: '24'};
  ctrl.tempOptions = lineChartService.getChartOption('temp');
  ctrl.humOptions = lineChartService.getChartOption('hum');

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

  ctrl.loadGraphs();
}

angular.module('sensorReadingApp').
component('homePage', {
  bindings: {
    rooms: '=',
    errors: '='
  },
  templateUrl: 'index/homePage.html',
  controller: HomePageCtrl
});
