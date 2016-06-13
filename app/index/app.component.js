'use strict';

function AppCtrl(firebaseHelperService) {
  var ctrl = this;

  ctrl.rooms = false;
  ctrl.errors = false;


  var showData = function() {
    var tempRooms = firebaseHelperService.getData('/rooms');
    tempRooms.$loaded()
    .then(function(data){
      ctrl.rooms = data;
    });
    var tempErrors = firebaseHelperService.getData('/errors');
    tempErrors.$loaded()
    .then(function(data){
      ctrl.errors = data;
    });
  };

  var rootRef = firebaseHelperService.getRootReference();
  var authRef = firebaseHelperService.getAuth();

  ctrl.login = function() {
    authRef.$authWithOAuthPopup('google').then(function() {
       // No need to do anything here it's handled by onAuth
    }).catch(function(error) {
       console.error('Authentication failed:', error);
    });
  };

  rootRef.onAuth(function(authData) {
    if (authData) {
      ctrl.authData = authData;
      console.log('Logged in as:', authData.uid);
      showData();
    } else {
      console.log('Logged out');
      ctrl.authData = null;
    }
  });

  ctrl.logout = function() {
    // Todo fix with the components
   /* angular.forEach(ctrl.rooms, function(room) {
        ctrl.readings[room.$id].$destroy();
      });*/
    if (ctrl.rooms) { ctrl.rooms.$destroy(); ctrl.rooms = false; }
    if (ctrl.errors) { ctrl.errors.$destroy(); ctrl.errors = false; }
    /*ctrl.temperatures = [];
    ctrl.humidities = [];*/
    rootRef.unauth();
  };
}

angular.module('sensorReadingApp').
component('app', {
  templateUrl: 'index/app.html',
  controllerAs: 'vm',
  controller: AppCtrl
});
