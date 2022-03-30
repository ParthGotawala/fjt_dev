(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageReasonPopupController', ManageReasonPopupController);
  /** @ngInject */
  function ManageReasonPopupController($mdDialog, $timeout, data, CORE, RFQSettingFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.Reason_Type = CORE.Reason_Type;
    vm.textAreaRows = CORE.TEXT_AREA_ROWS;
    vm.bomMaterialReasonId = CORE.Reason_Type.BOM.id;
    vm.clickCancel = false;

    vm.reasonModel = {
      reasonCategory: null,
      reason: null,
      isActive: true
    };

    const reasonId = data.reasonId ? parseInt(data.reasonId) : null;
    if (reasonId) {
      vm.reasonModel.reason_type = reasonId;
    }

    vm.selectedReasonType = _.find(vm.Reason_Type, (item) => parseInt(item.id) === reasonId);

    if (data && data.id) {
      vm.reasonModel.id = data.id;
    }
    if (vm.reasonModel.id) {
      vm.cgBusyLoading = RFQSettingFactory.retriveReason().query({
        id: vm.reasonModel.id,
        reason_type: vm.reasonModel.reason_type
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.reasonModel.reasonCategory = response.data.reasonCategory;
          vm.reasonModel.reason = response.data.reason;
          vm.reasonModel.isActive = response.data.isActive ? response.data.isActive : false;
          vm.copyActive = angular.copy(vm.reasonModel.isActive);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.saveReason = () => {
      if (BaseService.focusRequiredField(vm.AddReasonForm)) {
        return;
      }
      if (vm.AddReasonForm.$invalid) {
        BaseService.focusRequiredField(vm.AddReasonForm);
        return;
      }
      if (vm.reasonModel.id && vm.copyActive !== vm.reasonModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Enable' : 'Disable', vm.reasonModel.isActive ? 'Enable' : 'Disable');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveReason();
          }
        }, () => {
          // empty
        });
      } else { saveReason(); }
    };
    //save reason detail
    const saveReason = () => {
      if (vm.reasonModel.reason_type) {
        vm.cgBusyLoading = RFQSettingFactory.reason().save(vm.reasonModel).$promise.then((res) => {
          if (res.data) {
            if (res.data.id) {
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(res.data);
            }
          }
          if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.errors.unique) {
            vm.reasonModel.reasonCategory = null;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocus('reasoncategory');
              });
            }
            $timeout(() => {
              vm.clickCancel = false;
            }, 300);
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddReasonForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //Function call on standard blur event and check standard name exist and ask for confirmation
    vm.checkDuplicateCategory = () => {
      if (!vm.clickCancel) {
        if (vm.AddReasonForm && vm.AddReasonForm.reasoncategory.$dirty && vm.reasonModel.reasonCategory) {
          vm.cgBusyLoading = RFQSettingFactory.checkDuplicateResonCategory().query({
            id: vm.reasonModel.id,
            reason_type: vm.reasonModel.reason_type,
            reasonCategory: vm.reasonModel.reasonCategory
          }).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED && res.data && res.data.isDuplicateReason) {
              displayReasonNameUniqueMessage();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* display standard name unique confirmation message */
    const displayReasonNameUniqueMessage = () => {
      vm.reasonModel.reasonCategory = null;
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, vm.selectedReasonType.CategoryDisplayColumn);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then((yes) => {
        if (yes) {
          setFocus('reasoncategory');
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddReasonForm);
      if (isdirty) {
        const data = {
          form: vm.AddReasonForm
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

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    //vm.htmlToPlaintext = (text) => text ? String(text).replace(/<[^>]+>/gm, '') : '';

    ///* called for max length validation */
    //vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
    //  vm.entertext = vm.htmlToPlaintext(enterTextLength);
    //  return BaseService.getDescrLengthValidation(maxLength, enterTextLength.length);
    //};

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.AddReasonForm];
    });
  }
})();
