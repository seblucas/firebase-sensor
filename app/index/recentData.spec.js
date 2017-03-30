'use strict';

describe('recentDataComponent', function(){
  beforeEach(module('sensorReadingApp'));

  var roomsJson = [
    {$id: 'room1'},
    {$id: 'room2'}
  ];

  var recentDataController;

  beforeEach(inject(function (_$componentController_) {
    var $timeoutMock = function() {};
    var firebaseHelperMock = {getLastReading: function(a, b) {return { time: a + ' ' + b};}};
    recentDataController = _$componentController_('recentData', {'firebaseHelperService': firebaseHelperMock, '$timeout': $timeoutMock}, { rooms: roomsJson, categories: [] });
  }));

  it('should initialize the readings array', function() {
    recentDataController.$onInit();
    console.log(recentDataController);

    expect(recentDataController.readings).toEqual({ 'room1': {'time': 'room1 1'},
                                                    'room2': {'time': 'room2 1'}});
  });
});
