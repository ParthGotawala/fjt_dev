(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('PendingCustomerPackingSlipCreationPopupController', PendingCustomerPackingSlipCreationPopupController);

  /** @ngInject */
  function PendingCustomerPackingSlipCreationPopupController($mdDialog, data, $scope, CORE, BaseService) {
    const vm = this;
    vm.customerId = data && data.customerId ? data.customerId : null;
    vm.customerName = data && data.customerName ? data.customerName : null;
    vm.LabelConstant = CORE.LabelConstant;

    // close pop up
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    //go to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    //go to customer manage page
    vm.goToCustomerManage = () => {
      BaseService.goToCustomer(vm.customerId);
    };

    vm.headerData = [];
    if (vm.customerId) {
      vm.headerData.push({
        label: vm.LabelConstant.Customer.Customer,
        value: vm.customerName,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomerManage,
        valueLinkFnParams: null
      });
    }
    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
