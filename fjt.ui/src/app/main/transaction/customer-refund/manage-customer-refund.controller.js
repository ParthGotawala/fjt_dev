(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('ManageCustomerRefundController', ManageCustomerRefundController);

  /** @ngInject */
  function ManageCustomerRefundController($scope, $stateParams, BaseService, $mdDialog) {
    const vm = this;
    vm.custRefundMstID = parseInt($stateParams.id);

    /* save customer refund details */
    vm.saveCustomerRefund = () => {
      $scope.manageCustomerRefundDet();
    };

    /* void customer refund */
    vm.voidPaymentAndReleaseInvoiceGroup = () => {
      $scope.voidCustRefundAndReleaseInvoiceGroup();
    };

    /* change customer refund sub status */
    vm.changeCustRefundSubStatus = (newRefundSubStatus) => {
      $scope.manageCustRefundSubStatus(newRefundSubStatus);
    };

    //close pop up on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, {
        closeAll: true
      });
    });

    // Assign Current Forms to service
    angular.element(() => {
      BaseService.currentPageForms = [vm.customerRefundForm];
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.customerRefundForm = vm.customerRefundForm;
        $scope.$parent.vm.saveCustomerRefund = vm.saveCustomerRefund;
        $scope.$parent.vm.voidPaymentAndReleaseInvoiceGroup = vm.voidPaymentAndReleaseInvoiceGroup;
        $scope.$parent.vm.changeCustRefundSubStatus = vm.changeCustRefundSubStatus;
        // when click on browser back button then need to set active tab otherwise tab not change
        $scope.$parent.vm.activeTab = $scope.$parent.vm.customerRefundTabIDs.CustomerRefund;
      }
    });
  }
})();
