(function () {
    'use strict';

    angular
      .module('app.transaction.supplierInvoice')
      .controller('InvoiceDebitMemoController', InvoiceDebitMemoController);

    /** @ngInject */
    function InvoiceDebitMemoController($rootScope, $state, BaseService, DialogFactory, TRANSACTION, CORE) {
        let vm = this;
        vm.PackingSlipInvoiceTabName = TRANSACTION.PackingSlipInvoiceTabName;
    }
})();