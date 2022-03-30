(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('passwordPopupController', passwordPopupController);

  /** @ngInject */
  function passwordPopupController(data, CORE, USER, TRANSACTION, DialogFactory, BaseService, MasterFactory, ManufacturerFactory, $mdDialog) {

    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    var isValidate = data ? data.isValidate : false;

    var loginUser = BaseService.loginUser;
    let defaultRoleDetails = _.find(loginUser.roles, { id: loginUser.defaultLoginRoleID });
    vm.accessLevelDetail = {};
    function getAccessLavel() {
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
    getAccessLavel();

    vm.isSaveBtnClick = false;
    vm.save = () => {
      // console.log(vm.isSaveBtnClick);
      if (vm.isSaveBtnClick || vm.passwordProtectedForm.$invalid) {
        BaseService.focusRequiredField(vm.passwordProtectedForm);
        return;
      }
      var encryptedPassword = encryptAES(vm.password);
      if (vm.accessLevelDetail.allowAccess) {
        vm.isSaveBtnClick = true;
        if (isValidate) {
          vm.cgBusyLoading = MasterFactory.validatePassword().save({
            password: encryptedPassword.toString(),
            accessLevel: defaultRoleDetails.accessLevel
          }).$promise.then((response) => {
            if (response && response.data) {
              if (vm.isSaveBtnClick) {
                DialogFactory.hideDialogPopup(true);
              }
            } else {
              if (checkResponseHasCallBackFunctionPromise(response)) {
                response.alretCallbackFn.then(() => {
                  vm.password = "";
                  setFocusByName('password');
                });
              }
            }
            vm.isSaveBtnClick = false;
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        }
        else {
          if (vm.isSaveBtnClick) {
            DialogFactory.hideDialogPopup(encryptedPassword.toString());
          }
          vm.isSaveBtnClick = false;
        }
      } else {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.UNAUTHORIZE_USER);
        let obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      }
    }

    vm.cancel = () => {
      //DialogFactory.closeDialogPopup(vm.password);
      $mdDialog.cancel();
    };

    /**Used to validate max size*/
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    vm.checkFormDirty = (form, columnName) => {
      let result = BaseService.checkFormDirty(form, columnName);
      return result;
    }
  }
})();
