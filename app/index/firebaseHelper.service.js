'use strict';

/*global firebase */

angular.module('sensorReadingApp').
factory('firebaseHelperService', function($firebaseArray, $firebaseAuth) {
  var firebaseAuth = $firebaseAuth();
  return {
    getLastReading: function(room, limit) {
      var ref = firebase.database().ref('readings/' + room);
      // Only the last readings are interesting
      if (limit > 0) {
        ref = ref.limitToLast(limit);
      }
      return $firebaseArray(ref);
    },
    getData: function(url, orderBy) {
      var ref = firebase.database().ref(url);
      if (orderBy !== undefined && orderBy !== null) {
        ref = ref.orderByChild(orderBy);
      }
      return $firebaseArray(ref);
    },
    getAuth: function() {
      return firebaseAuth;
    }
  };
});
