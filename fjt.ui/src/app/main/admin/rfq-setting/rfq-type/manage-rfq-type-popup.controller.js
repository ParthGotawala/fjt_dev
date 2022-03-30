(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageRfqTypesPopupController', ManageRfqTypesPopupController);
  /** @ngInject */
  function ManageRfqTypesPopupController($mdDialog, $timeout, data, CORE, RFQSettingFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.clickCancel = false;
    vm.initData = data ? data : {};
    vm.initData.isActive = true;
    vm.historyactionButtonName = `${CORE.COMMON_HISTORY.RFQTYPE.LABLE_NAME} History`;
    let oldRFQtypeName = data && data.name ? data.name : data && data.Name ? data.Name : null;
    vm.pageInit = (data) => {
      vm.rfqTypeModel = {
        id: data && data.id ? data.id : null,
        name: data && data.name ? data.name : data && data.Name ? data.Name : null,
        description: data && data.description ? data.description : null,
        termsandcondition: data && data.termsandcondition ? data.termsandcondition : null,
        isActive: data ? data.isActive : true
      };
      vm.copyActive = angular.copy(vm.rfqTypeModel.isActive);
    };
    vm.pageInit(vm.initData);

    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddRfqTypesForm.$setPristine();
        vm.pageInit(data);
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddRfqTypesForm);
        if (isdirty) {
          const data = {
            form: vm.AddRfqTypesForm
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
              vm.AddRfqTypesForm.$setPristine();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.pageInit();
          vm.AddRfqTypesForm.$setPristine();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocusByName('rfqtypename');
    };

    if (vm.rfqTypeModel.id) {
      vm.cgBusyLoading = RFQSettingFactory.retriveRfqType().query({
        id: vm.rfqTypeModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.pageInit(response.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.saveRfqType = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddRfqTypesForm)) {
        if (vm.rfqTypeModel.id && !vm.checkFormDirty(vm.AddRfqTypesForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      if (vm.AddRfqTypesForm.$invalid) {
        BaseService.focusRequiredField(vm.AddRfqTypesForm);
        return;
      }
      if (vm.rfqTypeModel.id && vm.copyActive !== vm.rfqTypeModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.rfqTypeModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveRfqType(buttonCategory);
          }
        }, () => {
        });
      } else { saveRfqType(buttonCategory); }
    };

    // save rfq type
    const saveRfqType = (buttonCategory) => {
      vm.cgBusyLoading = RFQSettingFactory.rfqType().save(vm.rfqTypeModel).$promise.then((res) => {
        if (res.data) {
          oldRFQtypeName = vm.rfqTypeModel.name;
          vm.saveAndProceed(buttonCategory, res.data);
        }
        if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors.data && res.errors.data.unique) {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              setFocus('rfqtypename');
            });
          }
          vm.rfqTypeModel.name = null;
          $timeout(() => {
            vm.clickCancel = false;
          }, 300);
        } else {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddRfqTypesForm);
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.checkUniqueRFQTypeName = (rfqType) => {
      $timeout(() => {
        if (!vm.clickCancel && rfqType) {
          const obj = {
            id: data ? data.id : null,
            name: rfqType
          };
          vm.cgBusyLoading = RFQSettingFactory.findSameRFQType().save(obj).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  setFocus('rfqtypename');
                });
              }
              vm.rfqTypeModel.name = null;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, 200);
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddRfqTypesForm);
      if (isdirty) {
        const data = {
          form: vm.AddRfqTypesForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
        $timeout(() => {
          vm.clickCancel = false;
        }, 300);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel(true);
      }
    };

    /* Show History Popup */
    vm.openRFQTypeHistoryPopup = (ev) => {
      const data = {
        id: vm.rfqTypeModel.id,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.RFQTYPE,
        EmptyMesssage: CORE.COMMON_HISTORY.RFQTYPE.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: CORE.COMMON_HISTORY.RFQTYPE.LABLE_NAME,
          value: oldRFQtypeName,
          displayOrder: 1,
          labelLinkFn: vm.goToRFQTypeList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => {}, (err) => BaseService.getErrorLog(err));
    };

    /* Goto RFQ Type list page. */
    vm.goToRFQTypeList = () => BaseService.goToRFQTypeList();

    vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

    vm.getMaxLengthValidation = (maxLength, enterTextLength, description) => {
      if (description) {
        vm.entertext = vm.htmlToPlaintext(description);
        return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
      } else {
        return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.AddRfqTypesForm];
      if (data && data.Name) {
        vm.AddRfqTypesForm.$setDirty();
      }
    });
  }
})();
