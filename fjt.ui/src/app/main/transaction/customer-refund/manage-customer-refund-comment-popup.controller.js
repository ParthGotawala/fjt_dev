(function () {
  'use restrict';

  angular.module('app.transaction.customerrefund')
    .controller('ManageCustomerRefundCommentPopupController', ManageCustomerRefundCommentPopupController);

  /* @ngInject */
  function ManageCustomerRefundCommentPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, TRANSACTION) {
    var vm = this;
    vm.payCMReason = angular.copy(data);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.custRefundNotesConst = TRANSACTION.CustomerRefundNotes;

    vm.pageInit = (data) => {
      vm.custPayModel = {
        paymentMstID: data && data.paymentMstID ? data.paymentMstID : null,
        comment: data && data.comment ? data.comment : data && data.comment ? data.comment : null,
        isPaymentVoided: data.isPaymentVoided
      };
    };
    vm.pageInit(data);
    vm.cancel = () => {
      const isdirty = vm.commentForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.commentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel(false);
      }
    };
    vm.save = () => {
      if (BaseService.focusRequiredField(vm.commentForm)) {
        return;
      }
      const isdirty = vm.commentForm.$dirty;
      if (isdirty) {
        const data = {
          comment: vm.custPayModel.comment,
          isDirty: true
        };
        $mdDialog.cancel(data);
      } else {
        $mdDialog.cancel(data);
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  };
})();
