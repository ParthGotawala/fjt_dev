
(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('ManageCustomerInvoiceMISCController', ManageCustomerInvoiceMISCController);

  /** @ngInject */
  function ManageCustomerInvoiceMISCController($state, CORE, BaseService, DataElementTransactionValueFactory, $scope, CustomerPackingSlipFactory) {
    // console.log("Employee controller");
    const vm = this;
    vm.transType = $state.params.transType;
    vm.headerText = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? 'Customer Invoice' : 'Customer Credit Memo';
    vm.Entity = CORE.Entity;
    vm.customerInvoiceID = parseInt($state.params.id);
    vm.dataElementList = [];
    vm.entityID = 0;
    vm.fileList = {};
    vm.loginUser = BaseService.loginUser;
    //save other detail for customer packing
    vm.saveOtherDeatils = () => {
      if (BaseService.focusRequiredField(vm.customerInvoiceOtherDetail)) {
        return;
      }
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.customerInvoiceID,
        entityID: CORE.AllEntityIDS.Customer_Invoice.ID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        vm.customerInvoiceOtherDetail.$setPristine();
        vm.fileList = {};
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: vm.customerInvoiceID, transType: vm.transType }).$promise.then((res) => {
        if (res && res.data) {
          vm.customerinvoice = res.data;
          if (vm.customerinvoice.isLocked && !vm.loginUser.isUserSuperAdmin) {
            vm.isDisableInvDocEntry = true;
          } else if (vm.customerinvoice.isLocked && vm.loginUser.isUserSuperAdmin && vm.customerinvoice.status !== CORE.CUSTINVOICE_STATUS.DRAFT) {
            vm.isDisableInvDocEntry = true;
          } else if (!vm.customerinvoice.isLocked && vm.customerinvoice.status !== CORE.CUSTINVOICE_STATUS.DRAFT) {
            vm.isDisableInvDocEntry = true;
          }
          if (vm.customerinvoice.paymentStatus !== 'PE') {
            vm.isDisableInvDocEntry = true;
          }
          if (vm.customerinvoice.isLocked && vm.loginUser.isUserSuperAdmin && vm.customerinvoice.paymentStatus === 'PE' && vm.customerinvoice.status !== CORE.CUSTINVOICE_STATUS.PUBLISHED) {
            // This condition added on sprint-108 as need to  allow super admin to  do changes but payment should not be done and invoice not in"Invoiced" sub status.
            vm.isDisableInvDocEntry = false;
          }
          $scope.$emit('CustomerPackingAutocomplete');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCustomerPackingSlipDetail();
    //page load then it will add forms in page forms
    angular.element(() => {
      BaseService.currentPageForms = [vm.customerInvoiceOtherDetail];
      $scope.$parent.vm.frmCustomerInvoice = vm.customerInvoiceOtherDetail;
      $scope.$parent.vm.saveCustomerInvoice = vm.saveOtherDeatils;
    });
  }
})();
