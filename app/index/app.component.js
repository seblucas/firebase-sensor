'use strict';

function AppCtrl(firebaseHelperService) {
  var ctrl = this;

  ctrl.rooms = false;
  ctrl.readingCategories = false;
  ctrl.errors = false;
  ctrl.fluid = false;


  var showData = function() {
    var tempRooms = firebaseHelperService.getData('rooms');
    tempRooms.$loaded()
    .then(function(data){
      ctrl.rooms = data;
    });
    var tempReadingCategories = firebaseHelperService.getData('readingCategories', 'order');
    tempReadingCategories.$loaded()
    .then(function(data){
      ctrl.readingCategories = data;
    });
    var tempErrors = firebaseHelperService.getData('errors');
    tempErrors.$loaded()
    .then(function(data){
      ctrl.errors = data;
    });
  };

  var authRef = firebaseHelperService.getAuth();

  ctrl.login = function() {
    authRef.$signInWithPopup('google').then(function() {
       // No need to do anything here it's handled by $onAuthStateChanged
    }).catch(function(error) {
       console.error('Authentication failed:', error);
    });
  };

  ctrl.toggleHZoom = function() {
    ctrl.fluid = !ctrl.fluid;
  };

  authRef.$onAuthStateChanged(function(authData) {
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
    if (ctrl.readingCategories) { ctrl.readingCategories.$destroy(); ctrl.readingCategories = false; }
    /*ctrl.temperatures = [];
    ctrl.humidities = [];*/
    authRef.$signOut().then(function() {
       console.log('Unauthentication completed');
    }).catch(function(error) {
       console.error('Unauthentication failed:', error);
    });
  };
}

angular.module('sensorReadingApp').
component('app', {
  templateUrl: 'index/app.html',
  controllerAs: 'vm',
  controller: AppCtrl,
  $routeConfig: [
    {path: '/', name: 'HomePage', component: 'homePage', useAsDefault: true},
    {path: '/errors', name: 'ErrorListPage', component: 'readingErrors' },
    {path: '/line-chart', name: 'LineChartPage', component: 'lineChartDetail' }
  ]
});
