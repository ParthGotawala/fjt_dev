(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderQuantityConfirmationApprovalPopupController', WorkorderQuantityConfirmationApprovalPopupController);

  /** @ngInject */
  function WorkorderQuantityConfirmationApprovalPopupController($mdDialog, data, CORE, BaseService) {
    const vm = this;
    vm.woInfo = data;
    const refTablename = CORE.AllEntityIDS.Workorder.Name;
    const ConfirmationType = data.confirmationType;
    vm.title = data.title;
    vm.woQtyApproval = {};

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.quantityConfirmationApprovalForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      }
      else {
        $mdDialog.cancel(null);
      }
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woInfo.woID);
      return false;
    };

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.woInfo.woNumber, displayOrder: 1,
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      },
      { label: CORE.LabelConstant.Workorder.Version, value: vm.woInfo.woVersion, displayOrder: 2 }
    ];

    vm.saveWOQtyConfirmApproval = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.quantityConfirmationApprovalForm)) {
        vm.saveDisable = false;
        return;
      }

      const autoRemark = data.autoRemark;
      const taskConfirmation = {
        confirmationType: ConfirmationType,
        signaturevalue: vm.woQtyApproval.signaturevalue,
        reason: vm.woQtyApproval.reason,
        autoRemark: autoRemark,
        refTablename: refTablename,
        refId: vm.woInfo.woID
      };

      $mdDialog.cancel(taskConfirmation);
      vm.saveDisable = true;
    };

    // to check form dirty
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

  }

})();
