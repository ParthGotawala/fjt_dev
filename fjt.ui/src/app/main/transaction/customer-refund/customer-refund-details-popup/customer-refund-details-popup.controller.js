(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('CustomerRefundDetailsPopupController', CustomerRefundDetailsPopupController);

  function CustomerRefundDetailsPopupController($mdDialog, BaseService, data, $scope) {
    const vm = this;
    vm.popupParamData = angular.copy(data);

    /* save customer refund details */
    vm.saveCustomerRefund = () => {
      $scope.manageCustomerRefundDet();
    };

    /* to close popup. this method also called from directive externally   */
    vm.cancel = (isRefreshData) => {
      let isdirty = false;
      isdirty = checkFormDirty(vm.customerRefundPopupForm, null);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.customerRefundPopupForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.hide(isRefreshData);
      }
    };

    const checkFormDirty = (form) => {
      const checkDirty = BaseService.checkFormDirty(form);
      return checkDirty;
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.customerRefundPopupForm];
    });
  }
})();
