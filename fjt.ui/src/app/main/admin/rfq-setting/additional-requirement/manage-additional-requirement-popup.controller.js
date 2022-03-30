(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageAdditionalRequirementPopupController', ManageAdditionalRequirementPopupController);
  /** @ngInject */
  function ManageAdditionalRequirementPopupController($mdDialog, data, CORE, RFQSettingFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.TempleteUniqueMSG = CORE.RequitementTeUniqueMSG;
    vm.taToolbar = CORE.Toolbar;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.categoryArray = angular.copy(CORE.RequitementCategory);
    vm.categoryDisable = data ? data.isQuote || data.isAssy || false : false;
    vm.isNarrative = data ? data.isNarrative : false;
    vm.historyactionButtonName = `${CORE.PageName.requirement} History`;
    let oldName = '';
    let oldNameForHistory = data ? data.Name : null;
    vm.additionalRequirementModel = {
      name: data ? data.Name : null,
      description: null,
      category: data ? data.category : null,
      isActive: true
    };
    if (data && data.isQuote) {
      vm.additionalRequirementModel.category = vm.categoryArray[0].id;
    }
    if (data && data.isAssy) {
      vm.additionalRequirementModel.category = vm.categoryArray[1].id;
    }
    if (data && data.isNarrative) {
      vm.additionalRequirementModel.category = vm.categoryArray[2].id;
    }
    if (data && data.id) {
      vm.additionalRequirementModel.id = data.id;
    }
    if (vm.additionalRequirementModel.id) {
      vm.cgBusyLoading = RFQSettingFactory.retriveAdditionalRequirement().query({
        id: vm.additionalRequirementModel.id,
        category: vm.additionalRequirementModel.category
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.additionalRequirementModel.name = response.data.name;
          oldNameForHistory = angular.copy(response.data.name);
          vm.additionalRequirementModel.description = response.data.description;
          vm.additionalRequirementModel.category = response.data.category;
          vm.additionalRequirementModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.copyActive = angular.copy(vm.additionalRequirementModel.isActive);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.saveAdditionalRequirement = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddAdditionalRequirementForm)) {
        if (vm.additionalRequirementModel.id && !vm.checkFormDirty(vm.AddAdditionalRequirementForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.additionalRequirementModel);
        }
        return;
      }
      if (vm.AddAdditionalRequirementForm.$invalid) {
        BaseService.focusRequiredField(vm.AddAdditionalRequirementForm);
        return;
      }
      if (vm.additionalRequirementModel.id && vm.copyActive !== vm.additionalRequirementModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.additionalRequirementModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveTemplete(buttonCategory);
          }
        }, () => {
          // empty
        });
      } else { saveTemplete(buttonCategory); }
    };

    //save requirement templete
    const saveTemplete = (buttonCategory) => {
      vm.cgBusyLoading = RFQSettingFactory.additionalRequirement().save(vm.additionalRequirementModel).$promise.then((res) => {
        if (res.data) {
          if (res.data.id) {
            oldNameForHistory = vm.additionalRequirementModel.name;
            vm.saveAndProceed(buttonCategory, res.data);
          }
        } else {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddAdditionalRequirementForm);
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Manage Add Category Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddAdditionalRequirementForm.$setPristine();
        vm.additionalRequirementModel.id = data.id;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.AddAdditionalRequirementForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.AddAdditionalRequirementForm.$setPristine();
            vm.additionalRequirementModel = {};
            vm.additionalRequirementModel.isActive = true;
            setFocus('category');
          }, () => { // Empty block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.AddAdditionalRequirementForm.$setPristine();
          vm.additionalRequirementModel = {};
          vm.additionalRequirementModel.isActive = true;
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
      setFocus('category');
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddAdditionalRequirementForm);
      if (isdirty) {
        const data = {
          form: vm.AddAdditionalRequirementForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddAdditionalRequirementForm);
    });
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    //change category then need to check duplicate value
    vm.changecategory = () => {
      if (vm.additionalRequirementModel.name && vm.additionalRequirementModel.category) {
        vm.checkDuplicateTemplate(true);
      }
    };

    //Function call on name blur event and check name exist and ask for confirmation
    vm.checkDuplicateTemplate = (isCategory) => {
      if ((!isCategory && oldName !== vm.additionalRequirementModel.name) || isCategory) {
        if (vm.AddAdditionalRequirementForm && vm.AddAdditionalRequirementForm.additionalrequirementname.$dirty && vm.additionalRequirementModel.name) {
          vm.cgBusyLoading = RFQSettingFactory.checkDuplicateTemplate().query({
            id: vm.additionalRequirementModel.id,
            category: vm.additionalRequirementModel.category ? vm.additionalRequirementModel.category : null,
            name: vm.additionalRequirementModel.name
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldName = angular.copy(vm.additionalRequirementModel.name);
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.data && res.data.isDuplicateClassName) {
              displayTemplateNameUniqueMessage();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* display template name unique confirmation message */
    const displayTemplateNameUniqueMessage = () => {
      oldName = '';
      vm.additionalRequirementModel.name = null;
      let msg = '';
      switch (vm.additionalRequirementModel.category) {
        case vm.categoryArray[0].id:
          msg = vm.TempleteUniqueMSG.CUSTOMER_QUOTE_TEMPLATE;
          break;
        case vm.categoryArray[1].id:
          msg = vm.TempleteUniqueMSG.ASSEMBLY_QUOTE_TEMPLATE;
          break;
        case vm.categoryArray[2].id:
          msg = vm.TempleteUniqueMSG.NARRATIVE_MASTER_TEMPLATE;
          break;
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, msg);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocus('additionalrequirementname');
      }, () => { // Empty block
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Show History Popup */
    vm.openAdditionalRequirementHistory = (ev) => {
      const data = {
        id: vm.additionalRequirementModel.id,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.REQUIREMENT,
        EmptyMesssage: CORE.COMMON_HISTORY.REQUIREMENT.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: CORE.COMMON_HISTORY.REQUIREMENT.LABLE_NAME,
          value: oldNameForHistory,
          displayOrder: 1,
          labelLinkFn: vm.goToRequirementTemplateList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { // Empty Block
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto RFQ Requirement Template list page. */
    vm.goToRequirementTemplateList = () => BaseService.goToRequirementTemplateList();
  }
})();
