'use strict';

angular.module('sensorReadingApp').
factory('lineChartService', function(dateFilter) {
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
    }
  };
});
