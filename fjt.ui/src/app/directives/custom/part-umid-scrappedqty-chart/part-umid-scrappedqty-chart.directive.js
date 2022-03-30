(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('partUmidScrappedqtyChart', partUmidScrappedqtyChart);

  /** @ngInject */
  function partUmidScrappedqtyChart(BaseService, WIDGET, $q, ComponentFactory, CORE) {
    var directive = {
      restrict: 'E',
      scope: {
        partId: '=?'
      },
      templateUrl: 'app/directives/custom/part-umid-scrappedqty-chart/part-umid-scrappedqty-chart.html',
      controller: partUmidScrappedqtyChartCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of Kit Scrapped Qty of Part
    *
    * @param
    */
    function partUmidScrappedqtyChartCtrl($scope, $element, $filter) {
      var vm = this;
      vm.EmptyMesssage = WIDGET.WIDGET_EMPTYSTATE.DETAIL;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

      vm.umidId = $scope.umidId || null;
      vm.partId = $scope.partId || null;
      vm.salesOrderId = $scope.salesOrderId || null;
      vm.isNoDataFound = true;

      const getComponentKitScrappedQtyList = () => {
        const chartSetting = {
          seriesTitle: "Scrapped Qty (%)",
          seriesdata: "perScrapQty",
          title: "Kit Scrapped Qty Report",
          xAxisName: "Kit#",
          xAxisVal: "kitNumber",
          yAxisName: "Scrapped Qty (%)",
          yAxisVal: "perScrapQty"
        };
        const listObj = {
          partId: vm.partId
        }
        vm.cgBusyLoading = ComponentFactory.getComponentKitScrappedQty().query(listObj).$promise.then((scrappedQty) => {
          var scrappedQtyData = scrappedQty.data;
          if (scrappedQtyData) {
            vm.chartData = [];
            var scrappedQtyList = _.sortBy(scrappedQtyData.partKitList, (o) => { return o.scrappedUnit; });

            _.each(scrappedQtyList, (item, key) => {
              vm.chartData.push({
                kitNumber: item.kitNumber,
                perScrapQty: item.perScrapQty
              });
            });
            if (scrappedQtyList.length > 0) {
              vm.isNoDataFound = false;
            }
            else {
              vm.isNoDataFound = true;
            }
            vm.chartTemplateList = { chartData: vm.chartData, chartSetting: chartSetting, chartType: WIDGET.CHART_NAME.PIE };
          }

        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* retrieve Kit scrapped qty list for part */
      getComponentKitScrappedQtyList();
    }
  }
})();
