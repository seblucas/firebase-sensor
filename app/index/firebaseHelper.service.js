'use strict';

angular.module('sensorReadingApp').
factory('firebaseHelperService', function($firebaseArray, $firebaseAuth) {
  var fireBaseUrl = 'https://<YOUR OWN APP URL>.firebaseio.com';
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
    getData: function(url) {
      var ref = new Firebase(fireBaseUrl + url);
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
