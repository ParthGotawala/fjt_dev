(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('RohsStatusMismatchConfirmationPopupController', RohsStatusMismatchConfirmationPopupController);

  /** @ngInject */
  function RohsStatusMismatchConfirmationPopupController($mdDialog,data, DialogFactory, CORE, BaseService, ManufacturerFactory, MasterFactory) {

    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.RohsStatusMismatch = CORE.RohsStatusMismatchConfirmationPopup;
    vm.rohsData = data;
    var loginUser = BaseService.loginUser;
    let defaultRoleDetails = _.find(loginUser.roles, { id: loginUser.defaultLoginRoleID });
    vm.accessLevelDetail = {};
    if (vm.rohsData.isUMID) {
      vm.displayNote = stringFormat(vm.RohsStatusMismatch.DisplayNoteUMID, vm.rohsData.PIDCode);
    } else {
      vm.displayNote = stringFormat(vm.RohsStatusMismatch.DisplayNoteKIT, vm.rohsData.PIDCode,vm.rohsData.UMID);
    }
    function getAccessLevel() {
      return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel
          vm.accessLevelDetail.allowAccess = false;
          if (defaultRoleDetails.accessLevel <= response.data.accessLevel) {
            vm.accessLevelDetail.allowAccess = true;
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getAccessLevel();

    vm.confirmRohsAllocation = () => {
      if (BaseService.focusRequiredField(vm.rohsMismatchForm)) {
        return;
      }
      var encryptedPassword = encryptAES(vm.RohsStatus.password);
      if (vm.accessLevelDetail.allowAccess) {
          vm.cgBusyLoading = MasterFactory.validatePassword().save({
            password: encryptedPassword.toString(),
            accessLevel: defaultRoleDetails.accessLevel
          }).$promise.then((response) => {
            if (response && response.data) {
              BaseService.currentPagePopupForm.pop();
              let kitAllocationObj = {
                loginUser: loginUser,
                reason:vm.RohsStatus.reason
              }
              $mdDialog.cancel(kitAllocationObj);
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });               
      } else {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.UNAUTHORIZE_USER);
        let obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      }
    };
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.rohsMismatchForm);
    });

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.rohsMismatchForm);
      if (isdirty) {
        let data = {
          form: vm.rohsMismatchForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
  }
})();
