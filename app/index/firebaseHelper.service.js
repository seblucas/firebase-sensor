'use strict';

angular.module('sensorReadingApp').
factory('firebaseHelperService', function($firebaseArray, $firebaseAuth, firebaseConfig) {
  var fireBaseUrl = firebaseConfig.url;
  var rootReference = new Firebase(fireBaseUrl);
  var firebaseAuth = $firebaseAuth(rootReference);
  return {
    getFirebaseUrl: function() {
      return fireBaseUrl;
    },
    getLastReading: function(room, limit) {
      var ref = new Firebase(fireBaseUrl + '/readings/' + room);
      // Only the last readings are interesting
      if (limit > 0) {
        ref = ref.limitToLast(limit);
      }
      return $firebaseArray(ref);
    },
    getData: function(url, orderBy) {
      var ref = new Firebase(fireBaseUrl + url);
      if (orderBy !== undefined && orderBy !== null) {
        ref = ref.orderByChild(orderBy);
      }
      return $firebaseArray(ref);
    },
    getRootReference: function() {
      return rootReference;
    },
    getAuth: function() {
      return firebaseAuth;
    }
  };
});
