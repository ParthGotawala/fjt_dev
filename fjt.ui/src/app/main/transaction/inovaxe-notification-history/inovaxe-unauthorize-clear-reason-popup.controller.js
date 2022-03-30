(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ClearRequestReasonController', ClearRequestReasonController);

  /** @ngInject */
  function ClearRequestReasonController($mdDialog, CORE,
    BaseService, data) {
    const vm = this;
    vm.unauthorize = {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.labelConstant = CORE.LabelConstant.TransferStock;
    //save clear reason
    vm.saveclearReason = () => {
      if (vm.ClearReasonForm.$invalid) {
        BaseService.focusRequiredField(vm.ClearReasonForm);
        return;
      }
      $mdDialog.cancel(vm.unauthorize);
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.ClearReasonForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.unauthorize.iscancel = true;
        $mdDialog.cancel(vm.unauthorize);
      }
    };
    //check dirty form
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    // go to warehouse list
    vm.goToWareHouseList = () => {
      BaseService.goToWHList();
    }
    // go to bin list page
    vm.goToBinList = () => {
      BaseService.goToBinList();
    }
    bindHeaderData();
    //bind popup header
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.labelConstant.Bin,
        value: data.slotName,
        displayOrder: 1,
        labelLinkFn: vm.goToBinList,
        valueLinkFn: null,
      },
        {
          label: vm.labelConstant.WH,
          value: data.warehouseName,
          displayOrder: 2,
          labelLinkFn: vm.goToWareHouseList,
          valueLinkFn: null,
        }
        );
    }
  }
})();
