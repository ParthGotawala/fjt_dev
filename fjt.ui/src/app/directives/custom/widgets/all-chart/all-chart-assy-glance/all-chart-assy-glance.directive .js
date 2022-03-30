(function () {
    'use strict';

    /* @ngInject */
    angular.module('app.core').directive('allChartAssyGlance', function (WidgetFactory, BaseService, WIDGET) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/custom/widgets/all-chart/all-chart-assy-glance/all-chart-assy-glance.html',
            scope: {
                chartDataList: '=',
            },
            link: function (scope, $element, attrs) {
                var chart = null;
                var yAxisVal = null;
                var xAxisValues = [];
                var seriesList = [];
                var seriesPropList = [];
                var seriesNamePropList = [];
                var drilldownLevels = [];
                var isDrilldown = false;
                var chartType = null;
                scope.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;

                var title = '';
                var xAxisName = '';
                var yAxisName = '';

                scope.$watch('chartDataList', function (newVal, oldVal) {
                    if (newVal) {
                        xAxisValues = [];
                        seriesList = [];
                        seriesPropList = [];
                        seriesNamePropList = [];
                        drilldownLevels = [];
                        chartType = newVal.chartType;
                        //  getChartData(newVal).then(function (data) {
                        // if (newVal) {
                        title = newVal.chartSetting.title;
                        xAxisName = newVal.chartSetting.xAxisName;
                        yAxisName = newVal.chartSetting.yAxisName;

                        seriesPropList.push(newVal.chartSetting.yAxisVal);
                        seriesNamePropList.push(newVal.chartSetting.yAxisName);
                        yAxisVal = newVal.chartSetting.yAxisVal;
                        if (newVal.chartSetting.seriesdata) {
                            seriesPropList = _.uniq(seriesPropList.concat(newVal.chartSetting.seriesdata.split(',')));
                        }
                        if (newVal.chartSetting.seriesdata) {
                            seriesNamePropList = _.uniq(seriesNamePropList.concat(newVal.chartSetting.seriesTitle.split(',')));
                        }
                        updateAxis(newVal.chartSetting, newVal.chartData);
                        //}
                        // });
                    }
                });

                function getChartData(newVal) {
                    return newVal;
                }

                function updateAxis(chatSetting, chartData) {
                    if (chartData.length == 0) {
                        scope.isNoDataFound = true;
                    } else {
                        chartData.forEach(function (item) {
                            xAxisValues.push(item[chatSetting.xAxisVal]);
                            seriesPropList.forEach(function (prop) {
                                var seriestitleObj = _.find(seriesNamePropList, (x, i) => {
                                    if (seriesPropList.indexOf(prop) == i) {
                                        return x;
                                    }
                                })

                                var seriesObj = getSeries(prop, seriestitleObj);

                                seriesObj.data.push({
                                  name: item[chatSetting.xAxisVal] || "Unknown",
                                    y: item[prop] || 0,
                                    drilldown: false,
                                    key: chatSetting.xAxisVal
                                });
                            });
                        });
                        DrawChart();
                    }
                }

                function getSeries(prop,seriesName) {
                    var seriesObj = _.find(seriesList, function (item) { return item.axis == seriesName; });
                    if (seriesObj)
                        return seriesObj;
                    else {
                        var obj = {
                            //name: prop == yAxisVal ? xAxisName : prop,
                            name: prop,
                            axis: seriesName,
                            data: []
                        };
                        seriesList.push(obj);
                        return obj;
                    }
                }

                function DrawChart() {
                    chart = new Highcharts.chart({
                        chart: {
                            type: 'column',
                            renderTo: $element.find('.chart-container')[0],
                            height: $element.hasClass('traveler-card') ? 300 : null,
                            events: {
                                drilldown: function (e) {
                                    updateChartFromDrilldown(e, this);
                                },
                                drillup: function (e) {

                                    var currentAxis = this.options.xAxis[0].title.text;
                                    var drilldownLevel = _.find(drilldownLevels, function (item) { return item.name == currentAxis; });
                                    if (drilldownLevel) {
                                        drilldownLevel.value = null;
                                        var index = drilldownLevels.indexOf(drilldownLevel) - 1;
                                        if (index > 0) {
                                            chart.setTitle({ text: e.seriesOptions.id });
                                            chart.xAxis[0].setTitle({ text: e.seriesOptions.name });
                                        }
                                        else {
                                            chart.setTitle({ text: title });
                                            chart.xAxis[0].setTitle({ text: xAxisName });
                                        }
                                    }
                                }
                            }
                        },
                        title: {
                            text: title
                        },
                        exporting: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            labelFormatter: function () {
                                return this.userOptions.axis;
                            }
                        },
                        xAxis: {
                            type: "category",
                            crosshair: true,
                            labels: {
                                rotation: -45
                            },
                            title: {
                                text: xAxisName
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: yAxisName
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                var tooltip = '<span style="font-size:10px">' + this.points[0].key + '</span><br/><table>';
                                //var len = this.points.length;
                                $.each(this.points, function () {
                                    tooltip += '<tr><td style="color:' + this.series.color + ';padding:0">' + this.series.userOptions.axis + ': </td>' +
                                                    '<td style="padding:0"><b>' + this.y + '</b></td></tr>'
                                });

                                return tooltip += '</table>';
                            },
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: seriesList,
                        drilldown: {
                            series: [],
                            drillUpButton: {
                                relativeTo: 'spacingBox',
                                position: {
                                    y: -10,
                                    x: 0,
                                    align: 'left'
                                },
                            }
                        }
                    });
                };

                function updateChartFromDrilldown(e, chart) {

                    if (!e.seriesOptions) {
                        var currentAxis = e.point.key;

                        var drilldownLevel = _.find(drilldownLevels, function (item) { return item.name == currentAxis; });
                        if (drilldownLevel) {
                            drilldownLevel.value = e.point.name;
                            var index = drilldownLevels.indexOf(drilldownLevel) + 1;
                            if (index != 0) {
                                var drilldownAxis = drilldownLevels[index];
                                if (drilldownAxis) {
                                    var axis = [];

                                    drilldownLevels.forEach((item) => {
                                        if (item.value)
                                            axis.push(item);
                                    });

                                    if (scope.filter)
                                        axis = axis.concat(scope.filter);

                                    var model = {
                                        yAxisVal: e.point.series.userOptions.axis,
                                        chartTemplateID: scope.chartTemplateId,
                                        axis: axis,
                                        drilldownAxis: drilldownAxis.name
                                    };

                                    scope.cgBusyLoading = WidgetFactory.getChartDrilldownDetails().save(model).$promise.then((response) => {
                                        if (response && response.data) {
                                            var isDrilldown = drilldownLevels[index + 1] != null;
                                            var series = {
                                                id: e.point.name,
                                                name: drilldownAxis.name,
                                                axis: model.yAxisVal,
                                                data: response.data.map(function (item) {
                                                    return {
                                                        name: item[drilldownAxis.name],
                                                        y: item[model.yAxisVal] || 0,
                                                        drilldown: isDrilldown,
                                                        key: drilldownAxis.name
                                                    }
                                                })
                                            };

                                            chart.setTitle({ text: e.point.name });
                                            chart.xAxis[0].setTitle({ text: drilldownAxis.name });

                                            if (e.point.name)
                                                chart.addSeriesAsDrilldown(e.point, series);
                                            //chart.addSingleSeriesAsDrilldown(e.point, series);
                                            //chart.applyDrilldown();
                                        }
                                    }).catch((error) => {
                                        BaseService.getErrorLog(error);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    });
})();
