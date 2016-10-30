'use strict';

function RecentDataCtrl(firebaseHelperService, $timeout) {
  var ctrl = this;
  ctrl.readings = {};
  ctrl.currentTimeLimit = 0;

  ctrl.updateTimestamp = function() {
    ctrl.currentTimeLimit = Math.floor(Date.now() / 1000) - (31 * 60);
    $timeout(ctrl.updateTimestamp, 1 * 60 * 1000);
  };

  ctrl.updateTimestamp();

  angular.forEach(ctrl.rooms, function(room) {
    ctrl.readings[room.$id] = firebaseHelperService.getLastReading(room.$id, 1);
  });
}

angular.module('sensorReadingApp').
component('recentData', {
  bindings: {
    rooms: '<'
  },
  templateUrl: 'index/recentData.html',
  controller: RecentDataCtrl
});
