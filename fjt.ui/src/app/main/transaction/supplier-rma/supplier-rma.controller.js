(function () {
  'use strict';

  angular.module('app.transaction.supplierRMA')
    .controller('SupplierRMAController', SupplierRMAController);

  /** @ngInject */
  function SupplierRMAController($state, TRANSACTION, BaseService) {
    const vm = this;

    vm.addSupplierRMA = () => {
      //$state.go(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: TRANSACTION.SupplierRMATab.SupplierRMA, id: null });
      BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: TRANSACTION.SupplierRMATab.SupplierRMA, id: null });
    };
  }
})();
