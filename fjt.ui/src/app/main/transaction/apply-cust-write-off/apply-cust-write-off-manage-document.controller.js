(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('ApplyCustWriteOffToInvManageDocumentController', ApplyCustWriteOffToInvManageDocumentController);

  /** @ngInject */
  function ApplyCustWriteOffToInvManageDocumentController($state, CORE, BaseService, $scope, CustomerPaymentFactory, TRANSACTION) {
    const vm = this;
    vm.custPaymentMstID = parseInt($state.params.id);
    vm.entityName = CORE.AllEntityIDS.ApplyCustomerWriteOff.Name;
    vm.loginUser = BaseService.loginUser;

    // to get customer invoice payment master data
    const retrieveCustInvPaymentMstData = () => CustomerPaymentFactory.getCustInvPaymentMstData().query({
      customerPaymentMstID: vm.custPaymentMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Writeoff.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.custPaymentMstDet = resp.data.custPaymentMstData;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.paymentNumber = vm.custPaymentMstDet.paymentNumber;
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));
    retrieveCustInvPaymentMstData();

    // Assign Current Forms to service
    angular.element(() => {
      //BaseService.currentPageForms = [];
      if ($scope.$parent && $scope.$parent.vm) {
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.applyCustWriteOffManageTabIDsConst.Document;
      }
    });
  }
})();
