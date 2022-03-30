(function () {
  'use strict';
  angular
    .module('app.admin.assyType')
    .controller('ManageAssyTypePopupController', ManageAssyTypePopupController);
  /** @ngInject */
  function ManageAssyTypePopupController($mdDialog, $q, AssyTypeFactory, data, CORE, BaseService, $timeout, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.initData = data ? data : {};

    vm.pageInit = (data) => {
      vm.assyTypeModel = {
        id: data && data.id ? data.id : null,
        name: data && data.name ? data.name : data && data.Name ? data.Name : null,
        noOfSide: data && data.noOfSide ? data.noOfSide : null,
        isPCBRequire: data && data.isPCBRequire ? true : false,
        isActive: data && data.isActive !== undefined ? data.isActive : true
      };
    };
    vm.pageInit(vm.initData);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.assyTypeForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.assyTypeForm);
        if (isdirty) {
          const data = {
            form: vm.assyTypeForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.pageInit();
              vm.assyTypeForm.$setPristine();
              setFocus('name');
            }
          }, () => {
            setFocus('name');
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.assyTypeForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.data);
      }
      setFocus('name');
    };

    vm.save = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.assyTypeForm)) {
        if (vm.assyTypeModel.id && !vm.checkFormDirty(vm.assyTypeForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.hide(vm.data);
        }
        return;
      }
      if (vm.assyTypeForm.$invalid || !vm.assyTypeModel.name) {
        vm.clickCancel = false;
        BaseService.focusRequiredField(vm.assyTypeForm);
        return;
      }

      vm.isSubmit = false;
      if (!vm.assyTypeForm.$valid) {
        vm.clickCancel = false;
        vm.isSubmit = true;
        return;
      }
      vm.cgBusyLoading = AssyTypeFactory.saveAssyType().save(vm.assyTypeModel).$promise.then((response) => {
        if (response && response.data) {
          vm.saveAndProceed(buttonCategory, response.data);
        }
        if (response && response.status === CORE.ApiResponseTypeStatus.FAILED && response.errors.unique) {
          vm.assyTypeModel.name = null;
          $timeout(() => {
            vm.clickCancel = false;
          }, 300);
        }
      }).catch((error) => {
        vm.clickCancel = false;
        BaseService.getErrorLog(error);
      });
    };

    vm.checkUniqueAssyTypeName = (AssyType) => {
      $timeout(() => {
        if (!vm.clickCancel && AssyType) {
          const obj = {
            id: data ? data.id : null,
            name: AssyType
          };
          vm.cgBusyLoading = AssyTypeFactory.findSameAssyType().save(obj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors) {
              vm.assyTypeModel.name = null;
            }
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('name');
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, 200);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.assyTypeForm);
      if (isdirty) {
        const data = {
          form: vm.assyTypeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
        $timeout(() => {
          vm.clickCancel = false;
        }, 300);
      } else {
        $mdDialog.hide(true);
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.assyTypeForm];
      if (data && data.Name) {
        vm.assyTypeForm.$setDirty();
      }
    });
  }
})();
