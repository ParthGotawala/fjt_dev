(function () {
  'use strict';

  angular.module('app.transaction.customerpacking')
    .controller('CustomerPackingSlipListSummaryController', CustomerPackingSlipListSummaryController);

  /** @ngInject */
  function CustomerPackingSlipListSummaryController($scope) {
    // const vm = this;
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerPackingSlipListTabIDs.SummaryList;
      }
    });
  }
})();
