(function () {
  'use strict';
  angular
    .module('app.admin.componentLogicalGroup')
    .controller('ManageComponentLogicalGroupPopupController', ManageComponentLogicalGroupPopupController);
  /** @ngInject */
  function ManageComponentLogicalGroupPopupController($mdDialog, ComponentLogicalGroupFactory, data, CORE, BaseService, DialogFactory) {
    const vm = this;
    //vm.logicalgroup = {
    //  isActive: true
    //};
    vm.logicalgroup = angular.copy(data) || {isActive:true};
    vm.copyActive = angular.copy(vm.logicalgroup.isActive);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    //vm.logicalgroup.isActive = true;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    }
    const logicalgroupTemplate = {
      id: null,
      name: null,
      isActive: true
    };
    vm.cleardefectList = () => {
      vm.logicalgroup = Object.assign({}, logicalgroupTemplate);
    };
    if (!vm.logicalgroup)
      vm.cleardefectList();
    /*Used to Save record*/
    vm.save = () => {
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.componetlogicalgroupForm)) {
        return;
      }
      if (!vm.componetlogicalgroupForm.$valid) {
        // Used to focus on first error filed of form
        BaseService.focusRequiredField(vm.componetlogicalgroupForm);
        vm.isSubmit = true;
        return;
      }
      if (vm.logicalgroup.id && vm.copyActive != vm.logicalgroup.isActive) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Active' : 'Inactive', vm.logicalgroup.isActive ? 'Active' : 'Inactive');
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveLogicalGroup();
          }
        }, () => {
          // empty
        });
      } else { saveLogicalGroup(); } 

    };
    //save logical group
    let saveLogicalGroup = () => {
      let logicalgroupInfo = {
        id: vm.logicalgroup.id ? vm.logicalgroup.id : undefined,
        name: vm.logicalgroup.name ? vm.logicalgroup.name : '',
        isActive: vm.logicalgroup.isActive ? vm.logicalgroup.isActive : false,
      }
      if (vm.logicalgroup && vm.logicalgroup.id) {
        vm.cgBusyLoading = ComponentLogicalGroupFactory.updateComponentLogicalGroup().save(
          { id: vm.logicalgroup.id, }, logicalgroupInfo).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(vm.logicalgroup.id);
            } else {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.componetlogicalgroupForm);
                });
              }
            }            
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
      }
      else {
        vm.cgBusyLoading = ComponentLogicalGroupFactory.createComponentLogicalGroup().save(logicalgroupInfo).$promise.then((response) => {
          if (response && response.data) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(response.data);
          } else {
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.componetlogicalgroupForm);
              });
            }
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }
    }
    /*Used to close pop-up*/
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.componetlogicalgroupForm);
      if (isdirty) {
        let data = {
          form: vm.componetlogicalgroupForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //on load submit form 
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.componetlogicalgroupForm);
    });
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //check Mounting Group Already Exists
    vm.checkMountingGroupAlreadyExists = () => {
      if (vm.logicalgroup && vm.logicalgroup.name) {
        let objs = {
          name: vm.logicalgroup.name,
          id: vm.logicalgroup.id
        };
        vm.cgBusyLoading = ComponentLogicalGroupFactory.checkMountingGroupAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          if (res && res.errors) {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('Name');
              });
            }
            vm.logicalgroup.name = null;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

  };
})();
