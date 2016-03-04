'use strict';

function ChartDataCtrl(lineChartService) {
  var ctrl = this;
  ctrl.chartData = [];
  lineChartService.getChartData(ctrl.rooms, ctrl.type, ctrl.size).then(function(data) {
    ctrl.chartData = data;
  });

  ctrl.chartOptions = lineChartService.getChartOption(ctrl.type);

}

angular.module('sensorReadingApp').
component('chartData', {
  bindings: {
    rooms: '<',
    size: '<',
    type: '<'
  },
  templateUrl: 'index/chartData.html',
  controller: ChartDataCtrl
});
