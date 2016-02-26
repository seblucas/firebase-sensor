'use strict';

function RecentDataCtrl(firebaseHelperService) {
  var ctrl = this;
  ctrl.readings = {};

  angular.forEach(ctrl.rooms, function(room) {
    ctrl.readings[room.$id] = firebaseHelperService.getLastReading(room.$id, 1);
  });
}

angular.module('sensorReadingApp').
component('recentData', {
  bindings: {
    rooms: '='
  },
  templateUrl: 'index/recentData.html',
  controller: RecentDataCtrl
});
