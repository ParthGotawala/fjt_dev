(function () {
    'use strict';

    /* @ngInject */
    angular.module('app.core').directive('allChart', function (WidgetFactory, BaseService, WIDGET, $timeout) {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/custom/widgets/all-chart/all-chart.html',
            scope: {
                chartTemplateId: '=',
                filter: '='
            },
            link: function (scope, $element, attrs) {
                const vm = this;
                var chart = null;
                var yAxisVal = null;
                var xAxisValues = [];
                var seriesList = [];
                var seriesPropList = [];
                scope.drilldownLevels = [];
                var isDrilldown = false;
                var drilldownCharts = [];
                var newseries = [];
                var title = '';
                var xAxisName = '';
                var yAxisName = '';
                var chartType = '';
                scope.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;

                var drilldownTimeout = null;

                scope.$watch('chartTemplateId', function (newVal, oldVal) {
                    if (newVal) {
                        xAxisValues = [];
                        seriesList = [];
                        seriesPropList = [];
                        scope.drilldownLevels = [];

                        getChartData(newVal).then(function (data) {
                            if (data && data.chatTemplateMst) {
                                title = data.chatTemplateMst.nameOfChart;
                                xAxisName = data.chatTemplateMst.xAxisName;
                                yAxisName = data.chatTemplateMst.yAxisName;

                                //seriesPropList.push(data.chatTemplateMst.yAxisVal);
                                seriesPropList.push({ displayName: data.chatTemplateMst.yAxisName, field: data.chatTemplateMst.yAxisVal });
                                yAxisVal = data.chatTemplateMst.yAxisVal;

                                if (data.chatTemplateMst.compareVariables) {
                                    data.chatTemplateMst.compareVariables = JSON.parse(data.chatTemplateMst.compareVariables);
                                    seriesPropList = _.uniq(seriesPropList, data.chatTemplateMst.compareVariables);
                                    //seriesPropList = _.uniq(seriesPropList.concat(data.chatTemplateMst.compareVariables.split(',')));
                                }

                                if (data.chatTemplateMst.drilldown) {
                                    var drilldownArr = data.chatTemplateMst.drilldown.split(',');
                                    var drilldownList = _.uniq([data.chatTemplateMst.xAxisVal].concat(drilldownArr));
                                    scope.drilldownLevels = drilldownList.map((axis) => {
                                        let matachedDbFieldItem = null;
                                        matachedDbFieldItem = _.find(data.chatTemplateMst.chartRawdataCategory.chartRawdataCategoryFields, (dbFieldItem) => {
                                            return axis == dbFieldItem.field;
                                        });
                                        return {
                                            name: axis,
                                            value: null,
                                            displayName: matachedDbFieldItem ? matachedDbFieldItem.displayName : axis
                                        };
                                    });
                                    isDrilldown = true;
                                }
                                // wait till open pop up event
                                $timeout(() => {
                                    updateAxis(data.chatTemplateMst, data.chartData);
                                });
                            }
                        });
                    }
                });

                function getChartData(newVal) {
                    return WidgetFactory.getChartDetailsByChartTemplateID().save({ chartTemplateID: newVal, filter: scope.filter }).$promise.then((response) => {
                        if (response && response.data) {
                            chartType = response.data.chatTemplateMst.chartTypeID;
                            switch (chartType) {
                                case WIDGET.CHART_TYPE.BAR:
                                    chartType = WIDGET.CHART_NAME.BAR
                                    break;
                                case WIDGET.CHART_TYPE.LINE:
                                    chartType = WIDGET.CHART_NAME.LINE
                                    break;
                                case WIDGET.CHART_TYPE.PIE:
                                    chartType = WIDGET.CHART_NAME.PIE
                                    break;
                                case WIDGET.CHART_TYPE.PARETO:
                                    chartType = WIDGET.CHART_NAME.PARETO
                                    break;
                                case WIDGET.CHART_TYPE.DOTPLOT:
                                    chartType = WIDGET.CHART_NAME.DOTPLOT
                                    break;
                                case WIDGET.CHART_TYPE.DONUT:
                                    chartType = WIDGET.CHART_NAME.DONUT
                                    break;

                            }
                            return response.data;
                        }
                    }).catch((error) => {
                        return null;
                    });
                }

                function updateAxis(chatTemplateMst, chartData) {
                    if (chartData.length == 0) {
                        scope.isData = true;
                    } else {
                        chartData.forEach(function (item) {
                            xAxisValues.push(item[chatTemplateMst.xAxisVal]);

                            seriesPropList.forEach(function (prop) {
                                var seriesObj = getSeries(prop);

                                seriesObj.data.push({
                                    name: (item && chatTemplateMst.xAxisVal) ? item[chatTemplateMst.xAxisVal] : '',
                                    y: (item && prop.field) ? item[prop.field] || 0 : 0,
                                    drilldown: isDrilldown,
                                    key: chatTemplateMst.xAxisVal,
                                    marker: {
                                        symbol: 'circle'
                                    }
                                });
                            });
                        });

                        var chart = drawChart(title, seriesList, yAxisName, xAxisName, chartType, 0);
                    }

                }

                function getSeries(prop) {
                    if (prop) {
                        //var seriesObj = _.find(seriesList, function (item) { return item.axis == prop; });
                        var seriesObj = _.find(seriesList, function (item) { return item.axis == prop.displayName; });
                        if (seriesObj)
                            return seriesObj;
                        else {
                            var obj = {
                                //name: prop == yAxisVal ? xAxisName : prop,
                                name: prop.field || '',
                                axis: prop.displayName || '',
                                data: []
                            };
                            seriesList.push(obj);

                            if (chartType == WIDGET.CHART_NAME.PIE) {
                                var index = seriesList.indexOf(obj);
                                obj.dataLabels = {
                                    enabled: false
                                };
                                obj.events = {
                                    //Comment By SP there is no use of it Date 12/12/2019 this event create issue on render time if mouse is hover then its render n time 
                                    //mouseOver: function () {
                                    //    // display current series data labels only
                                    //    this.chart.series.forEach((x) => {
                                    //        x.update({
                                    //            dataLabels: {
                                    //                enabled: this == x
                                    //            }
                                    //        });
                                    //    });
                                    //}
                                };
                                obj.size = (index + 1) * 100;
                                obj.zIndex = 50 - index;

                            }
                            return obj;
                        }
                    }
                }

                function drawChart(charttitle, chartserieslist, chartyAxisName, chartxAxisName, charttype, index) {
                    return new Highcharts.chart({
                        chart: {
                            type: charttype,
                            renderTo: $element.find('.chart-container' + index)[0],
                            events: {
                                drilldown: function (e) {
                                    console.log("drilldown");
                                    if (!drilldownTimeout)
                                        drilldownTimeout = window.setTimeout(
                                            function () {
                                                updateChartFromDrilldown(e, this);
                                            });
                                },
                                drillupall: function (e) {
                                    console.log("drillupall");
                                }
                            }
                        },
                        title: {
                            text: charttitle
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
                                text: chartxAxisName
                            }
                        },
                        yAxis: {
                            title: {
                                text: chartyAxisName
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                if (charttype == WIDGET.CHART_NAME.PIE) {
                                    if (!this.point) return;
                                    //var len = chartserieslist.length;
                                    return '<span style="font-size:10px">' + this.point.name + '</span><br/><table>\
                                        <tr><td style="color:' + this.color + ';padding:0">' + this.series.userOptions.axis + ': </td>' +
                                            '<td style="padding:0"><b>' + this.y + '</b></td></tr></table>';

                                }
                                else {
                                    var tooltip = '<span style="font-size:10px">' + this.points[0].key + '</span><br/><table>';
                                    //var len = this.points.length;
                                    $.each(this.points, function () {
                                        tooltip += '<tr><td style="color:' + this.series.color + ';padding:0">' + this.series.userOptions.axis + ': </td>' +
                                                        '<td style="padding:0"><b>' + this.y + '</b></td></tr>'
                                    });

                                    return tooltip += '</table>';
                                }
                            },
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    radius: 4,
                                    lineColor: '#666666',
                                    lineWidth: 1
                                }
                            }
                        },
                        series: chartserieslist,
                        drilldown: {
                            series: [],

                        }
                    });

                };

                function updateChartFromDrilldown(e, chart) {
                    if (!e.seriesOptions) {
                        var currentAxis = e.point.key;

                        var drilldownLevel = _.find(scope.drilldownLevels, function (item) { return item.name == currentAxis; });
                        if (drilldownLevel) {
                            drilldownLevel.value = e.point.name;
                            var index = scope.drilldownLevels.indexOf(drilldownLevel) + 1;
                            if (index != 0) {
                                var drilldownAxis = scope.drilldownLevels[index];
                                if (drilldownAxis) {
                                    var axis = [];
                                    for (var i = 0; i < index; i++) {
                                        if (scope.drilldownLevels[i].value)
                                            axis.push(scope.drilldownLevels[i]);
                                    }

                                    if (scope.filter)
                                        axis = axis.concat(scope.filter);

                                    //var model = {
                                    //    yAxisVal: e.point.series.userOptions.axis,
                                    //    chartTemplateID: scope.chartTemplateId,
                                    //    axis: axis,
                                    //    drilldownAxis: drilldownAxis.name
                                    //};
                                    var model = {
                                        yAxisVal: e.point.series.userOptions.name,
                                        chartTemplateID: scope.chartTemplateId,
                                        axis: axis,
                                        drilldownAxis: drilldownAxis.name,
                                        yAxisName: e.point.series.userOptions.axis
                                    };

                                    scope.$parent.vm.cgBusyLoading = WidgetFactory.getChartDrilldownDetails().save(model).$promise.then((response) => {
                                        if (response && response.data) {
                                            var isDrilldown = scope.drilldownLevels[index + 1] != null;
                                            var seriesli = [{
                                                id: e.point.name,
                                                name: model.yAxisVal,
                                                axis: model.yAxisName,
                                                color: e.point.color,
                                                data: response.data.map(function (item) {
                                                    return {
                                                        name: item[drilldownAxis.name],
                                                        y: item[model.yAxisVal] || 0,
                                                        drilldown: isDrilldown,
                                                        key: drilldownAxis.name,
                                                        marker: {
                                                            symbol: 'circle'
                                                        }
                                                    }
                                                })
                                            }];
                                            var indexs = [];
                                            for (var j = 0; j < drilldownCharts.length; j++) {
                                                if (drilldownCharts[j].id >= index) {
                                                    drilldownCharts[j].chart.destroy();
                                                    indexs.push(drilldownCharts[j]);
                                                }
                                            }
                                            var chart = drawChart(seriesli[0].id, seriesli, yAxisName, seriesli[0].name, chartType, index);
                                            chart.setTitle({ text: e.point.name });
                                            //chart.xAxis[0].setTitle({ text: drilldownAxis.name });
                                            chart.xAxis[0].setTitle({ text: drilldownAxis.displayName });

                                            indexs.forEach((item) => {
                                                if (item)
                                                    drilldownCharts.splice(drilldownCharts.indexOf(item), 1);
                                            });

                                            drilldownCharts.push({ id: index, chart: chart });

                                            var allchartelement = $(".all-chart-cont");
                                            allchartelement.scrollTop(allchartelement[0].scrollHeight);
                                            $timeout(() => {
                                                clearTimeout(drilldownTimeout);
                                                drilldownTimeout = null;
                                            });
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
