'use strict';

function HomePageCtrl() {
  var ctrl = this;
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
