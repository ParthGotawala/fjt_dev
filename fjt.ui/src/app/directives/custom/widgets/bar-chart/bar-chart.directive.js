(function () {
  'use strict';

  /* @ngInject */
  // eslint-disable-next-line prefer-arrow-callback
  angular.module('app.core').directive('barChart', function (WidgetFactory, BaseService, WIDGET) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/custom/widgets/bar-chart/bar-chart.html',
      scope: {
        chartTemplateId: '=',
        filter: '='
      },
      link: function (scope, $element) {
        var chart = null;
        // var yAxisVal = null;
        var xAxisValues = [];
        var drillDownRequestObject = [];
        var seriesList = [];
        var seriesPropList = [];
        var drilldownLevels = [];
        var isDrilldown = false;
        var title = '';
        var xAxisName = '';
        var yAxisName = '';

        scope.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;
        scope.isRenderTable = false;

        scope.$watch('chartTemplateId', (newVal) => {
          if (newVal) {
            xAxisValues = [];
            seriesList = [];
            seriesPropList = [];
            drilldownLevels = [];

            getChartData(newVal).then((data) => {
              if (data && data.chatTemplateMst) {
                title = data.chatTemplateMst.nameOfChart;
                xAxisName = data.chatTemplateMst.xAxisName;
                yAxisName = data.chatTemplateMst.yAxisName;

                //seriesPropList.push(data.chatTemplateMst.yAxisVal);
                seriesPropList.push({ displayName: data.chatTemplateMst.yAxisName, field: data.chatTemplateMst.yAxisVal });
                // yAxisVal = data.chatTemplateMst.yAxisVal;

                if (data.chatTemplateMst.compareVariables) {
                  data.chatTemplateMst.compareVariables = JSON.parse(data.chatTemplateMst.compareVariables);


                  //seriesPropList = _.uniq(seriesPropList, data.chatTemplateMst.compareVariables);
                  seriesPropList = data.chatTemplateMst.compareVariables;
                }

                if (data.chatTemplateMst.drilldown) {
                  const drilldownArr = data.chatTemplateMst.drilldown.split(',');
                  const drilldownList = _.uniq([data.chatTemplateMst.xAxisVal].concat(drilldownArr));
                  drilldownLevels = drilldownList.map((axis) => {
                    let matachedDbFieldItem = null;
                    matachedDbFieldItem = _.find(data.chatTemplateMst.chartRawdataCategory.chartRawdataCategoryFields, (dbFieldItem) => axis === dbFieldItem.field);
                    return {
                      name: axis,
                      value: null,
                      displayName: matachedDbFieldItem ? matachedDbFieldItem.displayName : axis
                    };
                  });
                  isDrilldown = true;
                }

                updateAxis(data.chatTemplateMst, data.chartData);
              }
            });
          }
        });

        function getChartData(newVal) {
          return WidgetFactory.getChartDetailsByChartTemplateID().save({ chartTemplateID: newVal, filter: scope.filter }).$promise.then((response) => {
            if (response && response.data) {
              return response.data;
            }
          }).catch(() => null);
        }

        function updateAxis(chatTemplateMst, chartData) {
          if (chartData.length === 0) {
            scope.isNoDataFound = true;
          } else {
            chartData.forEach((item) => {
              xAxisValues.push(item[chatTemplateMst.xAxisVal]);
              seriesPropList.forEach((prop) => {
                var seriesObj = getSeries(prop);

                seriesObj.data.push({
                  name: (item && chatTemplateMst.xAxisVal) ? item[chatTemplateMst.xAxisVal] : '',
                  y: (item && prop.field) ? item[prop.field] || 0 : 0,
                  drilldown: isDrilldown,
                  key: chatTemplateMst.xAxisVal
                });
              });
            });
            scope.isRenderTable = chatTemplateMst.isRenderTable;
            scope.headers = chatTemplateMst.chartRawdataCategory.chartRawdataCategoryFields;
            scope.headers.push({ displayName: chatTemplateMst.xAxisName, field: chatTemplateMst.xAxisVal });
            scope.seriesObj = chartData;// seriesObj;
            DrawChart();
          }
        }

        function getSeries(prop) {
          if (prop) {
            //var seriesObj = _.find(seriesList, function (item) { return item.axis == prop; });
            const seriesObj = _.find(seriesList, (item) => item.axis === prop.displayName);
            if (seriesObj) {
              return seriesObj;
            }
            else {
              const obj = {
                //name: prop == yAxisVal ? xAxisName : prop,
                //name: prop,
                //axis: prop,
                name: prop.field,
                axis: prop.displayName,
                data: []
              };
              seriesList.push(obj);
              return obj;
            }
          }
        }
        Highcharts.setOptions({
          lang: {
            drillUpText: '< Back to {series.axis}'
          }
        });
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
                  var model = null;
                  var currentAxis = this.options.xAxis[0].title.text;
                  //var drilldownLevel = _.find(drilldownLevels, function (item) { return item.name == currentAxis; });
                  var drilldownLevel = _.find(drilldownLevels, (item) => item.displayName === currentAxis);
                  if (drilldownLevel) {
                    drilldownLevel.value = null;

                    // get previous drill down level object to display data
                    const index = drilldownLevels.indexOf(drilldownLevel) - 1;

                    // set title to chart and x axis based on current drill down
                    if (index > 0) {
                      chart.setTitle({ text: e.seriesOptions.id });
                      const drillUpItemField = _.find(drilldownLevels, (item) => item.name === e.seriesOptions.name);
                      //chart.xAxis[0].setTitle({ text: e.seriesOptions.name });
                      if (drillUpItemField) {
                        chart.xAxis[0].setTitle({ text: drillUpItemField ? drillUpItemField.displayName : e.seriesOptions.name });
                      }

                      // ----------------- [S] - Update Model for refresh Data Table below Chart base on change criteria --------------------
                      const drillDownDet = drilldownLevels[index];
                      model = drillDownRequestObject.find((item) => item.displayName === drillDownDet.displayName);
                      if (model) {
                        const removeItemIdex = drillDownRequestObject.findIndex((item) => item.displayName === drillDownDet.displayName);
                        drillDownRequestObject.splice(removeItemIdex, removeItemIdex > -1 ? 1 : 0);
                        scope.drillModel = model;
                      } else {
                        scope.drillModel = scope.chartTemplateId;
                      }
                      // ----------------- [E] - Update Model for refresh Data Table below Chart base on change criteria --------------------
                    }
                    else {
                      chart.setTitle({ text: title });
                      chart.xAxis[0].setTitle({ text: xAxisName });
                      scope.drillModel = scope.chartTemplateId;
                    }
                  }
                }
              }
            },
            title: {
              text: title
            },
            exporting: {
              enabled: true,
              menuItemDefinitions: {
                printChart: {
                  onclick: function () {
                    const chartDiv = $element.find('.chart-container')[0];
                    if (chartDiv) {
                      const newTab = window.open();
                      const dataTableDiv = $element.find('.cm-chart-table')[0];
                      let innerHTMLContain = chartDiv.innerHTML;
                      innerHTMLContain += dataTableDiv ? dataTableDiv.innerHTML : '';
                      newTab.document.write(innerHTMLContain);
                      newTab.focus();
                      newTab.print();
                      newTab.document.close();
                    }
                  }
                }
              }
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
              type: 'category',
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
                var tooltip = `<span style="font-size:10px">${this.points[0].key}</span><br/><table>`;
                //var len = this.points.length;
                $.each(this.points, function () {
                  tooltip += `<tr><td style="color:${this.series.color};padding:0">${this.series.userOptions.axis}: </td>` +
                    `<td style="padding:0"><b>${this.y}</b></td></tr>`;
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
                }
              }
            }
          });
        };

        function updateChartFromDrilldown(e, chart) {
          if (!e.seriesOptions) {
            const currentAxis = e.point.key;

            const drilldownLevel = _.find(drilldownLevels, (item) => item.name === currentAxis);
            if (drilldownLevel) {
              drilldownLevel.value = e.point.name;
              const index = drilldownLevels.indexOf(drilldownLevel) + 1;
              if (index !== 0) {
                const drilldownAxis = drilldownLevels[index];
                if (drilldownAxis) {
                  let axis = [];

                  drilldownLevels.forEach((item) => {
                    if (item.value) {
                      axis.push(item);
                    }
                  });

                  if (scope.filter) {
                    axis = axis.concat(scope.filter);
                  }

                  const model = {
                    yAxisVal: e.point.series.userOptions.name,
                    chartTemplateID: scope.chartTemplateId,
                    axis: axis,
                    drilldownAxis: drilldownAxis.name,
                    yAxisName: e.point.series.userOptions.axis,
                    displayName: drilldownAxis.displayName                                    // For manage Table Data Level on DrillUp Event
                  };

                  scope.cgBusyLoading = WidgetFactory.getChartDrilldownDetails().save(model).$promise.then((response) => {
                    if (response && response.data) {
                      const isDrilldown = drilldownLevels[index + 1] ? true : false;
                      const series = {
                        id: e.point.name,
                        //name: drilldownAxis.name,
                        //axis: model.yAxisVal,
                        name: model.yAxisVal,
                        axis: model.yAxisName,
                        data: response.data.map((item) => (
                          {
                            name: item[drilldownAxis.name],
                            y: item[model.yAxisVal] || 0,
                            drilldown: isDrilldown,
                            key: drilldownAxis.name
                          }
                        ))
                      };
                      drillDownRequestObject.push(model);
                      scope.seriesObj = response.data;

                      chart.setTitle({ text: e.point.name });
                      //chart.xAxis[0].setTitle({ text: drilldownAxis.name });
                      chart.xAxis[0].setTitle({ text: drilldownAxis.displayName });
                      scope.drillModel = null;

                      if (e.point.name) {
                        chart.addSeriesAsDrilldown(e.point, series);
                      }
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
    };
  });
})();
