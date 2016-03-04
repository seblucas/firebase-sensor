'use strict';

function HomePageCtrl() {
  var ctrl = this;
  ctrl.chartAllSizes = [{id: '24', value: '24 hours'},
                          {id: '48', value: '48 hours'},
                          {id: '168', value: '1 week'}];
  ctrl.chartSize = {id: '24'};
  ctrl.dataTypes = [{type: 'temp'}, {type: 'hum'}];
}

angular.module('sensorReadingApp').
component('homePage', {
  bindings: {
    rooms: '<',
    errors: '='
  },
  templateUrl: 'index/homePage.html',
  controller: HomePageCtrl
});
