(function () {
  'use strict';

  angular.module('app.core').controller('CommonUsernamePasswordConfirmationPopupController', CommonUsernamePasswordConfirmationPopupController);

  function CommonUsernamePasswordConfirmationPopupController($mdDialog, data, CORE, BaseService, ManufacturerFactory, MasterFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const loginUser = BaseService.loginUser;
    vm.popUpDetailData = data || {};
    vm.popUpDetailData.popUpHeaderName = vm.popUpDetailData.popUpHeaderName ? vm.popUpDetailData.popUpHeaderName : 'Confirmation';
    vm.popUpDetailData.reasonTextBoxLength = vm.popUpDetailData.reasonTextBoxLength ? vm.popUpDetailData.reasonTextBoxLength : 0;
    vm.popUpDetailData.CancelButton = vm.popUpDetailData.CancelButton ? vm.popUpDetailData.CancelButton : 'CANCEL';
    vm.popUpDetailData.ConfirmButton = vm.popUpDetailData.ConfirmButton ? vm.popUpDetailData.ConfirmButton : 'CONFIRM';
    vm.popUpConfirmationDetailModel = {};
    const accessLevelDetail = {};
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    const getAccessLavel = () => ManufacturerFactory.getAcessLeval().query({ access: vm.popUpDetailData.roleAccess }).$promise.then((response) => {
      if (response && response.data) {
        accessLevelDetail.accessRole = response.data.name;
        accessLevelDetail.accessLevel = response.data.accessLevel;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    if (vm.popUpDetailData.roleAccess) {
      getAccessLavel();
    } else {
      if (loginUser) {
        const currentRole = _.find(loginUser.roles, (data) => data.id === loginUser.defaultLoginRoleID);
        if (currentRole) {
          accessLevelDetail.accessRole = currentRole.name;
          accessLevelDetail.accessLevel = currentRole.accessLevel;
        }
      }
    }

    vm.takeConfirmation = () => {
      if (BaseService.focusRequiredField(vm.confirmationPopUpForm)) {
        return;
      }

      const encryptedusername = encryptAES(vm.popUpConfirmationDetailModel.username);
      const encryptedPassword = encryptAES(vm.popUpConfirmationDetailModel.password);
      const model = {
        username: encryptedusername.toString(),
        password: encryptedPassword.toString(),
        accessLevel: accessLevelDetail.accessLevel
      };
      vm.cgBusyLoading = MasterFactory.verifyUser().save(model).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPagePopupForm.pop();
          const responseObj = {
            reason: vm.popUpConfirmationDetailModel.reason
          };
          $mdDialog.cancel(responseObj);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.confirmationPopUpForm);
      if (isdirty) {
        const data = {
          form: vm.confirmationPopUpForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.confirmationPopUpForm);
    });
  }
})();
