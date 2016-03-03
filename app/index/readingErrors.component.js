'use strict';

angular.module('sensorReadingApp').
component('readingErrors', {
  bindings: {
    errors: '<'
  },
  templateUrl: 'index/readingErrors.html'
});
