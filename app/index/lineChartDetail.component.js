'use strict';

function LineChartDetailCtrl(lineChartService) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.readingCategories = ctrl.app.readingCategories;
    ctrl.rooms = ctrl.app.rooms;
    ctrl.filteredRooms = [];
    ctrl.selectedRooms = {};
    ctrl.chartData = [];
  };

  ctrl.selectCategory = function() {
    ctrl.filteredRooms = [];
    ctrl.selectedRooms = {};
    ctrl.chartOptions = lineChartService.getChartOption(ctrl.currentCategory.$id);
    ctrl.chartData = [];
    lineChartService.getChartData(ctrl.rooms, ctrl.currentCategory.$id, 24).then(function(data) {
      ctrl.chartData = data;
    });
    angular.forEach(ctrl.rooms, function(room) {
      if (room.readings[ctrl.currentCategory.$id] === 1) {
        ctrl.filteredRooms.push(room);
        ctrl.selectedRooms[room.$id] = true;
      }
    });
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
