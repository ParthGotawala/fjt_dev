(function () {
  'use strict';

  angular.module('app.transaction.customerinvoice')
    .controller('CustomerInvoiceListSummaryController', CustomerInvoiceListSummaryController);

  /** @ngInject */
  function CustomerInvoiceListSummaryController(CORE, $scope) {
    // const vm = this;

    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        if ($scope.$parent.vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerInvoiceListTabIDs.SummaryList;
        } else {
          $scope.$parent.vm.activeTab = $scope.$parent.vm.CustomerCreditNoteListTabIDs.SummaryList;
        }
      }
    });
  }
})();
