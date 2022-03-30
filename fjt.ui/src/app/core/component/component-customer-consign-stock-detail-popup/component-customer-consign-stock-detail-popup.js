(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentCustomerConsignStockDetailPopUpController', ComponentCustomerConsignStockDetailPopUpController);

  /** @ngInject */
  function ComponentCustomerConsignStockDetailPopUpController($mdDialog, data, BaseService, CORE) {
    const vm = this;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    vm.customerConsignmentStockList = data && data.customerConsignmentStockList ? data.customerConsignmentStockList : [];
    vm.stockUOMDetail = data && data.stockUOMDetail ? data.stockUOMDetail : [];

    vm.goToCustomerDetail = (item) => {
      if (item) {
        BaseService.goToCustomer(item.customerID);
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
