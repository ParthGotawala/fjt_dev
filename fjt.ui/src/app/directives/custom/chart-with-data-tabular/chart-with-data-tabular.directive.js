(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('chartWithDataTabular', chartWithDataTabular);

  /** @ngInject */
  function chartWithDataTabular(WidgetFactory, BaseService, CORE) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        headers: '=?',
        data: '=?',
        drillModel: '=',
        chartTemplateId: '=?',
        isRenderTable: '=?'
      },
      templateUrl: 'app/directives/custom/chart-with-data-tabular/chart-with-data-tabular.html',
      link: function ($scope) {
        $scope.headersList = [];
        $scope.columnAligmentList = {};
        $scope.headersData = $scope.headers;
        $scope.tabularData = $scope.data;

        $scope.$watch('isRenderTable', (renderValue) => {
          $scope.isRenderTable = renderValue;
        });

        $scope.$watch('headers', (headerData) => {
          $scope.headersData = Array.isArray(headerData) ? headerData : [];
        });
        $scope.$watch('data', (newChartData) => {
          updateData(newChartData);
        });

        $scope.colAlignment = (key) => {
          const fieldDet = $scope.headersData.find((a) => a.field === key);
          //if (typeof (fieldDet) === 'object') {
          //  return CORE.DATATYPE.STRING.indexOf(fieldDet.dataType) === -1 ? 'text-right' : 'text-left';
          //}
          //return 'text-right';
        };
        function updateData(newChartData) {
          const headersList = [];
          $scope.columnAligmentList = {};
          if (Array.isArray(newChartData) && newChartData.length > 0) {
            Object.keys(newChartData[0]).forEach((modelField) => {
              const headerDet = $scope.headersData.find((item) => item.field === modelField);
              if (headerDet) {
                $scope.columnAligmentList[modelField] = { aligmentClass: (CORE.DATATYPE.NUMBER.indexOf(headerDet.dataType) !== -1 ? 'text-right' : 'text-left') };
                headersList.push(headerDet);
              }
            });
          }
          $scope.headersList = headersList;
          $scope.tabularData = Array.isArray(newChartData) ? newChartData : [];
        }

        $scope.$watch('drillModel', (updateModel) => {
          retriveDataOnDrillUp(updateModel);
        });

        // ------------------------- [S] Make API call on Drill UP for retrieve record For Render into Data Table -------------------
        function retriveDataOnDrillUp(model) {
          if (typeof (model) === 'object' && model !== null) {
            $scope.$parent.$parent.cgBusyLoading = WidgetFactory.getChartDrilldownDetails().save(model).$promise.then((response) => {
              if (response && response.data) {
                updateData(response.data);
              }
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
          else if (model) {
            $scope.$parent.$parent.cgBusyLoading = WidgetFactory.getChartDetailsByChartTemplateID().query({ chartTemplateID: $scope.chartTemplateId }).$promise.then((response) => {
              if (response && response.data) {
                updateData(response.data.chartData);// seriesObj
              }
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
        }
        // ------------------------- [E] Make API call on Drill UP for retrieve record For Render into Data Table -------------------
      }
    };
    return directive;
  }
})();
