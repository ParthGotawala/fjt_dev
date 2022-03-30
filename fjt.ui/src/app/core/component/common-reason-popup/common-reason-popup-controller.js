(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CommonReasonPopupController', CommonReasonPopupController);

  /** @ngInject */
  function CommonReasonPopupController($mdDialog, CORE, data, BaseService, USER) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    const poDetail = data;
    vm.saveReason = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.ReasonForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      $mdDialog.cancel(vm.reason);
    };
    // cancel popup detail
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.ReasonForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // go to purchase order list page
    vm.goToPurchaseOrderList = () => {
      BaseService.goToPurchaseOrderList();
    };
    // go to manage purchase order
    vm.goToPurchaseOrder = () => {
      BaseService.goToPurchaseOrderDetail(poDetail.poID);
    };
    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
        BaseService.goToComponentDetailTab(null, poDetail.mfgPartID);
    };
    // bind header detail
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.PO,
        value: poDetail.poNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToPurchaseOrderList,
        valueLinkFn: vm.goToPurchaseOrder,
        isCopy: true
      });
      if (poDetail.soNumber) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.SO,
          value: poDetail.soNumber,
          displayOrder: 2
        });
      }
      if (poDetail.pidCode) {
        vm.headerdata.push({
          label: vm.LabelConstant.MFG.PID,
          value: poDetail.pidCode,
          displayOrder: 3,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartMaster,
          isCopy: true,
          isCopyAheadLabel: true,
          isAssy: poDetail.iscustom,
          imgParms: {
            imgPath: stringFormat('{0}{1}',vm.rohsImagePath, poDetail.rohsIcon),
            imgDetail: poDetail.rohsName
          },
          isCopyAheadOtherThanValue: true,
          copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
          copyAheadValue: poDetail.mfgPN
        });
      }
    }

    bindHeaderData();
  }
})();
