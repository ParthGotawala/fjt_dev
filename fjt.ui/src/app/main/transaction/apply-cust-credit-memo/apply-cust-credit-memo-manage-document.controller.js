(function () {
  'use strict';

  angular
    .module('app.transaction.applycustomercreditmemo')
    .controller('ApplyCustCreditMemoToInvManageDocumentController', ApplyCustCreditMemoToInvManageDocumentController);

  /** @ngInject */
  function ApplyCustCreditMemoToInvManageDocumentController($state, CORE, BaseService, $scope, CustomerPackingSlipFactory, TRANSACTION) {
    const vm = this;
    vm.custCreditMemoMstID = isNaN(parseInt($state.params.ccmid)) ? null : parseInt($state.params.ccmid);
    vm.custPaymentMstID = isNaN(parseInt($state.params.pid)) ? null : parseInt($state.params.pid);
    vm.entityName = CORE.AllEntityIDS.ApplyCustomerCreditMemo.Name;
    vm.loginUser = BaseService.loginUser;
    vm.isCustPayLockedWithNotAccess = false;
    vm.CustPaymentLockStatusConst = TRANSACTION.CustomerPaymentLockStatus;

    // to get customer invoice payment master data
    const retrieveCustCreditMemoPaymentDet = () => CustomerPackingSlipFactory.getCreditMemoDetailForApplyInInvPayment().query({
      creditMemoTransType: CORE.TRANSACTION_TYPE.CREDITNOTE,
      custCreditMemoMstID: vm.custCreditMemoMstID,
      customerPaymentMstID: vm.custPaymentMstID || null
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS && resp.data.custCreditMemoMstData) {
        vm.custCreditMemoPayDet = resp.data.custCreditMemoMstData;
        vm.custPaymentMstID = vm.custCreditMemoPayDet ? vm.custCreditMemoPayDet.id : null;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.custCreditMemoPayDetParent.custPaymentMstID = vm.custPaymentMstID;
          $scope.$parent.vm.custCreditMemoPayDetParent.paymentNumber = vm.custCreditMemoPayDet.creditMemoNumber;
        }
        //if (vm.custCreditMemoPayDet.lockStatus === vm.CustPaymentLockStatusConst.Locked && !vm.loginUser.isUserSuperAdmin) {
        //  vm.isCustPayLockedWithNotAccess = true;
        //}
      }
    }).catch((error) => BaseService.getErrorLog(error));
    retrieveCustCreditMemoPaymentDet();

    // Assign Current Forms to service
    angular.element(() => {
      if ($scope.$parent && $scope.$parent.vm) {
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.applyCustCreditMemoManageTabIDsConst.Document;
      }
    });
  }
})();
