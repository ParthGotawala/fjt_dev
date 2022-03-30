(function () {
  'use strict';

  angular
    .module('app.transaction.customerrefund')
    .controller('ValidatedCustRefundListForLockPopupController', ValidatedCustRefundListForLockPopupController);

  function ValidatedCustRefundListForLockPopupController($mdDialog, BaseService, data, TRANSACTION, CORE) {
    const vm = this;
    vm.popupParamData = data;
    vm.custRefundSubStatusIDDetConst = TRANSACTION.CustomerRefundSubStatusIDDet;
    vm.resonForInvalidateRefundRecords = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALIDATED_REASON_FOR_LOCK_CUST_REFUND.message;
    const NATypeText = 'Not Applicable';

    if (vm.popupParamData && vm.popupParamData.custRefundValidatedList && vm.popupParamData.custRefundValidatedList.length > 0) {
      _.each(vm.popupParamData.custRefundValidatedList, (refundItem) => {
        refundItem.lockedDetItemCount = refundItem.detItemCount === null ? NATypeText : ((refundItem.detItemCount || 0) - (refundItem.detItemNotLockedCount || 0));
        refundItem.isLockedAllowed = ((refundItem.detItemNotLockedCount || 0) > 0) || (refundItem.subStatus !== vm.custRefundSubStatusIDDetConst.Refunded.code) ? false : true;
        refundItem.lockedAllowedText = refundItem.isLockedAllowed ? 'Yes' : 'No';
        refundItem.subStatusClassName = BaseService.getCustRefundSubStatusClassName(refundItem.subStatus);
        refundItem.requiredSubStatusClassName = BaseService.getCustRefundSubStatusClassName(vm.custRefundSubStatusIDDetConst.Refunded.code);
        refundItem.detItemCount = refundItem.detItemCount === null ? NATypeText : refundItem.detItemCount;
        refundItem.detItemNotLockedCount = refundItem.detItemNotLockedCount === null ? NATypeText : refundItem.detItemNotLockedCount;
      });
      vm.popupParamData.isAnyAllowedToLockRecord = _.some(vm.popupParamData.custRefundValidatedList, (refundItem) => refundItem.isLockedAllowed);
    }

    /* continue to lock valid refund records */
    vm.lockValidCustRefundList = () => {
      const custRefundListForLock = {
        custRefundValidatedListToCont: vm.popupParamData.custRefundValidatedList
      };
      $mdDialog.hide(custRefundListForLock);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    /* go To Refund Detail page */
    vm.goToCustomerRefundDetail = (custRefundMstID) => {
      BaseService.goToCustomerRefundDetail(custRefundMstID);
    };
  }
})();
