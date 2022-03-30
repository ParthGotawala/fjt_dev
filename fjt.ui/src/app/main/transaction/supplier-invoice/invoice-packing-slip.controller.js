(function () {
    'use strict';

    angular
      .module('app.transaction.supplierInvoice')
      .controller('InvoicePackingSlipController', InvoicePackingSlipController);

    /** @ngInject */
    function InvoicePackingSlipController($rootScope, $state, BaseService, DialogFactory, TRANSACTION, CORE) {
        let vm = this;
        vm.PackingSlipInvoiceTabName = TRANSACTION.PackingSlipInvoiceTabName;
    }
})();