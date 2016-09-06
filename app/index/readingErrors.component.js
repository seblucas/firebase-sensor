'use strict';

function ReadingErrorsCtrl() {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.errors = ctrl.app.errors;
  };
}

angular.module('sensorReadingApp').
component('readingErrors', {
  require: {
    app: '^app'
  },
  controller: ReadingErrorsCtrl,
  templateUrl: 'index/readingErrors.html'
});
