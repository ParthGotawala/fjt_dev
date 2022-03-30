(function () {
    'use strict';

    /* @ngInject */
    angular.module('app.core').directive('donutChart', function (WidgetFactory) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/custom/widgets/donut-chart/donut-chart.html',
            scope: {
                chartTemplateId: '='
            },
            link: function (scope, $element, attrs) {
                var chart = null;
                var xAxis = [];
                var yAxis = [];
                var title = '';
                var xAxisName = '';
                var yAxisName = '';

                var chatTemplateMst = {};
                var chartData = {};

                //scope.$watch('chartTemplateId', function (newVal, oldVal) {
                //    if (newVal) {
                //        getChartData(newVal).then(function (data) {
                //            if (data) {
                                
                //                chatTemplateMst = data.chatTemplateMst;
                //                chartData = data.chartData;

                //                title = chatTemplateMst.nameOfChart;
                //                xAxisName = chatTemplateMst.xAxisName;
                //                yAxisName = chatTemplateMst.yAxisName;

                //                updateAxis(chartData);
                //            }
                //        });
                //    }
                //});

                function getChartData(newVal) {
                    return WidgetFactory.getChartDetailsByChartTemplateID().query({ chartTemplateID: newVal }).$promise.then((response) => {
                        if (response && response.data) {
                            return response.data;
                        }
                    }).catch((error) => {
                        return null;
                    });
                }

                function updateAxis(chartData) {
                    xAxis = [];
                    yAxis = [];

                    chartData.forEach(function (item) {
                        xAxis.push(item.xAxis);
                        yAxis.push(item.yAxis);
                    });

                    DrawChart();
                }

                function DrawChart() {
                    //var colors = Highcharts.getOptions().colors;
                    //var categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'];
                    //var data = [{
                    //    y: 56.33,
                    //    color: colors[0],
                    //    drilldown: {
                    //        name: 'MSIE versions',
                    //        categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0',
                    //            'MSIE 10.0', 'MSIE 11.0'],
                    //        data: [1.06, 0.5, 17.2, 8.11, 5.33, 24.13],
                    //        color: colors[0]
                    //    }
                    //}, {
                    //    y: 10.38,
                    //    color: colors[1],
                    //    drilldown: {
                    //        name: 'Firefox versions',
                    //        categories: ['Firefox v31', 'Firefox v32', 'Firefox v33',
                    //            'Firefox v35', 'Firefox v36', 'Firefox v37', 'Firefox v38'],
                    //        data: [0.33, 0.15, 0.22, 1.27, 2.76, 2.32, 2.31, 1.02],
                    //        color: colors[1]
                    //    }
                    //}];
                    //var browserData = [];
                    //var versionsData = [];
                    //var i;
                    //var j;
                    //var dataLen = data.length;
                    //var drillDataLen;
                    //var brightness;

                    //// Build the data arrays
                    //for (i = 0; i < dataLen; i += 1) {

                    //    // add browser data
                    //    browserData.push({
                    //        name: categories[i],
                    //        y: data[i].y,
                    //        color: data[i].color
                    //    });

                    //    // add version data
                    //    drillDataLen = data[i].drilldown.data.length;
                    //    for (j = 0; j < drillDataLen; j += 1) {
                    //        brightness = 0.2 - (j / drillDataLen) / 5;
                    //        versionsData.push({
                    //            name: data[i].drilldown.categories[j],
                    //            y: data[i].drilldown.data[j],
                    //            color: Highcharts.Color(data[i].color).brighten(brightness).get()
                    //        });
                    //    }
                    //}

                    //// Create the chart
                    //chart = new Highcharts.chart({
                    //    chart: {
                    //        type: 'pie',
                    //        renderTo: $element.find('.chart-container')[0],
                    //    },
                    //    title: {
                    //        text: title
                    //    },
                    //    yAxis: {
                    //        title: {
                    //            text: yAxisName
                    //        }
                    //    },
                    //    plotOptions: {
                    //        pie: {
                    //            shadow: false,
                    //            center: ['50%', '50%']
                    //        }
                    //    },
                    //    tooltip: {
                    //        valueSuffix: '%'
                    //    },
                    //    series: [{
                    //        name: 'Browsers',
                    //        data: browserData,
                    //        size: '60%',
                    //        dataLabels: {
                    //            formatter: function () {
                    //                return this.y > 5 ? this.point.name : null;
                    //            },
                    //            color: '#ffffff',
                    //            distance: -30
                    //        }
                    //    }, {
                    //        name: 'Versions',
                    //        data: versionsData,
                    //        size: '80%',
                    //        innerSize: '60%',
                    //        dataLabels: {
                    //            formatter: function () {
                    //                // display only if larger than 1
                    //                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                    //                    this.y + '%' : null;
                    //            }
                    //        },
                    //        id: 'versions'
                    //    }],
                    //    responsive: {
                    //        rules: [{
                    //            condition: {
                    //                maxWidth: 400
                    //            },
                    //            chartOptions: {
                    //                series: [{
                    //                    id: 'versions',
                    //                    dataLabels: {
                    //                        enabled: false
                    //                    }
                    //                }]
                    //            }
                    //        }]
                    //    }
                    //});
                };
            }
        }
    });
})();
