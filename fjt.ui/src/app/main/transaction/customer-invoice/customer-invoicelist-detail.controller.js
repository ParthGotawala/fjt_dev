(function () {
  'use strict';

  angular.module('app.transaction.customerinvoice')
    .controller('CustomerInvoiceListDetailController', CustomerInvoiceListSummaryController);

  /** @ngInject */
  function CustomerInvoiceListSummaryController($scope, CORE) {
    // const vm = this;
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        if ($scope.$parent.vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerInvoiceListTabIDs.DetailList;
        } else {
          $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerCreditNoteListTabIDs.DetailList;
        }
      }
    });
  }
})();
