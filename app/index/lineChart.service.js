'use strict';

angular.module('sensorReadingApp').
factory('lineChartService', function(dateFilter, firebaseHelperService, $q) {
  var defaultChartOptions = {
    chart: {
        type: 'lineChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 40,
            left: 55
        },
        interpolate: 'basis-open',
        x: function(entry){ return entry[0]; },
        y: function(entry){ return entry[1]; },
        useInteractiveGuideline: true,
        xAxis: {
            axisLabel: 'Time',
            tickFormat: function(d){
                return dateFilter(new Date(d * 1000), 'yyyy-MM-dd HH:mm');
            },
            axisLabelDistance: -10
        },
        yAxis: {
            axisLabel: 'Temperature (°C)',
            axisLabelDistance: -10
        },
    },
    title: {
        enable: true,
        text: 'Temperature'
    }
  };

  return {
    getChartOption: function(title, xAxisLabel, yAxisLabel) {
      return angular.merge ({}, defaultChartOptions, {
        'title': {'text': title},
        'chart': {
          'xAxis' : {'axisLabel': xAxisLabel},
          'yAxis' : {'axisLabel': yAxisLabel}
        }
      });
    },
    getChartData: function(rooms, typeOfData) {
      var deferred = $q.defer();
      var output = [];
      rooms.$loaded()
      .then(function(data){
        var limit = new Date() / 1000;
        limit -= 3600 * 24;
        var tempData = {};
        var promisesId = [];
        var promises = [];
        angular.forEach(data, function(room) {
          if (room.readings[typeOfData] === 0) {
            return;
          }
          promisesId.push(room.$id);
          promises.push(firebaseHelperService.getLastReading(room.$id, 96).$loaded());
          tempData[room.$id] = {key: room.$id, color: room.color, values: []};
        });

        $q.all(promises).then(function(valuesArray){
          for (var i = 0; i < valuesArray.length; i++) {
            var values = valuesArray [i];
            var roomId = promisesId[i];
            for (var j = 0; j < values.length; j++) {
              var reading = values [j];
              if (reading.time > limit) {
                var value = reading[typeOfData];
                tempData[roomId].values.push ([reading.time, value]);
              }
            }
            output.push(tempData[roomId]);
            // Freeup some watches as we don't want to autoupdate the graph
            values.$destroy();
          }
          deferred.resolve(output);
        });
      });
      return deferred.promise;
    }
    };
});
