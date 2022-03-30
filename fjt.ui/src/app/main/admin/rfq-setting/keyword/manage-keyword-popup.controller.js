(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageKeywordPopupController', ManageKeywordPopupController);
  /** @ngInject */
  function ManageKeywordPopupController($mdDialog, $timeout, data, CORE, RFQSettingFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.taToolbar = CORE.Toolbar;
    vm.clickCancel = false;
    vm.historyactionButtonName = `${CORE.PageName.keywords} History`;
    let oldKeywordName = '';
    vm.keywordModel = {
      keyword: null,
      isActive: true
      //displayOrder: null,
    };
    if (data && data.id) {
      vm.keywordModel.id = data.id;
    }
    //retrive keyword detail base on id
    if (vm.keywordModel.id) {
      vm.cgBusyLoading = RFQSettingFactory.retriveKeyword().query({
        id: vm.keywordModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.keywordModel.keyword = response.data.keyword;
          oldKeywordName = angular.copy(response.data.keyword);
          vm.keywordModel.isActive = response.data.isActive;
          vm.copyActive = angular.copy(vm.keywordModel.isActive);
          //vm.keywordModel.displayOrder = response.data.displayOrder;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //save keyword details
    vm.saveKeyword = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddKeywordsForm)) {
        if (vm.keywordModel.id && !vm.checkFormDirty(vm.AddKeywordsForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide(vm.keywordModel);
        }
        return;
      }
      if (vm.AddKeywordsForm.$invalid) {// || !vm.checkFormDirty(vm.AddKeywordsForm)
        BaseService.focusRequiredField(vm.AddKeywordsForm);
        return;
      }
      if (vm.copyActive !== vm.keywordModel.isActive && vm.keywordModel.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.keywordModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveKeyword(buttonCategory);
          }
        }, () => {
          // empty
        });
      } else {
        saveKeyword(buttonCategory);
      }
    };
    //save keyword
    const saveKeyword = (buttonCategory) => {
      RFQSettingFactory.keyword().save(vm.keywordModel).$promise.then((res) => {
        if (res.data) {
          if (res.data.id) {
            oldKeywordName = vm.keywordModel.keyword;
            vm.saveAndProceed(buttonCategory, res.data);
          }
        }
        if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors.data.unique) {
          vm.keywordModel.keyword = null;

          $timeout(() => {
            vm.clickCancel = false;
          }, 300);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkUniqueKeyWord = (keyword) => {
      $timeout(() => {
        if (!vm.clickCancel && keyword) {
          const obj = {
            id: data ? data.id : null,
            keyword: keyword
          };
          vm.cgBusyLoading = RFQSettingFactory.findSameKeyWord().save(obj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              vm.keywordModel.keyword = null;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, 200);
    };

    /* Manage Add Category Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddKeywordsForm.$setPristine();
        vm.keywordModel.id = data.id;
        vm.copyActive = vm.keywordModel.isActive;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.AddKeywordsForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.AddKeywordsForm.$setPristine();
            vm.keywordModel = {};
            vm.keywordModel.isActive = true;
            setFocus('keyword');
          }, () => { // Empty Block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.AddKeywordsForm.$setPristine();
          vm.keywordModel = {};
          vm.keywordModel.isActive = true;
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
      setFocus('keyword');
    };

    //cancel changes and close popup
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddKeywordsForm);
      if (isdirty) {
        const data = {
          form: vm.AddKeywordsForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
        $timeout(() => {
          vm.clickCancel = false;
        }, 300);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* Show History Popup */
    vm.openKeywordHistoryPopup = (ev) => {
      const data = {
        id: vm.keywordModel.id,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.RFQ_LINEITEMS_KEYWORDS,
        EmptyMesssage: CORE.COMMON_HISTORY.KEYWORD.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: CORE.COMMON_HISTORY.KEYWORD.LABLE_NAME,
          value: oldKeywordName,
          displayOrder: 1,
          labelLinkFn: vm.goToKeywordList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { // Empty Block
        }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Keywords list page. */
    vm.goToKeywordList = () => BaseService.goToKeywordList();

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.AddKeywordsForm];
    });

    //check for form dirty based on enable/disable save button
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
  }
})();
