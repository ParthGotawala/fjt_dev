
(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('ManageCustomerInvoiceDocument', ManageCustomerInvoiceDocument);

  /** @ngInject */
  function ManageCustomerInvoiceDocument($state, CORE, CustomerPackingSlipFactory, BaseService, $scope) {
    const vm = this;
    vm.customerInvoiceID = $state.params.id;
    vm.transType = $state.params.transType;
    vm.entityname = CORE.AllEntityIDS.Customer_Invoice.Name;
    vm.isDisableInvEntry = false;
    vm.loginUser = BaseService.loginUser;
    vm.DefaultDateTimeFormat = _dateTimeFullTimeDisplayFormat;

    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: vm.customerInvoiceID, transType: vm.transType }).$promise.then((res) => {
        if (res && res.data) {
          vm.customerinvoice = res.data;
          vm.customerinvoice.lockedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.customerinvoice.lockedAt, vm.DefaultDateTimeFormat);
          const lockByName = vm.customerinvoice.lockEmployees && vm.customerinvoice.lockEmployees.employee ? vm.customerinvoice.lockEmployees.employee : null;
          $scope.$parent.vm.packingSlipMainObj.isLocked = $scope.$parent.vm.packingSlipMainObj.isLocked ? $scope.$parent.vm.packingSlipMainObj.isLocked : vm.customerinvoice.isLocked;
          $scope.$parent.vm.packingSlipMainObj.lockedAt = $scope.$parent.vm.packingSlipMainObj.lockedAt ? $scope.$parent.vm.packingSlipMainObj.lockedAt : vm.customerinvoice.lockedAt;
          $scope.$parent.vm.packingSlipMainObj.lockedBy = $scope.$parent.vm.packingSlipMainObj.lockedBy ? $scope.$parent.vm.packingSlipMainObj.lockedBy : (lockByName ? lockByName.initialName : null);
          if (vm.customerinvoice.isLocked && !vm.loginUser.isUserSuperAdmin) {
            vm.isDisableInvDocEntry = true;
          } else if (vm.customerinvoice.isLocked && vm.loginUser.isUserSuperAdmin) {
            vm.isDisableInvDocEntry = false;
          } else if (!vm.customerinvoice.isLocked) {
            vm.isDisableInvDocEntry = false;
          }
          $scope.$emit('CustomerPackingAutocomplete');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCustomerPackingSlipDetail();
  }
})();
