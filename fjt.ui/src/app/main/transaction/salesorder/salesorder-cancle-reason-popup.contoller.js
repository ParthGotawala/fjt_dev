(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('SalesOrdersCancleReasonController', SalesOrdersCancleReasonController);

  /** @ngInject */
  function SalesOrdersCancleReasonController($mdDialog, CORE,data, SalesOrderFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.salesorderDet = {
      CancellationConfirmed: false
    };
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.title = data.title || vm.LabelConstant.SalesOrder.CancellationReason;
    vm.salesorderDet.cancleReason = data.cancleReason ? data.cancleReason : null;
    vm.data = data;

    vm.goToPurchaseOrderDetail = () => BaseService.goToPurchaseOrderDetail(data.poID);
    // go to purchase order list
    vm.goToPurchaseOrderList = () => BaseService.goToPurchaseOrderList();

    if (data.isPurchaseOrder) {
      vm.headerdata = [
        {
          label: CORE.LabelConstant.Purchase.PO,
          value: data.poNumber,
          displayOrder: 1,
          valueLinkFn: vm.goToPurchaseOrderDetail,
              labelLinkFn: vm.goToPurchaseOrderList,
              isCopy: true
        }];
    }

    vm.UpdateCancleReson = () => {
      if (BaseService.focusRequiredField(vm.CancleReasonForm)) {
        return;
      }
      if (data.isPurchaseOrder) {
        data.CancellationConfirmed = vm.salesorderDet.CancellationConfirmed;
        data.cancleReason = vm.salesorderDet.cancleReason;
        $mdDialog.hide(data);
      } else {
        if (data.completedStatus === CORE.SOWorkingStatus.Canceled) {
          savecancleReason();
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALESORDER_CANCEL_REASON_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              savecancleReason();
            }
          }, () => {
            // empty
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    function savecancleReason() {
      const cancleReasonObj = {
        id: data.salesOrderDetailId,
        refSalesOrderID: data.id,
        isCancle: true,
        cancleReason: vm.salesorderDet.cancleReason,
        completedStatus: data.completedStatus
      };
      vm.cgBusyLoading = SalesOrderFactory.salsorderCancleReason().query(cancleReasonObj).$promise.then((res) => {
        if (res && res.data) {
          $mdDialog.hide(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.cancel = () => {
      if (BaseService.checkFormDirty(vm.CancleReasonForm)) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
