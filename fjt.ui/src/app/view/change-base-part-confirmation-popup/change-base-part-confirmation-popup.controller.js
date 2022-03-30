(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('ChangeBasePartConfirmationPopupController', ChangeBasePartConfirmationPopupController);

  /** @ngInject */
  function ChangeBasePartConfirmationPopupController($mdDialog, data, CORE, BaseService) {
    const vm = this;
    vm.data = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    vm.partList = data.partList;
    vm.autoCompleteBasePart = {
      columnName: 'displayMPN',
      keyColumnName: 'componentID',
      keyColumnId: data && data.basePart && data.basePart.componentID ? data.basePart.componentID : null,
      inputName: 'Functional Category',
      placeholderName: 'Functional Category',
      isRequired: true,
      isAddnew: false,
      onSelectCallbackFn: function (item) {
        vm.confirmationChangePackagingBasePart = '';
        vm.copyPartSettingNote = '';
        if (item) {
          data.basePart = item;
          setMessageNote();
        };
      }
    };
    const setMessageNote = () => {
      vm.confirmationChangePackagingBasePart = '';
      vm.copyPartSettingNote = '';
      if (data) {
        const confirmationMessage = angular.copy(CORE.CONFIRMATION_CHANGE_PACKAGING_BASE_PART);
        const basePartHyperLink = BaseService.generateComponentRedirectURL(data.basePart.componentID, CORE.MFG_TYPE.MFG, true, data.basePart.mfgPN);
        const parentPartHyperLink = BaseService.generateComponentRedirectURL(data.parentDet.componentID, CORE.MFG_TYPE.MFG, true, data.parentDet.mfgPN);
        const copyNote = angular.copy(CORE.COPY_PART_SETTING_NOTE);
        vm.confirmationChangePackagingBasePart = stringFormat(confirmationMessage, basePartHyperLink, parentPartHyperLink, CORE.MESSAGE_CONSTANT.AUTO_COMPLETE_EDIT);
        vm.copyPartSettingNote = stringFormat(copyNote, basePartHyperLink);
      }
    };
    setMessageNote();
    vm.SaveDet = () => {
      if (vm.changePartForm.$invalid) {
        BaseService.focusRequiredField(vm.changePartForm);
        return;
      }
      const partDet = {
        componentID: vm.autoCompleteBasePart.keyColumnId
      };
      $mdDialog.hide(partDet);
    };
  }
})();
