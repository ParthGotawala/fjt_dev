
(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('ManageCustomerInvoicePackingSlipDocument', ManageCustomerInvoicePackingSlipDocument);

  /** @ngInject */
  function ManageCustomerInvoicePackingSlipDocument($state, CORE, CustomerPackingSlipFactory, BaseService, $scope) {
    const vm = this;
    vm.transType = $state.params.transType;
    vm.customerInvoiceID = $state.params.id;
    vm.loginUser = BaseService.loginUser;
    vm.isDisableDocument = false;
    // vm.customerInvoiceIsLocked = $scope.$parent.vm.packingSlipMainObj.isLocked;
    vm.entityname = CORE.AllEntityIDS.Customer_PackingSlip.Name;
    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: vm.customerInvoiceID, transType: vm.transType }).$promise.then((res) => {
        if (res && res.data) {
          vm.customerslip = res.data;
          vm.packingSlip = _.first(vm.customerslip.customerInvoiceDetLst);
          if (vm.packingSlip && vm.packingSlip.isLocked) {
            vm.isDisableDocument = true;
          } else {
            vm.isDisableDocument = false;
          }
        }
        $scope.$emit('CustomerPackingAutocomplete');
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCustomerPackingSlipDetail();
  }
})();
