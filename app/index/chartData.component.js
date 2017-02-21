'use strict';

function ChartDataCtrl(lineChartService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.chartAllSizes = [{id: '24', value: '24 hours'},
                          {id: '48', value: '48 hours'},
                          {id: '168', value: '1 week'}];
    ctrl.chartSize = {id: '24'};
    ctrl.dataTypes = [{type: 'temp'}, {type: 'hum'}, {type: 'lum'}];
    ctrl.chartData = [];
    ctrl.chartOptions= [];

    ctrl.loadGraphs();
  };

  ctrl.loadGraphs = function() {
    angular.forEach(ctrl.dataTypes, function(dataType){
      ctrl.chartOptions[dataType.type] = lineChartService.getChartOption(dataType.type);
      ctrl.chartData[dataType.type] = [];
      lineChartService.getChartData(ctrl.rooms, dataType.type, ctrl.chartSize.id).then(function(data) {
        ctrl.chartData[dataType.type] = data;
      });
    });
  };
}

angular.module('sensorReadingApp').
component('chartData', {
  bindings: {
    rooms: '<'
  },
  templateUrl: 'index/chartData.html',
  controller: ChartDataCtrl
});
