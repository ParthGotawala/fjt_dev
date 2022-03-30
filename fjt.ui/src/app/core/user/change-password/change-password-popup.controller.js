(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ChangePasswordPopupController', ChangePasswordPopupController);

  /** @ngInject */
  function ChangePasswordPopupController(DialogFactory, BaseService, $scope, data, CORE, $rootScope, USER, UserFactory, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.loginUser = BaseService.loginUser;
    vm.UserPasswordPattern = CORE.UserPasswordPattern;
    vm.isPasswordValid = false;
    // set theme class dynamically on each popup element as theme is not apply on popup if opened from popup
    vm.themeClass = CORE.THEME;
    vm.identityUserId = BaseService.loginUser.identityUserId;

    vm.employee = {
      passwordConfirmation: null,
      passwordOld: null,
      password: null
    };

    /*Used to check form dirty*/
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return !vm.checkDirty ? checkDirty : vm.checkDirty;
    };

    //save user password
    vm.save = () => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.changePasswordForm, false)) {
        vm.saveDisable = false;
        return;
      }
      if (vm.employee.passwordOld !== vm.employee.password) {
        vm.saveDisable = false;
        logoutConfirm();
      }
      else {
        vm.saveDisable = false;
        showPasswordNotValidPopup();
      }
    };

    function savePassword() {
      BaseService.setLoginUserChangeDetail(true);

      const employeeEncrypted = {
        userId: encryptAES(vm.identityUserId).toString(),
        NewPassword: encryptAES(vm.employee.password).toString(),
        ConfirmNewPassword: encryptAES(vm.employee.passwordConfirmation).toString(),
        OldPassword: encryptAES(vm.employee.passwordOld).toString()
      };
      UserFactory.updateUserPasswordViaIdentity(employeeEncrypted).then((result) => {
        if (result.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          const objReuest = { userid: BaseService.loginUser.userid };
          vm.cgBusyLoading = UserFactory.logOutUserFromAllDevices().query(objReuest).$promise.then((response) => {
            vm.saveDisable = false;
            if (response && response.data) {
              BaseService.currentPagePopupForm.pop();
              DialogFactory.closeDialogPopup(response.data);
            }
            else {
              BaseService.setLoginUserChangeDetail(false);
              vm.saveDisable = false;
            }
          }).catch((error) => {
            vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          BaseService.setLoginUserChangeDetail(false);
          vm.saveDisable = false;
        }
      });
    }

    //confirmation for logout from all devices
    function logoutConfirm() {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.CHANGE_PWD_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        vm.saveDisable = false;
        if (yes) {
          savePassword();
        }
      }, () => {
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    }
    function showPasswordNotValidPopup() {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
        textContent: CORE.MESSAGE_CONSTANT.OLD_NEW_PASSWORD_DIFFERENT,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        multiple: true
      };
      DialogFactory.alertDialog(obj).then(() => {
        setFocusByName('NewPassword');
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.validateUser = (field, pwd, ev) => {
      if (pwd) {
        $timeout(() => {
          validateUser(field, pwd, ev);
        }, 500);
      }
    };

    function validateUser(field, pwd, ev) {
      vm.isPasswordValid = true;
      const EncryptedEmployee = {
        userId: encryptAES(vm.identityUserId).toString(),
        password: encryptAES(pwd).toString()
      };
      if (pwd && !vm.clickCancel && pageVisible) {
        vm.cgBusyLoading = UserFactory.validatePassword(EncryptedEmployee).then((response) => {
          if (response && response.data && response.data.isMatchPassword) {
            field.$setValidity('wrongpassword', true);
            vm.isPasswordValid = true;
            setFocusByName('NewPassword');
          }
          else {
            field.$setValidity('wrongpassword', false);
            setFocusByName('OldPassword');
            vm.isPasswordValid = false;
            $timeout(() => {
              vm.changePasswordForm.$setPristine();
              vm.changePasswordForm.$setUntouched();
            }, 500);
          }

          //if (response && response.data) {
          //  field.$setValidity("wrongpassword", true);
          //  vm.isPasswordValid = true;
          //} else if (response && response.errors) {
          //  field.$setValidity("wrongpassword", false);
          //  vm.isPasswordValid = false;
          //  if (checkResponseHasCallBackFunctionPromise(response)) {
          //    response.alretCallbackFn.then(() => {
          //      setFocusByName('OldPassword');
          //    });
          //  }
          //}
          //else {
          //  field.$setValidity("wrongpassword", false);
          //  angular.element('#NewPassword').focus();
          //  vm.isPasswordValid = false;
          //  $timeout(function () {
          //    vm.changePasswordForm.$setPristine();
          //    vm.changePasswordForm.$setUntouched();
          //  }, 500);
          //}
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.changePasswordForm);
      if (isdirty) {
        const data = {
          form: vm.changePasswordForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        BaseService.setLoginUserChangeDetail(false);
        DialogFactory.closeDialogPopup();
      }
    };


    let pageVisible = true;
    function handleVisibilityChange() {
      if (document.hidden) {
        pageVisible = false;
      } else {
        pageVisible = true;
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    window.addEventListener('blur', (e) => {
      pageVisible = false;
    }, false);
    window.addEventListener('focus', (e) => {
      pageVisible = true;
    }, false);
    ////close popup on page destroy
    //$scope.$on('$destroy', function () {
    //    BaseService.setLoginUserChangeDetail(false);
    //});

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.changePasswordForm);
    });
  }
})();
