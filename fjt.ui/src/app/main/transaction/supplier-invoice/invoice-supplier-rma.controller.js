(function () {
  'use strict';

  angular
    .module('app.transaction.supplierInvoice')
    .controller('InvoiceSupplierRMAController', InvoiceSupplierRMAController);

  /** @ngInject */
  function InvoiceSupplierRMAController(TRANSACTION) {
    const vm = this;
    vm.PackingSlipInvoiceTabName = TRANSACTION.PackingSlipInvoiceTabName;
  }
})();
