(function () {
    'use strict';

    angular
      .module('app.transaction.supplierInvoice')
      .controller('InvoiceCreditMemoController', InvoiceCreditMemoController);

    /** @ngInject */
    function InvoiceCreditMemoController($rootScope, $state, BaseService, DialogFactory, TRANSACTION, CORE) {
        let vm = this;
        vm.PackingSlipInvoiceTabName = TRANSACTION.PackingSlipInvoiceTabName;
    }
})();