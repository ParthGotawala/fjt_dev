
(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('ManageCustomerPackingSlipDocument', ManageCustomerPackingSlipDocument);

  /** @ngInject */
  function ManageCustomerPackingSlipDocument($state, CORE, CustomerPackingSlipFactory, BaseService, $scope) {
    // console.log("Employee controller");
    const vm = this;
    vm.customerPakingID = $state.params.id;
    vm.entityname = CORE.AllEntityIDS.Customer_PackingSlip.Name;
    vm.loginUser = BaseService.loginUser;
    vm.isDisableDocument = false;
    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: vm.customerPakingID, transType: 'P' }).$promise.then((res) => {
        if (res && res.data) {
          vm.customerslip = res.data;
          if (vm.customerslip.isLocked && !vm.loginUser.isUserSuperAdmin) {
            vm.isDisableDocument = true;
          } else if (vm.customerslip.isLocked && vm.loginUser.isUserSuperAdmin) {
            vm.isDisableDocument = false;
          } else if (!vm.customerslip.isLocked) {
            vm.isDisableDocument = false;
          }
          $scope.$emit('CustomerPackingAutocomplete');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCustomerPackingSlipDetail();
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 1;
    }
  }
})();
