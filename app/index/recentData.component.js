'use strict';

function RecentDataCtrl(firebaseHelperService, $timeout) {
  var ctrl = this;

  ctrl.updateTimestamp = function() {
    ctrl.currentTimeLimit = Math.floor(Date.now() / 1000) - (31 * 60);
    $timeout(ctrl.updateTimestamp, 1 * 60 * 1000);
  };

  ctrl.$onInit = function() {
    ctrl.readings = {};
    ctrl.currentTimeLimit = 0;

    ctrl.updateTimestamp();

    angular.forEach(ctrl.rooms, function(room) {
      ctrl.readings[room.$id] = firebaseHelperService.getLastReading(room.$id, 1);
    });
  };
}

angular.module('sensorReadingApp').
component('recentData', {
  bindings: {
    rooms: '<',
    categories: '<'
  },
  templateUrl: 'index/recentData.html',
  controller: RecentDataCtrl
});
