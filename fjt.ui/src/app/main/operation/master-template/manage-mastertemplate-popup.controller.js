(function () {
  'use strict';

  angular
    .module('app.admin.user')
    .controller('ManageMasterTemplateModalController', ManageMasterTemplateModalController);

  /** @ngInject */
  function ManageMasterTemplateModalController($state, $scope, $mdDialog, OPERATION, CORE, data, OperationFactory, DialogFactory, BaseService, $timeout) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.copyTemplate = data ? data.isCopy : false;
    vm.headerdata = [];
    let oldMasterTemplateCode = '';

    // Go to Operation Master Template List page.
    vm.goToOperationMasterTemplateList = () => {
      BaseService.goToOperationMasterTemplateList();
    };
    // Go to Manage Operation Master Template page.
    const goToManageOperationManagement = (masterTemplateID) => {
      BaseService.goToManageOperationManagement(masterTemplateID);
    };

    if (data && data.isCopy) {
      vm.fromMastertemplate = _.clone(data);
      vm.mastertemplate = {
        description: data.description
      };
      oldMasterTemplateCode = data.masterTemplate;
      const headerdataObj = {
        value: data.masterTemplate,
        label: 'Copy Template',
        displayOrder: 1,
        labelLinkFn: vm.goToOperationMasterTemplateList,
        valueLinkFn: goToManageOperationManagement,
        valueLinkFnParams: data.id
      };
      vm.headerdata.push(headerdataObj);
    } else {
      vm.mastertemplate = _.clone(data);
    }

    //save master template to database
    vm.save = (buttonCategory) => {
      vm.isSubmit = false;
      if (!vm.masterTemplatePopupForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      const masterTemplateInfo = {
        id: vm.mastertemplate.id,
        masterTemplate: vm.mastertemplate.masterTemplate,
        description: vm.mastertemplate.description,
        isMasterTemplate: false
      };
      if (vm.mastertemplate.id) {
        vm.cgBusyLoading = OperationFactory.mastertemplate().update({
          id: vm.mastertemplate.id
        }, masterTemplateInfo).$promise.then((mastertemplate) => {
          if (mastertemplate && mastertemplate.status !== CORE.ApiResponseTypeStatus.FAILED) {
            BaseService.currentPagePopupForm.pop();
            vm.saveAndProceed(buttonCategory, mastertemplate.data);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.cgBusyLoading = OperationFactory.mastertemplate().save(masterTemplateInfo).$promise.then((masterTemplate) => {
          if (masterTemplate && masterTemplate.status !== CORE.ApiResponseTypeStatus.FAILED) {
            BaseService.currentPagePopupForm.pop();
            vm.saveAndProceed(buttonCategory, masterTemplate.data);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Manage Add Operaion management Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.masterTemplatePopupForm.$setPristine();
        vm.mastertemplate.id = data.id;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.masterTemplatePopupForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.masterTemplatePopupForm.$setPristine();
            vm.mastertemplate = {};
            setFocus('masterTemplate');
          }, () => { // Empty Block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.masterTemplatePopupForm.$setPristine();
          vm.mastertemplate = {};
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        $mdDialog.hide(data);
      }
      setFocus('masterTemplate');
    };

    vm.cancel = () => {
      if (BaseService.checkFormDirty(vm.masterTemplatePopupForm)) {
        const data = {
          form: vm.masterTemplatePopupForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    //check for save or copy master tempalte
    vm.masterTemplate = (buttonCategory) => {
      //Used to focus on first error filed of form
      if (vm.masterTemplatePopupForm.$invalid) {
        BaseService.focusRequiredField(vm.masterTemplatePopupForm);
        return;
      }

      if (!vm.copyTemplate) {
        vm.save(buttonCategory);
      } else {
        vm.copyMasterTemplate();
      }
    };

    // copy and save operaion template to database.
    const copyOperationTemplate = () => {
      const masterTemplateInfo = {
        copyID: vm.fromMastertemplate.id,
        masterTemplate: vm.mastertemplate.masterTemplate,
        description: vm.mastertemplate.description,
        isMasterTemplate: false
      };
      vm.cgBusyLoading = OperationFactory.copyMasterTemplate().query({ objCopyMasterTemplate: masterTemplateInfo }).$promise.then((masterTemplate) => {
        if (masterTemplate && masterTemplate.status === CORE.ApiResponseTypeStatus.SUCCESS && masterTemplate.data && masterTemplate.data.id) {
          goToManageOperationManagement(masterTemplate.data.id);
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(masterTemplate.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Display Confirmation message when All Operations are in published mode.
    const showConfirmationPopup = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ALL_OPERATION_CONVERTINTOTEMPLATE);
      const model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };

      return DialogFactory.messageConfirmDialog(model).then(() => {
        copyOperationTemplate();
      }, () => { // Empty block
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // copy master template data into other details template
    vm.copyMasterTemplate = () => {
      vm.isSubmit = false;
      if (!vm.masterTemplatePopupForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      const checkForDraftOperationInfo = {
        copyID: vm.fromMastertemplate.id,
        isCheckForDraftOperation: true
      };
      vm.cgBusyLoading = OperationFactory.copyMasterTemplate().query({ objCopyMasterTemplate: checkForDraftOperationInfo }).$promise.then((masterTemplate) => {
        if (masterTemplate && masterTemplate.status === CORE.ApiResponseTypeStatus.SUCCESS && masterTemplate.data) {
          if (masterTemplate.data.isDraftOperations) {
            const data = {
              masterTemplateId: vm.fromMastertemplate.id
            };
            DialogFactory.dialogService(
              OPERATION.OPERATION_LIST_POPUP_CONTROLLER,
              OPERATION.OPERATION_LIST_POPUP_VIEW,
              null,
              data).then((data) => {
                if (data && data.isCopyMasterTemplate) {
                  copyOperationTemplate();
                } else if (data && data.isCloseFromNoDataFound) {
                  showConfirmationPopup();
                }
              }, () => {
              });
          }
          else {
            showConfirmationPopup();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* display standard code unique confirmation message */
    const displayMasterTemplateUniqueMessage = () => {
      oldMasterTemplateCode = '';
      vm.mastertemplate.masterTemplate = null;
      const masterTemplateEle = angular.element(document.querySelector('#masterTemplate'));

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, 'Template');

      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => masterTemplateEle.focus());
    };

    /* Check unique master template */
    vm.checkDublicateMasterTemplate = () => {
      if (vm.mastertemplate && vm.mastertemplate.masterTemplate && oldMasterTemplateCode !== vm.mastertemplate.masterTemplate) {
        vm.cgBusyLoading = OperationFactory.checkDublicateMasterTemplate().query({
          id: vm.mastertemplate.id,
          masterTemplate: vm.mastertemplate.masterTemplate
        }).$promise.then((res) => {
          vm.cgBusyLoading = false;
          oldMasterTemplateCode = angular.copy(vm.mastertemplate.masterTemplate);
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateMasterTemplate) {
            displayMasterTemplateUniqueMessage();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //Set as current form when page loaded
    angular.element(() => BaseService.currentPagePopupForm.push(vm.masterTemplatePopupForm));
  }
})();
