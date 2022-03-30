(function () {
    'use strict';

    angular
      .module('app.transaction.supplierInvoice')
      .controller('InvoiceTariffController', InvoiceTariffController);

    /** @ngInject */
    function InvoiceTariffController($rootScope, $state, BaseService, DialogFactory, TRANSACTION, CORE) {
        let vm = this;
        vm.PackingSlipInvoiceTabName = TRANSACTION.PackingSlipInvoiceTabName;

        //$scope.$parent.vm.selectedNavItem = CORE.ReceivingMatirialTab.List.Name;
        //$scope.$parent.vm.currentState = $state.current.name;
    }
})();