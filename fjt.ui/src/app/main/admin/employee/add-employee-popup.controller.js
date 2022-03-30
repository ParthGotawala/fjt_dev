(function () {
  'use strict';

  angular
    .module('app.admin.employee')
    .controller('AddEmployeePopupController', AddEmployeePopupController);

  /** @ngInject */
  function AddEmployeePopupController($mdDialog, data, CORE, Upload, USER, DialogFactory, EmployeeFactory, $filter, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isSubmit = false;
    vm.initData = data ? data : {};
    let GenericCategoryAllData = [];
    vm.EmailPattern = CORE.EmailPattern;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.initData.isCheckUnique = false;
    vm.initData.isUser = true;
    vm.initData.isActive = true;

    // update save object employeeInfo
    let updateSaveObj = (employeeInfo) => {
      let newObj = employeeInfo;
      let resultObj = _.pickBy(newObj, _.identity);
      return resultObj;
    }

    vm.pageInit = (data) => {
      vm.addEmployee = {
        id: data && data.id ? data.id : null,
        firstName: data && data.firstName ? data.firstName : data && data.Name ? data.Name : null,
        middleName: data && data.middleName ? data.middleName : null,
        lastName: data && data.lastName ? data.lastName : null,
        initialName: data && data.initialName ? (data.initialName).toUpperCase() : null,
        code: data && data.code ? (data.code).toUpperCase() : null,
        email: data && data.email ? data.email : ''
      };
    };
    vm.pageInit(vm.initData);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddEmployeeForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddEmployeeForm);
        if (isdirty) {
          const data = {
            form: vm.AddEmployeeForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit(data);
              vm.AddEmployeeForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddEmployeeForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocus('firstName');
    };


    /* Used to check blur functionality */
    let checkFieldName = '';
    let checkUniquefieldValue = '';

    /* create employee */
    vm.SaveEmployee = (isCheckUnique, buttonCategory) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.AddEmployeeForm)) {
        vm.saveDisable = false;
        if (vm.addEmployee.id && !vm.checkFormDirty(vm.assyTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }

      var EncriptedEmail = encryptAES(vm.addEmployee.email);
      vm.isSubmit = false;
      if (!vm.AddEmployeeForm.$valid) {
        vm.isSubmit = true;
        return;
      }
      if (vm.AddEmployeeForm.$dirty) {
        vm.addEmployee.visibleCode = vm.addEmployee.code.substr(vm.addEmployee.code.length - 4);
        vm.addEmployee.email = EncriptedEmail.toString() ? EncriptedEmail.toString() : '';
        vm.addEmployee.isCheckUnique = isCheckUnique ? isCheckUnique : false;
        vm.addEmployee.isUser = true;
        vm.addEmployee.isActive = true;
        vm.addEmployee = updateSaveObj(vm.addEmployee);

        vm.cgBusyLoading = Upload.upload({
          url: CORE.API_URL + USER.ADMIN_EMPLOYEE_PATH,
          data: vm.addEmployee,
        }).then((res) => {
          if (res.data && res.data.data) {
            if (res.data.data[0]) {
              if (res.data.data[0].id) {
                BaseService.currentPagePopupForm.pop();
                vm.saveAndProceed(buttonCategory, res.data.data[0]);
              }
            } else {
              var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, res.data.data.fieldName);
              let obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes)
                  vm.SaveEmployee(false, buttonCategory);
              }, (cancel) => {
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
            vm.saveDisable = false;
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.saveDisable = false;
        $mdDialog.cancel();
      }
    };

    // check emailid Already Exists
    vm.checkEmailIDAlreadyExists = (employeeDetailForm, checkUniquefield) => {
      let EncryptedEmail = vm.addEmployee.email ? encryptAES(vm.addEmployee.email) : null;
      if (checkUniquefield == 'email') {
        checkUniquefieldValue = EncryptedEmail ? EncryptedEmail.toString() : null;
        checkFieldName = checkUniquefield;
      } else if (checkUniquefield == 'code') {
        checkUniquefieldValue = vm.addEmployee.code;
        checkFieldName = checkUniquefield;
      }
      else if (checkUniquefield == 'initialName') {
        checkUniquefieldValue = vm.addEmployee.initialName;
        checkFieldName = checkUniquefield;
      }
      if (vm.addEmployee && checkUniquefieldValue) {
        let objs = {
          id: vm.addEmployee.id,
          checkUniquefieldValue: checkUniquefieldValue,
          checkFieldName: checkFieldName
        };
        vm.cgBusyLoading = EmployeeFactory.checkEmailIDAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res.status != "SUCCESS") {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                if (checkUniquefield == 'email') {
                  vm.addEmployee.email = '';
                  setFocus("emailPopUp");
                } else if (checkUniquefield == 'code') {
                  vm.addEmployee.code = '';
                  setFocus("codePopUp");
                }
                else if (checkUniquefield == 'initialName') {
                  vm.addEmployee.initialName = ''
                  setFocus("initialNamePopUp");
                }
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddEmployeeForm);
      if (isdirty) {
        let data = {
          form: vm.AddEmployeeForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddEmployeeForm);
    });
  }

})();
