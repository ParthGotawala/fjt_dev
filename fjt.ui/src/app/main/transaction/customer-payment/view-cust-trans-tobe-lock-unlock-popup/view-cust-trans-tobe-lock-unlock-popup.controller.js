(function () {
  'use strict';

  angular
    .module('app.transaction.customerpayment')
    .controller('ViewTransListToBeLockUnlockPopupController', ViewTransListToBeLockUnlockPopupController);

  /** @ngInject */
  function ViewTransListToBeLockUnlockPopupController($mdDialog, data, BaseService, TRANSACTION, CORE) {
    const vm = this;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.popupParamData = angular.copy(data);

    if (vm.popupParamData && vm.popupParamData.toBeLockUnlockInvCMPMTList && vm.popupParamData.toBeLockUnlockInvCMPMTList) {
      _.each(vm.popupParamData.toBeLockUnlockInvCMPMTList, (item) => {
        item.invCMPMTDate = BaseService.getUIFormatedDate(item.invCMPMTDate, vm.DefaultDateFormat);
      });
    }

    /* go to manage detail page based on type */
    vm.goToManageTransaction = (entityShortCode, tblMstID) => {
      if (entityShortCode === TRANSACTION.ReceivableRefPaymentMode.ReceivablePayment.code) {
        BaseService.goToCustomerPaymentDetail(tblMstID);
      } else if (entityShortCode === TRANSACTION.ReceivableRefPaymentMode.CreditMemoApplied.code) {
        // tblMstID : as refCustCreditMemoID bcoz we required CMMstID along with PMTTbleMstID
        BaseService.goToApplyCustCreditMemoToPayment(tblMstID, null);
      } else if (entityShortCode === TRANSACTION.ReceivableRefPaymentMode.Refund.code) {
        BaseService.goToCustomerRefundDetail(tblMstID);
      } else if (entityShortCode === TRANSACTION.ReceivableRefPaymentMode.Writeoff.code) {
        BaseService.goToApplyCustWriteOffToPayment(tblMstID);
      } else if (entityShortCode === CORE.TRANSACTION_TYPE.INVOICE) {
        BaseService.goToManageCustomerInvoice(tblMstID, null, null);
      } else if (entityShortCode === CORE.TRANSACTION_TYPE.CREDITNOTE) {
        BaseService.goToCustomerCreditMemoDetail(tblMstID, null);
      }
    };

    /* lock-unlock continue */
    vm.lockUnlockTransContinue = () => {
      $mdDialog.hide(true);
    };

    // close pop up
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
