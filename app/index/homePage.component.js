'use strict';

function HomePageCtrl() {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.rooms = ctrl.app.rooms;
    ctrl.errors = ctrl.app.errors;
  };
}

angular.module('sensorReadingApp').
component('homePage', {
  require: {
    app: '^app'
  },
  templateUrl: 'index/homePage.html',
  controller: HomePageCtrl
});
