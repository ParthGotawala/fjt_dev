(function () {
    'use strict';

    /* @ngInject */
    angular.module('app.core').directive('dotPlotChart', function (WidgetFactory) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/custom/widgets/dot-plot-chart/dot-plot-chart.html',
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
                        xAxis.push([item.xAxis, item.yAxis]);
                    });

                    DrawChart();
                }

                function DrawChart() {

                    //chart = new Highcharts.chart({
                    //    chart: {
                    //        type: 'scatter',
                    //        zoomType: 'xy',
                    //        renderTo: $element.find('.chart-container')[0],
                    //    },
                    //    title: {
                    //        text: 'Height Versus Weight of 507 Individuals by Gender'
                    //    },
                    //    subtitle: {
                    //        text: title
                    //    },
                    //    exporting: {
                    //        enabled: false
                    //    },
                    //    credits: {
                    //        enabled: false
                    //    },
                    //    xAxis: {
                    //        title: {
                    //            enabled: true,
                    //            text: xAxisName
                    //        },
                    //        startOnTick: true,
                    //        endOnTick: true,
                    //        showLastLabel: true
                    //    },
                    //    yAxis: {
                    //        title: {
                    //            text: yAxisName
                    //        }
                    //    },
                    //    legend: {
                    //        layout: 'vertical',
                    //        align: 'left',
                    //        verticalAlign: 'top',
                    //        x: 100,
                    //        y: 70,
                    //        floating: true,
                    //        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                    //        borderWidth: 1
                    //    },
                    //    plotOptions: {
                    //        scatter: {
                    //            marker: {
                    //                radius: 5,
                    //                states: {
                    //                    hover: {
                    //                        enabled: true,
                    //                        lineColor: 'rgb(100,100,100)'
                    //                    }
                    //                }
                    //            },
                    //            states: {
                    //                hover: {
                    //                    marker: {
                    //                        enabled: false
                    //                    }
                    //                }
                    //            },
                    //            tooltip: {
                    //                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    //                pointFormat: '<tr><td style="color:{series.color};padding:0">' + yAxisName + ': </td>' +
                    //                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    //                footerFormat: '</table>',
                    //                shared: true,
                    //                useHTML: true
                    //            }
                    //        }
                    //    },
                    //    series: [{
                    //        name: yAxisName,
                    //        color: 'rgba(223, 83, 83, .5)',
                    //        data: xAxis
                    //    }]
                    //});
                };
            }
        }
    });
})();
