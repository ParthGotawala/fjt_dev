(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('AddFolderPopupController', AddFolderPopupController);

  /** @ngInject */
  function AddFolderPopupController($mdDialog, $q, data, CORE, GenericFolderFactory, $filter, BaseService, DialogFactory) {
    const vm = this;
    vm.folderModel = data;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    /*Used to check form dirty*/
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };

    /*Used to save record*/
    vm.saveFolder = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.folderForm, false)) {
        vm.saveDisable = false;
        return;
      }

      if (vm.folderModel.gencFolderName) {
        GenericFolderFactory.createFolder().save(vm.folderModel).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.data);
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    }

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    /*Used to close pop-up*/
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.folderForm);
      if (isdirty) {
        let data = {
          form: vm.folderForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };
    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.folderForm);
    });
  }
})();
