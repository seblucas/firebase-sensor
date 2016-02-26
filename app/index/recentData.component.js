'use strict';

function recentDataCtrl(firebaseHelperService) {
  /* jshint validthis: true */
  var ctrl = this;
  console.log('working');
  console.log(ctrl.rooms);
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
  controller: recentDataCtrl
});
