(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('WorkorderHoldUnholdPopUpController', WorkorderHoldUnholdPopUpController);

  /** @ngInject */
  function WorkorderHoldUnholdPopUpController($filter, $q, $mdDialog, WORKORDER, data, USER, CORE, WorkorderFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.workorderStatus = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;

    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.workorderStatus.woID);
      return false;
    };

    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.workorderStatus.partID);
      return false;
    };

    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO,
        value: vm.workorderStatus.woNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.workorderStatus.assyName,
        displayOrder: 2,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.workorderStatus.rohsIcon,
          imgDetail: vm.workorderStatus.rohsName
        }
      }
    ];

    // hold work order
    vm.holdUnholdWorkorder = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.WorkorderHoldUnholdForm, false)) {
        vm.saveDisable = false;
        return;
      }

      vm.cgBusyLoading = WorkorderFactory.stopWorkorder().update({
        id: vm.workorderStatus.woID
      }, vm.workorderStatus, (res) => {
        if (res.data) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(res.data.holdWorkorderValue);        // Return Work Order Hold/UnHold detail model
        } else {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(res.errors);
        }
        vm.saveDisable = false;
      }, (error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    // cancel popup for reason
    vm.cancel = () => {
      // let isdirty = ;
      if (vm.checkFormDirty(vm.WorkorderHoldUnholdForm)) {
        const data = {
          form: vm.WorkorderHoldUnholdForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // check dirty form object while close
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.WorkorderHoldUnholdForm);
    });
  }
})();
