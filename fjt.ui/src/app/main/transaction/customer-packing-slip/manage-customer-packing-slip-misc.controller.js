
(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('ManageCustomerPackingSlipMISCController', ManageCustomerPackingSlipMISCController);

  /** @ngInject */
  function ManageCustomerPackingSlipMISCController($state, CORE, BaseService, DataElementTransactionValueFactory, $scope, CustomerPackingSlipFactory) {
    // console.log("Employee controller");
    const vm = this;
    vm.Entity = CORE.Entity;
    vm.customerPakingID = parseInt($state.params.id);
    vm.dataElementList = [];
    vm.entityID = 0;
    vm.fileList = {};
    vm.loginUser = BaseService.loginUser;
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 2;
    }
    vm.isDisableMisc = false;
    //save other detail for customer packing
    vm.saveOtherDeatils = () => {
      if (BaseService.focusRequiredField(vm.customerPackingOtherDetail)) {
        return;
      }
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.customerPakingID,
        entityID: CORE.AllEntityIDS.Customer_PackingSlip.ID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.customerPackingOtherDetail.$setPristine();
        vm.fileList = {};
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: vm.customerPakingID, transType: 'P' }).$promise.then((res) => {
        if (res && res.data) {
          vm.customerslip = res.data;
          if (vm.customerslip.isLocked && !vm.loginUser.isUserSuperAdmin) {
            vm.isDisableMisc = true;
          } else if (vm.customerslip.isLocked && vm.loginUser.isUserSuperAdmin && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft) {
            vm.isDisableMisc = true;
          } else if (!vm.customerslip.isLocked && vm.customerslip.subStatus !== CORE.CustomerPackingSlipSubStatusID.Draft) {
            vm.isDisableMisc = true;
          }
          $scope.$parent.vm.refCustInvoiceID = vm.customerslip.refCustInvoiceID;
          $scope.$emit('CustomerPackingAutocomplete');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCustomerPackingSlipDetail();
    //page load then it will add forms in page forms
    angular.element(() => {
      BaseService.currentPageForms = [vm.customerPackingOtherDetail];
      $scope.$parent.vm.frmCustomerPackingSlip = vm.customerPackingOtherDetail;
      $scope.$parent.vm.saveCustomerPackingSlip = vm.saveOtherDeatils;
    });
  }
})();
