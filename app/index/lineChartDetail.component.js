'use strict';

function LineChartDetailCtrl(lineChartService) {
  var ctrl = this;

  var loadChart = function() {
    ctrl.chartData = [];
    lineChartService.getChartData(ctrl.rooms, ctrl.currentCategory.$id, ctrl.chartSize.id).then(function(data) {
      ctrl.chartData = data;
      for (var i = 0; i < ctrl.chartData.length; i++) {
        ctrl.chartData[i].disabled = !ctrl.selectedRooms[ctrl.chartData[i].key];
      }
    });
  };

  ctrl.$onInit = function() {
    ctrl.readingCategories = ctrl.app.readingCategories;
    ctrl.rooms = ctrl.app.rooms;
    ctrl.filteredRooms = [];
    ctrl.selectedRooms = {};
    ctrl.chartData = [];
    ctrl.chartAllSizes = [{id: '24', value: '24 hours'},
                          {id: '48', value: '48 hours'},
                          {id: '168', value: '1 week'}];
    ctrl.chartSize = {id: '24'};
  };

  ctrl.selectCategory = function() {
    ctrl.filteredRooms = [];
    ctrl.selectedRooms = {};
    ctrl.chartOptions = lineChartService.getChartOption(ctrl.currentCategory.$id);
    angular.forEach(ctrl.rooms, function(room) {
      if (room.readings[ctrl.currentCategory.$id] === 1) {
        ctrl.filteredRooms.push(room);
        ctrl.selectedRooms[room.$id] = true;
      }
    });
    loadChart();
  };

  ctrl.selectSize = function() {
    loadChart();
  };

  ctrl.updateStream = function(category) {
    for (var i = 0; i < ctrl.chartData.length; i++) {
      if (ctrl.chartData[i].key === category) {
        ctrl.chartData[i].disabled = !ctrl.selectedRooms[category];
      }
    }
  };

}

angular.module('sensorReadingApp').
component('lineChartDetail', {
  require: {
    app: '^app'
  },
  controller: LineChartDetailCtrl,
  templateUrl: 'index/lineChartDetail.html'
});
