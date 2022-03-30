(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('BurdenPaymentController', BurdenPaymentController);

  /** @ngInject */
  function BurdenPaymentController($mdDialog, CORE, data, BOMFactory, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.paymentMode = CORE.PaymentMode;
    vm.saveBtnDisableFlag = false;
    vm.employeeDetails = data || {};
    vm.employeeModel = {
      isFromMaster: false,
      isChangeDetail: false,
      paymentMode: vm.paymentMode.Exempt
    };

    // get max length validations
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.headerdata = [];

    vm.continue = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.burdenPaymentForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      const employeeDetail = {
        ids: vm.employeeDetails.ids,
        isFromMaster: vm.employeeModel.isFromMaster,
        paymentMode: vm.employeeModel.paymentMode,
        burdenRate: vm.employeeModel.burdenRate
      };
      vm.cgBusyLoading = BOMFactory.updatePaymentBurdanDetails().query(employeeDetail).$promise.then(() => {
        vm.saveBtnDisableFlag = false;
        vm.burdenPaymentForm.$setUntouched();
        vm.burdenPaymentForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.hide();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = vm.burdenPaymentForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.burdenPaymentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel(true);
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.burdenPaymentForm];
    });
  }
})();
