(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentNicknameValidationDetailPopupController', ComponentNicknameValidationDetailPopupController);

  function ComponentNicknameValidationDetailPopupController($mdDialog, data, CORE, TRANSACTION, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.messageData = data;
    vm.mfgTypedata = data.mfgType === CORE.MFG_TYPE.DIST ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG;
    vm.messageContent = data && data.messageContent ? data.messageContent : {};
    vm.buttonsText = CORE.MESSAGE_CONSTANT.BUTTON_OK;

    //go to manage part number
    vm.goToAssyMaster = (partID) => {
      if (vm.mfgTypedata === CORE.MFG_TYPE.DIST) {
        BaseService.goToSupplierPartDetails(partID);
      }
      else {
          BaseService.goToComponentDetailTab(null, partID);
      }
      return false;
    };
    vm.cancel = (name) => {
      $mdDialog.cancel({ name: name, row: vm.selectedRow });
    };
  }
})();
