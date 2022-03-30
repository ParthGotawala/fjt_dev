(function () {
  'use strict';

  angular
    .module('app.configuration.entity')
    .controller('ManageEntityPopupController', ManageEntityPopupController);

  /** @ngInject */
  function ManageEntityPopupController($mdDialog, CORE, data, BaseService, EntityFactory, DialogFactory) {
    const vm = this;
    const loginUserDetails = BaseService.loginUser;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.employeeListForAllowedToAccessCustomForm = [];
    vm.manageentity = {};
    vm.manageentity = data ? angular.copy(data) : null;
    let oldEntityName = '';
    vm.isSaveDisable = false;
    vm.headerdata = (vm.manageentity && vm.manageentity.entityStatusText) ? [{ label: 'Status', value: vm.manageentity.entityStatusText, displayOrder: 1 }] : null;
    /* create employee */
    vm.saveEntity = (buttonCategory) => {
      //Used to focus on first error filed of form
      vm.isSaveDisable = true;
      if (BaseService.focusRequiredField(vm.ManageEntityForm)) {
        vm.isSaveDisable = false;
        if (vm.manageentity.entityID && !vm.checkFormDirty(vm.customer_contactpersonForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(vm.manageentity.entityID);
        }
        return;
      }
      if (!vm.ManageEntityForm.$valid) {
        BaseService.focusRequiredField(vm.ManageEntityForm);
        vm.isSaveDisable = false;
        return;
      }

      const entityInfo = {
        entityName: vm.manageentity.entityName,
        remark: vm.manageentity.remark,
        systemGenerated: vm.manageentity.systemGenerated ? vm.manageentity.systemGenerated : false  /* because only custom form can be updated */
      };
      //if (vm.ManageEntityForm.$dirty) {
      if (vm.manageentity && vm.manageentity.entityID) {
        vm.cgBusyLoading = EntityFactory.entity().update({
          id: vm.manageentity.entityID,
          systemGenerated: entityInfo.systemGenerated
        }, entityInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            vm.saveAndProceed(buttonCategory, res.data);
          } else {
            vm.isSaveDisable = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        entityInfo.entityStatus = vm.manageentity.systemGenerated ? null : CORE.DisplayStatus.Draft.ID;
        entityInfo.columnView = 100;  // flex to display field in 25,33,50,100 view
        entityInfo.employeeListForAccessCustomForm = [];
        entityInfo.employeeListForAccessCustomForm.push(loginUserDetails.employee.id); /* dafault rights for created user */

        vm.cgBusyLoading = EntityFactory.entity().save(entityInfo).$promise.then((res) => {
          if (res.data) {
            vm.saveAndProceed(buttonCategory, res.data);
          }
          else {
            if (res.errors && res.errors) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  vm.isSaveDisable = false;
                  setFocusByName('entityName');
                });
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.isSaveDisable = false;
    };

    /* Manage Add Category Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.ManageEntityForm.$setPristine();
        vm.manageentity.entityID = data.entityID;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.ManageEntityForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.ManageEntityForm.$setPristine();
            vm.manageentity = {};
            setFocus('id_entityName');
          }, () => { // Empty Block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.ManageEntityForm.$setPristine();
          vm.manageentity = {};
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(data.entityID);
      }
      setFocus('id_entityName');
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.ManageEntityForm);
      if (isdirty || vm.checkDirty) {
        const data = {
          form: vm.ManageEntityForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Function call on entity name blue event and check entity name exist or not and ask for confirmation
    vm.checkDuplicateEntityName = () => {
      let messageContent;
      if (vm.manageentity && vm.manageentity.entityName && oldEntityName !== vm.manageentity.entityName) {
        vm.cgBusyLoading = EntityFactory.checkDuplicateEntityName().save({
          entityID: vm.manageentity.entityID,
          entityName: vm.manageentity.entityName
        }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateEntityName) {
            oldEntityName = '';
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ENTITY_NAME_EXISTS);
            if (res.errors.data.systemGenerated === true) {
              messageContent.message = stringFormat(messageContent.message, vm.manageentity.entityName, 'data tracking entity');
            } else {
              messageContent.message = stringFormat(messageContent.message, vm.manageentity.entityName, 'custom form');
            }
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            vm.manageentity.entityName = null;
            DialogFactory.messageAlertDialog(obj).then(() => {
              setFocusByName('entityName');
            });
          }
        }).catch((error) => {
          oldEntityName = null;
          return BaseService.getErrorLog(error);
        });
        oldEntityName = angular.copy(vm.manageentity.entityName);
      }
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //Set as current form when page loaded
    angular.element(() => BaseService.currentPagePopupForm.push(vm.ManageEntityForm));
  }
})();
