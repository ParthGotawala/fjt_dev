(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('ManageCustomerRefundDocumentController', ManageCustomerRefundDocumentController);

  /** @ngInject */
  function ManageCustomerRefundDocumentController($state, CORE, BaseService, $scope, CustomerRefundFactory, TRANSACTION) {
    const vm = this;
    vm.custRefundMstID = parseInt($state.params.id);
    vm.entityName = CORE.AllEntityIDS.CustomerRefund.Name;
    vm.loginUser = BaseService.loginUser;

    const retrieveCustRefundMstData = () => CustomerRefundFactory.getCustRefundMstData().query({
      custRefundMstID: vm.custRefundMstID,
      refPaymentMode: TRANSACTION.ReceivableRefPaymentMode.Refund.code
    }).$promise.then((resp) => {
      if (resp && resp.data && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
        vm.custRefundMstDet = resp.data.custRefundMstData;
        vm.custRefundMstDet.totalRefundAmount = resp.data.custRefundMstData.paymentAmount;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.paymentNumber = vm.custRefundMstDet.paymentNumber;
        }
      }
    }).catch((error) => BaseService.getErrorLog(error));
    retrieveCustRefundMstData();

        // Assign Current Forms to service
    angular.element(() => {
      //BaseService.currentPageForms = [];
      if ($scope.$parent && $scope.$parent.vm) {
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.customerRefundTabIDs.Document;
      }
    });
  }
})();
