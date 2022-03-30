(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('OperationHoldUnholdPopUpController', OperationHoldUnholdPopUpController);

  /** @ngInject */
  function OperationHoldUnholdPopUpController($filter, $q, $mdDialog, WORKORDER, data, USER, CORE, WorkorderOperationFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.operationStatus = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;

    /* hyperlink go for list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, vm.operationStatus.partID);
      return false;
    };
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };

    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.operationStatus.woID);
      return false;
    };

    vm.goToWorkorderOperationDetails = () => {
      BaseService.goToWorkorderOperationDetails(vm.operationStatus.woOPID);
      return false;
    };

    vm.goToOperationList = () => {
      BaseService.goToOperationList();
      return false;
    };

    vm.headerdata = [{
      value: vm.operationStatus.PIDCode,
      label: CORE.LabelConstant.Assembly.ID,
      displayOrder: 4,
      labelLinkFn: vm.goToPartList,
      valueLinkFn: vm.goToPartDetails,
      isCopy: true,
      imgParms: {
        imgPath: vm.operationStatus.rohsIcon,
        imgDetail: vm.operationStatus.rohsName
      }
    },
    {
      label: vm.LabelConstant.Workorder.WO,
      value: vm.operationStatus.woNumber,
      displayOrder: 1,
      labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails
    },
    {
      label: vm.LabelConstant.Operation.OP,
      value: stringFormat('({0}) {1}', vm.operationStatus.opNumber, vm.operationStatus.opName),
      displayOrder: 2,
      labelLinkFn: vm.goToOperationList,
      valueLinkFn: vm.goToWorkorderOperationDetails
    }
    ];



    // Halt Resume workorder operation
    vm.holdUnholdOperation = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.OperationHoldUnholdForm, false)) {
        vm.saveDisable = false;
        return;
      }

      vm.cgBusyLoading = WorkorderOperationFactory.stopWOOperation().update({
        id: vm.operationStatus.woOPID
      }, vm.operationStatus, (res) => {
        if (res.data) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(res.data.holdOperationValue);        // Return Work Order Operation Hold/UnHold detail model
        }
        vm.saveDisable = false;
      }, (error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }

    // cancel popup for reason
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.OperationHoldUnholdForm);
      if (isdirty) {
        let data = {
          form: vm.OperationHoldUnholdForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    // check dirty form object while close
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }


    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    /*Add form on load*/
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.OperationHoldUnholdForm);
    });
  }
})();
